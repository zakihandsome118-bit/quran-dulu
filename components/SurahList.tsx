'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { 
  Search, 
  Sparkles, 
  Play, 
  Pause, 
  BookOpen, 
  ArrowRight, 
  Bookmark, 
  BookmarkCheck,
  Volume2
} from 'lucide-react';
import { SurahListItem, LastReadItem } from '@/types/quran';
import { motion } from 'motion/react';

interface SurahListProps {
  suratList: SurahListItem[];
  onSelectSurah: (id: number) => void;
  lastRead: LastReadItem | null;
  onResumeLastRead: (surahNumber: number, verseNumber: number) => void;
  playingSurahNumber: number | null;
  isPlaying: boolean;
  onPlayFullSurah: (surah: SurahListItem) => void;
  onPauseAudio: () => void;
  bookmarkedSurahIds: Set<number>;
}

export const SurahList: React.FC<SurahListProps> = ({
  suratList,
  onSelectSurah,
  lastRead,
  onResumeLastRead,
  playingSurahNumber,
  isPlaying,
  onPlayFullSurah,
  onPauseAudio,
  bookmarkedSurahIds,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'makkiyyah' | 'madaniyyah' | 'juz30'>('all');
  const [sortBy, setSortBy] = useState<'number-asc' | 'number-desc' | 'name-asc' | 'ayat-desc'>('number-asc');

  const filteredSurahs = useMemo(() => {
    return suratList.filter((s) => {
      const matchSearch =
        s.nomor.toString().includes(searchTerm) ||
        s.namaLatin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.arti.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nama.includes(searchTerm);

      if (!matchSearch) return false;

      if (filterType === 'makkiyyah') return s.tempatTurun.toLowerCase() === 'mekah';
      if (filterType === 'madaniyyah') return s.tempatTurun.toLowerCase() === 'madinah';
      if (filterType === 'juz30') return s.nomor >= 78 && s.nomor <= 114;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'number-asc') return a.nomor - b.nomor;
      if (sortBy === 'number-desc') return b.nomor - a.nomor;
      if (sortBy === 'name-asc') return a.namaLatin.localeCompare(b.namaLatin);
      if (sortBy === 'ayat-desc') return b.jumlahAyat - a.jumlahAyat;
      return 0;
    });
  }, [suratList, searchTerm, filterType, sortBy]);

  // Quick favorite / frequent surahs
  const quickSurahs = [
    { no: 1, name: 'Al-Fatihah' },
    { no: 18, name: 'Al-Kahf' },
    { no: 36, name: 'Yasin' },
    { no: 55, name: 'Ar-Rahman' },
    { no: 56, name: 'Al-Waqi\'ah' },
    { no: 67, name: 'Al-Mulk' },
    { no: 112, name: 'Al-Ikhlas' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6 pb-24"
    >
      {/* Hero Banner & Last Read Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Banner - Royal Leather & Gold Mushaf Cover with Public Quran Artwork */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-[#26140A] text-[#FCF9F0] p-6 sm:p-8 shadow-xl border-2 border-[#D6C28F]"
        >
          {/* Background Quran Artwork from public folder */}
          <div className="absolute inset-0 pointer-events-none select-none opacity-90">
            <Image
              src="/quran-cover-art.svg"
              alt="Mushaf Al-Qur'an Cover"
              fill
              className="object-cover object-right"
              priority
            />
          </div>

          <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#150B05]/60 backdrop-blur-xs border border-[#C59E3F]/70 text-[#F7E9C4] text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#F2D06B]" />
                <span>Mushaf Al-Qur&apos;an Al-Karim Indonesia</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FFFDF7] mb-2 font-serif drop-shadow-sm">
                Bacalah Al-Qur&apos;an dengan Tartil & Tenang
              </h1>
              <p className="text-[#F7E9C4]/95 text-sm max-w-xl leading-relaxed drop-shadow-xs">
                Akses 114 Surat lengkap, terjemahan resmi Kemenag RI, tafsir tahlili/wajiz, dan murottal audio jernih.
              </p>
            </div>

            {/* Quick jump pills */}
            <div className="pt-3 border-t border-[#C59E3F]/40">
              <span className="text-xs text-[#F7E9C4]/90 font-medium block mb-2">
                Surat Pilihan Cepat:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickSurahs.map((qs) => (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={qs.no}
                    id={`quick-surah-btn-${qs.no}`}
                    onClick={() => onSelectSurah(qs.no)}
                    className="px-3 py-1 rounded-xl bg-[#1C0E06]/80 hover:bg-[#C59E3F] text-[#FFFDF7] hover:text-[#2C1810] text-xs font-semibold transition-all border border-[#C59E3F]/60 shadow-2xs"
                  >
                    {qs.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Last Read Card - Styled with Public Quran Mushaf Artwork */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="rounded-3xl bg-[#FCF9F0] border-2 border-[#D6C28F] p-6 flex flex-col justify-between shadow-md relative overflow-hidden"
        >
          {/* Subtle open mushaf watermark in background */}
          <div className="absolute -right-6 -bottom-6 w-44 h-28 opacity-15 pointer-events-none select-none">
            <Image
              src="/quran-mushaf-card.svg"
              alt="Quran Bookmark Icon"
              fill
              className="object-contain"
            />
          </div>

          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="flex items-center space-x-2 text-[#8F6E1C] font-bold text-sm">
              <Bookmark className="w-4 h-4 fill-current text-[#C59E3F]" />
              <span>Pembatas Bacaan</span>
            </div>
            {lastRead && (
              <span className="text-[10px] text-[#2C1810] bg-[#EFE8D3] border border-[#D6C28F] px-2.5 py-0.5 rounded-full font-bold">
                Tersimpan
              </span>
            )}
          </div>

          {lastRead ? (
            <div className="space-y-3 my-auto py-2 relative z-10">
              <div>
                <p className="text-xs text-[#706553] font-medium">Terakhir Anda Baca:</p>
                <h3 className="text-xl font-bold text-[#2C1810]">
                  {lastRead.surahName}
                </h3>
                <p className="text-sm font-bold text-[#8F6E1C]">
                  Ayat ke-{lastRead.verseNumber}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                id="resume-last-read-btn"
                onClick={() => onResumeLastRead(lastRead.surahNumber, lastRead.verseNumber)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-[#2C1810] hover:bg-[#1C0E06] text-[#F7E9C4] font-bold text-sm transition-all shadow-sm border border-[#C59E3F]"
              >
                <span>Lanjutkan Membaca</span>
                <ArrowRight className="w-4 h-4 text-[#F2D06B]" />
              </motion.button>
            </div>
          ) : (
            <div className="my-auto text-center py-4 space-y-2 relative z-10">
              <BookOpen className="w-8 h-8 mx-auto text-[#C59E3F]" />
              <p className="text-xs text-[#706553]">
                Belum ada riwayat bacaan. Pilih surat untuk mulai membaca dan menandai otomatis.
              </p>
              <button
                onClick={() => onSelectSurah(1)}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#2C1810] hover:underline pt-1"
              >
                <span>Mulai dari Al-Fatihah</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#8F6E1C]" />
              </button>
            </div>
          )}

          <div className="text-[11px] text-[#706553] pt-3 border-t border-[#E5DBC5] flex items-center justify-between relative z-10">
            <span>114 Surat</span>
            <span>•</span>
            <span>6.236 Ayat</span>
            <span>•</span>
            <span>30 Juz</span>
          </div>
        </motion.div>
      </div>

      {/* Filter and Search Bar - Mushaf Parchment Theme */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FCF9F0] p-3.5 rounded-2xl border-2 border-[#D6C28F] shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F6E1C]" />
          <input
            id="surah-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari surat berdasarkan nama (e.g. Yasin, Al-Mulk), arti, atau nomor (1-114)..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-[#F6F1E3] border border-[#D6C28F] focus:outline-none focus:ring-1 focus:ring-[#8F6E1C] text-[#2C261F] placeholder-[#706553]/70 font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#706553] hover:text-[#2C1810]"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Filter Badges */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <button
            id="filter-all-btn"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
              filterType === 'all'
                ? 'bg-[#2C1810] text-[#F7E9C4] border-[#C59E3F] shadow-2xs'
                : 'bg-[#F6F1E3] text-[#706553] border-[#E5DBC5] hover:border-[#D6C28F]'
            }`}
          >
            Semua ({suratList.length})
          </button>
          <button
            id="filter-makkiyyah-btn"
            onClick={() => setFilterType('makkiyyah')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
              filterType === 'makkiyyah'
                ? 'bg-[#2C1810] text-[#F7E9C4] border-[#C59E3F] shadow-2xs'
                : 'bg-[#F6F1E3] text-[#706553] border-[#E5DBC5] hover:border-[#D6C28F]'
            }`}
          >
            Makkiyyah
          </button>
          <button
            id="filter-madaniyyah-btn"
            onClick={() => setFilterType('madaniyyah')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
              filterType === 'madaniyyah'
                ? 'bg-[#2C1810] text-[#F7E9C4] border-[#C59E3F] shadow-2xs'
                : 'bg-[#F6F1E3] text-[#706553] border-[#E5DBC5] hover:border-[#D6C28F]'
            }`}
          >
            Madaniyyah
          </button>
          <button
            id="filter-juz30-btn"
            onClick={() => setFilterType('juz30')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
              filterType === 'juz30'
                ? 'bg-[#2C1810] text-[#F7E9C4] border-[#C59E3F] shadow-2xs'
                : 'bg-[#F6F1E3] text-[#706553] border-[#E5DBC5] hover:border-[#D6C28F]'
            }`}
          >
            Juz &apos;Amma (Juz 30)
          </button>

          {/* Sort Menu */}
          <div className="relative pl-1">
            <select
              id="sort-surah-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#F6F1E3] text-[#2C261F] text-xs py-1.5 px-2.5 rounded-xl border border-[#D6C28F] focus:outline-none focus:ring-1 focus:ring-[#8F6E1C] cursor-pointer font-medium"
            >
              <option value="number-asc">Nomor (1-114)</option>
              <option value="number-desc">Nomor (114-1)</option>
              <option value="name-asc">Nama (A-Z)</option>
              <option value="ayat-desc">Jumlah Ayat Terbanyak</option>
            </select>
          </div>
        </div>
      </div>

      {/* Surah Grid with Authentic Quran Mushaf Card Styling */}
      {filteredSurahs.length === 0 ? (
        <div className="text-center py-16 bg-[#FCF9F0] rounded-3xl border-2 border-[#D6C28F]">
          <BookOpen className="w-12 h-12 mx-auto text-[#8F6E1C] mb-3" />
          <h3 className="text-base font-bold text-[#2C1810]">
            Surat tidak ditemukan
          </h3>
          <p className="text-xs text-[#706553] mt-1 max-w-sm mx-auto">
            Tidak ada surat yang cocok dengan kata kunci &quot;{searchTerm}&quot;. Silakan coba nama surat, arti, atau nomor lain.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setFilterType('all'); }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#2C1810] text-[#F7E9C4] text-xs font-bold hover:bg-[#1C0E06] transition-colors border border-[#C59E3F]"
          >
            Reset Pencarian
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSurahs.map((surah) => {
            const isAudioActive = playingSurahNumber === surah.nomor && isPlaying;
            const hasBookmarks = bookmarkedSurahIds.has(surah.nomor);

            return (
              <div
                key={surah.nomor}
                id={`surah-card-${surah.nomor}`}
                className={`group relative bg-[#FCF9F0] rounded-2xl p-4 sm:p-5 border-2 transition-transform duration-150 ease-out hover:-translate-y-1 flex flex-col justify-between overflow-hidden cursor-pointer ${
                  isAudioActive
                    ? 'border-[#C59E3F] bg-[#EFE8D3]/95 ring-2 ring-[#C59E3F]/50 shadow-md'
                    : 'border-[#E5DBC5] hover:border-[#C59E3F] shadow-xs hover:shadow-md'
                }`}
                onClick={() => onSelectSurah(surah.nomor)}
              >
                {/* Subtle Quran medallion pattern watermark in corner */}
                <div className="absolute right-1 bottom-1 w-20 h-20 opacity-10 pointer-events-none select-none">
                  <Image
                    src="/quran-surah-pattern.svg"
                    alt="Quran Ornament"
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Top Row: Number & Arabic Name */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    {/* Number Badge with Gilded Quranic Medallion styling */}
                    <div className="flex items-center space-x-3">
                      <div className={`relative w-10 h-10 flex items-center justify-center rounded-xl font-bold text-xs transition-colors shadow-2xs ${
                        isAudioActive 
                          ? 'bg-[#2C1810] text-[#F7E9C4] border-2 border-[#C59E3F]' 
                          : 'bg-[#F6F1E3] border-2 border-[#D6C28F] text-[#8F6E1C] group-hover:bg-[#2C1810] group-hover:text-[#F7E9C4] group-hover:border-[#C59E3F]'
                      }`}>
                        <span>{surah.nomor}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h3 className="font-bold text-base text-[#2C1810] group-hover:text-[#8F6E1C] transition-colors">
                            {surah.namaLatin}
                          </h3>
                          {hasBookmarks && (
                            <span title="Ada ayat tersimpan di surat ini">
                              <BookmarkCheck className="w-3.5 h-3.5 text-[#8F6E1C]" />
                            </span>
                          )}
                          {isAudioActive && (
                            <Volume2 className="w-3.5 h-3.5 text-[#8F6E1C] animate-pulse" />
                          )}
                        </div>
                        <p className="text-xs text-[#706553] font-medium">
                          {surah.arti}
                        </p>
                      </div>
                    </div>

                    {/* Arabic Calligraphic Name */}
                    <div className="text-right">
                      <span className="font-arabic-title text-2xl font-bold text-[#2C1810]">
                        {surah.nama}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Details & Audio Action */}
                <div className="mt-4 pt-3 border-t border-[#E5DBC5] flex items-center justify-between text-xs text-[#706553] relative z-10">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-lg bg-[#F6F1E3] border border-[#E5DBC5] font-semibold text-[11px] text-[#8F6E1C]">
                      {surah.tempatTurun}
                    </span>
                    <span className="font-medium">{surah.jumlahAyat} Ayat</span>
                  </div>

                  <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
                    {/* Audio Murottal Button */}
                    <button
                      id={`play-surah-audio-${surah.nomor}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isAudioActive) {
                          onPauseAudio();
                        } else {
                          onPlayFullSurah(surah);
                        }
                      }}
                      className={`p-2 rounded-xl transition-all active:scale-90 ${
                        isAudioActive
                          ? 'bg-[#2C1810] text-[#F7E9C4] border border-[#C59E3F] shadow-xs'
                          : 'bg-[#F6F1E3] text-[#706553] hover:bg-[#2C1810] hover:text-[#F7E9C4] border border-[#E5DBC5]'
                      }`}
                      title={isAudioActive ? 'Jeda Audio' : 'Dengar Audio Full'}
                    >
                      {isAudioActive ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                      )}
                    </button>

                    {/* Read Surah Link */}
                    <button
                      id={`read-surah-btn-${surah.nomor}`}
                      onClick={() => onSelectSurah(surah.nomor)}
                      className="px-3 py-1.5 rounded-xl bg-[#F6F1E3] hover:bg-[#2C1810] hover:text-[#F7E9C4] text-[#2C1810] font-bold text-xs transition-colors border border-[#D6C28F] active:scale-95"
                    >
                      Baca
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};
