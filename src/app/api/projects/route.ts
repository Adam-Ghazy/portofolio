import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { autoTranslate } from '@/lib/translate';
import { getProjectMediaMap, syncProjectMedia } from '@/lib/project-media';
import { validateProjectMedia } from '@/lib/project-media-rules';

interface ProjectMetric {
  value: string;
  label?: string;
  label_id?: string;
}

interface ProjectRow {
  id: number;
  metrics: unknown;
  [column: string]: unknown;
}

/**
 * `metrics` is persisted as a JSON text column. The card always receives an array,
 * never null, so it can render the chip strip without layered null checks.
 */
function parseMetrics(raw: unknown): ProjectMetric[] {
  if (typeof raw !== 'string' || raw.trim() === '') return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((m): m is ProjectMetric => {
      if (typeof m !== 'object' || m === null || !('value' in m)) return false;
      return typeof m.value === 'string';
    });
  } catch {
    return [];
  }
}

export async function GET() {
  const db = getDb();
  const projects = db
    .prepare('SELECT * FROM projects WHERE is_active = 1 ORDER BY sort_order')
    .all() as ProjectRow[];
  const mediaMap = getProjectMediaMap();
  return NextResponse.json(
    projects.map((p) => ({
      ...p,
      metrics: parseMetrics(p.metrics),
      media: mediaMap[p.id] || [],
    }))
  );
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
    contributions,
    contributions_id,
    role,
    role_id,
  } = body;
  const { year, tags, link, sort_order, media } = body;

  const mediaError = validateProjectMedia(media, true);
  if (mediaError) return NextResponse.json({ error: mediaError }, { status: 400 });

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

  if (contributions && !contributions_id) contributions_id = await autoTranslate(contributions, 'en', 'id');
  if (contributions_id && !contributions) contributions = await autoTranslate(contributions_id, 'id', 'en');

  if (role && !role_id) role_id = await autoTranslate(role, 'en', 'id');
  if (role_id && !role) role = await autoTranslate(role_id, 'id', 'en');

  const result = db.prepare(
    `INSERT INTO projects (
      title, title_id, description, description_id,
      problem, problem_id, solution, solution_id,
      impact, impact_id, contributions, contributions_id,
      year, role, role_id,
      tags, link, sort_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
    contributions || '',
    contributions_id || contributions || '',
    year || '',
    role || '',
    role_id || role || '',
    tags || '',
    link || '',
    sort_order || 0
  );

  await syncProjectMedia(Number(result.lastInsertRowid), media);

  return NextResponse.json({ id: result.lastInsertRowid });
}

export async function PUT(request: NextRequest) {
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
    contributions,
    contributions_id,
    role,
    role_id,
  } = body;
  const { id, year, tags, link, sort_order, is_active, media } = body;

  const mediaError = validateProjectMedia(media);
  if (mediaError) return NextResponse.json({ error: mediaError }, { status: 400 });

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

  if (contributions && !contributions_id) contributions_id = await autoTranslate(contributions, 'en', 'id');
  if (contributions_id && !contributions) contributions = await autoTranslate(contributions_id, 'id', 'en');

  if (role && !role_id) role_id = await autoTranslate(role, 'en', 'id');
  if (role_id && !role) role = await autoTranslate(role_id, 'id', 'en');

  db.prepare(
    `UPDATE projects
     SET title=?, title_id=?, description=?, description_id=?,
         problem=?, problem_id=?, solution=?, solution_id=?,
         impact=?, impact_id=?, contributions=?, contributions_id=?,
         year=?, role=?, role_id=?,
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
    contributions || '',
    contributions_id || contributions || '',
    year || '',
    role || '',
    role_id || role || '',
    tags || '',
    link || '',
    sort_order || 0,
    is_active ?? 1,
    id
  );

  await syncProjectMedia(Number(id), media);

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
