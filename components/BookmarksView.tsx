'use client';

import React from 'react';
import Image from 'next/image';
import { Bookmark, Trash2, ArrowRight, BookOpen, Volume2 } from 'lucide-react';
import { BookmarkItem, LastReadItem } from '@/types/quran';
import { motion, AnimatePresence } from 'motion/react';

interface BookmarksViewProps {
  bookmarks: BookmarkItem[];
  lastRead: LastReadItem | null;
  onSelectVerse?: (surahNumber: number, verseNumber: number) => void;
  onSelectSurahVerse?: (surahNumber: number, verseNumber: number) => void;
  onRemoveBookmark: (id: string) => void;
  onClearAllBookmarks?: () => void;
  onSelectSurah: (id: number) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarks,
  lastRead,
  onSelectVerse,
  onSelectSurahVerse,
  onRemoveBookmark,
  onClearAllBookmarks,
  onSelectSurah,
}) => {
  const handleSelectVerse = onSelectVerse || onSelectSurahVerse || ((s, v) => onSelectSurah(s));
  const handleClearAll = onClearAllBookmarks || (() => {
    bookmarks.forEach(b => onRemoveBookmark(b.id));
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-24"
    >
      {/* Header Banner with Public Quran Image */}
      <div className="relative overflow-hidden rounded-3xl bg-[#26140A] text-[#FCF9F0] p-6 sm:p-8 shadow-xl border-2 border-[#D6C28F]">
        <div className="absolute inset-0 pointer-events-none select-none opacity-80">
          <Image
            src="/quran-cover-art.svg"
            alt="Mushaf Background"
            fill
            className="object-cover object-right"
          />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#150B05]/70 border border-[#C59E3F]/70 text-[#F7E9C4] text-xs font-bold shadow-xs">
              <Bookmark className="w-3.5 h-3.5 text-[#F2D06B]" />
              <span>Ayat & Pembatas Tersimpan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-[#FFFDF7]">
              Koleksi Bacaan Pribadi
            </h1>
            <p className="text-xs sm:text-sm text-[#F7E9C4]/90 max-w-lg">
              Daftar ayat Al-Qur&apos;an yang Anda simpan untuk dibaca kembali kapan saja.
            </p>
          </div>

          {bookmarks.length > 0 && (
            <motion.button
              whileTap={{ scale: 0.94 }}
              id="clear-all-bookmarks-btn"
              onClick={handleClearAll}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#1C0E06]/90 hover:bg-[#8F6E1C] text-[#F7E9C4] text-xs font-bold transition-all border border-[#C59E3F]/60"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Semua</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Last Read Quick Jump Banner */}
      {lastRead && (
        <div className="bg-[#FCF9F0] rounded-2xl p-5 border-2 border-[#D6C28F] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-32 h-20 opacity-15 pointer-events-none">
            <Image
              src="/quran-mushaf-card.svg"
              alt="Quran Bookmark Card"
              fill
              className="object-contain"
            />
          </div>

          <div className="flex items-center space-x-3.5 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#2C1810] text-[#F7E9C4] border border-[#C59E3F] flex items-center justify-center font-bold">
              <Bookmark className="w-6 h-6 text-[#F2D06B]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#8F6E1C] uppercase tracking-wider block">
                Penanda Terakhir Dibaca
              </span>
              <h3 className="font-bold text-lg text-[#2C1810]">
                QS. {lastRead.surahName} : Ayat {lastRead.verseNumber}
              </h3>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.94 }}
            id="continue-last-read-bookmark-btn"
            onClick={() => handleSelectVerse(lastRead.surahNumber, lastRead.verseNumber)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#2C1810] hover:bg-[#1C0E06] text-[#F7E9C4] text-xs font-bold shadow-xs border border-[#C59E3F] transition-all relative z-10"
          >
            <span>Lanjutkan Sekarang</span>
            <ArrowRight className="w-4 h-4 text-[#F2D06B]" />
          </motion.button>
        </div>
      )}

      {/* Bookmarked Verses List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#2C1810]">
            Ayat Tersimpan ({bookmarks.length})
          </h2>
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-16 bg-[#FCF9F0] rounded-3xl border-2 border-[#D6C28F] space-y-3">
            <BookOpen className="w-12 h-12 mx-auto text-[#8F6E1C]" />
            <h3 className="text-base font-bold text-[#2C1810]">
              Belum Ada Ayat yang Disimpan
            </h3>
            <p className="text-xs text-[#706553] max-w-sm mx-auto">
              Saat membaca surat, klik tombol penanda (bookmark) pada ayat yang ingin Anda simpan agar mudah ditemukan di sini.
            </p>
            <button
              onClick={() => onSelectSurah(1)}
              className="mt-2 px-4 py-2 rounded-xl bg-[#2C1810] text-[#F7E9C4] text-xs font-bold hover:bg-[#1C0E06] transition-colors border border-[#C59E3F]"
            >
              Mulai Membaca Surat
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookmarks.map((b) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#FCF9F0] rounded-2xl p-5 border-2 border-[#E5DBC5] hover:border-[#D6C28F] shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between pb-2.5 border-b border-[#E5DBC5]">
                  <span className="font-bold text-sm text-[#2C1810]">
                    QS. {b.surahName} : {b.verseNumber}
                  </span>
                  <button
                    onClick={() => onRemoveBookmark(b.id)}
                    className="p-1.5 rounded-lg text-[#706553] hover:text-red-700 hover:bg-[#EFE8D3] transition-colors"
                    title="Hapus simpanan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {b.arabicSnippet && (
                  <p className="font-arabic text-xl text-right text-[#181512] font-bold py-1 leading-relaxed" dir="rtl">
                    {b.arabicSnippet}
                  </p>
                )}

                {b.translationSnippet && (
                  <p className="text-xs text-[#342F28] line-clamp-3 leading-relaxed">
                    &quot;{b.translationSnippet}&quot;
                  </p>
                )}

                <div className="pt-2 border-t border-[#E5DBC5] flex items-center justify-between">
                  <span className="text-[10px] text-[#706553]">
                    Disimpan: {new Date(b.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleSelectVerse(b.surahNumber, b.verseNumber)}
                    className="flex items-center space-x-1.5 text-xs font-bold text-[#8F6E1C] hover:text-[#2C1810]"
                  >
                    <span>Buka Ayat</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
