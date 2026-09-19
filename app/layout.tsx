import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/AppShell';

export const metadata: Metadata = {
  // TODO: ganti dengan domain final setelah deploy ke Vercel (dipakai untuk resolve URL gambar OG)
  metadataBase: new URL('https://quran-dulu-psi.vercel.app'),
  title: "Qur'an Digital",
  description: 'Developed by Yahya',
  icons: {
    icon: 'https://www.gobox.my.id/file/aU2ONnkJSzSK.webp',
    shortcut: 'https://www.gobox.my.id/file/aU2ONnkJSzSK.webp',
    apple: 'https://www.gobox.my.id/file/aU2ONnkJSzSK.webp',
  },
  openGraph: {
    title: "Qur'an Digital",
    description: 'Developed by Yahya',
    type: 'website',
    images: [
      {
        url: '/logo.webp',
        width: 1254,
        height: 1254,
        alt: "Qur'an Digital",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Qur'an Digital",
    description: 'Developed by Yahya',
    images: ['/logo.webp'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="min-h-screen bg-[#F6F1E3] text-[#2C261F] antialiased font-sans" suppressHydrationWarning>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
