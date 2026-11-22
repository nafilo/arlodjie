import { chromium } from 'playwright-core'
import { strict as assert } from 'node:assert'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const folder = dirname(fileURLToPath(import.meta.url))
const output = join(folder,'figma-import')
const checkOnly = process.argv.includes('--check-only')
if(!checkOnly)await mkdir(output,{ recursive:true })
const browser = await chromium.launch({channel:'chrome',headless:true})
const page = await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'})
const errors = []
page.on('pageerror',error=>errors.push(error.message))
const url = pathToFileURL(join(folder,'index.html')).href
await page.goto(url)
const screens = []
const route = async (hash) => {
  await page.evaluate(value=>{ location.hash=value },hash)
  await page.waitForFunction(value=>location.hash==='#'+value,hash)
  await page.waitForTimeout(60)
}
const button = (name) => page.getByRole('button',{name,exact:true})
const link = (name) => page.getByRole('link',{name,exact:true}).first()

async function design(name,{screenshot=false}={}) {
  if(checkOnly)return
  await page.evaluate(async()=>{ await document.fonts.ready; await Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))) })
  if(screenshot)await page.screenshot({
    path:join(output,name+'.png'),
    fullPage:screenshot==='full',
    style:screenshot==='full'?'.bottom { position: static }':'',
  })
  const data = await page.evaluate(() => {
    const viewport = innerWidth
    const nav = document.querySelector('.bottom')
    scrollTo(0,0)
    nav.style.position='static'
    const box = document.body.getBoundingClientRect()
    const height = Math.ceil(document.body.scrollHeight)
    const wires = []
    const images = []
    const defs = []
    let index = 0
    const esc = s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]))
    const transparent = value=>value==='transparent'||value==='rgba(0, 0, 0, 0)'
    const rect = (r,style) => {
      const fill=transparent(style.backgroundColor)?'none':style.backgroundColor
      const stroke=Number.parseFloat(style.borderTopWidth)&&!transparent(style.borderTopColor)?style.borderTopColor:'none'
      return fill!=='none'||stroke!=='none'?`<rect x="${r.left}" y="${r.top-box.top}" width="${r.width}" height="${r.height}" rx="${Math.min(parseFloat(style.borderTopLeftRadius)||0,r.height/2)}" fill="${fill}" stroke="${stroke}"/>`:''
    }
    const text = (str,r,style,adjust=0,center=false) => `<text x="${r.left+adjust+(center?r.width/2:0)}" y="${r.top-box.top+(r.height+Number.parseFloat(style.fontSize)*.68)/2}" fill="${style.color}" font-family="${esc(style.fontFamily.split(',')[0].replace(/"/g,''))}" font-size="${style.fontSize}" font-weight="${style.fontWeight}" letter-spacing="${style.letterSpacing==='normal'?0:style.letterSpacing}" ${center?'text-anchor="middle"':''}>${esc(str)}</text>`
    function walk(node){
      if(node instanceof Text){
        const content=node.textContent
        if(!content.trim())return ''
        const parent=node.parentElement
        const style=getComputedStyle(parent)
        const tokens=[...content.matchAll(/\S+\s*/g)]
        const lines=[]
        for(const token of tokens){
          const selection=document.createRange()
          selection.setStart(node,token.index)
          selection.setEnd(node,token.index+token[0].trimEnd().length)
          const range=selection.getBoundingClientRect()
          const previous=lines.at(-1)
          if(previous&&Math.abs(previous.rect.top-range.top)<2)previous.content+=token[0]
          else lines.push({rect:range,content:token[0]})
        }
        return lines.map(line=>text(line.content.trimEnd(),line.rect,style)).join('')
      }
      if(!(node instanceof Element))return ''
      const r=node.getBoundingClientRect(),style=getComputedStyle(node)
      if(!r.width||!r.height||style.display==='none'||style.visibility==='hidden'||style.opacity==='0')return ''
      const label=(node.getAttribute('aria-label')||node.getAttribute('alt')||node.classList[0]||node.localName).replace(/[^\p{L}\p{N}-]+/gu,'-')
      const id=(label||'layer')+'-'+(++index)
      if(node instanceof SVGElement){
        const svg=node.cloneNode(true)
        svg.setAttribute('x',r.left);svg.setAttribute('y',r.top-box.top)
        svg.setAttribute('width',r.width);svg.setAttribute('height',r.height)
        svg.removeAttribute('aria-hidden')
        if(node.matches('.star-rating-options svg'))svg.setAttribute('fill',style.fill)
        return `<g id="${id}">${svg.outerHTML.replaceAll('currentColor',style.color)}</g>`
      }
      if(node instanceof HTMLImageElement){
        if(!node.naturalWidth)return ''
        const marker='__ARLOD_IMAGE_'+images.length+'__'
        images.push({marker,src:node.currentSrc})
        if(node.currentSrc.endsWith('.svg')){
          return `<g id="${id}" transform="translate(${r.left},${r.top-box.top}) scale(${r.width/node.naturalWidth},${r.height/node.naturalHeight})">${marker}</g>`
        }
        return `<image id="${id}" x="${r.left}" y="${r.top-box.top}" width="${r.width}" height="${r.height}" preserveAspectRatio="${style.objectFit==='cover'?'xMidYMid slice':'xMidYMid meet'}" xlink:href="${marker}"/>`
      }
      if(node instanceof HTMLInputElement||node instanceof HTMLSelectElement||node instanceof HTMLTextAreaElement){
        if(node.type==='radio'||node.type==='checkbox'){
          return `<rect id="${id}" x="${r.left}" y="${r.top-box.top}" width="${r.width}" height="${r.height}" rx="${node.type==='radio'?r.width/2:3}" fill="${node.checked?'#946a3c':'#fffdfa'}" stroke="#946a3c"/>`
        }
        const value=node instanceof HTMLSelectElement ? node.selectedOptions[0]?.textContent : node.value||node.placeholder|| (node.type==='file'?'Pilih foto':node.type==='date'?'Pilih tanggal':'')
        return `<g id="${id}">${rect(r,style)}${value?text(value,r,style,10):''}</g>`
      }
      let visibleChildren=[...node.childNodes].map(walk).join('')
      if(node.matches('.product-specs dl > div')&&parseFloat(style.borderBottomWidth)){
        const y=r.bottom-box.top-.5
        visibleChildren+=`<path d="M ${r.left} ${y} H ${r.right}" stroke="${style.borderBottomColor}"/>`
      }
      const clipping=style.overflow==='hidden'&&node.querySelector('img')
      if(clipping){
        defs.push(`<clipPath id="clip-${id}"><rect x="${r.left}" y="${r.top-box.top}" width="${r.width}" height="${r.height}" rx="${parseFloat(style.borderTopLeftRadius)||0}"/></clipPath>`)
        visibleChildren=`<g clip-path="url(#clip-${id})">${visibleChildren}</g>`
      }
      if(node.matches('.dot')){
        const w=node.getAttribute('aria-current')==='true'?16:6
        visibleChildren+=`<rect x="${r.left+(r.width-w)/2}" y="${r.top-box.top+(r.height-6)/2}" width="${w}" height="6" rx="3" fill="${w===16?'#4a3225':'#bdad9c'}"/>`
      }
      if(node.matches('.photo-dot')){
        const selected=node.getAttribute('aria-pressed')==='true'
        const w=selected?12:6
        visibleChildren+=`<rect x="${r.left+(r.width-w)/2}" y="${r.top-box.top+(r.height-6)/2}" width="${w}" height="6" rx="3" fill="${selected?'#4a3225':'#b3a394'}"/>`
      }
      return `<g id="${id}">${rect(r,style)}${visibleChildren}</g>`
    }
    for(const element of document.body.children){
      if(element.matches('dialog[open]')){
        const r=element.getBoundingClientRect()
        wires.push(`<rect width="${viewport}" height="${height}" fill="#231813" opacity=".45"/>`)
        const movable=walk(element),top=Math.min(300,height-r.height)
        wires.push(`<g transform="translate(0,${top-(r.top-box.top)})">${movable}</g>`)
      } else if(!element.matches('dialog,#toast'))wires.push(walk(element))
    }
    nav.style.position=''
    return {viewport,height,images,wires,defs}
  })
  let svg=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${data.viewport}" height="${data.height}" viewBox="0 0 ${data.viewport} ${data.height}"><title>${name}</title><defs>${data.defs.join('')}</defs><g id="${name}"><rect width="100%" height="100%" fill="#faf7f1"/>${data.wires.join('')}</g></svg>`
  for(const image of data.images){
    if(image.src.startsWith('data:')){
      svg=svg.replace(image.marker,image.src)
      continue
    }
    if(image.src.startsWith('blob:')){
      const result=await page.evaluate(async src=>{const b=await (await fetch(src)).blob();return await new Promise(resolve=>{const f=new FileReader();f.onload=()=>resolve(f.result);f.readAsDataURL(b)})},image.src)
      svg=svg.replace(image.marker,result)
      continue
    }
    const file=fileURLToPath(image.src)
    const bytes=await readFile(file)
    if(file.endsWith('.svg')){
      svg=svg.replace(image.marker,bytes.toString().replace(/^<svg[^>]*>/,'').replace(/<\/svg>\s*$/,''))
    }else{
      svg=svg.replace(image.marker,`data:image/jpeg;base64,${bytes.toString('base64')}`)
    }
  }
  await writeFile(join(output,name+'.svg'),svg)
  screens.push(name)
}

try {
  await page.waitForFunction(()=>document.images.length>4&&[...document.images].every(img=>img.complete&&img.naturalWidth))
  assert.deepEqual((await page.locator('#nav a:visible').allTextContents()).slice(0,2),['Beranda','Katalog'])
  assert.equal(await page.locator('#nav .account-nav-label').innerText(),'Pengunjung')
  await design('01-Beranda-mobile',{screenshot:true})
  await page.getByRole('button',{name:'Promo 2',exact:true}).click()
  await page.locator('[data-banner="slide"][data-index="1"][aria-current="true"]').waitFor()
  await design('02-Banner-budget-mobile')
  await page.getByRole('button',{name:'Promo 3',exact:true}).click()
  await page.locator('[data-banner="slide"][data-index="2"][aria-current="true"]').waitFor()
  await design('03-Banner-Presage-mobile')
  assert.equal(await link('Lihat detail').getAttribute('href'),'#produk/presage')
  await route('katalog')
  assert.equal(await page.locator('.card').count(),8)
  assert.deepEqual(await page.locator('#sort option').allTextContents(),['Terjual terbanyak','Harga terendah','Harga tertinggi','Terbaru','Terlama'])
  await page.getByLabel('Urutkan katalog').selectOption('newest')
  assert.equal(await page.locator('.card h3').first().innerText(),'GW-M5610U-1')
  await page.getByLabel('Urutkan katalog').selectOption('oldest')
  assert.equal(await page.locator('.card h3').first().innerText(),'5 Sports SRPE55')
  const senjaCard=page.locator('.card-media[data-gallery-product="shunbun"]')
  await senjaCard.getByRole('button',{name:'Foto 2 dari 2 · Shunbun SBGA413'}).click()
  assert.match(await senjaCard.locator('.gallery-photo').getAttribute('src'),/shunbun-dial/)
  await senjaCard.getByRole('button',{name:'Foto 1 dari 2 · Shunbun SBGA413'}).click()
  await design('04-Katalog-mobile',{screenshot:'full'})
  await button('Filter').click()
  assert.equal(await page.getByRole('checkbox',{name:'Rolex'}).count(),1)
  await page.getByLabel('Cari brand').fill('ro')
  assert.equal(await page.getByRole('checkbox',{name:'Rolex'}).isVisible(),true)
  assert.equal(await page.getByRole('checkbox',{name:'Casio'}).isVisible(),false)
  await page.getByLabel('Cari brand').fill('')
  await page.getByRole('checkbox',{name:'Casio'}).check()
  await page.getByLabel('Harga minimum').fill('100000')
  assert.equal(await page.getByLabel('Harga minimum').inputValue(),'100.000')
  await page.getByLabel('Harga maksimum').fill('2000000')
  assert.equal(await page.getByLabel('Harga maksimum').inputValue(),'2.000.000')
  await page.getByLabel('Bintang minimum').selectOption('0')
  await page.getByLabel('Urutkan berdasarkan').selectOption('priciest')
  await design('05-Filter-mobile',{screenshot:true})
  await button('Terapkan filter').click()
  assert.equal(await page.getByLabel('Urutkan katalog').inputValue(),'priciest')
  await button('Filter').click()
  assert.equal(await page.getByLabel('Harga minimum').inputValue(),'100.000')
  assert.equal(await page.getByLabel('Harga maksimum').inputValue(),'2.000.000')
  await button('Tutup').click()
  await page.getByLabel('Urutkan katalog').selectOption('cheapest')
  assert.equal(await page.locator('.card').count(),1)
  await button('Reset filter').click()
  await page.getByLabel('Urutkan katalog').selectOption('cheapest')
  assert.equal(await page.locator('.card h3').first().innerText(),'F-91W-1')
  await page.getByLabel('Urutkan katalog').selectOption('priciest')
  assert.equal(await page.locator('.card h3').first().innerText(),'Shunbun SBGA413')
  await route('produk/shunbun')
  assert.match(await page.locator('.product-specs').innerText(),/Power Reserve\s+± 72 hours/)
  assert.equal(await page.locator('.product-specs').getByText('Battery Life').count(),0)
  await button('Foto 2 dari 2 · Shunbun SBGA413').click()
  assert.match(await page.locator('.gallery-main img').getAttribute('src'),/shunbun-dial/)
  await button('Foto 1 dari 2 · Shunbun SBGA413').click()
  await design('07-Detail-produk-mobile',{screenshot:'full'})
  await button('Tambah ke keranjang').click()
  await route('keranjang')
  await design('08-Keranjang-mobile')
  await link('Checkout').click()
  await page.getByLabel('Nama penerima').fill('Nadira')
  await page.getByLabel('Alamat pengiriman').fill('Jl. Flamboyan 12')
  await design('09-Checkout-mobile')
  await button('Buat pesanan').click()
  await page.getByText('Menunggu konfirmasi pembayaran',{exact:true}).waitFor()
  await route('admin/pesanan')
  await button('Konfirmasi pembayaran').click()
  await button('Tandai dikirim').click()
  await route('pesanan')
  await page.getByRole('heading',{name:'Riwayat Pesanan',exact:true}).waitFor()
  const historyItem=page.locator('.order-history a')
  assert.equal(await historyItem.getAttribute('href'),'#detail-pesanan/ARL-001')
  assert.match(await historyItem.locator('time').getAttribute('datetime'),/^\d{4}-\d{2}-\d{2}T/)
  await design('10-Pesanan-saya-mobile')
  await historyItem.click()
  await button('Pesanan diterima').click()
  await design('11-Detail-pesanan-mobile')
  await link('Beri rating').click()
  const stars=page.getByRole('radio',{name:/bintang/})
  const filledStars=()=>page.locator('.star-rating-options svg').evaluateAll(icons=>
    icons.filter(icon=>getComputedStyle(icon).fill!=='none').length)
  await stars.last().waitFor()
  assert.equal(await stars.count(),5)
  assert.equal(await filledStars(),0)
  await stars.nth(3).click()
  assert.equal(await filledStars(),4)
  await stars.nth(3).press('ArrowRight')
  assert.equal(await filledStars(),5)
  await page.getByLabel('Ulasan').fill('Ukuran casing pas.')
  await design('12-Ulasan-mobile')
  await button('Simpan ulasan').click()
  await page.getByText('Edit ulasan',{exact:true}).waitFor()
  await link('Edit ulasan').click()
  await stars.last().waitFor()
  assert.equal(await filledStars(),5)

  await route('akun')
  await design('16-Akun-mobile')
  await link('Edit profil').click()
  await page.getByLabel('Unggah foto profil').setInputFiles(join(folder,'assets','leather.jpg'))
  await page.locator('.profile-photo-preview img').waitFor()
  assert.equal(await page.locator('.profile-photo-preview img').count(),1)
  await page.getByLabel('Nama',{exact:true}).fill('Nadira')
  await page.getByLabel('Email (opsional)',{exact:true}).fill('nadira@example.com')
  await button('Simpan profil').click()
  await page.getByRole('heading',{name:'Nadira'}).waitFor()
  await page.getByText('nadira@example.com').waitFor()
  await page.reload()
  await page.getByRole('heading',{name:'Nadira'}).waitFor()
  assert.equal(await page.locator('.account-profile .account-avatar img').count(),1)
  assert.equal(await page.locator('#nav .account-nav-label').innerText(),'Nadira')
  assert.equal(await page.locator('#nav .nav-avatar img').count(),1)
  assert.equal(await page.locator('#account-link .account-nav-label').textContent(),'Nadira')
  assert.equal(await page.locator('#account-link .nav-avatar img').count(),1)
  await link('Edit profil').click()
  await button('Hapus foto').click()
  await page.getByLabel('Nama',{exact:true}).fill('Nama draf')
  await link('Batal').click()
  await page.getByRole('heading',{name:'Nadira'}).waitFor()
  assert.equal(await page.locator('.account-profile .account-avatar img').count(),1)
  await link('Edit profil').click()
  await button('Hapus foto').click()
  await button('Simpan profil').click()
  await page.getByRole('heading',{name:'Nadira'}).waitFor()
  assert.equal(await page.locator('.account-avatar img').count(),0)
  await route('tentang')
  await page.getByRole('heading',{name:'About Us',exact:true}).waitFor()
  await design('17-Tentang-toko-mobile')
  await route('favorit')
  await design('18-Favorit-kosong-mobile')

  await page.setViewportSize({width:1440,height:1000})
  await page.evaluate(()=>{document.getElementById('toast').textContent=''})
  await route('beranda')
  await button('Promo 1').click()
  await page.locator('[data-banner="slide"][data-index="0"][aria-current="true"]').waitFor()
  await design('19-Beranda-desktop',{screenshot:true})
  await route('katalog')
  await design('20-Katalog-desktop',{screenshot:'full'})
  await route('produk/shunbun')
  await design('21-Detail-produk-desktop',{screenshot:'full'})
  await route('admin')
  await design('22-Admin-produk-desktop')
  await link('Tambah produk').click()
  await page.getByLabel('Nama model').fill('Kala Brass')
  const brandInput=page.locator('form[data-form="product"] input[name="brand"]')
  await brandInput.fill('b')
  assert.deepEqual(await page.locator('#brand-suggestions [role="option"]').allTextContents(),['Breitling','Bulova'])
  await brandInput.fill('br')
  assert.deepEqual(await page.locator('#brand-suggestions [role="option"]').allTextContents(),['Breitling'])
  await brandInput.fill('gshock')
  assert.deepEqual(await page.locator('#brand-suggestions [role="option"]').allTextContents(),['G-SHOCK'])
  await brandInput.press('ArrowDown')
  await brandInput.press('Tab')
  assert.equal(await brandInput.inputValue(),'G-SHOCK')
  await brandInput.fill('seiko')
  await page.getByLabel('Harga dalam rupiah').fill('2700000')
  assert.equal(await page.getByLabel('Harga dalam rupiah').inputValue(),'2.700.000')
  await page.getByLabel('Stok').fill('4')
  await page.getByLabel('Deskripsi singkat').fill('Dial dengan detail warna kuningan matte.')
  const upload=page.getByLabel('Tambah foto')
  await upload.setInputFiles(['leather.jpg','steel.jpg'].map(name=>join(folder,'assets',name)))
  await upload.setInputFiles(join(folder,'assets','hero.jpg'))
  const previews=page.locator('#upload-preview img')
  assert.equal(await previews.count(),3)
  const cover=await previews.nth(1).getAttribute('src')
  await button('Jadikan foto 2 sampul').click()
  assert.equal(await previews.first().getAttribute('src'),cover)
  await page.getByText('Spesifikasi',{exact:true}).click()
  await page.getByLabel('Water Resistance').selectOption('10 ATM')
  await page.getByLabel('Style').selectOption('GMT')
  await page.getByLabel('Dial Color').fill('Cokelat')
  await page.getByLabel('Case Diameter').fill('39.5')
  await page.getByLabel('Case Thickness').fill('12.5')
  await page.getByLabel('Lug-to-Lug').fill('46')
  await page.getByLabel('Lug Width').fill('20')
  await page.getByLabel('Caliber / Movement Reference').fill('4R36')
  await page.getByLabel('Reference Number').fill('SRPD')
  await page.getByLabel('Case Material').selectOption('Brass')
  await page.getByLabel('Crystal').selectOption('Sapphire')
  await page.getByLabel('Strap Material').selectOption('Leather')
  await page.locator('select[name=movement]').selectOption('Automatic')
  await page.getByLabel('Power Reserve (hours)').fill('40')
  await page.locator('select[name=movement]').selectOption('Quartz')
  assert.equal(await page.getByLabel('Power Reserve (hours)').isVisible(),false)
  await page.getByLabel('Battery Life (years)').fill('2.5')
  await page.getByText('Features',{exact:true}).click()
  await page.getByLabel('Rotating Bezel').check()
  await page.getByLabel('Shock Resistant').check()
  await page.getByLabel('Chronograph').check()
  await page.getByLabel('Solar Powered').check()
  await page.getByLabel('Hacking Seconds').check()
  await page.getByLabel('Digital Compass').check()
  await page.getByLabel('Other Features').fill('Moonphase')
  await design('23-Admin-publikasi-desktop',{screenshot:'full'})
  await button('Terbitkan produk').click()
  const published=page.getByRole('link',{name:'Kala Brass',exact:true}).first()
  const publishedRoute=await published.getAttribute('href')
  const publishedCard=page.locator(`.card-media[data-gallery-product="${publishedRoute.split('/').pop()}"]`)
  assert.equal(await publishedCard.locator('.gallery-photo').getAttribute('src'),cover)
  assert.equal(await publishedCard.locator('.photo-dot').count(),3)
  await published.click()
  await page.locator('.photo-thumbs').waitFor()
  assert.equal(await page.locator('.photo-thumbs .thumb').count(),3)
  const thirdPhoto=await page.locator('.photo-thumbs img').nth(2).getAttribute('src')
  await button('Foto 3 dari 3 · Kala Brass').click()
  assert.equal(await page.locator('.gallery-main .gallery-photo').getAttribute('src'),thirdPhoto)
  const specs=page.locator('.product-specs')
  assert.match(await specs.innerText(),/Battery Life\s+± 2,5 years/)
  assert.match(await specs.innerText(),/Style\s+GMT/)
  assert.match(await specs.innerText(),/Case Diameter\s+39.5 mm/)
  assert.match(await specs.innerText(),/Case Thickness\s+12.5 mm/)
  assert.match(await specs.innerText(),/Caliber \/ Movement Reference\s+4R36/)
  assert.match(await specs.innerText(),/Hacking Seconds, Digital Compass, Moonphase/)
  assert.equal(await specs.getByText('Power Reserve').count(),0)
  await route('admin/edit/'+publishedRoute.split('/').pop())
  await page.getByText('Spesifikasi',{exact:true}).click()
  await page.getByText('Features',{exact:true}).click()
  assert.equal(await page.locator('form[data-form="product"] input[name="brand"]').inputValue(),'Seiko')
  assert.equal(await page.getByLabel('Harga dalam rupiah').inputValue(),'2.700.000')
  assert.equal(await page.getByLabel('Case Diameter').inputValue(),'39.5')
  assert.equal(await page.getByLabel('Case Thickness').inputValue(),'12.5')
  assert.equal(await page.getByLabel('Hacking Seconds').isChecked(),true)
  assert.equal(await page.locator('select[name=movement]').inputValue(),'Quartz')
  assert.equal(await page.getByLabel('Battery Life (years)').inputValue(),'2.5')
  assert.equal(await page.getByLabel('Rotating Bezel').isChecked(),true)
  assert.equal(await page.getByLabel('Shock Resistant').isChecked(),true)
  assert.equal(await page.getByLabel('Chronograph').isChecked(),true)
  assert.equal(await page.getByLabel('Solar Powered').isChecked(),true)
  assert.equal(await page.getByLabel('Other Features').inputValue(),'Moonphase')
  assert.equal(await previews.count(),3)
  await button('Hapus foto 3').click()
  await button('Simpan produk').click()
  await page.getByRole('link',{name:'Kala Brass',exact:true}).first().click()
  await page.locator('.photo-thumbs').waitFor()
  assert.equal(await page.locator('.photo-thumbs .thumb').count(),2)
  assert.equal(await page.locator('.gallery-main .gallery-photo').getAttribute('src'),cover)
  await route('admin/pesanan')
  await design('24-Admin-pesanan-desktop')
  await route('admin/tambah')
  await page.getByLabel('Nama model').fill('556 I')
  await brandInput.fill('Sinn')
  assert.equal(await page.locator('#brand-suggestions [role="option"]').count(),0)
  await page.getByLabel('Harga dalam rupiah').fill('27000000')
  await page.getByLabel('Stok').fill('1')
  await upload.setInputFiles(join(folder,'assets','steel.jpg'))
  await button('Terbitkan produk').click()
  await link('556 I').waitFor()
  await route('admin/tambah')
  await page.reload()
  await brandInput.fill('si')
  assert.deepEqual(await page.locator('#brand-suggestions [role="option"]').allTextContents(),['Sinn'])
  await brandInput.press('ArrowDown')
  await brandInput.press('Tab')
  assert.equal(await brandInput.inputValue(),'Sinn')
  await page.setViewportSize({width:390,height:844})
  await route('akun')
  await button('Keluar dari akun').click()
  await button('Masuk demo').waitFor()
  await page.reload()
  await button('Masuk demo').waitFor()
  assert.equal(await page.locator('#nav .account-nav-label').innerText(),'Akun Saya')
  assert.equal(await page.locator('#nav .nav-avatar').count(),0)
  await route('katalog')
  await page.locator('.card').first().waitFor()
  await route('pesanan')
  await button('Masuk demo').click()
  await page.locator('.order-history a').first().waitFor()
  await route('admin')
  await button('Keluar').click()
  await button('Masuk demo').waitFor()
  await route('admin')
  await button('Masuk demo').click()
  await page.getByRole('heading',{name:'Panel admin',exact:true}).waitFor()
  assert.deepEqual(errors,[])
  await page.emulateMedia({reducedMotion:'no-preference'})
  await page.goto(url+'#beranda')
  await page.reload()
  await page.getByRole('button',{name:'Jeda promo'}).waitFor()
  await page.getByRole('heading',{name:'Pilihan di bawah Rp2 juta'}).waitFor({timeout:9000})
  await page.getByRole('button',{name:'Jeda promo'}).click()
  await page.getByRole('button',{name:'Putar promo'}).waitFor()
  console.log(checkOnly?'Pengecekan belanja, profil, katalog, dan admin lulus.':`Alur aplikasi lulus. ${screens.length} layar diekspor sebagai SVG dengan elemen terpisah.`)
} finally {
  await browser.close()
}

const boards = [
  { file:'A-Logo', title:'Arlodjie · Identitas', cols:1, files:[] },
  { file:'B-Katalog', title:'Katalog · Ponsel', cols:4, files:[1,2,3,4,5,7] },
  { file:'C-Pembeli', title:'Pembelian dan akun · Ponsel', cols:4, files:[8,9,10,11,12,16,17,18] },
  { file:'E-Toko-desktop', title:'Toko · Desktop', cols:2, files:[19,20,21] },
  { file:'F-Admin-desktop', title:'Admin · Desktop', cols:2, files:[22,23,24] },
]
for(const board of checkOnly?[]:boards){
  let content='',width=0,height=0
  if(!board.files.length){
    const paths=async name=>(await readFile(join(folder,name),'utf8')).replace(/^<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'')
    const mark=await paths('logo.svg')
    const mono=await paths('logo-mono.svg')
    content=`<g id="primary-lockup" transform="translate(64 158) scale(2)">${await paths('lockup.svg')}</g>
    <g transform="translate(64 344)">${mark}</g><text x="64" y="424" font-family="DM Sans" font-size="18" fill="#4a3225">Ikon aplikasi</text>
    <g transform="translate(278 355) scale(.5)">${mark}</g><text x="256" y="424" font-family="DM Sans" font-size="18" fill="#4a3225">Uji 24 px</text>
    <rect x="440" y="313" width="180" height="138" rx="14" fill="#4a3225"/><g transform="translate(506 340)">${mono}</g><text x="486" y="424" font-family="DM Sans" font-size="18" fill="#faf7f1">Satu warna</text>
    <rect x="64" y="474" width="100" height="36" rx="8" fill="#946a3c"/><text x="64" y="536" font-family="DM Sans" font-size="18" fill="#4a3225">#946A3C</text>
    <rect x="256" y="474" width="100" height="36" rx="8" fill="#4a3225"/><text x="256" y="536" font-family="DM Sans" font-size="18" fill="#4a3225">#4A3225</text>`
    width=690;height=594
  }else{
    const nodes=await Promise.all(board.files.map(async i=>{
      const name=screens.find(screen=>parseInt(screen,10)===i)
      const original=await readFile(join(output,name+'.svg'),'utf8')
      const dims=original.match(/width="(\d+)" height="(\d+)"/)
      const markup=original.replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')
        .replace('<rect width="100%" height="100%" fill="#faf7f1"/>','')
        .replaceAll(/id="([^"]+)"/g,(_,id)=>`id="screen-${i}-${id}"`)
        .replaceAll(/url\(#([^)]+)\)/g,(_,id)=>`url(#screen-${i}-${id})`)
      return {name,w:Number(dims[1]),h:Number(dims[2]),markup}
    }))
    const pad=48,gap=40,top=148
    const colWidth=Math.max(...nodes.map(n=>n.w))
    let y=top
    width=pad*2+Math.min(board.cols,nodes.length)*colWidth+(Math.min(board.cols,nodes.length)-1)*gap
    for(let i=0;i<nodes.length;i+=board.cols){
      const row=nodes.slice(i,i+board.cols)
      content+=row.map(({name,w,h,markup},j)=>`<g id="${name}" transform="translate(${pad+j*(colWidth+gap)},${y})">
        <rect width="${w}" height="${h}" fill="#faf7f1"/><text x="0" y="-13" font-family="DM Sans" font-size="19" fill="#4a3225">${name.slice(3).replaceAll('-',' ')}</text>${markup}</g>`).join('')
      y+=Math.max(...row.map(n=>n.h))+gap+28
    }
    height=y-pad/2
  }
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><title>${board.title}</title><g id="${board.file}"><rect width="${width}" height="${height}" fill="#eaddcc"/><text x="48" y="78" fill="#4a3225" font-family="Cormorant Garamond" font-size="43" font-weight="600">${board.title}</text>${content}</g></svg>`
  await writeFile(join(output,board.file+'.svg'),svg)
}

