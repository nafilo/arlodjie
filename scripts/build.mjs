import { cp, mkdir } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const output = new URL('dist/', root)
await mkdir(output, { recursive: true })
const files = [
  'index.html', 'styles.css', 'banner.css', 'image-file.js', 'photo-storage.js',
  'shop-api.js', 'banner.js', 'prototype.js', 'pwa.js', 'sw.js', 'app.webmanifest',
  'logo.svg', 'lockup.svg', 'assets',
]
await Promise.all(files.map(file => cp(new URL(file, root), new URL(file, output), { recursive: true })))
