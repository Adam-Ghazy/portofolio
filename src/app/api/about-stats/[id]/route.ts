import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { autoTranslate } from '@/lib/translate';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const { id } = await params;
  const body = await request.json();
  let { value, label, label_id, sort_order, is_active } = body;

  if (label && !label_id) label_id = await autoTranslate(label, 'en', 'id');
  if (label_id && !label) label = await autoTranslate(label_id, 'id', 'en');

  db.prepare(
    'UPDATE about_stats SET value=?, label=?, label_id=?, sort_order=?, is_active=? WHERE id=?'
  ).run(value, label || '', label_id || label || '', sort_order ?? 0, is_active ?? 1, id);

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const { id } = await params;

  db.prepare('DELETE FROM about_stats WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
