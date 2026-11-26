begin;

create table if not exists public.arlodjie_brand_logos (
  brand_key text primary key,
  brand text not null,
  src text not null
);

alter table public.arlodjie_brand_logos enable row level security;
revoke all on public.arlodjie_brand_logos from public, anon, authenticated;
grant select, insert, update on public.arlodjie_brand_logos to service_role;

commit;
