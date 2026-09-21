'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage } from './I18nProvider';

export interface ProjectMediaItem {
  id?: number;
  media_type?: string;
  url: string;
  caption?: string;
  caption_id?: string;
  sort_order?: number;
}

const PlayIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5.14v13.72c0 .8.87 1.3 1.56.88l10.54-6.86a1.05 1.05 0 0 0 0-1.76L9.56 4.26A1.04 1.04 0 0 0 8 5.14z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const ArrowIcon = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transform: dir === 'left' ? 'rotate(180deg)' : undefined }}
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

/**
 * Evidence gallery for a project (images + video proof).
 * Renders a compact bordered grid consistent with the card design and
 * opens a keyboard-navigable lightbox for full-size viewing / playback.
 */
export default function ProjectMediaGallery({
  media,
  projectTitle,
  maxTiles,
}: {
  media: ProjectMediaItem[];
  projectTitle?: string;
  maxTiles?: number;
}) {
  const { t, l, locale } = useLanguage();
  const [lightbox, setLightbox] = useState<number | null>(null);

  const items = (media || []).filter((m) => m && m.url);
  if (items.length === 0) return null;

  const limited = typeof maxTiles === 'number' && items.length > maxTiles;
  const visible = limited ? items.slice(0, maxTiles) : items;
  const hiddenCount = items.length - visible.length;
  const gridClass =
    visible.length === 1 ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3';

  const openAt = (idx: number) => setLightbox(idx);
  const close = () => setLightbox(null);
  const step = useCallback(
    (dir: 1 | -1) => {
      setLightbox((cur) => {
        if (cur === null) return cur;
        const safeCur = Math.max(0, Math.min(cur, items.length - 1));
        return (safeCur + dir + items.length) % items.length;
      });
    },
    [items.length]
  );

  const isOpen = lightbox !== null;


  // Lightbox keyboard controls + body scroll lock
  const originalOverflowRef = useRef<string>('');
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    originalOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = originalOverflowRef.current;
    };
  }, [isOpen, step]);

  const activeIndex =
    lightbox !== null ? Math.max(0, Math.min(lightbox, items.length - 1)) : null;
  const active = activeIndex !== null ? items[activeIndex] : null;
  const activeCaption = active ? l(active, 'caption') : '';

  return (
    <div className="mb-6">
      {/* Section Label */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-primary)' }}>
            {t('projects.media_heading', 'Evidence & Documentation')}
          </span>
        </div>
        <span className="font-mono text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
          {String(items.length).padStart(2, '0')} {locale === 'id' ? 'media · klik untuk perbesar' : 'media · click to enlarge'}
        </span>
      </div>

      {/* Tiles */}
      <div className={`grid gap-3 ${gridClass}`}>
        {visible.map((item, idx) => {
          const isVideo = item.media_type === 'video';
          const isMoreTile = limited && idx === visible.length - 1;
          return (
            <button
              key={item.id ?? idx}
              type="button"
              onClick={() => openAt(isMoreTile && typeof maxTiles === 'number' ? maxTiles : idx)}
              className="group relative rounded-xl overflow-hidden border text-left transition-all duration-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
              aria-label={l(item, 'caption') || `${projectTitle || 'Project'} media ${idx + 1}`}
            >
              <div className="aspect-video w-full overflow-hidden">
                {isVideo ? (
                  <video
                    src={`${item.url}#t=0.001`}
                    preload="metadata"
                    muted
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                    tabIndex={-1}
                  />
                ) : (
                   
                  <img
                    src={item.url}
                    alt={l(item, 'caption') || `${projectTitle || 'Project'} evidence ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                )}
              </div>

              {/* Index / type tag */}
              <span
                className="absolute top-2 left-2 font-mono text-[10px] px-1.5 py-0.5 rounded border backdrop-blur-sm"
                style={{
                  background: 'color-mix(in srgb, var(--bg-primary) 72%, transparent)',
                  color: 'var(--text-secondary)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                {isVideo ? 'VID' : 'IMG'}-{String(idx + 1).padStart(2, '0')}
              </span>

              {/* Play badge for videos */}
              {isVideo && (
                <span
                  className="absolute inset-0 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span
                    className="flex items-center justify-center w-10 h-10 rounded-full border backdrop-blur-sm transition-transform duration-200 group-hover:scale-110"
                    style={{
                      background: 'color-mix(in srgb, var(--bg-primary) 55%, transparent)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <PlayIcon />
                  </span>
                </span>
              )}

              {/* +N overlay on the last clipped tile */}
              {isMoreTile && (
                <span
                  className="absolute inset-0 flex items-center justify-center font-mono text-lg font-semibold"
                  style={{ background: 'color-mix(in srgb, var(--bg-primary) 72%, transparent)', color: 'var(--text-primary)' }}
                >
                  +{hiddenCount}
                </span>
              )}

              {/* Caption strip */}
              {l(item, 'caption') && (
                <span
                  className="absolute inset-x-0 bottom-0 px-2.5 py-1.5 text-[11px] leading-snug line-clamp-1"
                  style={{
                    background: 'linear-gradient(to top, color-mix(in srgb, var(--bg-primary) 85%, transparent), transparent)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {l(item, 'caption')}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightbox !== null && active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
          style={{ background: 'color-mix(in srgb, var(--bg-primary) 88%, black)' }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={activeCaption || projectTitle || 'Project media'}
        >
          {/* Close */}
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 z-10 flex items-center justify-center w-9 h-9 rounded-lg border transition-colors hover:bg-[var(--bg-secondary)]"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)', background: 'var(--bg-card)' }}
            aria-label={locale === 'id' ? 'Tutup' : 'Close'}
          >
            <CloseIcon />
          </button>

          {/* Counter */}
          <div
            className="absolute top-5 left-5 font-mono text-[11px] px-2.5 py-1 rounded border"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}
          >
            {String(lightbox + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </div>

          {/* Media */}
          <div
            className="max-w-[1100px] w-full flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="rounded-xl border overflow-hidden max-h-[78vh] flex items-center justify-center"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            >
              {active.media_type === 'video' ? (
                <video
                  key={active.url}
                  src={active.url}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[78vh] max-w-full"
                />
              ) : (
                 
                <img
                  key={active.url}
                  src={active.url}
                  alt={activeCaption || `${projectTitle || 'Project'} evidence`}
                  className="max-h-[78vh] max-w-full object-contain"
                />
              )}
            </div>

            {activeCaption && (
              <p className="font-mono text-xs text-center max-w-[720px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {activeCaption}
              </p>
            )}

            {/* Prev / Next */}
            {items.length > 1 && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="flex items-center justify-center w-9 h-9 rounded-lg border transition-colors hover:bg-[var(--bg-secondary)]"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)', background: 'var(--bg-card)' }}
                  aria-label={locale === 'id' ? 'Sebelumnya' : 'Previous'}
                >
                  <ArrowIcon dir="left" />
                </button>
                <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                  {locale === 'id' ? 'gunakan tombol panah' : 'use arrow keys'}
                </span>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="flex items-center justify-center w-9 h-9 rounded-lg border transition-colors hover:bg-[var(--bg-secondary)]"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)', background: 'var(--bg-card)' }}
                  aria-label={locale === 'id' ? 'Selanjutnya' : 'Next'}
                >
                  <ArrowIcon dir="right" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
