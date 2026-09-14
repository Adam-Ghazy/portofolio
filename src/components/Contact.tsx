'use client';

import Link from 'next/link';
import { useLanguage } from './I18nProvider';

export default function Contact({ section }: { section?: any }) {
  const { t, l, locale } = useLanguage();

  return (
    <section id="contact" className="py-20 md:py-28 px-6 md:px-8 text-center relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[640px] mx-auto">
        <span className="font-mono text-[11px] tracking-wider uppercase block mb-3" style={{ color: 'var(--text-tertiary)' }}>
          {t('sections.contact_badge', '08 // contact')}
        </span>
        
        {/* Availability badge */}
        <div className="inline-flex items-center gap-2 font-mono text-[11px] mb-6 px-3.5 py-1 rounded border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
          <span>{l(section, 'content') || (locale === 'id' ? 'Terbuka untuk peluang junior developer & proyek' : 'Open to junior developer roles & project collaborations')}</span>
        </div>
        
        <h2 className="text-[28px] md:text-[38px] font-medium tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
          {l(section, 'title') || (locale === 'id' ? 'Mari Terhubung' : "Let's Connect")}
        </h2>
        
        <p className="text-[15px] md:text-[16px] leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
          {l(section, 'subtitle') || (locale === 'id'
            ? "Apakah Anda memiliki peluang rekayasa perangkat lunak, proyek produksi, atau sekadar ingin berdiskusi teknologi - kotak masuk saya selalu terbuka."
            : "Whether you have an entry-level software engineering opportunity, a production project, or simply want to discuss tech - my inbox is always open.")}
        </p>

        {/* Direct Channels */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <a
            href="mailto:ghozyalfalah02@gmail.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm font-medium transition-all duration-200 hover:opacity-90 shadow-sm"
            style={{ background: 'var(--accent)', color: 'var(--accent-contrast, #ffffff)' }}
          >
            {locale === 'id' ? 'Kirim Email' : 'Email Me'}
          </a>
          <a
            href="https://www.linkedin.com/in/adamghazy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-mono text-sm font-medium border transition-all duration-200 hover:bg-[var(--bg-secondary)]"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            LinkedIn Profile
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-mono text-sm font-medium border transition-all duration-200 hover:bg-[var(--bg-secondary)]"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
          >
            {locale === 'id' ? 'Form Pesan' : 'Message Form'}
          </Link>
        </div>

        {/* Location & Direct Info */}
        <div className="font-mono text-xs flex flex-wrap items-center justify-center gap-3" style={{ color: 'var(--text-tertiary)' }}>
          <span>Madiun, Indonesia</span>
          <span>/</span>
          <span>(+62) 85784269105</span>
        </div>
      </div>
    </section>
  );
}
