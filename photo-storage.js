// Keep the original uploads outside the small localStorage quota.
const savedPhotoFiles = (() => {
  let opening
  function open() {
    if (!opening) opening = new Promise((resolve, reject) => {
      const request = indexedDB.open('arlodjie-photos', 1)
      request.onupgradeneeded = () => request.result.createObjectStore('files')
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => { opening = undefined; reject(request.error) }
    })
    return opening
  }
  return {
    async put(entries) {
      if (!entries.length) return
      const db = await open()
      await new Promise((resolve, reject) => {
        const tx = db.transaction('files', 'readwrite')
        tx.oncomplete = resolve
        tx.onabort = () => reject(tx.error)
        for (const [key, file] of entries) tx.objectStore('files').put(file, key)
      })
    },
    async get(keys) {
      const files = new Map()
      if (!keys.length) return files
      const db = await open()
      await new Promise((resolve, reject) => {
        const tx = db.transaction('files', 'readonly')
        tx.oncomplete = resolve
        tx.onabort = () => reject(tx.error)
        for (const key of keys) {
          const request = tx.objectStore('files').get(key)
          request.onsuccess = () => { if (request.result) files.set(key, request.result) }
        }
      })
      return files
    },
  }
})()
