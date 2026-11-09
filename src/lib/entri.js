// entri.js — perakit tampilan "entri almanak" & tabel kalender bulan.
// Dipakai server-side (Astro) dan client-side (halaman perkakas).
import {
  wetonOf, wetonFromJDN, gregorianToJDN, jdnToGregorian,
  NAMA_BULAN_MASEHI,
} from './jawa.js';
import { WATAK_DINA, WATAK_PASARAN, CATATAN_NEPTU, PEMBUKA_WETON } from './konten.js';
import { u } from './base.js';

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const iso = (y, m, d) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

// ---------- Entri almanak untuk satu tanggal ----------
export function entriHTML(y, m, d, { watak = true } = {}) {
  const w = wetonOf(y, m, d);
  const tglID = `${w.hari.nama}, ${d} ${NAMA_BULAN_MASEHI[m - 1]} ${y}`;
  let h = '';
  h += `<h3 class="entri-judul">${esc(w.nama)}</h3>`;
  h += `<p class="entri-sub">${esc(tglID)} · neptu ${w.neptu}</p>`;
  h += `<table class="fakta"><tbody>`;
  h += `<tr><th>Dina (hari)</th><td>${esc(w.hari.nama)} — dalam sebutan Jawa: ${esc(w.hari.jawa)}</td></tr>`;
  h += `<tr><th>Neptu dina</th><td class="angka">${w.neptuHari}</td></tr>`;
  h += `<tr><th>Pasaran</th><td>${esc(w.pasaran.nama)}</td></tr>`;
  h += `<tr><th>Neptu pasaran</th><td class="angka">${w.neptuPasaran}</td></tr>`;
  h += `<tr><th>Jumlah neptu weton</th><td class="angka"><strong>${w.neptuHari} + ${w.neptuPasaran} = ${w.neptu}</strong></td></tr>`;
  h += `<tr><th>Tanggal Jawa</th><td>${w.jawa.tanggal} ${esc(w.jawa.bulan.nama)} ${w.jawa.tahun} AJ</td></tr>`;
  h += `<tr><th>Tahun &amp; windu</th><td>${w.jawa.tahun} — tahun ${esc(w.jawa.windu)}${w.jawa.kabisat ? ' (tahun wuntu/kabisat, 355 hari)' : ' (354 hari)'}</td></tr>`;
  h += `<tr><th>Wuku</th><td>${esc(w.wuku.nama)} — hari ke-${w.wuku.hariKe} dalam pekan wuku</td></tr>`;
  h += `<tr><th>Ulasan lengkap</th><td><a href="${u(`/weton/${w.slug}/`)}">Baca entri weton ${esc(w.nama)} →</a></td></tr>`;
  h += `</tbody></table>`;
  if (watak) {
    h += `<p><strong>${esc(PEMBUKA_WETON[w.slug] ?? '')}</strong></p>`;
    h += `<p>${esc(WATAK_DINA[w.hari.id] ?? '')}</p>`;
    h += `<p>${esc(WATAK_PASARAN[w.pasaran.id] ?? '')}</p>`;
    h += `<p>${esc(CATATAN_NEPTU[w.neptu] ?? '')}</p>`;
    h += `<p class="kecil"><em>Uraian watak di atas adalah bacaan tradisi primbon sebagaimana diwariskan turun-temurun — bahan perenungan budaya, bukan kepastian tentang diri seseorang.</em></p>`;
  }
  return h;
}

// ---------- Tabel kalender satu bulan Masehi ----------
export function kalenderHTML(y, m, { tautan = true } = {}) {
  const hariIni = new Date();
  const jdnAwal = gregorianToJDN(y, m, 1);
  const jdnAkhir = m === 12 ? gregorianToJDN(y + 1, 1, 1) - 1 : gregorianToJDN(y, m + 1, 1) - 1;
  const jumlahHari = jdnAkhir - jdnAwal + 1;
  const geser = wetonFromJDN(jdnAwal).hariIdx; // 0 = Minggu
  const jwAwal = wetonOf(y, m, 1).jawa;
  const gAkhir = jdnToGregorian(jdnAkhir);
  const jwAkhir = wetonOf(gAkhir.y, gAkhir.m, gAkhir.d).jawa;

  const kepalaBulan =
    jwAwal.bulan.nama === jwAkhir.bulan.nama
      ? `${jwAwal.bulan.nama} ${jwAkhir.tahun} AJ`
      : `${jwAwal.bulan.nama} – ${jwAkhir.bulan.nama} ${jwAkhir.tahun} AJ`;

  let h = `<table class="kalender">`;
  h += `<caption>${NAMA_BULAN_MASEHI[m - 1]} ${y} <span style="font-weight:400;font-style:italic;font-size:0.82em">— bertepatan ${kepalaBulan} (${jwAkhir.windu})</span></caption>`;
  h += `<thead><tr>${['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((n) => `<th scope="col">${n}</th>`).join('')}</tr></thead><tbody>`;
  let sel = 0;
  const totalSel = Math.ceil((geser + jumlahHari) / 7) * 7;
  for (let r = 0; r < totalSel / 7; r++) {
    h += '<tr>';
    for (let c = 0; c < 7; c++, sel++) {
      const noHari = sel - geser + 1;
      if (noHari < 1 || noHari > jumlahHari) {
        h += '<td class="kosong" aria-hidden="true">·</td>';
        continue;
      }
      const w = wetonOf(y, m, noHari);
      const iniHariIni =
        hariIni.getFullYear() === y && hariIni.getMonth() + 1 === m && hariIni.getDate() === noHari;
      const isi =
        `<span class="tgl">${noHari}</span>` +
        `<span class="pas">${esc(w.pasaran.nama)} · n${w.neptu}</span>` +
        `<span class="jw">${w.jawa.tanggal} ${esc(w.jawa.bulan.nama)}</span>`;
      h += `<td class="${iniHariIni ? 'hari-ini' : ''}">${tautan ? `<a href="${u(`/kalkulator-weton/?tgl=${iso(y, m, noHari)}`)}" title="Weton ${esc(w.nama)}">${isi}</a>` : isi}</td>`;
    }
    h += '</tr>';
  }
  h += `</tbody></table>`;
  return h;
}
