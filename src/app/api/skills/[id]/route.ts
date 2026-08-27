import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const { id } = await params;
  const body = await request.json();
  const { title, description, icon, sort_order, is_active } = body;

  db.prepare(
    'UPDATE skills SET title=?, description=?, icon=?, sort_order=?, is_active=? WHERE id=?'
  ).run(title, description ?? '', icon ?? '', sort_order ?? 0, is_active ?? 1, id);

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

  db.prepare('DELETE FROM skills WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
