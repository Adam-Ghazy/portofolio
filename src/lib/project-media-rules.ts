/**
 * Project media rules, shared by the project API routes and the admin form.
 *
 * Kept free of imports on purpose: `lib/project-media.ts` reaches into the
 * database (better-sqlite3), so the admin client component cannot import the
 * rule from there without dragging a native server module into the bundle.
 */

/**
 * Every project card renders its evidence gallery as a carousel showing three
 * tiles per view, so a gallery below this count leaves the row visibly short.
 */
export const MIN_PROJECT_MEDIA = 3;

/**
 * Validates the `media` field of a project request body.
 *
 * Returns an error message when the gallery is below the minimum, or `null` when
 * it passes.
 *
 * `required` distinguishes create from update. On update, an omitted `media` means
 * "leave the gallery untouched" and is allowed through; an explicit `[]` is a
 * genuine attempt to clear it and is rejected. On create there is no existing
 * gallery to leave alone, so omitting `media` would silently produce a project
 * without evidence — that is rejected too.
 */
export function validateProjectMedia(media: unknown, required = false): string | null {
  if (media === undefined || media === null) {
    return required
      ? `Minimal ${MIN_PROJECT_MEDIA} media bukti (gambar/video) per proyek. Saat ini 0.`
      : null;
  }
  if (!Array.isArray(media)) return null;

  const count = countProjectMedia(media);
  if (count >= MIN_PROJECT_MEDIA) return null;
  return `Minimal ${MIN_PROJECT_MEDIA} media bukti (gambar/video) per proyek. Saat ini ${count}.`;
}

/** Counts entries that carry a usable URL, ignoring blanks the form may hold. */
export function countProjectMedia(media: unknown): number {
  if (!Array.isArray(media)) return 0;

  return media.filter(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      'url' in item &&
      typeof item.url === 'string' &&
      item.url.trim() !== ''
  ).length;
}
