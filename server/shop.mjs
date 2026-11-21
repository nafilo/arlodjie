import { randomUUID } from 'node:crypto'

const idPattern = /^[a-z0-9-]{1,64}$/
const uuidPattern = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/
const cookieName = 'arlodjie_session'
const textFields = ['name', 'brand', 'desc', 'color', 'movement', 'size', 'thickness', 'lugToLug',
  'lugWidth', 'caliber', 'reference', 'water', 'style', 'caseMaterial', 'crystal', 'strap', 'otherFeatures']

class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

function requireValue(condition, message = 'Data yang dikirim tidak valid.', status = 400) {
  if (!condition) throw new HttpError(status, message)
}

const json = (body, status = 200, headers = {}) => Response.json(body, {
  status, headers: { 'Cache-Control': 'no-store', ...headers },
})
const validText = (value, limit) => typeof value === 'string' && value.length <= limit
const integer = (value, min, max) => Number.isSafeInteger(value) && value >= min && value <= max
const validId = (value, pattern = idPattern) => typeof value === 'string' && pattern.test(value)

async function bodyAsJson(request) {
  requireValue(request.headers.get('content-type')?.startsWith('application/json'))
  try { return await request.json() } catch { throw new HttpError(400, 'JSON tidak valid.') }
}

function makeSupabase(url, key) {
  return async (path, { method = 'GET', token, body, contentType, prefer } = {}) => {
    const headers = { apikey: key }
    if (token) headers.Authorization = 'Bearer ' + token
    if (prefer) headers.Prefer = prefer
    if (body !== undefined) headers['Content-Type'] = contentType || 'application/json'
    const response = await fetch(url + path, {
      method, headers, signal: AbortSignal.timeout(12000),
      body: contentType ? body : body === undefined ? undefined : JSON.stringify(body),
    })
    const data = await response.json().catch(() => null)
    if (!response.ok) {
      if (response.status === 429) throw new HttpError(429, 'Terlalu banyak permintaan. Coba lagi nanti.')
      if (path === '/auth/v1/token?grant_type=password' && [400, 401, 403].includes(response.status))
        throw new HttpError(401, 'Email atau kata sandi tidak cocok.')
      if (path === '/auth/v1/user' && [401, 403].includes(response.status)) return null
      if (/^PT(404|409)$/.test(data?.code))
        throw new HttpError(Number(data.code.slice(2)), data.message)
      throw new HttpError(502, 'Penyimpanan toko belum bisa diakses.')
    }
    return data
  }
}

function cookie(value, maxAge) {
  return cookieName + '=' + value + '; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=' + maxAge
}

function sessionToken(request) {
  return request.headers.get('cookie')?.split(';').map(part => part.trim())
    .find(part => part.startsWith(cookieName + '='))?.slice(cookieName.length + 1)
}

const identity = user => user ? { id: user.id, email: user.email, admin: user.app_metadata?.arlodjie_admin === true } : null
const publicPhoto = (url, name) => url + '/storage/v1/object/public/arlodjie-photos/' + name

function validPhoto(src, url) {
  if (!validText(src, 500)) return false
  if (/^assets\/[a-z0-9-]+\.(png|jpg|webp)$/.test(src)) return true
  if (!src.startsWith(publicPhoto(url, ''))) return false
  return /^[a-f0-9-]{36}\.webp$/.test(src.slice(publicPhoto(url, '').length))
}

function productDetails(input, url) {
  requireValue(input && validId(input.id) && validText(input.name, 120) && input.name.trim()
    && validText(input.brand, 80) && input.brand.trim() && integer(input.price, 1, 1000000000000)
    && integer(input.stock, 0, 1000000))
  const product = {}
  for (const field of textFields) {
    requireValue(validText(input[field] ?? '', field === 'desc' ? 2000 : 200))
    product[field] = (input[field] ?? '').trim()
  }
  requireValue(Array.isArray(input.photos) && input.photos.length >= 1 && input.photos.length <= 6 &&
    input.photos.every(image => validPhoto(image?.src, url)))
  requireValue(Array.isArray(input.features) && input.features.length <= 40 &&
    input.features.every(feature => validText(feature, 80)))
  for (const field of ['reserveHours', 'batteryYears']) {
    const value = input[field]
    requireValue(value == null || (Number.isFinite(value) && value > 0 && value <= 10000))
    product[field] = value ?? null
  }
  return {
    ...product, id: input.id, price: input.price, stock: input.stock, features: input.features,
    img: input.photos[0].src, photos: input.photos.map(photo => ({ src: photo.src, closeup: photo.closeup === true })),
  }
}

function bannerDetails(input, url) {
  requireValue(input && ['fade', 'shift', 'none'].includes(input.effect) && [5, 7, 10].includes(input.seconds)
    && Array.isArray(input.slides) && input.slides.length <= 40)
  const slides = input.slides.map(slide => {
    requireValue(slide && validId(slide.id) && validId(slide.productId)
      && integer(slide.photo, 0, 5) && typeof slide.active === 'boolean' &&
      validText(slide.title, 65) && validText(slide.text, 150) && (!slide.custom || validPhoto(slide.custom, url)))
    const { id, productId, photo, active, title, text, custom } = slide
    return { id, productId, photo, active, title, text, ...(custom ? { custom } : {}) }
  })
  requireValue(slides.filter(slide => slide.active).length <= 3)
  return { effect: input.effect, seconds: input.seconds, slides }
}

export async function handle(request, resource) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/+$/, '')
    const key = process.env.SUPABASE_SECRET_KEY
    requireValue(supabaseUrl?.startsWith('https://') && key, 'Konfigurasi Supabase belum lengkap.', 503)
    const api = makeSupabase(supabaseUrl, key)
    const rest = (path, options) => api('/rest/v1/' + path, options)
    const rpc = (name, body) => rest('rpc/arlodjie_' + name, { method: 'POST', body })
    const url = new URL(request.url)
    const { method } = request
    const token = sessionToken(request)
    const user = async () => identity(token ? await api('/auth/v1/user', { token }) : null)
    if (method !== 'GET') {
      requireValue(!request.headers.has('origin') || request.headers.get('origin') === url.origin,
        'Asal permintaan tidak diizinkan.', 403)
    }

    if (resource === 'session') {
      if (method === 'GET') return json({ user: await user() })
      if (method === 'DELETE') return json({ user: null }, 200, { 'Set-Cookie': cookie('', 0) })
      if (method === 'POST') {
        const { email, password } = await bodyAsJson(request) || {}
        requireValue(validText(email, 254) && !!email && validText(password, 256) && !!password)
        const session = await api('/auth/v1/token?grant_type=password', { method, body: { email, password } })
        return json({ user: identity(session.user) }, 200, {
          'Set-Cookie': cookie(session.access_token, session.expires_in),
        })
      }
    }

    if (resource === 'products' && method === 'GET') {
      const products = await rest('arlodjie_products?select=data&order=created_at.asc,id.asc')
      return json(products.map(({ data }) => {
        const { scoreTotal, publicReviews, ...product } = data
        return { ...product, publicReviews: (publicReviews || []).map(({ score, text }) => ({ score, text })) }
      }))
    }
    if (resource === 'banner' && method === 'GET') {
      const [row] = await rest('arlodjie_banner?select=data&id=eq.1')
      return json(row?.data ?? null)
    }

    requireValue(['products', 'banner', 'photos', 'orders', 'review'].includes(resource), 'API tidak ditemukan.', 404)
    const actor = await user()
    requireValue(actor, 'Masuk ke akun terlebih dahulu.', 401)

    if (resource === 'orders') {
      if (method === 'GET') {
        const scope = url.searchParams.get('scope')
        if (scope === 'admin') requireValue(actor.admin, 'Akses khusus admin.', 403)
        const filter = scope === 'admin' ? '' : '&buyer=eq.' + actor.id
        const rows = await rest('arlodjie_orders?select=data&order=created_at.desc' + filter)
        return json(rows.map(row => row.data))
      }
      if (method === 'POST') {
        const { id, name, address, items } = await bodyAsJson(request) || {}
        requireValue(validId(id, uuidPattern) && validText(name, 100) && name.trim() &&
          validText(address, 500) && address.trim() && items && typeof items === 'object' && !Array.isArray(items))
        const lines = Object.entries(items)
        requireValue(lines.length > 0 && lines.length <= 100 &&
          lines.every(([product, quantity]) => idPattern.test(product) && integer(quantity, 1, 50)))
        return json(await rpc('checkout', {
          order_id: id, buyer_id: actor.id, recipient: name.trim(), address: address.trim(), requested: items,
        }), 201)
      }
      if (method === 'PATCH') {
        const { id, expected } = await bodyAsJson(request) || {}
        requireValue(validId(id, uuidPattern) && integer(expected, 0, 2))
        if (expected < 2) requireValue(actor.admin, 'Akses khusus admin.', 403)
        return json(await rpc('advance', {
          order_id: id, actor: actor.id, is_admin: actor.admin, expected,
        }))
      }
    }
    if (resource === 'review' && method === 'PUT') {
      const { order, product, score, text } = await bodyAsJson(request) || {}
      requireValue(validId(order, uuidPattern) && validId(product) &&
        integer(score, 1, 5) && validText(text, 500))
      return json(await rpc('review', {
        order_id: order, buyer_id: actor.id, product_id: product, score, review_text: text.trim(),
      }))
    }

    if (['products', 'banner', 'photos'].includes(resource))
      requireValue(actor.admin, 'Akses khusus admin.', 403)
    if (resource === 'products' && method === 'PUT') {
      const input = await bodyAsJson(request)
      const details = productDetails(input, supabaseUrl)
      requireValue(input.expectedStock == null || integer(input.expectedStock, 0, 1000000))
      await rpc('save_product', { product_id: details.id, details, expected_stock: input.expectedStock ?? null })
      return json({ id: details.id })
    }
    if (resource === 'products' && method === 'DELETE') {
      const id = url.searchParams.get('id')
      requireValue(idPattern.test(id || ''))
      await rest('arlodjie_products?id=eq.' + id, { method })
      return json({ id })
    }
    if (resource === 'banner' && method === 'PUT') {
      const data = bannerDetails(await bodyAsJson(request), supabaseUrl)
      await rest('arlodjie_banner', { method: 'POST', body: { id: 1, data }, prefer: 'resolution=merge-duplicates' })
      return json(data)
    }
    if (resource === 'photos' && method === 'POST') {
      requireValue(request.headers.get('content-type') === 'image/webp', 'Gunakan foto WebP.')
      const bytes = Buffer.from(await request.arrayBuffer())
      requireValue(bytes.length >= 16 && bytes.length <= 3000000 &&
        bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP',
        'Foto tidak valid atau ukurannya lebih dari 3 MB setelah diproses.')
      const name = randomUUID() + '.webp'
      await api('/storage/v1/object/arlodjie-photos/' + name, { method, body: bytes, contentType: 'image/webp' })
      return json({ url: publicPhoto(supabaseUrl, name) }, 201)
    }
    return json({ error: 'Metode tidak tersedia.' }, 405)
  } catch (error) {
    if (error instanceof HttpError) return json({ error: error.message }, error.status)
    return json({ error: 'Koneksi ke penyimpanan toko terganggu. Coba lagi.' }, 502)
  }
}
