'use client';

import React, { useEffect, useState, use, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuran } from '@/context/QuranContext';
import { SurahDetailView } from '@/components/SurahDetailView';
import { fetchSurahDetail } from '@/lib/quran-api';
import { SurahDetail } from '@/types/quran';
import { motion } from 'motion/react';
import { BookOpen, AlertCircle, RotateCcw } from 'lucide-react';

export const dynamic = 'force-dynamic';

function SurahDetailContent({ id }: { id: string }) {
  const surahId = parseInt(id, 10);
  const isInvalidId = isNaN(surahId) || surahId < 1 || surahId > 114;

  const router = useRouter();
  const searchParams = useSearchParams();
  const ayatParam = searchParams.get('ayat');
  const targetVerse = ayatParam ? parseInt(ayatParam, 10) : null;

  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(!isInvalidId);
  const [error, setError] = useState<string | null>(
    isInvalidId ? 'Nomor surat tidak valid (harus antara 1-114).' : null
  );

  const {
    settings,
    updateSettings,
    isBookmarked,
    toggleBookmark,
    saveLastRead,
    playerState,
    playVerseAudio,
    playFullSurah,
    pauseAudio,
    setIsSettingsOpen,
    navigateToSurah,
  } = useQuran();

  useEffect(() => {
    let isMounted = true;
    if (isInvalidId) return;

    fetchSurahDetail(surahId)
      .then((data) => {
        if (isMounted) {
          setSurah(data);
          setLoading(false);
          // Auto record as last read
          saveLastRead(data.nomor, data.namaLatin, targetVerse || 1);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Gagal memuat detail surat. Silakan coba lagi.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [surahId, isInvalidId, targetVerse, saveLastRead]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-[#2C1810] border-t-[#C59E3F] rounded-full"
        />
        <div className="text-center">
          <h3 className="text-base font-bold text-[#2C1810]">
            Memuat Surat ke-{surahId}...
          </h3>
          <p className="text-xs text-[#706553] mt-1">
            Mengambil data teks Arab, terjemahan, tafsir Kemenag, dan audio
          </p>
        </div>
      </div>
    );
  }

  if (error || !surah) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-[#FCF9F0] border-2 border-red-300 text-red-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-[#2C1810]">
          Terjadi Kendala
        </h3>
        <p className="text-xs sm:text-sm text-[#706553] mt-1 mb-6">
          {error || 'Data surat tidak ditemukan.'}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 rounded-xl bg-[#FCF9F0] border border-[#D6C28F] text-[#2C1810] text-xs font-bold hover:bg-[#EFE8D3]"
          >
            Kembali ke Beranda
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl bg-[#2C1810] text-[#F7E9C4] text-xs font-bold flex items-center space-x-1.5 border border-[#C59E3F]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <SurahDetailView
      surah={surah}
      onBack={() => router.push('/')}
      onSelectSurah={(id) => navigateToSurah(id)}
      settings={settings}
      updateSettings={updateSettings}
      isBookmarked={isBookmarked}
      toggleBookmark={toggleBookmark}
      onSaveLastRead={saveLastRead}
      playingSurahNumber={playerState.surahNumber}
      playingVerseNumber={playerState.verseNumber}
      isPlaying={playerState.isPlaying}
      onPlayVerseAudio={playVerseAudio}
      onPlayFullSurah={playFullSurah}
      onPauseAudio={pauseAudio}
      targetVerseToScroll={targetVerse}
      onOpenSettings={() => setIsSettingsOpen(true)}
    />
  );
}

export default function SurahDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

  return (
    <Suspense
      fallback={
        <div className="py-24 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#2C1810] border-t-[#C59E3F] rounded-full animate-spin" />
          <p className="text-xs text-[#706553]">Memuat mushaf...</p>
        </div>
      }
    >
      <SurahDetailContent id={resolvedParams.id} />
    </Suspense>
  );
}
