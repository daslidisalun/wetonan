// Uji kalender Jawa & weton terhadap jangkar terverifikasi.
// Jangkar:
//  A. 17 Agu 1945 = Jumat Legi, neptu 11 — journalarta.com & banyak sumber sejarah
//  B. 1 Jan 2026  = Kamis Pon, 12 Rejeb 1959 Dal, neptu 15, wuku Kuruwelut
//                   — kalenderku.id; petungan.id (tabel Januari 2026)
//  C. 27 Jun 2025 = Jumat Kliwon, 1 Suro 1959 Dal — Kalender Hijriah Kemenag RI
//                   (malam 1 Suro mulai senja 26 Jun 2025)
import assert from 'node:assert/strict';
import {
  gregorianToJDN, jdnToGregorian, wetonOf, kategoriJodoh, SEMUA_WETON,
} from '../src/lib/jawa.js';

let n = 0;
const cek = (label, fn) => { fn(); n++; console.log(`  ✓ ${label}`); };

// --- Jangkar A ---
cek('A: 17 Agu 1945 = Jumat Legi', () => {
  const w = wetonOf(1945, 8, 17);
  assert.equal(w.nama, 'Jumat Legi');
  assert.equal(w.neptu, 11);
});

// --- Jangkar B ---
cek('B: 1 Jan 2026 = Kamis Pon', () => {
  const w = wetonOf(2026, 1, 1);
  assert.equal(w.nama, 'Kamis Pon');
  assert.equal(w.neptuHari, 8);
  assert.equal(w.neptuPasaran, 7);
  assert.equal(w.neptu, 15);
});
cek('B: 1 Jan 2026 = 12 Rejeb 1959, windu Dal', () => {
  const j = wetonOf(2026, 1, 1).jawa;
  assert.equal(j.tanggal, 12);
  assert.equal(j.bulan.nama, 'Rejeb');
  assert.equal(j.tahun, 1959);
  assert.equal(j.windu, 'Dal');
  assert.equal(j.kabisat, true); // Dal = tahun kabisat windu
});
cek('B: 1 Jan 2026 wuku Kuruwelut', () => {
  assert.equal(wetonOf(2026, 1, 1).wuku.nama, 'Kuruwelut');
});

// --- Jangkar C ---
cek('C: 27 Jun 2025 = Jumat Kliwon, 1 Suro 1959 Dal', () => {
  const w = wetonOf(2025, 6, 27);
  assert.equal(w.nama, 'Jumat Kliwon');
  assert.equal(w.jawa.tanggal, 1);
  assert.equal(w.jawa.bulan.nama, 'Suro');
  assert.equal(w.jawa.tahun, 1959);
  assert.equal(w.jawa.windu, 'Dal');
});
cek('C: 26 Jun 2025 = 29 Besar 1958 (hari terakhir tahun Je)', () => {
  const j = wetonOf(2025, 6, 26).jawa;
  assert.equal(j.tanggal, 29);
  assert.equal(j.bulan.nama, 'Besar');
  assert.equal(j.tahun, 1958);
  assert.equal(j.windu, 'Je');
});

// --- Kelanjutan tahun kabisat: 1959 Dal 355 hari ---
cek('1 Suro 1960 jatuh 17 Jun 2026 (1959 = 355 hari)', () => {
  const j = wetonOf(2026, 6, 17).jawa;
  assert.equal(j.tanggal, 1);
  assert.equal(j.bulan.nama, 'Suro');
  assert.equal(j.tahun, 1960);
  assert.equal(j.windu, 'Be');
});

// --- Putaran JDN <-> Gregorian ---
cek('round-trip JDN untuk 5 tanggal contoh', () => {
  for (const [y, m, d] of [[1900, 1, 1], [1945, 8, 17], [2000, 2, 29], [2025, 6, 27], [2099, 12, 31]]) {
    assert.deepEqual(jdnToGregorian(gregorianToJDN(y, m, d)), { y, m, d });
  }
});

// --- Siklus 35 weton ---
cek('35 weton unik, semua kombinasi hari x pasaran', () => {
  assert.equal(SEMUA_WETON.length, 35);
  assert.equal(new Set(SEMUA_WETON.map((w) => w.slug)).size, 35);
  assert.equal(SEMUA_WETON[0].nama, 'Minggu Legi');
});
cek('rentang neptu weton 7..18', () => {
  const ns = SEMUA_WETON.map((w) => w.neptu);
  assert.equal(Math.min(...ns), 7);
  assert.equal(Math.max(...ns), 18);
});
cek('siklus berulang tepat 35 hari', () => {
  const a = wetonOf(1998, 5, 12);
  const b = wetonOf(1998, 6, 16); // +35 hari
  assert.equal(a.nama, b.nama);
  assert.equal(a.wuku.nama, wetonOf(1998, 5, 12).wuku.nama);
});

// --- Wuku berputar 210 hari ---
cek('wuku sama lagi setelah 210 hari', () => {
  const a = wetonOf(2024, 3, 3).wuku.nama;
  const jdn = gregorianToJDN(2024, 3, 3) + 210;
  const { y, m, d } = jdnToGregorian(jdn);
  assert.equal(wetonOf(y, m, d).wuku.nama, a);
});

// --- Jodoh: petungan sisa bagi 8 ---
cek('kategori jodoh untuk contoh total', () => {
  assert.equal(kategoriJodoh(17), 'Pegat'); // 17 % 8 = 1
  assert.equal(kategoriJodoh(18), 'Ratu');
  assert.equal(kategoriJodoh(19), 'Jodoh');
  assert.equal(kategoriJodoh(24), 'Pesthi'); // 24 % 8 = 0
  assert.equal(kategoriJodoh(23), 'Sujanan');
});

// --- Konsistensi sepekan Januari 2026 (petungan.id) ---
cek('15 Jan 2026 = Kamis Pahing, 26 Rejeb', () => {
  const w = wetonOf(2026, 1, 15);
  assert.equal(w.nama, 'Kamis Pahing');
  assert.equal(w.jawa.tanggal, 26);
  assert.equal(w.jawa.bulan.nama, 'Rejeb');
});

console.log(`\nSEMUA ${n} KELOMPOK ASSERTION LULUS`);
