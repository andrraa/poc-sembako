/* ==========================================================================
   Pengujian modul AHP (ahp.js).
   Jalankan: node test-ahp.js
   Dipakai sebagai bukti pengujian hitung (lampiran skripsi).
   ========================================================================== */
"use strict";
const AHP = require("./ahp.js");

let gagal = 0, lulus = 0;
function cek(nama, dapat, harap, tol) {
  const ok = typeof harap === "number" ? Math.abs(dapat - harap) <= (tol || 1e-6) : dapat === harap;
  ok ? lulus++ : gagal++;
  const tampil = typeof dapat === "number" ? dapat.toFixed(6) : String(dapat);
  console.log((ok ? "  OK   " : "  GAGAL") + " " + nama + " → " + tampil + (ok ? "" : "  (diharap " + harap + ")"));
}

function eigenPower(m, iter) {
  const n = m.length;
  let v = new Array(n).fill(1 / n);
  for (let k = 0; k < (iter || 500); k++) {
    const nv = m.map(row => row.reduce((s, x, j) => s + x * v[j], 0));
    const sum = nv.reduce((a, b) => a + b, 0);
    v = nv.map(x => x / sum);
  }
  return v;
}
const urut = (arr) => arr.map((x, i) => [x, i]).sort((a, b) => b[0] - a[0]).map(x => x[1]).join(",");

console.log("\n1. Matriks konsisten (a_ij = w_i / w_j)");
const w = [0.5, 0.25, 0.125, 0.125];
const Mkonsisten = w.map(a => w.map(b => a / b));
let r = AHP.hitungAHP(Mkonsisten);
cek("CR = 0", r.cr, 0, 1e-9);
cek("lambda_max = n", r.lambdaMax, 4, 1e-9);
w.forEach((v, i) => cek("bobot ke-" + (i + 1) + " pulih", r.weights[i], v, 1e-9));
cek("geometric mean = eigenvector", Math.max(...r.weights.map((x, i) => Math.abs(x - eigenPower(Mkonsisten)[i]))), 0, 1e-9);

console.log("\n2. Contoh buku Saaty 3x3 [[1,3,5],[1/3,1,3],[1/5,1/3,1]] — nilai acuan literatur");
const saaty = AHP.buildMatrix(3, [{ i: 0, j: 1, nilai: 3 }, { i: 0, j: 2, nilai: 5 }, { i: 1, j: 2, nilai: 3 }]);
r = AHP.hitungAHP(saaty);
cek("lambda_max = 3.0385", r.lambdaMax, 3.0385, 1e-4);
cek("CI = 0.01925", r.ci, 0.01925, 1e-5);
cek("RI = 0.58", r.ri, 0.58);
cek("CR = 0.0332", r.cr, 0.0332, 1e-4);
cek("dinyatakan konsisten", r.consistent, true);
cek("bobot[0] = 0.637", r.weights[0], 0.6370, 1e-3);
cek("bobot[1] = 0.2583", r.weights[1], 0.2583, 1e-3);
cek("bobot[2] = 0.1047", r.weights[2], 0.1047, 1e-3);

console.log("\n3. Matriks tidak konsisten: metode tidak boleh mengubah urutan prioritas");
const Mtak = AHP.buildMatrix(5, [
  { i: 0, j: 1, nilai: 3 }, { i: 0, j: 2, nilai: 5 }, { i: 0, j: 3, nilai: 7 }, { i: 0, j: 4, nilai: 2 },
  { i: 1, j: 2, nilai: 4 }, { i: 1, j: 3, nilai: 2 }, { i: 1, j: 4, nilai: 6 },
  { i: 2, j: 3, nilai: 1 / 3 }, { i: 2, j: 4, nilai: 3 }, { i: 3, j: 4, nilai: 5 }
]);
r = AHP.hitungAHP(Mtak);
const ev = eigenPower(Mtak);
cek("urutan prioritas sama dengan eigenvector", urut(r.weights), urut(ev));
cek("selisih bobot < 0,05", Math.max(...r.weights.map((x, i) => Math.abs(x - ev[i]))) < 0.05, true);
cek("CR > 0,1 ditandai tidak konsisten", r.cr > 0.1, true);
cek("total bobot = 1", r.weights.reduce((a, b) => a + b, 0), 1, 1e-12);

console.log("\n4. Matriks ekstrem: CR jauh di atas ambang");
const buruk = AHP.buildMatrix(3, [{ i: 0, j: 1, nilai: 9 }, { i: 0, j: 2, nilai: 9 }, { i: 1, j: 2, nilai: 1 / 9 }]);
cek("CR > 0,1", AHP.hitungAHP(buruk).cr > 0.1, true);
cek("consistent = false", AHP.hitungAHP(buruk).consistent, false);

console.log("\n5. Penjagaan masukan");
cek("matriks non-resiprokal ditolak", AHP.hitungAHP([[1, 2], [3, 1]]).error != null, true);
cek("matriks kosong ditolak", AHP.hitungAHP([]).error != null, true);
cek("nilai 0 diabaikan (tetap 1)", AHP.buildMatrix(2, [{ i: 0, j: 1, nilai: 0 }])[0][1] === 1, true);
cek("nilai negatif diabaikan", AHP.buildMatrix(2, [{ i: 0, j: 1, nilai: -3 }])[0][1] === 1, true);
cek("n = 1 → bobot tunggal 1", AHP.hitungAHP([[1]]).weights[0], 1);
cek("sel a_ji = 1/a_ij", AHP.buildMatrix(2, [{ i: 0, j: 1, nilai: 4 }])[1][0], 0.25);

console.log("\n6. Perangkingan alternatif");
const rank = AHP.rangking([0.5, 0.3, 0.2], { a: [5, 3, 1], b: [1, 5, 3], c: [3, 1, 5] });
cek("skor a = 3.6", rank[0].skor, 3.6, 1e-9);
cek("peringkat 1 = a", rank[0].id, "a");
cek("peringkat 2 = c", rank[1].id, "c");
cek("skor b = 2.6", rank[2].skor, 2.6, 1e-9);

console.log("\n" + (gagal === 0 ? "SEMUA " + lulus + " UJI LULUS" : lulus + " lulus, " + gagal + " GAGAL"));
process.exit(gagal ? 1 : 0);
