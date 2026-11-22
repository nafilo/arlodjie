# Deploy Arlodjie

Arlodjie memakai halaman statis untuk PWA, fungsi Node.js di Vercel untuk API Arlodjie, dan Supabase untuk Auth, PostgreSQL, serta foto produk dan banner. Checkout memakai simulasi pembayaran. Gunakan akun dan alamat fiktif saat mendemokan aplikasi.

## 1. Siapkan Supabase

1. Buat proyek baru di [Supabase Dashboard](https://supabase.com/dashboard) dengan paket **Free**. Pilih region terdekat yang tersedia dan simpan kata sandi database di pengelola kata sandimu. Aplikasi tidak memerlukan kata sandi database.
2. Buka **SQL Editor → New query**. Salin seluruh [supabase/setup.sql](supabase/setup.sql) dan klik **Run**. Skrip menyiapkan tabel, aturan akses API, fungsi checkout, bucket publik untuk foto katalog, dan delapan produk demo. Gunakan proyek khusus Arlodjie karena secret key memberi akses luas ke proyek.
3. Buka **Authentication → Users → Add user → Create new user**. Buat satu akun admin dan aktifkan **Auto Confirm User**. Pembeli bisa membuat akun sendiri melalui web.
4. Di **SQL Editor**, jalankan kueri berikut. Ganti email contoh dengan email akun admin yang barusan dibuat.

   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
     || '{"arlodjie_admin": true}'::jsonb
   where email = 'admin@example.com'
   returning id, email;
   ```

   Hasilnya harus satu baris. Akun pembeli cukup memakai peran bawaan. Login kembali jika admin sebelumnya sudah masuk.
5. Buka **Connect** untuk menyalin Project URL, lalu **Settings → API Keys → Secret keys** untuk memperoleh key berawalan sb_secret_. Simpan keduanya untuk diisi langsung di Vercel. Tabel hanya dapat diakses oleh peran server. API memvalidasi identitas dan memeriksa izin admin di server sebelum mengubah data.

API membaca `app_metadata.arlodjie_admin` dari akun Supabase. Hanya nilai boolean `true` yang membuka akses admin. Form pendaftaran web hanya membuat akun pembeli. Untuk membuat admin baru, gunakan **Add user** dan kueri pada langkah 4. Kedua peran memakai halaman `/#masuk`, dan akun admin langsung diarahkan ke panelnya.

Rujukan [Kunci API Supabase](https://supabase.com/docs/guides/getting-started/api-keys) · [Pengaturan Auth](https://supabase.com/docs/guides/auth/general-configuration)

## 2. Deploy ke Vercel

1. Pastikan commit Arlodjie yang ingin diterbitkan sudah ada di **main** di GitHub. Jika commit terbaru masih lokal, jalankan perintah berikut dari folder Arlodjie saat siap menerbitkan.

   ```powershell
   git push origin main
   ```
2. Di [Vercel](https://vercel.com/dashboard), pilih akun personal **Hobby**, lalu **Add New → Project** dan impor repo GitHub **arlodjie**. Untuk repo khusus Arlodjie, biarkan **Root Directory** di akar repo. **Framework Preset** memakai **Other**. Build dan output sudah diatur oleh vercel.json.
3. Tambahkan dua **Environment Variables** melalui dashboard. Atur untuk **Preview** dan **Production** jika kamu ingin menguji keduanya.

   | Nama | Nilai dari Supabase |
   | --- | --- |
   | SUPABASE_URL | Project URL, bentuknya https://<project-ref>.supabase.co |
   | SUPABASE_SECRET_KEY | Secret key berawalan sb_secret_. Tandai **Sensitive**. |

   Simpan nilai di Vercel. Repo hanya memuat nama variabel di .env.example. Hindari memasukkan kunci ke tangkapan layar, percakapan, atau source code.
4. Jika proyek sebelumnya memakai **pwa-deploy**, buka **Settings → Environments → Production → Branch Tracking** dan pilih **main** setelah commit terbaru tersedia di GitHub. Buka **Deployments → ⋯ → Create Deployment**, masukkan **main**, lalu klik **Create Deployment**. Pastikan commit terbaru berstatus **Ready**. Perubahan env berlaku untuk deployment berikutnya.

Rujukan [Deploy repo Git](https://vercel.com/docs/git) · [Buat deployment dari branch](https://vercel.com/changelog/manually-create-deployments-by-commit-or-branch-in-the-dashboard) · [Environment Variables](https://vercel.com/docs/environment-variables) · [Vercel Hobby](https://vercel.com/docs/plans/hobby)

## 3. Pendaftaran pembeli

Pembeli membuka `/#daftar`, membuat akun, lalu langsung bisa masuk melalui `/#masuk`. API Arlodjie membuat akun di **Supabase Auth** menggunakan konfigurasi server yang sudah ada. SMTP dan tautan konfirmasi tidak diperlukan. Gunakan email uji karena alur demo ini tidak memeriksa kepemilikan alamat email.

Rujukan [Membuat akun dengan Supabase Auth Admin API](https://supabase.com/docs/reference/javascript/auth-admin-createuser)

## 4. Uji hasilnya

- Buka **/api/products** pada domain deployment. Respons yang benar berupa JSON dengan delapan jam demo. **/api/banner** boleh berisi null sampai admin menyimpan banner. **/api/orders** dari jendela penyamaran sebelum login seharusnya memberi HTTP 401.
- Daftarkan akun uji lewat **Buat akun**. Pastikan akun baru tampil di **Authentication → Users** dan bisa langsung masuk. Kemudian uji produk baru dan edit harga melalui panel admin. Pastikan perubahan terlihat di `public.arlodjie_products` dan di katalog dari jendela penyamaran.
- Masuk sebagai pembeli. Buka satu jam, pilih **Beli sekarang**, dan buat pesanan dengan alamat fiktif. Periksa **Riwayat Pesanan**. Dengan akun pembeli kedua yang berbeda, pastikan pesanan pertama tidak muncul.
- Di browser lain, buka `/#masuk` dan gunakan akun admin. Pastikan aplikasi langsung membuka panel admin. Terbitkan satu produk dengan beberapa foto, simpan banner, lalu konfirmasi dan tandai pesanan dikirim. Pastikan akun admin langsung kembali ke panel jika membuka checkout. Sebagai pembeli, muat ulang pesanan, klik **Pesanan diterima**, lalu beri rating.
- Uji **Keluar dari akun** dari halaman Akun Saya dan **Keluar** dari header panel admin. Keduanya kembali ke halaman masuk yang sama.
- Di Chrome, buka URL HTTPS dan instal melalui menu browser. Pada Safari iPhone, gunakan **Add to Home Screen**. Setelah katalog dimuat, coba buka ulang PWA saat offline. Antarmuka, katalog yang sudah tercache, serta foto demo dapat dibuka. Checkout, login, dan perubahan admin memerlukan koneksi.
- Cantumkan URL publik dan tautan repo GitHub sesuai kolom pengumpulan, cek keunikan judul, dan catat minimal satu asistensi sesuai ketentuan TA.

## Data demo dan penyimpanan

Membuka index.html sebagai file lokal tetap menjalankan prototipe browser. Deployment memakai data Supabase sehingga katalog dan banner yang disimpan admin bisa dilihat dari perangkat lain. Pesanan dan rating juga tersimpan di Supabase. Keranjang, favorit, dan profil tampilan tersimpan di browser per akun. Perubahan lama dari mode file lokal tidak ikut berpindah ke deployment.
