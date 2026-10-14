# AHP dan analitik penjualan — Toko Sembako Berkah Jaya

## Cara menjalankan
```bash
python3 -m http.server 8765      # buka http://localhost:8765/admin.html
node test-ahp.js                 # 31 uji perhitungan AHP
NODE_PATH=~/.pi/agent/npm/node_modules node test-admin.mjs    # 80 uji halaman admin
NODE_PATH=~/.pi/agent/npm/node_modules node test-katalog.mjs  # 57 uji katalog & beranda
```
`localStorage` hanya bekerja lewat `http://`, bukan `file://`.

## Berkas
| Berkas | Isi |
|---|---|
| `index.html` | Storefront: beranda (30 produk pertama + ajakan ke halaman daftar) |
| `products.html` | Halaman semua produk: pencarian, filter, urutan, paginasi 12 per halaman |
| `katalog.js` | Mesin katalog bersama (kartu, pencarian, filter, chip, paginasi, pilihan) |
| `admin.html` | Halaman admin: Ringkasan, Produk, Ulasan, **Analitik penjualan**, **AHP**, Info toko |
| `data.js` | Data + helper bersama (`shop` + `sales`, `rupiah`, `stockState`, `wa*`) |
| `ahp.js` | Rumus AHP saja (bisa diuji tanpa peramban) |
| `test-ahp.js` | Uji modul AHP |
| `test-admin.mjs` | Uji halaman admin memakai linkedom |
| `test-katalog.mjs` | Uji `katalog.js` dan kedua halaman katalog memakai linkedom |

## Katalog dan halaman produk
`katalog.js` adalah satu mesin katalog yang dipakai dua halaman, jadi kartu produk,
pencarian, dan filter tidak pernah disalin dua kali:
- **`index.html` (beranda)** menampilkan **30 produk pertama saja** lalu menawarkan
  tautan "Lihat semua produk". Tautan itu ikut membawa filter yang sedang aktif
  (`products.html?kategori=…&cari=…&urut=…`).
- **`products.html` (daftar penuh)** menampilkan seluruh produk dengan pencarian,
  filter kategori, filter kondisi stok, urutan (default / termurah / termahal / nama /
  grosir), chip ringkasan filter, dan **paginasi 12 per halaman**.

Jumlah produk ditambah dari 19 ke **40**, karena itu kunci penyimpanan naik dari
`bj:toko:v1` ke **`bj:toko:v2`** (`data.js`). Data lama tidak dihapus, hanya tidak
dibaca lagi.

## Tampilan ponsel
Sasaran sentuh minimal 44×44 px di lebar ≤640 px: `.btn`, `.chip`, `.tautan`,
`.field-input`, tombol paginasi, slider AHP, dan tombol stepper stok. Aturan itu ditaruh
di **paling akhir** `@layer components` — di Tailwind v4, apa pun yang ada di
`@layer base` selalu kalah oleh `@layer components`, jadi menaruhnya di `base` tidak
berpengaruh. Tautan navigasi memakai `whitespace-nowrap` supaya tidak terbelah dua baris
di layar sempit. Tidak ada teks di bawah 12 px.

## Bagian AHP (`admin.html` menu **AHP**)
0. **Panduan contoh dari nol** — satu panel berisi 6 langkah (tentukan kriteria →
   bandingkan berpasangan → jadikan bobot % → cek CR → nilai pilihan → hasil akhir)
   dengan angka contoh kecil (3 kriteria, 3 pilihan) dan dua tabel yang bisa diikuti
   baris demi baris. Cocok dilampirkan ke skripsi sebagai penjelasan metode.
   Angka contoh ini terpisah dari matriks kerja, dan narasinya dihitung dari
   angkanya, bukan ditulis tetap.
1. **Uji konsistensi** — λ maks, CI, CR, dan status konsisten (CR ≤ 0,1).
2. **Perbandingan berpasangan** — slider untuk 6 pasangan dari 4 kriteria. Nilai
   dibaca sebagai pangkat 2, jadi skala Saaty utuh (1/512 … 512) bisa dijangkau.
3. **Bobot prioritas** — batang proporsi tiap kriteria.
4. **Penilaian alternatif** — tabel produk × kriteria, skala 1–9.
5. **Hasil perangkingan** — nilai akhir = Σ (bobot × nilai), dengan badge peringkat.
6. **Literatur perhitungan** — matriks A, vektor bobot, dan langkah CI/CR sebagai
   teks siap salin ke laporan.

Rumus: `ahp.js` — bobot dari rata-rata geometrik tiap baris yang dinormalkan,
`CI = (λmaks − n)/(n − 1)`, `CR = CI / RI` dengan RI Saaty.

> Data contoh AHP (kriteria, matriks, dan nilai alternatif) adalah **nilai awal**,
> bukan hasil kuesioner. Ganti lewat UI admin sebelum dipakai di laporan, dan
> letakkan hasil perhitungan setelah hasil kuesioner Anda.

## Bagian analitik penjualan (`admin.html` menu **Analitik penjualan**)
- Empat kartu: omzet hari ini, omzet bulan ini, transaksi (total + hari ini), produk kritis.
- Grafik batang omzet 30 hari terakhir (SVG langsung, tanpa pustaka) + tombol
  **Tabel** untuk versi teks yang bisa dibaca pembaca layar.
- 5 produk terlaris dan daftar produk tidak bergerak 14 hari.
- Form **Catat penjualan**: tanggal, sumber (offline / WhatsApp), nama pembeli,
  beberapa baris barang sekaligus, tipe harga eceran/grosir; total dihitung otomatis.
- Riwayat penjualan dengan filter tanggal, hapus, dan **Ekspor CSV**.

Penjualan hanya berasal dari input admin (PRD 1.1 butir 3): tidak ada pesanan dari
storefront. Harga satuan disimpan apa adanya saat transaksi dibuat, jadi laporan lama
tidak berubah kalau harga produk diubah. Stok diatur terpisah di menu Produk —
form penjualan **tidak** mengurangi stok, supaya tidak ada pemotongan ganda.

Semua angka dihitung ulang dari daftar transaksi (`data.js` → `ringkasPenjualan()`),
jadi tidak ada nilai tersimpan ganda yang bisa berbeda dengan riwayatnya.

## Catatan perbaikan terakhir
- Kartu **Produk kritis** dulu menampilkan `[object Object]` karena `ringkasPenjualan()`
  mengembalikan array, bukan angka. Sekarang `kritis` = jumlah, dan daftarnya ada di
  `kritisList`.
- Daftar produk di admin kini **dipaginasi 10 per halaman**; ubah `PER_HAL` di
  `admin.html` bila perlu.
- Gambar produk punya **rantai cadangan**: alamat asli → `wsrv.nl` → pola titik +
  inisial produk (SVG bawaan). Jadi tidak ada lagi ikon gambar rusak walau Wikimedia
  membatasi permintaan (HTTP 429).

## Batasan yang disadari
- Tanpa backend: data hanya tersimpan di `localStorage` satu peramban. Perubahan
  admin tidak terlihat di perangkat atau peramban lain.
- Tailwind dikompilasi saat halaman dibuka (CDN). Untuk produksi jalankan
  `npx @tailwindcss/cli -i src.css -o tailwind.css`.
- `test-admin.mjs` memakai DOM `linkedom`, jadi harness menyediakan sendiri
  `select.value` setter, `form.reset()`, dan `Event`; ini keterbatasan harness,
  bukan perilaku peramban sungguhan.
