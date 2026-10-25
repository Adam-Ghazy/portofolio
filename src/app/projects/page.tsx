'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/I18nProvider';
import { UntiPage, UntiSection, UntiCard, SectionPill } from '@/components/unti/UntiPrimitives';
import { UntiProjectCard, ArrowButton } from '@/components/unti/UntiSections';

interface ProjectItem {
  id?: number;
  title: string;
  title_id?: string;
  description: string;
  description_id?: string;
  year?: string;
  role?: string;
  role_id?: string;
  tags?: string;
  link?: string;
  image_url?: string;
  media?: { url: string; media_type?: string }[];
}

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 1,
    title: 'FoodLAB - Campus Food Ordering Platform',
    title_id: 'FoodLAB - Platform Pemesanan Makanan Kampus',
    role: 'Mobile App Developer (Flutter)',
    year: '2023 - 2025',
    tags: 'Flutter, Dart, Provider, REST API, Push Notifications',
    description:
      'A production campus food ordering platform built to eliminate physical canteen queues and streamline vendor order management at PENS.',
    description_id:
      'Platform pemesanan makanan kantin kampus yang dibangun untuk mengeliminasi antrean panjang dan mempermudah pengelolaan pesanan stan penjual di PENS.',
  },
  {
    id: 2,
    title: 'Real-Time Queue Management System',
    title_id: 'Sistem Manajemen Antrean Real-Time',
    role: 'Mobile App Developer (Flutter)',
    year: '2024',
    tags: 'Flutter, Dart, REST API, WebSocket, Real-Time Sync',
    description:
      'A real-time public service queue management mobile application deployed at the Gebang Putih Urban Village Office, Surabaya.',
    description_id:
      'Aplikasi mobile manajemen antrean pelayanan publik real-time yang diterapkan di Kantor Kelurahan Gebang Putih, Surabaya.',
  },
];

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

      {loading ? (
        <UntiSection>
          <UntiCard>
            <div className="unti-pill">Loading…</div>
          </UntiCard>
        </UntiSection>
      ) : (
        projects.map((project, idx) => {
          const next = projects[(idx + 1) % projects.length];
          const media = (project.media || []).map((m) => m.url).filter(Boolean);
          const hero = media[0] || project.image_url || undefined;
          return (
            <div key={project.id} className="flex flex-col gap-[10px]">
              <UntiSection>
                <UntiCard gap={20}>
                  <h1 className="unti-title m-0 text-balance">
                    {(l(project, 'title') as string) || project.title}
                  </h1>

                  <div className="grid grid-cols-2 gap-[10px]">
                    <MetaCell label={t('projects.industry', 'Industry')} value={(project.tags as string)?.split(',')[0]?.trim()} />
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

              {(media.length > 0 ? media : hero ? [hero] : []).map((url, i) => (
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
                      { }
                      <img src={url} alt={`${project.title} ${i + 1}`} className="w-full object-cover" loading="lazy" />
                    </div>
                  </div>
                </UntiSection>
              ))}

              <UntiSection>
                <UntiCard>
                  <SectionPill label={t('projects.next_project', 'Next Project')} />
                  <UntiProjectCard
                    project={{
                      id: next.id,
                      title: (l(next, 'title') as string) || next.title,
                      industry: (next.tags as string)?.split(',')[0]?.trim(),
                      imageUrl: (next.media as { url: string }[] | undefined)?.[0]?.url || next.image_url || undefined,
                      href: '/projects',
                    }}
                  />
                </UntiCard>
              </UntiSection>

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
            </div>
          );
        })
      )}
    </UntiPage>
  );
}
