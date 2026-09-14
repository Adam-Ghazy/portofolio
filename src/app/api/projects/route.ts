import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { autoTranslate } from '@/lib/translate';

export async function GET() {
  const db = getDb();
  const projects = db.prepare('SELECT * FROM projects WHERE is_active = 1 ORDER BY sort_order').all();
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const body = await request.json();
  let {
    title,
    title_id,
    description,
    description_id,
    problem,
    problem_id,
    solution,
    solution_id,
    impact,
    impact_id,
    image_url,
    year,
    role,
    role_id,
    tags,
    link,
    sort_order,
  } = body;

  // Auto translate if one language provided
  if (title && !title_id) title_id = await autoTranslate(title, 'en', 'id');
  if (title_id && !title) title = await autoTranslate(title_id, 'id', 'en');

  if (description && !description_id) description_id = await autoTranslate(description, 'en', 'id');
  if (description_id && !description) description = await autoTranslate(description_id, 'id', 'en');

  if (problem && !problem_id) problem_id = await autoTranslate(problem, 'en', 'id');
  if (problem_id && !problem) problem = await autoTranslate(problem_id, 'id', 'en');

  if (solution && !solution_id) solution_id = await autoTranslate(solution, 'en', 'id');
  if (solution_id && !solution) solution = await autoTranslate(solution_id, 'id', 'en');

  if (impact && !impact_id) impact_id = await autoTranslate(impact, 'en', 'id');
  if (impact_id && !impact) impact = await autoTranslate(impact_id, 'id', 'en');

  if (role && !role_id) role_id = await autoTranslate(role, 'en', 'id');
  if (role_id && !role) role = await autoTranslate(role_id, 'id', 'en');

  const result = db.prepare(
    `INSERT INTO projects (
      title, title_id, description, description_id,
      problem, problem_id, solution, solution_id,
      impact, impact_id, image_url, year, role, role_id,
      tags, link, sort_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    title || '',
    title_id || title || '',
    description || '',
    description_id || description || '',
    problem || '',
    problem_id || problem || '',
    solution || '',
    solution_id || solution || '',
    impact || '',
    impact_id || impact || '',
    image_url || '',
    year || '',
    role || '',
    role_id || role || '',
    tags || '',
    link || '',
    sort_order || 0
  );

  return NextResponse.json({ id: result.lastInsertRowid });
}

export async function PUT(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const body = await request.json();
  let {
    id,
    title,
    title_id,
    description,
    description_id,
    problem,
    problem_id,
    solution,
    solution_id,
    impact,
    impact_id,
    image_url,
    year,
    role,
    role_id,
    tags,
    link,
    sort_order,
    is_active,
  } = body;

  if (title && !title_id) title_id = await autoTranslate(title, 'en', 'id');
  if (title_id && !title) title = await autoTranslate(title_id, 'id', 'en');

  if (description && !description_id) description_id = await autoTranslate(description, 'en', 'id');
  if (description_id && !description) description = await autoTranslate(description_id, 'id', 'en');

  if (problem && !problem_id) problem_id = await autoTranslate(problem, 'en', 'id');
  if (problem_id && !problem) problem = await autoTranslate(problem_id, 'id', 'en');

  if (solution && !solution_id) solution_id = await autoTranslate(solution, 'en', 'id');
  if (solution_id && !solution) solution = await autoTranslate(solution_id, 'id', 'en');

  if (impact && !impact_id) impact_id = await autoTranslate(impact, 'en', 'id');
  if (impact_id && !impact) impact = await autoTranslate(impact_id, 'id', 'en');

  if (role && !role_id) role_id = await autoTranslate(role, 'en', 'id');
  if (role_id && !role) role = await autoTranslate(role_id, 'id', 'en');

  db.prepare(
    `UPDATE projects
     SET title=?, title_id=?, description=?, description_id=?,
         problem=?, problem_id=?, solution=?, solution_id=?,
         impact=?, impact_id=?, image_url=?, year=?, role=?, role_id=?,
         tags=?, link=?, sort_order=?, is_active=?, updated_at=CURRENT_TIMESTAMP
     WHERE id=?`
  ).run(
    title || '',
    title_id || title || '',
    description || '',
    description_id || description || '',
    problem || '',
    problem_id || problem || '',
    solution || '',
    solution_id || solution || '',
    impact || '',
    impact_id || impact || '',
    image_url || '',
    year || '',
    role || '',
    role_id || role || '',
    tags || '',
    link || '',
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
  db.prepare('DELETE FROM projects WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
