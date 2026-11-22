# Arlodjie — Toko Jam Tangan

[File Arlodjie di Figma](https://www.figma.com/design/2DYQzdL0amVGCPX1zc6pG3)

Lihat [Panduan deploy PWA](DEPLOY.md) untuk konfigurasi Supabase, API Arlodjie, dan Vercel Hobby.

Buka `index.html` untuk mencoba prototipe. Harga, stok, dan transaksi bersifat demonstrasi. Perubahan tersimpan di browser yang sama.

- **Belanja.** Pilih jam, checkout, buka **Akun → Panel admin → Pesanan**, konfirmasi dan tandai dikirim. Buka **Akun → Riwayat Pesanan**, terima pesanan, lalu beri rating.
- **Publikasi.** Buka **Akun → Panel admin → Tambah produk**, isi detail dan unggah sampai enam foto, pilih sampul, lalu terbitkan. Foto bisa ditambah atau dihapus ketika mengedit produk.
- **Banner.** Buka **Akun → Panel admin → Banner beranda** untuk memilih jam, mengatur foto dan transisi, lalu menyimpan hingga tiga slide aktif.
- **Galeri produk.** Ketuk indikator foto di kartu katalog atau pilih thumbnail di halaman detail. Galeri demo menggunakan foto utama dan tampilan close-up dari sumber yang sama.

Logo vektor tersedia dalam `lockup.svg`, `logo.svg`, dan `logo-mono.svg`. Ekspor layar dan papan Figma dibuat di folder lokal `figma-import`. SVG menyimpan elemen visual dalam lapisan terpisah. Interaksi prototipe dijalankan oleh halaman HTML.

Untuk menjalankan pengecekan Chrome serta membuat ulang SVG, jalankan `node Arlodjie/verify-and-export.mjs` dari akar workspace. Script menguji pembelian sampai pemberian rating serta publikasi dan penyuntingan spesifikasi produk.

Foto katalog digunakan untuk ilustrasi prototipe dan berasal dari situs produsen atau penjual. Sumber spesifikasi disimpan pada data produk. Harga dan stok adalah data demo.
