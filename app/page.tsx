'use client';

import React, { useMemo } from 'react';
import { useQuran } from '@/context/QuranContext';
import { SurahList } from '@/components/SurahList';
import { JuzView } from '@/components/JuzView';
import { BookmarksView } from '@/components/BookmarksView';
import { DoaView } from '@/components/DoaView';

export default function HomePage() {
  const {
    activeTab,
    suratList,
    lastRead,
    bookmarks,
    removeBookmark,
    playerState,
    playFullSurah,
    pauseAudio,
    navigateToSurah,
  } = useQuran();

  const bookmarkedSurahIds = useMemo(() => {
    return new Set(bookmarks.map((b) => b.surahNumber));
  }, [bookmarks]);

  return (
    <div className="space-y-5">
      {/* View Content based on Bottom Nav selection */}
      {activeTab === 'surat' && (
        <SurahList
          suratList={suratList}
          onSelectSurah={(id) => navigateToSurah(id)}
          lastRead={lastRead}
          onResumeLastRead={(surahNum, verseNum) => navigateToSurah(surahNum, verseNum)}
          playingSurahNumber={playerState.surahNumber}
          isPlaying={playerState.isPlaying}
          onPlayFullSurah={playFullSurah}
          onPauseAudio={pauseAudio}
          bookmarkedSurahIds={bookmarkedSurahIds}
        />
      )}

      {activeTab === 'juz' && (
        <JuzView
          onSelectVerse={(surahNum, verseNum) => navigateToSurah(surahNum, verseNum)}
        />
      )}

      {activeTab === 'bookmark' && (
        <BookmarksView
          bookmarks={bookmarks}
          lastRead={lastRead}
          onSelectVerse={(surahNum, verseNum) => navigateToSurah(surahNum, verseNum)}
          onRemoveBookmark={removeBookmark}
          onClearAllBookmarks={() => {
            bookmarks.forEach((b) => removeBookmark(b.id));
          }}
          onSelectSurah={(id) => navigateToSurah(id)}
        />
      )}

      {activeTab === 'doa' && (
        <DoaView
          onSelectVerse={(surahNum, verseNum) => navigateToSurah(surahNum, verseNum)}
        />
      )}
    </div>
  );
}
