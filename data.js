/* ==========================================================================
   Toko Sembako Berkah Jaya - data bersama untuk storefront & halaman admin.
   Disimpan di localStorage supaya perubahan dari admin ikut terbaca di
   storefront. Ini masih prototipe statis: belum ada backend.
   ========================================================================== */
(function (global) {
  "use strict";

  var IMG = "https://thumb.wikimedia.org/wikipedia/commons/thumb/";

  var DEFAULTS = {
    settings: {
      nama: "Toko Sembako Berkah Jaya",
      singkat: "Berkah Jaya",
      wa: "6281234567890",
      telepon: "0812-3456-7890",
      alamat: "Jl. Raden Intan No. 42, Bandar Lampung 35117",
      maps: "https://maps.google.com/?q=Bandar+Lampung",
      minAntar: 50000,
      gratisAntar: 150000,
      radius: "5 km",
      jam: [
        { hari: "Senin - Jumat", jam: "06.00 - 21.00" },
        { hari: "Sabtu", jam: "06.00 - 21.00" },
        { hari: "Minggu", jam: "06.00 - 17.00" }
      ],
      updated: "2026-10-12"
    },

    categories: [
      { id: "semua", label: "Semua" },
      { id: "beras", label: "Beras" },
      { id: "minyak-gula", label: "Minyak & Gula" },
      { id: "telur", label: "Telur" },
      { id: "bumbu", label: "Bumbu Dapur" },
      { id: "instan", label: "Mie & Instan" },
      { id: "minuman", label: "Minuman" }
    ],

    products: [
      { id: "p01", cat: "beras", name: "Beras Pandan Wangi 5 kg", unit: "karung",
        ecer: 68500, grosir: 64000, minGrosir: 4, stock: 18, minStock: 5, aktif: true,
        img: IMG + "e/e7/Jenis_Beras_di_Toko_Sembako_Desa_Tumpakkepuh.jpg/500px-Jenis_Beras_di_Toko_Sembako_Desa_Tumpakkepuh.jpg",
        alt: "Beras putih varietas Pandan Wangi di dalam wadah kayu" },

      { id: "p02", cat: "beras", name: "Beras Raja Lele 5 kg", unit: "karung",
        ecer: 72000, grosir: 68000, minGrosir: 4, stock: 9, minStock: 5, aktif: true,
        img: IMG + "d/dc/Basmati_Rice_Sack_%281%29.jpg/500px-Basmati_Rice_Sack_%281%29.jpg",
        alt: "Karung beras kemasan hijau berisi lima kilogram" },

      { id: "p03", cat: "beras", name: "Beras Setra Ramos 10 kg", unit: "karung",
        ecer: 132000, grosir: 126000, minGrosir: 3, stock: 4, minStock: 5, aktif: true,
        img: IMG + "b/bd/White_rice_on_a_brown_table.jpg/500px-White_rice_on_a_brown_table.jpg",
        alt: "Beras Setra Ramos putih di atas meja kayu" },

      { id: "p04", cat: "minyak-gula", name: "Minyak Goreng SunCo 2 L", unit: "pouch",
        ecer: 36500, grosir: 34000, minGrosir: 6, stock: 34, minStock: 12, aktif: true,
        img: IMG + "3/33/Bottle_1_liter_Sunflower_refined_oil.jpg/500px-Bottle_1_liter_Sunflower_refined_oil.jpg",
        alt: "Botol minyak goreng bening satu liter" },

      { id: "p05", cat: "minyak-gula", name: "Minyak Goreng Kita 1 L", unit: "pouch",
        ecer: 19000, grosir: 17800, minGrosir: 12, stock: 46, minStock: 20, aktif: true,
        img: IMG + "4/41/Sunflower_oil_bottles_in_Dnipro.jpg/500px-Sunflower_oil_bottles_in_Dnipro.jpg",
        alt: "Deretan botol minyak goreng di rak toko" },

      { id: "p06", cat: "minyak-gula", name: "Gula Pasir Lokal 1 kg", unit: "bungkus",
        ecer: 17500, grosir: 16200, minGrosir: 10, stock: 52, minStock: 15, aktif: true,
        img: IMG + "f/f3/Sugar_1.jpg/500px-Sugar_1.jpg",
        alt: "Gula pasir putih di dalam mangkuk" },

      { id: "p07", cat: "minyak-gula", name: "Gula Kristal Putih 500 g", unit: "bungkus",
        ecer: 9500, grosir: 8800, minGrosir: 20, stock: 61, minStock: 20, aktif: true,
        img: IMG + "3/31/Sugar_on_a_blue_plate_%28close_up%29.jpg/500px-Sugar_on_a_blue_plate_%28close_up%29.jpg",
        alt: "Butiran gula kristal putih tampak dekat" },

      { id: "p08", cat: "minyak-gula", name: "Tepung Terigu Segitiga 1 kg", unit: "bungkus",
        ecer: 13000, grosir: 12000, minGrosir: 10, stock: 27, minStock: 10, aktif: true,
        img: IMG + "1/11/Wheat-flour.jpg/500px-Wheat-flour.jpg",
        alt: "Tepung terigu putih dalam wadah" },

      { id: "p09", cat: "minyak-gula", name: "Tepung Serbaguna 500 g", unit: "bungkus",
        ecer: 7500, grosir: 6900, minGrosir: 20, stock: 38, minStock: 15, aktif: true,
        img: IMG + "6/64/All-Purpose_Flour_%284107895947%29.jpg/500px-All-Purpose_Flour_%284107895947%29.jpg",
        alt: "Tepung serbaguna dalam kemasan plastik" },

      { id: "p10", cat: "telur", name: "Telur Ayam Negeri 1 kg", unit: "kg",
        ecer: 29000, grosir: 27000, minGrosir: 5, stock: 22, minStock: 8, aktif: true,
        img: IMG + "4/4c/Egg_cartons_with_chicken_eggs_02.jpg/500px-Egg_cartons_with_chicken_eggs_02.jpg",
        alt: "Telur ayam negeri tersusun di dalam rak karton" },

      { id: "p11", cat: "telur", name: "Telur Ayam Kampung", unit: "butir",
        ecer: 3200, grosir: 2900, minGrosir: 30, stock: 0, minStock: 20, aktif: true,
        img: IMG + "d/dd/Eggs_in_basket_2020_G1.jpg/500px-Eggs_in_basket_2020_G1.jpg",
        alt: "Telur ayam kampung di dalam keranjang anyaman" },

      { id: "p12", cat: "instan", name: "Mie Instan Goreng 1 dus isi 40", unit: "dus",
        ecer: 118000, grosir: 112000, minGrosir: 3, stock: 11, minStock: 4, aktif: true,
        img: IMG + "1/1f/Mie_instan_di_pasar.jpg/500px-Mie_instan_di_pasar.jpg",
        alt: "Tumpukan mie instan kemasan di pasar" },

      { id: "p13", cat: "instan", name: "Mie Instan Kuah", unit: "bungkus",
        ecer: 3500, grosir: 3100, minGrosir: 40, stock: 128, minStock: 40, aktif: true,
        img: IMG + "c/c0/Instant_noodle_balls.jpg/500px-Instant_noodle_balls.jpg",
        alt: "Mie instan kering berbentuk bulat" },

      { id: "p14", cat: "instan", name: "Santan Kelapa Siap Pakai 200 ml", unit: "kotak",
        ecer: 6500, grosir: 5900, minGrosir: 24, stock: 44, minStock: 18, aktif: true,
        img: IMG + "b/bb/Coconut_milk_from_can01.JPG/500px-Coconut_milk_from_can01.JPG",
        alt: "Santan kelapa siap pakai dalam wadah" },

      { id: "p15", cat: "bumbu", name: "Garam Beryodium 500 g", unit: "bungkus",
        ecer: 4500, grosir: 4000, minGrosir: 24, stock: 73, minStock: 24, aktif: true,
        img: IMG + "a/ad/Table_salt_with_salt_shaker_V1.jpg/500px-Table_salt_with_salt_shaker_V1.jpg",
        alt: "Garam meja putih dengan wadah tabur" },

      { id: "p16", cat: "bumbu", name: "Kecap Manis 520 ml", unit: "botol",
        ecer: 21000, grosir: 19500, minGrosir: 6, stock: 16, minStock: 6, aktif: true,
        img: IMG + "b/ba/Kecap_manis_%26_kecap_asin.jpg/500px-Kecap_manis_%26_kecap_asin.jpg",
        alt: "Botol kecap manis dan kecap asin" },

      { id: "p17", cat: "bumbu", name: "Bawang Merah 1 kg", unit: "kg",
        ecer: 38000, grosir: 34500, minGrosir: 5, stock: 7, minStock: 6, aktif: true,
        img: IMG + "5/59/DFC_5343_Colorful_baskets_of_garlic_shallots_and_onions_neatly_arranged_for_sale_at_a_local_market_-_all_priced_at_20.jpg/500px-DFC_5343_Colorful_baskets_of_garlic_shallots_and_onions_neatly_arranged_for_sale_at_a_local_market_-_all_priced_at_20.jpg",
        alt: "Keranjang bawang merah dan bawang putih di pasar" },

      { id: "p18", cat: "minuman", name: "Kopi Bubuk Robusta 200 g", unit: "bungkus",
        ecer: 24000, grosir: 21500, minGrosir: 6, stock: 13, minStock: 6, aktif: true,
        img: IMG + "e/ee/Coffee_powdered.jpg/500px-Coffee_powdered.jpg",
        alt: "Kopi bubuk robusta halus siap seduh" },

      { id: "p20", cat: "bumbu", name: "Tempe Kedelai Segar", unit: "papan",
        ecer: 6000, grosir: 5000, minGrosir: 10, stock: 22, minStock: 8, aktif: true,
        img: IMG + "8/8b/Tempeh_003.jpg/500px-Tempeh_003.jpg",
        alt: "Tempe kedelai segar dibungkus daun" },

      { id: "p21", cat: "bumbu", name: "Tahu Putih Segar", unit: "papan",
        ecer: 7000, grosir: 6000, minGrosir: 10, stock: 14, minStock: 8, aktif: true,
        img: IMG + "6/6e/White_Bean_Curd.JPG/500px-White_Bean_Curd.JPG",
        alt: "Tahu putih segar dipotong balok" },

      { id: "p22", cat: "bumbu", name: "Cabai Merah Keriting 250 g", unit: "bungkus",
        ecer: 12500, grosir: 10500, minGrosir: 8, stock: 7, minStock: 6, aktif: true,
        img: IMG + "1/1a/Cabe_Rawit.JPG/500px-Cabe_Rawit.JPG",
        alt: "Cabai merah keriting segar di keranjang" },

      { id: "p23", cat: "bumbu", name: "Bawang Putih 500 g", unit: "bungkus",
        ecer: 16000, grosir: 14000, minGrosir: 8, stock: 26, minStock: 10, aktif: true,
        img: IMG + "6/61/Garlic_Bulbs_%28Unsplash%29.jpg/500px-Garlic_Bulbs_%28Unsplash%29.jpg",
        alt: "Bawang putih utuh beberapa siung" },

      { id: "p24", cat: "bumbu", name: "Gula Merah Aren 500 g", unit: "bungkus",
        ecer: 14000, grosir: 12000, minGrosir: 8, stock: 11, minStock: 6, aktif: true,
        img: IMG + "2/23/Palmsugar.jpg/500px-Palmsugar.jpg",
        alt: "Gula merah aren cetak berbentuk bulat" },

      { id: "p25", cat: "bumbu", name: "Merica Bubuk 100 g", unit: "bungkus",
        ecer: 11000, grosir: 9500, minGrosir: 10, stock: 30, minStock: 10, aktif: true,
        img: IMG + "3/31/Black_Pepper_%28Piper_nigrum%29_fruits.jpg/500px-Black_Pepper_%28Piper_nigrum%29_fruits.jpg",
        alt: "Butiran merica hitam siap digiling" },

      { id: "p26", cat: "instan", name: "Sambal Botol ABC 335 ml", unit: "botol",
        ecer: 18500, grosir: 16500, minGrosir: 6, stock: 19, minStock: 6, aktif: true,
        img: IMG + "e/e7/ABC_Sambal_Asli.jpg/500px-ABC_Sambal_Asli.jpg",
        alt: "Botol sambal ABC rasa asli" },

      { id: "p27", cat: "instan", name: "Tepung Bumbu Serbaguna 500 g", unit: "bungkus",
        ecer: 9500, grosir: 8000, minGrosir: 12, stock: 25, minStock: 10, aktif: true,
        img: IMG + "6/64/All-Purpose_Flour_%284107895947%29.jpg/500px-All-Purpose_Flour_%284107895947%29.jpg",
        alt: "Tepung bumbu serbaguna di mangkuk" },

      { id: "p28", cat: "minuman", name: "Susu Kental Manis 545 g", unit: "kaleng",
        ecer: 15500, grosir: 13500, minGrosir: 12, stock: 21, minStock: 8, aktif: true,
        img: IMG + "3/36/Tin_of_condensed_milk.jpg/500px-Tin_of_condensed_milk.jpg",
        alt: "Kaleng susu kental manis" },

      { id: "p29", cat: "minuman", name: "Air Mineral 600 ml", unit: "botol",
        ecer: 4000, grosir: 3200, minGrosir: 24, stock: 96, minStock: 24, aktif: true,
        img: IMG + "3/37/Botol_air_mineral.jpg/500px-Botol_air_mineral.jpg",
        alt: "Botol air mineral bening 600 mililiter" },

      { id: "p30", cat: "minuman", name: "Kopi Sachet Susu 10 x 25 g", unit: "renceng",
        ecer: 15000, grosir: 13000, minGrosir: 12, stock: 3, minStock: 6, aktif: true,
        img: IMG + "e/ee/Coffee_powdered.jpg/500px-Coffee_powdered.jpg",
        alt: "Kopi bubuk sachet siap seduh" },

      { id: "p31", cat: "beras", name: "Beras Merah Organik 2 kg", unit: "bungkus",
        ecer: 42000, grosir: 38000, minGrosir: 4, stock: 10, minStock: 4, aktif: true,
        img: IMG + "5/5c/Brown_Rice.jpg/500px-Brown_Rice.jpg",
        alt: "Beras merah organik dalam wadah" },

      { id: "p32", cat: "instan", name: "Mie Instan Soto 1 dus isi 40", unit: "dus",
        ecer: 112000, grosir: 104000, minGrosir: 3, stock: 12, minStock: 4, aktif: true,
        img: IMG + "c/c0/Instant_noodle_balls.jpg/500px-Instant_noodle_balls.jpg",
        alt: "Mie instan kuah soto siap disajikan" },

      { id: "p33", cat: "instan", name: "Biskuit Kelapa Kaleng 650 g", unit: "kaleng",
        ecer: 46000, grosir: 41000, minGrosir: 6, stock: 8, minStock: 4, aktif: true,
        img: IMG + "b/b3/Biskuit_Bourbon_Rasa_Coklat.jpg/500px-Biskuit_Bourbon_Rasa_Coklat.jpg",
        alt: "Biskuit kaleng rasa cokelat" },

      { id: "p34", cat: "minyak-gula", name: "Kacang Tanah Kupas 500 g", unit: "bungkus",
        ecer: 17000, grosir: 15000, minGrosir: 8, stock: 16, minStock: 6, aktif: true,
        img: IMG + "f/fb/Peanuts_%28Arachis_hypogaea%29_-_in_shell%2C_shell_cracked_open%2C_shelled%2C_peeled.jpg/500px-Peanuts_%28Arachis_hypogaea%29_-_in_shell%2C_shell_cracked_open%2C_shelled%2C_peeled.jpg",
        alt: "Kacang tanah kupas siap goreng" },

      { id: "p35", cat: "minyak-gula", name: "Margarin Serbaguna 200 g", unit: "bungkus",
        ecer: 8500, grosir: 7200, minGrosir: 12, stock: 0, minStock: 6, aktif: true,
        img: IMG + "7/7d/Margaryn_022.jpg/500px-Margaryn_022.jpg",
        alt: "Margarin serbaguna dalam kemasan" },

      { id: "p36", cat: "telur", name: "Telur Puyuh 500 g", unit: "bungkus",
        ecer: 19000, grosir: 16500, minGrosir: 6, stock: 6, minStock: 6, aktif: true,
        img: IMG + "4/4d/Quail_eggs%2C_Rostov-on-Don%2C_Russia.jpg/500px-Quail_eggs%2C_Rostov-on-Don%2C_Russia.jpg",
        alt: "Telur puyuh di dalam wadah" },

      { id: "p37", cat: "bumbu", name: "Kacang Hijau 500 g", unit: "bungkus",
        ecer: 14000, grosir: 12000, minGrosir: 8, stock: 13, minStock: 6, aktif: true,
        img: IMG + "8/86/Mung_beans_%28Vigna_radiata%29.jpg/500px-Mung_beans_%28Vigna_radiata%29.jpg",
        alt: "Kacang hijau dalam wadah kaca" },

      { id: "p38", cat: "instan", name: "Sarden Kaleng 155 g", unit: "kaleng",
        ecer: 12500, grosir: 10800, minGrosir: 12, stock: 27, minStock: 10, aktif: true,
        img: IMG + "f/f4/Sardine-tins.jpg/500px-Sardine-tins.jpg",
        alt: "Kaleng sarden dalam saus tomat" },

      { id: "p39", cat: "minuman", name: "Sirup Markisa 630 ml", unit: "botol",
        ecer: 27000, grosir: 24000, minGrosir: 6, stock: 9, minStock: 4, aktif: true,
        img: IMG + "1/1d/Syrup_flavored_drinks_almond.jpg/500px-Syrup_flavored_drinks_almond.jpg",
        alt: "Botol sirup siap saji" },

      { id: "p40", cat: "minuman", name: "Teh Tubruk Melati 100 g", unit: "bungkus",
        ecer: 11000, grosir: 9500, minGrosir: 10, stock: 2, minStock: 6, aktif: true,
        img: IMG + "3/37/Tea_production%2C_step_2_-_processing_of_the_dried_tea_leaves_%28Ndawara%29_%2802%29.jpg/500px-Tea_production%2C_step_2_-_processing_of_the_dried_tea_leaves_%28Ndawara%29_%2802%29.jpg",
        alt: "Daun teh kering siap diseduh" },

      { id: "p19", cat: "minuman", name: "Teh Celup isi 25 kantong", unit: "kotak",
        ecer: 9000, grosir: 8200, minGrosir: 12, stock: 31, minStock: 12, aktif: true,
        img: IMG + "2/28/Tea_bags_01.jpg/500px-Tea_bags_01.jpg",
        alt: "Kantong teh celup berjajar" }
    ],

    reviews: [
      { id: "r1", name: "Bu Retno Wulandari", role: "Pelanggan sejak 2015", stars: 5, status: "tayang",
        text: "Telur dan beras selalu datang utuh. Kurirnya sabar, mau menunggu saya hitung dulu barangnya." },
      { id: "r2", name: "Pak Hendra Gunawan", role: "Pemilik warung makan, Bandar Lampung", stars: 5, status: "tayang",
        text: "Saya ambil minyak dan beras grosir tiap minggu. Harga grosirnya jelas tertulis di web, jadi tidak perlu tawar-menawar lagi." },
      { id: "r3", name: "Mbak Sinta Prameswari", role: "Karyawan, Bandar Lampung", stars: 4, status: "tayang",
        text: "Pesan lewat WhatsApp dari kantor, sore sudah sampai di rumah. Pesan otomatisnya enak, tidak perlu ketik ulang daftar belanjaan." },
      { id: "r4", name: "Pak Maruli Sitompul", role: "Pelanggan, Teluk Betung", stars: 5, status: "tayang",
        text: "Saya biasa beli mie instan satu dus. Sempat telur pecah dua butir dan langsung diganti tanpa saya minta." },
      { id: "r5", name: "Bu Yohana Kusuma", role: "Pelanggan, Bandar Lampung", stars: 4, status: "tayang",
        text: "Harga gula dan tepung di sini lebih murah dari minimarket dekat rumah. Buka pagi, jadi bisa belanja sebelum berangkat kerja." }
    ],

    // Kosong sejak awal: penjualan hanya boleh berasal dari input admin toko,
    // bukan dari transaksi web (PRD 1.1 butir 3).
    sales: [],

    // Contoh perhitungan AHP untuk panduan admin. Contoh dan matriks di atas
    // sama-sama "angka awal": admin yang mengganti dengan hasil kuesionernya.
    ahpContoh: {
      kriteria: ["Harga", "Kualitas", "Pelayanan"],
      nilai: [3, 5, 2],                // segitiga atas: Harga/Kualitas, Harga/Pelayanan, Kualitas/Pelayanan
      penilaian: [[5, 3, 7], [9, 5, 3], [3, 3, 5]]
    },

    /* ---- Blok perhitungan AHP (rumusnya di ahp.js, diuji lewat test-ahp.js) ---- */
    ahpKriteria: [
      { id: "k1", nama: "Harga", kode: "C1", desc: "Kesesuaian harga dengan daya beli konsumen" },
      { id: "k2", nama: "Kualitas", kode: "C2", desc: "Mutu barang, merek, dan kondisi kemasan" },
      { id: "k3", nama: "Pelayanan", kode: "C3", desc: "Keramahan, kecepatan balas chat, dan antar barang" },
      { id: "k4", nama: "Promosi", kode: "C4", desc: "Potongan harga, bonus, dan informasi promo" }
    ],

    // Nilai hanya untuk pasangan atas diagonal (i < j). Contoh awal, SILAKAN
    // ganti dengan hasil kuesioner Anda; letakkan sebelum hasil perhitungan di laporan.
    ahpPairwise: [
      { i: 0, j: 1, nilai: 2 },      // Harga : Kualitas
      { i: 0, j: 2, nilai: 3 },      // Harga : Pelayanan
      { i: 0, j: 3, nilai: 5 },      // Harga : Promosi
      { i: 1, j: 2, nilai: 2 },      // Kualitas : Pelayanan
      { i: 1, j: 3, nilai: 3 },      // Kualitas : Promosi
      { i: 2, j: 3, nilai: 2 }       // Pelayanan : Promosi
    ],

    // Penilaian alternatif (Harga, Kualitas, Pelayanan, Promosi) pada skala 1-9.
    ahpAlternatif: [
      { id: "a1", nama: "Beras Pandan Wangi 5 kg", nilai: [5, 4, 5, 4] },
      { id: "a2", nama: "Beras Raja Lele 5 kg", nilai: [4, 4, 5, 4] },
      { id: "a3", nama: "Minyak Goreng Kita 2 L", nilai: [5, 3, 5, 4] },
      { id: "a4", nama: "Telur Ayam Negeri 1 kg", nilai: [4, 5, 4, 3] },
      { id: "a5", nama: "Gula Pasir Lokal 1 kg", nilai: [5, 4, 4, 3] }
    ],

    faq: [
      { q: "Apakah pesanan sembako bisa diantar ke rumah?",
        a: "Bisa. Toko melayani pengantaran untuk wilayah sekitar toko sampai radius 5 km dengan minimal belanja Rp50.000. Gratis ongkir berlaku untuk belanja di atas Rp150.000." },
      { q: "Bagaimana cara memesan lewat website ini?",
        a: "Pilih produk yang ingin dibeli, klik tombol Pesan via WhatsApp, lalu kirim pesan otomatis yang sudah terisi nama produk dan harganya ke admin kami. Admin akan mengonfirmasi ketersediaan dan biaya antar." },
      { q: "Apa syarat mendapatkan harga grosir?",
        a: "Harga grosir berlaku otomatis jika Anda membeli dalam jumlah tertentu sesuai ketentuan per barang. Contohnya beras minimal 2 karung, mie instan minimal 1 dus, atau minyak minimal 6 pouch." },
      { q: "Metode pembayaran apa saja yang didukung?",
        a: "Kami menerima pembayaran tunai atau COD (bayar di tempat saat kurir sampai), transfer bank BCA, BRI, dan Mandiri, serta QRIS." },
      { q: "Bagaimana jika ada barang rusak atau telur pecah saat diterima?",
        a: "Harap periksa pesanan saat kurir toko menyerahkan barang. Jika terdapat telur pecah atau kemasan bocor, kami langsung ganti di tempat atau potong tagihan pembayaran." }
    ]
  };

  // v2: jumlah produk bertambah 19 -> 40. Data lama (v1) dibiarkan utuh sebagai
  // cadangan, tapi tidak lagi dipakai supaya katalog baru ikut terlihat.
  var KEY = "bj:toko:v2";

  function clone(v) { return JSON.parse(JSON.stringify(v)); }

  function load() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || "null");
      if (raw && raw.products) {
        return {
          settings: Object.assign(clone(DEFAULTS.settings), raw.settings || {}),
          categories: DEFAULTS.categories,
          products: raw.products,
          reviews: raw.reviews || clone(DEFAULTS.reviews),
          faq: DEFAULTS.faq,
          ahpKriteria: raw.ahpKriteria || clone(DEFAULTS.ahpKriteria),
          ahpPairwise: raw.ahpPairwise || clone(DEFAULTS.ahpPairwise),
          ahpAlternatif: raw.ahpAlternatif || clone(DEFAULTS.ahpAlternatif),
          ahpContoh: DEFAULTS.ahpContoh,
          sales: raw.sales || clone(DEFAULTS.sales)
        };
      }
    } catch (e) { /* data rusak: jatuh ke default di bawah */ }
    return {
      settings: clone(DEFAULTS.settings),
      categories: DEFAULTS.categories,
      products: clone(DEFAULTS.products),
      reviews: clone(DEFAULTS.reviews),
      faq: DEFAULTS.faq,
      ahpKriteria: clone(DEFAULTS.ahpKriteria),
      ahpPairwise: clone(DEFAULTS.ahpPairwise),
      ahpAlternatif: clone(DEFAULTS.ahpAlternatif),
      ahpContoh: DEFAULTS.ahpContoh,
      sales: clone(DEFAULTS.sales)
    };
  }

  var state = load();

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        settings: state.settings, products: state.products, reviews: state.reviews,
        ahpKriteria: state.ahpKriteria, ahpPairwise: state.ahpPairwise,
        ahpAlternatif: state.ahpAlternatif, sales: state.sales
      }));
    } catch (e) { /* kuota penuh / mode privat: perubahan tidak tersimpan */ }
  }

  // Memuat ulang isi state yang sama (bukan mengganti objeknya) supaya referensi
  // window.BJ yang sudah dipegang storefront/admin tetap melihat data baru.
  function reset() {
    try { localStorage.removeItem(KEY); } catch (e) { /* diabaikan */ }
    var fresh = load();
    state.settings = fresh.settings;
    state.products = fresh.products;
    state.reviews = fresh.reviews;
    state.ahpKriteria = fresh.ahpKriteria;
    state.ahpPairwise = fresh.ahpPairwise;
    state.ahpAlternatif = fresh.ahpAlternatif;
    state.sales = fresh.sales;
    return state;
  }

  /* ------------------------------ helpers ------------------------------ */
  function rupiah(n) {
    return "Rp" + Number(n || 0).toLocaleString("id-ID");
  }

  /* Gambar bawaan (pola titik + inisial produk) dipakai saat gambar produk
     gagal dimuat. Rantai fallback di halaman: alamat asli -> cadangan.wsrv.net
     -> gambar bawaan ini; jadi yang muncul tidak pernah ikon gambar rusak. */
  function fallbackSVG(p) {
    var ini = (p.name.match(/[A-Za-z0-9]+/g) || ["?"]).slice(0, 2)
      .map(function (w) { return w[0].toUpperCase(); }).join("");
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">'
      + '<defs><pattern id="d" width="16" height="16" patternUnits="userSpaceOnUse">'
      + '<circle cx="4" cy="4" r="1.4" fill="#14603c" fill-opacity=".18"/></pattern></defs>'
      + '<rect width="96" height="96" fill="#e9efe9"/><rect width="96" height="96" fill="url(#d)"/>'
      + '<text x="48" y="60" font-family="system-ui,sans-serif" font-size="34" font-weight="700"'
      + ' fill="#14603c" fill-opacity=".55" text-anchor="middle">'
      + ini + '</text></svg>';
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  /* onerror dipasang inline pada <img> karena gambar di luar HTML kita. */
  var IMG_FALLBACK = "this.onerror=null;this.src=this.dataset.alt2||this.dataset.ph;";

  function stockState(p) {
    if (!p.aktif) return { key: "out", label: "Tidak dijual" };
    if (p.stock <= 0) return { key: "out", label: "Stok kosong" };
    if (p.stock <= p.minStock) return { key: "low", label: "Stok terbatas" };
    return { key: "ready", label: "Ready" };
  }

  function waUrl(text) {
    return "https://wa.me/" + state.settings.wa + "?text=" + encodeURIComponent(text);
  }

  function waGeneral() {
    return "Halo Admin " + state.settings.nama + ", saya pengunjung website ingin bertanya mengenai stok dan layanan antar toko.";
  }

  function waSingle(p) {
    return "Halo Admin " + state.settings.nama + ", saya melihat produk ini di website dan ingin memesan:\n\n"
      + "- Produk: " + p.name + "\n"
      + "- Satuan: " + p.unit + "\n"
      + "- Harga: " + rupiah(p.ecer) + " / " + p.unit + "\n\n"
      + "Apakah stok produk ini masih tersedia? Terima kasih.";
  }

  function waMulti(items) {
    var lines = items.map(function (p, i) {
      return (i + 1) + ". " + p.name + " (1 " + p.unit + ") - " + rupiah(p.ecer);
    });
    var total = items.reduce(function (sum, p) { return sum + p.ecer; }, 0);
    return "Halo Admin " + state.settings.nama + ", saya ingin memesan beberapa produk dari website:\n\n"
      + "Daftar Pesanan:\n" + lines.join("\n") + "\n\n"
      + "Perkiraan Total: " + rupiah(total) + "\n\n"
      + "Mohon info ketersediaan stok dan konfirmasi biaya pengantarannya ya. Terima kasih!";
  }


  /* --------------------------- perhitungan AHP --------------------------- */
  /* Semua rumus AHP (rata-rata geometrik, lambda_max, CI, CR, perangkingan)
     ada di ahp.js supaya bisa diuji terpisah lewat `node test-ahp.js`. */

  function ahpMatriks() {
    return global.AHP.buildMatrix(state.ahpKriteria.length, state.ahpPairwise);
  }

  // Hasil lengkap: matriks, bobot, dan uji konsistensi.
  function ahpHasil() {
    var m = ahpMatriks();
    var h = global.AHP.hitungAHP(m);
    h.matriks = m;
    h.kriteria = state.ahpKriteria;
    return h;
  }

  function ahpRangking() {
    var h = ahpHasil();
    if (h.error) return h;
    var nilai = {}, nama = {};
    state.ahpAlternatif.forEach(function (a) { nilai[a.id] = a.nilai; nama[a.id] = a.nama; });
    h.rangking = global.AHP.rangking(h.weights, nilai).map(function (x) {
      x.nama = nama[x.id];
      return x;
    });
    return h;
  }

  /* ------------------------ analitik penjualan --------------------------- */
  /* Penjualan HANYA diinput admin (PRD 1.1 butir 3): tidak ada order dari web. */

  function tanggalLokal(d) {
    var x = new Date(d);
    return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0");
  }

  function hargaSatuan(produk, tipe) {
    var p = state.products.find(function (x) { return x.id === produk; });
    if (!p) return 0;
    return tipe === "grosir" ? p.grosir : p.ecer;
  }

  // total = jumlah(qty x harga satuan); harga disimpan saat transaksi dibuat
  // supaya laporan lama tidak berubah kalau harga produk diubah.
  function buatPenjualan(data) {
    var items = (data.items || []).map(function (it) {
      var qty = Math.max(1, Math.floor(Number(it.qty) || 1));
      var satuan = Number(it.harga) || hargaSatuan(it.produk, it.tipe);
      return {
        produk: it.produk, qty: qty, tipe: it.tipe === "grosir" ? "grosir" : "ecer",
        harga: satuan, subtotal: qty * satuan
      };
    });
    if (!items.length) return { error: "Minimal satu barang harus diisi." };

    var total = items.reduce(function (s, it) { return s + it.subtotal; }, 0);
    var tanggal = data.tanggal || tanggalLokal(new Date());
    var hari = tanggal.replace(/-/g, "");
    var urut = state.sales.filter(function (s) { return s.tanggal === tanggal; }).length + 1;

    var sale = {
      id: "s" + Date.now().toString(36) + "-" + state.sales.length,
      invoice: "TRX-" + hari + "-" + String(urut).padStart(3, "0"),
      tanggal: tanggal,
      channel: data.channel === "whatsapp" ? "whatsapp" : "offline",
      pelanggan: (data.pelanggan || "").trim(),
      kasir: data.kasir || "Admin",
      items: items,
      total: total
    };
    state.sales.unshift(sale);
    return sale;
  }

  function ringkasPenjualan() {
    var hari = tanggalLokal(new Date());
    var bulan = hari.slice(0, 7);
    var omzetHari = 0, omzetBulan = 0, trxHari = 0, qtyHari = 0;
    var perTanggal = {}, perProduk = {};
    var terakhirJual = {};

    state.sales.forEach(function (s) {
      var nilai = Number(s.total) || 0;
      if (s.tanggal.slice(0, 7) === bulan) omzetBulan += nilai;
      if (s.tanggal === hari) { omzetHari += nilai; trxHari += 1; }
      perTanggal[s.tanggal] = (perTanggal[s.tanggal] || 0) + nilai;

      (s.items || []).forEach(function (it) {
        var p = state.products.find(function (x) { return x.id === it.produk; });
        var nama = p ? p.name : it.produk;
        if (!perProduk[it.produk]) perProduk[it.produk] = { id: it.produk, nama: nama, qty: 0, omzet: 0 };
        perProduk[it.produk].qty += Number(it.qty) || 0;
        perProduk[it.produk].omzet += Number(it.subtotal) || 0;
        if (s.tanggal === hari) qtyHari += Number(it.qty) || 0;
        if (!terakhirJual[it.produk] || s.tanggal > terakhirJual[it.produk]) terakhirJual[it.produk] = s.tanggal;
      });
    });

    // Tren 30 hari terakhir, hari tanpa penjualan tetap muncul sebagai 0.
    var tren = [];
    var kini = new Date(hari + "T00:00:00");
    for (var i = 29; i >= 0; i--) {
      var d = new Date(kini);
      d.setDate(d.getDate() - i);
      var key = tanggalLokal(d);
      tren.push({ tanggal: key, omzet: perTanggal[key] || 0 });
    }

    var terlaris = Object.keys(perProduk).map(function (k) { return perProduk[k]; })
      .sort(function (a, b) { return b.qty - a.qty; }).slice(0, 5);

    // Tidak bergerak: produk aktif yang tidak pernah terjual dalam 14 hari terakhir.
    var batas = new Date(kini);
    batas.setDate(batas.getDate() - 14);
    var batasStr = tanggalLokal(batas);
    // Bila belum ada penjualan tercatat sama sekali, daftar ini kosong: semua
    // produk akan terlihat "tidak bergerak" padahal datanya memang belum diisi.
    var tidakGerak = state.sales.length ? state.products.filter(function (p) {
      if (!p.aktif) return false;
      var t = terakhirJual[p.id];
      return !t || t < batasStr;
    }).map(function (p) {
      return { id: p.id, nama: p.name, terakhir: terakhirJual[p.id] || null, stok: p.stock };
    }) : [];

    var kritis = state.products.filter(function (p) { return p.aktif && p.stock <= p.minStock; })
      .sort(function (a, b) { return a.stock - b.stock; })
      .map(function (p) { return { id: p.id, nama: p.name, stok: p.stock, minStock: p.minStock }; });

    return {
      tanggal: hari, omzetHari: omzetHari, omzetBulan: omzetBulan,
      trxHari: trxHari, trx: state.sales.length, qtyHari: qtyHari,
      tren: tren, terlaris: terlaris, tidakGerak: tidakGerak,
      kritis: kritis.length, kritisList: kritis,
      omzetTotal: state.sales.reduce(function (s, x) { return s + (Number(x.total) || 0); }, 0)
    };
  }

  // CSV dipakai karena bisa dibuka Excel maupun diimpor ulang.
  function penjualanCSV() {
    var baris = [["Invoice", "Tanggal", "Channel", "Pelanggan", "Produk", "Qty", "Tipe Harga", "Harga Satuan", "Subtotal"]];
    state.sales.slice().sort(function (a, b) { return a.tanggal < b.tanggal ? -1 : 1; }).forEach(function (s) {
      (s.items || []).forEach(function (it) {
        var p = state.products.find(function (x) { return x.id === it.produk; });
        baris.push([s.invoice, s.tanggal, s.channel, s.pelanggan || "", p ? p.name : it.produk,
          it.qty, it.tipe, it.harga, it.subtotal]);
      });
    });
    return baris.map(function (r) {
      return r.map(function (v) {
        var t = String(v == null ? "" : v);
        return /[",;\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
      }).join(";");
    }).join("\n");
  }

  state.ahpMatriks = ahpMatriks;
  state.ahpHasil = ahpHasil;
  state.ahpRangking = ahpRangking;
  state.buatPenjualan = buatPenjualan;
  state.ringkasPenjualan = ringkasPenjualan;
  state.penjualanCSV = penjualanCSV;
  state.hargaSatuan = hargaSatuan;
  state.tanggalLokal = tanggalLokal;

  state.save = save;
  state.reset = reset;
  state.rupiah = rupiah;
  state.fallbackSVG = fallbackSVG;
  state.IMG_FALLBACK = IMG_FALLBACK;
  state.stockState = stockState;
  state.waUrl = waUrl;
  state.waGeneral = waGeneral;
  state.waSingle = waSingle;
  state.waMulti = waMulti;

  Object.defineProperty(state, "catLabel", {
    value: function (id) {
      var c = state.categories.find(function (x) { return x.id === id; });
      return c ? c.label : id;
    }
  });

  global.BJ = state;
})(window);
