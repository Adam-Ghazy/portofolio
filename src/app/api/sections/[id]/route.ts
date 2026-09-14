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
  let { slug, title, title_id, subtitle, subtitle_id, content, content_id, image_url, sort_order, is_active } = body;

  if (title && !title_id) title_id = await autoTranslate(title, 'en', 'id');
  if (title_id && !title) title = await autoTranslate(title_id, 'id', 'en');

  if (subtitle && !subtitle_id) subtitle_id = await autoTranslate(subtitle, 'en', 'id');
  if (subtitle_id && !subtitle) subtitle = await autoTranslate(subtitle_id, 'id', 'en');

  db.prepare(
    `UPDATE sections
     SET slug=?, title=?, title_id=?, subtitle=?, subtitle_id=?, content=?, content_id=?,
         image_url=?, sort_order=?, is_active=?, updated_at=CURRENT_TIMESTAMP
     WHERE id=?`
  ).run(
    slug,
    title || '',
    title_id || title || '',
    subtitle || '',
    subtitle_id || subtitle || '',
    content || '',
    content_id || content || '',
    image_url || '',
    sort_order || 0,
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

  db.prepare('DELETE FROM sections WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
