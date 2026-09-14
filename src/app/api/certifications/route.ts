import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { autoTranslate } from '@/lib/translate';

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
  let { title, title_id, issuer, location, issue_date, credential_info, credential_info_id, sort_order } = body;

  if (title && !title_id) title_id = await autoTranslate(title, 'en', 'id');
  if (title_id && !title) title = await autoTranslate(title_id, 'id', 'en');

  if (credential_info && !credential_info_id) credential_info_id = await autoTranslate(credential_info, 'en', 'id');
  if (credential_info_id && !credential_info) credential_info = await autoTranslate(credential_info_id, 'id', 'en');

  const result = db.prepare(
    `INSERT INTO certifications (title, title_id, issuer, location, issue_date, credential_info, credential_info_id, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    title || '',
    title_id || title || '',
    issuer || '',
    location || '',
    issue_date || '',
    credential_info || '',
    credential_info_id || credential_info || '',
    sort_order || 0
  );

  return NextResponse.json({ id: result.lastInsertRowid });
}

export async function PUT(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const body = await request.json();
  let { id, title, title_id, issuer, location, issue_date, credential_info, credential_info_id, sort_order, is_active } = body;

  if (title && !title_id) title_id = await autoTranslate(title, 'en', 'id');
  if (title_id && !title) title = await autoTranslate(title_id, 'id', 'en');

  if (credential_info && !credential_info_id) credential_info_id = await autoTranslate(credential_info, 'en', 'id');
  if (credential_info_id && !credential_info) credential_info = await autoTranslate(credential_info_id, 'id', 'en');

  db.prepare(
    `UPDATE certifications
     SET title=?, title_id=?, issuer=?, location=?, issue_date=?, credential_info=?, credential_info_id=?, sort_order=?, is_active=?
     WHERE id=?`
  ).run(
    title || '',
    title_id || title || '',
    issuer || '',
    location || '',
    issue_date || '',
    credential_info || '',
    credential_info_id || credential_info || '',
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

  db.prepare('DELETE FROM certifications WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
