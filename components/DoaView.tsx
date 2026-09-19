'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { 
  HeartHandshake, 
  Copy, 
  Check, 
  Search, 
  BookOpen, 
  ArrowRight, 
  Sparkles,
  Bookmark,
  Share2,
  SlidersHorizontal,
  Volume2,
  X
} from 'lucide-react';
import { DAILY_DOA_LIST, DOA_CATEGORIES, DailyDoaItem } from '@/lib/doa-data';
import { useQuran } from '@/context/QuranContext';
import { motion, AnimatePresence } from 'motion/react';

interface DoaViewProps {
  onSelectVerse?: (surahNumber: number, verseNumber: number) => void;
}

export const DoaView: React.FC<DoaViewProps> = ({ onSelectVerse }) => {
  const { navigateToSurah, settings } = useQuran();
  const handleSelectVerse = onSelectVerse || navigateToSurah;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedDoaIds, setSavedDoaIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('quran_saved_doas');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [showLatin, setShowLatin] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [onlySaved, setOnlySaved] = useState(false);

  const toggleSaveDoa = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedDoaIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      if (typeof window !== 'undefined') {
        localStorage.setItem('quran_saved_doas', JSON.stringify(next));
      }
      return next;
    });
  };

  const filteredDoas = useMemo(() => {
    return DAILY_DOA_LIST.filter((doa) => {
      if (onlySaved && !savedDoaIds.includes(doa.id)) return false;

      if (selectedCategory !== 'all' && doa.category !== selectedCategory) {
        return false;
      }

      if (!searchTerm.trim()) return true;

      const term = searchTerm.toLowerCase();
      const matchTitle = doa.title.toLowerCase().includes(term);
      const matchLatin = doa.latin.toLowerCase().includes(term);
      const matchTranslation = doa.translation.toLowerCase().includes(term);
      const matchArabic = doa.arabic.includes(searchTerm);
      const matchSource = doa.source?.toLowerCase().includes(term) || false;
      const matchNumber = doa.number.toString() === term;

      return matchTitle || matchLatin || matchTranslation || matchArabic || matchSource || matchNumber;
    });
  }, [selectedCategory, searchTerm, onlySaved, savedDoaIds]);

  const handleCopy = (doa: DailyDoaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    let text = `${doa.number}. ${doa.title}\n\n${doa.arabic}\n\nLatin:\n${doa.latin}\n\nArtinya:\n"${doa.translation}"`;
    if (doa.source) {
      text += `\n\nSumber: ${doa.source}`;
    }
    navigator.clipboard.writeText(text);
    setCopiedId(doa.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = (doa: DailyDoaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator
        .share({
          title: doa.title,
          text: `${doa.title}\n\n${doa.arabic}\n\n"${doa.translation}"\n(${doa.source || 'Doa Harian'})`,
        })
        .catch(() => handleCopy(doa, e));
    } else {
      handleCopy(doa, e);
    }
  };

  // Font size multiplier based on global settings
  const arabicFontScale = settings?.arabicFontSize || 28;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-24"
    >
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#26140A] text-[#FCF9F0] p-6 sm:p-8 shadow-xl border-2 border-[#D6C28F]">
        <div className="absolute inset-0 pointer-events-none select-none opacity-80">
          <Image
            src="/quran-cover-art.svg"
            alt="Mushaf Background"
            fill
            className="object-cover object-right"
          />
        </div>

        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#150B05]/80 border border-[#C59E3F]/70 text-[#F7E9C4] text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#F2D06B]" />
            <span>40 Kumpulan Doa Sehari-Hari Lengkap</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif tracking-tight text-[#FFFDF7]">
            Doa Harian Muslim Terlengkap
          </h1>

          <p className="text-xs sm:text-sm text-[#F7E9C4]/90 leading-relaxed">
            Daftar 40 doa sehari-hari lengkap dengan teks Arab harakat jelas, transliterasi Latin, arti bahasa Indonesia, dan rujukan sumber dari Al-Qur&apos;an &amp; Hadis shahih.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-medium text-[#F7E9C4]/80">
            <span className="px-2.5 py-1 rounded-lg bg-[#3A2213]/80 border border-[#C59E3F]/40">
              📖 40 Doa Pilihan
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#3A2213]/80 border border-[#C59E3F]/40">
              ✨ Arab &amp; Latin
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#3A2213]/80 border border-[#C59E3F]/40">
              🔖 Simpan Favorit
            </span>
          </div>
        </div>
      </div>

      {/* Control & Search Toolbar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FCF9F0] p-3.5 rounded-2xl border-2 border-[#D6C28F] shadow-xs">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F6E1C]" />
            <input
              id="search-doa-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari doa (contoh: makan, tidur, bangun, orang tua, rezeki, hujan)..."
              className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm rounded-xl bg-[#F6F1E3] border border-[#D6C28F] focus:outline-none focus:ring-1 focus:ring-[#8F6E1C] text-[#2C261F] placeholder-[#706553]/70 font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#706553] hover:text-[#2C1810]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Display Toggles */}
          <div className="flex items-center space-x-1.5 self-end sm:self-auto text-xs">
            <button
              onClick={() => setShowLatin(!showLatin)}
              className={`px-3 py-1.5 rounded-xl font-bold border transition-colors ${
                showLatin
                  ? 'bg-[#2C1810] text-[#F7E9C4] border-[#C59E3F]'
                  : 'bg-[#F6F1E3] text-[#706553] border-[#E5DBC5]'
              }`}
              title="Tampilkan/Sembunyikan teks Latin"
            >
              Latin {showLatin ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`px-3 py-1.5 rounded-xl font-bold border transition-colors ${
                showTranslation
                  ? 'bg-[#2C1810] text-[#F7E9C4] border-[#C59E3F]'
                  : 'bg-[#F6F1E3] text-[#706553] border-[#E5DBC5]'
              }`}
              title="Tampilkan/Sembunyikan terjemahan arti"
            >
              Arti {showTranslation ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => setOnlySaved(!onlySaved)}
              className={`px-3 py-1.5 rounded-xl font-bold border flex items-center space-x-1 transition-colors ${
                onlySaved
                  ? 'bg-[#8F6E1C] text-[#FCF9F0] border-[#8F6E1C]'
                  : 'bg-[#F6F1E3] text-[#706553] border-[#E5DBC5]'
              }`}
              title="Filter Doa Tersimpan"
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>Favorit ({savedDoaIds.length})</span>
            </button>
          </div>
        </div>

        {/* Category Scroll Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          {DOA_CATEGORIES.map((c) => {
            const isSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCategory(c.id);
                  if (onlySaved) setOnlySaved(false);
                }}
                className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-[#2C1810] text-[#F7E9C4] border-[#C59E3F] shadow-2xs scale-102'
                    : 'bg-[#FCF9F0] text-[#706553] border-[#E5DBC5] hover:border-[#D6C28F]'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-medium text-[#706553] px-1">
        <span>Menampilkan {filteredDoas.length} dari {DAILY_DOA_LIST.length} Doa</span>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-[#8F6E1C] font-bold hover:underline"
          >
            Hapus Pencarian
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredDoas.length === 0 && (
        <div className="text-center py-16 bg-[#FCF9F0] rounded-3xl border-2 border-dashed border-[#D6C28F] p-8">
          <BookOpen className="w-12 h-12 mx-auto text-[#8F6E1C] mb-3 opacity-60" />
          <h3 className="text-base font-bold text-[#2C1810]">
            Tidak ada doa yang sesuai kriteria
          </h3>
          <p className="text-xs text-[#706553] mt-1 max-w-sm mx-auto">
            {onlySaved 
              ? 'Anda belum menandai doa favorit. Klik ikon bookmark pada doa untuk menyimpannya.'
              : 'Coba gunakan kata kunci pencarian yang lain atau pilih kategori Semua Doa.'}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setOnlySaved(false);
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#2C1810] text-[#F7E9C4] border border-[#C59E3F] font-bold text-xs hover:bg-[#3E2317]"
          >
            Reset Filter &amp; Pencarian
          </button>
        </div>
      )}

      {/* Doa Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDoas.map((doa) => {
          const isSaved = savedDoaIds.includes(doa.id);
          const isCopied = copiedId === doa.id;

          return (
            <div
              key={doa.id}
              id={`doa-card-${doa.id}`}
              className="bg-[#FCF9F0] rounded-2xl p-5 sm:p-6 border-2 border-[#E5DBC5] hover:border-[#D6C28F] shadow-xs flex flex-col justify-between space-y-4 transition-all hover:shadow-md"
            >
              {/* Header Info */}
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#E5DBC5]">
                <div className="flex items-start space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#2C1810] text-[#F7E9C4] border border-[#C59E3F] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {doa.number}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#2C1810] leading-snug">
                      {doa.title}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-[#F0E8D6] text-[#706553] font-bold text-[10px] border border-[#E5DBC5]">
                        {doa.category}
                      </span>
                      {doa.source && (
                        <span className="text-[11px] text-[#8F6E1C] font-semibold truncate max-w-[200px]">
                          {doa.source}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={(e) => toggleSaveDoa(doa.id, e)}
                    className={`p-2 rounded-xl transition-colors ${
                      isSaved
                        ? 'text-[#8F6E1C] bg-[#F4EAC8] border border-[#D6C28F]'
                        : 'text-[#706553] hover:text-[#2C1810] hover:bg-[#F6F1E3]'
                    }`}
                    title={isSaved ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={(e) => handleCopy(doa, e)}
                    className="p-2 rounded-xl text-[#706553] hover:text-[#2C1810] hover:bg-[#F6F1E3] transition-colors"
                    title="Salin Doa Lengkap"
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4 text-[#8F6E1C]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={(e) => handleShare(doa, e)}
                    className="p-2 rounded-xl text-[#706553] hover:text-[#2C1810] hover:bg-[#F6F1E3] transition-colors"
                    title="Bagikan Doa"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Arabic Text */}
              <div className="text-right py-2 px-1">
                <p 
                  className="font-arabic font-bold text-[#1A0E06] leading-[2.2] tracking-wide select-text" 
                  dir="rtl"
                  style={{ fontSize: `${arabicFontScale}px` }}
                >
                  {doa.arabic}
                </p>
              </div>

              {/* Latin Transliteration */}
              {showLatin && (
                <div className="text-xs sm:text-[13px] text-[#8F6E1C] font-semibold bg-[#F9F5EC] p-3 rounded-xl border border-[#E5DBC5] leading-relaxed">
                  <span className="text-[10px] uppercase font-bold text-[#706553] block mb-0.5 tracking-wider">
                    Latin:
                  </span>
                  {doa.latin}
                </div>
              )}

              {/* Translation Meaning */}
              {showTranslation && (
                <div className="text-xs sm:text-[13px] text-[#2C1810] leading-relaxed italic bg-[#F6F1E3] p-3.5 rounded-xl border border-[#E5DBC5]">
                  <span className="text-[10px] uppercase font-bold text-[#706553] not-italic block mb-0.5 tracking-wider">
                    Artinya:
                  </span>
                  &quot;{doa.translation}&quot;
                </div>
              )}

              {/* Footer Quran Link / Source */}
              <div className="pt-2 border-t border-[#E5DBC5] flex items-center justify-between text-xs">
                {doa.surahNumber && doa.surahName ? (
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-[#8F6E1C]">
                      QS. {doa.surahName} : {doa.verseNumber || 'Ayat'}
                    </span>
                    <button
                      onClick={() => handleSelectVerse(doa.surahNumber!, doa.verseNumber || 1)}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#2C1810] hover:text-[#8F6E1C] transition-colors bg-[#EFE8D3] px-2.5 py-1 rounded-lg border border-[#D6C28F]"
                    >
                      <span>Buka Surat</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full text-[#706553]">
                    <span>{doa.source || 'Doa Sehari-Hari'}</span>
                    <button
                      onClick={(e) => handleCopy(doa, e)}
                      className="text-[#8F6E1C] font-bold hover:underline"
                    >
                      {isCopied ? 'Tersalin ✓' : 'Salin Teks'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
