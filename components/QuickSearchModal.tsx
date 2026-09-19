'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, ArrowRight } from 'lucide-react';
import { SurahListItem } from '@/types/quran';
import { motion, AnimatePresence } from 'motion/react';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  suratList: SurahListItem[];
  onSelectSurah: (id: number) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  suratList,
  onSelectSurah,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setSearchTerm('');
    onClose();
  };

  const filteredSurahs = suratList.filter((s) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      s.nomor.toString() === term ||
      s.namaLatin.toLowerCase().includes(term) ||
      s.arti.toLowerCase().includes(term) ||
      s.nama.includes(term)
    );
  }).slice(0, 12);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#1A0E06]/65 backdrop-blur-xs"
            onClick={handleClose}
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative z-10 w-full max-w-xl bg-[#FCF9F0] rounded-3xl shadow-2xl border-2 border-[#D6C28F] overflow-hidden text-[#2C1810]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="p-4 border-b-2 border-[#E5DBC5] flex items-center space-x-3 bg-[#F6F1E3]">
              <Search className="w-5 h-5 text-[#8F6E1C]" />
              <input
                ref={inputRef}
                id="modal-quick-search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ketik nama surat, arti, atau nomor (e.g. Al-Baqarah, 36, Pembukaan)..."
                className="flex-1 bg-transparent border-none text-sm sm:text-base focus:outline-none text-[#2C1810] placeholder-[#706553]/70 font-medium"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="p-1 text-[#706553] hover:text-[#2C1810]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto p-3 space-y-1.5">
              {filteredSurahs.length === 0 ? (
                <div className="text-center py-10">
                  <BookOpen className="w-8 h-8 mx-auto text-[#8F6E1C] mb-2" />
                  <p className="text-sm font-bold text-[#2C1810]">
                    Tidak ada surat yang cocok
                  </p>
                  <p className="text-xs text-[#706553] mt-0.5">
                    Coba ketik kata kunci lain
                  </p>
                </div>
              ) : (
                filteredSurahs.map((surah) => (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    key={surah.nomor}
                    id={`modal-search-result-${surah.nomor}`}
                    onClick={() => {
                      onSelectSurah(surah.nomor);
                      handleClose();
                    }}
                    className="w-full p-3 rounded-2xl bg-[#FCF9F0] hover:bg-[#F6F1E3] border border-[#E5DBC5] hover:border-[#D6C28F] flex items-center justify-between transition-colors text-left group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-[#2C1810] text-[#F7E9C4] border border-[#C59E3F] flex items-center justify-center font-bold text-xs">
                        {surah.nomor}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#2C1810] group-hover:text-[#8F6E1C] transition-colors">
                          {surah.namaLatin}
                        </div>
                        <div className="text-xs text-[#706553]">
                          {surah.arti} • {surah.jumlahAyat} Ayat
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="font-arabic text-xl font-bold text-[#8F6E1C]">
                        {surah.nama}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#706553] group-hover:text-[#2C1810] transition-colors" />
                    </div>
                  </motion.button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-[#F6F1E3] border-t border-[#E5DBC5] text-[11px] text-[#706553] flex items-center justify-between">
              <span>Tekan Esc untuk menutup</span>
              <span>114 Surat Tersedia</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
