'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/I18nProvider';
import { UntiPage, UntiSection, UntiCard, SectionPill } from '@/components/unti/UntiPrimitives';
import { UntiInfoCard, UntiCertCard } from '@/components/unti/UntiSections';

interface StatItem {
  id?: number;
  value: string;
  label: string;
  label_id?: string;
}

const DEFAULT_STATS: StatItem[] = [
  { id: 1, value: '1+ yr', label: 'Hands-on Experience', label_id: 'Pengalaman Praktis' },
  { id: 2, value: '3+', label: 'Production Systems Built', label_id: 'Sistem Produksi' },
  { id: 3, value: '300+', label: 'Active Users Served', label_id: 'Pengguna Aktif Dilayani' },
  { id: 4, value: '2', label: 'Play Store Apps Published', label_id: 'Aplikasi Play Store Rilis' },
];

interface EducationItem {
  id?: number;
  degree: string;
  degree_id?: string;
  institution: string;
  location: string;
  period: string;
  gpa?: string;
  description?: string;
  description_id?: string;
}

const DEFAULT_EDUCATION: EducationItem[] = [
  {
    degree: 'Bachelor of Applied Informatics Engineering',
    degree_id: 'Sarjana Terapan Teknik Informatika',
    institution: 'Electronic Engineering Polytechnic Institute of Surabaya (PENS)',
    location: 'Surabaya, Indonesia',
    period: 'June 2024 - July 2025',
    gpa: '3.58 / 4.00',
  },
  {
    degree: 'Diploma in Informatics Engineering',
    degree_id: 'Diploma Teknik Informatika',
    institution: 'Electronic Engineering Polytechnic Institute of Surabaya (PENS)',
    location: 'Surabaya, Indonesia',
    period: 'June 2021 - June 2024',
    gpa: '3.69 / 4.00',
  },
];

export default function AboutPage() {
  const { t, l, locale } = useLanguage();
  const [stats, setStats] = useState<StatItem[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [certs, setCerts] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    fetch('/api/about-stats').then((r) => (r.ok ? r.json() : [])).then(setStats).catch(() => {});
    fetch('/api/settings').then((r) => (r.ok ? r.json() : {})).then(setSettings).catch(() => {});
    fetch('/api/education').then((r) => (r.ok ? r.json() : [])).then(setEducation).catch(() => {});
    fetch('/api/certifications').then((r) => (r.ok ? r.json() : [])).then(setCerts).catch(() => {});
  }, []);

  const displayStats = stats.length > 0 ? stats : DEFAULT_STATS;
  const displayEducation = education.length > 0 ? education : DEFAULT_EDUCATION;
  const name: string = settings.site_title?.split(' - ')[0] || 'Adam Ghazy Al Falah';

  const footerRows = [
    settings.email && { label: 'E-mail', content: settings.email, href: `mailto:${settings.email}` },
    settings.phone && { label: 'Phone', content: settings.phone, href: `tel:${settings.phone.replace(/[^+\d]/g, '')}` },
    settings.linkedin && { label: 'LinkedIn', content: '/in/adamghazy', href: settings.linkedin, newTab: true },
    settings.location && { label: 'Location', content: settings.location, href: '#' },
  ].filter(Boolean) as { label: string; content: string; href: string; newTab?: boolean }[];

  const bioParagraphs =
    locale === 'id'
      ? [
          'Saya adalah pengembang perangkat lunak lulusan baru dengan pengalaman lebih dari 1 tahun membangun dan merilis aplikasi tingkat produksi di bidang mobile, frontend, dan backend.',
          'Pengalaman rekayasa saya mencakup digitalisasi alur kerja inspeksi QA/QC dan logistik perusahaan selama magang di PT. Industri Kereta Api (Persero) / PT INKA, membangun sistem manajemen antrean real-time untuk pelayanan publik pemerintahan di Kantor Kelurahan Gebang Putih, serta meluncurkan FoodLAB - platform pemesanan makanan kantin kampus yang berhasil meraih pendanaan universitas Rp20 Juta dan melayani 300+ pengguna aktif lintas 10+ penjual makanan.',
          'Saya memprioritaskan arsitektur bersih, pengetikan ketat, pengalaman pengguna yang responsif, dan dampak operasional terukur - menghadirkan perangkat lunak andal yang memangkas friksi manual.',
        ]
      : [
          'I am a fresh graduate software engineer with over 1 year of hands-on experience building and deploying production-grade applications across mobile, frontend, and backend environments.',
          'My engineering experience includes digitalizing enterprise QA/QC and logistics workflows during an internship at PT. Industri Kereta Api (Persero) / PT INKA, building a real-time queue management system for public government administration at the Gebang Putih Urban Village Office, and launching FoodLAB - a campus food ordering mobile platform that secured IDR 20M university funding and served 300+ active users across 10+ food vendors.',
          'I prioritize clean architecture, strict typing, responsive user experiences, and measurable operational impact - delivering reliable software that reduces manual friction.',
        ];

  return (
    <UntiPage
      location={settings.location || 'Madiun, Indonesia'}
      rows={footerRows}
      copyright={`2026 © ${name}`}
    >
      <UntiSection>
        <UntiCard>
          <h1 className="unti-title m-0 text-balance">{name}</h1>
          <p className="unti-heading m-0" style={{ color: 'var(--text-secondary)' }}>
            Mobile, Frontend & Backend Developer / {settings.location || 'Madiun, Indonesia'}
          </p>
        </UntiCard>
      </UntiSection>

      <UntiSection>
        <UntiCard>
          <SectionPill label={t('sections.about_badge', 'Overview')} />
          <div className="flex flex-col gap-[20px]">
            {bioParagraphs.map((text, i) => (
              <p key={i} className="unti-body m-0 text-pretty">
                {text}
              </p>
            ))}
          </div>
        </UntiCard>
      </UntiSection>

      <UntiSection>
        <UntiCard>
          <SectionPill label={locale === 'id' ? 'Statistik' : 'Stats'} />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-[10px]">
            {displayStats.map((stat) => (
              <div
                key={stat.id || stat.label}
                className="flex flex-col gap-[5px]"
                style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-photo)', padding: 20, border: '1px solid var(--border-subtle)' }}
              >
                <span className="unti-heading">{stat.value}</span>
                <span className="unti-meta-sm">{l(stat, 'label')}</span>
              </div>
            ))}
          </div>
        </UntiCard>
      </UntiSection>

      <UntiSection>
        <UntiCard>
          <SectionPill label={t('education.academic_degrees', 'Education')} />
          <div className="flex flex-col gap-[10px]">
            {displayEducation.map((edu, idx) => (
              <UntiInfoCard
                key={edu.id || idx}
                label={edu.institution}
                title={(l(edu, 'degree') as string) || edu.degree}
                description={(l(edu, 'description') as string) || edu.description}
                timeline={edu.period}
                location={edu.gpa ? `${edu.location} · GPA ${edu.gpa}` : edu.location}
              />
            ))}
          </div>
        </UntiCard>
      </UntiSection>

      {certs.length > 0 && (
        <UntiSection>
          <UntiCard>
            <SectionPill label={t('sections.certification_title', 'Certification')} />
            <div className="flex flex-col gap-[10px]">
              {certs.map((cert) => (
                <UntiCertCard
                  key={cert.id as number}
                  title={(l(cert, 'title') as string) || (cert.title as string)}
                  date={cert.issue_date as string}
                />
              ))}
            </div>
          </UntiCard>
        </UntiSection>
      )}
    </UntiPage>
  );
}
