'use client';

import Link from 'next/link';

interface SiteSettings {
  footer_tagline?: string;
  email?: string;
  linkedin?: string;
}

interface FooterProps {
  settings?: SiteSettings;
  background?: 'primary' | 'secondary' | string;
}

export default function Footer({ settings, background = 'primary' }: FooterProps) {
  const bgStyle =
    background === 'secondary'
      ? 'var(--bg-secondary)'
      : 'var(--bg-primary)';

  return (
    <footer
      className="py-10 px-6 md:px-8 border-t transition-colors duration-200"
      style={{ background: bgStyle, borderColor: 'var(--border-color)' }}
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="font-mono text-[13px] font-bold tracking-wider" style={{ color: 'var(--text-primary)' }}>
              ADAM GHAZY AL FALAH
            </div>
            <div className="text-[12px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
              {settings?.footer_tagline || 'turning problems into solutions'}
            </div>
          </div>

          <nav className="flex flex-wrap gap-5">
            {[
              { label: 'home', href: '/' },
              { label: 'about', href: '/about' },
              { label: 'experience', href: '/#experience' },
              { label: 'projects', href: '/projects' },
              { label: 'skills', href: '/skills' },
              { label: 'contact', href: '/contact' },
            ].map(item => (
              <Link
                key={item.label}
                href={item.href}
                className="font-mono text-[11px] transition-colors duration-200"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
