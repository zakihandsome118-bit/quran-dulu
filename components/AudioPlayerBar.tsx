'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  X, 
  Music 
} from 'lucide-react';
import { useQuran } from '@/context/QuranContext';
import { ReaderSettings } from '@/types/quran';
import { motion, AnimatePresence } from 'motion/react';

export interface AudioPlayerState {
  isPlaying: boolean;
  surahNumber: number | null;
  surahName: string;
  verseNumber: number | null;
  audioUrl: string;
  totalVerses: number;
}

interface AudioPlayerBarProps {
  playerState?: AudioPlayerState;
  onPause?: () => void;
  onResume?: () => void;
  onStop?: () => void;
  onNextVerse?: () => void;
  onPrevVerse?: () => void;
  settings?: ReaderSettings;
  updateSettings?: (newPartial: Partial<ReaderSettings>) => void;
  onChangeQari?: (qariId: any) => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  playerState: propPlayerState,
  onPause: propOnPause,
  onResume: propOnResume,
  onStop: propOnStop,
  onNextVerse: propOnNextVerse,
  onPrevVerse: propOnPrevVerse,
}) => {
  const context = useQuran();

  const state = propPlayerState || context.playerState;
  const handlePause = propOnPause || context.pauseAudio;
  const handleResume = propOnResume || context.resumeAudio;
  const handleStop = propOnStop || context.stopAudio;
  const handleNext = propOnNextVerse || context.nextVerseAudio;
  const handlePrev = propOnPrevVerse || context.prevVerseAudio;
  const autoPlayNext = context.settings.autoPlayNext;

  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { isPlaying, surahNumber, surahName, verseNumber, audioUrl, totalVerses } = state;

  // Sync native HTML5 Audio element with player state
  useEffect(() => {
    if (!audioRef.current) return;

    if (audioUrl) {
      if (audioRef.current.src !== audioUrl) {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
      }

      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.warn('Audio playback error / browser autoplay:', err);
        });
      } else {
        audioRef.current.pause();
      }
    } else {
      audioRef.current.pause();
    }
  }, [audioUrl, isPlaying]);

  const handleEnded = useCallback(() => {
    if (autoPlayNext && verseNumber && totalVerses && verseNumber < totalVerses) {
      handleNext();
    } else {
      handlePause();
    }
  }, [autoPlayNext, verseNumber, totalVerses, handleNext, handlePause]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      const restore = previousVolume || 1;
      setVolume(restore);
      if (audioRef.current) audioRef.current.volume = restore;
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      if (audioRef.current) audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  if (!audioUrl && !isPlaying && !surahNumber) {
    return null;
  }

  return (
    <>
      {/* Native audio tag */}
      <audio
        ref={audioRef}
        onEnded={handleEnded}
        preload="auto"
      />

      <AnimatePresence>
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="fixed bottom-16 sm:bottom-4 left-0 right-0 z-40 px-3 sm:px-6 pointer-events-none"
        >
          <div className="max-w-4xl mx-auto pointer-events-auto">
            <div className="bg-[#2C1810] text-[#FCF9F0] rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xl border-2 border-[#C59E3F] backdrop-blur-md">
              <div className="flex items-center justify-between gap-3">
                {/* Left: Info */}
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-[#1C0E06] border border-[#C59E3F] flex items-center justify-center text-[#F2D06B] shrink-0 shadow-2xs">
                    <Music className="w-5 h-5 animate-pulse" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-xs sm:text-sm truncate text-[#FFFDF7]">
                        {surahName || (surahNumber ? `Surat Ke-${surahNumber}` : 'Murottal Al-Qur\'an')}
                      </h4>
                      {verseNumber ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#1C0E06] text-[#F7E9C4] border border-[#C59E3F]/40 shrink-0">
                          Ayat {verseNumber}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#1C0E06] text-[#F7E9C4] border border-[#C59E3F]/40 shrink-0">
                          Full Surat
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#F7E9C4]/80 truncate">
                      Murottal Suara Jernih Al-Qur&apos;an
                    </p>
                  </div>
                </div>

                {/* Center: Controls */}
                <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
                  {/* Prev verse */}
                  {verseNumber !== null && verseNumber > 1 && (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      id="audio-prev-verse-btn"
                      onClick={() => handlePrev()}
                      className="p-2 rounded-xl text-[#F7E9C4] hover:bg-[#1C0E06] transition-colors"
                      title="Ayat Sebelumnya"
                    >
                      <SkipBack className="w-4 h-4 text-[#F2D06B]" />
                    </motion.button>
                  )}

                  {/* Play / Pause */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    id="audio-play-pause-btn"
                    onClick={() => {
                      if (isPlaying) handlePause();
                      else handleResume();
                    }}
                    className="w-10 h-10 rounded-xl bg-[#F6F1E3] hover:bg-[#FFFDF7] text-[#2C1810] flex items-center justify-center shadow-md border border-[#C59E3F] transition-transform"
                    title={isPlaying ? 'Jeda' : 'Lanjutkan Putar'}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-current text-[#2C1810]" />
                    ) : (
                      <Play className="w-5 h-5 fill-current text-[#2C1810] ml-0.5" />
                    )}
                  </motion.button>

                  {/* Next verse */}
                  {verseNumber !== null && totalVerses !== null && verseNumber < totalVerses && (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      id="audio-next-verse-btn"
                      onClick={() => handleNext()}
                      className="p-2 rounded-xl text-[#F7E9C4] hover:bg-[#1C0E06] transition-colors"
                      title="Ayat Selanjutnya"
                    >
                      <SkipForward className="w-4 h-4 text-[#F2D06B]" />
                    </motion.button>
                  )}
                </div>

                {/* Right: Volume & Close */}
                <div className="flex items-center space-x-2 shrink-0">
                  {/* Volume Slider (Desktop) */}
                  <div className="hidden md:flex items-center space-x-2 bg-[#1C0E06] px-2.5 py-1.5 rounded-xl border border-[#C59E3F]/30">
                    <button 
                      onClick={toggleMute}
                      className="text-[#F7E9C4] hover:text-[#F2D06B]"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                    <input
                      id="audio-volume-slider"
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 h-1.5 bg-[#C59E3F]/30 rounded-lg appearance-none cursor-pointer accent-[#F2D06B]"
                    />
                  </div>

                  {/* Close Player */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    id="close-audio-bar-btn"
                    onClick={handleStop}
                    className="p-2 rounded-xl text-[#F7E9C4] hover:bg-[#1C0E06] transition-colors"
                    title="Tutup Pemutar"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};
