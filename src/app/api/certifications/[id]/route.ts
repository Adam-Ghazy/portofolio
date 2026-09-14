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
    title,
    title_id,
    issuer,
    location,
    issue_date,
    credential_info,
    credential_info_id,
    sort_order,
    is_active,
  } = body;

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
    location ?? '',
    issue_date ?? '',
    credential_info ?? '',
    credential_info_id ?? credential_info ?? '',
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

  db.prepare('DELETE FROM certifications WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
