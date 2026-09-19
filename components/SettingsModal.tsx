'use client';

import React from 'react';
import { X, Sliders, Check } from 'lucide-react';
import { ReaderSettings } from '@/types/quran';
import { QARI_LIST } from '@/lib/quran-data';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReaderSettings;
  updateSettings: (newPartial: Partial<ReaderSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  updateSettings,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#1A0E06]/65 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative z-10 bg-[#FCF9F0] rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-[#D6C28F] space-y-6 max-h-[90vh] overflow-y-auto text-[#2C1810]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E5DBC5]">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-[#2C1810] text-[#F7E9C4] border border-[#C59E3F]">
                  <Sliders className="w-5 h-5 text-[#F2D06B]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#2C1810]">
                    Pengaturan Bacaan
                  </h3>
                  <p className="text-xs text-[#706553]">
                    Sesuaikan ukuran huruf Arab, terjemahan, dan qari murottal
                  </p>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                id="close-settings-modal-btn"
                onClick={onClose}
                className="p-2 rounded-xl text-[#706553] hover:text-[#2C1810] hover:bg-[#EFE8D3] transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* 1. Arabic Font Size */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#2C1810] uppercase tracking-wider">
                  Ukuran Huruf Arab
                </label>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#2C1810] text-[#F7E9C4] border border-[#C59E3F]/50">
                  {settings.arabicFontSize}px
                </span>
              </div>

              <input
                id="arabic-font-size-slider"
                type="range"
                min={24}
                max={48}
                step={2}
                value={settings.arabicFontSize}
                onChange={(e) => updateSettings({ arabicFontSize: parseInt(e.target.value, 10) })}
                className="w-full h-2 bg-[#E5DBC5] rounded-lg appearance-none cursor-pointer accent-[#8F6E1C]"
              />

              {/* Arabic Preview */}
              <div className="p-3.5 bg-[#F6F1E3] rounded-2xl text-right border border-[#D6C28F] shadow-xs">
                <p className="font-arabic font-bold text-[#181512]" style={{ fontSize: `${settings.arabicFontSize}px` }} dir="rtl">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              </div>
            </div>

            {/* 2. Translation Font Size */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#2C1810] uppercase tracking-wider">
                  Ukuran Huruf Terjemahan
                </label>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#2C1810] text-[#F7E9C4] border border-[#C59E3F]/50">
                  {settings.translationFontSize}px
                </span>
              </div>

              <input
                id="translation-font-size-slider"
                type="range"
                min={13}
                max={20}
                step={1}
                value={settings.translationFontSize}
                onChange={(e) => updateSettings({ translationFontSize: parseInt(e.target.value, 10) })}
                className="w-full h-2 bg-[#E5DBC5] rounded-lg appearance-none cursor-pointer accent-[#8F6E1C]"
              />

              {/* Translation Preview */}
              <div className="p-3 bg-[#F6F1E3] rounded-2xl border border-[#D6C28F]">
                <p className="text-[#3E3832] leading-relaxed" style={{ fontSize: `${settings.translationFontSize}px` }}>
                  Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.
                </p>
              </div>
            </div>

            {/* 3. Display Toggles */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold text-[#2C1810] uppercase tracking-wider">
                Opsi Teks Bacaan
              </label>

              <div className="space-y-2">
                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F6F1E3] border border-[#D6C28F] cursor-pointer hover:border-[#C59E3F] transition-colors">
                  <div>
                    <span className="text-xs font-bold text-[#2C1810] block">
                      Tampilkan Teks Latin (Transliterasi)
                    </span>
                    <span className="text-[11px] text-[#706553]">
                      Membantu membaca pelafalan huruf hijaiyah
                    </span>
                  </div>
                  <input
                    id="toggle-latin-checkbox"
                    type="checkbox"
                    checked={settings.showLatin}
                    onChange={(e) => updateSettings({ showLatin: e.target.checked })}
                    className="w-4 h-4 rounded text-[#8F6E1C] accent-[#8F6E1C] focus:ring-[#8F6E1C]"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F6F1E3] border border-[#D6C28F] cursor-pointer hover:border-[#C59E3F] transition-colors">
                  <div>
                    <span className="text-xs font-bold text-[#2C1810] block">
                      Tampilkan Terjemahan Bahasa Indonesia
                    </span>
                    <span className="text-[11px] text-[#706553]">
                      Terjemahan resmi Kementerian Agama RI
                    </span>
                  </div>
                  <input
                    id="toggle-translation-checkbox"
                    type="checkbox"
                    checked={settings.showTranslation}
                    onChange={(e) => updateSettings({ showTranslation: e.target.checked })}
                    className="w-4 h-4 rounded text-[#8F6E1C] accent-[#8F6E1C] focus:ring-[#8F6E1C]"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F6F1E3] border border-[#D6C28F] cursor-pointer hover:border-[#C59E3F] transition-colors">
                  <div>
                    <span className="text-xs font-bold text-[#2C1810] block">
                      Otomatis Putar Ayat Berikutnya
                    </span>
                    <span className="text-[11px] text-[#706553]">
                      Melanjutkan audio ke ayat selanjutnya secara otomatis
                    </span>
                  </div>
                  <input
                    id="toggle-auto-next-checkbox"
                    type="checkbox"
                    checked={settings.autoPlayNext}
                    onChange={(e) => updateSettings({ autoPlayNext: e.target.checked })}
                    className="w-4 h-4 rounded text-[#8F6E1C] accent-[#8F6E1C] focus:ring-[#8F6E1C]"
                  />
                </label>
              </div>
            </div>

            {/* 4. Qari Selection */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold text-[#2C1810] uppercase tracking-wider">
                Pilihan Qari Utama (Audio Murottal)
              </label>
              <div className="space-y-2">
                {QARI_LIST.map((q) => (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    key={q.id}
                    onClick={() => updateSettings({ selectedQari: q.id })}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                      settings.selectedQari === q.id
                        ? 'border-[#C59E3F] bg-[#2C1810] text-[#FCF9F0] shadow-xs'
                        : 'border-[#E5DBC5] bg-[#F6F1E3] hover:border-[#C59E3F] text-[#2C1810]'
                    }`}
                  >
                    <div>
                      <div className={`text-xs font-bold ${settings.selectedQari === q.id ? 'text-[#F7E9C4]' : 'text-[#2C1810]'}`}>
                        {q.name}
                      </div>
                      <div className={`text-[11px] ${settings.selectedQari === q.id ? 'text-[#F7E9C4]/80' : 'text-[#706553]'}`}>
                        {q.country}
                      </div>
                    </div>

                    {settings.selectedQari === q.id && (
                      <div className="w-6 h-6 rounded-full bg-[#C59E3F] text-[#2C1810] flex items-center justify-center font-bold">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl bg-[#2C1810] hover:bg-[#1C0E06] text-[#F7E9C4] font-bold text-sm shadow-md transition-all border border-[#C59E3F]"
              >
                Selesai & Simpan
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
