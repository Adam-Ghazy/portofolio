'use client';

import { useTheme } from './ThemeProvider';
import Link from 'next/link';

export default function Header() {
  const { theme, toggle } = useTheme();
  
  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b"
      style={{ 
        background: theme === 'dark' ? 'rgba(11,13,17,0.85)' : 'rgba(248,249,250,0.85)',
        borderColor: 'var(--border-color)'
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 h-14 flex items-center justify-between">
        <Link href="/" className="font-mono text-[13px] font-bold tracking-wider uppercase flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <span>ADAM GHAZY</span>
          <span className="text-[10px] font-normal px-1.5 py-0.5 rounded border opacity-70" style={{ borderColor: 'var(--border-color)', color: 'var(--text-tertiary)' }}>DEV</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {[
            { label: 'home', href: '/' },
            { label: 'about', href: '/about' },
            { label: 'experience', href: '/experience' },
            { label: 'projects', href: '/projects' },
            { label: 'skills', href: '/skills' },
            { label: 'contact', href: '/contact' },
          ].map(link => (
            <Link
              key={link.label}
              href={link.href}
              className="relative font-mono text-xs link-hover transition-colors duration-200"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://www.linkedin.com/in/adamghazy"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] px-2.5 py-1 rounded-md border transition-colors hover:bg-[var(--bg-secondary)]"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
          >
            LinkedIn ↗
          </a>

          <button
            onClick={toggle}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-200 border"
            style={{ 
              background: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)'
            }}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
