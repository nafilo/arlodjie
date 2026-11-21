begin;

create table if not exists public.arlodjie_products (
  id text primary key,
  data jsonb not null,
  created_at timestamptz not null default clock_timestamp()
);
create table if not exists public.arlodjie_orders (
  id uuid primary key,
  buyer uuid not null references auth.users(id),
  data jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists arlodjie_orders_buyer on public.arlodjie_orders(buyer, created_at desc);
create table if not exists public.arlodjie_banner (
  id integer primary key check (id = 1),
  data jsonb not null
);
alter table public.arlodjie_products enable row level security;
alter table public.arlodjie_orders enable row level security;
alter table public.arlodjie_banner enable row level security;
revoke all on public.arlodjie_products, public.arlodjie_orders, public.arlodjie_banner from public, anon, authenticated;
grant select, insert, update, delete on public.arlodjie_products, public.arlodjie_orders, public.arlodjie_banner to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('arlodjie-photos', 'arlodjie-photos', true, 3000000, array['image/webp'])
on conflict (id) do nothing;

create or replace function public.arlodjie_save_product(product_id text, details jsonb, expected_stock integer)
returns void language plpgsql set search_path = '' as $$
begin
  if expected_stock is null then
    insert into public.arlodjie_products (id, data)
    values (product_id, details || '{"sold":0,"rating":0,"reviews":0,"popularity":0,"publicReviews":[]}'::jsonb);
  else
    update public.arlodjie_products set data = data || details
      where id = product_id and (data->>'stock')::integer = expected_stock;
    if not found then
      raise sqlstate 'PT409' using message = 'Stok berubah. Muat ulang produk sebelum menyimpan.';
    end if;
  end if;
end;
$$;

create or replace function public.arlodjie_checkout(order_id uuid, buyer_id uuid, recipient text, address text, requested jsonb)
returns jsonb language plpgsql set search_path = '' as $$
declare
  line record;
  item jsonb;
  lines jsonb := '[]';
  total bigint := 0;
  result jsonb;
begin
  -- Serialize retries for this order ID before checking for an existing result.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(order_id::text, 0));
  select data into result from public.arlodjie_orders where id = order_id and buyer = buyer_id;
  if found then return result; end if;
  for line in
    select key as product_id, value::integer as qty from pg_catalog.jsonb_each_text(requested) order by key
  loop
    select data into item from public.arlodjie_products where id = line.product_id for update;
    if not found or line.qty < 1 or (item->>'stock')::integer < line.qty then
      raise sqlstate 'PT409' using message = 'Stok berubah. Periksa jumlah produk sebelum mencoba lagi.';
    end if;
    lines := lines || pg_catalog.jsonb_build_array(pg_catalog.jsonb_build_object(
      'id', line.product_id, 'qty', line.qty, 'name', item->>'name', 'img', item->>'img', 'price', (item->>'price')::bigint
    ));
    total := total + (item->>'price')::bigint * line.qty;
    update public.arlodjie_products
      set data = pg_catalog.jsonb_set(data, '{stock}', pg_catalog.to_jsonb((item->>'stock')::integer - line.qty))
      where id = line.product_id;
  end loop;
  result := pg_catalog.jsonb_build_object('id', order_id, 'createdAt', now(), 'name', recipient,
    'address', address, 'items', lines, 'total', total, 'index', 0, 'rated', '{}'::jsonb);
  insert into public.arlodjie_orders (id, buyer, data) values (order_id, buyer_id, result);
  return result;
end;
$$;

create or replace function public.arlodjie_advance(order_id uuid, actor uuid, is_admin boolean, expected integer)
returns jsonb language plpgsql set search_path = '' as $$
declare
  result jsonb;
  line jsonb;
begin
  select data into result from public.arlodjie_orders
    where id = order_id and ((is_admin and expected in (0, 1)) or (buyer = actor and expected = 2))
    for update;
  if not found then raise sqlstate 'PT404' using message = 'Pesanan tidak ditemukan.'; end if;
  if (result->>'index')::integer <> expected then
    raise sqlstate 'PT409' using message = 'Status pesanan sudah berubah. Muat ulang halaman.';
  end if;
  result := pg_catalog.jsonb_set(result, '{index}', pg_catalog.to_jsonb(expected + 1));
  if expected = 2 then
    for line in select value from pg_catalog.jsonb_array_elements(result->'items') order by value->>'id'
    loop
      update public.arlodjie_products set data = pg_catalog.jsonb_set(data, '{sold}',
        pg_catalog.to_jsonb((data->>'sold')::bigint + (line->>'qty')::integer)) where id = line->>'id';
    end loop;
  end if;
  update public.arlodjie_orders set data = result where id = order_id;
  return result;
end;
$$;

create or replace function public.arlodjie_review(order_id uuid, buyer_id uuid, product_id text, score integer, review_text text)
returns jsonb language plpgsql set search_path = '' as $$
declare
  result jsonb;
  item jsonb;
  prior integer;
  review_entry jsonb;
  entries jsonb;
  review_count integer;
  score_total bigint;
begin
  select data into result from public.arlodjie_orders where id = order_id and buyer = buyer_id for update;
  if not found or (result->>'index')::integer <> 3 or score not between 1 and 5
    or not exists (select 1 from pg_catalog.jsonb_array_elements(result->'items') line where line->>'id' = product_id) then
    raise sqlstate 'PT404' using message = 'Ulasan belum tersedia.';
  end if;
  select data into item from public.arlodjie_products where id = product_id for update;
  if not found then raise sqlstate 'PT404' using message = 'Produk tidak tersedia.'; end if;
  prior := (result->'rated'->product_id->>'score')::integer;
  review_count := (item->>'reviews')::integer + case when prior is null then 1 else 0 end;
  score_total := coalesce((item->>'scoreTotal')::bigint, 0) - coalesce(prior, 0) + score;
  review_entry := pg_catalog.jsonb_build_object('score', score, 'text', review_text);
  result := pg_catalog.jsonb_set(result, array['rated', product_id], review_entry);
  select coalesce(pg_catalog.jsonb_agg(value), '[]'::jsonb) into entries
    from pg_catalog.jsonb_array_elements(coalesce(item->'publicReviews','[]'::jsonb)) where value->>'order' <> order_id::text;
  entries := entries || pg_catalog.jsonb_build_array(review_entry || pg_catalog.jsonb_build_object('order', order_id));
  update public.arlodjie_products set data = data || pg_catalog.jsonb_build_object(
    'reviews', review_count, 'rating', score_total::numeric / review_count, 'scoreTotal', score_total, 'publicReviews', entries
  ) where id = product_id;
  update public.arlodjie_orders set data = result where id = order_id;
  return result;
end;
$$;

revoke execute on function public.arlodjie_save_product(text,jsonb,integer),
  public.arlodjie_checkout(uuid,uuid,text,text,jsonb), public.arlodjie_advance(uuid,uuid,boolean,integer),
  public.arlodjie_review(uuid,uuid,text,integer,text) from public, anon, authenticated;
grant execute on function public.arlodjie_save_product(text,jsonb,integer),
  public.arlodjie_checkout(uuid,uuid,text,text,jsonb), public.arlodjie_advance(uuid,uuid,boolean,integer),
  public.arlodjie_review(uuid,uuid,text,integer,text) to service_role;

insert into public.arlodjie_products (id, data) values
('srpe55', '{"id":"srpe55","brand":"Seiko","name":"5 Sports SRPE55","price":4500000,"img":"assets/srpe55.jpg","movement":"Automatic","size":"40 mm","caliber":"4R36","reference":"SRPE55","strap":"Stainless Steel","water":"10 ATM","style":"Sporty","color":"Hitam","caseMaterial":"Stainless Steel","crystal":"Hardlex","reserveHours":41,"features":["Day-Date Display","Hacking Seconds","Hand-winding"],"desc":"Jam automatic dengan dial hitam dan tampilan hari serta tanggal.","source":"https://www.seikowatches.com/es-es/products/5sports/srpe55","rating":0,"reviews":0,"sold":0,"popularity":0,"stock":5,"photos":[{"src":"assets/srpe55.jpg"}]}'::jsonb),
('alpinist', '{"id":"alpinist","brand":"Seiko","name":"Prospex Alpinist SPB121","price":11000000,"img":"assets/alpinist.png","movement":"Automatic","size":"39.5 mm","caliber":"6R35","reference":"SPB121","strap":"Leather","water":"20 ATM","style":"Field","color":"Hijau","caseMaterial":"Stainless Steel","crystal":"Sapphire","reserveHours":70,"features":["Compass Bezel","Screw-down Crown","Date Display"],"desc":"Field watch berdial hijau dengan rotating compass inner ring.","source":"https://teddybaldassarre.com/products/prospex-land-spb121","rating":0,"reviews":0,"sold":0,"popularity":0,"stock":5,"photos":[{"src":"assets/alpinist.png"}]}'::jsonb),
('f91w', '{"id":"f91w","brand":"Casio","name":"F-91W-1","price":250000,"img":"assets/f91w.jpg","movement":"Quartz","size":"35.2 mm","reference":"F-91W-1","strap":"Resin","water":"Water Resistant","style":"Casual","color":"Hitam","caseMaterial":"Resin","crystal":"Resin","batteryYears":7,"features":["Alarm","Stopwatch","LED / Backlight"],"desc":"Jam digital ringan dengan stopwatch, alarm, dan lampu LED.","source":"https://www.casio.com/intl/watches/casio/product.F-91W-1/","rating":0,"reviews":0,"sold":0,"popularity":0,"stock":5,"photos":[{"src":"assets/f91w.jpg"}]}'::jsonb),
('murph', '{"id":"murph","brand":"Hamilton","name":"Khaki Field Murph 38mm","price":15500000,"img":"assets/murph-front.jpg","photos":[{"src":"assets/murph-front.jpg"},{"src":"assets/murph.jpg"}],"movement":"Automatic","size":"38 mm","caliber":"H-10","reference":"H70405730","strap":"Leather","water":"10 ATM","style":"Field","color":"Hitam","caseMaterial":"Stainless Steel","crystal":"Sapphire","reserveHours":80,"features":["Luminous Hands/Markers","Exhibition Caseback"],"desc":"Field watch 38 mm dengan dial hitam dan jarum bergaya vintage.","source":"https://www.hamiltonwatch.com/en-us/h70405730-khaki-field-murph-38mm.html","rating":0,"reviews":0,"sold":0,"popularity":0,"stock":5}'::jsonb),
('shunbun', '{"id":"shunbun","brand":"Grand Seiko","name":"Shunbun SBGA413","price":115000000,"img":"assets/shunbun.png","photos":[{"src":"assets/shunbun.png"},{"src":"assets/shunbun-dial.jpg"}],"movement":"Spring Drive","size":"40 mm","caliber":"9R65","reference":"SBGA413","strap":"High-Intensity Titanium","water":"10 ATM","style":"Dress","color":"Merah muda","caseMaterial":"High-Intensity Titanium","crystal":"Box-shaped sapphire","reserveHours":72,"features":["Power Reserve Indicator","Screw-down Crown","Exhibition Caseback"],"desc":"Dial bertekstur terinspirasi kelopak sakura, dengan movement Spring Drive.","source":"https://www.grand-seiko.com/us-en/collections/sbga413g","rating":0,"reviews":0,"sold":0,"popularity":0,"stock":5}'::jsonb),
('prx', '{"id":"prx","brand":"Tissot","name":"PRX Powermatic 80","price":13000000,"img":"assets/prx.jpg","movement":"Automatic","size":"40 mm","reference":"T137.407.11.041.00","strap":"Stainless Steel","water":"10 ATM","style":"Sporty","color":"Biru","caseMaterial":"Stainless Steel","crystal":"Sapphire","reserveHours":80,"features":["Date Display"],"desc":"Jam automatic dengan gelang terintegrasi dan dial biru.","source":"https://www.tissotwatches.com/es-es/T1374071104100.html","rating":0,"reviews":0,"sold":0,"popularity":0,"stock":5,"photos":[{"src":"assets/prx.jpg"}]}'::jsonb),
('presage', '{"id":"presage","brand":"Seiko","name":"Presage Cocktail Time SRPB43","price":7000000,"img":"assets/presage.jpg","movement":"Automatic","size":"40.5 mm","caliber":"4R35","reference":"SRPB43","strap":"Leather","water":"5 ATM","style":"Dress","color":"Biru muda","caseMaterial":"Stainless Steel","crystal":"Hardlex","reserveHours":41,"features":["Date Display","Hacking Seconds","Hand-winding","Exhibition Caseback"],"desc":"Dress watch dengan dial sunburst dan kaca box-shaped Hardlex.","source":"https://www.seikowatches.com/in-en/products/presage/SRPB43J1","rating":0,"reviews":0,"sold":0,"popularity":0,"stock":5,"photos":[{"src":"assets/presage.jpg"}]}'::jsonb),
('gshock', '{"id":"gshock","brand":"G-SHOCK","name":"GW-M5610U-1","price":2200000,"img":"assets/gshock.png","movement":"Quartz","reference":"GW-M5610U-1","strap":"Resin","water":"20 ATM","style":"Sporty","color":"Hitam","caseMaterial":"Resin","crystal":"Mineral Crystal","features":["Shock Resistant","Solar Powered","Radio-controlled Timekeeping","World Time","Alarm","Stopwatch","Countdown Timer","LED / Backlight"],"desc":"Jam digital bertenaga surya dengan shock resistance dan radio-controlled timekeeping.","source":"https://www.casio.com/uk/watches/gshock/product.GW-M5610U-1/","rating":0,"reviews":0,"sold":0,"popularity":0,"stock":5,"photos":[{"src":"assets/gshock.png"}]}'::jsonb)
on conflict (id) do nothing;

commit;
