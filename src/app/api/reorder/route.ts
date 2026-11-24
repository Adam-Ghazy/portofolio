import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAuth } from '@/lib/auth';

/** Tables whose display order the admin may rearrange via this endpoint. */
const TABLES: Record<string, string> = {
  projects: 'projects',
  experiences: 'experiences',
  education: 'education',
  certifications: 'certifications',
  about_stats: 'about_stats',
  skills: 'skills',
};

export async function PUT(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const body = await request.json();
  const table = TABLES[body?.table];
  const items = body?.items;
  if (!table) return NextResponse.json({ error: 'Unknown table' }, { status: 400 });
  if (
    !Array.isArray(items) ||
    items.length === 0 ||
    items.some((item) => typeof item?.id !== 'number' || typeof item?.sort_order !== 'number')
  ) {
    return NextResponse.json({ error: 'items with numeric id and sort_order required' }, { status: 400 });
  }

  const update = db.prepare(`UPDATE ${table} SET sort_order = ? WHERE id = ?`);
  const rows: { id: number; sort_order: number }[] = items;
  const tx = db.transaction((list: { id: number; sort_order: number }[]) => {
    for (const row of list) update.run(row.sort_order, row.id);
  });
  tx(rows);

  return NextResponse.json({ success: true });
}
