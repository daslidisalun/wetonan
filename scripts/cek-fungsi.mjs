// Cek fungsi Wetonan: kalkulator, jodoh, kalender, overflow di halaman kunci.
import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:8417';
const hasil = [];
const catat = (label, ok, detail = '') => {
  hasil.push(`${ok ? '✓' : '✗ GAGAL'} ${label}${detail ? ' — ' + detail : ''}`);
};

const browser = await chromium.launch();
for (const vp of [{ name: 'mobile430', width: 430, height: 932 }, { name: 'desktop1280', width: 1280, height: 800 }]) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  const cekOverflow = async (path) => {
    await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(150);
    const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    catat(`${vp.name} tanpa overflow-x di ${path}`, ov <= 0, `overflow=${ov}px`);
  };

  // Beranda
  await cekOverflow('/');
  const masthead = await page.textContent('#baris-tanggal');
  catat(`${vp.name} masthead menampilkan weton hari ini`, /weton/i.test(masthead || ''), (masthead || '').trim().slice(0, 80));

  // Kalkulator: 17-08-1945 -> Jumat Legi
  await page.goto(BASE + '/kalkulator-weton/', { waitUntil: 'domcontentloaded' });
  await page.fill('#tgl-kalkulator', '1945-08-17');
  await page.click('#form-kalkulator button[type=submit]');
  await page.waitForTimeout(300);
  const hasilKalk = await page.textContent('#hasil-kalkulator');
  catat(`${vp.name} kalkulator 1945-08-17 = Jumat Legi`, /Jumat Legi/.test(hasilKalk || ''));
  catat(`${vp.name} kalkulator memuat jumlah neptu = 11`, /6 \+ 5 = 11/.test(hasilKalk || ''));

  // Kalkulator via parameter URL
  await page.goto(BASE + '/kalkulator-weton/?tgl=2026-01-01', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);
  const hasilParam = await page.textContent('#hasil-kalkulator');
  catat(`${vp.name} kalkulator ?tgl=2026-01-01 = Kamis Pon`, /Kamis Pon/.test(hasilParam || ''));
  await cekOverflow('/kalkulator-weton/');

  // Jodoh: 1945-08-17 (11) + 2026-01-01 (15) = 26 -> 26 % 8 = 2 -> Ratu
  await page.goto(BASE + '/weton-jodoh/', { waitUntil: 'domcontentloaded' });
  await page.fill('#tgl-a', '1945-08-17');
  await page.fill('#tgl-b', '2026-01-01');
  await page.click('#form-jodoh button[type=submit]');
  await page.waitForTimeout(300);
  const hasilJodoh = await page.textContent('#hasil-jodoh');
  catat(`${vp.name} jodoh 11+15=26 = Ratu`, /Ratu/.test(hasilJodoh || ''), (hasilJodoh || '').replace(/\s+/g, ' ').slice(0, 90));
  await cekOverflow('/weton-jodoh/');

  // Kalender: klik bulan berikutnya mengubah kisi
  await page.goto(BASE + '/kalender-jawa/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(200);
  const capSebelum = await page.textContent('#wadah-kalender caption');
  await page.click('#bln-berikut');
  await page.waitForTimeout(250);
  const capSesudah = await page.textContent('#wadah-kalender caption');
  catat(`${vp.name} kalender: tombol bulan berikutnya mengubah kisi`, capSebelum !== capSesudah, `"${(capSebelum || '').trim()}" -> "${(capSesudah || '').trim()}"`);
  await cekOverflow('/kalender-jawa/');

  // Halaman detail weton
  await cekOverflow('/weton/jumat-legi/');
  const isiDetail = await page.textContent('main');
  catat(`${vp.name} /weton/jumat-legi/ memuat watak & navigasi`, /Watak Dina Jumat/.test(isiDetail || '') && /Sabtu Pahing|Kamis Wage/.test(isiDetail || ''));
  await page.close();
}
await browser.close();
console.log(hasil.join('\n'));
const gagal = hasil.filter((h) => h.startsWith('✗')).length;
console.log(gagal === 0 ? '\nSEMUA CEK FUNGSI LULUS' : `\n${gagal} CEK GAGAL`);
process.exit(gagal === 0 ? 0 : 1);
