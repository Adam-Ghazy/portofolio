'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useTheme } from '../ThemeProvider';
import { FloatingHeader } from './FloatingHeader';

export function UntiSection({
  children,
  className,
  noAppear,
}: {
  children: ReactNode;
  className?: string;
  noAppear?: boolean;
}) {
  return (
    <div className={className || (noAppear ? undefined : 'unti-appear')} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {children}
    </div>
  );
}

export function UntiCard({ children, gap = 20, className }: { children: ReactNode; gap?: number; className?: string }) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-card)',
        padding: 20,
        gap,
        maxWidth: 760,
        width: '100%',
        marginInline: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </div>
  );
}

export function SectionPill({ label }: { label: string }) {
  return (
    <div>
      <span className="unti-pill">
        <h3 className="m-0" style={{ fontSize: 14, fontWeight: 500, letterSpacing: 0, lineHeight: 1.2 }}>
          {label}
        </h3>
      </span>
    </div>
  );
}

export function StatusPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-[5px]">
      <span className="unti-status-dot" aria-hidden />
      <span className="unti-meta" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </span>
    </span>
  );
}

// Server renders a blank; fills after mount to keep hydration identical.
export function TimeClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span suppressHydrationWarning className="unti-meta whitespace-nowrap" style={time ? undefined : { visibility: 'hidden' }}>
      {time || '\u00A0'}
    </span>
  );
}

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className="inline-flex items-center justify-center transition-opacity hover:opacity-70"
    >
      {theme === 'dark' ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-primary)' }}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-primary)' }}>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

export function ContactRow({
  label,
  content,
  href,
  newTab,
}: {
  label: string;
  content: string;
  href: string;
  newTab?: boolean;
}) {
  const isExternal = href.startsWith('http');
  return (
    <div
      className="flex items-center justify-between w-full transition-opacity"
      style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-photo)',
        padding: 20,
        gap: 20,
      }}
    >
      <span className="unti-muted">{label}</span>
      <span className="flex items-center gap-[10px] min-w-0">
        <a
          href={href}
          target={newTab || isExternal ? '_blank' : undefined}
          rel={newTab || isExternal ? 'noopener noreferrer' : undefined}
          className="unti-heading truncate hover:opacity-70 transition-opacity"
        >
          {content}
        </a>
        <span
          aria-hidden
          className="inline-flex items-center justify-center shrink-0"
          style={{ width: 40, height: 40, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-pill)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-secondary)' }}>
            <path d="M7 17L17 7M7 7h10v10" />
          </svg>
        </span>
      </span>
    </div>
  );
}

export function UntiContactFooter({
  rows,
  copyright,
}: {
  rows: { label: string; content: string; href: string; newTab?: boolean }[];
  copyright: string;
}) {
  return (
    <footer className="unti-appear" style={{ padding: '10px 0 80px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-card)',
          padding: 20,
          maxWidth: 760,
          width: '100%',
          marginInline: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {rows.map((row) => (
            <ContactRow key={row.label} {...row} />
          ))}
        </div>
        <p className="unti-meta text-center m-0">{copyright}</p>
      </div>
    </footer>
  );
}

export function UntiPage({
  location,
  rows,
  copyright,
  children,
}: {
  location: string;
  rows: { label: string; content: string; href: string; newTab?: boolean }[];
  copyright: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: 1200, marginInline: 'auto', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <FloatingHeader location={location} />
        <main style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '10px 10px 0' }}>{children}</main>
        <UntiContactFooter rows={rows} copyright={copyright} />
      </div>
    </div>
  );
}
