# Deploy Arlodjie

Arlodjie memakai halaman statis untuk PWA, fungsi Node.js di Vercel untuk API Arlodjie, dan Supabase untuk Auth, PostgreSQL, serta foto produk dan banner. Checkout memakai simulasi pembayaran. Gunakan akun dan alamat fiktif saat mendemokan aplikasi.

## 1. Siapkan Supabase

1. Buat proyek baru di [Supabase Dashboard](https://supabase.com/dashboard) dengan paket **Free**. Pilih region terdekat yang tersedia dan simpan kata sandi database di pengelola kata sandimu. Aplikasi tidak memerlukan kata sandi database.
2. Buka **SQL Editor → New query**. Salin seluruh [supabase/setup.sql](supabase/setup.sql) dan klik **Run**. Skrip menyiapkan tabel, aturan akses API, fungsi checkout, bucket publik untuk foto katalog, dan delapan produk demo. Gunakan proyek khusus Arlodjie karena secret key memberi akses luas ke proyek.
3. Buka **Authentication → Users → Add user → Create new user**. Buat satu akun admin dan aktifkan **Auto Confirm User**. Pembeli bisa mendaftar melalui web setelah konfigurasi email pada bagian 3. Untuk uji checkout sebelum mengatur email, buat satu akun pembeli demo lewat dashboard dan aktifkan **Auto Confirm User**.
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

Rujukan [Kunci API Supabase](https://supabase.com/docs/guides/getting-started/api-keys) · [Pengaturan Auth](https://supabase.com/docs/guides/auth/general-configuration)

## 2. Deploy ke Vercel

1. Pastikan branch **pwa-deploy** sudah ada di GitHub. Dari folder Arlodjie, jalankan perintah berikut jika branch itu masih hanya ada di komputermu.

   ```powershell
   git push -u origin pwa-deploy
   ```
2. Di [Vercel](https://vercel.com/dashboard), pilih akun personal **Hobby**, lalu **Add New → Project** dan impor repo GitHub **arlodjie**. Untuk repo khusus Arlodjie, biarkan **Root Directory** di akar repo. **Framework Preset** memakai **Other**. Build dan output sudah diatur oleh vercel.json.
3. Tambahkan dua **Environment Variables** melalui dashboard. Atur untuk **Preview** dan **Production** jika kamu ingin menguji keduanya.

   | Nama | Nilai dari Supabase |
   | --- | --- |
   | SUPABASE_URL | Project URL, bentuknya https://<project-ref>.supabase.co |
   | SUPABASE_SECRET_KEY | Secret key berawalan sb_secret_. Tandai **Sensitive**. |

   Simpan nilai di Vercel. Repo hanya memuat nama variabel di .env.example. Hindari memasukkan kunci ke tangkapan layar, percakapan, atau source code.
4. Jika impor awal memakai main, buka **Settings → Environments → Production → Branch Tracking** dan pilih **pwa-deploy**. Lalu buka **Deployments → ⋯ → Create Deployment**, masukkan nama branch tersebut dan klik **Create Deployment**. Pastikan commit dari branch tersebut berstatus **Ready**. Perubahan env berlaku untuk deployment berikutnya.

Rujukan [Deploy repo Git](https://vercel.com/docs/git) · [Buat deployment dari branch](https://vercel.com/changelog/manually-create-deployments-by-commit-or-branch-in-the-dashboard) · [Environment Variables](https://vercel.com/docs/environment-variables) · [Vercel Hobby](https://vercel.com/docs/plans/hobby)

## 3. Aktifkan pendaftaran pembeli

1. Di Supabase, buka **Authentication → Sign In / Providers**. Aktifkan pendaftaran pengguna baru dan **Confirm email** pada provider Email.
2. Di **Authentication → URL Configuration**, isi **Site URL** dengan domain Vercel produksi, misalnya `https://arlodjie.vercel.app`. Tambahkan `https://arlodjie.vercel.app/api/register` ke **Redirect URLs**. Gunakan domain deployment kamu pada kedua nilai. Untuk menguji Preview, tambah URL callback Preview yang tepat dengan path yang sama.
3. Atur **Custom SMTP** di Supabase untuk mengirim konfirmasi ke pembeli umum. Pengirim bawaan Supabase hanya melayani alamat anggota tim proyek. Masukkan kredensial SMTP melalui dashboard Supabase.
4. Gunakan tautan **Confirm signup** bawaan Supabase. Pembeli membuka `/#daftar`, memverifikasi email, lalu masuk melalui `/#masuk`. Akun pembeli terdaftar di Supabase Auth tanpa pengaturan role. Akun admin yang dibuat melalui langkah 1 masuk melalui `/#admin/masuk`.

Rujukan [Pendaftaran email dan kata sandi](https://supabase.com/docs/guides/auth/passwords) · [Pembatasan email bawaan dan Custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp)

## 4. Uji hasilnya

- Buka **/api/products** pada domain deployment. Respons yang benar berupa JSON dengan delapan jam demo. **/api/banner** boleh berisi null sampai admin menyimpan banner. **/api/orders** dari jendela penyamaran sebelum login seharusnya memberi HTTP 401.
- Masuk sebagai pembeli. Buka satu jam, pilih **Beli sekarang**, dan buat pesanan dengan alamat fiktif. Periksa **Riwayat Pesanan**. Dengan akun pembeli kedua yang berbeda, pastikan pesanan pertama tidak muncul.
- Di browser lain, buka `/#admin/masuk` dan masuk sebagai admin. Terbitkan satu produk dengan beberapa foto, simpan banner, lalu konfirmasi dan tandai pesanan dikirim. Pastikan akun admin langsung kembali ke panel jika membuka checkout. Sebagai pembeli, muat ulang pesanan, klik **Pesanan diterima**, lalu beri rating.
- Di Chrome, buka URL HTTPS dan instal melalui menu browser. Pada Safari iPhone, gunakan **Add to Home Screen**. Setelah katalog dimuat, coba buka ulang PWA saat offline. Antarmuka, katalog yang sudah tercache, serta foto demo dapat dibuka. Checkout, login, dan perubahan admin memerlukan koneksi.
- Cantumkan URL publik dan tautan repo GitHub sesuai kolom pengumpulan, cek keunikan judul, dan catat minimal satu asistensi sesuai ketentuan TA.

## Data demo dan penyimpanan

Membuka index.html sebagai file lokal tetap menjalankan prototipe browser. Deployment memakai data Supabase sehingga katalog dan banner yang disimpan admin bisa dilihat dari perangkat lain. Pesanan dan rating juga tersimpan di Supabase. Keranjang, favorit, dan profil tampilan tersimpan di browser per akun. Perubahan lama dari mode file lokal tidak ikut berpindah ke deployment.
