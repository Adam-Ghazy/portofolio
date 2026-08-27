import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  const db = getDb();
  const certs = db.prepare('SELECT * FROM certifications WHERE is_active = 1 ORDER BY sort_order').all();
  return NextResponse.json(certs);
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const body = await request.json();
  const { title, issuer, location, issue_date, credential_info, sort_order } = body;

  const result = db.prepare(
    `INSERT INTO certifications (title, issuer, location, issue_date, credential_info, sort_order)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(title, issuer, location || '', issue_date || '', credential_info || '', sort_order || 0);

  return NextResponse.json({ id: result.lastInsertRowid });
}

export async function PUT(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const body = await request.json();
  const { id, title, issuer, location, issue_date, credential_info, sort_order, is_active } = body;

  db.prepare(
    `UPDATE certifications
     SET title=?, issuer=?, location=?, issue_date=?, credential_info=?, sort_order=?, is_active=?
     WHERE id=?`
  ).run(title, issuer, location, issue_date, credential_info, sort_order, is_active, id);

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  db.prepare('DELETE FROM certifications WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
