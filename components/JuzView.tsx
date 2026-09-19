'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Layers, ArrowRight, Search, BookOpen } from 'lucide-react';
import { JUZ_METADATA } from '@/lib/quran-data';
import { useQuran } from '@/context/QuranContext';
import { motion } from 'motion/react';

interface JuzViewProps {
  onSelectVerse?: (surahNumber: number, verseNumber: number) => void;
  // legacy prop alias if used elsewhere
  onSelectSurahVerse?: (surahNumber: number, verseNumber: number) => void;
  suratList?: any[];
}

export const JuzView: React.FC<JuzViewProps> = ({ onSelectVerse, onSelectSurahVerse }) => {
  const { navigateToSurah } = useQuran();
  const handleSelectVerse = onSelectVerse || onSelectSurahVerse || navigateToSurah;
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJuz = JUZ_METADATA.filter((j) => {
    return (
      j.juz.toString() === searchTerm ||
      j.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.startSurahName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.endSurahName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.startArabic.includes(searchTerm)
    );
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-24"
    >
      {/* Header Banner with Public Quran Artwork */}
      <div className="relative overflow-hidden rounded-3xl bg-[#26140A] text-[#FCF9F0] p-6 sm:p-8 shadow-xl border-2 border-[#D6C28F]">
        <div className="absolute inset-0 pointer-events-none select-none opacity-80">
          <Image
            src="/quran-cover-art.svg"
            alt="Mushaf Background"
            fill
            className="object-cover object-right"
          />
        </div>

        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#150B05]/70 border border-[#C59E3F]/70 text-[#F7E9C4] text-xs font-bold shadow-xs">
            <Layers className="w-3.5 h-3.5 text-[#F2D06B]" />
            <span>Pembagian 30 Juz Al-Qur&apos;an</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-[#FFFDF7]">
            Daftar 30 Juz Mushaf
          </h1>
          <p className="text-xs sm:text-sm text-[#F7E9C4]/90 leading-relaxed">
            Navigasi cepat per Juz, mempermudah target tilawah harian (one day one juz) maupun khataman.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#FCF9F0] p-3.5 rounded-2xl border-2 border-[#D6C28F] shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F6E1C]" />
          <input
            id="search-juz-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nomor Juz (1-30) atau nama surat awal..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-[#F6F1E3] border border-[#D6C28F] focus:outline-none focus:ring-1 focus:ring-[#8F6E1C] text-[#2C261F] placeholder-[#706553]/70 font-medium"
          />
        </div>
      </div>

      {/* 30 Juz Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJuz.map((item) => (
          <motion.div
            key={item.juz}
            whileHover={{ y: -3 }}
            id={`juz-card-${item.juz}`}
            className="bg-[#FCF9F0] rounded-2xl p-5 border-2 border-[#E5DBC5] hover:border-[#D6C28F] shadow-xs flex flex-col justify-between space-y-4 relative overflow-hidden group"
          >
            {/* Corner ornament watermark */}
            <div className="absolute right-0 bottom-0 w-20 h-20 opacity-10 pointer-events-none">
              <Image
                src="/quran-surah-pattern.svg"
                alt="Quran Pattern"
                fill
                className="object-contain"
              />
            </div>

            {/* Top row */}
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#2C1810] text-[#F7E9C4] border-2 border-[#C59E3F] flex items-center justify-center font-bold text-sm shadow-2xs">
                  {item.juz}
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#2C1810] group-hover:text-[#8F6E1C] transition-colors">
                    {item.name}
                  </h3>
                  <span className="text-[11px] text-[#706553]">
                    Juz ke-{item.juz}
                  </span>
                </div>
              </div>

              {/* Arabic start name */}
              <div className="text-right">
                <span className="font-arabic text-xl font-bold text-[#8F6E1C]">
                  {item.startArabic}
                </span>
              </div>
            </div>

            {/* Range info */}
            <div className="bg-[#F6F1E3] p-3 rounded-xl border border-[#E5DBC5] text-xs space-y-1 relative z-10">
              <div className="flex items-center justify-between text-[#2C1810]">
                <span className="text-[#706553]">Mulai:</span>
                <span className="font-bold">QS. {item.startSurahName} : {item.startVerse}</span>
              </div>
              <div className="flex items-center justify-between text-[#2C1810]">
                <span className="text-[#706553]">Sampai:</span>
                <span className="font-bold">QS. {item.endSurahName} : {item.endVerse}</span>
              </div>
            </div>

            {/* Action */}
            <div className="pt-2 border-t border-[#E5DBC5] flex items-center justify-between relative z-10">
              <span className="text-[11px] text-[#706553]">
                Mulai bacaan Juz {item.juz}
              </span>
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => handleSelectVerse(item.startSurah, item.startVerse)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#2C1810] hover:bg-[#1C0E06] text-[#F7E9C4] text-xs font-bold transition-colors border border-[#C59E3F]"
              >
                <span>Buka Juz</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#F2D06B]" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
