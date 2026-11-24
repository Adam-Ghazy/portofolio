'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/components/I18nProvider';
import { UntiPage, UntiSection, UntiCard } from '@/components/unti/UntiPrimitives';
import { ArrowButton } from '@/components/unti/UntiSections';
import { DEFAULT_PROJECTS, type ProjectItem } from '@/lib/project-data';

function MetaCell({ label, value }: { label: string; value?: string }) {
  return (
    <div
      className="flex flex-col gap-[5px]"
      style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-photo)', padding: 20 }}
    >
      <span className="unti-meta-sm">{label}</span>
      <span className="unti-meta" style={{ color: 'var(--text-primary)' }}>
        {value || '—'}
      </span>
    </div>
  );
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, l } = useLanguage();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/projects').then((r) => (r.ok ? r.json() : [])),
      fetch('/api/settings').then((r) => (r.ok ? r.json() : {})),
    ])
      .then(([projectsData, settingsData]) => {
        setProjects(projectsData && projectsData.length > 0 ? projectsData : DEFAULT_PROJECTS);
        setSettings(settingsData || {});
      })
      .catch(() => setProjects(DEFAULT_PROJECTS))
      .finally(() => setLoading(false));
  }, []);

  const project = projects.find((item) => String(item.id) === id);
  const media = project?.media?.map((item) => item.url).filter(Boolean) || [];
  const images = media.length > 0 ? media : project?.image_url ? [project.image_url] : [];

  const footerRows = [
    settings.email && { label: 'E-mail', content: settings.email, href: `mailto:${settings.email}` },
    settings.phone && { label: 'Phone', content: settings.phone, href: `tel:${settings.phone.replace(/[^+\d]/g, '')}` },
    settings.linkedin && { label: 'LinkedIn', content: '/in/adamghazy', href: settings.linkedin, newTab: true },
    settings.location && { label: 'Location', content: settings.location, href: '#' },
  ].filter(Boolean) as { label: string; content: string; href: string; newTab?: boolean }[];

  return (
    <UntiPage
      location={settings.location || 'Madiun, Indonesia'}
      rows={footerRows}
      copyright={`2026 © ${settings.site_title?.split(' - ')[0] || 'Adam Ghazy Al Falah'}`}
    >
      <UntiSection noAppear>
        <div style={{ maxWidth: 760, width: '100%', marginInline: 'auto' }}>
          <Link
            href="/projects"
            aria-label="Back to all projects"
            className="inline-flex items-center justify-center transition-opacity hover:opacity-70"
            style={{ width: 40, height: 40, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-pill)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-primary)' }} aria-hidden>
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>
      </UntiSection>

      {loading ? (
        <UntiSection>
          <UntiCard><div className="unti-pill">Loading…</div></UntiCard>
        </UntiSection>
      ) : !project ? (
        <UntiSection>
          <UntiCard>
            <p className="unti-heading m-0">{t('projects.not_found', 'Project not found')}</p>
            <Link href="/projects" className="unti-meta">{t('projects.all_projects', 'All projects')}</Link>
          </UntiCard>
        </UntiSection>
      ) : (
        <>
          <UntiSection>
            <UntiCard gap={20}>
              <h1 className="unti-title m-0 text-balance">
                {(l(project, 'title') as string) || project.title}
              </h1>

              <div className="grid grid-cols-2 gap-[10px]">
                <MetaCell label={t('projects.industry', 'Industry')} value={project.tags?.split(',')[0]?.trim()} />
                <MetaCell label={t('projects.year', 'Year')} value={project.year} />
                <MetaCell label={t('projects.client', 'Client')} value={(l(project, 'title') as string)?.split(' - ')[0]} />
                <MetaCell label={t('projects.services', 'Services')} value={(l(project, 'role') as string) || project.role} />
              </div>

              <div className="flex flex-col gap-[5px]">
                <span className="unti-meta-sm">{t('projects.description', 'Description')}</span>
                <p className="unti-body m-0 text-pretty">
                  {(l(project, 'description') as string) || project.description}
                </p>
              </div>
            </UntiCard>
          </UntiSection>

          {images.map((url, i) => (
            <UntiSection key={i}>
              <div
                className="overflow-hidden"
                style={{
                  borderRadius: 'var(--radius-card)',
                  maxWidth: 760,
                  width: '100%',
                  marginInline: 'auto',
                  background: 'var(--bg-card)',
                  padding: 20,
                }}
              >
                <div className="overflow-hidden" style={{ borderRadius: 'var(--radius-photo)' }}>
                  <img src={url} alt={`${project.title} ${i + 1}`} className="w-full object-cover" loading="lazy" />
                </div>
              </div>
            </UntiSection>
          ))}

          {project.link && !project.link.includes('play.google.com') && (
            <UntiSection>
              <UntiCard>
                <div className="flex items-center justify-between gap-[10px]">
                  <span className="unti-heading">{t('common.visit_project', 'Visit Project')}</span>
                  <ArrowButton href={project.link} external />
                </div>
              </UntiCard>
            </UntiSection>
          )}
        </>
      )}
    </UntiPage>
  );
}
