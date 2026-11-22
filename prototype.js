const $ = (selector) => document.querySelector(selector)
const art = {
  home: '<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-6h6v6"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  user: '<circle cx="12" cy="8" r="3.5"/><path d="M4 21v-1a8 8 0 0 1 16 0v1"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>',
  logout: '<path d="M10 4H5v16h5m5-12 4 4-4 4M9 12h10"/>',
  heart: '<path d="M20.8 5.8a5.2 5.2 0 0 0-7.4 0L12 7.2l-1.4-1.4a5.2 5.2 0 0 0-7.4 7.4L12 22l8.8-8.8a5.2 5.2 0 0 0 0-7.4Z"/>',
  cart: '<path d="M4 8h16l1 13H3L4 8Z"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  back: '<path d="m14 6-6 6 6 6"/>',
  pause: '<path d="M9 5v14m6-14v14"/>',
  play: '<path d="m8 5 11 7-11 7Z"/>',
  filter: '<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="2" fill="#fffdfa"/><circle cx="15" cy="17" r="2" fill="#fffdfa"/>',
  star: '<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/>',
}
const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${art[name]}</svg>`
const safe = (value) => String(value ?? '').replace(/[&<>"']/g, (part) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[part]))
const rupiah = (price) => 'Rp' + Number(price).toLocaleString('id-ID')
const photo = (name) => `assets/${name}.jpg`
const demo = [
  {
    "id": "srpe55",
    "brand": "Seiko",
    "name": "5 Sports SRPE55",
    "price": 4500000,
    "img": "assets/srpe55.jpg",
    "movement": "Automatic",
    "size": "40 mm",
    "caliber": "4R36",
    "reference": "SRPE55",
    "strap": "Stainless Steel",
    "water": "10 ATM",
    "style": "Sporty",
    "color": "Hitam",
    "caseMaterial": "Stainless Steel",
    "crystal": "Hardlex",
    "reserveHours": 41,
    "features": [
      "Day-Date Display",
      "Hacking Seconds",
      "Hand-winding"
    ],
    "desc": "Jam automatic dengan dial hitam dan tampilan hari serta tanggal.",
    "source": "https://www.seikowatches.com/es-es/products/5sports/srpe55"
  },
  {
    "id": "alpinist",
    "brand": "Seiko",
    "name": "Prospex Alpinist SPB121",
    "price": 11000000,
    "img": "assets/alpinist.png",
    "movement": "Automatic",
    "size": "39.5 mm",
    "caliber": "6R35",
    "reference": "SPB121",
    "strap": "Leather",
    "water": "20 ATM",
    "style": "Field",
    "color": "Hijau",
    "caseMaterial": "Stainless Steel",
    "crystal": "Sapphire",
    "reserveHours": 70,
    "features": [
      "Compass Bezel",
      "Screw-down Crown",
      "Date Display"
    ],
    "desc": "Field watch berdial hijau dengan rotating compass inner ring.",
    "source": "https://teddybaldassarre.com/products/prospex-land-spb121"
  },
  {
    "id": "f91w",
    "brand": "Casio",
    "name": "F-91W-1",
    "price": 250000,
    "img": "assets/f91w.jpg",
    "movement": "Quartz",
    "size": "35.2 mm",
    "reference": "F-91W-1",
    "strap": "Resin",
    "water": "Water Resistant",
    "style": "Casual",
    "color": "Hitam",
    "caseMaterial": "Resin",
    "crystal": "Resin",
    "batteryYears": 7,
    "features": [
      "Alarm",
      "Stopwatch",
      "LED / Backlight"
    ],
    "desc": "Jam digital ringan dengan stopwatch, alarm, dan lampu LED.",
    "source": "https://www.casio.com/intl/watches/casio/product.F-91W-1/"
  },
  {
    "id": "murph",
    "brand": "Hamilton",
    "name": "Khaki Field Murph 38mm",
    "price": 15500000,
    "img": "assets/murph-front.jpg",
    "photos": [{"src":"assets/murph-front.jpg"},{"src":"assets/murph.jpg"}],
    "movement": "Automatic",
    "size": "38 mm",
    "caliber": "H-10",
    "reference": "H70405730",
    "strap": "Leather",
    "water": "10 ATM",
    "style": "Field",
    "color": "Hitam",
    "caseMaterial": "Stainless Steel",
    "crystal": "Sapphire",
    "reserveHours": 80,
    "features": [
      "Luminous Hands/Markers",
      "Exhibition Caseback"
    ],
    "desc": "Field watch 38 mm dengan dial hitam dan jarum bergaya vintage.",
    "source": "https://www.hamiltonwatch.com/en-us/h70405730-khaki-field-murph-38mm.html"
  },
  {
    "id": "shunbun",
    "brand": "Grand Seiko",
    "name": "Shunbun SBGA413",
    "price": 115000000,
    "img": "assets/shunbun.png",
    "photos": [
      {
        "src": "assets/shunbun.png"
      },
      {
        "src": "assets/shunbun-dial.jpg"
      }
    ],
    "movement": "Spring Drive",
    "size": "40 mm",
    "caliber": "9R65",
    "reference": "SBGA413",
    "strap": "High-Intensity Titanium",
    "water": "10 ATM",
    "style": "Dress",
    "color": "Merah muda",
    "caseMaterial": "High-Intensity Titanium",
    "crystal": "Box-shaped sapphire",
    "reserveHours": 72,
    "features": [
      "Power Reserve Indicator",
      "Screw-down Crown",
      "Exhibition Caseback"
    ],
    "desc": "Dial bertekstur terinspirasi kelopak sakura, dengan movement Spring Drive.",
    "source": "https://www.grand-seiko.com/us-en/collections/sbga413g"
  },
  {
    "id": "prx",
    "brand": "Tissot",
    "name": "PRX Powermatic 80",
    "price": 13000000,
    "img": "assets/prx.jpg",
    "movement": "Automatic",
    "size": "40 mm",
    "reference": "T137.407.11.041.00",
    "strap": "Stainless Steel",
    "water": "10 ATM",
    "style": "Sporty",
    "color": "Biru",
    "caseMaterial": "Stainless Steel",
    "crystal": "Sapphire",
    "reserveHours": 80,
    "features": [
      "Date Display"
    ],
    "desc": "Jam automatic dengan gelang terintegrasi dan dial biru.",
    "source": "https://www.tissotwatches.com/es-es/T1374071104100.html"
  },
  {
    "id": "presage",
    "brand": "Seiko",
    "name": "Presage Cocktail Time SRPB43",
    "price": 7000000,
    "img": "assets/presage.jpg",
    "movement": "Automatic",
    "size": "40.5 mm",
    "caliber": "4R35",
    "reference": "SRPB43",
    "strap": "Leather",
    "water": "5 ATM",
    "style": "Dress",
    "color": "Biru muda",
    "caseMaterial": "Stainless Steel",
    "crystal": "Hardlex",
    "reserveHours": 41,
    "features": [
      "Date Display",
      "Hacking Seconds",
      "Hand-winding",
      "Exhibition Caseback"
    ],
    "desc": "Dress watch dengan dial sunburst dan kaca box-shaped Hardlex.",
    "source": "https://www.seikowatches.com/in-en/products/presage/SRPB43J1"
  },
  {
    "id": "gshock",
    "brand": "G-SHOCK",
    "name": "GW-M5610U-1",
    "price": 2200000,
    "img": "assets/gshock.png",
    "movement": "Quartz",
    "reference": "GW-M5610U-1",
    "strap": "Resin",
    "water": "20 ATM",
    "style": "Sporty",
    "color": "Hitam",
    "caseMaterial": "Resin",
    "crystal": "Mineral Crystal",
    "features": [
      "Shock Resistant",
      "Solar Powered",
      "Radio-controlled Timekeeping",
      "World Time",
      "Alarm",
      "Stopwatch",
      "Countdown Timer",
      "LED / Backlight"
    ],
    "desc": "Jam digital bertenaga surya dengan shock resistance dan radio-controlled timekeeping.",
    "source": "https://www.casio.com/uk/watches/gshock/product.GW-M5610U-1/"
  }
].map(item=>({...item,rating:0,reviews:0,sold:0,popularity:0,stock:5,photos:item.photos||[{src:item.img}]}))
const featureOptions=[
  'Compass Bezel','Rotating Bezel','Shock Resistant','Antimagnetic',
  'Luminous Hands/Markers','Date Display','Day-Date Display','Chronograph',
  'GMT','Dual Time','Screw-down Crown','Alarm','Stopwatch','Countdown Timer',
  'Solar Powered','Hacking Seconds','Hand-winding','Exhibition Caseback',
  'LED / Backlight','World Time','Perpetual Calendar','Bluetooth / Smartphone Link',
  'Digital Compass','Radio-controlled Timekeeping','Altimeter','Barometer',
  'Thermometer','Mud / Dust Resistant','Power Reserve Indicator',
]
const watchBrands=[
  'Breitling','Bulova','Cartier','Casio','Certina','Citizen','Frederique Constant',
  'G-SHOCK','Grand Seiko','Hamilton','Longines','Mido','Omega','Orient',
  'Orient Star','Oris','Rado','Rolex','Seiko','Swatch','TAG Heuer',
  'Timex','Tissot','Tudor','Victorinox',
]
const durationSpecs=[
  { movement:'Automatic', name:'reserveHours', label:'Power Reserve', unit:'hours' },
  { movement:'Quartz', name:'batteryYears', label:'Battery Life', unit:'years' },
]
const specFields=[
  ['Water Resistance','water',['3 ATM','5 ATM','10 ATM','20 ATM','30 ATM']],
  ['Style','style',['Dress','Diver','Sporty','Field','GMT','Pilot','Casual']],
  ['Dial Color','color'],
  ['Case Diameter','size'],
  ['Case Thickness','thickness'],
  ['Lug-to-Lug','lugToLug'],
  ['Lug Width','lugWidth'],
  ['Caliber / Movement Reference','caliber'],
  ['Reference Number','reference'],
  ['Case Material','caseMaterial',['Stainless Steel','Titanium','Resin','Brass','Ceramic']],
  ['Crystal','crystal',['Mineral Crystal','Sapphire','Acrylic','Hardlex']],
  ['Strap Material','strap',['Leather','Stainless Steel','Resin','Rubber','Nylon']],
  ['Movement','movement',[...durationSpecs.map(spec=>spec.movement),'Spring Drive']],
]
const specRows=[
  ...specFields.map(([label,name])=>[label,item=>item[name]]),
  ...durationSpecs.map(({movement,name,label,unit})=>[
    label,item=>(item.movement===movement||(name==='reserveHours'&&item.movement==='Spring Drive'))&&item[name]?`± ${Number(item[name]).toLocaleString('id-ID')} ${unit}`:'',
  ]),
  ['Features',item=>[...(item.features||[]),item.otherFeatures].filter(Boolean).join(', ')],
]
const state = { products:structuredClone(demo), favorites:new Set(), cart:{}, orders:[], get order(){return this.orders[0]}, query:'', sort:'sold', brands:[], min:'', max:'', stars:0, slide:0, playing:!matchMedia('(prefers-reduced-motion: reduce)').matches }
const profile = { name:'', email:'', photo:'' }
let shopUser = null
let shopReturn = 'akun'
const demoSessionKey = 'arlodjie.demo-session.v1'
let demoSignedIn = true
let catalogUnavailable = false
let orderListUnavailable = false
let adminOrderList = []
const browserKey = key => shopApi.enabled ? key+'.online.'+(shopUser?.id||'visitor') : key
const profileStorageKey = () => browserKey('arlodjie.profile.v1')
function loadProfile() {
  Object.assign(profile,{name:'',email:shopUser?.email||'',photo:''})
  try {
    const saved = JSON.parse(localStorage.getItem(profileStorageKey()))
    if (typeof saved?.name === 'string' && typeof saved.email === 'string') {
      profile.name = saved.name
      profile.email = saved.email
      if (/^data:image\/(webp|png|jpeg);base64,/.test(saved.photo)) profile.photo = saved.photo
    }
  } catch {
    // The storefront can still run if browser storage is blocked.
  }
}
let profilePhotoDraft = ''
let profilePhotoRevision = 0
const orderSteps = ['Menunggu konfirmasi pembayaran','Pembayaran dikonfirmasi','Dikirim','Selesai']
const orderDateFormat = new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'short',year:'numeric'})
const navItems = [['beranda','Beranda','home'],['katalog','Katalog','grid'],['akun','Akun','user']]
const product = (id) => state.products.find((item) => item.id === id)
const photosFor = (item) => item?.photos?.length ? item.photos : item?.img ? [{src:item.img}] : []
const photoSelections = new Map()
const photoLimit = 6
const photoTypes = ['image/jpeg','image/png','image/webp']
let draftPhotos = []
const draftUrls = new Set()
const draftFiles = new Map()
const photoKeyByUrl = new Map()
const urlByPhotoKey = new Map()
const commerceKey = () => browserKey('arlodjie.shop.v1')
let savedCommerceRecord = null

async function restoreCommerce(record) {
  const needed = new Set()
  const read = () => JSON.parse(record, (field,value) => {
    if ((field==='img'||field==='src') && typeof value==='string' && value.startsWith('upload:')) {
      if (!urlByPhotoKey.has(value)) needed.add(value)
      return urlByPhotoKey.get(value) || photo('leather')
    }
    return value
  })
  let saved=record?read():null
  if (needed.size) {
    const files=await savedPhotoFiles.get([...needed])
    for (const [key,file] of files) {
      const src=URL.createObjectURL(file)
      photoKeyByUrl.set(src,key)
      urlByPhotoKey.set(key,src)
    }
    saved=read()
  }
  state.products=saved?.products||structuredClone(demo)
  state.favorites=new Set(saved?.favorites||[])
  state.cart=saved?.cart||{}
  state.orders=saved?.orders||[]
  savedCommerceRecord=record
}

function saveCommerce() {
  const key=commerceKey()
  try {
    if(shopApi.enabled){
      localStorage.setItem(key,JSON.stringify({cart:state.cart,favorites:[...state.favorites]}))
      return true
    }
    const latest=localStorage.getItem(key)
    if(latest!==savedCommerceRecord){
      restoreCommerce(latest).then(()=>render())
      toast('Data toko berubah di tab lain. Periksa kembali sebelum mencoba lagi.')
      return false
    }
    const {products,cart,orders,favorites}=state
    const record=JSON.stringify({products,cart,orders,favorites:[...favorites]},(field,value)=>
      field==='img'||field==='src'?photoKeyByUrl.get(value)||value:value)
    localStorage.setItem(key,record)
    savedCommerceRecord=record
    return true
  } catch {
    if(!shopApi.enabled)restoreCommerce(savedCommerceRecord)
    toast('Penyimpanan browser penuh atau dibatasi. Perubahan belum tersimpan.')
    return false
  }
}
function loadBasket() {
  let saved = null
  try { saved = JSON.parse(localStorage.getItem(commerceKey())) } catch { /* Browser storage is optional. */ }
  state.cart=saved?.cart||{}
  state.favorites=new Set(saved?.favorites||[])
}
function reconcileBasket() {
  state.favorites=new Set([...state.favorites].filter(id=>product(id)))
  state.cart=Object.fromEntries(cartItems().filter(item=>item.stock&&Number.isSafeInteger(item.qty)&&item.qty>0)
    .map(item=>[item.id,Math.min(item.qty,cartLimit(item))]))
}
async function refreshCatalog() {
  state.products=await shopApi.request('products')
  catalogUnavailable=false
  reconcileBasket()
}
async function refreshOrders() {
  orderListUnavailable=false
  try {
    const [orders,admin]=await Promise.all([
      shopUser && !shopUser.admin ? shopApi.request('orders') : [],
      shopUser?.admin ? shopApi.request('orders?scope=admin') : [],
    ])
    state.orders=orders
    adminOrderList=admin
  } catch {
    orderListUnavailable=true
  }
}
function setShopUser(user) {
  shopUser=user
  state.orders=[]
  adminOrderList=[]
  loadProfile()
  loadBasket()
  if(!catalogUnavailable)reconcileBasket()
}
async function shopTask(control, task, message) {
  if(control.disabled)return
  control.disabled=true
  if(message)message.textContent=''
  try {
    await task()
  } catch(error) {
    if(error.status===401&&shopUser){
      const admin=shopUser.admin
      shopReturn=location.hash.slice(1)
      setShopUser(null)
      location.hash=admin?'admin/masuk':'masuk'
    } else if(error.status===409){
      await refreshCatalog().catch(()=>{})
      await refreshOrders()
      if(!control.form)render()
    }
    if(message)message.textContent=error.message
    else toast(error.message)
  } finally {
    control.disabled=false
  }
}
const canAdmin = () => !shopApi.enabled || shopUser?.admin
const link = (to, label, cls='btn') => `<a class="${cls}" href="#${to}">${label}</a>`
const action = (name, label, cls='btn', id='') => `<button type="button" class="${cls}" data-action="${name}" data-id="${safe(id)}">${label}</button>`
const heading = (title, desc='') => `<header class="heading"><h1>${title}</h1>${desc ? `<p>${desc}</p>` : ''}</header>`
const back = (to, label) => link(to,icon('back')+label,'back')
const empty = (title,desc,cta='') => `<section class="panel empty"><h2>${title}</h2><p>${desc}</p>${cta}</section>`
const img = (url, alt, cls='') => `<img class="${cls}" src="${safe(url)}" alt="${safe(alt)}">`
function rating(item) {
  const parts=[]
  if(item.reviews)parts.push(`<span>${icon('star')} <strong>${item.rating.toFixed(1).replace('.',',')}</strong> (${item.reviews})</span>`)
  if(item.sold)parts.push(`<span>${item.sold} terjual</span>`)
  return parts.length?`<span class="rating">${parts.join('<span aria-hidden="true">·</span>')}</span>`:''
}
const badge = (label) => `<span class="status">${label}</span>`

function photoLabel(picture,index,total) {
  return picture.closeup ? 'Detail foto' : `Foto ${index+1} dari ${total}`
}

function selectedPhotoIndex(item,pictures) {
  const index=photoSelections.get(item.id)
  return pictures[index]?index:0
}

function photoControls(item,pictures,selected,thumbnails=false) {
  if(pictures.length<2)return ''
  const controls=pictures.map((picture,index)=>`<button type="button" class="${thumbnails?'thumb':'photo-dot'}"
    data-action="gallery" data-id="${index}" aria-pressed="${index===selected}"
    aria-label="${photoLabel(picture,index,pictures.length)} · ${safe(item.name)}">
    ${thumbnails?img(picture.src,'',picture.closeup?'photo-closeup':''):''}</button>`).join('')
  return `<div class="${thumbnails?'photo-thumbs':'photo-dots'}" role="group" aria-label="Pilih foto ${safe(item.name)}">${controls}</div>`
}

function card(item) {
  const pictures=photosFor(item)
  const selected=selectedPhotoIndex(item,pictures)
  const picture=pictures[selected]
  return `<article class="card"><div class="card-media" data-gallery-product="${item.id}">
    <a href="#produk/${item.id}" aria-label="Lihat detail ${safe(item.name)}">${picture?img(picture.src,item.name,`gallery-photo ${picture.closeup?'photo-closeup':''}`):'<span>Foto belum tersedia</span>'}</a>
    <button class="icon-btn ${state.favorites.has(item.id)?'selected':''}" data-action="favorite" data-id="${item.id}" aria-label="Favorit ${safe(item.name)}" aria-pressed="${state.favorites.has(item.id)}">${icon('heart')}</button>
    ${photoControls(item,pictures,selected)}</div>
  <div class="card-body"><small class="card-brand">${safe(item.brand)}</small><h3><a href="#produk/${item.id}">${safe(item.name)}</a></h3>
    <p class="card-specs">${[item.movement,item.size].filter(Boolean).map(safe).join(' · ')}</p>
    <span class="fig">${rupiah(item.price)}</span>${rating(item)}${item.stock ? '' : badge('Stok habis')}</div></article>`
}
const grid = (items) => `<div class="grid">${items.map(card).join('')}</div>`

function hero() {
  return bannerManager.home()
}

function home() {
  const featuredIds = ['srpe55', 'f91w', 'presage', 'shunbun']
  const featured = featuredIds.map(product).filter(Boolean)
  const otherWatches = state.products.filter(item => !featuredIds.includes(item.id))
  const featuredWatches = [...featured, ...otherWatches].slice(0, 4)
  return `<section id="banner">${hero()}</section>
    <section class="featured-watches"><div class="shelf-heading"><h2>Jam pilihan</h2>${link('katalog','Lihat katalog'+icon('back'),'shelf-link')}</div>${grid(featuredWatches)}</section>
    <p class="catalog-note">Harga dan stok adalah data demo.</p>`
}

const sorters = {
  sold: ['Terjual terbanyak',(a,b)=>b.sold-a.sold],
  cheapest: ['Harga terendah',(a,b)=>a.price-b.price],
  priciest: ['Harga tertinggi',(a,b)=>b.price-a.price],
  newest: ['Terbaru',(a,b)=>state.products.indexOf(b)-state.products.indexOf(a)],
  oldest: ['Terlama',(a,b)=>state.products.indexOf(a)-state.products.indexOf(b)],
}
function catalogTags() {
  const tags=state.brands.map(brand=>['brand',brand,brand])
  if(state.min||state.max){
    const range=`${state.min?rupiah(state.min):'Rp0'} – ${state.max?rupiah(state.max):'Bebas'}`
    tags.push(['price',range])
  }
  if(state.stars)tags.push(['stars',`Minimal ${state.stars} bintang`])
  if(state.query)tags.push(['query',`“${state.query}”`])
  if(!tags.length)return ''
  return `<div class="catalog-tags" role="group" aria-label="Filter aktif">
    ${tags.map(([kind,label,value])=>`<button type="button" class="catalog-tag" data-action="remove-filter" data-id="${kind}" data-value="${safe(value)}" aria-label="Hapus filter ${safe(label)}"><span>${safe(label)}</span>${icon('close')}</button>`).join('')}
    ${action('reset','Reset filter','text-btn')}
  </div>`
}
function productList() {
  const terms=state.query.trim().split(/\s+/).map(brandKey).filter(Boolean)
  const items=state.products.filter((item)=>
    (!state.brands.length || state.brands.includes(item.brand)) &&
    (!state.min || item.price>=Number(state.min)) && (!state.max || item.price<=Number(state.max)) &&
    item.rating>=Number(state.stars) && terms.every(term=>brandKey([item.brand,item.name,item.reference,item.brand==='Grand Seiko'?'GS':''].join(' ')).includes(term))
  ).sort(sorters[state.sort][1])
  const hasFilters=Boolean(state.brands.length||state.min||state.max||state.stars)
  return `<header class="catalog-heading"><h1>Katalog jam</h1><span id="catalog-count">${items.length} produk</span></header>
  <div class="filters-bar"><button type="button" class="btn${hasFilters?' filter-active':''}" data-action="filter" aria-haspopup="dialog" aria-controls="sheet" aria-describedby="catalog-count">${icon('filter')}Filter</button>
    <label class="sort-control"><span>Urutkan</span><select id="sort" class="select" aria-label="Urutkan katalog">${Object.entries(sorters).map(([id,[name]])=>`<option value="${id}" ${id===state.sort?'selected':''}>${name}</option>`).join('')}</select></label>
  </div>
  ${catalogTags()}
  ${items.length?grid(items):empty('Jam tidak ditemukan','Coba kata pencarian lain atau ubah pilihan filter.',hasFilters||state.query?'':link('beranda','Kembali ke beranda'))}
  <p class="catalog-note">Harga dan stok adalah data demo.</p>`
}

function detail(item) {
  if(!item) return empty('Produk tidak ditemukan','Kembali ke katalog untuk melihat pilihan lain.',link('katalog','Katalog'))
  const specs=specRows.map(([label,read])=>[label,read(item)]).filter(([,value])=>value)
  const pictures=photosFor(item)
  const selected=selectedPhotoIndex(item,pictures)
  const picture=pictures[selected]
  const reviewEntries=shopApi.enabled?item.publicReviews||[]:state.orders.map(order=>order.rated?.[item.id]).filter(Boolean)
  return `${back('katalog','Katalog')}<div class="product-layout">
    <div class="product-identity">
      ${link('katalog/brand/'+encodeURIComponent(item.brand),safe(item.brand),'product-brand')}
      <h1 translate="no">${safe(item.name)}</h1>
      <p class="product-meta">${[item.movement,item.size].filter(Boolean).map(safe).join(' · ')}</p>
    </div>
    <div class="product-gallery" data-gallery-product="${item.id}">
      <div class="gallery-main">${picture?img(picture.src,`${item.name} · ${photoLabel(picture,selected,pictures.length)}`,`gallery-photo product-photo ${picture.closeup?'photo-closeup':''}`):'<span>Foto belum tersedia</span>'}</div>
      ${photoControls(item,pictures,selected,true)}
    </div>
    <div class="product-purchase">
      <div class="purchase-line"><strong class="big-price">${rupiah(item.price)}</strong><span class="stock-label">${item.stock?'Tersedia '+item.stock+' unit':'Stok habis'}</span></div>
      <div class="purchase-actions">
        ${item.stock?link('checkout/'+item.id,'Beli sekarang','btn primary')+action('cart','Tambah ke keranjang','btn',item.id):''}
        <button type="button" class="btn" aria-pressed="${state.favorites.has(item.id)}" data-action="favorite" data-id="${item.id}">${icon('heart')} ${state.favorites.has(item.id)?'Tersimpan':'Favorit'}</button>
      </div>
      <small>Harga dan stok demo.</small>
    </div>
    <div class="product-overview">
      ${item.desc?`<p class="product-description">${safe(item.desc)}</p>`:''}${rating(item)}
    </div>
  </div>
  ${specs.length?`<section class="product-specs" aria-labelledby="spec-title"><h2 id="spec-title">Spesifikasi</h2>
  <dl>${specs.map(([label,value])=>`<div><dt>${label}</dt><dd>${safe(value)}</dd></div>`).join('')}</dl></section>`:''}
  ${reviewEntries.length?`<section class="product-reviews" aria-labelledby="reviews-title"><h2 id="reviews-title">Ulasan pembeli</h2><ul>${reviewEntries.map(({score,text})=>`<li><strong aria-label="${score} dari 5 bintang">${icon('star')} ${score}/5</strong>${text?`<p>${safe(text)}</p>`:''}</li>`).join('')}</ul></section>`:''}`
}

const cartItems=()=>Object.entries(state.cart).map(([id,qty])=>({ ...product(id), qty }))
const cartLimit=item=>Math.min(item.stock,shopApi.enabled?50:item.stock)
const orderTotal=items=>items.reduce((sum,p)=>sum+p.price*p.qty,0)
const subtotal=()=>orderTotal(cartItems())
function checkoutItems(directId) {
  if(!directId)return cartItems()
  const item=product(directId)
  return item?[{...item,qty:1}]:[]
}
function cart() {
  const items=cartItems()
  return heading('Keranjang')+(items.length?`<div class="panel surface">${items.map(p=>`<div class="list-row"><div class="row">${img(p.img,p.name,'mini')}<div><a href="#produk/${p.id}"><strong>${safe(p.name)}</strong></a><br><small>${rupiah(p.price)}</small></div></div><div class="row"><input type="number" class="qty" data-qty="${p.id}" min="1" max="${cartLimit(p)}" value="${p.qty}" aria-label="Jumlah ${safe(p.name)}">${action('remove','Hapus','text-btn',p.id)}</div></div>`).join('')}<div class="row between"><strong data-cart-subtotal>Subtotal ${rupiah(subtotal())}</strong>${link('checkout','Checkout','btn primary')}</div></div>`:empty('Keranjang kosong','Tambahkan jam dari katalog.',link('katalog','Lihat katalog')))
}
const field = (label,name,attr='',type='text') => `<label class="field">${label}<input name="${name}" type="${type}" ${attr}></label>`
const area = (label,name,attr='') => `<label class="field">${label}<textarea name="${name}" ${attr}></textarea></label>`
const submit = (label) => `<button class="btn primary" type="submit">${label}</button>`
function setDemoSession(signedIn) {
  demoSignedIn=signedIn
  try {
    if(signedIn)localStorage.removeItem(demoSessionKey)
    else localStorage.setItem(demoSessionKey,'signed-out')
  } catch {
    // The demo session can still change in the current tab.
  }
}
function demoSignIn() {
  return `<div class="auth-shell">${heading('Sesi demo','Masuk untuk membuka kembali akun dan pesanan demo di browser ini.')}
    ${action('demo-sign-in','Masuk demo','btn primary')}</div>`
}
function checkout(directId) {
  const items=checkoutItems(directId)
  if(directId&&!items[0]?.stock){
    return back('katalog','Katalog')+empty('Produk tidak tersedia','Pilih jam lain dari katalog.',link('katalog','Lihat katalog'))
  }
  if(!items.length)return cart()
  if(shopApi.enabled&&!shopUser)return signIn()
  const returnLink=directId?back('produk/'+directId,'Detail produk'):back('keranjang','Keranjang')
  return returnLink+heading('Checkout')+`<form class="checkout-layout" data-form="checkout" data-product="${safe(directId||'')}">
    <section class="checkout-shipping"><h2>Pengiriman</h2>
      ${field('Nama penerima','name',`required maxlength="100" autocomplete="name" value="${safe(profile.name)}"`)}
      ${area('Alamat pengiriman','address','required maxlength="500" autocomplete="street-address" rows="3"')}
    </section>
    <section class="checkout-summary"><h2>Ringkasan pesanan</h2>${orderLines(items)}
      <div class="checkout-total"><span>Total</span><strong>${rupiah(orderTotal(items))}</strong></div>
      <p>Simulasi transfer bank. Pesanan diproses setelah admin mengonfirmasi pembayaran.</p>${submit('Buat pesanan')}
    </section></form>`
}
function orderLines(items) {
  return items.map(p=>`<div class="list-row"><span>${safe(p.name)} × ${p.qty}</span><span>${rupiah(p.price*p.qty)}</span></div>`).join('')
}
function steps(labels,index) {
  return `<ol class="steps" aria-label="Progres pesanan">${labels.map((label,i)=>`<li class="${i<index?'done':i===index?'current':'upcoming'}"${i===index?' aria-current="step"':''}>${label}</li>`).join('')}</ol>`
}
function orderDate(order) {
  if(!order.createdAt)return ''
  const date=new Date(order.createdAt)
  return Number.isFinite(date.getTime())
    ? `<time datetime="${date.toISOString()}">${orderDateFormat.format(date)}</time>`
    : ''
}
function orderCard(order) {
  const [first,...others]=order.items
  return `<li><a class="order-card" href="#detail-pesanan/${safe(order.id)}">
    <div class="order-card-head">
      <span class="order-card-meta"><strong>#${safe(order.id)}</strong>${orderDate(order)}</span>
      <span class="status" data-order-status="${order.index}">${orderSteps[order.index]}</span>
    </div>
    <div class="order-card-body">
      ${img(first.img,'','mini')}
      <span class="order-card-item"><strong>${safe(first.name)}${first.qty>1?' × '+first.qty:''}</strong>${others.length?`<small>+ ${others.length} produk lain</small>`:''}</span>
      <span class="order-card-total"><small>Total</small><strong>${rupiah(order.total)}</strong></span>
      <span class="go-detail" aria-hidden="true">${icon('back')}</span>
    </div>
  </a></li>`
}
function orders() {
  if(orderListUnavailable)return empty('Pesanan belum bisa dimuat','Coba muat ulang halaman saat online.')
  return heading('Riwayat Pesanan')+(state.orders.length?`<ul class="order-history surface">${state.orders.map(orderCard).join('')}</ul>`:empty('Belum ada pesanan','Pesananmu akan tampil di sini.',link('katalog','Belanja')))
}
const findOrder = id=>id?state.orders.find(o=>o.id===id):state.order
function orderDetail() {
  const order=findOrder(location.hash.split('/')[1])
  if(!order)return empty('Pesanan tidak ditemukan','Lihat daftar pesananmu untuk memilih pesanan.',link('pesanan','Riwayat Pesanan'))
  return back('pesanan','Riwayat Pesanan')+heading('Pesanan #'+safe(order.id),orderDate(order))+`<div class="stack surface"><section class="panel stack">${steps(orderSteps,order.index)}</section><section class="panel stack"><h2>Rincian pesanan</h2>${order.items.map(p=>`<div class="list-row"><div class="row">${img(p.img,p.name,'mini')}<div><strong>${safe(p.name)} × ${p.qty}</strong><br><small>${rupiah(p.price*p.qty)}</small></div></div>${order.index===3&&product(p.id)?link('ulasan/'+p.id+'/'+order.id,order.rated[p.id]?'Edit ulasan':'Beri rating','text-btn'):''}</div>`).join('')}<strong>Total ${rupiah(order.total)}</strong></section><section class="panel stack"><h2>Pengiriman</h2><strong>${safe(order.name)}</strong><p>${safe(order.address)}</p></section>${order.index===2?action('receive','Pesanan diterima','btn primary',order.id):''}</div>`
}
function review(id) {
  const order=findOrder(location.hash.split('/')[2])
  const item=product(id)
  if(!item||order?.index!==3||!order.items.some(p=>p.id===id))return empty('Ulasan belum tersedia','Kamu bisa mengulas jam setelah menerima pesanannya.',link('pesanan','Riwayat Pesanan'))
  const existing=order.rated[id]
  return back('detail-pesanan/'+order.id,'Detail pesanan')+heading(existing?'Edit ulasan':'Beri rating',safe(item.name))+`
    <form class="panel form" data-form="review" data-id="${id}" data-order="${order.id}">
      <fieldset class="star-rating">
        <legend>Bintang</legend>
        <div class="star-rating-options">${[1,2,3,4,5].map(n=>`
          <label><input required type="radio" name="stars" value="${n}" aria-label="${n} bintang" ${existing?.score===n?'checked':''}>${icon('star')}</label>
        `).join('')}</div>
      </fieldset>
      <label class="field">Ulasan<textarea name="review" maxlength="500">${safe(existing?.text||'')}</textarea></label>
      ${submit('Simpan ulasan')}
    </form>`
}

function account() {
  if(shopApi.enabled&&!shopUser)return signIn()
  if(!shopApi.enabled&&!demoSignedIn)return demoSignIn()
  const name=profile.name||'Pengunjung'
  const orderCount=state.orders.length
  return `<div class="account-layout">${heading('Akun Saya')}
    <section class="account-profile panel" aria-label="Profil">
      <div class="account-avatar" aria-hidden="true">${profileAvatar(profile.photo)}</div>
      <div class="account-identity">
        <h2>${safe(name)}</h2>
        ${profile.email?`<p>${safe(profile.email)}</p>`:''}
      </div>
      ${link('profil','Edit profil','btn primary')}
    </section>
    <div class="account-menus">
      <nav class="account-menu panel" aria-label="Belanja">
        <a href="#pesanan" class="account-link"><span class="account-icon">${icon('cart')}</span><span><strong>Riwayat Pesanan</strong><small>${orderCount?`${orderCount} pesanan`:'Belum ada pesanan'}</small></span><span class="account-chevron" aria-hidden="true">${icon('back')}</span></a>
        <a href="#favorit" class="account-link"><span class="account-icon">${icon('heart')}</span><span><strong>Favorit</strong><small>${state.favorites.size} jam tersimpan</small></span><span class="account-chevron" aria-hidden="true">${icon('back')}</span></a>
      </nav>
      ${!shopApi.enabled?`<nav class="account-menu panel" aria-label="Toko">
        <a href="#admin" class="account-link"><span class="account-icon">${icon('grid')}</span><span><strong>Panel admin</strong><small>Akses demo</small></span><span class="account-chevron" aria-hidden="true">${icon('back')}</span></a>
      </nav>`:''}
    </div>
    ${action('sign-out',icon('logout')+'Keluar dari akun','btn account-sign-out')}
  </div>`
}
function signIn(portal='buyer', status='') {
  const admin=portal==='admin'
  const notices={
    'email-terverifikasi':'Email sudah dikonfirmasi. Masuk dengan kata sandimu.',
    'periksa-email':'Buka tautan konfirmasi terbaru di email sebelum masuk.',
  }
  return `<div class="auth-shell">${heading(admin?'Masuk admin':'Masuk ke Arlodjie',admin?
    'Kelola katalog, banner, dan pesanan toko.':'Masuk untuk membuat pesanan dan melihat riwayat belanja.')}
  ${!admin&&Object.hasOwn(notices,status)?`<p class="auth-notice" role="status">${notices[status]}</p>`:''}
  <form class="panel form auth-form" data-form="sign-in" data-portal="${portal}">
    ${field('Email','email','required maxlength="254" autocomplete="username"','email')}
    ${field('Kata sandi','password','required maxlength="256" autocomplete="current-password"','password')}
    <p class="auth-error" data-auth-message role="alert"></p>
    ${submit('Masuk')}
  </form>
  <div class="auth-links">${admin?link('masuk','Masuk sebagai pembeli','text-btn'):
    `${link('daftar','Buat akun pembeli','text-btn')}${link('admin/masuk','Masuk sebagai admin','text-btn')}`}</div></div>`
}
function register(status) {
  if(shopUser)return account()
  return `<div class="auth-shell">${heading(status==='cek-email'?'Cek email kamu':'Buat akun pembeli')}
    ${status==='cek-email'?'<p class="panel">Buka tautan konfirmasi yang dikirim Supabase ke email pendaftaran. Setelah itu, masuk ke Arlodjie. Cek folder Spam jika email belum terlihat.</p>':
      `<form class="panel form auth-form" data-form="register">
        ${field('Email','email','required maxlength="254" autocomplete="username"','email')}
        ${field('Kata sandi','password','required minlength="8" maxlength="72" autocomplete="new-password" aria-describedby="password-help"','password')}
        <p id="password-help">Gunakan minimal 8 karakter.</p>
        <p class="auth-error" data-auth-message role="alert"></p>
        ${submit('Buat akun')}
      </form>`}
    <div class="auth-links">${link('masuk','Masuk ke akun','text-btn')}</div></div>`
}
function profileAvatar(photo) {
  if(photo)return img(photo,'')
  const initials=profile.name.split(/\s+/).slice(0,2).map(part=>Array.from(part)[0]).join('').toUpperCase()
  return initials?safe(initials):icon('user')
}
function editProfile() {
  profilePhotoDraft=profile.photo
  return `<div class="profile-editor">
    ${back('akun','Akun Saya')}${heading('Edit profil')}
    <form class="panel profile-form" data-form="profile">
      <section class="profile-photo-editor" aria-labelledby="profile-photo-title">
        <div class="account-avatar profile-photo-preview" aria-hidden="true">${profileAvatar(profile.photo)}</div>
        <div class="profile-photo-details">
          <h2 id="profile-photo-title">Foto profil</h2>
          <p id="profile-photo-help">JPG, PNG, atau WebP hingga 5 MB.</p>
          <div class="profile-photo-actions">
            <label class="btn photo-picker"><span data-photo-picker-label>${profile.photo?'Ganti foto profil':'Unggah foto profil'}</span><input type="file" name="profilePhoto" accept="${photoTypes.join(',')}" aria-describedby="profile-photo-help profile-photo-feedback"></label>
            <button class="text-btn" type="button" data-action="remove-profile-photo"${profile.photo?'':' hidden'}>Hapus foto</button>
          </div>
          <p id="profile-photo-feedback" role="status"></p>
        </div>
      </section>
      <div class="profile-fields">
        ${field('Nama','name',`required maxlength="80" autocomplete="name" value="${safe(profile.name)}"`)}
        ${field('Email (opsional)','email',`maxlength="254" autocomplete="email" value="${safe(profile.email)}"`,'email')}
      </div>
      <div class="profile-footer">
        <a href="#akun" class="btn">Batal</a>
        ${submit('Simpan profil')}
      </div>
    </form>
  </div>`
}
function updateProfilePhoto(form,message='',invalid=false) {
  form.querySelector('.profile-photo-preview').innerHTML=profileAvatar(profilePhotoDraft)
  form.querySelector('[data-photo-picker-label]').textContent=profilePhotoDraft?'Ganti foto profil':'Unggah foto profil'
  form.querySelector('[data-action="remove-profile-photo"]').hidden=!profilePhotoDraft
  const feedback=form.querySelector('#profile-photo-feedback')
  feedback.textContent=message
  feedback.classList.toggle('profile-photo-error',invalid)
}
async function selectProfilePhoto(form,file) {
  const revision = ++profilePhotoRevision
  const save = form.querySelector('[type="submit"]')
  save.disabled = false
  if (!photoTypes.includes(file.type) || !file.size || file.size > 5 * 1024 * 1024) {
    updateProfilePhoto(form,'Pilih foto JPG, PNG, atau WebP hingga 5 MB.',true)
    return
  }
  save.disabled = true
  updateProfilePhoto(form,'Menyiapkan foto…')
  try {
    const photo = await preparePhoto(file,{maxSize:384,square:true})
    if (!form.isConnected || revision !== profilePhotoRevision) return
    profilePhotoDraft = photo
    updateProfilePhoto(form,'Foto siap disimpan.')
  } catch {
    if (form.isConnected && revision === profilePhotoRevision)
      updateProfilePhoto(form,'Foto tidak bisa dibuka. Pilih foto lain.',true)
  } finally {
    if (revision === profilePhotoRevision) save.disabled = false
  }
}
function adminShell(section,content) {
  const sections=[['admin','Produk'],['admin/pesanan','Pesanan'],['admin/banner','Banner beranda']]
  const title=shopApi.enabled?heading('Panel admin'):`<div class="row between">${heading('Panel admin')}
    ${action('sign-out',icon('logout')+'Keluar','btn account-sign-out')}</div>`
  return title+`<div class="dashboard"><nav class="side panel" aria-label="Kelola toko">${sections.map(([url,label])=>`<a href="#${url}" ${section===url?'class="active" aria-current="page"':''}>${label}</a>`).join('')}</nav><section class="panel stack admin-content">${content}</section></div>`
}
function adminProducts() {
  const rows=state.products.map(p=>`<a class="inventory-row" href="#admin/edit/${p.id}" aria-label="Edit ${safe(p.brand)} ${safe(p.name)}">
    ${img(p.img,'','mini')}<span class="inventory-model"><small>${safe(p.brand)}</small><strong>${safe(p.name)}</strong></span>
    <span class="inventory-price">${rupiah(p.price)}</span>
    <span class="inventory-stock">${p.stock?'Stok '+p.stock:'Habis'}</span>
    <span class="go-detail" aria-hidden="true">${icon('back')}</span></a>`).join('')
  return adminShell('admin',`<div class="row between inventory-heading"><h2>Produk</h2>${link('admin/tambah','Tambah produk','btn primary')}</div>${rows?`<div class="inventory">${rows}</div>`:'<p>Belum ada produk di katalog.</p>'}`)
}

function adminPhotoPreviews() {
  return draftPhotos.map((picture,index)=>`<div class="admin-photo">
    <div class="admin-photo-image">${img(picture.src,`Foto ${index+1}`,picture.closeup?'photo-closeup':'')}</div>
    ${index===0?'<span class="status">Sampul</span>':`<button type="button" class="text-btn" data-action="cover-photo" data-id="${index}" aria-label="Jadikan foto ${index+1} sampul">Jadikan sampul</button>`}
    <button type="button" class="text-btn" data-action="remove-photo" data-id="${index}" aria-label="Hapus foto ${index+1}">Hapus</button>
  </div>`).join('')
}

function adminForm(item) {
  draftPhotos=[...photosFor(item)]
  const value = (key) => ` value="${safe(item?.[key]??'')}"`
  const controls=specFields.map(([label,name,options])=>{
    if(['size','thickness','lugToLug','lugWidth'].includes(name))return `<label class="field">${label}<span class="input-unit"><input name="${name}" type="number" min="0.1" step="any" inputmode="decimal" value="${safe(parseFloat(item?.[name])||'')}"><span>mm</span></span></label>`
    if(!options)return field(label,name,value(name))
    const selected=item?.[name]??''
    const choices=new Set([...options,...(selected?[selected]:[])])
    return `<label class="field">${label}<select name="${name}">
      <option value="">Pilih</option>
      ${[...choices].map(option=>`<option${option===selected?' selected':''}>${safe(option)}</option>`).join('')}
    </select></label>`
  }).join('')
  const durationControls=durationSpecs.map(({movement,name,label,unit})=>{
    const active=item?.movement===movement||(movement==='Automatic'&&item?.movement==='Spring Drive')
    return `<div data-duration="${movement}"${active?'':' hidden'}>
      ${field(`${label} (${unit})`,name,`min="0.1" step="any"${value(name)}${active?'':' disabled'}`,'number')}
    </div>`
  }).join('')
  return adminShell('admin',`<h2>${item?'Edit produk':'Tambah produk'}</h2>
    <form class="form product-form" data-form="product" data-id="${item?.id||''}">
      <div class="product-fields">
        ${field('Nama model','name','required'+value('name'))}
        <label class="field brand-field">Brand
          <input name="brand" required autocomplete="off" role="combobox" aria-autocomplete="list" aria-controls="brand-suggestions" aria-expanded="false"${value('brand')}>
          <span id="brand-suggestions" class="brand-suggestions" role="listbox" hidden></span>
        </label>
        ${field('Harga dalam rupiah','price',`data-price inputmode="numeric" pattern="[0-9.]+" required value="${item?.price?Number(item.price).toLocaleString('id-ID'):''}"`)}
        ${field('Stok','stock','min="0" required'+value('stock'),'number')}
      </div>
      <fieldset class="product-fieldset photo-upload">
        <legend>Foto produk</legend>
        <label class="btn photo-picker">Tambah foto
          <input type="file" name="photos" accept="${photoTypes.join(',')}" multiple aria-describedby="photo-guide">
        </label>
        <small id="photo-guide">Maks. ${photoLimit} foto. JPG, PNG, atau WebP hingga 5 MB per foto.</small>
        <div id="upload-preview" class="admin-photos">${adminPhotoPreviews()}</div>
      </fieldset>
      <label class="field">Deskripsi singkat<textarea name="desc" rows="2">${safe(item?.desc||'')}</textarea></label>
      <details class="product-options">
        <summary>Spesifikasi</summary>
        <div class="product-fields">${controls}${durationControls}</div>
      </details>
      <details class="product-options">
        <summary>Features</summary>
        <div class="feature-options">
          ${[...featureOptions,...(item?.features||[]).filter(option=>!featureOptions.includes(option))].map(option=>`<label><input type="checkbox" name="features" value="${safe(option)}"${item?.features?.includes(option)?' checked':''}>${safe(option)}</label>`).join('')}
        </div>
        <label class="field other-features">Other Features
          <input name="otherFeatures" type="text" maxlength="200" placeholder="Contoh: Moonphase" ${value('otherFeatures')}>
        </label>
      </details>
      <div class="product-form-footer">
        ${item?action('ask-delete-product','Hapus produk','btn danger-outline',item.id):''}
        ${link('admin','Batal','btn')}${submit(item?'Simpan produk':'Terbitkan produk')}
      </div>
    </form>`)
}
function adminOrders() {
  const orders=shopApi.enabled?adminOrderList:state.orders
  return adminShell('admin/pesanan',`<h2>Pesanan</h2>${orderListUnavailable?'<p>Pesanan belum bisa dimuat. Coba muat ulang halaman saat online.</p>':orders.length?orders.map(o=>`<section class="admin-order stack"><div class="row between"><h3>Pesanan #${safe(o.id)}</h3>${badge(orderSteps[o.index])}</div><div><strong>${safe(o.name)}</strong><p>${safe(o.address)}</p></div>${orderLines(o.items)}<strong>Total ${rupiah(o.total)}</strong>${o.index<2?action('order-next',o.index===0?'Konfirmasi pembayaran':'Tandai dikirim','btn primary',o.id):''}</section>`).join(''):'<p>Belum ada pesanan.</p>'}`)
}
function about() {
  return heading('About Us')+`<article class="about-store">
    <div class="about-logo"><img src="lockup.svg" alt="Arlodjie" width="130" height="48"></div>
    <div class="about-copy">
      <p><strong>Arlodjie</strong> adalah toko jam tangan online dengan koleksi dari berbagai merek, mulai dari model entry-level hingga jam mewah.</p>
      <p>Temukan tool watch seperti field watch untuk aktivitas luar ruang, jam digital untuk sehari-hari, dan dress watch yang melengkapi gaya berpakaian.</p>
      ${link('katalog','Jelajahi katalog','btn')}
      <p class="about-note">Harga, stok, dan transaksi di situs ini bersifat simulasi.</p>
    </div>
  </article>`
}

let active = ''
function missingPage(title,route,label) {
  return heading(title)+link(route,label,'btn')
}
function adminPage(section,id) {
  if(shopApi.enabled&&!shopUser)return signIn('admin')
  if(!canAdmin())return empty('Akses khusus admin','Keluar dari akun pembeli untuk masuk sebagai admin.',link('akun','Akun Saya'))
  if(!section||section==='masuk')return adminProducts()
  if(section==='tambah')return adminForm()
  if(section==='pesanan')return adminOrders()
  if(section==='banner')return bannerManager.admin()
  if(section==='edit' && product(id))return adminForm(product(id))
  return missingPage('Halaman admin tidak ditemukan','admin','Kembali ke produk')
}
function render(scroll=false) {
  const [page='beranda',id,sub] = (location.hash.slice(1)||'beranda').split('/')
  if(shopApi.enabled&&shopUser?.admin&&(page!=='admin'||id==='masuk')){
    location.replace('#admin')
    return
  }
  for(const url of draftUrls)URL.revokeObjectURL(url)
  draftUrls.clear()
  draftFiles.clear()
  draftPhotos=[]
  if(page==='katalog'&&active!==location.hash) {
    if(id==='budget'){state.min='';state.max='2000000';state.brands=[];state.query='';state.stars=0}
    if(id==='brand'){
      let brand=''
      try { brand=decodeURIComponent(sub||'') } catch { /* Invalid shared link. */ }
      state.brands=brand?[brand]:[];state.min='';state.max='';state.query='';state.stars=0
    }
  }
  active=location.hash
  const adminArea=shopApi.enabled&&page==='admin'&&(!shopUser||shopUser.admin)
  document.body.classList.toggle('admin-area',adminArea)
  $('.wordmark').href=adminArea?(shopUser?'#admin':'#admin/masuk'):'#beranda'
  $('#admin-actions').hidden=!shopUser?.admin
  $('#search input').value=state.query
  const views={beranda:home,katalog:productList,produk:()=>detail(product(id)),keranjang:cart,checkout:()=>checkout(id),pesanan:orders,'detail-pesanan':orderDetail,ulasan:()=>review(id),akun:account,profil:editProfile,tentang:about,admin:()=>adminPage(id,sub),masuk:()=>!shopApi.enabled||shopUser?account():signIn('buyer',id),daftar:()=>shopApi.enabled?register(id):missingPage('Pendaftaran tersedia di versi online','akun','Akun Saya'),favorit:()=>heading('Favorit')+(state.favorites.size?grid([...state.favorites].map(product).filter(Boolean)):empty('Belum ada favorit','Simpan jam lewat ikon hati.',link('katalog','Lihat katalog')))}
  const main=$('#main')
  const signedIn=shopApi.enabled?Boolean(shopUser):demoSignedIn
  const privatePage=['pesanan','detail-pesanan','ulasan','profil','checkout'].includes(page)
    || !shopApi.enabled&&page==='admin'
  const needsLogin=!signedIn&&privatePage
  if(needsLogin)shopReturn=location.hash.slice(1)
  main.innerHTML=needsLogin?(shopApi.enabled?signIn():demoSignIn()):
    Object.hasOwn(views,page)?views[page]():missingPage('Halaman tidak ditemukan','beranda','Kembali ke beranda')
  if(catalogUnavailable&&['beranda','katalog','produk','checkout'].includes(page))
    main.insertAdjacentHTML('afterbegin','<p class="panel" role="status">Katalog belum bisa dimuat. Periksa koneksi lalu muat ulang halaman.</p>')
  const title=page==='beranda'?'Toko Jam Tangan':main.querySelector('h1,h2')?.textContent||'Toko Jam Tangan'
  document.title=title+' · Arlodjie'
  const tab=page==='produk'?'katalog':['profil','pesanan','detail-pesanan','ulasan','favorit','admin','masuk','daftar'].includes(page)?'akun':page
  $('#nav').innerHTML=navItems.map(([to,label,svg])=>`<a class="nav-link${to==='akun'?' mobile-account':''}${tab===to?' active':''}" href="#${to}" ${tab===to?'aria-current="page"':''}>${icon(svg)}${label}</a>`).join('')
  const accountLink=$('#account-link')
  const guest=!signedIn
  accountLink.href=guest?'#masuk':'#akun'
  accountLink.innerHTML=icon('user')+`<span>${guest?(shopApi.enabled?'Masuk atau daftar':'Masuk demo'):'Akun Saya'}</span>`
  if(tab==='akun')accountLink.setAttribute('aria-current','page')
  else accountLink.removeAttribute('aria-current')
  if(page==='tentang')$('#footer-about').setAttribute('aria-current','page')
  else $('#footer-about').removeAttribute('aria-current')
  const count=cartItems().reduce((sum,p)=>sum+p.qty,0)
  count?$('#cart-link').setAttribute('data-count',count):$('#cart-link').removeAttribute('data-count')
  if(scroll){
    if($('#sheet').open)$('#sheet').close()
    main.focus({preventScroll:true})
    window.scrollTo(0,0)
  }
  bannerManager.schedule()
}
function toast(message) {
  $('#toast').textContent=message
  window.clearTimeout(toast.timer)
  toast.timer=window.setTimeout(()=>{$('#toast').textContent=''},2400)
}
function filterPriceError(form,input,message='') {
  form.querySelector('#filter-price-error').textContent=message
  for(const name of ['min','max'])form.elements[name].removeAttribute('aria-invalid')
  if(input){
    input.setAttribute('aria-invalid','true')
    input.focus()
  }
}
function showFilter() {
  const brands=[...new Set([...watchBrands,...state.products.map(p=>p.brand)])].sort((a,b)=>a.localeCompare(b,'id',{sensitivity:'base'}))
  const countBrand=brand=>state.products.filter(product=>product.brand===brand).length
  $('#sheet').setAttribute('aria-labelledby','filter-title')
  $('#sheet').innerHTML=`<form class="filter-form" data-form="filters">
    <div class="filter-header"><h2 id="filter-title">Filter katalog</h2>${action('close','Tutup','text-btn')}</div>
    <div class="filter-content">
      <label class="field">Urutkan berdasarkan<select name="sort" aria-label="Urutkan berdasarkan">${Object.entries(sorters).map(([id,[name]])=>`<option value="${id}"${id===state.sort?' selected':''}>${name}</option>`).join('')}</select></label>
      <fieldset class="filter-section"><legend>Brand</legend>
        <label class="field"><span class="sr-only">Cari brand</span><input type="search" name="brandSearch" placeholder="Cari brand" autocomplete="off"></label>
        <div class="filter-brands">${brands.map(brand=>`<label class="filter-brand" data-brand-filter="${safe(brand.toLowerCase())}"><input name="brand" type="checkbox" value="${safe(brand)}" ${state.brands.includes(brand)?'checked':''}><span>${safe(brand)}</span><small aria-hidden="true">${countBrand(brand)}</small></label>`).join('')}</div>
        <p class="filter-brand-hint">Angka menunjukkan jumlah produk dalam katalog.</p>
        <p class="filter-no-brands" hidden>Brand tidak ditemukan.</p>
      </fieldset>
      <fieldset class="filter-section"><legend>Rentang harga</legend><div class="filter-prices">
        ${field('Harga minimum','min',`data-price inputmode="numeric" pattern="[0-9.]+" placeholder="Rp0" aria-describedby="filter-price-error" value="${state.min?Number(state.min).toLocaleString('id-ID'):''}"`)}
        ${field('Harga maksimum','max',`data-price inputmode="numeric" pattern="[0-9.]+" placeholder="Tanpa batas" aria-describedby="filter-price-error" value="${state.max?Number(state.max).toLocaleString('id-ID'):''}"`)}
      </div><p id="filter-price-error" class="filter-price-error" role="alert"></p></fieldset>
      <label class="field">Bintang minimum<select name="stars">${[0,1,2,3,4,5].map(n=>`<option value="${n}" ${n===Number(state.stars)?'selected':''}>${n?`${n}★ ke atas`:'Semua rating'}</option>`).join('')}</select></label>
    </div>
    <div class="filter-footer">${action('reset','Reset filter','btn')}${submit('Terapkan filter')}</div>
  </form>`
  $('#sheet').showModal()
}

function confirmProductDeletion(item) {
  if(!item)return
  const sheet=$('#sheet')
  sheet.setAttribute('aria-labelledby','delete-product-title')
  sheet.innerHTML=`<div class="stack">
    <h2 id="delete-product-title">Hapus produk?</h2>
    <p><strong>${safe(item.brand)} ${safe(item.name)}</strong> akan dihapus dari katalog, favorit, dan keranjang.</p>
    <div class="row delete-product-actions">
      <button class="btn" type="button" data-action="close" autofocus>Batal</button>
      ${action('delete-product','Hapus produk','btn danger-primary',item.id)}
    </div>
  </div>`
  sheet.showModal()
}

$('#search-btn').innerHTML=icon('search')
$('#favorite-link').innerHTML=icon('heart')
$('#cart-link').innerHTML=icon('cart')
$('#footer-about').innerHTML=icon('info')+'<span>About Us</span>'
$('#admin-sign-out').innerHTML=icon('logout')+'Keluar'
$('#search').addEventListener('submit',(e)=>{
  e.preventDefault()
  Object.assign(state,{brands:[],min:'',max:'',stars:0,query:new FormData(e.currentTarget).get('q').trim()})
  if(location.hash==='#katalog')render()
  else location.hash='katalog'
})
window.addEventListener('hashchange',async()=>{
  const route=location.hash
  if(shopApi.enabled&&shopUser&&/^#(?:pesanan|detail-pesanan\/|ulasan\/|admin\/pesanan)/.test(route)){
    await refreshOrders()
    if(location.hash!==route)return
  }
  render(true)
})
const brandKey = value => value.toLowerCase().replace(/[\s-]/g,'')
function suggestedBrands() {
  const brands = new Map()
  for (const brand of [...watchBrands,...state.products.map(item=>item.brand)]) {
    const key = brandKey(brand)
    if (key && !brands.has(key)) brands.set(key,brand)
  }
  return brands
}
function showBrands(input) {
  const query=brandKey(input.value)
  const matches=query?[...suggestedBrands()]
    .filter(([key])=>key.startsWith(query))
    .map(([,brand])=>brand)
    .sort((a,b)=>a.localeCompare(b,'id',{sensitivity:'base'})):[]
  const list=$('#brand-suggestions')
  list.innerHTML=matches.map((brand,index)=>`<span role="option" id="brand-option-${index}" data-brand="${safe(brand)}" aria-selected="false">${safe(brand)}</span>`).join('')
  list.hidden=!matches.length
  input.setAttribute('aria-expanded',String(Boolean(matches.length)))
  input.removeAttribute('aria-activedescendant')
}
function chooseBrand(input,option) {
  input.value=option.dataset.brand
  $('#brand-suggestions').hidden=true
  input.setAttribute('aria-expanded','false')
  input.removeAttribute('aria-activedescendant')
}
document.addEventListener('keydown',(e)=>{
  const input=e.target
  if(input.name!=='brand'||input.form?.dataset.form!=='product')return
  const list=$('#brand-suggestions')
  if(e.key==='Escape'){list.hidden=true;input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');return}
  if(list.hidden)return
  const options=[...list.querySelectorAll('[role="option"]')]
  const selected=options.findIndex(option=>option.getAttribute('aria-selected')==='true')
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){
    e.preventDefault()
    const index=e.key==='ArrowDown'?Math.min(selected+1,options.length-1):selected<0?options.length-1:Math.max(selected-1,0)
    options.forEach((option,i)=>option.setAttribute('aria-selected',String(i===index)))
    input.setAttribute('aria-activedescendant',options[index].id)
    options[index].scrollIntoView({block:'nearest'})
  }
  if((e.key==='Enter'||e.key==='Tab')&&(selected>=0||options.length===1)){
    if(e.key==='Enter')e.preventDefault()
    chooseBrand(input,options[Math.max(0,selected)])
  }
})
document.addEventListener('pointerdown',(e)=>{
  const option=e.target.closest('#brand-suggestions [role="option"]')
  if(option){e.preventDefault();chooseBrand(document.querySelector('input[name="brand"]'),option)}
  else if(!e.target.closest('.brand-field')){
    const input=document.querySelector('.brand-field input')
    if(input){$('#brand-suggestions').hidden=true;input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant')}
  }
})
document.addEventListener('focusout',(e)=>{
  if(e.target.matches('.brand-field input')){
    $('#brand-suggestions').hidden=true
    e.target.setAttribute('aria-expanded','false')
    e.target.removeAttribute('aria-activedescendant')
  }
})
document.addEventListener('input',(e)=>{
  const input=e.target
  if(input.name==='brandSearch'&&input.form?.dataset.form==='filters'){
    const query=brandKey(input.value.trim())
    const rows=[...input.form.querySelectorAll('[data-brand-filter]')]
    rows.forEach(row=>{row.hidden=!brandKey(row.dataset.brandFilter).includes(query)})
    input.form.querySelector('.filter-no-brands').hidden=rows.some(row=>!row.hidden)
    return
  }
  if(input.name==='brand'&&input.form?.dataset.form==='product'){showBrands(input);return}
  if(!input.matches('[data-price]'))return
  if(input.form?.dataset.form==='filters')filterPriceError(input.form)
  const before=input.value.slice(0,input.selectionStart).replace(/\D/g,'').length
  const digits=input.value.replace(/\D/g,'')
  input.value=digits.replace(/\B(?=(\d{3})+(?!\d))/g,'.')
  let position=0
  let count=0
  while(position<input.value.length&&count<before){
    if(/\d/.test(input.value[position]))count++
    position++
  }
  input.setSelectionRange(position,position)
})
document.addEventListener('change',(e)=>{
  const t=e.target
  if(t.name==='profilePhoto'&&t.form?.dataset.form==='profile'){
    const file=t.files?.[0]
    t.value=''
    if(!file)return
    selectProfilePhoto(t.form,file)
    return
  }
  if(t.id==='sort'){state.sort=t.value;render();$('#sort')?.focus({preventScroll:true})}
  if(t.dataset.qty){
    const stock=cartLimit(product(t.dataset.qty))
    const qty=Math.max(1,Math.min(stock,Math.trunc(Number(t.value))||1))
    if(stock)state.cart[t.dataset.qty]=qty
    else delete state.cart[t.dataset.qty]
    if(!saveCommerce()||!stock){render();return}
    if(String(qty)!==t.value)toast(`Jumlah disesuaikan menjadi ${qty}.`)
    t.value=qty
    $('[data-cart-subtotal]').textContent='Subtotal '+rupiah(subtotal())
    $('#cart-link').setAttribute('data-count',cartItems().reduce((sum,p)=>sum+p.qty,0))
  }
  if(t.name==='movement'&&t.form?.dataset.form==='product'){
    for(const control of t.form.querySelectorAll('[data-duration]')){
      const visible=control.dataset.duration===t.value||(control.dataset.duration==='Automatic'&&t.value==='Spring Drive')
      control.hidden=!visible
      control.querySelector('input').disabled=!visible
    }
  }
  if(t.name==='photos'&&t.form?.dataset.form==='product'){
    const files=[...t.files]
    t.value=''
    if(draftPhotos.length+files.length>photoLimit){toast(`Maksimal ${photoLimit} foto per produk.`);return}
    if(files.some(file=>!photoTypes.includes(file.type)||!file.size||file.size>5*1024*1024)){
      toast('Pilih foto JPG, PNG, atau WebP hingga 5 MB per foto.');return
    }
    for(const file of files){
      const src=URL.createObjectURL(file)
      draftUrls.add(src)
      draftFiles.set(src,file)
      draftPhotos.push({src})
    }
    $('#upload-preview').innerHTML=adminPhotoPreviews()
  }
})
document.addEventListener('click',(e)=>{
  const trigger=e.target.closest('[data-action]')
  if(!trigger)return
  const {action:name,id}=trigger.dataset
  if(name==='demo-sign-in'&&!shopApi.enabled){
    setDemoSession(true)
    const destination=shopReturn
    shopReturn='akun'
    if(location.hash==='#'+destination)render(true)
    else location.hash=destination
    return
  }
  if(name==='sign-out'){
    if(!shopApi.enabled){
      setDemoSession(false)
      shopReturn='akun'
      location.hash='masuk'
      return
    }
    shopTask(trigger,async()=>{
      const admin=shopUser?.admin
      await shopApi.request('session','DELETE')
      setShopUser(null)
      shopReturn='akun'
      const destination=admin?'#admin/masuk':'#masuk'
      if(location.hash===destination)render(true)
      else location.hash=destination
    })
    return
  }
  if(name==='remove-profile-photo'){
    profilePhotoRevision++
    trigger.form.querySelector('[type="submit"]').disabled=false
    profilePhotoDraft=''
    updateProfilePhoto(trigger.form,profile.photo?'Foto akan dihapus saat profil disimpan.':'')
    trigger.form.querySelector('[name="profilePhoto"]').focus()
    return
  }
  if(name==='filter'){showFilter();return}
  if(name==='close'){$('#sheet').close();return}
  if(name==='ask-delete-product'){confirmProductDeletion(product(id));return}
  if(name==='delete-product'){
    $('#sheet').close()
    if(!product(id))return
    if(shopApi.enabled){
      shopTask(trigger,async()=>{
        await shopApi.request('products?id='+encodeURIComponent(id),'DELETE')
        state.products=state.products.filter(item=>item.id!==id)
        reconcileBasket()
        saveCommerce()
        photoSelections.delete(id)
        location.hash='admin'
        toast('Produk dihapus dari katalog.')
      })
      return
    }
    state.products=state.products.filter(item=>item.id!==id)
    state.favorites.delete(id)
    delete state.cart[id]
    if(saveCommerce()){
      photoSelections.delete(id)
      location.hash='admin'
      toast('Produk dihapus dari katalog.')
    }
    return
  }
  if(name==='gallery'){
    const gallery=trigger.closest('[data-gallery-product]')
    const item=product(gallery.dataset.galleryProduct)
    const pictures=photosFor(item)
    const index=Number(id)
    const picture=pictures[index]
    const image=gallery.querySelector('.gallery-photo')
    photoSelections.set(item.id,index)
    image.src=picture.src
    image.alt=`${item.name} · ${photoLabel(picture,index,pictures.length)}`
    image.classList.toggle('photo-closeup',Boolean(picture.closeup))
    gallery.querySelectorAll('[data-action="gallery"]').forEach(button=>button.setAttribute('aria-pressed',button===trigger))
    return
  }
  if(name==='cover-photo'||name==='remove-photo'){
    const [picture]=draftPhotos.splice(Number(id),1)
    if(name==='cover-photo')draftPhotos.unshift(picture)
    else if(draftUrls.delete(picture.src)){draftFiles.delete(picture.src);URL.revokeObjectURL(picture.src)}
    $('#upload-preview').innerHTML=adminPhotoPreviews()
    const nextIndex=Math.min(Number(id),draftPhotos.length-1)
    const nextControl=$(`#upload-preview button[data-id="${name==='cover-photo'?0:nextIndex}"]`)
    const focusTarget=nextControl||$('input[name="photos"]')
    focusTarget.focus()
    return
  }
  if(name==='favorite'){
    const item=product(id)
    if(state.favorites.has(id)){state.favorites.delete(id);if(!shopApi.enabled)item.popularity-=1}
    else {state.favorites.add(id);if(!shopApi.enabled)item.popularity+=1}
    toast(state.favorites.has(id)?'Jam disimpan ke favorit.':'Jam dihapus dari favorit.')
  }
  if(name==='cart'){
    const item=product(id)
    if((state.cart[id]||0)>=cartLimit(item)){toast('Jumlah mencapai batas pesanan atau stok yang tersedia.');return}
    state.cart[id]=(state.cart[id]||0)+1
    toast('Jam ditambahkan ke keranjang.')
  }
  if(name==='remove')delete state.cart[id]
  if(name==='remove-filter'){
    if(id==='brand')state.brands=state.brands.filter(brand=>brand!==trigger.dataset.value)
    if(id==='price'){state.min='';state.max=''}
    if(id==='stars')state.stars=0
    if(id==='query')state.query=''
    render()
    $('[data-action="filter"]')?.focus({preventScroll:true})
    return
  }
  if(name==='reset'){
    Object.assign(state,{brands:[],min:'',max:'',stars:0,query:''})
    $('#search input').value=''
    if($('#sheet').open)$('#sheet').close()
    render()
    $('[data-action="filter"]')?.focus({preventScroll:true})
    return
  }
  if(shopApi.enabled&&['order-next','receive'].includes(name)){
    const order=name==='order-next'?adminOrderList.find(item=>item.id===id):findOrder(id)
    if(!order)return
    shopTask(trigger,async()=>{
      const updated=await shopApi.request('orders','PATCH',{id,expected:order.index})
      const replace=orders=>orders.map(item=>item.id===id?updated:item)
      state.orders=replace(state.orders)
      adminOrderList=replace(adminOrderList)
      if(name==='receive')await refreshCatalog().catch(()=>{})
      render()
    })
    return
  }
  const order=findOrder(id)
  if(name==='order-next'&&order?.index<2)order.index+=1
  if(name==='receive'&&order?.index===2){
    order.index=3
    for(const {id,qty} of order.items){
      const item=product(id)
      if(item)item.sold+=qty
    }
  }
  if(['favorite','cart','remove','order-next','receive'].includes(name))saveCommerce()
  render()
  if(['cart','favorite','remove','order-next','receive'].includes(name)){
    const selector=`[data-action="${name}"]`
    const next=document.querySelector(selector+`[data-id="${CSS.escape(id)}"]`)||document.querySelector(selector)||$('#main')
    next.focus({preventScroll:true})
  }
})

document.addEventListener('submit',async(e)=>{
  const form=e.target
  const type=form.dataset.form
  if(!type)return
  e.preventDefault()
  const data=new FormData(form)
  const value=Object.fromEntries(data)
  if(type==='register'){
    if(!shopApi.enabled||shopUser)return
    shopTask(form.querySelector('[type="submit"]'),async()=>{
      await shopApi.request('register','POST',{email:value.email.trim(),password:value.password})
      if(form.isConnected)location.hash='daftar/cek-email'
    },form.querySelector('[data-auth-message]'))
    return
  }
  if(type==='sign-in'){
    if(!shopApi.enabled||shopUser)return
    shopTask(form.querySelector('[type="submit"]'),async()=>{
      const portal=form.dataset.portal
      const route=location.hash.slice(1)
      const {user}=await shopApi.request('session','POST',{email:value.email.trim(),password:value.password,portal})
      if(user.admin){
        setShopUser(user)
      } else {
        const guestKey=commerceKey()
        const guestCart=state.cart
        const guestFavorites=state.favorites
        setShopUser(user)
        for(const [id,qty] of Object.entries(guestCart))state.cart[id]=Math.max(state.cart[id]||0,qty)
        for(const id of guestFavorites)state.favorites.add(id)
        if(!catalogUnavailable)reconcileBasket()
        if(saveCommerce()){
          try {localStorage.removeItem(guestKey)} catch { /* Guest items may remain in browser storage. */ }
        }
      }
      await refreshOrders()
      const destination=user.admin?(route.startsWith('admin/')&&route!=='admin/masuk'?route:'admin'):shopReturn
      shopReturn='akun'
      if(location.hash==='#'+destination)render(true)
      else location.hash=destination
    },form.querySelector('[data-auth-message]'))
    return
  }
  if(type==='profile'){
    const name=value.name.trim()
    if(!name){form.elements.name.setCustomValidity('Masukkan nama.');form.elements.name.reportValidity();form.elements.name.setCustomValidity('');return}
    if(form.querySelector('[type="submit"]').disabled)return
    const nextProfile={name,email:value.email.trim(),photo:profilePhotoDraft}
    try {
      localStorage.setItem(profileStorageKey(),JSON.stringify(nextProfile))
    } catch {
      toast('Profil belum tersimpan. Periksa ruang penyimpanan atau izin browser.')
      return
    }
    Object.assign(profile,nextProfile)
    location.hash='akun'
    toast('Profil tersimpan.')
  }
  if(type==='filters'){
    const minValue=value.min.replace(/\D/g,'')
    const maxValue=value.max.replace(/\D/g,'')
    for(const [name,amount] of [['min',minValue],['max',maxValue]]){
      if(amount&&!Number.isSafeInteger(Number(amount))){
        filterPriceError(form,form.elements[name],'Masukkan harga yang lebih kecil.')
        return
      }
    }
    if(maxValue && Number(maxValue)<Number(minValue)){
      filterPriceError(form,form.elements.max,'Harga maksimum harus sama dengan atau lebih besar dari harga minimum.')
      return
    }
    Object.assign(state,{brands:data.getAll('brand'),min:minValue,max:maxValue,stars:Number(value.stars),sort:value.sort})
    $('#sheet').close();render()
    $('[data-action="filter"]')?.focus({preventScroll:true})
  }
  if(type==='checkout'){
    const directId=form.dataset.product
    const items=checkoutItems(directId)
    if(directId&&!items[0]?.stock){
      render()
      $('#main').focus({preventScroll:true})
      return
    }
    if(!items.length)return
    for(const key of ['name','address']){
      value[key]=value[key].trim()
      if(!value[key]){
        const input=form.elements[key]
        input.setCustomValidity(key==='name'?'Masukkan nama penerima.':'Masukkan alamat pengiriman.')
        input.reportValidity();input.setCustomValidity('');return
      }
    }
    if(shopApi.enabled){
      shopTask(form.querySelector('[type="submit"]'),async()=>{
        form.dataset.requestId||=crypto.randomUUID()
        const order=await shopApi.request('orders','POST',{
          id:form.dataset.requestId,
          name:value.name,address:value.address,items:Object.fromEntries(items.map(item=>[item.id,item.qty])),
        })
        if(!directId)for(const item of order.items)delete state.cart[item.id]
        state.orders=[order,...state.orders.filter(item=>item.id!==order.id)]
        for(const line of order.items){
          const item=product(line.id)
          if(item)item.stock=Math.max(0,item.stock-line.qty)
        }
        reconcileBasket()
        saveCommerce()
        location.hash='detail-pesanan/'+order.id
      })
      return
    }
    for(const item of items){
      if(!Number.isSafeInteger(item.qty)||item.qty<1||item.qty>item.stock){
        if(item.stock)state.cart[item.id]=Math.min(item.stock,Math.max(1,Math.trunc(item.qty)||1))
        else delete state.cart[item.id]
        if(saveCommerce()){location.hash='keranjang';toast('Stok berubah. Periksa jumlah jam di keranjang.')}
        return
      }
    }
    const id='ARL-'+String(state.orders.length+1).padStart(3,'0')
    const purchased=items.map(({id,name,img,price,qty})=>({id,name,img,price,qty}))
    state.orders.unshift({id,createdAt:new Date().toISOString(),name:value.name,address:value.address,index:0,items:purchased,total:orderTotal(items),rated:{}})
    for(const p of items)product(p.id).stock-=p.qty
    if(!directId)state.cart={}
    else if(state.cart[directId]>product(directId).stock){
      const stock=product(directId).stock
      if(stock)state.cart[directId]=stock
      else delete state.cart[directId]
    }
    if(saveCommerce())location.hash='detail-pesanan/'+id
  }
  if(type==='review'){
    const order=findOrder(form.dataset.order)
    const item=product(form.dataset.id)
    if(order?.index!==3||!item||!order.items.some(p=>p.id===item.id))return
    const previous=order.rated[item.id]
    const score=Number(value.stars)
    if(!Number.isInteger(score)||score<1||score>5)return
    if(shopApi.enabled){
      shopTask(form.querySelector('[type="submit"]'),async()=>{
        const updated=await shopApi.request('review','PUT',{order:order.id,product:item.id,score,text:value.review.trim()})
        state.orders=state.orders.map(entry=>entry.id===order.id?updated:entry)
        await refreshCatalog().catch(()=>{})
        location.hash='detail-pesanan/'+order.id
        toast('Ulasan tersimpan.')
      })
      return
    }
    const total=item.rating*item.reviews-(previous?.score||0)+score
    if(!previous)item.reviews+=1
    item.rating=total/item.reviews
    order.rated[item.id]={score,text:value.review.trim()}
    if(saveCommerce()){location.hash='detail-pesanan/'+order.id;toast('Ulasan tersimpan.')}
  }
  if(type==='product'){
    if(form.dataset.saving)return
    const item=product(form.dataset.id)
    const { photos:uploads, features, reserveHours, batteryYears, ...details }=value
    for(const key of ['name','brand']){
      details[key]=details[key].trim()
      if(!details[key]){
        const input=form.elements[key]
        input.setCustomValidity(key==='name'?'Masukkan nama model.':'Masukkan brand.')
        input.reportValidity();input.setCustomValidity('');return
      }
    }
    const price=Number(details.price.replace(/\D/g,''))
    if(!Number.isSafeInteger(price)||price<1){
      form.elements.price.setCustomValidity('Masukkan harga yang valid.')
      form.elements.price.reportValidity()
      form.elements.price.setCustomValidity('')
      return
    }
    const stock=Number(details.stock)
    if(!Number.isSafeInteger(stock)||stock<0){toast('Masukkan stok dalam bilangan bulat.');return}
    if(!draftPhotos.length){
      toast('Tambahkan minimal satu foto jam untuk sampul katalog.')
      form.elements.photos.focus();return
    }
    const pictures=[...draftPhotos]
    const newFiles=pictures.filter(p=>draftFiles.has(p.src)&&!photoKeyByUrl.has(p.src))
    if(newFiles.length&&!shopApi.enabled){
      const button=form.querySelector('[type="submit"]')
      form.dataset.saving='true'
      form.inert=true
      const label=button.textContent
      button.textContent='Menyimpan foto…'
      try{
        const entries=newFiles.map(p=>['upload:'+crypto.randomUUID(),draftFiles.get(p.src)])
        await Promise.all(newFiles.map(p=>{const image=new Image();image.src=p.src;return image.decode()}))
        await savedPhotoFiles.put(entries)
        if(!form.isConnected)return
        entries.forEach(([key],i)=>{
          photoKeyByUrl.set(newFiles[i].src,key)
          urlByPhotoKey.set(key,newFiles[i].src)
        })
      }catch{
        if(form.isConnected)toast('Foto gagal disimpan. Periksa berkas foto dan ruang penyimpanan browser.')
        return
      }finally{
        delete form.dataset.saving
        form.inert=false
        button.textContent=label
      }
    }
    const fields={
      ...details,
      brand:suggestedBrands().get(brandKey(details.brand))||details.brand,
      desc:details.desc.trim(),
      otherFeatures:details.otherFeatures.trim(),
      color:details.color.trim(),
      size:details.size?`${details.size} mm`:'',
      thickness:details.thickness?`${details.thickness} mm`:'',
      lugToLug:details.lugToLug?`${details.lugToLug} mm`:'',
      lugWidth:details.lugWidth?`${details.lugWidth} mm`:'',
      price,
      stock,
      reserveHours:['Automatic','Spring Drive'].includes(details.movement)&&reserveHours?Number(reserveHours):null,
      batteryYears:details.movement==='Quartz'&&batteryYears?Number(batteryYears):null,
      features:data.getAll('features'),
      img:pictures[0].src,
      photos:pictures,
    }
    if(shopApi.enabled){
      shopTask(form.querySelector('[type="submit"]'),async()=>{
        form.inert=true
        try {
          for(const picture of pictures){
            if(draftFiles.has(picture.src))picture.src=await shopApi.upload(draftFiles.get(picture.src))
          }
          fields.img=pictures[0].src
          const id=item?.id||crypto.randomUUID()
          await shopApi.request('products','PUT',{...fields,id,expectedStock:item?.stock??null})
          if(item)Object.assign(item,fields)
          else state.products.push({...fields,id,rating:0,reviews:0,sold:0,popularity:0})
          await refreshCatalog().catch(()=>{})
          reconcileBasket()
          saveCommerce()
          photoSelections.delete(id)
          location.hash='admin'
          toast(item?'Produk diperbarui.':'Produk terbit di katalog.')
        } finally {
          form.inert=false
        }
      })
      return
    }
    if(item)Object.assign(item,fields)
    else state.products.push({...fields,id:crypto.randomUUID(),rating:0,reviews:0,sold:0,popularity:0})
    let adjusted=false
    if(item){
      photoSelections.delete(item.id)
      if(state.cart[item.id]>stock){
        if(stock)state.cart[item.id]=stock
        else delete state.cart[item.id]
        adjusted=true
      }
    }
    if(!saveCommerce())return
    draftUrls.clear()
    Object.assign(state,{brands:[],min:'',max:'',stars:0,query:'',sort:'newest'})
    location.hash='katalog';toast(adjusted?'Produk diperbarui. Jumlah di keranjang disesuaikan dengan stok.':item?'Produk diperbarui.':'Produk terbit di katalog.')
  }
})
async function startShop(){
  if(shopApi.enabled){
    const [catalog,session,banner]=await Promise.allSettled([
      shopApi.request('products'),shopApi.request('session'),shopApi.request('banner'),
    ])
    catalogUnavailable=catalog.status==='rejected'
    state.products=catalogUnavailable?[]:catalog.value
    setShopUser(session.value?.user||null)
    if(banner.status==='fulfilled')bannerManager.load(banner.value)
    await refreshOrders()
    render()
    return
  }
  loadProfile()
  try{
    demoSignedIn=localStorage.getItem(demoSessionKey)!=='signed-out'
    await restoreCommerce(localStorage.getItem(commerceKey()))
  }catch{
    toast('Data toko di browser ini belum bisa dibuka.')
  }
  render()
}
startShop()
