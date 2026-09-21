'use client';

import { useLanguage } from './I18nProvider';

/**
 * "My Contributions" block for a project card — a numbered checklist of the
 * author's personal contributions, matching the case-study box styling.
 */
export default function ProjectContributions({
  contributions,
  contributions_id,
}: {
  contributions?: string;
  contributions_id?: string;
}) {
  const { t, locale } = useLanguage();

  const raw = (locale === 'id' ? contributions_id || contributions : contributions || contributions_id) || '';
  let items = raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  // Fallback: single-line semicolon separated list
  if (items.length === 1 && items[0].includes(';')) {
    items = items[0].split(';').map((s) => s.trim()).filter(Boolean);
  }

  if (items.length === 0) return null;

  return (
    <div
      className="rounded-xl p-4 md:p-5 border mb-6"
      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-primary)' }}>
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
        <div className="font-mono text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-primary)' }}>
          {t('projects.contributions_heading', 'My Contributions')}
        </div>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <span className="font-mono text-[11px] pt-[2px] shrink-0" style={{ color: 'var(--text-tertiary)' }}>
              {String(idx + 1).padStart(2, '0')}
            </span>
            <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {item}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
