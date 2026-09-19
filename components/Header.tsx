'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BookOpen, 
  Search, 
  Settings
} from 'lucide-react';
import { useQuran } from '@/context/QuranContext';
import { motion } from 'motion/react';

export const Header: React.FC = () => {
  const [logoError, setLogoError] = useState(false);
  const { 
    setIsSearchOpen, 
    setIsSettingsOpen, 
    navigateToTab 
  } = useQuran();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FCF9F0]/95 border-b-2 border-[#D6C28F] shadow-xs transition-colors">
      {/* Top subtle gold decorative line */}
      <div className="h-1 bg-gradient-to-r from-[#2C1810] via-[#C59E3F] to-[#2C1810]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link 
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateToTab('surat');
            }}
            id="brand-logo-btn"
            className="flex items-center space-x-3 group select-none shrink-0"
          >
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-2xl bg-[#2C1810] border-2 border-[#C59E3F] overflow-hidden flex items-center justify-center text-[#F7E9C4] shadow-md group-hover:border-[#E5C158] transition-all relative"
            >
              {!logoError ? (
                <Image
                  src="/logo.webp"
                  alt="Logo Qur'an Dulu"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  onError={() => setLogoError(true)}
                  priority
                  unoptimized
                />
              ) : (
                <BookOpen className="w-5 h-5 text-[#F2D06B]" />
              )}
            </motion.div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-[#2C1810]">
                  Qur&apos;an <span className="text-[#8F6E1C]">Dulu</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFE8D3] text-[#2C1810] border border-[#D6C28F]">
                  Mushaf Digital
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#706553] leading-tight hidden sm:block">
                Baca Quran, Tafsir & Murottal
              </p>
            </div>
          </Link>

          {/* Action Tools (Right) */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Search Trigger */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              id="global-search-trigger-btn"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#F6F1E3] hover:bg-[#EFE8D3] text-[#706553] hover:text-[#2C1810] text-sm transition-colors border border-[#D6C28F] shadow-2xs"
              title="Cari Surat atau Ayat (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-[#8F6E1C]" />
              <span className="hidden sm:inline text-xs font-medium">
                Cari...
              </span>
              <kbd className="hidden lg:inline-block text-[10px] bg-[#FCF9F0] text-[#706553] px-1.5 py-0.5 rounded border border-[#D6C28F] font-mono">
                ⌘K
              </kbd>
            </motion.button>

            {/* Settings Trigger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              id="settings-modal-trigger-btn"
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-[#2C1810] bg-[#F6F1E3] hover:bg-[#EFE8D3] border border-[#D6C28F] shadow-2xs transition-colors text-xs font-semibold"
              title="Pengaturan Tampilan Huruf & Qari"
            >
              <Settings className="w-4 h-4 text-[#8F6E1C]" />
              <span className="hidden sm:inline">Pengaturan</span>
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
};
