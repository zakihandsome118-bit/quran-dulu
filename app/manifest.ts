import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Qur'an Digital",
    short_name: "Qur'an",
    description: "Baca Al-Qur'an dengan terjemah, tafsir, audio, dan doa harian.",
    start_url: '/',
    display: 'standalone',
    background_color: '#F6F1E3',
    theme_color: '#2C1810',
    lang: 'id',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
