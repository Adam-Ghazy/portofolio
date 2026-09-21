import { NextRequest } from 'next/server';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { Readable } from 'stream';
import path from 'path';

// Serves uploaded media directly from disk. Needed because Next.js only
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
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.mkv': 'video/x-matroska',
};

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;

  if (!segments || segments.length === 0) {
    return new Response(null, { status: 404 });
  }

  // Only allow flat filenames with whitelisted media extensions
  const filename = segments.join('/');
  const ext = path.extname(filename).toLowerCase();
  if (segments.length !== 1 || !MIME[ext] || filename.includes('..') || filename.startsWith('.')) {
    return new Response(null, { status: 404 });
  }

  const filePath = path.join(UPLOAD_DIR, filename);

  // Defense in depth: resolved path must stay inside UPLOAD_DIR
  if (!filePath.startsWith(UPLOAD_DIR + path.sep)) {
    return new Response(null, { status: 404 });
  }

  let info;
  try {
    info = await stat(filePath);
    if (!info.isFile()) {
      return new Response(null, { status: 404 });
    }
  } catch {
    return new Response(null, { status: 404 });
  }

  const fileSize = info.size;
  const contentType = MIME[ext];
  const range = request.headers.get('range');

  // Range support (required for video seeking / progressive playback)
  if (range) {
    const match = range.match(/bytes=(\d*)-(\d*)/);
    if (match) {
      const start = match[1] ? parseInt(match[1], 10) : 0;
      const end = match[2] ? Math.min(parseInt(match[2], 10), fileSize - 1) : fileSize - 1;

      if (start >= fileSize || start > end) {
        return new Response(null, {
          status: 416,
          headers: { 'Content-Range': `bytes */${fileSize}` },
        });
      }

      const stream = createReadStream(filePath, { start, end });
      return new Response(Readable.toWeb(stream) as ReadableStream, {
        status: 206,
        headers: {
          'Content-Type': contentType,
          'Content-Length': String(end - start + 1),
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=31536000, immutable',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }
  }

  const stream = createReadStream(filePath);
  return new Response(Readable.toWeb(stream) as ReadableStream, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Length': String(fileSize),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
