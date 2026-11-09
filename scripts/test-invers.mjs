// Uji sifat bolak-balik (round-trip) konversi Jawa <-> Masehi.
// Untuk sampel tanggal Gregorian yang tersebar merata antara 1900 dan 2100:
//   wetonOf(tanggal) -> tanggal Jawa -> wetonFromJawa(tanggal Jawa)
// harus mengembalikan JDN, tanggal Gregorian, dan nama weton yang persis sama.
// Kegagalan apa pun berarti rantai konversi balik di jawa.js tidak konsisten
// dengan konversi maju — misalnya hari kabisat Besar yang salah tempat atau
// bongkahan windu yang salah hitung.
import {
  gregorianToJDN, jdnToGregorian, wetonOf, wetonFromJawa,
} from '../src/lib/jawa.js';

const awal = gregorianToJDN(1900, 1, 1);
const akhir = gregorianToJDN(2100, 12, 31);
const langkah = 37;

let diperiksa = 0;
let gagal = 0;
const maksContohGagal = 5;

for (let jdn = awal; jdn <= akhir; jdn += langkah) {
  diperiksa++;
  const g = jdnToGregorian(jdn);
  const w = wetonOf(g.y, g.m, g.d);
  const back = wetonFromJawa(w.jawa.tanggal, w.jawa.bulanIdx, w.jawa.tahun);
  const cocok =
    back.jdn === jdn &&
    back.gregorian.y === g.y &&
    back.gregorian.m === g.m &&
    back.gregorian.d === g.d &&
    back.nama === w.nama;
  if (!cocok) {
    gagal++;
    if (gagal <= maksContohGagal) {
      console.log(
        `  ✗ JDN ${jdn} (${g.y}-${g.m}-${g.d} ${w.nama}, ` +
        `${w.jawa.tanggal} ${w.jawa.bulan.nama} ${w.jawa.tahun}) -> ` +
        `JDN ${back.jdn} (${back.gregorian.y}-${back.gregorian.m}-${back.gregorian.d} ${back.nama})`,
      );
    }
  }
}

console.log(`round-trip: ${diperiksa} diperiksa, ${gagal} gagal`);
process.exit(gagal ? 1 : 0);
