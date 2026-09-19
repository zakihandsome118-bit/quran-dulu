'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  ReaderSettings, 
  BookmarkItem, 
  LastReadItem, 
  SurahListItem, 
  SurahDetail,
  QuranMainTab 
} from '@/types/quran';
import { fetchSurahList, fetchSurahDetail } from '@/lib/quran-api';
import { SURAH_LIST_INITIAL, QARI_LIST } from '@/lib/quran-data';
import { AudioPlayerState } from '@/components/AudioPlayerBar';

interface QuranContextType {
  // Main Navigation Tab
  activeTab: QuranMainTab;
  setActiveTab: (tab: QuranMainTab) => void;
  navigateToTab: (tab: QuranMainTab) => void;

  // Settings
  settings: ReaderSettings;
  updateSettings: (newPartial: Partial<ReaderSettings>) => void;

  // Bookmarks & History
  bookmarks: BookmarkItem[];
  lastRead: LastReadItem | null;
  saveLastRead: (
    surahNumberOrItem: number | LastReadItem,
    surahName?: string,
    verseNumber?: number
  ) => void;
  toggleBookmark: (item: Omit<BookmarkItem, 'createdAt'>) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;

  // Surah List
  suratList: SurahListItem[];
  isLoadingSuratList: boolean;

  // Global Audio
  playerState: AudioPlayerState;
  playFullSurah: (surah: { nomor: number; namaLatin: string; jumlahAyat: number; audioFull?: any }) => void;
  playVerseAudio: (surahNumber: number, verseNumber: number, audioUrl: string, surahName: string, totalVerses: number) => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  stopAudio: () => void;
  nextVerseAudio: (currentSurahDetail?: SurahDetail | null) => void;
  prevVerseAudio: (currentSurahDetail?: SurahDetail | null) => void;
  changeQari: (qariId: '01' | '02' | '03' | '04' | '05', currentSurahDetail?: SurahDetail | null) => void;

  // Modals
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;

  // Navigation helper
  navigateToSurah: (id: number, verse?: number) => void;
}

const DEFAULT_SETTINGS: ReaderSettings = {
  arabicFontSize: 32,
  translationFontSize: 15,
  showLatin: true,
  showTranslation: true,
  theme: 'light',
  selectedQari: '05',
  autoScrollToAyat: true,
  autoPlayNext: true,
};

const QuranContext = createContext<QuranContextType | undefined>(undefined);

export const QuranProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Settings State - default to stable initial values for SSR hydration match
  const [activeTab, setActiveTab] = useState<QuranMainTab>('surat');
  const [settings, setSettings] = useState<ReaderSettings>(DEFAULT_SETTINGS);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [lastRead, setLastRead] = useState<LastReadItem | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Navigation Lock to protect against rapid double-clicks
  const lastNavTimeRef = React.useRef(0);
  const isNavigatingRef = React.useRef(false);

  // Sync activeTab with URL parameters safely
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncTabFromUrl = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        if (tab === 'juz') {
          setActiveTab('juz');
        } else if (tab === 'bookmark' || tab === 'saved' || tab === 'tersimpan') {
          setActiveTab('bookmark');
        } else if (tab === 'doa') {
          setActiveTab('doa');
        } else if (tab === 'surat' || tab === 'surah') {
          setActiveTab('surat');
        }
      } catch {}
    };

    syncTabFromUrl();
    window.addEventListener('popstate', syncTabFromUrl);
    return () => window.removeEventListener('popstate', syncTabFromUrl);
  }, [pathname]);

  // Load persisted state from localStorage on client mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedSettings = localStorage.getItem('quran_settings');
        if (storedSettings) {
          const parsed = JSON.parse(storedSettings);
          setSettings((prev) => ({ ...prev, ...parsed }));
        }

        const storedBookmarks = localStorage.getItem('quran_bookmarks');
        if (storedBookmarks) {
          setBookmarks(JSON.parse(storedBookmarks));
        }

        const storedLastRead = localStorage.getItem('quran_last_read');
        if (storedLastRead) {
          setLastRead(JSON.parse(storedLastRead));
        }
      } catch (e) {
        console.error('Error loading state from localStorage:', e);
      } finally {
        setIsHydrated(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Persist settings after hydration
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('quran_settings', JSON.stringify(settings));
    } catch {}
  }, [settings, isHydrated]);

  const updateSettings = useCallback((newPartial: Partial<ReaderSettings>) => {
    setSettings((prev) => ({ ...prev, ...newPartial }));
  }, []);

  const saveLastRead = useCallback((
    surahNumberOrItem: number | LastReadItem,
    surahName?: string,
    verseNumber?: number
  ) => {
    let item: LastReadItem;
    if (typeof surahNumberOrItem === 'number') {
      item = {
        surahNumber: surahNumberOrItem,
        surahName: surahName || `Surat ${surahNumberOrItem}`,
        verseNumber: verseNumber || 1,
        timestamp: Date.now(),
      };
    } else {
      item = surahNumberOrItem;
    }

    setLastRead(item);
    try {
      localStorage.setItem('quran_last_read', JSON.stringify(item));
    } catch {}
  }, []);

  const toggleBookmark = useCallback((item: Omit<BookmarkItem, 'createdAt'>) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === item.id);
      let updated: BookmarkItem[];
      if (exists) {
        updated = prev.filter((b) => b.id !== item.id);
      } else {
        updated = [{ ...item, createdAt: Date.now() }, ...prev];
      }
      try {
        localStorage.setItem('quran_bookmarks', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      try {
        localStorage.setItem('quran_bookmarks', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const isBookmarked = useCallback((id: string) => {
    return bookmarks.some((b) => b.id === id);
  }, [bookmarks]);

  // Surah List State
  const [suratList, setSuratList] = useState<SurahListItem[]>(SURAH_LIST_INITIAL);
  const [isLoadingSuratList, setIsLoadingSuratList] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadList = async () => {
      setIsLoadingSuratList(true);
      try {
        const data = await fetchSurahList();
        if (isMounted && data && data.length > 0) {
          setSuratList(data);
        }
      } catch (err) {
        console.warn('Using local Surah initial dataset');
      } finally {
        if (isMounted) setIsLoadingSuratList(false);
      }
    };
    loadList();
    return () => {
      isMounted = false;
    };
  }, []);

  // Audio Player State
  const [playerState, setPlayerState] = useState<AudioPlayerState>({
    isPlaying: false,
    surahNumber: null,
    surahName: '',
    verseNumber: null,
    audioUrl: '',
    totalVerses: 0,
  });

  // Keep a cached copy of the current active surah detail for fast audio transitions
  const [cachedSurahDetail, setCachedSurahDetail] = useState<SurahDetail | null>(null);

  const playFullSurah = useCallback((surah: { nomor: number; namaLatin: string; jumlahAyat: number; audioFull?: any }) => {
    const qariKey = settings.selectedQari;
    const url = surah.audioFull ? (surah.audioFull[qariKey] || surah.audioFull['05'] || Object.values(surah.audioFull)[0]) : '';
    
    const finalUrl = (typeof url === 'string' && url) ? url : `https://equran.nos.wjv-1.neo.id/audio-full/Misyari-Rasyid-Al-Afasi/${String(surah.nomor).padStart(3, '0')}.mp3`;

    setPlayerState({
      isPlaying: true,
      surahNumber: surah.nomor,
      surahName: surah.namaLatin,
      verseNumber: null,
      audioUrl: finalUrl,
      totalVerses: surah.jumlahAyat,
    });
  }, [settings.selectedQari]);

  const playVerseAudio = useCallback((
    surahNumber: number,
    verseNumber: number,
    audioUrl: string,
    surahName: string,
    totalVerses: number
  ) => {
    setPlayerState({
      isPlaying: true,
      surahNumber,
      surahName,
      verseNumber,
      audioUrl,
      totalVerses,
    });

    // Auto save last read when user starts listening
    saveLastRead(surahNumber, surahName, verseNumber);
  }, [saveLastRead]);

  const pauseAudio = useCallback(() => {
    setPlayerState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const resumeAudio = useCallback(() => {
    if (playerState.audioUrl) {
      setPlayerState((prev) => ({ ...prev, isPlaying: true }));
    }
  }, [playerState.audioUrl]);

  const stopAudio = useCallback(() => {
    setPlayerState({
      isPlaying: false,
      surahNumber: null,
      surahName: '',
      verseNumber: null,
      audioUrl: '',
      totalVerses: 0,
    });
  }, []);

  const nextVerseAudio = useCallback(async (currentSurahDetail?: SurahDetail | null) => {
    if (!playerState.surahNumber || playerState.verseNumber === null) return;

    const nextVerseNum = playerState.verseNumber + 1;
    let detail = currentSurahDetail || cachedSurahDetail;

    if (!detail || detail.nomor !== playerState.surahNumber) {
      try {
        detail = await fetchSurahDetail(playerState.surahNumber);
        setCachedSurahDetail(detail);
      } catch (err) {
        console.error('Failed to fetch detail for audio progression:', err);
        return;
      }
    }

    if (!detail) return;

    if (nextVerseNum <= detail.jumlahAyat) {
      const nextAyat = detail.ayat.find((a) => a.nomorAyat === nextVerseNum);
      if (nextAyat) {
        const audioUrl = nextAyat.audio ? (nextAyat.audio[settings.selectedQari] || nextAyat.audio['05'] || Object.values(nextAyat.audio)[0] || '') : '';
        if (audioUrl) {
          playVerseAudio(
            detail.nomor,
            nextVerseNum,
            audioUrl,
            detail.namaLatin,
            detail.jumlahAyat
          );
        }
      }
    } else {
      // Reached the end of the surah
      pauseAudio();
    }
  }, [playerState.surahNumber, playerState.verseNumber, cachedSurahDetail, settings.selectedQari, playVerseAudio, pauseAudio]);

  const prevVerseAudio = useCallback(async (currentSurahDetail?: SurahDetail | null) => {
    if (!playerState.surahNumber || playerState.verseNumber === null || playerState.verseNumber <= 1) return;

    const prevVerseNum = playerState.verseNumber - 1;
    let detail = currentSurahDetail || cachedSurahDetail;

    if (!detail || detail.nomor !== playerState.surahNumber) {
      try {
        detail = await fetchSurahDetail(playerState.surahNumber);
        setCachedSurahDetail(detail);
      } catch (err) {
        console.error('Failed to fetch detail for prev verse audio:', err);
        return;
      }
    }

    if (!detail) return;

    const prevAyat = detail.ayat.find((a) => a.nomorAyat === prevVerseNum);
    if (prevAyat) {
      const audioUrl = prevAyat.audio ? (prevAyat.audio[settings.selectedQari] || prevAyat.audio['05'] || Object.values(prevAyat.audio)[0] || '') : '';
      if (audioUrl) {
        playVerseAudio(
          detail.nomor,
          prevVerseNum,
          audioUrl,
          detail.namaLatin,
          detail.jumlahAyat
        );
      }
    }
  }, [playerState.surahNumber, playerState.verseNumber, cachedSurahDetail, settings.selectedQari, playVerseAudio]);

  const changeQari = useCallback(async (
    qariId: '01' | '02' | '03' | '04' | '05',
    currentSurahDetail?: SurahDetail | null
  ) => {
    updateSettings({ selectedQari: qariId });

    if (playerState.isPlaying && playerState.surahNumber) {
      if (playerState.verseNumber === null) {
        // Full surah mode
        const surahItem = suratList.find((s) => s.nomor === playerState.surahNumber);
        if (surahItem) {
          const url = surahItem.audioFull ? (surahItem.audioFull[qariId] || surahItem.audioFull['05'] || Object.values(surahItem.audioFull)[0] || '') : '';
          const finalUrl = url || `https://equran.nos.wjv-1.neo.id/audio-full/${qariId}/${String(playerState.surahNumber).padStart(3, '0')}.mp3`;
          setPlayerState((prev) => ({
            ...prev,
            audioUrl: finalUrl,
          }));
        }
      } else {
        // Single verse mode
        let detail = currentSurahDetail || cachedSurahDetail;
        if (!detail || detail.nomor !== playerState.surahNumber) {
          try {
            detail = await fetchSurahDetail(playerState.surahNumber);
            setCachedSurahDetail(detail);
          } catch {}
        }
        if (detail) {
          const currentAyat = detail.ayat.find((a) => a.nomorAyat === playerState.verseNumber);
          if (currentAyat && currentAyat.audio && currentAyat.audio[qariId]) {
            setPlayerState((prev) => ({
              ...prev,
              audioUrl: currentAyat.audio[qariId]!,
            }));
          }
        }
      }
    }
  }, [playerState, suratList, cachedSurahDetail, updateSettings]);

  // Modal States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Keyboard shortcut for Quick Search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigateToSurah = useCallback((id: number, verse?: number) => {
    const now = Date.now();
    // Guard against rapid duplicate clicks (within 350ms)
    if (now - lastNavTimeRef.current < 350 && isNavigatingRef.current) {
      return;
    }
    lastNavTimeRef.current = now;
    isNavigatingRef.current = true;

    try {
      const url = verse ? `/surat/${id}?ayat=${verse}` : `/surat/${id}`;
      router.push(url);
    } catch {
      // Ignore navigation cancellation
    } finally {
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 500);
    }
  }, [router]);

  const navigateToTab = useCallback((tab: QuranMainTab) => {
    setActiveTab(tab);
    const targetUrl = tab === 'surat' ? '/' : `/?tab=${tab}`;
    
    if (pathname === '/') {
      try {
        if (typeof window !== 'undefined' && window.history) {
          window.history.replaceState(null, '', targetUrl);
        }
      } catch {}
    } else {
      const now = Date.now();
      if (now - lastNavTimeRef.current < 350 && isNavigatingRef.current) {
        return;
      }
      lastNavTimeRef.current = now;
      isNavigatingRef.current = true;

      try {
        router.push(targetUrl);
      } catch {} finally {
        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 500);
      }
    }
  }, [pathname, router]);

  return (
    <QuranContext.Provider
      value={{
        activeTab,
        setActiveTab,
        navigateToTab,
        settings,
        updateSettings,
        bookmarks,
        lastRead,
        saveLastRead,
        toggleBookmark,
        removeBookmark,
        isBookmarked,
        suratList,
        isLoadingSuratList,
        playerState,
        playFullSurah,
        playVerseAudio,
        pauseAudio,
        resumeAudio,
        stopAudio,
        nextVerseAudio,
        prevVerseAudio,
        changeQari,
        isSearchOpen,
        setIsSearchOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        navigateToSurah,
      }}
    >
      {children}
    </QuranContext.Provider>
  );
};

export const useQuran = () => {
  const context = useContext(QuranContext);
  if (!context) {
    throw new Error('useQuran must be used within a QuranProvider');
  }
  return context;
};
