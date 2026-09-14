import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { autoTranslate } from '@/lib/translate';

export async function GET() {
  const db = getDb();
  const items = db.prepare('SELECT * FROM skills WHERE is_active = 1 ORDER BY sort_order').all();
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const body = await request.json();
  let { title, description, description_id, icon, sort_order } = body;

  if (description && !description_id) description_id = await autoTranslate(description, 'en', 'id');
  if (description_id && !description) description = await autoTranslate(description_id, 'id', 'en');

  const result = db.prepare(
    'INSERT INTO skills (title, description, description_id, icon, sort_order) VALUES (?, ?, ?, ?, ?)'
  ).run(title || '', description || '', description_id || description || '', icon || '', sort_order || 0);
  return NextResponse.json({ id: result.lastInsertRowid });
}

export async function PUT(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const body = await request.json();
  let { id, title, description, description_id, icon, sort_order, is_active } = body;

  if (description && !description_id) description_id = await autoTranslate(description, 'en', 'id');
  if (description_id && !description) description = await autoTranslate(description_id, 'id', 'en');

  db.prepare(
    'UPDATE skills SET title=?, description=?, description_id=?, icon=?, sort_order=?, is_active=? WHERE id=?'
  ).run(title || '', description || '', description_id || description || '', icon || '', sort_order, is_active, id);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  db.prepare('DELETE FROM skills WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
