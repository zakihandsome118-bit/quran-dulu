'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import Image from 'next/image';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Bookmark, 
  Copy, 
  Check, 
  Share2, 
  BookOpen, 
  SlidersHorizontal,
  Search,
  FileText
} from 'lucide-react';
import { SurahDetail, ReaderSettings, AyatItem, SurahTafsir } from '@/types/quran';
import { fetchSurahTafsir, fetchSurahDetail } from '@/lib/quran-api';
import { motion, AnimatePresence } from 'motion/react';

interface AyatCardProps {
  ayat: AyatItem;
  surahNumber: number;
  surahName: string;
  totalVerses: number;
  bookmarked: boolean;
  isVersePlaying: boolean;
  isTafsirOpen: boolean;
  tafsirText?: string;
  arabicFontSize: number;
  translationFontSize: number;
  showLatin: boolean;
  showTranslation: boolean;
  selectedQari: string;
  copiedVerse: number | null;
  onSaveLastRead: (surahNumber: number, surahName: string, verseNumber: number) => void;
  onPlayVerseAudio: (surahNumber: number, verseNumber: number, audioUrl: string, surahName: string, totalVerses: number) => void;
  onPauseAudio: () => void;
  toggleBookmark: (item: {
    id: string;
    surahNumber: number;
    surahName: string;
    verseNumber: number;
    arabicSnippet: string;
    translationSnippet: string;
  }) => void;
  handleToggleTafsirForVerse: (verseNum: number) => void;
  handleCopyVerse: (ayat: AyatItem) => void;
  handleShareVerse: (ayat: AyatItem) => void;
  setVerseRef: (verseNum: number, el: HTMLDivElement | null) => void;
}

const AyatCard = memo(function AyatCard({
  ayat,
  surahNumber,
  surahName,
  totalVerses,
  bookmarked,
  isVersePlaying,
  isTafsirOpen,
  tafsirText,
  arabicFontSize,
  translationFontSize,
  showLatin,
  showTranslation,
  selectedQari,
  copiedVerse,
  onSaveLastRead,
  onPlayVerseAudio,
  onPauseAudio,
  toggleBookmark,
  handleToggleTafsirForVerse,
  handleCopyVerse,
  handleShareVerse,
  setVerseRef,
}: AyatCardProps) {
  const bookmarkKey = `${surahNumber}:${ayat.nomorAyat}`;
  const audioUrl = ayat.audio ? (ayat.audio[selectedQari as any] || ayat.audio['05'] || Object.values(ayat.audio)[0] || '') : '';

  return (
    <div
      id={`ayat-card-${surahNumber}-${ayat.nomorAyat}`}
      ref={(el) => setVerseRef(ayat.nomorAyat, el)}
      className={`rounded-2xl p-4 sm:p-6 transition-colors duration-150 border-2 ${
        isVersePlaying
          ? 'bg-[#EFE8D3] border-[#C59E3F] ring-2 ring-[#C59E3F]/40 shadow-md'
          : 'bg-[#FCF9F0] border-[#E5DBC5] hover:border-[#D6C28F] shadow-xs'
      }`}
    >
      {/* Verse Top Bar: Number & Actions */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5DBC5] select-none">
        {/* Verse Number Badge */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-[#F6F1E3] text-[#8F6E1C] font-bold text-xs flex items-center justify-center border border-[#D6C28F]">
            {surahNumber}:{ayat.nomorAyat}
          </div>
          <button
            id={`mark-last-read-${ayat.nomorAyat}`}
            onClick={() => onSaveLastRead(surahNumber, surahName, ayat.nomorAyat)}
            className="text-[11px] text-[#706553] hover:text-[#2C1810] font-semibold transition-colors cursor-pointer"
            title="Tandai terakhir dibaca di ayat ini"
          >
            Tandai Bacaan
          </button>
        </div>

        {/* Action Tools */}
        <div className="flex items-center space-x-1 text-[#706553]">
          {/* Play Verse Audio */}
          {audioUrl && (
            <button
              id={`play-verse-audio-${ayat.nomorAyat}`}
              onClick={(e) => {
                e.stopPropagation();
                if (isVersePlaying) {
                  onPauseAudio();
                } else {
                  onPlayVerseAudio(surahNumber, ayat.nomorAyat, audioUrl, surahName, totalVerses);
                }
              }}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isVersePlaying
                  ? 'bg-[#2C1810] text-[#F7E9C4] shadow-xs'
                  : 'hover:bg-[#EFE8D3] text-[#706553] hover:text-[#2C1810]'
              }`}
              title={isVersePlaying ? 'Jeda Audio' : 'Dengarkan Ayat Ini'}
            >
              {isVersePlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>
          )}

          {/* Bookmark Verse */}
          <button
            id={`bookmark-verse-${ayat.nomorAyat}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark({
                id: bookmarkKey,
                surahNumber,
                surahName,
                verseNumber: ayat.nomorAyat,
                arabicSnippet: ayat.teksArab,
                translationSnippet: ayat.teksIndonesia,
              });
            }}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              bookmarked
                ? 'text-[#8F6E1C] bg-[#F7E9C4] border border-[#C59E3F]'
                : 'hover:bg-[#EFE8D3] text-[#706553] hover:text-[#2C1810]'
            }`}
            title={bookmarked ? 'Hapus Simpanan' : 'Simpan Ayat'}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current text-[#8F6E1C]' : ''}`} />
          </button>

          {/* Tafsir per verse toggle */}
          <button
            id={`toggle-tafsir-${ayat.nomorAyat}`}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleTafsirForVerse(ayat.nomorAyat);
            }}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isTafsirOpen
                ? 'bg-[#2C1810] text-[#F7E9C4]'
                : 'hover:bg-[#EFE8D3] text-[#706553] hover:text-[#2C1810]'
            }`}
            title="Tafsir Ayat Kemenag"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* Copy Verse */}
          <button
            id={`copy-verse-${ayat.nomorAyat}`}
            onClick={(e) => {
              e.stopPropagation();
              handleCopyVerse(ayat);
            }}
            className="p-1.5 rounded-lg hover:bg-[#EFE8D3] text-[#706553] hover:text-[#2C1810] transition-colors cursor-pointer"
            title="Salin Ayat & Terjemahan"
          >
            {copiedVerse === ayat.nomorAyat ? (
              <Check className="w-4 h-4 text-[#8F6E1C]" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>

          {/* Share Verse */}
          <button
            id={`share-verse-${ayat.nomorAyat}`}
            onClick={(e) => {
              e.stopPropagation();
              handleShareVerse(ayat);
            }}
            className="p-1.5 rounded-lg hover:bg-[#EFE8D3] text-[#706553] hover:text-[#2C1810] transition-colors hidden sm:block cursor-pointer"
            title="Bagikan Ayat"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Arabic Verse Text */}
      <div className="text-right my-3 sm:my-4">
        <p
          className="font-arabic text-[#181512] font-bold select-text"
          style={{ 
            fontSize: `${arabicFontSize}px`,
            lineHeight: arabicFontSize > 34 ? 2.4 : 2.1
          }}
          dir="rtl"
        >
          {ayat.teksArab}
          <span className="inline-block mx-2 text-[#8F6E1C] font-arabic text-2xl font-normal select-none">
            ﴿{ayat.nomorAyat}﴾
          </span>
        </p>
      </div>

      {/* Latin Transliteration */}
      {showLatin && ayat.teksLatin && (
        <div className="mt-3 text-[#6B531C] text-xs sm:text-sm font-semibold leading-relaxed select-text">
          {ayat.teksLatin}
        </div>
      )}

      {/* Indonesian Translation */}
      {showTranslation && ayat.teksIndonesia && (
        <div 
          className="mt-2 text-[#342F28] leading-relaxed select-text font-normal"
          style={{ fontSize: `${translationFontSize}px` }}
        >
          {ayat.teksIndonesia}
        </div>
      )}

      {/* Inline Expanded Tafsir */}
      {isTafsirOpen && (
        <div className="mt-4 p-4 rounded-xl bg-[#F6F1E3] border border-[#D6C28F] text-xs sm:text-sm text-[#342F28] leading-relaxed space-y-2 shadow-inner">
          <div className="flex items-center space-x-1.5 font-bold text-[#2C1810] text-xs pb-1 border-b border-[#E5DBC5] select-none">
            <BookOpen className="w-3.5 h-3.5 text-[#8F6E1C]" />
            <span>Tafsir Kemenag RI (Ayat {ayat.nomorAyat}):</span>
          </div>
          {tafsirText ? (
            <p className="whitespace-pre-line pt-1 text-xs sm:text-sm leading-relaxed text-[#2C261F] font-normal select-text">
              {tafsirText}
            </p>
          ) : (
            <div className="flex items-center space-x-2 py-2 text-[#706553] text-xs select-none">
              <div className="w-3.5 h-3.5 border-2 border-[#8F6E1C] border-t-transparent rounded-full animate-spin" />
              <span>Memuat tafsir Kemenag...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

interface SurahDetailViewProps {
  surah: SurahDetail;
  onBack: () => void;
  onSelectSurah: (id: number) => void;
  settings: ReaderSettings;
  updateSettings: (newPartial: Partial<ReaderSettings>) => void;
  isBookmarked: (id: string) => boolean;
  toggleBookmark: (item: {
    id: string;
    surahNumber: number;
    surahName: string;
    verseNumber: number;
    arabicSnippet: string;
    translationSnippet: string;
  }) => void;
  onSaveLastRead: (surahNumber: number, surahName: string, verseNumber: number) => void;
  playingSurahNumber: number | null;
  playingVerseNumber: number | null;
  isPlaying: boolean;
  onPlayVerseAudio: (surahNumber: number, verseNumber: number, audioUrl: string, surahName: string, totalVerses: number) => void;
  onPlayFullSurah: (surah: { nomor: number; namaLatin: string; jumlahAyat: number; audioFull?: any }) => void;
  onPauseAudio: () => void;
  targetVerseToScroll?: number | null;
  onOpenSettings: () => void;
}

export const SurahDetailView: React.FC<SurahDetailViewProps> = ({
  surah,
  onBack,
  onSelectSurah,
  settings,
  isBookmarked,
  toggleBookmark,
  onSaveLastRead,
  playingSurahNumber,
  playingVerseNumber,
  isPlaying,
  onPlayVerseAudio,
  onPlayFullSurah,
  onPauseAudio,
  targetVerseToScroll,
  onOpenSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'baca' | 'tafsir'>('baca');
  const [copiedVerse, setCopiedVerse] = useState<number | null>(null);
  const [searchVerseTerm, setSearchVerseTerm] = useState('');
  const [selectedJumpVerse, setSelectedJumpVerse] = useState<number>(1);
  const [expandedTafsirVerses, setExpandedTafsirVerses] = useState<Record<number, boolean>>({});
  const [surahTafsirData, setSurahTafsirData] = useState<SurahTafsir | null>(null);
  const [isLoadingTafsir, setIsLoadingTafsir] = useState(false);
  const [tafsirError, setTafsirError] = useState<string | null>(null);
  const loadingTafsirPromiseRef = useRef<Promise<SurahTafsir | null> | null>(null);
  const lastPlayActionTimeRef = useRef(0);

  // Verse refs for smooth scrolling
  const verseRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const setVerseRef = useCallback((verseNum: number, el: HTMLDivElement | null) => {
    verseRefs.current[verseNum] = el;
  }, []);

  const loadTafsir = useCallback(async () => {
    if (surahTafsirData && surahTafsirData.nomor === surah.nomor) {
      return surahTafsirData;
    }
    if (loadingTafsirPromiseRef.current) {
      return loadingTafsirPromiseRef.current;
    }

    setIsLoadingTafsir(true);
    setTafsirError(null);

    const promise = (async () => {
      try {
        const data = await fetchSurahTafsir(surah.nomor);
        setSurahTafsirData(data);
        return data;
      } catch (err: any) {
        console.error('Error fetching tafsir:', err);
        setTafsirError('Gagal memuat data tafsir Kemenag. Silakan coba beberapa saat lagi.');
        return null;
      } finally {
        setIsLoadingTafsir(false);
        loadingTafsirPromiseRef.current = null;
      }
    })();

    loadingTafsirPromiseRef.current = promise;
    return promise;
  }, [surah.nomor, surahTafsirData]);

  // Background prefetch tafsir for current surah
  useEffect(() => {
    let isMounted = true;
    fetchSurahTafsir(surah.nomor)
      .then((data) => {
        if (isMounted && data && data.nomor === surah.nomor) {
          setSurahTafsirData(data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [surah.nomor]);

  // Scroll to target verse when opened
  useEffect(() => {
    if (targetVerseToScroll && verseRefs.current[targetVerseToScroll]) {
      const timer = setTimeout(() => {
        verseRefs.current[targetVerseToScroll]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [targetVerseToScroll, surah.nomor]);

  // Auto-scroll when active playing verse changes & preload next verse audio
  useEffect(() => {
    if (settings.autoScrollToAyat && isPlaying && playingSurahNumber === surah.nomor && playingVerseNumber && verseRefs.current[playingVerseNumber]) {
      verseRefs.current[playingVerseNumber]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Preload next verse audio in browser cache
    if (isPlaying && playingSurahNumber === surah.nomor && playingVerseNumber) {
      const nextVerseNum = playingVerseNumber + 1;
      const nextAyat = surah.ayat.find((a) => a.nomorAyat === nextVerseNum);
      if (nextAyat?.audio) {
        const nextUrl = nextAyat.audio[settings.selectedQari] || nextAyat.audio['05'] || Object.values(nextAyat.audio)[0];
        if (nextUrl) {
          const preloader = new Audio();
          preloader.preload = 'auto';
          preloader.src = nextUrl;
        }
      }
    }
  }, [playingVerseNumber, isPlaying, playingSurahNumber, surah.nomor, surah.ayat, settings.autoScrollToAyat, settings.selectedQari]);

  // Instant zero-lag toggle for verse tafsir
  const handleToggleTafsirForVerse = useCallback((verseNum: number) => {
    setExpandedTafsirVerses((prev) => ({
      ...prev,
      [verseNum]: !prev[verseNum]
    }));

    if (!surahTafsirData || surahTafsirData.nomor !== surah.nomor) {
      loadTafsir();
    }
  }, [surahTafsirData, surah.nomor, loadTafsir]);

  const handleSafePlayVerseAudio = useCallback((
    surahNumber: number,
    verseNumber: number,
    audioUrl: string,
    surahName: string,
    totalVerses: number
  ) => {
    const now = Date.now();
    if (now - lastPlayActionTimeRef.current < 200) return;
    lastPlayActionTimeRef.current = now;
    onPlayVerseAudio(surahNumber, verseNumber, audioUrl, surahName, totalVerses);
  }, [onPlayVerseAudio]);

  const handleCopyVerse = useCallback((ayat: AyatItem) => {
    const textToCopy = `${ayat.teksArab}\n\n"${ayat.teksIndonesia}"\n(QS. ${surah.namaLatin} ${surah.nomor}:${ayat.nomorAyat})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedVerse(ayat.nomorAyat);
    setTimeout(() => setCopiedVerse(null), 2000);
  }, [surah.namaLatin, surah.nomor]);

  const handleShareVerse = useCallback(async (ayat: AyatItem) => {
    const textToShare = `${ayat.teksArab}\n\n"${ayat.teksIndonesia}"\n(QS. ${surah.namaLatin} ${surah.nomor}:${ayat.nomorAyat})\n\nDibaca via Mushaf Al-Qur'an Indonesia`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `QS. ${surah.namaLatin} Ayat ${ayat.nomorAyat}`,
          text: textToShare,
        });
      } catch {
        // Ignored
      }
    } else {
      handleCopyVerse(ayat);
    }
  }, [surah.namaLatin, surah.nomor, handleCopyVerse]);

  const scrollToVerse = (verseNum: number) => {
    const el = verseRefs.current[verseNum];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Fast O(1) dictionary for verse tafsir
  const tafsirMap = useMemo(() => {
    const map = new Map<number, string>();
    if (surahTafsirData && surahTafsirData.nomor === surah.nomor && surahTafsirData.tafsir) {
      for (const item of surahTafsirData.tafsir) {
        map.set(item.ayat, item.teks);
      }
    }
    return map;
  }, [surahTafsirData, surah.nomor]);

  const filteredAyat = useMemo(() => {
    if (!searchVerseTerm.trim()) return surah.ayat;
    const term = searchVerseTerm.toLowerCase();
    return surah.ayat.filter((a) => {
      return (
        a.nomorAyat.toString() === term ||
        a.teksIndonesia.toLowerCase().includes(term) ||
        (a.teksLatin && a.teksLatin.toLowerCase().includes(term)) ||
        a.teksArab.includes(term)
      );
    });
  }, [surah.ayat, searchVerseTerm]);

  const filteredTafsir = useMemo(() => {
    if (!surahTafsirData?.tafsir || surahTafsirData.nomor !== surah.nomor) return [];
    if (!searchVerseTerm.trim()) return surahTafsirData.tafsir;
    const term = searchVerseTerm.toLowerCase();
    return surahTafsirData.tafsir.filter((t) => {
      return t.ayat.toString() === term || t.teks.toLowerCase().includes(term);
    });
  }, [surahTafsirData, surah.nomor, searchVerseTerm]);

  const isFullSurahPlaying = playingSurahNumber === surah.nomor && isPlaying && !playingVerseNumber;

  return (
    <div className="space-y-6 pb-28">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between select-none">
        <button
          id="back-to-surah-list-btn"
          onClick={onBack}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#FCF9F0] hover:bg-[#EFE8D3] text-[#2C1810] text-xs sm:text-sm font-bold border-2 border-[#D6C28F] shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#8F6E1C]" />
          <span>Kembali ke Daftar Surat</span>
        </button>

        {/* Previous & Next Surah Quick Controls */}
        <div className="flex items-center space-x-1">
          {surah.suratSebelumnya && (
            <button
              id="prev-surah-nav-btn"
              onClick={() => onSelectSurah(surah.suratSebelumnya!.nomor)}
              className="p-2 rounded-xl bg-[#FCF9F0] hover:bg-[#EFE8D3] text-[#2C1810] border border-[#D6C28F] text-xs font-semibold cursor-pointer"
              title={`Surat Sebelumnya: ${surah.suratSebelumnya.namaLatin}`}
            >
              <ChevronLeft className="w-4 h-4 text-[#8F6E1C]" />
            </button>
          )}

          {surah.suratSelanjutnya && (
            <button
              id="next-surah-nav-btn"
              onClick={() => onSelectSurah(surah.suratSelanjutnya!.nomor)}
              className="p-2 rounded-xl bg-[#FCF9F0] hover:bg-[#EFE8D3] text-[#2C1810] border border-[#D6C28F] text-xs font-semibold cursor-pointer"
              title={`Surat Selanjutnya: ${surah.suratSelanjutnya.namaLatin}`}
            >
              <ChevronRight className="w-4 h-4 text-[#8F6E1C]" />
            </button>
          )}
        </div>
      </div>

      {/* Surah Header Banner - Classical Quran Mushaf Title Block with Public Image */}
      <div 
        className="relative overflow-hidden rounded-3xl bg-[#26140A] text-[#FCF9F0] p-6 sm:p-8 shadow-xl border-2 border-[#D6C28F]"
      >
        {/* Background Quran Cover Artwork */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-85">
          <Image
            src="/quran-cover-art.svg"
            alt="Mushaf Header Cover"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        <div className="relative z-10 text-center flex flex-col items-center space-y-3 select-none">
          {/* Metadata pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#150B05]/70 backdrop-blur-xs border border-[#C59E3F]/70 text-[#F7E9C4] text-xs font-bold shadow-xs">
            <span>Surat Ke-{surah.nomor}</span>
            <span>•</span>
            <span className="capitalize">{surah.tempatTurun}</span>
            <span>•</span>
            <span>{surah.jumlahAyat} Ayat</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold font-serif tracking-wide text-[#FFFDF7] drop-shadow-sm">
            {surah.namaLatin}
          </h1>

          <p className="text-[#F7E9C4] font-arabic text-3xl sm:text-4xl py-1 font-bold drop-shadow-xs">
            {surah.nama}
          </p>

          <p className="text-[#F7E9C4]/95 text-sm max-w-md font-medium drop-shadow-xs">
            Arti: &quot;{surah.arti}&quot;
          </p>

          {/* Quick Audio Action */}
          <div className="pt-1">
            <button
              id="play-full-surah-hero-btn"
              onClick={() => {
                if (isFullSurahPlaying) onPauseAudio();
                else onPlayFullSurah(surah);
              }}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#F6F1E3] hover:bg-[#FCF9F0] text-[#2C1810] font-bold text-xs transition-colors shadow-md border border-[#C59E3F] cursor-pointer"
            >
              {isFullSurahPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current text-[#2C1810]" />
                  <span>Jeda Murottal Full</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current text-[#2C1810]" />
                  <span>Putar Audio Full Surat</span>
                </>
              )}
            </button>
          </div>

          {/* Deskripsi Lengkap Surat */}
          {surah.deskripsi && (
            <div className="w-full max-w-3xl mt-4 p-4 sm:p-5 rounded-2xl bg-[#1C0E06]/95 border border-[#C59E3F]/50 text-[#F7E9C4] text-xs sm:text-sm text-left leading-relaxed shadow-inner">
              <div className="flex items-center space-x-1.5 font-bold text-[#F2D06B] text-xs mb-2 pb-1.5 border-b border-[#C59E3F]/40 select-none">
                <FileText className="w-4 h-4 text-[#F2D06B]" />
                <span>Keterangan & Deskripsi Surat {surah.namaLatin}:</span>
              </div>
              <div 
                dangerouslySetInnerHTML={{ __html: surah.deskripsi }} 
                className="text-[#FCF9F0]/95 leading-relaxed space-y-2 font-normal prose-invert select-text"
              />
            </div>
          )}
        </div>
      </div>

      {/* Sticky Action Toolbar - Parchment Paper Style */}
      <div className="sticky top-16 z-30 bg-[#FCF9F0]/95 backdrop-blur-md p-3 rounded-2xl border-2 border-[#D6C28F] shadow-sm flex flex-wrap items-center justify-between gap-3 select-none">
        {/* Left: View mode tabs */}
        <div className="flex items-center space-x-1 bg-[#F6F1E3] p-1 rounded-xl text-xs border border-[#E5DBC5]">
          <button
            id="tab-baca-ayat-btn"
            onClick={() => setActiveTab('baca')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              activeTab === 'baca'
                ? 'bg-[#2C1810] text-[#F7E9C4] shadow-xs'
                : 'text-[#706553] hover:text-[#2C1810]'
            }`}
          >
            Teks & Audio
          </button>
          <button
            id="tab-tafsir-lengkap-btn"
            onClick={() => {
              setActiveTab('tafsir');
              if (!surahTafsirData || surahTafsirData.nomor !== surah.nomor) {
                loadTafsir();
              }
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              activeTab === 'tafsir'
                ? 'bg-[#2C1810] text-[#F7E9C4] shadow-xs'
                : 'text-[#706553] hover:text-[#2C1810]'
            }`}
          >
            Tafsir Kemenag
          </button>
        </div>

        {/* Middle: Jump to Verse & Search */}
        <div className="flex items-center space-x-2 flex-1 max-w-md">
          {/* Jump to verse selector */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-[#706553] font-medium hidden sm:inline">Ayat:</span>
            <select
              id="jump-verse-select"
              value={selectedJumpVerse}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setSelectedJumpVerse(val);
                scrollToVerse(val);
              }}
              className="bg-[#F6F1E3] text-[#2C1810] py-1.5 px-2 rounded-lg border border-[#D6C28F] focus:outline-none focus:ring-1 focus:ring-[#8F6E1C] font-bold cursor-pointer"
            >
              {Array.from({ length: surah.jumlahAyat }, (_, i) => i + 1).map((v) => (
                <option key={v} value={v}>
                  Ayat {v}
                </option>
              ))}
            </select>
          </div>

          {/* Search inside surah input */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8F6E1C]" />
            <input
              id="search-inside-surah-input"
              type="text"
              value={searchVerseTerm}
              onChange={(e) => setSearchVerseTerm(e.target.value)}
              placeholder="Cari kata/ayat..."
              className="w-full pl-8 pr-3 py-1 text-xs rounded-lg bg-[#F6F1E3] border border-[#D6C28F] focus:outline-none focus:ring-1 focus:ring-[#8F6E1C] text-[#2C261F] placeholder-[#706553]/70 font-medium"
            />
          </div>
        </div>

        {/* Right: Font Settings Pill */}
        <div className="flex items-center space-x-1">
          <button
            id="open-reader-settings-btn"
            onClick={onOpenSettings}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#F6F1E3] hover:bg-[#EFE8D3] text-[#2C1810] text-xs font-bold border border-[#D6C28F] transition-colors cursor-pointer"
            title="Ubah Ukuran Huruf & Qari"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#8F6E1C]" />
            <span className="hidden sm:inline">Ukuran Huruf</span>
          </button>
        </div>
      </div>

      {/* Bismillah Header */}
      {surah.nomor !== 1 && surah.nomor !== 9 && (
        <div 
          className="text-center py-6 px-4 bg-[#FCF9F0] rounded-2xl border-2 border-[#D6C28F] shadow-xs relative overflow-hidden select-none"
        >
          <p className="font-arabic text-2xl sm:text-3xl text-[#2C1810] font-bold tracking-wide">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="text-xs text-[#706553] mt-1 italic font-serif">
            Dengan nama Allah Yang Maha Pengasih, Maha Penyayang
          </p>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      {activeTab === 'baca' ? (
        <div className="space-y-4">
          {filteredAyat.length === 0 ? (
            <div className="text-center py-12 bg-[#FCF9F0] rounded-2xl border-2 border-[#D6C28F]">
              <p className="text-sm text-[#706553]">
                Tidak ada ayat yang cocok dengan kata kunci pencarian.
              </p>
              <button
                onClick={() => setSearchVerseTerm('')}
                className="mt-2 text-xs font-bold text-[#2C1810] hover:underline cursor-pointer"
              >
                Tampilkan semua ayat
              </button>
            </div>
          ) : (
            filteredAyat.map((ayat) => {
              const bookmarkKey = `${surah.nomor}:${ayat.nomorAyat}`;
              const bookmarked = isBookmarked(bookmarkKey);
              const isVersePlaying =
                playingSurahNumber === surah.nomor &&
                playingVerseNumber === ayat.nomorAyat &&
                isPlaying;
              const isTafsirOpen = !!expandedTafsirVerses[ayat.nomorAyat];
              const tafsirText = tafsirMap.get(ayat.nomorAyat);

              return (
                <AyatCard
                  key={ayat.nomorAyat}
                  ayat={ayat}
                  surahNumber={surah.nomor}
                  surahName={surah.namaLatin}
                  totalVerses={surah.jumlahAyat}
                  bookmarked={bookmarked}
                  isVersePlaying={isVersePlaying}
                  isTafsirOpen={isTafsirOpen}
                  tafsirText={tafsirText}
                  arabicFontSize={settings.arabicFontSize}
                  translationFontSize={settings.translationFontSize}
                  showLatin={settings.showLatin}
                  showTranslation={settings.showTranslation}
                  selectedQari={settings.selectedQari}
                  copiedVerse={copiedVerse}
                  onSaveLastRead={onSaveLastRead}
                  onPlayVerseAudio={handleSafePlayVerseAudio}
                  onPauseAudio={onPauseAudio}
                  toggleBookmark={toggleBookmark}
                  handleToggleTafsirForVerse={handleToggleTafsirForVerse}
                  handleCopyVerse={handleCopyVerse}
                  handleShareVerse={handleShareVerse}
                  setVerseRef={setVerseRef}
                />
              );
            })
          )}
        </div>
      ) : (
        /* FULL SURAH TAFSIR TAB */
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#FCF9F0] border-2 border-[#D6C28F] text-xs sm:text-sm text-[#2C1810] flex items-center justify-between shadow-xs select-none">
            <div className="flex items-center space-x-2 font-bold">
              <BookOpen className="w-4 h-4 text-[#8F6E1C]" />
              <span>Tafsir Lengkap Kemenag RI — Surat {surah.namaLatin}</span>
            </div>
            <span className="text-xs font-bold text-[#8F6E1C]">{surah.jumlahAyat} Ayat</span>
          </div>

          {isLoadingTafsir && (!surahTafsirData || surahTafsirData.nomor !== surah.nomor) ? (
            <div className="text-center py-16 bg-[#FCF9F0] rounded-2xl border-2 border-[#D6C28F]">
              <div className="w-8 h-8 border-3 border-[#2C1810] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm font-bold text-[#2C1810]">
                Memuat Tafsir Surat {surah.namaLatin}...
              </p>
              <p className="text-xs text-[#706553] mt-1">Mengambil data tafsir resmi Kemenag RI</p>
            </div>
          ) : tafsirError ? (
            <div className="text-center py-12 bg-[#FCF9F0] rounded-2xl border-2 border-red-300 p-6 space-y-3">
              <p className="text-sm text-red-700 font-bold">{tafsirError}</p>
              <button
                onClick={() => loadTafsir()}
                className="px-4 py-2 rounded-xl bg-[#2C1810] text-[#F7E9C4] text-xs font-bold border border-[#C59E3F] cursor-pointer"
              >
                Coba Muat Ulang Tafsir
              </button>
            </div>
          ) : filteredTafsir.length === 0 ? (
            <div className="text-center py-12 bg-[#FCF9F0] rounded-2xl border-2 border-[#D6C28F]">
              <p className="text-sm text-[#706553]">
                {searchVerseTerm ? 'Tidak ada tafsir ayat yang cocok dengan kata kunci pencarian.' : 'Tafsir sedang disiapkan...'}
              </p>
              {searchVerseTerm ? (
                <button
                  onClick={() => setSearchVerseTerm('')}
                  className="mt-2 text-xs font-bold text-[#2C1810] hover:underline cursor-pointer"
                >
                  Tampilkan semua tafsir
                </button>
              ) : (
                <button
                  onClick={() => loadTafsir()}
                  className="mt-3 px-4 py-2 rounded-xl bg-[#2C1810] text-[#F7E9C4] text-xs font-bold cursor-pointer"
                >
                  Muat Tafsir Sekarang
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTafsir.map((item) => (
                <div
                  key={item.ayat}
                  id={`tafsir-card-${item.ayat}`}
                  className="bg-[#FCF9F0] rounded-2xl p-5 border-2 border-[#E5DBC5] shadow-xs space-y-2.5"
                >
                  <div className="flex items-center space-x-2 pb-2 border-b border-[#E5DBC5] select-none">
                    <span className="px-2.5 py-1 rounded-lg bg-[#F6F1E3] text-[#2C1810] font-bold text-xs border border-[#D6C28F]">
                      Ayat {item.ayat}
                    </span>
                    <span className="text-xs font-bold text-[#706553]">
                      Tafsir QS. {surah.namaLatin} : {item.ayat}
                    </span>
                  </div>
                  <p className="text-sm text-[#2C261F] leading-relaxed whitespace-pre-line select-text">
                    {item.teks}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-[#D6C28F] select-none">
        {surah.suratSebelumnya ? (
          <button
            onClick={() => onSelectSurah(surah.suratSebelumnya!.nomor)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#FCF9F0] border-2 border-[#D6C28F] hover:border-[#2C1810] text-[#2C1810] text-xs sm:text-sm font-bold transition-colors shadow-xs cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-[#8F6E1C]" />
            <div className="text-left">
              <span className="text-[10px] text-[#706553] block">Sebelumnya</span>
              <span>{surah.suratSebelumnya.namaLatin}</span>
            </div>
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="px-4 py-2 rounded-xl bg-[#FCF9F0] border border-[#D6C28F] text-xs font-bold text-[#706553] hover:text-[#2C1810] transition-colors cursor-pointer"
        >
          Kembali ke Atas ↑
        </button>

        {surah.suratSelanjutnya ? (
          <button
            onClick={() => onSelectSurah(surah.suratSelanjutnya!.nomor)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#FCF9F0] border-2 border-[#D6C28F] hover:border-[#2C1810] text-[#2C1810] text-xs sm:text-sm font-bold transition-colors shadow-xs text-right cursor-pointer"
          >
            <div>
              <span className="text-[10px] text-[#706553] block">Selanjutnya</span>
              <span>{surah.suratSelanjutnya.namaLatin}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8F6E1C]" />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

