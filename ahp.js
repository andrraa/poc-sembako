/* ==========================================================================
   AHP (Analytical Hierarchy Process) - perhitungan bobot kriteria.
   Dipakai halaman admin, dan bisa dijalankan di Node untuk pengujian.

   Rumus yang dipakai:
     - Bobot prioritas  : rata-rata geometrik tiap baris, lalu dinormalkan
                          (Saaty, pendekatan yang paling umum dipakai).
     - Lambda maksimum  : rata-rata dari (A.w)_i / w_i
     - Consistency Index: CI = (lambda_max - n) / (n - 1)
     - Consistency Ratio: CR = CI / RI
     - Dinyatakan konsisten bila CR <= 0,1 (10%).
   ========================================================================== */
(function (global) {
  "use strict";

  // Random Index (Saaty) untuk n = 1..15
  var RI = [0, 0, 0.58, 0.90, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49, 1.51, 1.48, 1.56, 1.57, 1.59];

  /**
   * Menyusun matriks n x n dari daftar pasangan.
   * pairs: [{ i, j, nilai }] dengan nilai = a_ij (skala 1-9, boleh pecahan 1/3 dst).
   * Sel a_ji otomatis diisi 1/nilai, diagonal 1.
   */
  function buildMatrix(n, pairs) {
    var m = [];
    for (var a = 0; a < n; a++) {
      m.push(new Array(n).fill(1));
    }
    (pairs || []).forEach(function (p) {
      var v = Number(p.nilai);
      if (!(v > 0)) return;
      m[p.i][p.j] = v;
      m[p.j][p.i] = 1 / v;
    });
    return m;
  }

  /** Benar-benar konsisten: a_ik = a_ij * a_jk untuk semua i, j, k. */
  function checkReciprocal(m) {
    var n = m.length;
    for (var i = 0; i < n; i++) {
      if (Math.abs(m[i][i] - 1) > 1e-9) return false;
      for (var j = i + 1; j < n; j++) {
        if (Math.abs(m[i][j] * m[j][i] - 1) > 1e-6) return false;
      }
    }
    return true;
  }

  /**
   * Inti AHP: bobot prioritas + uji konsistensi.
   * return { weights, lambdaMax, ci, cr, ri, consistent, ok, error }
   */
  function hitungAHP(matriks) {
    var n = matriks.length;
    if (!n) return { error: "Matriks kosong." };
    if (!checkReciprocal(matriks)) return { error: "Matriks tidak resiprokal (a_ij harus 1/a_ji)." };
    if (n === 1) return { weights: [1], lambdaMax: 1, ci: 0, cr: 0, ri: 0, consistent: true, ok: true };

    // 1. Rata-rata geometrik tiap baris
    var gm = matriks.map(function (row) {
      var kali = 1;
      for (var j = 0; j < n; j++) kali *= row[j];
      return Math.pow(Math.abs(kali), 1 / n) * (kali < 0 ? -1 : 1);
    });

    // 2. Normalkan jadi bobot (total = 1)
    var jumlah = gm.reduce(function (s, v) { return s + v; }, 0);
    var weights = gm.map(function (v) { return v / jumlah; });

    // 3. lambda_max = rata-rata dari (A.w)_i / w_i
    var lambdaMax = 0;
    for (var i = 0; i < n; i++) {
      var barisKaliW = 0;
      for (var j = 0; j < n; j++) barisKaliW += matriks[i][j] * weights[j];
      lambdaMax += barisKaliW / weights[i];
    }
    lambdaMax /= n;

    var ci = (lambdaMax - n) / (n - 1);
    var ri = RI[n - 1] != null ? RI[n - 1] : 1.59;
    var cr = ri === 0 ? 0 : ci / ri;

    return {
      weights: weights,
      lambdaMax: lambdaMax,
      ci: ci,
      ri: ri,
      cr: cr,
      consistent: cr <= 0.1,
      ok: cr <= 0.1
    };
  }

  /**
   * Nilai akhir tiap alternatif = jumlah (bobot kriteria x nilai alternatif).
   * bobot   : [w1, w2, ...]
   * penilaian: { idAlternatif: [nilai1, nilai2, ...] }  (skala 1-9)
   * return array terurut menurun: [{ id, skor, nilai }]
   */
  function rangking(bobot, penilaian) {
    var hasil = Object.keys(penilaian).map(function (id) {
      var nilai = penilaian[id];
      var skor = bobot.reduce(function (s, w, i) { return s + w * (Number(nilai[i]) || 0); }, 0);
      return { id: id, skor: skor, nilai: nilai };
    });
    hasil.sort(function (a, b) { return b.skor - a.skor; });
    hasil.forEach(function (h, i) { h.peringkat = i + 1; });
    return hasil;
  }

  /* ------------------------------ skala Saaty ----------------------------- */
  // Nilai a_ij ditulis dari sudut pandang "seberapa lebih penting baris i
  // dibanding kolom j", jadi 1/3 berarti kolom j justru 3x lebih penting.
  var SKALA = [
    { nilai: 9, label: "9 - mutlak lebih penting" },
    { nilai: 7, label: "7 - sangat jauh lebih penting" },
    { nilai: 5, label: "5 - jelas lebih penting" },
    { nilai: 3, label: "3 - sedikit lebih penting" },
    { nilai: 1, label: "1 - sama penting" },
    { nilai: 1 / 3, label: "1/3 - sedikit kurang penting" },
    { nilai: 1 / 5, label: "1/5 - jelas kurang penting" },
    { nilai: 1 / 7, label: "1/7 - sangat jauh kurang penting" },
    { nilai: 1 / 9, label: "1/9 - mutlak kurang penting" }
  ];

  function labelSkala(v) {
    var found = SKALA.find(function (s) { return Math.abs(s.nilai - Number(v)) < 1e-9; });
    if (found) return found.label;
    if (Number(v) > 1) return Number(v).toFixed(2) + " - lebih penting";
    return "1/" + Math.round(1 / Number(v)) + " - kurang penting";
  }

  var api = { RI: RI, SKALA: SKALA, buildMatrix: buildMatrix, hitungAHP: hitungAHP, rangking: rangking, labelSkala: labelSkala };
  global.AHP = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
