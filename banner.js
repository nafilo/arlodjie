const bannerManager = (function () {
  const storageKey = 'arlodjie.home-banners.v1'
  const activeLimit = 3
  const defaults = {
    effect: 'fade', seconds: 7,
    slides: [
      {id:'murph', productId:'murph', photo:1, active:true, title:'Khaki Field Murph', text:'Dial hitam, angka Arab, dan jarum cathedral dalam case 38 mm.'},
      {id:'casio', productId:'f91w', photo:0, active:true, title:'Pilihan di bawah Rp2 juta', text:'Casio F-91W dengan tampilan digital, stopwatch, dan strap resin.'},
      {id:'presage', productId:'presage', photo:0, active:true, title:'Presage Cocktail Time', text:'Dial biru muda dengan pola sunburst, dipadukan dengan strap kulit.'},
    ],
  }
  function readSettings() {
    try {
      const data = JSON.parse(localStorage.getItem(storageKey))
      if (Array.isArray(data?.slides) && data.slides.every(slide => typeof slide?.productId === 'string')) {
        return {
          slides:data.slides,
          seconds:[5,7,10].includes(data.seconds) ? data.seconds : 7,
          effect:['fade','shift','none'].includes(data.effect) ? data.effect : 'fade',
        }
      }
    } catch { /* Storage may be unavailable for local files. */ }
    return structuredClone(defaults)
  }
  let published = readSettings()
  let draft
  let editing = 0
  let changed = false
  let uploadJob = 0
  let uploading = false
  let timer
  let startX
  let slideRequest = 0
  const transitions = new WeakMap()
  const motion = matchMedia('(prefers-reduced-motion: reduce)')

  const activeSlides = () => published.slides.filter(slide => slide.active && product(slide.productId)).slice(0,activeLimit)
  const imageFor = (slide, item) => slide.custom || photosFor(item)[slide.photo]?.src || item.img
  function slideMarkup(slide, preview = false, selected = true) {
    const item = product(slide.productId)
    if (!item) return ''
    const headline = safe(slide.title || item.name)
    const description = safe(slide.text || item.desc)
    const headingTag = preview ? 'h3' : 'h1'
    const cta = preview ? '<span class="banner-link">Lihat detail <span aria-hidden="true">→</span></span>'
      : link('produk/'+encodeURIComponent(item.id),'Lihat detail <span aria-hidden="true">→</span>','banner-link')
    const picture = imageFor(slide,item)
    const fullBleed = slide.custom || (picture === 'assets/murph.jpg')
    return `<div class="hero watch-banner"${selected?'':' inert aria-hidden="true"'}>
      <div class="hero-body"><span class="banner-brand">${safe(item.brand)}</span>
        <${headingTag} class="banner-title">${headline}</${headingTag}>${description ? `<p>${description}</p>` : ''}${cta}</div>
      <div class="banner-image${fullBleed ? ' bleed' : ''}">${img(picture,item.name,'hero-media')}</div>
    </div>`
  }
  function home() {
    const slides = activeSlides()
    if (!slides.length) return ''
    if (state.slide >= slides.length || state.slide < 0) state.slide = 0
    const controls = slides.length < 2 ? '' : `<div class="carousel banner-controls" role="group" aria-label="Kontrol banner">
      ${slides.map((slide,index)=>`<button class="dot" type="button" data-banner="slide" data-index="${index}" aria-label="Promo ${index+1}" title="${safe(slide.title || product(slide.productId).name)}" aria-current="${index===state.slide}"></button>`).join('')}
      <button class="icon-btn" type="button" data-banner="play" aria-label="${state.playing ? 'Jeda promo' : 'Putar promo'}">${icon(state.playing ? 'pause' : 'play')}</button></div>`
    return `<div role="region" aria-label="Banner pilihan jam"><div class="banner-track">${slides.map((slide,index)=>slideMarkup(slide,false,index===state.slide)).join('')}</div>${controls}</div>`
  }
  function schedule() {
    clearTimeout(timer)
    const banner = document.querySelector('#banner')
    if (banner && state.playing && !document.hidden && activeSlides().length > 1) {
      timer = setTimeout(()=>selectSlide(state.slide+1),published.seconds*1000)
    }
  }
  function transition(track, incoming, effect, direction) {
    const outgoing = track.querySelector('.watch-banner:not([inert])')
    if (!outgoing || !incoming || outgoing === incoming) return
    outgoing.inert = true
    outgoing.setAttribute('aria-hidden','true')
    incoming.inert = false
    incoming.removeAttribute('aria-hidden')
    if (effect==='none' || motion.matches) return

    outgoing.classList.add('is-leaving')
    incoming.classList.add('is-entering')
    const timing = {duration:520,easing:'cubic-bezier(.22,.61,.36,1)'}
    const shift = effect==='shift'
    const entering = incoming.animate(shift
      ? [{transform:`translateX(${100*direction}%)`},{transform:'translateX(0)'}]
      : [{opacity:0},{opacity:1}],timing)
    const leaving = shift && outgoing.animate([
      {transform:'translateX(0)'},{transform:`translateX(${-100*direction}%)`},
    ],timing)
    const finished = Promise.allSettled([entering.finished,leaving?.finished]).then(()=>{
      outgoing.classList.remove('is-leaving')
      incoming.classList.remove('is-entering')
      transitions.delete(track)
    })
    transitions.set(track,finished)
  }
  async function selectSlide(index) {
    const count = activeSlides().length
    const banner = document.querySelector('#banner')
    if (!banner || count<2) return
    const track = banner.querySelector('.banner-track')
    const next = ((index%count)+count)%count
    const request = ++slideRequest
    if (!track || next===state.slide) { schedule(); return }
    const incoming = track.children[next]
    const image = incoming?.querySelector('img')
    clearTimeout(timer)
    await Promise.all([transitions.get(track),image?.decode().catch(()=>{})])
    if (request!==slideRequest || !track.isConnected) return
    transition(track,incoming,published.effect,Math.sign(index-state.slide))
    state.slide = next
    banner.querySelectorAll('[data-banner="slide"]').forEach((button,i)=>
      button.setAttribute('aria-current',String(i===next)))
    schedule()
  }
  function setPlaying(value) {
    state.playing = value
    const button = document.querySelector('#banner [data-banner="play"]')
    if (button) {
      button.setAttribute('aria-label',value ? 'Jeda promo' : 'Putar promo')
      button.innerHTML = icon(value ? 'pause' : 'play')
    }
    schedule()
  }
  document.addEventListener('visibilitychange',schedule)
  motion.addEventListener('change',event=>{ if (event.matches) setPlaying(false) })
  document.addEventListener('focusin',event=>{
    if (event.target.closest('#banner a, #banner [data-banner="slide"]') && state.playing) setPlaying(false)
  })
  document.addEventListener('pointerdown',event=>{
    if (event.target.closest('#banner .watch-banner') && !event.target.closest('a,button')) startX=event.clientX
  })
  document.addEventListener('pointerup',event=>{
    if (startX !== undefined && event.target.closest('#banner .watch-banner') && Math.abs(event.clientX-startX)>40) {
      selectSlide(state.slide + (event.clientX<startX ? 1 : -1))
    }
    startX=undefined
  })
  document.addEventListener('pointercancel',()=>{startX=undefined})

  function newDraft() {
    draft=structuredClone(published)
    editing=Math.max(0,Math.min(editing,draft.slides.length-1))
    changed=false
    uploadJob++
    uploading=false
  }
  function admin() {
    if (!draft) newDraft()
    return adminShell('admin/banner',`<header class="banner-editor-header"><h2>Banner beranda</h2><p>Pilih hingga tiga jam untuk ditampilkan bergantian di beranda.</p></header>
      <div id="banner-editor">${editor()}</div>`)
  }
  function deck() {
    const selectedCount=draft.slides.filter(slide=>slide.active).length
    return `<div class="banner-list-header"><h3>Urutan slide</h3><span>${selectedCount} dari ${activeLimit} aktif</span></div>
      <ol class="banner-list">${draft.slides.map((slide,i)=>{
        const item=product(slide.productId)
        return `<li><button type="button" data-banner="edit" data-index="${i}" aria-current="${i===editing}" class="banner-list-item">
          <span class="slide-number">${String(i+1).padStart(2,'0')}</span>
          ${item ? img(imageFor(slide,item),'','banner-thumb') : ''}
          <span class="slide-caption"><strong data-row-title="${i}">${safe(slide.title||item?.name||'Produk tidak tersedia')}</strong><small>${item?(slide.active?'Aktif':'Draf'):'Produk tidak tersedia'}</small></span></button></li>`
      }).join('')}</ol><button type="button" class="btn banner-add" data-banner="add">+ Tambah slide</button>`
  }
  function slideFields(slide) {
    const item=product(slide.productId)
    const gallery=photosFor(item)
    const canPreview=draft.effect!=='none' && draft.slides.some(other=>other!==slide&&product(other.productId))
    return `<div class="banner-edit-heading"><h3>Edit slide ${editing+1}</h3>
      <div class="banner-order-actions"><button type="button" class="text-btn" data-banner="up" ${editing===0?'disabled':''}>Naik</button>
        <button type="button" class="text-btn" data-banner="down" ${editing===draft.slides.length-1?'disabled':''}>Turun</button>
        <button type="button" class="text-btn" data-banner="delete">Hapus</button></div></div>
      <label class="field">Produk<select name="bannerProduct">${!item ? '<option value="" selected>Pilih produk</option>' : ''}${state.products.map(p=>`<option value="${safe(p.id)}"${p.id===slide.productId?' selected':''}>${safe(p.brand+' · '+p.name)}</option>`).join('')}</select></label>
      ${item?`<fieldset class="banner-photos"><legend>Foto banner</legend><div class="banner-photo-options">${gallery.map((pic,i)=>`<button type="button" class="banner-photo-choice" aria-label="Foto produk ${i+1}" aria-pressed="${!slide.custom && i===Math.min(slide.photo,gallery.length-1)}" data-banner="photo" data-index="${i}">${img(pic.src,'')}</button>`).join('')}${slide.custom?`<span class="banner-custom-photo">${img(slide.custom,'Foto banner unggahan')}</span>`:''}
        <label class="btn banner-upload">${slide.custom?'Ganti foto unggahan':'Unggah foto lain'}<input name="bannerUpload" type="file" accept="image/jpeg,image/png,image/webp"></label></div>
        <small>JPG, PNG, atau WebP hingga 5 MB.</small></fieldset>`:''}
      <label class="field">Judul<input name="bannerTitle" maxlength="65" value="${safe(slide.title||'')}" placeholder="${safe(item?.name||'Nama model')}"></label>
      <label class="field">Deskripsi singkat<textarea name="bannerText" rows="2" maxlength="150" placeholder="${safe(item?.desc||'Deskripsi produk')}">${safe(slide.text||'')}</textarea></label>
      <label class="banner-status"><input type="checkbox" name="bannerActive" ${slide.active?'checked':''} ${item?'':'disabled'}>Tampilkan di beranda</label>
      ${item?`<section class="banner-preview" aria-label="Pratinjau slide"><div class="banner-edit-heading"><h3>Pratinjau</h3>${canPreview?'<button class="text-btn" type="button" data-banner="preview">Putar transisi</button>':''}</div><div class="banner-stage">${slideMarkup(slide,true)}</div></section>`:''}`
  }
  function editor() {
    for (const slide of draft.slides) {
      if (!product(slide.productId)) slide.active=false
    }
    const slide=draft.slides[editing]
    return `<div class="banner-workspace"><div class="banner-deck">${deck()}</div><div class="banner-fields">${slide?slideFields(slide):'<p>Tambahkan slide untuk memilih produk dan foto.</p>'}</div></div>
      <div class="banner-settings"><h3>Animasi beranda</h3><div class="banner-selects">
        <label class="field">Transisi<select name="bannerEffect">${[['fade','Pudar'],['shift','Geser'],['none','Tanpa transisi']].map(([value,label])=>`<option value="${value}"${draft.effect===value?' selected':''}>${label}</option>`).join('')}</select></label>
        <label class="field">Durasi tiap slide<select name="bannerSeconds">${[5,7,10].map(value=>`<option value="${value}"${draft.seconds===value?' selected':''}>${value} detik</option>`).join('')}</select></label></div></div>
      <div class="banner-save"><span class="banner-message" role="status">${changed?'Perubahan belum disimpan.':''}</span><div><button type="button" data-banner="revert" class="text-btn" ${changed?'':'disabled'}>Batalkan perubahan</button>
        <button type="button" data-banner="publish" class="btn primary" ${changed&&!uploading?'':'disabled'}>Simpan banner</button></div></div>`
  }
  function paint(focus) {
    const container=document.querySelector('#banner-editor')
    if (!container) return
    container.innerHTML=editor()
    if (focus) container.querySelector(focus)?.focus({preventScroll:true})
  }
  function message(text,error=false) {
    const element=document.querySelector('.banner-message')
    if (element) {
      element.textContent=text
      element.classList.toggle('is-error',error)
    }
    if (error) toast(text)
  }
  function modified() {
    changed=true
    const container=document.querySelector('#banner-editor')
    if (container) {
      container.querySelector('[data-banner="publish"]').disabled=uploading
      container.querySelector('[data-banner="revert"]').disabled=false
      message('Perubahan belum disimpan.')
    }
  }
  function preview() {
    const slide=draft.slides[editing]
    const stage=document.querySelector('.banner-stage')
    if (slide && stage) stage.innerHTML=slideMarkup(slide,true)
  }
  function publish() {
    if (uploading) return
    if (draft.slides.some(slide=>slide.active&&!product(slide.productId))) {
      message('Pilih produk yang tersedia untuk setiap slide aktif.',true)
      return
    }
    try {
      localStorage.setItem(storageKey,JSON.stringify(draft))
    } catch {
      message('Banner gagal disimpan. Coba foto unggahan yang lebih kecil atau gunakan foto produk.',true)
      return
    }
    published=structuredClone(draft)
    state.slide=0
    newDraft()
    paint()
    message('Banner tersimpan.')
    toast('Banner beranda diperbarui.')
    document.querySelector('#banner-editor .banner-message')?.setAttribute('tabindex','-1')
    document.querySelector('#banner-editor .banner-message')?.focus({preventScroll:true})
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-banner]')
    if (!button) return
    const name=button.dataset.banner
    const index=Number(button.dataset.index)
    if (name==='play') {setPlaying(!state.playing);return}
    if (name==='slide') {selectSlide(index);return}
    if (!draft || !button.closest('#banner-editor')) return
    if (name==='publish') {publish();return}
    if (name==='preview') {
      const stage=document.querySelector('.banner-stage')
      const selected=draft.slides[editing]
      const other=draft.slides.find(slide=>slide!==selected&&product(slide.productId))
      if (!stage || !other || draft.effect==='none' || motion.matches) return
      stage.innerHTML=`<div class="banner-track">${slideMarkup(other,true)}${slideMarkup(selected,true,false)}</div>`
      const track=stage.firstElementChild
      transition(track,track.lastElementChild,draft.effect,1)
      return
    }
    if (name==='edit') {editing=index;paint(`[data-banner="edit"][data-index="${index}"]`);return}
    if (name==='revert') {newDraft();paint('[data-banner="edit"][aria-current="true"]');return}
    const slide=draft.slides[editing]
    let focus='[data-banner="edit"][aria-current="true"]'
    if (name==='add') {
      const item=state.products.find(p=>!draft.slides.some(s=>s.productId===p.id))||state.products[0]
      if (!item) {message('Tambahkan produk ke katalog terlebih dahulu.',true);return}
      draft.slides.push({id:crypto.randomUUID(),productId:item.id,photo:0,active:draft.slides.filter(s=>s.active).length<activeLimit,title:'',text:''})
      editing=draft.slides.length-1
      focus='[name="bannerProduct"]'
    } else if (!slide) {
      return
    } else if (name==='delete') {
      draft.slides.splice(editing,1)
      editing=Math.max(0,Math.min(editing,draft.slides.length-1))
      if (!draft.slides.length) focus='[data-banner="add"]'
    } else if (name==='up' || name==='down') {
      const next=editing+(name==='up'?-1:1)
      if (next<0 || next>=draft.slides.length) return
      draft.slides.splice(editing,1)
      draft.slides.splice(next,0,slide)
      editing=next
    } else if (name==='photo') {
      uploadJob++
      uploading=false
      slide.photo=index
      delete slide.custom
      focus=`[data-banner="photo"][data-index="${index}"]`
    } else { return }
    modified()
    paint(focus)
    if (name==='add' && !draft.slides[editing].active) message('Slide baru belum aktif. Nonaktifkan satu slide untuk menampilkannya di beranda.')
  })
  document.addEventListener('input',event=>{
    const input=event.target
    if (!input.closest('#banner-editor') || !['bannerTitle','bannerText'].includes(input.name)) return
    const slide=draft.slides[editing]
    slide[input.name==='bannerTitle'?'title':'text']=input.value
    document.querySelector(`[data-row-title="${editing}"]`).textContent=slide.title||product(slide.productId)?.name||'Produk tidak tersedia'
    modified()
    preview()
  })
  document.addEventListener('change',async event=>{
    const input=event.target
    if (!input.closest('#banner-editor')) return
    const slide=draft.slides[editing]
    if (input.name==='bannerUpload') {
      const file=input.files?.[0]
      if (!file) return
      input.value=''
      if (!photoTypes.includes(file.type)||!file.size||file.size>5*1024*1024) {
        message('Pilih foto JPG, PNG, atau WebP hingga 5 MB.',true)
        return
      }
      const job=++uploadJob
      uploading=true
      document.querySelector('[data-banner="publish"]').disabled=true
      message('Menyiapkan foto…')
      try {
        const image=await preparePhoto(file,{maxSize:1400})
        if (job!==uploadJob || !draft?.slides.includes(slide)) return
        slide.custom=image
        uploading=false
        modified()
        paint()
        message('Foto siap digunakan.')
      } catch {
        if (job===uploadJob) message('Foto gagal dibaca. Pilih berkas foto lain.',true)
      } finally {
        if (job===uploadJob) {
          uploading=false
          const save=document.querySelector('[data-banner="publish"]')
          if (save) save.disabled=!changed
        }
      }
      return
    }
    if (input.name==='bannerEffect') draft.effect=input.value
    else if (input.name==='bannerSeconds') draft.seconds=Number(input.value)
    else if (input.name==='bannerProduct') {
      uploadJob++
      uploading=false
      Object.assign(slide,{productId:input.value,photo:0,custom:'',title:'',text:''})
    } else if (input.name==='bannerActive') {
      if (input.checked && draft.slides.filter(s=>s.active).length>=activeLimit) {
        input.checked=false
        message('Tiga slide sudah aktif. Nonaktifkan satu slide terlebih dahulu.',true)
        return
      }
      slide.active=input.checked
    } else { return }
    modified()
    paint(`[name="${input.name}"]`)
  })
  window.addEventListener('hashchange',()=>{
    if (location.hash !== '#admin/banner') {
      if (!changed) draft=undefined
      uploadJob++
      uploading=false
    }
  })
  window.addEventListener('storage',event=>{
    if (event.key!==storageKey) return
    published=readSettings()
    state.slide=0
    const banner=document.querySelector('#banner')
    if (banner) {banner.innerHTML=home();schedule()}
    if (document.querySelector('#banner-editor') && !changed) {newDraft();paint()}
  })
  return {admin,home,schedule}
})()
