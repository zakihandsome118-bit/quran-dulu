import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://quran-dulu.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const surahPages: MetadataRoute.Sitemap = Array.from({ length: 114 }, (_, i) => ({
    url: `${SITE_URL}/surat/${i + 1}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    ...surahPages,
  ];
}
