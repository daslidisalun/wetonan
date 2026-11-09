// blog.js — metadata enam artikel Blog Almanak (satu-satunya sumber data).
// Halaman indeks blog dan sitemap membaca daftar ini; setiap artikel
// mengimpor entrinya sendiri dari sini agar judul & tanggal tidak ganda.
export const ARTIKEL = [
  {
    slug: 'sejarah-kalender-jawa-sultan-agung',
    judul: 'Sejarah Kalender Jawa: Reformasi Sultan Agung Tahun 1633',
    tanggal: '2026-11-02',
    tanggalTampil: '2 November 2026',
    ringkasan:
      'Pada 1633 Sultan Agung menyatukan penanggalan Jawa: tahun Saka dipertahankan, tetapi sistemnya diselaraskan dengan Hijriah. Inilah kisah keputusan itu — apa yang berubah, apa yang tetap Jawa, dan mengapa akibatnya masih kita pakai sampai hari ini.',
  },
  {
    slug: 'cara-menghitung-neptu',
    judul: 'Neptu: Cara Menghitung dan Maknanya dalam Tradisi Jawa',
    tanggal: '2026-11-03',
    tanggalTampil: '3 November 2026',
    ringkasan:
      'Neptu adalah angka kecil di jantung semua petungan Jawa. Tulisan ini menguraikan tabelnya, tiga langkah menghitungnya, cara menemukan pasaran dari tanggal acuan, dan kesalahan yang paling sering terjadi — lengkap dengan contoh terhitung.',
  },
  {
    slug: 'weton-jodoh-delapan-kategori',
    judul: 'Weton Jodoh: Memahami Delapan Kategori Hasil Perhitungan',
    tanggal: '2026-11-04',
    tanggalTampil: '4 November 2026',
    ringkasan:
      'Pegat, Ratu, Jodoh, Topo, Tinari, Padu, Sujanan, Pesthi — delapan golongan hasil petungan jodoh. Dari mana angka pembaginya, jumlah neptu mana yang jatuh ke golongan mana, dan bagaimana keluarga zaman dulu menyikapi hasilnya.',
  },
  {
    slug: 'malam-satu-suro',
    judul: 'Malam 1 Suro: Tradisi, Laku, dan Maknanya',
    tanggal: '2026-11-06',
    tanggalTampil: '6 November 2026',
    ringkasan:
      'Tahun baru Jawa tidak dibuka dengan kembang api, melainkan dengan keheningan: tirakat, lek-lekan, tapa bisu, dan kirab pusaka. Mengapa malamnya mendahului tanggalnya, dan laku apa saja yang menghidupkan malam 1 Suro di berbagai daerah.',
  },
  {
    slug: 'pawukon-siklus-210-hari',
    judul: 'Pawukon: Siklus 210 Hari dan Tiga Puluh Wuku',
    tanggal: '2026-11-07',
    tanggalTampil: '7 November 2026',
    ringkasan:
      'Berjalan tanpa bulan dan tanpa tahun, pawukon adalah putaran 30 pekan bernama yang genap 210 hari. Bagaimana ia bertautan dengan roda weton 35 hari, bagaimana Bali menjalaninya sampai kini lewat Galungan dan otonan, dan bagaimana cara kami menentukannya.',
  },
  {
    slug: 'windu-siklus-delapan-tahun',
    judul: 'Windu: Siklus Delapan Tahun dalam Kalender Jawa',
    tanggal: '2026-11-08',
    tanggalTampil: '8 November 2026',
    ringkasan:
      'Alip, Ehe, Jimawal, Je, Dal, Be, Wawu, Jimakir — delapan tahun membentuk satu windu sepanjang 2.835 hari. Mengapa tiga di antaranya berumur 355 hari, mengapa 1 Suro bergeser sekitar sebelas hari setiap tahun, dan apa peran windu dalam cara orang Jawa menandai umur.',
  },
];

export const artikelBySlug = (slug) => ARTIKEL.find((a) => a.slug === slug);
