import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAuth } from '@/lib/auth';

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
  const { value, label, sort_order } = body;
  const result = db.prepare(
    'INSERT INTO about_stats (value, label, sort_order) VALUES (?, ?, ?)'
  ).run(value, label, sort_order || 0);
  return NextResponse.json({ id: result.lastInsertRowid });
}

export async function PUT(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const body = await request.json();
  const { id, value, label, sort_order, is_active } = body;
  db.prepare(
    'UPDATE about_stats SET value=?, label=?, sort_order=?, is_active=? WHERE id=?'
  ).run(value, label, sort_order, is_active, id);
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
