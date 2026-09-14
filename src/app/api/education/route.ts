import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { autoTranslate } from '@/lib/translate';

export async function GET() {
  const db = getDb();
  const education = db.prepare('SELECT * FROM education WHERE is_active = 1 ORDER BY sort_order').all();
  return NextResponse.json(education);
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const body = await request.json();
  let { degree, degree_id, institution, location, period, gpa, description, description_id, sort_order } = body;

  if (degree && !degree_id) degree_id = await autoTranslate(degree, 'en', 'id');
  if (degree_id && !degree) degree = await autoTranslate(degree_id, 'id', 'en');

  if (description && !description_id) description_id = await autoTranslate(description, 'en', 'id');
  if (description_id && !description) description = await autoTranslate(description_id, 'id', 'en');

  const result = db.prepare(
    `INSERT INTO education (degree, degree_id, institution, location, period, gpa, description, description_id, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    degree || '',
    degree_id || degree || '',
    institution || '',
    location || '',
    period || '',
    gpa || '',
    description || '',
    description_id || description || '',
    sort_order || 0
  );

  return NextResponse.json({ id: result.lastInsertRowid });
}

export async function PUT(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const body = await request.json();
  let { id, degree, degree_id, institution, location, period, gpa, description, description_id, sort_order, is_active } = body;

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
    location || '',
    period || '',
    gpa || '',
    description || '',
    description_id || description || '',
    sort_order || 0,
    is_active ?? 1,
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

  db.prepare('DELETE FROM education WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
