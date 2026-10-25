'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/I18nProvider';
import { UntiSection } from '@/components/unti/UntiPrimitives';

export default function NotFound() {
  const { t, locale } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: 1200, marginInline: 'auto', width: '100%', padding: '80px 10px 80px' }}>
        <UntiSection>
          <div
            className="flex flex-col items-center justify-center text-center"
            style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-card)',
              padding: 20,
              gap: 10,
              maxWidth: 760,
              width: '100%',
              marginInline: 'auto',
              minHeight: 480,
            }}
          >
            <div className="flex flex-col items-center" style={{ gap: 20 }}>
              <span className="unti-pill">{t('error.code_404', '404')}</span>
              <div className="flex flex-col items-center gap-[10px]">
                <h1 className="unti-title m-0 text-balance">
                  {locale === 'id' ? 'Tidak ada apa-apa di sini' : 'Nothing to see here'}
                </h1>
                <p className="unti-body m-0 text-pretty">
                  {locale === 'id'
                    ? 'Halaman yang kamu akses tidak dapat ditemukan atau mungkin sudah dipindahkan.'
                    : "The page you're trying to access can't be found or may have been moved."}
                </p>
              </div>
              <Link href="/" className="unti-card-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M3 10.5L12 3l9 7.5" />
                  <path d="M5 9.5V21h14V9.5" />
                </svg>
                {t('error.back_home', 'Back to Home')}
              </Link>
            </div>
          </div>
        </UntiSection>
      </div>
    </div>
  );
}
