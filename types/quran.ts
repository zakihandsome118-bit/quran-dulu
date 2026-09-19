export interface AudioFull {
  '01'?: string; // Abdullah-Al-Juhany
  '02'?: string; // Abdul-Muhsin-Al-Qasim
  '03'?: string; // Abdurrahman-as-Sudais
  '04'?: string; // Ibrahim-Al-Dossari
  '05'?: string; // Misyari-Rasyid-Al-Afasi
  [key: string]: string | undefined;
}

export interface SurahListItem {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: 'Mekah' | 'Madinah' | string;
  arti: string;
  deskripsi?: string;
  audioFull?: AudioFull;
}

export interface AyatItem {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: AudioFull;
}

export interface SurahDetail {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: AudioFull;
  ayat: AyatItem[];
  suratSelanjutnya?: {
    nomor: number;
    nama: string;
    namaLatin: string;
    jumlahAyat: number;
  } | null;
  suratSebelumnya?: {
    nomor: number;
    nama: string;
    namaLatin: string;
    jumlahAyat: number;
  } | null;
}

export interface TafsirAyat {
  ayat: number;
  teks: string;
}

export interface SurahTafsir {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi?: string;
  audioFull?: AudioFull;
  tafsir: TafsirAyat[];
  suratSelanjutnya?: any;
  suratSebelumnya?: any;
}

export interface BookmarkItem {
  id: string; // e.g. "1:1"
  surahNumber: number;
  surahName: string;
  verseNumber: number;
  arabicSnippet: string;
  translationSnippet: string;
  createdAt: number;
  note?: string;
}

export interface LastReadItem {
  surahNumber: number;
  surahName: string;
  verseNumber: number;
  timestamp: number;
}

export interface ReaderSettings {
  arabicFontSize: number; // 24 to 48
  translationFontSize: number; // 13 to 20
  showLatin: boolean;
  showTranslation: boolean;
  theme: 'light' | 'dark' | 'sepia';
  selectedQari: '01' | '02' | '03' | '04' | '05';
  autoScrollToAyat: boolean;
  autoPlayNext: boolean;
}

export type QuranMainTab = 'surat' | 'juz' | 'bookmark' | 'doa';

export interface QariInfo {
  id: '01' | '02' | '03' | '04' | '05';
  name: string;
  country: string;
}
