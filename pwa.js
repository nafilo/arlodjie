const installButton = document.querySelector('#install-app')
const installHelp = document.querySelector('#install-help')
const standalone = matchMedia('(display-mode: standalone)')
const webOrigin = ['https:', 'http:'].includes(location.protocol)
const appleMobile = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
let installPrompt
let installed = false

function updateInstallButton() {
  installButton.hidden = installed || standalone.matches || navigator.standalone === true
}

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault()
  installPrompt = event
})
window.addEventListener('appinstalled', () => {
  installPrompt = undefined
  installed = true
  if (installHelp.open) installHelp.close()
  updateInstallButton()
})
standalone.addEventListener('change', updateInstallButton)
installButton.addEventListener('click', async () => {
  if (installPrompt) {
    const prompt = installPrompt
    installPrompt = undefined
    installButton.disabled = true
    try {
      await prompt.prompt()
      return
    } catch { /* Show manual instructions when the prompt is unavailable. */ }
    finally { installButton.disabled = false }
  }

  let instructions = 'Buka menu browser, lalu pilih Instal aplikasi atau Tambahkan ke layar utama jika tersedia.'
  if (!webOrigin || !window.isSecureContext) {
    instructions = 'Buka Arlodjie dari alamat HTTPS di browser HP untuk memasangnya.'
  } else if (appleMobile) {
    instructions = 'Buka Arlodjie di Safari, ketuk Bagikan, lalu pilih Tambahkan ke Layar Utama. Aktifkan Buka sebagai App Web jika tersedia, lalu ketuk Tambah.'
  }
  document.querySelector('#install-help-copy').textContent = instructions
  installHelp.showModal()
})
updateInstallButton()

if (webOrigin) {
  const manifest = document.createElement('link')
  manifest.rel = 'manifest'
  manifest.href = 'app.webmanifest'
  document.head.append(manifest)
  if (window.isSecureContext && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(error => console.warn('Mode luring Arlodjie belum siap.', error))
  }
}
