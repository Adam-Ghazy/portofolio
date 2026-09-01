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
  const {
    company,
    position,
    program,
    location,
    period,
    description,
    systems,
    technologies,
    collaboration,
    sort_order,
    is_active,
  } = body;

  db.prepare(
    `UPDATE experiences
     SET company=?, position=?, program=?, location=?, period=?, description=?, systems=?, technologies=?, collaboration=?, sort_order=?, is_active=?, updated_at=CURRENT_TIMESTAMP
     WHERE id=?`
  ).run(
    company,
    position,
    program ?? '',
    location ?? '',
    period ?? '',
    description ?? '',
    typeof systems === 'string' ? systems : JSON.stringify(systems || []),
    technologies ?? '',
    collaboration ?? '',
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

  db.prepare('DELETE FROM experiences WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
