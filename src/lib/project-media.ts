import getDb from './db';
import { autoTranslate } from './translate';

export interface ProjectMediaInput {
  id?: number;
  media_type?: string;
  url: string;
  caption?: string;
  caption_id?: string;
  sort_order?: number;
  is_active?: number;
}

/**
 * Returns all active project media grouped by project_id.
 * Used to embed the evidence gallery into GET /api/projects responses.
 */
export function getProjectMediaMap(): Record<number, ProjectMediaInput[]> {
  const db = getDb();
  const rows = db
    .prepare('SELECT * FROM project_media WHERE is_active = 1 ORDER BY sort_order, id')
    .all() as any[];

  const map: Record<number, ProjectMediaInput[]> = {};
  for (const row of rows) {
    if (!map[row.project_id]) map[row.project_id] = [];
    map[row.project_id].push(row);
  }
  return map;
}

/**
 * Replaces the media gallery of a project with the given list (full CRUD sync).
 * `undefined` leaves the existing gallery untouched; an empty array clears it.
 * Captions are auto-translated when only one language is provided.
 */
export async function syncProjectMedia(projectId: number, media?: ProjectMediaInput[]) {
  if (!Array.isArray(media)) return;

  const items = await Promise.all(
    media
      .filter((item) => item && item.url)
      .map(async (item, idx) => {
        let caption = item.caption || '';
        let caption_id = item.caption_id || '';

        if (caption && !caption_id) caption_id = await autoTranslate(caption, 'en', 'id');
        else if (caption_id && !caption) caption = await autoTranslate(caption_id, 'id', 'en');

        return {
          media_type: item.media_type === 'video' ? 'video' : 'image',
          url: item.url,
          caption,
          caption_id,
          sort_order: typeof item.sort_order === 'number' ? item.sort_order : idx,
          is_active: item.is_active ?? 1,
        };
      })
  );

  const db = getDb();
  const del = db.prepare('DELETE FROM project_media WHERE project_id = ?');
  const ins = db.prepare(
    `INSERT INTO project_media (project_id, media_type, url, caption, caption_id, sort_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  db.transaction(() => {
    del.run(projectId);
    for (const item of items) {
      ins.run(projectId, item.media_type, item.url, item.caption, item.caption_id, item.sort_order, item.is_active);
    }
  })();
}
