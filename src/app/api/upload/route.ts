import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { requireAuth } from '@/lib/auth';
import sharp from 'sharp';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, WEBP, GIF, SVG allowed.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum 5MB.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(bytes));
    
    let finalBuffer: any = buffer;
    let finalExt = '.webp';

    // SVG dan GIF dibiarkan agar tidak rusak/hilang animasinya. Sisanya dikonversi ke WebP.
    if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
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
    
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (e: any) {
    console.error('Upload error:', e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
