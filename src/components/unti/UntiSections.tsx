'use client';

import Link from 'next/link';
import { useLanguage } from '../I18nProvider';
import { UntiCard, UntiSection, SectionPill } from './UntiPrimitives';

export function ArrowButton({ href, external, as = 'a' }: { href: string; external?: boolean; as?: 'a' | 'span' }) {
  const icon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-secondary)' }} aria-hidden>
      <path d="M7 17L17 7M7 7h10v10" />
    </svg>
  );
  const style = {
    width: 40,
    height: 40,
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-pill)',
  } as const;
  if (as === 'span') {
    return (
      <span aria-hidden className="inline-flex items-center justify-center shrink-0" style={style}>
        {icon}
      </span>
    );
  }
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      aria-label="Open"
      className="inline-flex items-center justify-center shrink-0 transition-opacity hover:opacity-70"
      style={style}
    >
      {icon}
    </a>
  );
}

export function BioButtons({ cvUrl, contactLabel }: { cvUrl?: string; contactLabel: string }) {
  const { locale } = useLanguage();
  return (
    <div className="flex flex-wrap items-center gap-[10px]">
      {cvUrl && (
        <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="unti-card-btn">
          {locale === 'id' ? 'Unduh CV' : 'Download CV'}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
        </a>
      )}
      <Link href="/contact" className="unti-cta">
        {contactLabel}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M7 17L17 7M7 7h10v10" />
        </svg>
      </Link>
    </div>
  );
}

export function UntiHero({
  name,
  role,
  photoUrl,
  cvUrl,
}: {
  name: string;
  role: string;
  photoUrl?: string;
  cvUrl?: string;
}) {
  return (
    <UntiSection>
      <div
        className="unti-appear"
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-card)',
          padding: 20,
          gap: 40,
          maxWidth: 760,
          width: '100%',
          marginInline: 'auto',
          display: 'flex',
          alignItems: 'flex-start',
        }}
      >
        {photoUrl && (
          <div
            className="hidden sm:block shrink-0 overflow-hidden"
            style={{ width: 200, height: 200, borderRadius: 'var(--radius-photo)', background: 'var(--bg-secondary)' }}
          >
            { }
            <img
              src={photoUrl}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
              }}
            />
          </div>
        )}

        <div className="flex flex-col gap-[20px] flex-1 min-w-0">
          <div className="flex flex-col gap-[5px]">
            <h1 className="unti-title m-0 text-balance">{name}</h1>
            <p className="unti-heading m-0" style={{ color: 'var(--text-secondary)' }}>
              {role}
            </p>
          </div>
          <BioButtons cvUrl={cvUrl} contactLabel="Get in Touch" />
        </div>
      </div>
    </UntiSection>
  );
}

export function UntiOverview({ title, paragraphs }: { title: string; paragraphs: string[] }) {
  return (
    <UntiSection>
      <UntiCard>
        <SectionPill label={title} />
        <div className="flex flex-col gap-[20px]">
          {paragraphs.filter(Boolean).map((text, i) => (
            <p key={i} className="unti-body m-0 text-pretty">
              {text}
            </p>
          ))}
        </div>
      </UntiCard>
    </UntiSection>
  );
}

export interface UntiProjectCardData {
  id?: number;
  title: string;
  industry?: string;
  imageUrl?: string;
  href?: string;
  showArrow?: boolean;
}

export function UntiProjectCard({ project }: { project: UntiProjectCardData }) {
  const linked = project.href && !project.href.startsWith('http');
  const inner = (
    <div
      className="w-full flex flex-col"
      style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-project)',
        padding: 20,
        gap: 20,
        height: '100%',
      }}
    >
      <div
        className="w-full overflow-hidden"
        style={{ height: 300, borderRadius: 'var(--radius-pill)', background: 'var(--bg-secondary)' }}
      >
        {project.imageUrl ? (
           
          <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="unti-heading" style={{ color: 'var(--text-tertiary)' }}>
              {project.title.slice(0, 1)}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-[10px] w-full">
        <div className="flex flex-col min-w-0">
          <h2 className="unti-heading m-0 text-balance">{project.title}</h2>
          <p className="unti-meta m-0">{project.industry}</p>
        </div>
        {project.showArrow !== false && (
          <ArrowButton href={project.href || '#'} external={project.href?.startsWith('http')} as={linked ? 'span' : 'a'} />
        )}
      </div>
    </div>
  );

  return linked ? (
    <Link href={project.href!} className="flex" style={{ height: '100%' }}>
      {inner}
    </Link>
  ) : (
    inner
  );
}

export function UntiInfoCard({
  label,
  title,
  description,
  timeline,
  location,
  iconUrl,
}: {
  label: string;
  title: string;
  description?: string;
  timeline?: string;
  location?: string;
  iconUrl?: string;
}) {
  return (
    <div
      className="w-full flex flex-col"
      style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-photo)',
        padding: 20,
        gap: 10,
      }}
    >
      <div className="flex items-start" style={{ gap: 20 }}>
        {iconUrl && (
          <div
            className="shrink-0 overflow-hidden rounded-[10px]"
            style={{ width: 40, height: 40, background: 'var(--bg-secondary)' }}
          >
            { }
            <img src={iconUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex flex-col gap-[5px] min-w-0">
          <p className="unti-meta m-0">{label}</p>
          <h3 className="unti-heading m-0 text-balance">{title}</h3>
        </div>
      </div>
      {description && (
        <p className="unti-body m-0 text-pretty" style={{ fontSize: 16 }}>
          {description}
        </p>
      )}
      {(timeline || location) && (
        <div className="flex flex-wrap items-center" style={{ gap: 20 }}>
          {timeline && (
            <span className="inline-flex items-center gap-[5px]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-secondary)' }} aria-hidden>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              <span className="unti-meta-sm" style={{ color: 'var(--text-secondary)' }}>
                {timeline}
              </span>
            </span>
          )}
          {location && (
            <span className="inline-flex items-center gap-[5px]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-secondary)' }} aria-hidden>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                <path d="M2 12h20" />
              </svg>
              <span className="unti-meta-sm" style={{ color: 'var(--text-secondary)' }}>
                {location}
              </span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function UntiCertCard({ title, date, link }: { title: string; date?: string; link?: string }) {
  return (
    <div
      className="w-full flex items-center justify-between"
      style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-photo)',
        padding: 20,
        gap: 20,
      }}
    >
      <div className="flex flex-col min-w-0">
        <h3 className="unti-heading m-0 text-balance">{title}</h3>
        {date && (
          <span className="inline-flex items-center gap-[5px] mt-[5px]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-secondary)' }} aria-hidden>
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <span className="unti-meta-sm">{date}</span>
          </span>
        )}
      </div>
      {link && <ArrowButton href={link} external />}
    </div>
  );
}

export function UntiToolCard({
  name,
  description,
  iconUrl,
  href,
}: {
  name: string;
  description?: string;
  iconUrl?: string;
  href?: string;
}) {
  const inner = (
    <div
      className="w-full flex items-center"
      style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-photo)',
        padding: 20,
        gap: 20,
        height: '100%',
      }}
    >
      <div
        className="shrink-0 overflow-hidden rounded-[10px] flex items-center justify-center"
        style={{ width: 60, height: 40, background: 'var(--bg-secondary)' }}
      >
        {iconUrl ? (
           
          <img src={iconUrl} alt="" className="max-w-full max-h-full object-contain" />
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-secondary)' }} aria-hidden>
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        )}
      </div>
      <div className="flex flex-col gap-[5px] min-w-0">
        <h3 className="unti-heading m-0" style={{ fontSize: 18 }}>
          {name}
        </h3>
        {description && <p className="unti-meta-sm m-0">{description}</p>}
      </div>
    </div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex" style={{ height: '100%' }}>
      {inner}
    </a>
  ) : (
    inner
  );
}
