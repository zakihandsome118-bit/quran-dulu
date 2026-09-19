import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

const headers = {
  'Content-Type': 'application/json',
  'Prefers-Color-Scheme': 'dark',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
};

// In-memory cache for fast metadata responses
const metadataCache: Record<number, { data: any; timestamp: number }> = {};
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export async function GET(req: NextRequest) {
  return handleMetadata(req);
}

export async function POST(req: NextRequest) {
  return handleMetadata(req);
}

async function handleMetadata(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let surahParam = searchParams.get('surah') || searchParams.get('id');

  if (!surahParam && req.method === 'POST') {
    try {
      const body = await req.json();
      surahParam = body.surah || body.id;
    } catch {
      // ignore
    }
  }

  const surah = parseInt(surahParam || '1', 10);

  if (!surah || isNaN(surah) || surah < 1 || surah > 114) {
    return NextResponse.json(
      {
        creator: 'Yahya',
        status: false,
        message: 'Parameter surah tidak valid (1-114)',
      },
      { status: 400 }
    );
  }

  const now = Date.now();
  if (metadataCache[surah] && now - metadataCache[surah].timestamp < CACHE_TTL) {
    return NextResponse.json(metadataCache[surah].data);
  }

  try {
    // Fetch from equran v2 API
    const response = await axios.get(`https://equran.id/api/v2/surat/${surah}`, {
      headers,
      timeout: 10000,
    });

    const s = response.data?.data || response.data;

    const result = {
      nomor: s.nomor,
      nama: s.nama,
      nama_latin: s.namaLatin || s.nama_latin,
      jumlah_ayat: s.jumlahAyat || s.jumlah_ayat,
      tempat_turun: s.tempatTurun || s.tempat_turun,
      arti: s.arti,
      deskripsi: s.deskripsi,
    };

    const responsePayload = {
      creator: 'Yahya',
      status: true,
      result,
    };

    metadataCache[surah] = {
      data: responsePayload,
      timestamp: now,
    };

    return NextResponse.json(responsePayload);
  } catch (err: any) {
    // Fallback attempt to v1 if v2 fails
    try {
      const fallbackResponse = await axios.get(`https://equran.id/api/surat/${surah}`, {
        headers,
        timeout: 10000,
      });
      const s = fallbackResponse.data;
      const result = {
        nomor: s.nomor,
        nama: s.nama,
        nama_latin: s.nama_latin || s.namaLatin,
        jumlah_ayat: s.jumlah_ayat || s.jumlahAyat,
        tempat_turun: s.tempat_turun || s.tempatTurun,
        arti: s.arti,
        deskripsi: s.deskripsi,
      };

      const responsePayload = {
        creator: 'Yahya',
        status: true,
        result,
      };

      metadataCache[surah] = {
        data: responsePayload,
        timestamp: now,
      };

      return NextResponse.json(responsePayload);
    } catch (fallbackErr: any) {
      return NextResponse.json(
        {
          creator: 'Yahya',
          status: false,
          message: err?.message || 'Gagal mengambil metadata surat',
        },
        { status: 500 }
      );
    }
  }
}
