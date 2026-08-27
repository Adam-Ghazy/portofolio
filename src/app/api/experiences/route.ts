import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  const db = getDb();
  const experiences = db.prepare('SELECT * FROM experiences WHERE is_active = 1 ORDER BY sort_order').all();
  return NextResponse.json(experiences);
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const body = await request.json();
  const { company, position, program, location, period, description, systems, technologies, sort_order } = body;

  const result = db.prepare(
    `INSERT INTO experiences (company, position, program, location, period, description, systems, technologies, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    company,
    position,
    program || '',
    location || '',
    period || '',
    description || '',
    typeof systems === 'string' ? systems : JSON.stringify(systems || []),
    technologies || '',
    sort_order || 0
  );

  return NextResponse.json({ id: result.lastInsertRowid });
}

export async function PUT(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const body = await request.json();
  const { id, company, position, program, location, period, description, systems, technologies, sort_order, is_active } = body;

  db.prepare(
    `UPDATE experiences
     SET company=?, position=?, program=?, location=?, period=?, description=?, systems=?, technologies=?, sort_order=?, is_active=?, updated_at=CURRENT_TIMESTAMP
     WHERE id=?`
  ).run(
    company,
    position,
    program || '',
    location || '',
    period || '',
    description || '',
    typeof systems === 'string' ? systems : JSON.stringify(systems || []),
    technologies || '',
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

  db.prepare('DELETE FROM experiences WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
