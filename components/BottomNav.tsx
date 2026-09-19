'use client';

import React from 'react';
import { BookOpen, Layers, Bookmark, HeartHandshake } from 'lucide-react';
import { useQuran } from '@/context/QuranContext';
import { motion } from 'motion/react';
import { QuranMainTab } from '@/types/quran';

export const BottomNav: React.FC = () => {
  const { activeTab, navigateToTab, bookmarks } = useQuran();

  const tabs: { id: QuranMainTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'surat', label: '114 Surat', icon: BookOpen },
    { id: 'juz', label: '30 Juz', icon: Layers },
    { id: 'bookmark', label: 'Tersimpan', icon: Bookmark, badge: bookmarks.length },
    { id: 'doa', label: 'Doa Quran', icon: HeartHandshake },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#FCF9F0]/95 backdrop-blur-md border-t-2 border-[#D6C28F] px-3 py-1.5 shadow-lg">
      <div className="max-w-xl mx-auto flex items-center justify-around sm:justify-center sm:space-x-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;

          return (
            <motion.button
              whileTap={{ scale: 0.92 }}
              key={tab.id}
              id={`bottom-nav-${tab.id}-btn`}
              onClick={() => navigateToTab(tab.id)}
              className={`relative flex flex-col sm:flex-row items-center justify-center py-1 sm:py-1.5 px-3 sm:px-4 rounded-xl transition-all ${
                isSelected 
                  ? 'text-[#8F6E1C] sm:bg-[#EFE8D3] sm:border sm:border-[#D6C28F]' 
                  : 'text-[#706553] hover:text-[#2C1810] hover:bg-[#F6F1E3]'
              }`}
            >
              <div className="relative flex items-center">
                <Icon className={`w-5 h-5 sm:w-4 sm:h-4 ${isSelected ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 sm:-top-2 sm:-right-3 min-w-4 h-4 px-1 rounded-full bg-[#2C1810] text-[#F7E9C4] text-[9px] font-bold flex items-center justify-center border border-[#C59E3F]">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] sm:text-xs mt-0.5 sm:mt-0 sm:ml-2 ${isSelected ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>

              {isSelected && (
                <div
                  className="sm:hidden absolute bottom-0 w-8 h-1 bg-[#2C1810] rounded-full transition-all duration-150"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
