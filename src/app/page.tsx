'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/I18nProvider';
import { UntiPage, UntiSection, UntiCard, SectionPill } from '@/components/unti/UntiPrimitives';
import { UntiHero, UntiOverview, UntiProjectCard, UntiInfoCard, UntiCertCard, UntiToolCard } from '@/components/unti/UntiSections';

const safeFetch = (url: string) =>
  fetch(url)
    .then((r) => (r.ok ? r.json() : []))
    .catch(() => []);

const safeFetchObj = (url: string) =>
  fetch(url)
    .then((r) => (r.ok ? r.json() : {}))
    .catch(() => ({}));

interface RowData {
  label: string;
  content: string;
  href: string;
  newTab?: boolean;
}

export default function UntiHome() {
  const { t, l } = useLanguage();
  const [data, setData] = useState<{
    sections: Record<string, unknown>[];
    projects: Record<string, unknown>[];
    experiences: Record<string, unknown>[];
    education: Record<string, unknown>[];
    certifications: Record<string, unknown>[];
    skills: Record<string, unknown>[];
    settings: Record<string, string>;
  } | null>(null);

  useEffect(() => {
    Promise.all([
      safeFetch('/api/sections'),
      safeFetch('/api/projects'),
      safeFetch('/api/experiences'),
      safeFetch('/api/education'),
      safeFetch('/api/certifications'),
      safeFetch('/api/skills'),
      safeFetchObj('/api/settings'),
    ]).then(([sections, projects, experiences, education, certifications, skills, settings]) => {
      setData({ sections, projects, experiences, education, certifications, skills, settings });
    });
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="unti-pill">Loading…</div>
      </div>
    );
  }

  const settings = data.settings || {};
  const findSection = (slug: string): Record<string, unknown> =>
    (data.sections || []).find((s) => s.slug === slug) || {};

  const hero = findSection('hero');
  const about = findSection('about');
  const projectsRow = findSection('projects');
  const experienceRow = findSection('experience');
  const educationRow = findSection('education');
  const skillsRow = findSection('skills');
  const contactRow = findSection('contact');
  const name: string = (hero.title as string) || 'Adam Ghazy Al Falah';
  const role: string = (hero.content as string) || 'Mobile, Frontend & Backend Developer';

  const projects = (data.projects || []).slice(0, 4);
  const experiences = data.experiences || [];
  const education = data.education || [];
  const certifications = data.certifications || [];
  const skills = data.skills || [];

  const categories: string[] = [];
  for (const skill of skills) {
    const category = (skill.description as string) || 'Other';
    if (!categories.includes(category)) categories.push(category);
  }

  const footerRows: RowData[] = [
    settings.email && { label: 'E-mail', content: settings.email, href: `mailto:${settings.email}` },
    settings.phone && { label: 'Phone', content: settings.phone, href: `tel:${settings.phone.replace(/[^+\d]/g, '')}` },
    settings.linkedin && { label: 'LinkedIn', content: '/in/adamghazy', href: settings.linkedin, newTab: true },
    settings.location && { label: 'Location', content: settings.location, href: '#' },
  ].filter(Boolean) as RowData[];

  return (
    <UntiPage
      location={settings.location || 'Madiun, Indonesia'}
      rows={footerRows}
      copyright={`2026 © ${name}`}
    >
      <UntiHero
        name={name}
        role={role}
        photoUrl={hero.image_url as string}
      />

      <UntiOverview
        title={l(projectsRow, 'title') || t('sections.projects_title', 'Projects')}
        paragraphs={[l(about, 'subtitle'), l(about, 'content')].filter(Boolean) as string[]}
      />

      <UntiSection>
        <UntiCard>
          <div className="flex items-center justify-between gap-[10px]">
            <SectionPill label={l(projectsRow, 'title') || t('sections.projects_title', 'Projects')} />
            <Link
              href="/projects"
              className="inline-flex items-center gap-[5px] transition-opacity hover:opacity-70"
              style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.2, color: 'var(--text-secondary)' }}
            >
              {t('common.see_all', 'See All')}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
            {projects.map((project) => (
              <UntiProjectCard
                key={project.id as number}
                project={{
                  id: project.id as number,
                  title: (l(project, 'title') as string) || '',
                  industry: (project.tags as string)?.split(',')[0]?.trim(),
                  imageUrl:
                    (project.media as { url: string }[] | undefined)?.[0]?.url ||
                    (project.image_url as string) ||
                    undefined,
                  href: '/projects',
                  showArrow: false,
                }}
              />
            ))}
          </div>
        </UntiCard>
      </UntiSection>

      <UntiSection>
        <UntiCard>
          <SectionPill label={l(experienceRow, 'title') || t('sections.experience_title', 'Experience')} />
          <div className="flex flex-col gap-[10px]">
            {experiences.map((exp) => (
              <UntiInfoCard
                key={exp.id as number}
                label={exp.company as string}
                title={(l(exp, 'position') as string) || ''}
                description={(l(exp, 'description') as string) || ''}
                timeline={exp.period as string}
                location={exp.location as string}
              />
            ))}
          </div>
        </UntiCard>
      </UntiSection>

      <UntiSection>
        <UntiCard>
          <SectionPill label={l(educationRow, 'title') || t('sections.education_title', 'Education')} />
          <div className="flex flex-col gap-[10px]">
            {education.map((edu) => (
              <UntiInfoCard
                key={edu.id as number}
                label={edu.institution as string}
                title={(l(edu, 'degree') as string) || ''}
                description={(l(edu, 'description') as string) || ''}
                timeline={edu.period as string}
                location={edu.location as string}
              />
            ))}
          </div>
        </UntiCard>
      </UntiSection>

      <UntiSection>
        <UntiCard>
          <SectionPill label={l(educationRow, 'content') || t('sections.certification_title', 'Certification')} />
          <div className="flex flex-col gap-[10px]">
            {certifications.map((cert) => (
              <UntiCertCard
                key={cert.id as number}
                title={(l(cert, 'title') as string) || ''}
                date={cert.issue_date as string}
              />
            ))}
          </div>
        </UntiCard>
      </UntiSection>

      <UntiSection>
        <UntiCard>
          <SectionPill label={l(skillsRow, 'title') || t('sections.skills_title', 'Tools')} />
          {categories.map((category) => (
            <div key={category} className="flex flex-col gap-[10px]">
              <h3 className="unti-heading m-0" style={{ fontSize: 16, color: 'var(--text-secondary)' }}>
                {category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
                {skills
                  .filter((skill) => ((skill.description as string) || 'Other') === category)
                  .map((skill) => (
                    <UntiToolCard
                      key={skill.id as number}
                      name={skill.title as string}
                      iconUrl={(skill.icon as string) || undefined}
                    />
                  ))}
              </div>
            </div>
          ))}
        </UntiCard>
      </UntiSection>
    </UntiPage>
  );
}
