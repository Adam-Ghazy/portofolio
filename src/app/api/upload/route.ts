import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { requireAuth } from '@/lib/auth';
import sharp from 'sharp';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB (gambar)
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB (video)

const VIDEO_EXT: Record<string, string> = {
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'video/quicktime': '.mov',
  'video/x-matroska': '.mkv',
};

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

    if (!ALLOWED_TYPES.includes(file.type) && !isVideo) {
      return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, WEBP, GIF, SVG, MP4, WEBM, MOV allowed.' }, { status: 400 });
    }

    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_FILE_SIZE;
    if (file.size > maxSize) {
      return NextResponse.json({ error: `File too large. Maximum ${isVideo ? '50MB for video' : '5MB for image'}.` }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(bytes));

    let finalBuffer: any = buffer;
    let finalExt = '.webp';

    // SVG, GIF, dan video disimpan apa adanya agar tidak rusak/hilang animasinya.
    // Gambar lain otomatis dikonversi ke WebP.
    if (isVideo) {
      finalExt = VIDEO_EXT[file.type];
    } else if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
      finalExt = file.type === 'image/svg+xml' ? '.svg' : '.gif';
    } else {
      finalBuffer = await sharp(buffer)
        .webp({ quality: 80, effort: 4 })
        .toBuffer();
    }

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${finalExt}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), finalBuffer);

    return NextResponse.json({ url: `/uploads/${filename}`, media_type: isVideo ? 'video' : 'image' });
  } catch (e: any) {
    console.error('Upload error:', e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
