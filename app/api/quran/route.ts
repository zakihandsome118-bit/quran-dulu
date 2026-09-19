import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

const BASE = 'https://equran.id/api/v2';

const headers = {
  'Content-Type': 'application/json',
  'Prefers-Color-Scheme': 'dark',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
};

// In-memory cache for fast responses
const memoryCache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200',
};

async function fetchWithCache(url: string) {
  const now = Date.now();
  if (memoryCache[url] && (now - memoryCache[url].timestamp < CACHE_TTL)) {
    return memoryCache[url].data;
  }
  const response = await axios.get(url, { headers, timeout: 10000 });
  memoryCache[url] = {
    data: response.data,
    timestamp: now
  };
  return response.data;
}

export async function GET(req: NextRequest) {
  return handleRequest(req);
}

export async function POST(req: NextRequest) {
  return handleRequest(req);
}

async function handleRequest(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let action = searchParams.get('action');
    let idStr = searchParams.get('id');

    if (!action && req.method === 'POST') {
      try {
        const body = await req.json();
        action = body.action;
        idStr = body.id;
      } catch {
        // ignore body parse error
      }
    }

    action = String(action || 'list').toLowerCase();
    const id = parseInt(idStr || '1', 10);

    // 1. LIST SURAT
    if (action === 'list') {
      const data = await fetchWithCache(`${BASE}/surat`);
      const suratList = data.data || [];

      const surat = suratList.map((s: any) => ({
        nomor: s.nomor,
        nama: s.nama,
        namaLatin: s.namaLatin,
        jumlahAyat: s.jumlahAyat,
        tempatTurun: s.tempatTurun,
        arti: s.arti,
        deskripsi: s.deskripsi,
        audioFull: s.audioFull
      }));

      return NextResponse.json({
        creator: 'Yahya',
        status: true,
        result: {
          total: surat.length,
          surat
        }
      }, { headers: CACHE_HEADERS });
    }

    // 2. DETAIL SURAT
    if (action === 'detail') {
      if (!id || id < 1 || id > 114) {
        return NextResponse.json(
          { creator: 'Yahya', status: false, message: 'Parameter id tidak valid (1-114)' },
          { status: 400 }
        );
      }

      const data = await fetchWithCache(`${BASE}/surat/${id}`);
      const s = data.data;

      return NextResponse.json({
        creator: 'Yahya',
        status: true,
        result: {
          nomor: s.nomor,
          nama: s.nama,
          namaLatin: s.namaLatin,
          jumlahAyat: s.jumlahAyat,
          tempatTurun: s.tempatTurun,
          arti: s.arti,
          deskripsi: s.deskripsi,
          audioFull: s.audioFull,
          ayat: s.ayat || [],
          suratSelanjutnya: s.suratSelanjutnya || null,
          suratSebelumnya: s.suratSebelumnya || null
        }
      }, { headers: CACHE_HEADERS });
    }

    // 3. TAFSIR SURAT
    if (action === 'tafsir') {
      if (!id || id < 1 || id > 114) {
        return NextResponse.json(
          { creator: 'Yahya', status: false, message: 'Parameter id tidak valid (1-114)' },
          { status: 400 }
        );
      }

      const data = await fetchWithCache(`${BASE}/tafsir/${id}`);
      const t = data.data;

      return NextResponse.json({
        creator: 'Yahya',
        status: true,
        result: {
          nomor: t.nomor,
          nama: t.nama,
          namaLatin: t.namaLatin,
          jumlahAyat: t.jumlahAyat,
          tempatTurun: t.tempatTurun,
          arti: t.arti,
          audioFull: t.audioFull,
          deskripsi: t.deskripsi,
          tafsir: (t.tafsir || []).map((item: any) => ({
            ayat: item.ayat,
            teks: item.teks
          })),
          suratSelanjutnya: t.suratSelanjutnya || null,
          suratSebelumnya: t.suratSebelumnya || null
        }
      }, { headers: CACHE_HEADERS });
    }

    // 4. METADATA SURAT (EQuran.id)
    if (action === 'metadata') {
      const surahNum = parseInt(searchParams.get('surah') || idStr || '1', 10);
      if (!surahNum || surahNum < 1 || surahNum > 114) {
        return NextResponse.json(
          { creator: 'Yahya', status: false, message: 'Parameter surah tidak valid (1-114)' },
          { status: 400 }
        );
      }

      const data = await fetchWithCache(`${BASE}/surat/${surahNum}`);
      const s = data.data || data;

      return NextResponse.json({
        creator: 'Yahya',
        status: true,
        result: {
          nomor: s.nomor,
          nama: s.nama,
          nama_latin: s.namaLatin || s.nama_latin,
          jumlah_ayat: s.jumlahAyat || s.jumlah_ayat,
          tempat_turun: s.tempatTurun || s.tempat_turun,
          arti: s.arti,
          deskripsi: s.deskripsi
        }
      }, { headers: CACHE_HEADERS });
    }

    return NextResponse.json(
      { creator: 'Yahya', status: false, message: 'Action tidak valid. Gunakan: list, detail, tafsir, metadata' },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { creator: 'Yahya', status: false, message: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
