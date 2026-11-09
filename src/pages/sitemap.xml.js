import { SEMUA_WETON } from '../lib/jawa.js';
import { ARTIKEL } from '../lib/blog.js';

// Alamat dasar dari astro.config.mjs (site + base) — demo ini terbit di
// https://daslidisalun.github.io/wetonan/ sehingga semua URL membawa subpath.
const site = (import.meta.env.SITE ?? '').replace(/\/$/, '');
const awalan = site + import.meta.env.BASE_URL.replace(/\/$/, '');
const statis = [
  '/',
  '/kalkulator-weton/',
  '/konverter-jawa/',
  '/weton-jodoh/',
  '/siklus-weton/',
  '/hari-baik/',
  '/weton-keluarga/',
  '/kalender-jawa/',
  '/kalender-tahunan/',
  '/perkakas/',
  '/weton/',
  '/wuku/',
  '/blog/',
  '/tentang/',
  '/kontak/',
  '/privasi/',
  '/disclaimer/',
];
const semua = [
  ...statis,
  ...ARTIKEL.map((a) => `/blog/${a.slug}/`),
  ...SEMUA_WETON.map((w) => `/weton/${w.slug}/`),
];

export function GET() {
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemaps/0.9">\n` +
    semua.map((p) => `  <url><loc>${awalan}${p}</loc></url>`).join('\n') +
    `\n</urlset>\n`;
  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
