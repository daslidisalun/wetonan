// ============================================================
// jawa.js — Pustaka kalender Jawa & weton (ESM murni, tanpa dependensi)
// Dipakai bersama oleh: halaman Astro (build & browser) dan scripts/*.mjs
//
// Jangkar kalibrasi (diverifikasi dari sumber terbitan, Nov 2026):
//  A. 17 Agustus 1945  = Jumat Legi, neptu 11          (journalarta.com, dll.)
//  B. 1 Januari 2026   = Kamis Pon, 12 Rejeb 1959 Dal, neptu 15,
//                         wuku Kuruwelut                (kalenderku.id, petungan.id)
//  C. 27 Juni 2025     = Jumat Kliwon, 1 Suro 1959 Dal (Kalender Hijriah
//                         Kemenag RI; malam 1 Suro mulai senja 26 Juni 2025)
// ============================================================

export const HARI = [
  { id: 'minggu', nama: 'Minggu', jawa: 'Ngahad', neptu: 5 },
  { id: 'senin', nama: 'Senin', jawa: 'Senen', neptu: 4 },
  { id: 'selasa', nama: 'Selasa', jawa: 'Selasa', neptu: 3 },
  { id: 'rabu', nama: 'Rabu', jawa: 'Rebo', neptu: 7 },
  { id: 'kamis', nama: 'Kamis', jawa: 'Kemis', neptu: 8 },
  { id: 'jumat', nama: 'Jumat', jawa: 'Jumat', neptu: 6 },
  { id: 'sabtu', nama: 'Sabtu', jawa: 'Setu', neptu: 9 },
];

export const PASARAN = [
  { id: 'legi', nama: 'Legi', neptu: 5 },
  { id: 'pahing', nama: 'Pahing', neptu: 9 },
  { id: 'pon', nama: 'Pon', neptu: 7 },
  { id: 'wage', nama: 'Wage', neptu: 4 },
  { id: 'kliwon', nama: 'Kliwon', neptu: 8 },
];

// Urutan: Suro, Sapar, Mulud, Bakda Mulud, Jumadilawal, Jumadilakir,
// Rejeb, Ruwah, Poso, Sawal, Dulkangidah (Sela/Apit), Besar.
export const BULAN_JAWA = [
  { nama: 'Suro', alt: 'Muharram' },
  { nama: 'Sapar', alt: 'Safar' },
  { nama: 'Mulud', alt: 'Rabiulawal' },
  { nama: 'Bakda Mulud', alt: 'Rabiulakhir' },
  { nama: 'Jumadilawal', alt: 'Jumadil Ula' },
  { nama: 'Jumadilakir', alt: 'Jumadil Akhirah' },
  { nama: 'Rejeb', alt: 'Rajab' },
  { nama: 'Ruwah', alt: 'Syakban' },
  { nama: 'Poso', alt: 'Ramadan' },
  { nama: 'Sawal', alt: 'Syawal' },
  { nama: 'Dulkangidah', alt: 'Zulkaidah (Sela/Apit)' },
  { nama: 'Besar', alt: 'Zulhijah' },
];
// Panjang bulan pada tahun biasa; Besar menjadi 30 pada tahun kabisat (wuntu).
export const PANJANG_BULAN = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];

export const WINDU = ['Alip', 'Ehe', 'Jimawal', 'Je', 'Dal', 'Be', 'Wawu', 'Jimakir'];
// Tahun kabisat windu: tahun ke-2 (Ehe), ke-5 (Dal), ke-8 (Jimakir) — indeks 1, 4, 7.
export const PANJANG_TAHUN_WINDU = [354, 355, 354, 354, 355, 354, 354, 355];
export const HARI_PER_WINDU = 2835; // 8 x 354 + 3

export const WUKU = [
  'Sinta', 'Landep', 'Wukir', 'Kurantil', 'Tolu', 'Gumbreg', 'Warigalit',
  'Warigagung', 'Julungwangi', 'Sungsang', 'Galungan', 'Kuningan', 'Langkir',
  'Mandasiya', 'Julungpujut', 'Pahang', 'Kuruwelut', 'Marakeh', 'Tambir',
  'Medangkungan', 'Maktal', 'Wuye', 'Manahil', 'Prangbakat', 'Bala', 'Wugu',
  'Wayang', 'Kulawu', 'Dukut', 'Watugunung',
];

// ---------- Julian Day Number ----------
export function gregorianToJDN(y, m, d) {
  const a = Math.floor((14 - m) / 12);
  const y2 = y + 4800 - a;
  const m2 = m + 12 * a - 3;
  return (
    d +
    Math.floor((153 * m2 + 2) / 5) +
    365 * y2 +
    Math.floor(y2 / 4) -
    Math.floor(y2 / 100) +
    Math.floor(y2 / 400) -
    32045
  );
}

export function jdnToGregorian(jdn) {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d2 = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d2) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d2 - 4800 + Math.floor(m / 10);
  return { y: year, m: month, d: day };
}

const mod = (n, p) => ((n % p) + p) % p;

// ---------- Jangkar ----------
// JDN 17 Agustus 1945 (Jumat Legi)
export const JDN_ACUAN_LEGI = gregorianToJDN(1945, 8, 17);
// JDN 1 Suro 1959 AJ = 27 Juni 2025; selisih 1 Suro 1555 -> 1959 = 404 tahun
// = 50 windu + 4 tahun (354+355+354+354) = 141.750 + 1.417 = 143.167 hari.
export const JDN_1_SURO_1555 = gregorianToJDN(2025, 6, 27) - 143167;
// Wuku: pekan Kuruwelut (indeks 16) dimulai Minggu 28 Desember 2025;
// awal Sinta = 16 pekan sebelumnya.
export const JDN_AWAL_SINTA = gregorianToJDN(2025, 12, 28) - 16 * 7;

// ---------- Weton dari JDN ----------
export function wetonFromJDN(jdn) {
  const hariIdx = mod(jdn + 1, 7); // 0 = Minggu
  const pasaranIdx = mod(jdn - JDN_ACUAN_LEGI, 5);
  const hari = HARI[hariIdx];
  const pasaran = PASARAN[pasaranIdx];
  return {
    jdn,
    hariIdx,
    pasaranIdx,
    hari,
    pasaran,
    neptuHari: hari.neptu,
    neptuPasaran: pasaran.neptu,
    neptu: hari.neptu + pasaran.neptu,
    nama: `${hari.nama} ${pasaran.nama}`,
    slug: `${hari.id}-${pasaran.id}`,
  };
}

// ---------- Kalender Jawa dari JDN ----------
export function jawaFromJDN(jdn) {
  const total = jdn - JDN_1_SURO_1555; // hari sejak 1 Suro 1555 AJ
  const winduKe = Math.floor(total / HARI_PER_WINDU);
  let sisa = total - winduKe * HARI_PER_WINDU;
  let thnIdx = 0;
  while (sisa >= PANJANG_TAHUN_WINDU[thnIdx]) {
    sisa -= PANJANG_TAHUN_WINDU[thnIdx];
    thnIdx++;
  }
  const tahun = 1555 + winduKe * 8 + thnIdx;
  const kabisat = PANJANG_TAHUN_WINDU[thnIdx] === 355;
  let blnIdx = 0;
  for (;;) {
    const pjg = PANJANG_BULAN[blnIdx] + (blnIdx === 11 && kabisat ? 1 : 0);
    if (sisa < pjg) break;
    sisa -= pjg;
    blnIdx++;
  }
  return {
    tanggal: sisa + 1,
    bulanIdx: blnIdx,
    bulan: BULAN_JAWA[blnIdx],
    tahun,
    winduIdx: thnIdx,
    windu: WINDU[thnIdx],
    kabisat,
  };
}

// ---------- Wuku dari JDN ----------
export function wukuFromJDN(jdn) {
  const pos = mod(jdn - JDN_AWAL_SINTA, 210);
  const idx = Math.floor(pos / 7);
  return { idx, nama: WUKU[idx], hariKe: (pos % 7) + 1 };
}

// ---------- API utama ----------
export function wetonOf(y, m, d) {
  const jdn = gregorianToJDN(y, m, d);
  const w = wetonFromJDN(jdn);
  const jawa = jawaFromJDN(jdn);
  const wuku = wukuFromJDN(jdn);
  return { ...w, jawa, wuku, gregorian: { y, m, d } };
}

export function wetonOfDate(date) {
  return wetonOf(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

// ---------- 35 weton ----------
// Urutan siklus 35 hari: mulai Minggu Legi, maju sehari-hari.
export const SEMUA_WETON = (() => {
  const daftar = [];
  // Cari JDN terdekat dengan Minggu Legi dari acuan Legi:
  let j = JDN_ACUAN_LEGI;
  while (mod(j + 1, 7) !== 0) j += 5; // tetap Legi, geser sampai Minggu
  for (let i = 0; i < 35; i++) {
    daftar.push(wetonFromJDN(j + i));
  }
  return daftar;
})();

export function wetonBySlug(slug) {
  return SEMUA_WETON.find((w) => w.slug === slug);
}

// ---------- Jodoh (petung neptu berdua) ----------
export const JODOH_KATEGORI = [
  null, // sisa 0 ditangani terpisah (Pesthi)
  'Pegat', 'Ratu', 'Jodoh', 'Topo', 'Tinari', 'Padu', 'Sujanan',
];
export function kategoriJodoh(totalNeptu) {
  const sisa = mod(totalNeptu, 8);
  return sisa === 0 ? 'Pesthi' : JODOH_KATEGORI[sisa];
}

export const NAMA_BULAN_MASEHI = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli',
  'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export function formatTanggalID(y, m, d) {
  const w = wetonFromJDN(gregorianToJDN(y, m, d));
  return `${w.hari.nama}, ${d} ${NAMA_BULAN_MASEHI[m - 1]} ${y}`;
}

// ---------- Konversi balik: tanggal Jawa -> JDN / Masehi ----------
// Kebalikan persis jawaFromJDN, memakai tetapan & tabel yang sama:
// satu windu = 2.835 hari; hari lebihan kabisat selalu di bulan Besar.
export function tahunJawaInfo(tahun) {
  const selisih = tahun - 1555;
  const winduKe = Math.floor(selisih / 8);
  const winduIdx = selisih - winduKe * 8; // 0..7
  return {
    winduKe,
    winduIdx,
    windu: WINDU[winduIdx],
    kabisat: PANJANG_TAHUN_WINDU[winduIdx] === 355,
    panjang: PANJANG_TAHUN_WINDU[winduIdx],
  };
}

export function panjangBulanJawa(bulanIdx, tahun) {
  const { kabisat } = tahunJawaInfo(tahun);
  return PANJANG_BULAN[bulanIdx] + (bulanIdx === 11 && kabisat ? 1 : 0);
}

export function jdnFromJawa(tanggal, bulanIdx, tahun) {
  const { winduKe, winduIdx, kabisat } = tahunJawaInfo(tahun);
  let hari = winduKe * HARI_PER_WINDU;
  for (let i = 0; i < winduIdx; i++) hari += PANJANG_TAHUN_WINDU[i];
  for (let b = 0; b < bulanIdx; b++) {
    hari += PANJANG_BULAN[b] + (b === 11 && kabisat ? 1 : 0);
  }
  return JDN_1_SURO_1555 + hari + (tanggal - 1);
}

// Hasil berbentuk sama dengan wetonOf(): weton + jawa + wuku + gregorian.
export function wetonFromJawa(tanggal, bulanIdx, tahun) {
  const jdn = jdnFromJawa(tanggal, bulanIdx, tahun);
  return {
    ...wetonFromJDN(jdn),
    jawa: jawaFromJDN(jdn),
    wuku: wukuFromJDN(jdn),
    gregorian: jdnToGregorian(jdn),
  };
}

// ---------- Hari baik: petungan sisa bagi lima ----------
// Pakem klasik: neptu hari itu (dina + pasaran) dibagi 5;
// sisa 1 Sri, 2 Lungguh, 3 Dunia, 4 Lara, 0 Pati.
export const GOLONGAN_HARI_BAIK = { 1: 'Sri', 2: 'Lungguh', 3: 'Dunia', 4: 'Lara', 0: 'Pati' };
export function golonganHariBaik(neptu) {
  const sisa = mod(neptu, 5);
  return { sisa, nama: GOLONGAN_HARI_BAIK[sisa] };
}
