import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAuth } from '@/lib/auth';

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
  const { step_number, title, description, sort_order, is_active } = body;

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const result = db.prepare(
    `INSERT INTO approaches (step_number, title, description, sort_order, is_active)
     VALUES (?, ?, ?, ?, ?)`
  ).run(
    step_number || '',
    title,
    description || '',
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
  const { id, step_number, title, description, sort_order, is_active } = body;

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  db.prepare(
    `UPDATE approaches
     SET step_number=?, title=?, description=?, sort_order=?, is_active=?, updated_at=CURRENT_TIMESTAMP
     WHERE id=?`
  ).run(
    step_number ?? '',
    title,
    description ?? '',
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
