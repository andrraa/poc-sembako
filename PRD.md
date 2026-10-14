# PRODUCT REQUIREMENT DOCUMENT (PRD)
**Nama Proyek:** Website Katalog Display & Pemesanan WhatsApp Toko Sembako  
**Tipe Produk:** Web Application (Display Catalog Landing Page + Admin Management & Sales Input)  
**Konteks:** Rancang Bangun Sistem Informasi Display & Analitik Penjualan Toko Sembako (Skripsi)  
**Versi Dokumen:** 1.1.0 (Revisi: Murni Display & Zero Web-Transaction)  
**Status:** Ready for Development  

---

## 1. Executive Summary & Problem Statement

### 1.1 Prinsip Desain Utama
1. **Zero Transaction on Web:** Website **murni bersifat display/katalog interaktif**. Tidak ada proses checkout keranjang rumit, tidak ada gateway pembayaran, dan tidak ada penyimpanan data order customer ke database web.
2. **Direct WhatsApp Pre-filled Order:** Tombol order langsung mengarahkan pengunjung ke obrolan WhatsApp resmi toko dengan **isi pesan yang sudah otomatis terisi (pre-filled text)** sesuai produk yang dipilih. Customer cukup menekan tombol "Send" di WhatsApp mereka.
3. **Admin Sales Input for Analytics:** Seluruh data transaksi penjualan diinput secara manual oleh Admin/Pemilik Toko (mencatat hasil penjualan harian toko offline maupun hasil closing chat WhatsApp) untuk menghasilkan analitik toko pada dashboard.

### 1.2 Masalah yang Diselesaikan
- Pelanggan tidak perlu repot mengetik ulang nama produk, satuan, dan harga saat ingin memesan sembako via WhatsApp.
- Toko memiliki etalase digital yang selalu menampilkan harga dan ketersediaan stok sembako terbaru.
- Pemilik toko memiliki wadah digital untuk mencatat riwayat penjualan harian tanpa buku tulis manual, sehingga otomatis mendapatkan grafik analitik performa toko.

---

## 2. User Persona & Scope

### 2.1 User Persona

| Persona | Peran | Alur Interaksi |
|---|---|---|
| **Pelanggan (Customer)** | Pembeli (Ecer / Grosir) | Membuka web → Melihat katalog & harga hari ini → Klik tombol pesan pada produk yang diinginkan → Aplikasi WA terbuka dengan teks otomatis → Kirim chat. |
| **Admin / Pemilik Toko** | Pengelola Toko | Login ke sistem → Input catatan penjualan harian (dari kasir/closing WA) → Pantau analitik grafik omzet & stok menipis → Update harga cepat. |

### 2.2 Batasan Sistem (Scope Boundary)

- **In-Scope (Customer):**
  - Landing page publik (responsive mobile & desktop).
  - Tampilan katalog produk dengan label harga eceran & harga grosir (beserta min. pembelian).
  - Indikator tanggal terakhir pembaruan harga (*Last Updated*).
  - Filter kategori cepat (Beras, Minyak, Gula/Tepung, Bumbu, Telur, Mie, dll) & fitur pencarian nama barang.
  - **Tombol "Pesan via WhatsApp":**
    - **Single Product Order:** Klik langsung di kartu produk → WA terbuka dengan teks produk tersebut.
    - **Multi-Product Selection (Opsional/Quick-List):** Pelanggan dapat mencentang beberapa item lalu klik "Pesan Pilihan ke WA" → WA terbuka berisi ringkasan daftar barang yang dicentang.
  - Section Review/Testimoni pelanggan dengan form kirim ulasan bintang.
  - Section QnA (Tanya Jawab) dengan komponen Accordion (buka-tutup interaktif).
  - Section Google Maps embed & info jam buka / alamat toko.
  - Floating Action Button (FAB) WhatsApp untuk chat umum/tanya-tanya.

- **In-Scope (Admin Portal):**
  - Dashboard analitik: visualisasi omzet, grafik tren penjualan mingguan/bulanan, produk terlaris (*fast-moving*), dan peringatan stok menipis.
  - Modul pencatatan/input data penjualan toko (form input item terjual untuk menyuplai data ke dashboard analitik).
  - CRUD master data: Produk (termasuk fitur *Quick-Price Edit*), Kategori, QnA/FAQ, Banner Promo.
  - Moderasi ulasan customer (approve/reject/delete).
  - Ekspor laporan penjualan ke PDF / Excel untuk kebutuhan dokumen lampiran Skripsi.
  - Pengaturan Toko: Nomor WhatsApp tujuan, alamat, link maps.

- **Out-of-Scope (Ditiadakan):**
  - Sistem pembayaran/transaksi di dalam website (Midtrans/Xendit dsb ditiadakan).
  - Registrasi & akun login untuk customer (customer hanya pengunjung publik).
  - Database penyimpanan order customer di website (data order langsung masuk sebagai obrolan chat WhatsApp toko).

---

## 3. Arsitektur Informasi & Alur Pengguna

### 3.1 Diagram Alur Pelanggan (Customer Flow)
```
[Buka Landing Page]
       │
       ├──> [Cari / Filter Produk Sembako]
       │           │
       │           ├──> (Opsi A: Klik "Pesan" di 1 Produk)
       │           │          │
       │           │          └──> Buka WhatsApp dengan teks:
       │           │               "Halo, saya ingin pesan [Produk] seharga [RpX]..."
       │           │
       │           └──> (Opsi B: Centang Beberapa Produk -> Klik "Pesan Pilihan")
       │                      │
       │                      └──> Buka WhatsApp dengan teks:
       │                           "Halo, saya ingin pesan: 1. [Produk A] 2. [Produk B]..."
       │
       ├──> [Baca QnA / Tanya Jawab via Accordion]
       ├──> [Buka Rute via Google Maps]
       └──> [Kirim Ulasan / Testimoni]
```

### 3.2 Diagram Alur Admin (Back-Office Flow)
```
[Login Admin]
       │
       ├──> [Dashboard Analitik] (Lihat grafik omzet, produk terlaris, alert stok)
       ├──> [Input Penjualan Toko] (Input manual transaksi kasir/WA -> stok berkurang -> analitik terupdate)
       ├──> [Quick-Price Edit] (Ubah harga beras/minyak di tabel -> tanggal update terpasang di web)
       ├──> [Moderasi Review & Kelola QnA Accordion]
       └──> [Ekspor Laporan Penjualan (PDF/Excel)]
```

---

## 4. Spesifikasi Pesan WhatsApp Otomatis (Pre-Filled WA Engine)

Sistem menggunakan skema URL `https://wa.me/{NO_HP}?text={URL_ENCODED_STRING}` tanpa backend pemesanan. Teks langsung dirangkai oleh JavaScript di sisi browser.

### 4.1 Skenario 1: Pesan Single Product (Langsung dari Kartu Produk)
Ketika customer menekan tombol **"Pesan via WhatsApp"** pada kartu produk:

**Draf Pesan Otomatis:**
```text
Halo Admin Toko Sembako, saya melihat produk ini di website dan ingin memesan:

- Produk: Beras Raja Udang 5kg
- Satuan: Karung
- Harga: Rp68.000 / Karung

Apakah stok produk ini masih tersedia? Terima kasih.
```

### 4.2 Skenario 2: Pesan Pilihan (Multi-Select List)
Ketika customer mencentang 2–5 produk dari daftar dan menekan tombol **"Pesan [X] Produk via WhatsApp"**:

**Draf Pesan Otomatis:**
```text
Halo Admin Toko Sembako, saya ingin memesan beberapa produk dari website:

Daftar Pesanan:
1. Beras Raja Udang 5kg (1 Karung) - Rp68.000
2. Minyak Goreng Kita 2L (2 Pouch) - Rp64.000
3. Gula Pasir Gulaku 1kg (1 Bungkus) - Rp17.500

Perkiraan Total: Rp149.500

Mohon info ketersediaan stok dan konfirmasi biaya pengantarannya ya. Terima kasih!
```

### 4.3 Skenario 3: Floating Action Button (Pertanyaan Umum)
**Draf Pesan Otomatis:**
```text
Halo Admin Toko Sembako, saya pengunjung website ingin bertanya mengenai stok dan layanan antar toko.
```

---

## 5. Spesifikasi Kebutuhan Fungsional (Functional Requirements)

### 5.1 Modul Customer (Landing Page)
- **FR-C01 (Katalog & Informasi Harga):**
  - Menampilkan foto, nama, satuan (kg, liter, pouch, dus, karung, bks).
  - Menampilkan harga eceran dan harga grosir (beserta syarat min. beli grosir).
  - Menampilkan badge tanggal update harga ("Harga per: [Tgl-Bln-Thn]").
  - Status ketersediaan: `Ready`, `Stok Terbatas`, atau `Habis`. Jika `Habis`, tombol pesan menjadi disabled / teks "Stok Kosong".
- **FR-C02 (Pencarian & Kategori):**
  - Tab kategori instan (Beras, Minyak, Telur, Gula/Tepung, Bumbu, Makanan Instan, Minuman).
  - Search input untuk memfilter nama produk dan merek secara instan.
- **FR-C03 (Tombol Pesan Otomatis):**
  - Setiap produk memiliki tombol pesan langsung ke WA (Skenario 4.1).
  - Tombol checklist ringkas untuk memilih beberapa produk sekaligus (Skenario 4.2).
- **FR-C04 (Section Ulasan & Rating):**
  - Menampilkan ulasan approved berserta bintang (1-5).
  - Form submit ulasan baru (nama, bintang, pesan) dengan status awal `pending`.
- **FR-C05 (Section QnA dengan Accordion Interaktif):**
  - **Komponen Accordion:**
    - Tampilan list tanya-jawab di mana tiap item terdiri dari Header Pertanyaan + Indikator Panah/Chevron (berotasi 180° saat terbuka).
    - Mekanisme klik: Mengklik header akan membuka (*expand*) teks jawaban dengan animasi *smooth slide*, dan mengklik kembali akan menutupnya (*collapse*).
    - Status default: Pertanyaan pertama dalam posisi terbuka (*open by default*), pertanyaan lainnya tertutup agar halaman tetap ringkas.
  - **Daftar Konten Standar QnA Toko Sembako:**
    1. *Q1: Apakah pesanan sembako bisa diantar ke rumah?*  
       *A1:* Bisa! Toko melayani pengantaran untuk wilayah sekitar toko (radius hingga 5 km) dengan minimal belanja Rp50.000. Gratis ongkir berlaku untuk belanja di atas Rp150.000.
    2. *Q2: Bagaimana cara memesan lewat website ini?*  
       *A2:* Cukup pilih produk yang ingin dibeli, klik tombol "Pesan via WhatsApp", lalu kirim pesan otomatis yang sudah terisi nama produk dan harganya ke admin kami.
    3. *Q3: Apa syarat mendapatkan harga grosir?*  
       *A3:* Harga grosir berlaku otomatis jika Anda membeli dalam jumlah tertentu sesuai ketentuan per item (misalnya beras min. 2 karung, mie instan min. 1 dus, atau minyak min. 6 pouch).
    4. *Q4: Metode pembayaran apa saja yang didukung?*  
       *A4:* Kami menerima pembayaran Tunai/COD (bayar di tempat saat kurir sampai), Transfer Bank (BCA/BRI/Mandiri), dan QRIS.
    5. *Q5: Bagaimana jika ada barang rusak atau telur pecah saat diterima?*  
       *A5:* Harap periksa pesanan saat kurir toko menyerahkan barang. Jika terdapat telur pecah atau kemasan bocor, kami langsung ganti di tempat atau potong tagihan pembayaran.
- **FR-C06 (Section Lokasi & Maps):**
  - Embed Google Maps interaktif lokasi fisik toko.
  - Alamat lengkap dan tombol redirect ke aplikasi Google Maps.
- **FR-C07 (Floating Button WhatsApp):**
  - Tombol icon WA melayang di kanan bawah layar dengan teks pre-filled umum.

### 5.2 Modul Admin (Dashboard & Manajemen)
- **FR-A01 (Autentikasi):** Login username & password untuk admin/pemilik toko.
- **FR-A02 (Dashboard Analitik):**
  - Kartu Ringkasan: Omzet Hari Ini, Omzet Bulan Ini, Total Transaksi, Jumlah Produk Kritis.
  - Grafik Garis: Tren omzet harian 30 hari terakhir.
  - Top 5 Produk Terlaris (*Fast-Moving Item*).
  - Rekomendasi / Alert: Daftar produk stok menipis (< batas minimum) dan produk tidak bergerak (> 14 hari tanpa penjualan).
- **FR-A03 (Modul Input Penjualan Manual):**
  - Antarmuka form kasir untuk mencatat penjualan harian:
    - Pilih barang (search / dropdown)
    - Input jumlah (qty)
    - Pilih skema harga (Eceran atau Grosir)
    - Pilih tipe transaksi: `Toko Offline (Langsung)` atau `Pemesanan via WhatsApp`
    - Klik "Simpan Penjualan"
  - Otomatis memotong stok barang di database dan menyuplai data ke dashboard analitik.
- **FR-A04 (Quick-Price Edit):**
  - Tabel ringkas master produk di mana admin bisa langsung mengedit harga ecer, harga grosir, dan jumlah stok di kolom tabel tanpa harus buka-tutup modal form satu per satu.
  - Mengupdate field `updated_at` untuk label display pelanggan.
- **FR-A05 (CRUD Data):** Kelola produk, kategori produk, QnA Accordion (tambah/edit pertanyaan & jawaban, urutan tampilan, status aktif), dan moderasi ulasan masuk.
- **FR-A06 (Laporan & Ekspor):** Filter data penjualan berdasarkan tanggal dan tombol ekspor ke format PDF / Excel.

---

## 6. Desain Basis Data (Database Schema)

Karena tidak ada transaksi customer di web, tabel transaksi murni menampung data **input penjualan oleh admin**:

```
[ users ] (Admin)
    │
[ categories ] ──────< [ products ] ──────< [ sale_items ] >────── [ sales ]
                                                 (Diinput Admin)
[ reviews ] (Publik -> Moderasi Admin)
[ qna_items / faqs ] (Dikelola Admin)
[ store_settings ] (Konfigurasi No. WA, Alamat, dll)
```

### 6.1 Tabel `products`
| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | INT, PK, AI | ID produk |
| `category_id` | INT, FK | Relasi ke `categories.id` |
| `name` | VARCHAR(150) | Nama produk (misal: Beras Ramos 5kg) |
| `unit` | VARCHAR(30) | Satuan (kg, liter, pouch, dus, bks) |
| `price_ecer` | DECIMAL(12,2) | Harga eceran |
| `price_grosir` | DECIMAL(12,2) | Harga grosir |
| `min_qty_grosir`| INT | Min. beli grosir (contoh: 5) |
| `stock` | INT | Jumlah stok fisik di toko |
| `min_stock_alert`| INT, Default 5 | Batas stok kritis pemicu alert admin |
| `image` | VARCHAR(255), Nullable | Nama file foto |
| `is_active` | BOOLEAN, Default 1 | 1 = Tampil di display, 0 = Sembunyi |
| `updated_at` | DATETIME | Waktu update (penanda update harga display) |
| `created_at` | DATETIME | Waktu produk dibuat |

### 6.2 Tabel `sales` (Pencatatan Penjualan oleh Admin)
| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | INT, PK, AI | ID transaksi |
| `invoice_number` | VARCHAR(50), Unique | Contoh: `TRX-20261007-001` |
| `user_id` | INT, FK | ID admin yang menginput |
| `channel` | ENUM('offline', 'whatsapp') | Sumber penjualan |
| `customer_name` | VARCHAR(100), Nullable | Nama pembeli (opsional) |
| `total_amount` | DECIMAL(14,2) | Total nilai penjualan |
| `created_at` | DATETIME | Tanggal & waktu transaksi |

### 6.3 Tabel `sale_items` (Rincian Barang Terjual)
| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | INT, PK, AI | ID rincian item |
| `sale_id` | INT, FK | Relasi ke `sales.id` |
| `product_id` | INT, FK | Relasi ke `products.id` |
| `qty` | INT | Kuantitas terjual |
| `price_type` | ENUM('ecer', 'grosir') | Skema harga |
| `unit_price` | DECIMAL(12,2) | Harga satuan pada saat terjual |
| `subtotal` | DECIMAL(14,2) | `qty * unit_price` |

### 6.4 Tabel `reviews`, `qna_faqs`, `store_settings`
- `reviews`: `id`, `customer_name`, `rating` (1-5), `comment`, `status` (`pending`, `approved`, `rejected`), `created_at`.
- `qna_faqs`: `id`, `question` (VARCHAR), `answer` (TEXT), `display_order` (INT), `is_active` (BOOLEAN).
- `store_settings`: `key_name` (PK), `value` (contoh: `whatsapp_number = 6281234567890`).

---

## 7. Matriks Pengujian Black-Box (Lampiran Bab IV Skripsi)

| Kode Uji | Skenario | Langkah Pengujian | Hasil yang Diharapkan | Status |
|---|---|---|---|---|
| **TC-01** | Filter Kategori | Klik kategori "Minyak Goreng" | Hanya menampilkan produk kategori minyak goreng | Valid |
| **TC-02** | Pencarian Produk | Ketik "Beras" di kotak pencarian | Menampilkan semua produk beras yang relevan | Valid |
| **TC-03** | Order 1 Produk ke WA | Klik "Pesan via WhatsApp" pada Beras 5kg | Tab WhatsApp terbuka dengan teks nama barang & harga sudah terisi | Valid |
| **TC-04** | Order Multi-Produk ke WA | Centang 3 produk dan klik "Pesan Pilihan" | Tab WhatsApp terbuka dengan rangkuman 3 produk & perkiraan total | Valid |
| **TC-05** | QnA Accordion | Klik judul pertanyaan pada section QnA | Konten jawaban terbuka mulus dengan ikon chevron berputar; klik lagi menutup kembali | Valid |
| **TC-06** | Kirim Ulasan | Isi form nama, rating 5 bintang, lalu kirim | Notifikasi sukses; ulasan tersimpan dengan status `pending` | Valid |
| **TC-07** | Input Penjualan Admin | Admin input 2 item di modul kasir dan simpan | Data tersimpan di tabel `sales`, stok produk otomatis berkurang | Valid |
| **TC-08** | Quick-Price Edit | Admin ganti harga di tabel admin langsung | Nilai tersimpan di DB & tanggal update harga di display diperbarui | Valid |
| **TC-09** | Analitik Dashboard | Buka halaman dashboard admin | Angka omzet dan grafik tren otomatis terisi dari tabel `sales` | Valid |
| **TC-10** | Ekspor Laporan | Klik tombol "Ekspor PDF" | File laporan penjualan terunduh sesuai periode filter | Valid |

---

## 8. Ringkasan Perbedaan dari Versi Sebelumnya

| Komponen | Konsep E-Commerce Standar | Konsep Ini (Display + WhatsApp Lead) |
|---|---|---|
| **Transaksi Web** | Ada (Checkout, Form Alamat, Payment) | **DITIADAKAN (Murni Display)** |
| **Tindakan Pembelian** | Masuk Database Order Web | **Direct WhatsApp Pre-filled URL** |
| **Akun Customer** | Wajib Login / Register | **Tanpa Login (Langsung Akses)** |
| **Sumber Data Analitik** | Order masuk di website | **Input Manual Kasir / Penjualan Toko oleh Admin** |
| **Kerumitan Skripsi** | Sangat rentan error di gateway & stok gantung | **Aman, simpel, tepat sasaran untuk UMKM toko sembako** |
