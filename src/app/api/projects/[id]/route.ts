import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const db = getDb();
  const { id } = await params;
  
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  
  db.prepare('DELETE FROM projects WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const db = getDb();
  const { id } = await params;
  const body = await request.json();
  const { title, description, image_url, year, role, tags, link, sort_order, is_active, technologies, project_url } = body;
  
  db.prepare(
    'UPDATE projects SET title=?, description=?, image_url=?, year=?, role=?, tags=?, link=?, sort_order=?, is_active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?'
  ).run(
    title,
    description || '',
    image_url || null,
    year || '',
    role || '',
    technologies || tags || '',
    project_url || link || '',
    sort_order || 0,
    is_active ?? 1,
    id
  );
  
  return NextResponse.json({ success: true });
}
