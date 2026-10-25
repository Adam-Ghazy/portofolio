'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../ThemeProvider';
import { TimeClock, ThemeToggle } from './UntiPrimitives';

// Floating pill header: normal-flow bar at top, fixed pill after 180px scroll,
// auto-hides while the page is idle.

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'Experience' },
  { href: '/skills', label: 'Skills' },
];

const SCROLL_THRESHOLD = 180;
const IDLE_DELAY_MS = 2500;
const POINTER_REVEAL_ZONE_PX = 90;

export function FloatingHeader({ location }: { location: string }) {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    let idleTimer: number | undefined;

    const update = () => {
      const pastThreshold = window.scrollY > SCROLL_THRESHOLD;
      setScrolled(pastThreshold);
      setIsIdle(false);
      window.clearTimeout(idleTimer);
      if (pastThreshold) {
        idleTimer = window.setTimeout(() => setIsIdle(true), IDLE_DELAY_MS);
      }
    };

    const raf = requestAnimationFrame(update);
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', update);
      window.clearTimeout(idleTimer);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // The hidden pill is pointer-transparent, so reveal via document mousemove.
  useEffect(() => {
    if (!isIdle) return;
    const onMove = (e: MouseEvent) => {
      if (e.clientY <= POINTER_REVEAL_ZONE_PX) setIsIdle(false);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [isIdle]);

  const isActive = useCallback((href: string) => pathname === href, [pathname]);

  const idle = scrolled && isIdle && !menuOpen;

  return (
    <header className={`site-nav${scrolled ? ' is-scrolled' : ''}${idle ? ' is-idle' : ''}`}>
      <div className="site-nav-inner">
        {!scrolled && (
          <span className="inline-flex items-center gap-[5px] min-w-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-secondary)' }} aria-hidden>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              <path d="M2 12h20" />
            </svg>
            <span className="unti-meta truncate">{location}</span>
          </span>
        )}

        <Link href="/" className="site-logo" aria-label="Adam.dev — Home" style={scrolled ? undefined : { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
          Adam.dev
        </Link>

        <nav className="site-desktop-links" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} aria-current={isActive(link.href) ? 'page' : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>

        {!scrolled && (
          <span className="site-nav-clock inline-flex items-center gap-[5px]">
            <TimeClock />
            <ThemeToggle />
          </span>
        )}

        <Link href="/contact" className="site-nav-cta" style={scrolled ? undefined : { display: 'none' }}>
          Contact <span aria-hidden="true">↗</span>
        </Link>

        <button
          type="button"
          className="site-menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
        </button>
      </div>

      <nav
        id="mobile-menu"
        className={`site-mobile-menu${menuOpen ? '' : ' site-mobile-closed'}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} aria-current={isActive(link.href) ? 'page' : undefined} onClick={() => setMenuOpen(false)}>
            {link.label}
            <span aria-hidden="true" style={{ color: 'var(--text-tertiary)' }}>
              ↗
            </span>
          </Link>
        ))}
        <Link href="/contact" onClick={() => setMenuOpen(false)} aria-current={isActive('/contact') ? 'page' : undefined}>
          Contact
          <span aria-hidden="true" style={{ color: 'var(--text-tertiary)' }}>
            ↗
          </span>
        </Link>
        <button
          type="button"
          onClick={toggle}
          className="flex items-center justify-between"
          style={{
            font: 'inherit',
            color: 'var(--text-primary)',
            background: 'none',
            border: 'none',
            padding: 12,
            cursor: 'pointer',
            borderRadius: 'var(--radius-pill)',
          }}
        >
          {theme === 'dark' ? 'Dark theme' : 'Light theme'}
          <span aria-hidden="true" style={{ color: 'var(--text-tertiary)' }}>
            {theme === 'dark' ? '☾' : '☀'}
          </span>
        </button>
      </nav>
    </header>
  );
}
