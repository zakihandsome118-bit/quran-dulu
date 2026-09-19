import { SurahListItem, SurahDetail, SurahTafsir } from '@/types/quran';
import { SURAH_LIST_INITIAL } from './quran-data';

// Fast client-side in-memory cache
const memorySurahListCache: { data: SurahListItem[] | null } = { data: null };
const memorySurahDetailCache = new Map<number, SurahDetail>();
const memorySurahTafsirCache = new Map<number, SurahTafsir>();

export async function fetchSurahList(): Promise<SurahListItem[]> {
  if (memorySurahListCache.data && memorySurahListCache.data.length > 0) {
    return memorySurahListCache.data;
  }

  // Check sessionStorage
  if (typeof window !== 'undefined') {
    try {
      const cached = sessionStorage.getItem('quran_surah_list_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memorySurahListCache.data = parsed;
          return parsed;
        }
      }
    } catch {}
  }

  // Fetch from API
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/quran?action=list', {
        headers: { 'Cache-Control': 'max-age=3600' }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.status && json.result?.surat) {
          const list = json.result.surat;
          memorySurahListCache.data = list;
          try {
            sessionStorage.setItem('quran_surah_list_cache', JSON.stringify(list));
          } catch {}
          return list;
        }
      }
    } catch {
      // Continue to direct fallback
    }
  }

  // Direct fallback to equran.id or local list
  try {
    const res = await fetch('https://equran.id/api/v2/surat');
    const json = await res.json();
    if (json.data) {
      const mapped = json.data.map((s: any) => ({
        nomor: s.nomor,
        nama: s.nama,
        namaLatin: s.namaLatin,
        jumlahAyat: s.jumlahAyat,
        tempatTurun: s.tempatTurun,
        arti: s.arti,
        deskripsi: s.deskripsi,
        audioFull: s.audioFull
      }));
      memorySurahListCache.data = mapped;
      try {
        sessionStorage.setItem('quran_surah_list_cache', JSON.stringify(mapped));
      } catch {}
      return mapped;
    }
  } catch {
    // Return hardcoded 114 surah initial list
  }
  memorySurahListCache.data = SURAH_LIST_INITIAL;
  return SURAH_LIST_INITIAL;
}

export async function fetchSurahDetail(id: number): Promise<SurahDetail> {
  // Check memory cache first
  if (memorySurahDetailCache.has(id)) {
    return memorySurahDetailCache.get(id)!;
  }

  // Check sessionStorage
  if (typeof window !== 'undefined') {
    try {
      const cached = sessionStorage.getItem(`quran_surah_${id}_cache`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.nomor === id && parsed.ayat) {
          memorySurahDetailCache.set(id, parsed);
          return parsed;
        }
      }
    } catch {}
  }

  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/quran?action=detail&id=${id}`, {
        headers: { 'Cache-Control': 'max-age=3600' }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.status && json.result) {
          const detail = json.result;
          memorySurahDetailCache.set(id, detail);
          try {
            sessionStorage.setItem(`quran_surah_${id}_cache`, JSON.stringify(detail));
          } catch {}
          return detail;
        }
      }
    } catch {
      // Continue to direct fallback
    }
  }

  // Direct fallback
  const res = await fetch(`https://equran.id/api/v2/surat/${id}`);
  const json = await res.json();
  if (json.data) {
    memorySurahDetailCache.set(id, json.data);
    try {
      sessionStorage.setItem(`quran_surah_${id}_cache`, JSON.stringify(json.data));
    } catch {}
    return json.data;
  }
  throw new Error('Surah detail not found');
}

export async function fetchSurahTafsir(id: number): Promise<SurahTafsir> {
  if (memorySurahTafsirCache.has(id)) {
    return memorySurahTafsirCache.get(id)!;
  }

  if (typeof window !== 'undefined') {
    try {
      const cached = sessionStorage.getItem(`quran_tafsir_${id}_cache`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.nomor === id) {
          memorySurahTafsirCache.set(id, parsed);
          return parsed;
        }
      }
    } catch {}
  }

  if (typeof window !== 'undefined') {
    try {
      const res = await fetch(`/api/quran?action=tafsir&id=${id}`, {
        headers: { 'Cache-Control': 'max-age=3600' }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.status && json.result) {
          const tafsir = json.result;
          memorySurahTafsirCache.set(id, tafsir);
          try {
            sessionStorage.setItem(`quran_tafsir_${id}_cache`, JSON.stringify(tafsir));
          } catch {}
          return tafsir;
        }
      }
    } catch {
      // Continue to direct fallback
    }
  }

  // Direct fallback
  const res = await fetch(`https://equran.id/api/v2/tafsir/${id}`);
  const json = await res.json();
  if (json.data) {
    memorySurahTafsirCache.set(id, json.data);
    try {
      sessionStorage.setItem(`quran_tafsir_${id}_cache`, JSON.stringify(json.data));
    } catch {}
    return json.data;
  }
  throw new Error('Tafsir not found');
}

