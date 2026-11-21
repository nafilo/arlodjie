// Directly opening index.html is also supported. Installation requires a web origin.
if (location.protocol === 'https:' || location.protocol === 'http:') {
  const manifest = document.createElement('link')
  manifest.rel = 'manifest'
  manifest.href = 'app.webmanifest'
  document.head.append(manifest)
  if (window.isSecureContext && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(error => console.warn('Mode luring Arlodjie belum siap.', error))
  }
}
