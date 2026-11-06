'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/I18nProvider';
import { UntiPage, UntiSection, UntiCard, SectionPill } from '@/components/unti/UntiPrimitives';
import { UntiInfoCard } from '@/components/unti/UntiSections';

interface SystemItem {
  title: string;
  title_id?: string;
  tagline?: string;
  tagline_id?: string;
  description: string;
  description_id?: string;
  tech?: string;
}

interface ExperienceItem {
  id?: number;
  company: string;
  position: string;
  position_id?: string;
  program?: string;
  program_id?: string;
  location: string;
  period: string;
  description: string;
  description_id?: string;
  systems?: string;
  systems_id?: string;
  technologies?: string;
}

const DEFAULT_EXPERIENCES: ExperienceItem[] = [
  {
    company: 'PT. Industri Kereta Api (Persero)',
    position: 'Junior Software Developer Intern',
    position_id: 'Junior Software Developer Intern',
    program: 'Magang Nasional Batch 2',
    program_id: 'Magang Nasional Batch 2',
    location: 'Madiun, Indonesia',
    period: 'November 2025 - May 2026',
    description:
      "Contributed to the digitalization of enterprise workflows for Indonesia's national rolling stock manufacturer. Worked across QA/QC, Logistics, Operations, and Security departments on two production internal systems.",
    description_id:
      'Berkolaborasi dengan tim lintas fungsi yang melibatkan Engineering, Operasi, dan Logistik. Terlibat dalam pengumpulan kebutuhan, perancangan alur kerja digital, integrasi REST API, sinkronisasi data, dan penyebaran produksi.',
    technologies: 'Laravel, PHP, REST API, Data Synchronization, MySQL, Agile/Scrum',
    systems: JSON.stringify([
      {
        title: 'Paperless Inspection System',
        tagline: 'QA/QC Workflow Digitalization',
        description:
          'Contributed to building a digital inspection system replacing manual paper-based QA/QC documentation. Enabled real-time digital recording, approval, and cross-department tracking.',
        tech: 'Laravel, REST API, Data Synchronization, MySQL',
      },
      {
        title: 'Surat Jalan Online',
        tagline: 'Delivery-Order Digitalization',
        description:
          'Contributed to the digitalization of the delivery-order process connecting PPO, Logistics, Security, and external courier teams with structured digital workflows and live status tracking.',
        tech: 'Laravel, REST API, Workflow Automation',
      },
    ]),
    systems_id: JSON.stringify([
      {
        title: 'Paperless Inspection System',
        tagline: 'Digitalisasi Inspeksi QA/QC',
        description:
          'Berkontribusi dalam pengembangan sistem inspeksi digital untuk alur kerja QA/QC. Menggantikan dokumentasi berbasis kertas manual dengan alur kerja digital terstruktur guna mengurangi galat pencatatan dan meningkatkan efisiensi proses inspeksi.',
        tech: 'Laravel, REST API, Data Synchronization, MySQL',
      },
      {
        title: 'Surat Jalan Online',
        tagline: 'Digitalisasi Surat Jalan & Logistik',
        description:
          'Berkontribusi dalam digitalisasi sistem Surat Jalan Online untuk mempermudah alur pesanan pengiriman antardivisi PPO, Logistik, Keamanan, dan kurir eksternal.',
        tech: 'Laravel, REST API, Workflow Automation',
      },
    ]),
  },
];

function parseSystems(raw?: string): SystemItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SystemItem[]) : [];
  } catch {
    return [];
  }
}

export default function ExperiencePage() {
  const { t, l, locale } = useLanguage();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [section, setSection] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/experiences').then((r) => (r.ok ? r.json() : [])),
      fetch('/api/settings').then((r) => (r.ok ? r.json() : {})),
      fetch('/api/sections?slug=experience').then((r) => (r.ok ? r.json() : {})),
    ])
      .then(([expData, settingsData, sectionData]) => {
        setExperiences(Array.isArray(expData) && expData.length > 0 ? expData : DEFAULT_EXPERIENCES);
        setSettings(settingsData || {});
        setSection(sectionData || {});
      })
      .catch(() => setExperiences(DEFAULT_EXPERIENCES))
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
      <UntiSection>
        <UntiCard>
          <h1 className="unti-title m-0 text-balance">
            {l(section, 'title') || t('nav.experience', 'Experience')}
          </h1>
          <p className="unti-body m-0 text-pretty">
            {l(section, 'subtitle') ||
              (locale === 'id'
                ? 'Pengalaman kerja, sistem produksi yang dikerjakan, dan teknologi yang digunakan.'
                : 'Work experience, production systems built, and the technologies behind them.')}
          </p>
        </UntiCard>
      </UntiSection>

      {loading ? (
        <UntiSection>
          <UntiCard>
            <div className="unti-pill">Loading…</div>
          </UntiCard>
        </UntiSection>
      ) : (
        experiences.map((exp) => {
          const systems = parseSystems(locale === 'id' ? exp.systems_id || exp.systems : exp.systems);
          return (
            <UntiSection key={exp.id || exp.company}>
              <UntiCard>
                <SectionPill label={exp.program || exp.company} />
                <div className="flex flex-col gap-[10px]">
                  <UntiInfoCard
                    label={exp.company}
                    title={(l(exp, 'position') as string) || exp.position}
                    description={(l(exp, 'description') as string) || exp.description}
                    timeline={exp.period}
                    location={exp.location}
                  />

                  {systems.map((system) => (
                    <div
                      key={system.title}
                      className="w-full flex flex-col"
                      style={{
                        background: 'var(--bg-card)',
                        borderRadius: 'var(--radius-photo)',
                        padding: 20,
                        gap: 10,
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div className="flex flex-col gap-[5px]">
                        <h3 className="unti-heading m-0" style={{ fontSize: 18 }}>
                          {(l(system, 'title') as string) || system.title}
                        </h3>
                        {(l(system, 'tagline') as string) && (
                          <p className="unti-meta-sm m-0">{l(system, 'tagline')}</p>
                        )}
                      </div>
                      <p className="unti-meta m-0 text-pretty" style={{ lineHeight: 1.4 }}>
                        {l(system, 'description') || system.description}
                      </p>
                      {system.tech && (
                        <div className="flex flex-wrap gap-[5px] mt-[5px]">
                          {system.tech.split(',').map((tech, i) => (
                            <span key={i} className="unti-pill" style={{ fontSize: 13, padding: '8px 10px' }}>
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {exp.technologies && (
                    <div className="flex flex-wrap gap-[5px] mt-[5px]">
                      {exp.technologies.split(',').map((tech, i) => (
                        <span key={i} className="unti-pill" style={{ fontSize: 13, padding: '8px 10px' }}>
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </UntiCard>
            </UntiSection>
          );
        })
      )}
    </UntiPage>
  );
}
