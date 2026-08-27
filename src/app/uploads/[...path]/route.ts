import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import path from 'path';

// Serves uploaded images directly from disk. Needed because Next.js only
// snapshots public/ at boot: files uploaded while the server is running
// would otherwise 404 until the next restart.

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

const MIME: Record<string, string> = {
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;

  if (!segments || segments.length === 0) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Only allow flat filenames with whitelisted image extensions
  const filename = segments.join('/');
  const ext = path.extname(filename).toLowerCase();
  if (segments.length !== 1 || !MIME[ext] || filename.includes('..') || filename.startsWith('.')) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const filePath = path.join(UPLOAD_DIR, filename);

  // Defense in depth: resolved path must stay inside UPLOAD_DIR
  if (!filePath.startsWith(UPLOAD_DIR + path.sep)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const info = await stat(filePath);
    if (!info.isFile()) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const data = await readFile(filePath);

    return new Response(new Uint8Array(data), {
      status: 200,
      headers: {
        'Content-Type': MIME[ext],
        'Content-Length': String(info.size),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
