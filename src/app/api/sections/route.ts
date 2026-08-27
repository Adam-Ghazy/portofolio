import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAuth } from '@/lib/auth';

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
  const { slug, title, subtitle, content, image_url, sort_order } = body;

  const result = db.prepare(
    'INSERT INTO sections (slug, title, subtitle, content, image_url, sort_order) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(slug, title, subtitle ?? '', content ?? '', image_url ?? '', sort_order ?? 0);

  return NextResponse.json({ id: result.lastInsertRowid });
}

export async function PUT(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const body = await request.json();
  const { id, slug, title, subtitle, content, image_url, sort_order, is_active } = body;

  db.prepare(
    'UPDATE sections SET slug=?, title=?, subtitle=?, content=?, image_url=?, sort_order=?, is_active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?'
  ).run(slug, title, subtitle, content, image_url ?? '', sort_order, is_active, id);

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
