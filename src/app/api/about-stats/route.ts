import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { autoTranslate } from '@/lib/translate';

export async function GET() {
  const db = getDb();
  const items = db.prepare('SELECT * FROM about_stats WHERE is_active = 1 ORDER BY sort_order').all();
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const body = await request.json();
  let { value, label, label_id, sort_order } = body;

  if (label && !label_id) label_id = await autoTranslate(label, 'en', 'id');
  if (label_id && !label) label = await autoTranslate(label_id, 'id', 'en');

  const result = db.prepare(
    'INSERT INTO about_stats (value, label, label_id, sort_order) VALUES (?, ?, ?, ?)'
  ).run(value, label || '', label_id || label || '', sort_order || 0);

  return NextResponse.json({ id: result.lastInsertRowid });
}

export async function PUT(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const body = await request.json();
  let { id, value, label, label_id, sort_order, is_active } = body;

  if (label && !label_id) label_id = await autoTranslate(label, 'en', 'id');
  if (label_id && !label) label = await autoTranslate(label_id, 'id', 'en');

  db.prepare(
    'UPDATE about_stats SET value=?, label=?, label_id=?, sort_order=?, is_active=? WHERE id=?'
  ).run(value, label || '', label_id || label || '', sort_order, is_active, id);

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  db.prepare('DELETE FROM about_stats WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
