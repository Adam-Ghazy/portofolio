import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { autoTranslate } from '@/lib/translate';

export async function GET() {
  const db = getDb();
  const approaches = db.prepare('SELECT * FROM approaches WHERE is_active = 1 ORDER BY sort_order ASC, id ASC').all();
  return NextResponse.json(approaches);
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const body = await request.json();
  let { step_number, title, title_id, description, description_id, sort_order, is_active } = body;

  if (!title && !title_id) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  if (title && !title_id) title_id = await autoTranslate(title, 'en', 'id');
  if (title_id && !title) title = await autoTranslate(title_id, 'id', 'en');

  if (description && !description_id) description_id = await autoTranslate(description, 'en', 'id');
  if (description_id && !description) description = await autoTranslate(description_id, 'id', 'en');

  const result = db.prepare(
    `INSERT INTO approaches (step_number, title, title_id, description, description_id, sort_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(
    step_number || '',
    title || '',
    title_id || title || '',
    description || '',
    description_id || description || '',
    Number(sort_order) || 0,
    is_active !== undefined ? is_active : 1
  );

  return NextResponse.json({ id: result.lastInsertRowid });
}

export async function PUT(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const body = await request.json();
  let { id, step_number, title, title_id, description, description_id, sort_order, is_active } = body;

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  if (title && !title_id) title_id = await autoTranslate(title, 'en', 'id');
  if (title_id && !title) title = await autoTranslate(title_id, 'id', 'en');

  if (description && !description_id) description_id = await autoTranslate(description, 'en', 'id');
  if (description_id && !description) description = await autoTranslate(description_id, 'id', 'en');

  db.prepare(
    `UPDATE approaches
     SET step_number=?, title=?, title_id=?, description=?, description_id=?, sort_order=?, is_active=?, updated_at=CURRENT_TIMESTAMP
     WHERE id=?`
  ).run(
    step_number ?? '',
    title || '',
    title_id || title || '',
    description ?? '',
    description_id ?? description ?? '',
    Number(sort_order) || 0,
    is_active !== undefined ? is_active : 1,
    id
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  db.prepare('DELETE FROM approaches WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
