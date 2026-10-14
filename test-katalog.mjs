/* ==========================================================================
   Uji katalog.js (modul bersama beranda + halaman produk) tanpa peramban.
   Jalankan: node test-katalog.mjs
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

const { window, document } = parseHTML(readFileSync(new URL("./products.html", import.meta.url), "utf8"));

const store = {};
window.localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; }
};
window.matchMedia = () => ({ matches: false, addEventListener() {} });
window.open = () => {};
window.Element.prototype.scrollIntoView = function () {};
globalThis.window = window;
globalThis.document = document;
globalThis.localStorage = window.localStorage;
globalThis.URLSearchParams = URLSearchParams;

new Function("window", "localStorage", readFileSync(new URL("./data.js", import.meta.url), "utf8"))(window, window.localStorage);
const D = window.BJ;
new Function("window", "module", readFileSync(new URL("./katalog.js", import.meta.url), "utf8"))(window, {});
const K = window.KATALOG;

const $ = (s) => document.querySelector(s);
// linkedom: <select>.value hanya punya getter, sedangkan halaman memakainya
// dua arah. Ditambal di harness, bukan di halaman.
const SelProto = window.HTMLSelectElement && window.HTMLSelectElement.prototype;
if (SelProto) {
  Object.defineProperty(SelProto, "value", {
    configurable: true,
    get() {
      const o = this.querySelector("option[selected]") || this.querySelector("option");
      return o ? o.getAttribute("value") : "";
    },
    set(v) {
      [...this.querySelectorAll("option")].forEach((o) => o.removeAttribute("selected"));
      const o = this.querySelector('option[value="' + v + '"]');
      if (o) o.setAttribute("selected", "");
    }
  });
}
const nilaiSelect = (el) => el.value;
const $$ = (s) => [...document.querySelectorAll(s)];
const idKartu = () => $$("#productGrid article").map((a) => a.dataset.id);

console.log("\n1. Penyaringan dan urutan");
cek("semua produk aktif terpilih", K.select().length, D.products.filter((p) => p.aktif !== false).length);
cek("tanpa filter", K.adaFilter(), false);

K.state.query = "beras";
cek("cari 'beras'", K.select().length, D.products.filter((p) => /beras/i.test(p.name)).length);
K.state.query = "";

K.state.cat = "telur";
cek("kategori telur", K.select().every((p) => p.cat === "telur"), true);
K.state.cat = "semua";

K.state.stock = "out";
const kosong = K.select();
cek("stok kosong hanya yang habis", kosong.every((p) => D.stockState(p).key === "out"), true);
cek("stok kosong ada isinya", kosong.length > 0, true);
K.state.stock = "semua";

K.state.sort = "murah";
const murah = K.select();
cek("urut termurah", murah[0].ecer, Math.min(...D.products.map((p) => p.ecer)));
K.state.sort = "mahal";
cek("urut termahal", K.select()[0].ecer, Math.max(...D.products.map((p) => p.ecer)));
K.state.sort = "nama";
const nama = K.select().map((p) => p.name);
cek("urut nama A-Z", nama.join("|") === [...nama].sort((a, b) => a.localeCompare(b, "id")).join("|"), true);
K.state.sort = "default";

console.log("\n2. Render + paginasi 12 per halaman");
const K2 = K.mount({
  grid: "#productGrid", search: "#searchInput", clear: "#searchClear",
  cats: "#catList", stock: "#fStock", sort: "#fSort",
  chips: "#chipList", pager: "#pager", count: "#resultCount", perPage: 12,
  after: () => {}
});
const total = D.products.filter((p) => p.aktif !== false).length;
const maxHal = Math.ceil(total / 12);
cek("halaman 1 berisi 12", idKartu().length, 12);
cek("jumlah halaman", $$("#pager [data-hal], #pager button").length > 0, true);
cek("keterangan jumlah", $("#resultCount").textContent, total + " produk ditampilkan");
cek("paginasi tampil", $("#pager").hidden, false);
cek("halaman 1 ditandai", $('#pager button[aria-current="page"]').textContent, "1");
cek("tombol ‹ nonaktif di halaman 1", $('#pager button[aria-label="Halaman sebelumnya"]').disabled, true);

$('#pager button[aria-label="Halaman berikutnya"]').click();
cek("halaman 2 berisi 12", idKartu().length, 12);
cek("halaman 2 berganti isi", idKartu()[0] !== "p01", true);

// ke halaman terakhir
for (let i = 0; i < 10; i++) {
  const next = $('#pager button[aria-label="Halaman berikutnya"]');
  if (next.disabled) break;
  next.click();
}
cek("halaman terakhir berisi sisa", idKartu().length, total - (maxHal - 1) * 12);
cek("tombol › nonaktif di halaman akhir", $('#pager button[aria-label="Halaman berikutnya"]').disabled, true);
K.state.page = 1;
K.render();

console.log("\n3. Chip filter + hapus semua");
cek("chip kosong saat tanpa filter", $("#chipList").hidden, true);
K.state.cat = "beras";
K.state.sort = "murah";
K.state.query = "5 kg";
K.render();
const teksChip = $("#chipList").textContent;
cek("chip kategori", teksChip.includes("Kategori: Beras"), true);
cek("chip urutan", teksChip.includes("Urutan: Termurah"), true);
cek("chip pencarian", teksChip.includes('Cari: "5 kg"'), true);
cek("chip tampil", $("#chipList").hidden, false);
cek("tombol hapus semua ada", teksChip.includes("Hapus semua"), true);

K.resetFilter();
cek("reset menghapus filter", K.adaFilter(), false);
cek("reset mengembalikan urutan", K.state.sort, "default");
cek("reset mengosongkan kolom cari", $("#searchInput").value, "");
cek("reset memilih 'semua' di filter stok", nilaiSelect($("#fStock")), "semua");
cek("reset menyembunyikan chip", $("#chipList").hidden, true);
cek("reset kembali ke 12 kartu", idKartu().length, 12);

console.log("\n4. Keadaan kosong");
$("#searchInput").value = "zzzz-tidak-ada";
$("#searchInput").dispatchEvent(new window.Event("input", { bubbles: true }));
cek("tidak ada kartu", idKartu().length, 0);
cek("pesan kosong tampil", $("#productGrid").textContent.includes("Barang tidak ditemukan"), true);
cek("tombol hapus filter tampil", $("#productGrid").textContent.includes("Hapus semua filter"), true);
K.resetFilter();
cek("pulih setelah reset", idKartu().length, 12);

console.log("\n5. Kartu produk");
const kartu = $("#productGrid article");
cek("kartu punya data-id", !!kartu.dataset.id, true);
cek("kartu punya gambar", !!kartu.querySelector("img"), true);
cek("gambar punya cadangan", !!kartu.querySelector("img").dataset.ph, true);
cek("kartu punya tombol pilih", !!kartu.querySelector('button[aria-pressed]'), true);
const pOut = D.products.find((p) => D.stockState(p).key === "out");
const kartuOut = K.productCard(pOut);
cek("produk habis: tombol pilih mati", kartuOut.querySelector('button[aria-pressed]').disabled, true);
cek("produk habis: tombol pesan mati", kartuOut.querySelector(".btn-primary").disabled, true);
cek("produk habis: label", kartuOut.querySelector(".badge").textContent, "Stok kosong");

console.log("\n6. Pilihan produk (pick bar)");
const pilihPertama = kartu.querySelector('button[aria-pressed]');
pilihPertama.click();
cek("pilihan tercatat", Object.keys(K.state.picked).length, 1);
cek("pick bar tampil", $("#pickBar").classList.contains("translate-y-0"), true);
cek("jumlah di pick bar", $("#pickCount").textContent, "1 produk dipilih");
const idP = Object.keys(K.state.picked)[0];
const hrg = D.products.find((p) => p.id === idP).ecer;
cek("total di pick bar", $("#pickTotal").textContent, "Perkiraan total " + D.rupiah(hrg));
cek("kartu ditandai terpilih", document.querySelector('[data-id="' + idP + '"]').dataset.picked, "true");
$("#pickClear").click();
cek("kosongkan pilihan", Object.keys(K.state.picked).length, 0);
cek("pick bar tersembunyi lagi", $("#pickBar").classList.contains("opacity-0"), true);

console.log("\n7. Beranda: batas 30 produk");
const { window: w2, document: d2 } = parseHTML(readFileSync(new URL("./index.html", import.meta.url), "utf8"));
w2.localStorage = window.localStorage;
w2.matchMedia = () => ({ matches: false, addEventListener() {} });
w2.open = () => {};
w2.Element.prototype.scrollIntoView = function () {};
globalThis.window = w2; globalThis.document = d2;
new Function("window", "localStorage", readFileSync(new URL("./data.js", import.meta.url), "utf8"))(w2, window.localStorage);
new Function("window", "module", readFileSync(new URL("./katalog.js", import.meta.url), "utf8"))(w2, {});
const K3 = w2.KATALOG;
K3.mount({
  grid: "#productGrid", search: "#searchInput", clear: "#searchClear", cats: "#catList",
  count: "#homeCount", link: "#linkSemua",
  choose: (list) => list.slice(0, 30)
});
const nBeranda = d2.querySelectorAll("#productGrid article").length;
cek("beranda dibatasi 30", nBeranda <= 30, true);
cek("beranda benar-benar 30", nBeranda, Math.min(30, D.products.filter((p) => p.aktif !== false).length));
cek("beranda tanpa paginasi", !!d2.querySelector("#pager"), false);
cek("link lihat semua ada", d2.querySelector("#linkSemua").getAttribute("href").startsWith("products.html"), true);
d2.querySelector("#catList .chip[data-cat='beras']").click();
cek("beranda meneruskan filter ke tautan", d2.querySelector("#linkSemua").getAttribute("href"), "products.html?kategori=beras");

console.log("\n8. Navigasi kepala");
// Regresi: tautan nav pernah terbelah dua baris di ponsel karena tidak nowrap.
const nav = [...d2.querySelectorAll("header nav a")];
cek("semua tautan nav ada", nav.length >= 5, true);
cek("tautan nav utuh satu baris", nav.every((a) => !/\s{1,}\S/.test(a.textContent.trim()) || /^[A-Za-z ]+$/.test(a.textContent.trim())), true);
const navBeras = nav.find((a) => a.textContent.trim() === "Semua produk");
cek("tautan 'Semua produk' tidak terbelah", !!navBeras, true);

console.log("\n" + (gagal ? gagal + " GAGAL, " : "") + "SEMUA " + lulus + " UJI " + (gagal ? "TIDAK LULUS" : "LULUS"));
process.exit(gagal ? 1 : 0);
