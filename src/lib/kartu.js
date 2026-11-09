// kartu.js — Kartu Weton PNG (1080 x 1350) digambar dengan canvas,
// bergaya almanak cetak: kertas daluang, tinta cokelat-hitam, bata merah.
// Dipakai halaman kalkulator & siklus weton (client-side saja).
import { formatTanggalID } from './jawa.js';

const KERTAS = '#f4ecda';
const KERTAS_TERANG = '#faf5e9';
const TINTA = '#2a211a';
const TINTA_LUNAK = '#5a4c3e';
const BATA = '#a03a28';
const EMAS = '#b8892e';

// w: objek berbentuk wetonOf()/wetonFromJawa() (weton + jawa + wuku + gregorian).
export function gambarKartuWeton(w) {
  const cv = document.createElement('canvas');
  cv.width = 1080;
  cv.height = 1350;
  const c = cv.getContext('2d');

  // latar kertas + tekstur titik halus
  c.fillStyle = KERTAS;
  c.fillRect(0, 0, 1080, 1350);
  c.fillStyle = 'rgba(180, 158, 110, 0.20)';
  for (let x = 14; x < 1080; x += 26) {
    for (let y = 14; y < 1350; y += 26) {
      c.beginPath();
      c.arc(x, y, 1.6, 0, Math.PI * 2);
      c.fill();
    }
  }

  // bingkai ganda khas almanak
  c.strokeStyle = TINTA;
  c.lineWidth = 7;
  c.strokeRect(38, 38, 1004, 1274);
  c.lineWidth = 2;
  c.strokeRect(60, 60, 960, 1230);
  // panel terang di dalam
  c.fillStyle = KERTAS_TERANG;
  c.fillRect(78, 78, 924, 1194);

  const tengah = 540;
  const garisGanda = (y) => {
    c.strokeStyle = TINTA;
    c.lineWidth = 3;
    c.beginPath(); c.moveTo(130, y); c.lineTo(950, y); c.stroke();
    c.lineWidth = 1.2;
    c.beginPath(); c.moveTo(130, y + 7); c.lineTo(950, y + 7); c.stroke();
  };
  const ornamenBelah = (y) => {
    c.save();
    c.strokeStyle = BATA;
    c.lineWidth = 3;
    c.beginPath(); c.moveTo(300, y); c.lineTo(492, y); c.stroke();
    c.beginPath(); c.moveTo(588, y); c.lineTo(780, y); c.stroke();
    c.beginPath();
    c.moveTo(tengah, y - 18); c.lineTo(tengah + 18, y); c.lineTo(tengah, y + 18); c.lineTo(tengah - 18, y);
    c.closePath(); c.stroke();
    c.fillStyle = BATA;
    c.beginPath(); c.arc(tengah, y, 5, 0, Math.PI * 2); c.fill();
    c.restore();
  };

  c.textAlign = 'center';
  c.textBaseline = 'middle';

  // --- masthead ---
  c.fillStyle = TINTA_LUNAK;
  c.font = '600 30px "IBM Plex Mono", monospace';
  c.fillText('ALMANAK JAWA DIGITAL', tengah, 138);
  c.fillStyle = TINTA;
  c.font = '800 96px Spectral, Georgia, serif';
  c.fillText('WETONAN', tengah, 226);
  c.fillStyle = BATA;
  c.beginPath(); c.arc(952, 205, 9, 0, Math.PI * 2); c.fill();
  garisGanda(300);

  // --- label & nama weton ---
  c.fillStyle = BATA;
  c.font = '600 30px "IBM Plex Mono", monospace';
  c.fillText('— WETON —', tengah, 372);
  c.fillStyle = TINTA;
  c.font = '700 118px Spectral, Georgia, serif';
  c.fillText(w.nama, tengah, 492);
  c.fillStyle = TINTA;
  c.font = '600 44px "IBM Plex Mono", monospace';
  c.fillText(`NEPTU ${w.neptu}`, tengah, 596);
  c.fillStyle = TINTA_LUNAK;
  c.font = 'italic 500 36px Spectral, Georgia, serif';
  c.fillText(`${w.hari.nama} ${w.neptuHari} + ${w.pasaran.nama} ${w.neptuPasaran}`, tengah, 652);
  ornamenBelah(724);

  // --- rincian ---
  const baris = [
    ['TANGGAL MASEHI', formatTanggalID(w.gregorian.y, w.gregorian.m, w.gregorian.d)],
    ['TANGGAL JAWA', `${w.jawa.tanggal} ${w.jawa.bulan.nama} ${w.jawa.tahun} AJ`],
    ['TAHUN WINDU', `${w.jawa.windu}${w.jawa.kabisat ? ' (wuntu, 355 hari)' : ''}`],
    ['WUKU', `${w.wuku.nama} — hari ke-${w.wuku.hariKe}`],
  ];
  let y = 806;
  for (const [label, nilai] of baris) {
    c.fillStyle = TINTA_LUNAK;
    c.font = '600 27px "IBM Plex Mono", monospace';
    c.fillText(label, tengah, y);
    c.fillStyle = TINTA;
    c.font = '600 52px Spectral, Georgia, serif';
    c.fillText(nilai, tengah, y + 58);
    y += 138;
  }

  // --- kaki kartu ---
  garisGanda(1210);
  c.fillStyle = TINTA_LUNAK;
  c.font = 'italic 400 29px Spectral, Georgia, serif';
  c.fillText('Warisan budaya Jawa — bahan perenungan, bukan ramalan.', tengah, 1252);

  return cv;
}

export function unduhKartuWeton(w) {
  const unduh = () => {
    const cv = gambarKartuWeton(w);
    cv.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `weton-${w.slug}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    }, 'image/png');
  };
  // Pastikan fon Spectral/IBM Plex Mono sudah termuat agar kartu tidak
  // tergambar dengan fon cadangan.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(unduh);
  else unduh();
}
