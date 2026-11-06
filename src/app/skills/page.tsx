'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/components/I18nProvider';
import { UntiPage, UntiSection, UntiCard, SectionPill } from '@/components/unti/UntiPrimitives';
import { UntiToolCard } from '@/components/unti/UntiSections';

interface SkillItem {
  id: number | string;
  title: string;
  description: string;
  description_id?: string;
  icon?: string;
  sort_order?: number;
  is_active?: number;
}

const DEFAULT_STACK_ITEMS = [
  { title: 'Flutter', category: 'Programming & Development', category_id: 'Pemrograman & Pengembangan' },
  { title: 'Dart', category: 'Programming & Development', category_id: 'Pemrograman & Pengembangan' },
  { title: 'Laravel', category: 'Programming & Development', category_id: 'Pemrograman & Pengembangan' },
  { title: 'PHP', category: 'Programming & Development', category_id: 'Pemrograman & Pengembangan' },
  { title: 'React.js', category: 'Programming & Development', category_id: 'Pemrograman & Pengembangan' },
  { title: 'JavaScript', category: 'Programming & Development', category_id: 'Pemrograman & Pengembangan' },
  { title: 'HTML', category: 'Programming & Development', category_id: 'Pemrograman & Pengembangan' },
  { title: 'CSS', category: 'Programming & Development', category_id: 'Pemrograman & Pengembangan' },
  { title: 'REST API', category: 'Backend & API', category_id: 'Backend & API' },
  { title: 'API Integration', category: 'Backend & API', category_id: 'Backend & API' },
  { title: 'WebSocket', category: 'Backend & API', category_id: 'Backend & API' },
  { title: 'MySQL', category: 'Database', category_id: 'Basis Data' },
  { title: 'Git', category: 'Tools & Infrastructure', category_id: 'Alat & Infrastruktur' },
  { title: 'Docker', category: 'Tools & Infrastructure', category_id: 'Alat & Infrastruktur' },
  { title: 'Firebase', category: 'Tools & Infrastructure', category_id: 'Alat & Infrastruktur' },
  { title: 'Agile', category: 'Development Practices', category_id: 'Metodologi Pengembangan' },
  { title: 'Scrum', category: 'Development Practices', category_id: 'Metodologi Pengembangan' },
  { title: 'Debugging', category: 'Development Practices', category_id: 'Metodologi Pengembangan' },
  { title: 'AI Coding Agents', category: 'Development Practices', category_id: 'Metodologi Pengembangan' },
];

const DEFAULT_SOFT_SKILLS: Record<'en' | 'id', string[]> = {
  en: ['Problem Solving', 'Team Collaboration', 'Stakeholder Communication', 'Adaptability', 'Time Management'],
  id: ['Pemecahan Masalah', 'Kolaborasi Tim', 'Komunikasi Pemangku Kepentingan', 'Kemampuan Adaptasi', 'Manajemen Waktu'],
};

function isSoftSkill(skill: SkillItem): boolean {
  const desc = skill.description?.toLowerCase() || '';
  const descId = skill.description_id?.toLowerCase() || '';
  return (
    desc === 'soft skills' ||
    desc === 'soft skill' ||
    descId === 'keterampilan interpersonal' ||
    descId === 'soft skills'
  );
}

export default function SkillsPage() {
  const { t, l, locale } = useLanguage();
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [section, setSection] = useState<Record<string, unknown>>({});

  useEffect(() => {
    Promise.all([
      fetch('/api/skills').then((r) => (r.ok ? r.json() : [])),
      fetch('/api/settings').then((r) => (r.ok ? r.json() : {})),
      fetch('/api/sections?slug=skills').then((r) => (r.ok ? r.json() : {})),
    ])
      .then(([skillsData, settingsData, sectionData]) => {
        setSkills(skillsData || []);
        setSettings(settingsData || {});
        setSection(sectionData || {});
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const { techByCategory, softSkills } = useMemo(() => {
    const dbSoft = skills.filter(isSoftSkill);
    const dbTech = skills.filter((s) => !isSoftSkill(s));

    const byCategory = new Map<string, { id: string | number; title: string; icon?: string }[]>();
    for (const item of DEFAULT_STACK_ITEMS) {
      const category = locale === 'id' ? item.category_id : item.category;
      const bucket = byCategory.get(category) || [];
      bucket.push({ id: `def-${item.title}`, title: item.title });
      byCategory.set(category, bucket);
    }
    for (const item of dbTech) {
      const category = (locale === 'id' && item.description_id) || item.description?.trim() || 'General';
      const bucket = byCategory.get(category) || [];
      if (!bucket.some((s) => s.title.toLowerCase() === item.title.toLowerCase())) {
        bucket.push({ id: item.id, title: item.title, icon: item.icon });
      }
      byCategory.set(category, bucket);
    }

    const soft = dbSoft.length > 0 ? dbSoft.map((s) => s.title) : DEFAULT_SOFT_SKILLS[locale];
    return { techByCategory: byCategory, softSkills: soft };
  }, [skills, locale]);

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
          <h1 className="unti-title m-0 text-balance">{l(section, 'title') || t('nav.skills', 'Skills')}</h1>
          <p className="unti-body m-0 text-pretty">
            {l(section, 'subtitle') ||
              (locale === 'id'
                ? 'Stack teknis dan praktik pengembangan yang dipakai di sistem produksi.'
                : 'Technical stack and development practices used across production systems.')}
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
        <>
          {[...techByCategory.entries()].map(([category, items]) => (
            <UntiSection key={category}>
              <UntiCard>
                <SectionPill label={category} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
                  {items.map((item) => (
                    <UntiToolCard key={item.id} name={item.title} iconUrl={item.icon || undefined} />
                  ))}
                </div>
              </UntiCard>
            </UntiSection>
          ))}

          <UntiSection>
            <UntiCard>
              <SectionPill label={locale === 'id' ? 'Keterampilan Interpersonal' : 'Soft Skills'} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
                {softSkills.map((skill) => (
                  <UntiToolCard key={skill} name={skill} />
                ))}
              </div>
            </UntiCard>
          </UntiSection>
        </>
      )}
    </UntiPage>
  );
}
