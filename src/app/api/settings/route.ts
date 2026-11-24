import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const db = getDb();
  const settings = db.prepare('SELECT * FROM settings').all();
  const map: Record<string, string> = {};
  (settings as any[]).forEach(s => { map[s.key] = s.value; });
  return NextResponse.json(map, {
    headers: {
      'Cache-Control': request.cookies.has('admin_token') || request.headers.has('authorization')
        ? 'private, no-store'
        : 'public, s-maxage=300, stale-while-revalidate=600',
      Vary: 'Cookie, Authorization',
    },
  });
}

export async function PUT(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const body = await request.json();
  const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)');
  const tx = db.transaction((entries: [string, string][]) => {
    entries.forEach(([k, v]) => stmt.run(k, v));
  });
  tx(Object.entries(body));
  return NextResponse.json({ success: true });
}
