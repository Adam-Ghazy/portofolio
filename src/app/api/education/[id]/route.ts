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
  let {
    degree,
    degree_id,
    institution,
    location,
    period,
    gpa,
    description,
    description_id,
    sort_order,
    is_active,
  } = body;

  if (degree && !degree_id) degree_id = await autoTranslate(degree, 'en', 'id');
  if (degree_id && !degree) degree = await autoTranslate(degree_id, 'id', 'en');

  if (description && !description_id) description_id = await autoTranslate(description, 'en', 'id');
  if (description_id && !description) description = await autoTranslate(description_id, 'id', 'en');

  db.prepare(
    `UPDATE education
     SET degree=?, degree_id=?, institution=?, location=?, period=?, gpa=?, description=?, description_id=?, sort_order=?, is_active=?
     WHERE id=?`
  ).run(
    degree || '',
    degree_id || degree || '',
    institution || '',
    location ?? '',
    period ?? '',
    gpa ?? '',
    description ?? '',
    description_id ?? description ?? '',
    sort_order ?? 0,
    is_active ?? 1,
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

  db.prepare('DELETE FROM education WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
