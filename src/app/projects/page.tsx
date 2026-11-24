'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/I18nProvider';
import { UntiPage, UntiSection, UntiCard, SectionPill } from '@/components/unti/UntiPrimitives';
import { UntiProjectCard } from '@/components/unti/UntiSections';
import { DEFAULT_PROJECTS, type ProjectItem } from '@/lib/project-data';

export default function ProjectsPage() {
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
            href="/"
            aria-label="Back"
            className="inline-flex items-center justify-center transition-opacity hover:opacity-70"
            style={{ width: 40, height: 40, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-pill)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-primary)' }} aria-hidden>
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>
      </UntiSection>

      <UntiSection>
        <UntiCard>
          <SectionPill label={t('sections.projects_title', 'Projects & Case Studies')} />
          {loading ? (
            <div className="unti-pill">Loading…</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
              {projects.map((project) => (
                <UntiProjectCard
                  key={project.id}
                  project={{
                    id: project.id,
                    title: (l(project, 'title') as string) || project.title,
                    industry: project.tags?.split(',')[0]?.trim(),
                    imageUrl: project.media?.[0]?.url || project.image_url || undefined,
                    href: `/projects/${project.id}`,
                  }}
                />
              ))}
            </div>
          )}
        </UntiCard>
      </UntiSection>
    </UntiPage>
  );
}
