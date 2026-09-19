import Link from 'next/link';
import { BookOpen, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-[#EBF2EA] dark:bg-[#1A2619] text-[#2D5A27] dark:text-[#73C568] flex items-center justify-center mb-4">
        <BookOpen className="w-7 h-7" />
      </div>
      <h2 className="text-2xl font-bold text-[#1A1A1A] dark:text-white mb-2">
        Halaman Tidak Ditemukan
      </h2>
      <p className="text-sm text-[#66635B] dark:text-[#9E9C94] max-w-sm mb-6">
        Halaman atau surat yang Anda cari tidak ditemukan atau telah berpindah.
      </p>
      <Link
        href="/"
        className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#2D5A27] hover:bg-[#23471F] text-white text-sm font-semibold transition-all shadow-xs"
      >
        <Home className="w-4 h-4" />
        <span>Kembali ke Beranda</span>
      </Link>
    </div>
  );
}
