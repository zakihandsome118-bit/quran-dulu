'use client';

import React from 'react';
import { RotateCcw, AlertCircle, Home } from 'lucide-react';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#FCF9F0] rounded-3xl border-2 border-[#D6C28F] p-6 sm:p-8 text-center shadow-xl space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EFE8D3] border-2 border-[#D6C28F] flex items-center justify-center text-[#8F6E1C]">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#2C1810] font-serif">
            Halaman Sedang Diperbarui
          </h2>
          <p className="text-xs sm:text-sm text-[#706553] mt-2 leading-relaxed">
            Terjadi pembaruan koneksi saat beralih tab. Silakan muat ulang tampilan untuk melanjutkan membaca.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#2C1810] hover:bg-[#1C0E06] text-[#F7E9C4] text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 border border-[#C59E3F] shadow-sm transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-[#F2D06B]" />
            <span>Muat Ulang Tampilan</span>
          </button>

          <button
            onClick={() => {
              window.location.href = '/';
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#F6F1E3] hover:bg-[#EFE8D3] text-[#2C1810] text-xs sm:text-sm font-bold flex items-center justify-center space-x-1.5 border border-[#D6C28F] transition-all"
          >
            <Home className="w-4 h-4 text-[#8F6E1C]" />
            <span>Ke Beranda</span>
          </button>
        </div>
      </div>
    </div>
  );
}
