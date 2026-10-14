/* ==========================================================================
   Uji halaman admin tanpa peramban, memakai linkedom sebagai DOM.
   Jalankan: node --experimental-vm-modules test-admin.mjs
   Menguji: tampilan analitik, pencatatan penjualan, dan halaman AHP.
   ========================================================================== */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { parseHTML } = require("linkedom");

let gagal = 0, lulus = 0;
function cek(nama, dapat, harap) {
  const ok = JSON.stringify(dapat) === JSON.stringify(harap);
  ok ? lulus++ : gagal++;
  console.log((ok ? "  OK   " : "  GAGAL") + " " + nama + " → " + JSON.stringify(dapat) +
    (ok ? "" : "   (diharap " + JSON.stringify(harap) + ")"));
}

const html = readFileSync(new URL("./admin.html", import.meta.url), "utf8");
const { window, document } = parseHTML(html);

// --- lingkungan minimum yang dipakai skrip admin ---------------------------
const store = {};
window.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; }
};
window.confirm = () => true;
window.navigator.clipboard = { writeText: async () => {} };
window.URL.createObjectURL = () => "blob:x";
window.URL.revokeObjectURL = () => {};
window.Blob = class { constructor() {} };
window.matchMedia = () => ({ matches: false, addEventListener() {} });
// Skrip admin memakai beberapa nama bawaan peramban tanpa awalan "window"
// (addEventListener, location, history, confirm), jadi disediakan juga di global.
globalThis.window = window;
globalThis.document = document;
globalThis.addEventListener = () => {};
globalThis.removeEventListener = () => {};
globalThis.confirm = () => true;
globalThis.alert = () => {};
const lokasi = { hash: "", replaceState(_a, _b, h) { this.hash = h; } };
globalThis.location = window.location = lokasi;
globalThis.history = window.history = { replaceState: (...a) => lokasi.replaceState(...a) };

// linkedom belum punya HTMLFormElement.reset(); disediakan versi sederhana yang
// mengembalikan isian ke nilai awalnya, sama seperti reset() di peramban.
// linkedom juga belum punya scrollIntoView(); tidak berpengaruh pada logika.
window.Element.prototype.scrollIntoView = function () {};

const saleFormEl = document.querySelector("#saleForm");
saleFormEl.reset = function () {
  this.querySelectorAll("input").forEach((i) => {
    if (i.type === "checkbox" || i.type === "radio") i.removeAttribute("checked");
    else i.value = i.getAttribute("value") || "";
  });
  this.querySelectorAll("select").forEach((s) => {
    s.querySelectorAll("option").forEach((o) => {
      if (o.hasAttribute("data-bawaan")) o.setAttribute("selected", "");
      else o.removeAttribute("selected");
    });
  });
};

// --- jalankan ahp.js, data.js, lalu skrip inline admin ---------------------
const run = (kode, nama) => {
  try { new Function("window", "document", "localStorage", "navigator", "confirm", "Blob", kode)
    (window, document, window.localStorage, window.navigator, window.confirm, window.Blob); }
  catch (e) { console.log("GAGAL jalankan " + nama + ": " + e.message); gagal++; }
};
run(readFileSync(new URL("./ahp.js", import.meta.url), "utf8"), "ahp.js");
const AHP = window.AHP;
run(readFileSync(new URL("./data.js", import.meta.url), "utf8"), "data.js");

const inline = [...html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g)]
  .map((m) => m[1]).find((s) => s.includes("var D = window.BJ"));
run(inline, "skrip admin");

// Pindah bagian lewat jalur yang sama dengan peramban: hash + hashchange.
const pindah = (nama) => {
  globalThis.location.hash = nama;
  window.dispatchEvent(new window.Event("hashchange", { bubbles: false }));
};

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const D = window.BJ;

// linkedom belum mengimplementasikan select.value sebagai setter (hanya getter
// yang membaca atribut `selected`), jadi uji ini mengeset atributnya langsung.
// Di peramban sungguhan pilihan pengguna mengeset atribut yang sama.
function setSelect(el, val) {
  [...el.querySelectorAll("option")].forEach((o) => o.removeAttribute("selected"));
  const o = el.querySelector('option[value="' + val + '"]');
  if (o) o.setAttribute("selected", "");
}

console.log("\n1. Halaman terbuka tanpa galat, data contoh termuat");
cek("window.BJ ada", typeof D, "object");
cek("kriteria AHP", D.ahpKriteria.length, 4);
cek("pasangan berpasangan", D.ahpPairwise.length, 6);

console.log("\n2. Bagian AHP terisi");
cek("lambda terisi", /^\d+\.\d{4}$/.test($('[data-ahp="lambda"]').textContent), true);
cek("lambda = 4,0145 dari matriks contoh", $('[data-ahp="lambda"]').textContent, "4.0145");
cek("CR terisi", /^0\.\d+$/.test($('[data-ahp="cr"]').textContent), true);
cek("badge konsisten", $('[data-badge="ahp-besar"]').textContent, "Konsisten");
cek("slider pasangan dibuat", $$("#ahpPairs [data-pair]").length, 6);
cek("daftar bobot", $$('[data-list2="bobot"] li').length, 4);
cek("total bobot 100%", $$('[data-list2="bobot"] li').length > 0 &&
  Math.abs(D.ahpHasil().weights.reduce((a, b) => a + b, 0) - 1) < 1e-12, true);
cek("baris alternatif", $$("#ahpAltBody tr").length, 5);
cek("baris peringkat", $$("#ahpRankBody tr").length, 5);
cek("peringkat 1 ditandai", $$("#ahpRankBody tr")[0].querySelector(".badge").textContent, "1");
cek("matriks teks memuat lambda", $("#ahpMatriksTeks").textContent.includes("Lambda maks"), true);
cek("matriks teks memuat CI", $("#ahpMatriksTeks").textContent.includes("CI = (lambda maks"), true);

console.log("\n3. Menggeser slider mengubah CR dan label");
const s0 = $('#ahpPairs [data-pair="0-1"]');
const cr0 = $('[data-ahp="cr"]').textContent;
s0.value = "9";                                   // 2^9 = 512x, jelas tidak konsisten
s0.dispatchEvent(new window.Event("input", { bubbles: true }));
const cr1 = $('[data-ahp="cr"]').textContent;
cek("label pasangan berubah", $('[data-lab="0-1"]').textContent.includes("512x lebih penting"), true);
cek("CR berubah", cr0 !== cr1, true);
cek("badge jadi tidak konsisten", $('[data-badge="ahp-besar"]').textContent, "Tidak konsisten");
cek("nilai tersimpan ke state", D.ahpPairwise.find((p) => p.i === 0 && p.j === 1).nilai, 512);
s0.dispatchEvent(new window.Event("change", { bubbles: true }));
cek("nilai masuk localStorage", JSON.parse(store["bj:toko:v2"]).ahpPairwise
  .find((p) => p.i === 0 && p.j === 1).nilai, 512);

console.log("\n4. Tombol 'Ulangi 1' dan 'Balik arah'");
$("#ahpResetMatriks").click();
cek("semua pasangan jadi 1", D.ahpPairwise.every((p) => p.nilai === 1), true);
cek("CR = 0 saat semua 1", Number($('[data-ahp="cr"]').textContent), 0);
$("#ahpTukar").click();
cek("dibalik tetap 1 (kebalikan dari 1)", D.ahpPairwise.every((p) => p.nilai === 1), true);
$("#ahpTukar").click();
D.ahpPairwise[0].nilai = 4;
$("#ahpTukar").click();
cek("1/4 setelah dibalik", D.ahpPairwise[0].nilai, 0.25);

console.log("\n5. Bagian analitik: keadaan kosong");
cek("omzet hari ini", $('[data-stat2="omzetHari"]').textContent, "Rp0");
cek("transaksi", $('[data-stat2="trx"]').textContent, "0");
cek("sub tren menjelaskan skala", $('[data-stat2="trenSub"]').textContent.includes("belum ada penjualan"), true);
cek("terlaris kosong", $('[data-list2="terlaris"] li').textContent.includes("Belum ada penjualan"), true);
cek("tidak bergerak kosong", $('[data-list2="tidakGerak"] li').textContent.includes("Isi penjualan dulu"), true);
cek("riwayat kosong", $('[data-list2="sales"] tr td').textContent.includes("Belum ada penjualan"), true);
cek("grafik: 5 garis bantu + 1 garis dasar", $$("#trenChart line").length, 6);
cek("grafik punya 5 label sumbu Y", $$("#trenChart text").length >= 5, true);
cek("tabel lebar ada isinya", $$("#trenTabel tbody tr").length, 30);

console.log("\n6. Form catat penjualan");
cek("tanggal terisi hari ini", /^\d{4}-\d{2}-\d{2}$/.test($("#slTanggal").value), true);
cek("satu baris barang siap", $$("#slItems [data-row]").length, 1);
$("#slAddRow").click();
cek("tambah baris", $$("#slItems [data-row]").length, 2);
$$("#slItems [data-row]")[0].querySelector('[data-hapus-baris]').click();
cek("hapus baris tersisa 1", $$("#slItems [data-row]").length, 1);

const row = () => $$("#slItems [data-row]")[0];
const produkA = D.products[0];
setSelect(row().querySelector('[data-f="produk"]'), produkA.id);
setSelect(row().querySelector('[data-f="tipe"]'), "ecer");
row().querySelector('[data-f="qty"]').value = "3";
row().dispatchEvent(new window.Event("change", { bubbles: true }));
cek("total dihitung (3 x eceran)", $("#slTotal").textContent, D.rupiah(produkA.ecer * 3));

setSelect(row().querySelector('[data-f="tipe"]'), "grosir");
row().dispatchEvent(new window.Event("change", { bubbles: true }));
cek("total ikut harga grosir", $("#slTotal").textContent, D.rupiah(produkA.grosir * 3));

$("#slPelanggan").value = "Bu Sari";
setSelect($("#slChannel"), "whatsapp");
$("#saleForm").dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));

cek("satu transaksi tercatat", D.sales.length, 1);
cek("invoice sesuai format", /^TRX-\d{8}-001$/.test(D.sales[0].invoice), true);
cek("sumber whatsapp", D.sales[0].channel, "whatsapp");
cek("pembeli tersimpan", D.sales[0].pelanggan, "Bu Sari");
cek("harga grosir yang dipakai", D.sales[0].items[0].harga, produkA.grosir);
cek("subtotal", D.sales[0].items[0].subtotal, produkA.grosir * 3);
cek("omzet hari ini terisi", $('[data-stat2="omzetHari"]').textContent, D.rupiah(produkA.grosir * 3));
cek("trx hari ini 1", $('[data-stat2="trxHari"]').textContent, "1 hari ini");
cek("riwayat berisi 1 baris", $$('[data-list2="sales"] tr').length, 1);
cek("nama produk muncul di riwayat", $('[data-list2="sales"]').textContent.includes(produkA.name), true);
cek("terlaris terisi", $('[data-list2="terlaris"]').textContent.includes(produkA.name), true);
cek("grafik punya batang", $$("#trenChart rect").length, 1);
cek("form kembali satu baris kosong", $$("#slItems [data-row]").length, 1);
cek("tanggal dipertahankan", $("#slTanggal").value, D.tanggalLokal(new Date()));
cek("tersimpan ke localStorage", JSON.parse(store["bj:toko:v2"]).sales.length, 1);

console.log("\n9. Kartu 'Produk kritis' menampilkan jumlah, bukan objek");
pindah("analitik");
cek("kritis berupa angka", typeof D.ringkasPenjualan().kritis, "number");
cek("kritis bukan [object Object]", $('[data-stat2="kritis"]').textContent.includes("[object"), false);
cek("kritis = jumlah produk stok <= minStock", Number($('[data-stat2="kritis"]').textContent),
  D.products.filter((p) => p.aktif && p.stock <= p.minStock).length);
cek("daftar kritis tetap tersedia", Array.isArray(D.ringkasPenjualan().kritisList), true);

console.log("\n10. Paginasi daftar produk");
pindah("produk");
const total = D.products.length;
const perHal = 10;
const maxHal = Math.ceil(total / perHal);
const barisHal = (h) => Math.min(perHal, total - (h - 1) * perHal);
const teksHal = (h) => ((h - 1) * perHal + 1) + "\u2013" + ((h - 1) * perHal + barisHal(h)) + " dari " + total + " produk";
cek("semua produk, " + perHal + " per halaman", [total, $$('[data-list="produk"] tr').length], [total, barisHal(1)]);
cek("wadah paginasi terisi", $$("#produkPaginasi [data-hal]").length > 0, true);
cek("keterangan rentang", $("#produkPaginasi").textContent.includes(teksHal(1)), true);
cek("halaman 1 ditandai", $('#produkPaginasi [data-hal="1"]').getAttribute("aria-current"), "page");
$('#produkPaginasi [data-hal="2"]').click();
cek("halaman 2 berisi " + barisHal(2), $$('[data-list="produk"] tr').length, barisHal(2));
cek("keterangan halaman 2", $("#produkPaginasi").textContent.includes(teksHal(2)), true);
cek("halaman 2 ditandai", $('#produkPaginasi [data-hal="2"]').getAttribute("aria-current"), "page");
$('#produkPaginasi [data-hal="' + maxHal + '"]').click();
cek("halaman terakhir berisi " + barisHal(maxHal), $$('[data-list="produk"] tr').length, barisHal(maxHal));
cek("tombol berikutnya nonaktif di halaman akhir", $('#produkPaginasi [data-hal="' + (maxHal + 1) + '"]').disabled, true);
setSelect($("#fCat"), "telur");
$("#fCat").dispatchEvent(new window.Event("change", { bubbles: true }));
cek("filter mengembalikan ke halaman 1", $("#produkPaginasi").textContent.includes("1\u2013") || $("#produkPaginasi").textContent === "", true);
cek("filter telur tidak memaginasi (2 hasil)", $$("#produkPaginasi [data-hal]").length, 0);
setSelect($("#fCat"), "semua");
$("#fCat").dispatchEvent(new window.Event("change", { bubbles: true }));

console.log("\n11. Gambar produk punya rantai cadangan");
const img = $('[data-list="produk"] img');
cek("ada data-ph (SVG bawaan)", (img.getAttribute("data-ph") || "").startsWith("data:image/svg+xml"), true);
cek("ada data-alt2 (wsrv.nl)", (img.getAttribute("data-alt2") || "").includes("wsrv.nl"), true);
cek("ada onerror", (img.getAttribute("onerror") || "").includes("dataset.ph"), true);
cek("SVG bawaan berisi inisial", decodeURIComponent(img.getAttribute("data-ph")).includes("<text"), true);

console.log("\n12. Panduan contoh perhitungan AHP");
pindah("ahp");
const panduan = $("#ahpPanduanIsi").textContent;
cek("enam langkah bernomor", $$("#ahpPanduanIsi .rounded-full").length, 6);
cek("dua tabel contoh", $$("#ahpPanduanIsi table").length, 2);
cek("tanpa NaN atau undefined", /NaN|undefined|\[object/.test(panduan), false);
cek("menyebut bobot 100%", panduan.includes("jumlahnya 100%"), true);
cek("menyebut ambang CR", panduan.includes("batas 0,1"), true);
cek("menyebut peringkat 1", panduan.includes("peringkat 1"), true);
cek("contoh konsisten (CR < 0,1)", AHP.hitungAHP(AHP.buildMatrix(3,
  [{ i: 0, j: 1, nilai: 3 }, { i: 0, j: 2, nilai: 5 }, { i: 1, j: 2, nilai: 2 }])).consistent, true);

console.log("\n" + (gagal === 0 ? "SEMUA " + lulus + " UJI LULUS" : lulus + " lulus, " + gagal + " GAGAL"));
process.exit(gagal ? 1 : 0);
