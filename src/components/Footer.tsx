'use client';

import Link from 'next/link';
import { useLanguage } from './I18nProvider';

interface SiteSettings {
  footer_tagline?: string;
  footer_tagline_id?: string;
  email?: string;
  linkedin?: string;
  [key: string]: any;
}

interface FooterProps {
  settings?: SiteSettings;
  background?: 'primary' | 'secondary' | string;
}

export default function Footer({ settings, background = 'primary' }: FooterProps) {
  const { t, l } = useLanguage();
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
            <div className="font-mono text-[13px] font-bold tracking-wider uppercase" style={{ color: 'var(--text-primary)' }}>
              ADAM GHAZY AL FALAH
            </div>
            <div className="text-[12px] mt-1 font-mono" style={{ color: 'var(--text-tertiary)' }}>
              {l(settings, 'footer_tagline') || t('footer.tagline', 'turning problems into solutions')}
            </div>
          </div>

          <nav className="flex flex-wrap gap-5">
            {[
              { key: 'home', label: t('nav.home', 'home'), href: '/' },
              { key: 'about', label: t('nav.about', 'about'), href: '/about' },
              { key: 'experience', label: t('nav.experience', 'experience'), href: '/experience' },
              { key: 'projects', label: t('nav.projects', 'projects'), href: '/projects' },
              { key: 'skills', label: t('nav.skills', 'skills'), href: '/skills' },
              { key: 'contact', label: t('nav.contact', 'contact'), href: '/contact' },
            ].map(item => (
              <Link
                key={item.key}
                href={item.href}
                className="font-mono text-[11px] uppercase transition-colors duration-200"
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
