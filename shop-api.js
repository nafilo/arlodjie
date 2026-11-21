const shopApi = (() => {
  const enabled = ['http:', 'https:'].includes(location.protocol)

  async function request(resource, method = 'GET', data) {
    let response
    try {
      const photo = data instanceof Blob
      response = await fetch('./api/' + resource, {
        method,
        headers: data === undefined ? {} : {'Content-Type': photo ? data.type : 'application/json'},
        body: data === undefined || photo ? data : JSON.stringify(data),
        signal: AbortSignal.timeout(20000),
      })
    } catch {
      throw new Error('Koneksi ke toko terputus. Coba lagi saat online.')
    }
    const result = await response.json().catch(() => undefined)
    if (!response.ok || result === undefined) {
      const error = new Error(result?.error || 'Toko belum bisa diakses. Coba lagi nanti.')
      error.status = response.status
      throw error
    }
    return result
  }

  async function upload(source) {
    const preview = await preparePhoto(source, {maxSize: 1200})
    const blob = await (await fetch(preview)).blob()
    const {url} = await request('photos', 'POST', blob)
    return url
  }

  return {enabled, request, upload}
})()
