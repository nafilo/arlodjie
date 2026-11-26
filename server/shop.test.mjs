import assert from 'node:assert/strict'
import { test } from 'node:test'
import { handle } from './shop.mjs'

const site = 'https://arlodjie.example.invalid'
const env = {
  SUPABASE_URL: 'https://supabase.example.invalid',
  SUPABASE_SECRET_KEY: 'test-key',
}

function setup(t, supabase) {
  for (const [key, value] of Object.entries(env)) {
    const previous = process.env[key]
    process.env[key] = value
    t.after(() => {
      if (previous === undefined) delete process.env[key]
      else process.env[key] = previous
    })
  }
  t.mock.method(globalThis, 'fetch', (url, options) => supabase(new URL(url), options))
}

function call(resource, { method = 'POST', token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Cookie = 'arlodjie_session=' + token
  return handle(new Request(site + '/api/' + resource, {
    method, headers, body: body === undefined ? undefined : JSON.stringify(body),
  }), new URL(site + '/api/' + resource).pathname.split('/').at(-1))
}

const account = admin => ({
  id: '11111111-1111-4111-8111-111111111111',
  email: 'account@example.invalid',
  app_metadata: { arlodjie_admin: admin },
})

test('brand logos can be read publicly and only admins can save an uploaded logo', async t => {
  const src = env.SUPABASE_URL + '/storage/v1/object/public/arlodjie-photos/22222222-2222-4222-8222-222222222222.webp'
  const logo = { brand: 'Grand Seiko', src }
  let stored = []
  setup(t, (url, options) => {
    if (url.pathname === '/auth/v1/user')
      return Response.json(account(options.headers.Authorization === 'Bearer admin'))
    assert.equal(url.pathname, '/rest/v1/arlodjie_brand_logos')
    if (options.method === 'GET') return Response.json(stored)
    assert.equal(options.headers.Prefer, 'resolution=merge-duplicates')
    const { brand_key, ...row } = JSON.parse(options.body)
    assert.equal(brand_key, 'grand seiko')
    stored = [row]
    return new Response(null, { status: 201 })
  })
  const save = (body, token) => call('brand-logos', { method: 'PUT', body, token })
  assert.equal((await save(logo)).status, 401)
  assert.equal((await save(logo, 'buyer')).status, 403)
  assert.equal((await save({ ...logo, src: 'https://example.invalid/logo.webp' }, 'admin')).status, 400)
  const response = await save({ ...logo, brand: ' Grand Seiko ' }, 'admin')
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), logo)
  const publicResponse = await call('brand-logos', { method: 'GET' })
  assert.deepEqual(await publicResponse.json(), [logo])
})

test('one login derives the account role from Supabase', async t => {
  setup(t, (url, { body }) => {
    assert.equal(url.pathname, '/auth/v1/token')
    const credentials = JSON.parse(body)
    assert.deepEqual(Object.keys(credentials).sort(), ['email', 'password'])
    const admin = credentials.email === 'staff@example.invalid'
    return Response.json({ user: account(admin), access_token: 'test-token', expires_in: 3600 })
  })

  for (const [email, expectedAdmin] of [['staff@example.invalid', true], ['admin@example.invalid', false]]) {
    const response = await call('session', { body: { email, password: 'test-password', admin: !expectedAdmin } })
    assert.equal(response.status, 200)
    assert.match(response.headers.get('set-cookie'), /HttpOnly/)
    assert.equal((await response.json()).user.admin, expectedAdmin)
  }
})

test('admin cannot check out, confirm delivery as a buyer, or review', async t => {
  let upstreamCalls = 0
  setup(t, url => {
    upstreamCalls += 1
    assert.equal(url.pathname, '/auth/v1/user')
    return Response.json(account(true))
  })
  const token = 'test-token'
  const order = '22222222-2222-4222-8222-222222222222'
  assert.equal((await call('orders', { token, body: {} })).status, 403)
  assert.equal((await call('orders', { token, method: 'PATCH', body: { id: order, expected: 2 } })).status, 403)
  assert.equal((await call('review', { token, method: 'PUT', body: {} })).status, 403)
  assert.equal(upstreamCalls, 3)
})

test('buyer-controlled metadata cannot grant admin access', async t => {
  setup(t, url => {
    assert.equal(url.pathname, '/auth/v1/user')
    return Response.json({ ...account(false), user_metadata: { arlodjie_admin: true } })
  })
  const token = 'test-token'
  const response = await call('session', { token, method: 'GET' })
  assert.equal((await response.json()).user.admin, false)
  assert.equal((await call('orders?scope=admin', { token, method: 'GET' })).status, 403)
})

test('registration creates a confirmed buyer through Supabase Auth', async t => {
  setup(t, (url, { body, headers, method }) => {
    assert.equal(url.pathname, '/auth/v1/admin/users')
    assert.equal(url.search, '')
    assert.equal(method, 'POST')
    assert.equal(headers.apikey, env.SUPABASE_SECRET_KEY)
    assert.deepEqual(JSON.parse(body), {
      email: 'buyer@example.invalid',
      password: 'test-password',
      email_confirm: true,
    })
    return Response.json(account(false))
  })
  const response = await call('register', {
    body: { email: 'buyer@example.invalid', password: 'test-password', app_metadata: { arlodjie_admin: true } },
  })
  assert.equal(response.status, 201)
  assert.equal(response.headers.get('set-cookie'), null)
  assert.deepEqual(await response.json(), { created: true })
  const callback = await call('register?code=example', { method: 'GET' })
  assert.equal(callback.status, 303)
  assert.equal(callback.headers.get('location'), '/#masuk')
})

test('registration does not modify an existing account', async t => {
  let upstreamCalls = 0
  setup(t, (url, { method }) => {
    upstreamCalls += 1
    assert.equal(url.pathname, '/auth/v1/admin/users')
    assert.equal(method, 'POST')
    return Response.json({ code: 'email_exists' }, { status: 422 })
  })
  const response = await call('register', { body: { email: 'buyer@example.invalid', password: 'test-password' } })
  assert.equal(response.status, 409)
  assert.equal(upstreamCalls, 1)
})
