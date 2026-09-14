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
  let { step_number, title, title_id, description, description_id, sort_order, is_active } = body;

  if (!title && !title_id) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const { id } = await params;

  db.prepare('DELETE FROM approaches WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
