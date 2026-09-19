'use client';

import React, { Suspense } from 'react';
import { QuranProvider, useQuran } from '@/context/QuranContext';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { AudioPlayerBar } from '@/components/AudioPlayerBar';
import { QuickSearchModal } from '@/components/QuickSearchModal';
import { SettingsModal } from '@/components/SettingsModal';

function InnerAppShell({ children }: { children: React.ReactNode }) {
  const {
    settings,
    updateSettings,
    playerState,
    pauseAudio,
    resumeAudio,
    stopAudio,
    nextVerseAudio,
    prevVerseAudio,
    changeQari,
    suratList,
    isSearchOpen,
    setIsSearchOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    navigateToSurah,
  } = useQuran();

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F1E3] text-[#2C1810] selection:bg-[#C59E3F] selection:text-[#2C1810]">
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-20 sm:pb-24">
        {children}
      </main>

      {/* Global Responsive Bottom Navigation Bar */}
      <Suspense fallback={null}>
        <BottomNav />
      </Suspense>

      {/* Global Floating Audio Player Bar */}
      <AudioPlayerBar
        playerState={playerState}
        onPause={pauseAudio}
        onResume={resumeAudio}
        onStop={stopAudio}
        onNextVerse={nextVerseAudio}
        onPrevVerse={prevVerseAudio}
        settings={settings}
        updateSettings={updateSettings}
        onChangeQari={changeQari}
      />

      {/* Quick Search Modal (Ctrl + K) */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        suratList={suratList}
        onSelectSurah={(id) => navigateToSurah(id)}
      />

      {/* Reader Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        updateSettings={updateSettings}
      />
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <QuranProvider>
      <InnerAppShell>{children}</InnerAppShell>
    </QuranProvider>
  );
}
