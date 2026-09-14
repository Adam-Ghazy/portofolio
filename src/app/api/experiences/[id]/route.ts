import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { autoTranslate, autoTranslateSystemsJson } from '@/lib/translate';

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
    company,
    position,
    position_id,
    program,
    program_id,
    location,
    period,
    description,
    description_id,
    systems,
    systems_id,
    technologies,
    collaboration,
    collaboration_id,
    sort_order,
    is_active,
  } = body;

  if (position && !position_id) position_id = await autoTranslate(position, 'en', 'id');
  if (position_id && !position) position = await autoTranslate(position_id, 'id', 'en');

  if (description && !description_id) description_id = await autoTranslate(description, 'en', 'id');
  if (description_id && !description) description = await autoTranslate(description_id, 'id', 'en');

  if (program && !program_id) program_id = await autoTranslate(program, 'en', 'id');
  if (program_id && !program) program = await autoTranslate(program_id, 'id', 'en');

  const systemsStr = typeof systems === 'string' ? systems : JSON.stringify(systems || []);
  let systemsIdStr = typeof systems_id === 'string' ? systems_id : JSON.stringify(systems_id || []);
  if (systemsStr && (!systemsIdStr || systemsIdStr === '[]')) {
    systemsIdStr = await autoTranslateSystemsJson(systemsStr, 'en', 'id');
  }

  db.prepare(
    `UPDATE experiences
     SET company=?, position=?, position_id=?, program=?, program_id=?, location=?, period=?,
         description=?, description_id=?, systems=?, systems_id=?, technologies=?,
         collaboration=?, collaboration_id=?, sort_order=?, is_active=?, updated_at=CURRENT_TIMESTAMP
     WHERE id=?`
  ).run(
    company,
    position || '',
    position_id || position || '',
    program || '',
    program_id || program || '',
    location || '',
    period || '',
    description || '',
    description_id || description || '',
    systemsStr,
    systemsIdStr,
    technologies || '',
    collaboration || '',
    collaboration_id || collaboration || '',
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

  db.prepare('DELETE FROM experiences WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
