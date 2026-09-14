import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { autoTranslate } from '@/lib/translate';

export async function GET(request: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (slug) {
    const section = db.prepare('SELECT * FROM sections WHERE slug = ?').get(slug);
    return NextResponse.json(section ?? null);
  }

  const sections = db.prepare('SELECT * FROM sections WHERE is_active = 1 ORDER BY sort_order').all();
  return NextResponse.json(sections);
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const body = await request.json();
  let { slug, title, title_id, subtitle, subtitle_id, content, content_id, image_url, sort_order } = body;

  if (title && !title_id) title_id = await autoTranslate(title, 'en', 'id');
  if (title_id && !title) title = await autoTranslate(title_id, 'id', 'en');

  if (subtitle && !subtitle_id) subtitle_id = await autoTranslate(subtitle, 'en', 'id');
  if (subtitle_id && !subtitle) subtitle = await autoTranslate(subtitle_id, 'id', 'en');

  const result = db.prepare(
    `INSERT INTO sections (slug, title, title_id, subtitle, subtitle_id, content, content_id, image_url, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    slug,
    title || '',
    title_id || title || '',
    subtitle || '',
    subtitle_id || subtitle || '',
    content || '',
    content_id || content || '',
    image_url || '',
    sort_order || 0
  );

  return NextResponse.json({ id: result.lastInsertRowid });
}

export async function PUT(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const body = await request.json();
  let { id, slug, title, title_id, subtitle, subtitle_id, content, content_id, image_url, sort_order, is_active } = body;

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

export async function DELETE(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  db.prepare('DELETE FROM sections WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
