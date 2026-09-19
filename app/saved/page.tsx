'use client';

import React from 'react';
import { useQuran } from '@/context/QuranContext';
import { BookmarksView } from '@/components/BookmarksView';

export default function SavedPage() {
  const {
    bookmarks,
    lastRead,
    removeBookmark,
    navigateToSurah,
  } = useQuran();

  return (
    <BookmarksView
      bookmarks={bookmarks}
      lastRead={lastRead}
      onSelectSurahVerse={(surahNum, verseNum) => navigateToSurah(surahNum, verseNum)}
      onRemoveBookmark={removeBookmark}
      onSelectSurah={(id) => navigateToSurah(id)}
    />
  );
}
