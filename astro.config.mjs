import { defineConfig } from 'astro/config';

// Demo ini diterbitkan sebagai GitHub Pages project site:
// https://daslidisalun.github.io/wetonan/
// Saat naik ke domain produksi sendiri (wetonan.click), kembalikan
// site ke 'https://wetonan.click' dan hapus/kosongkan base.
export default defineConfig({
  site: 'https://daslidisalun.github.io',
  base: '/wetonan/',
  trailingSlash: 'always',
});
