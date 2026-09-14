'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StatusBar from '@/components/StatusBar';
import Link from 'next/link';
import { useLanguage } from '@/components/I18nProvider';

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
  // Programming & Development
  { title: 'Flutter', category: 'Programming & Development', category_id: 'Pemrograman & Pengembangan' },
  { title: 'Dart', category: 'Programming & Development', category_id: 'Pemrograman & Pengembangan' },
  { title: 'Laravel', category: 'Programming & Development', category_id: 'Pemrograman & Pengembangan' },
  { title: 'PHP', category: 'Programming & Development', category_id: 'Pemrograman & Pengembangan' },
  { title: 'React.js', category: 'Programming & Development', category_id: 'Pemrograman & Pengembangan' },
  { title: 'JavaScript', category: 'Programming & Development', category_id: 'Pemrograman & Pengembangan' },
  { title: 'HTML', category: 'Programming & Development', category_id: 'Pemrograman & Pengembangan' },
  { title: 'CSS', category: 'Programming & Development', category_id: 'Pemrograman & Pengembangan' },

  // Backend & API
  { title: 'REST API', category: 'Backend & API', category_id: 'Backend & API' },
  { title: 'API Integration', category: 'Backend & API', category_id: 'Backend & API' },
  { title: 'WebSocket', category: 'Backend & API', category_id: 'Backend & API' },

  // Database
  { title: 'MySQL', category: 'Database', category_id: 'Basis Data' },

  // Tools & Infrastructure
  { title: 'Git', category: 'Tools & Infrastructure', category_id: 'Alat & Infrastruktur' },
  { title: 'Docker', category: 'Tools & Infrastructure', category_id: 'Alat & Infrastruktur' },
  { title: 'Firebase', category: 'Tools & Infrastructure', category_id: 'Alat & Infrastruktur' },

  // Development Practices
  { title: 'Agile', category: 'Development Practices', category_id: 'Metodologi Pengembangan' },
  { title: 'Scrum', category: 'Development Practices', category_id: 'Metodologi Pengembangan' },
  { title: 'Debugging', category: 'Development Practices', category_id: 'Metodologi Pengembangan' },
  { title: 'AI Coding Agents', category: 'Development Practices', category_id: 'Metodologi Pengembangan' },
];

const DEFAULT_SOFT_SKILLS_EN = [
  'Problem Solving',
  'Team Collaboration',
  'Stakeholder Communication',
  'Adaptability',
  'Time Management',
];

const DEFAULT_SOFT_SKILLS_ID = [
  'Pemecahan Masalah',
  'Kolaborasi Tim',
  'Komunikasi Pemangku Kepentingan',
  'Kemampuan Adaptasi',
  'Manajemen Waktu',
];

export default function SkillsPage() {
  const { t, l, locale } = useLanguage();
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    Promise.all([
      fetch('/api/skills').then((r) => (r.ok ? r.json() : [])),
      fetch('/api/settings').then((r) => (r.ok ? r.json() : {})),
    ])
      .then(([skillsData, settingsData]) => {
        setSkills(skillsData || []);
        setSettings(settingsData || {});
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Split Technical Skills and Soft Skills
  const { techSkills, softSkills } = useMemo(() => {
    const rawSoft = skills.filter(
      (s) =>
        s.description?.toLowerCase() === 'soft skills' ||
        s.description?.toLowerCase() === 'soft skill' ||
        s.description_id?.toLowerCase() === 'keterampilan interpersonal'
    );
    const rawTech = skills.filter(
      (s) =>
        s.description?.toLowerCase() !== 'soft skills' &&
        s.description?.toLowerCase() !== 'soft skill' &&
        s.description_id?.toLowerCase() !== 'keterampilan interpersonal'
    );

    const techMap = new Map<string, { id: string | number; title: string; category: string }>();

    // Add default items
    DEFAULT_STACK_ITEMS.forEach((item, idx) => {
      techMap.set(item.title.toLowerCase(), {
        id: `def-${idx}`,
        title: item.title,
        category: locale === 'id' ? item.category_id : item.category,
      });
    });

    // Add/override from DB
    rawTech.forEach((item) => {
      const existing = techMap.get(item.title.toLowerCase());
      const cat = locale === 'id' && item.description_id ? item.description_id : (item.description?.trim() || existing?.category || 'General');
      techMap.set(item.title.toLowerCase(), {
        id: item.id,
        title: item.title,
        category: cat,
      });
    });

    const softList =
      rawSoft.length > 0
        ? rawSoft.map((s) => s.title)
        : (locale === 'id' ? DEFAULT_SOFT_SKILLS_ID : DEFAULT_SOFT_SKILLS_EN);

    return {
      techSkills: Array.from(techMap.values()),
      softSkills: softList,
    };
  }, [skills, locale]);

  // Extract unique categories
  const allLabel = t('common.all', 'All');
  const categories = useMemo(() => {
    const cats = new Set<string>();
    techSkills.forEach((s) => {
      if (s.category) cats.add(s.category);
    });
    return [allLabel, ...Array.from(cats)];
  }, [techSkills, allLabel]);

  const filteredTechSkills = useMemo(() => {
    if (selectedCategory === 'All' || selectedCategory === allLabel) return techSkills;
    return techSkills.filter(
      (s) => s.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [techSkills, selectedCategory, allLabel]);

  return (
    <div className="min-h-screen flex flex-col pb-6" style={{ background: 'var(--bg-primary)' }}>
      <Header />
      
      <main className="flex-1 pt-24">
        {/* Header */}
        <section className="px-6 md:px-8 py-16 md:py-24">
          <div className="max-w-[1200px] mx-auto">
            <span className="font-mono text-[11px] tracking-wider uppercase block mb-3" style={{ color: 'var(--text-tertiary)' }}>
              {t('sections.skills_badge', '01 // stack & competencies')}
            </span>
            <h1 className="text-[36px] md:text-[52px] font-semibold tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              {locale === 'id' ? 'Keahlian & Tumpukan Teknologi' : 'Skills & Tech Stack'}
            </h1>
            <p className="text-[16px] md:text-[18px] leading-relaxed max-w-[660px]" style={{ color: 'var(--text-secondary)' }}>
              {locale === 'id'
                ? 'Rincian bahasa pemrograman, framework, arsitektur backend, basis data, dan metodologi pengembangan yang saya gunakan dalam produksi.'
                : 'A realistic breakdown of programming languages, frameworks, backend architectures, databases, and development workflows I use in production.'}
            </p>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="px-6 md:px-8 py-16 md:py-24" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
              <div>
                <span className="font-mono text-[11px] tracking-wider uppercase block mb-3" style={{ color: 'var(--text-tertiary)' }}>
                  {t('sections.skills_badge', '02 // technical toolkit')}
                </span>
                <h2 className="text-[24px] md:text-[30px] font-medium tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  {locale === 'id' ? 'Teknologi Utama' : 'Core Technologies'}
                </h2>
              </div>

              {/* Category Filter Tabs */}
              {categories.length > 2 && (
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const isAll = cat === 'All' || cat === allLabel;
                    const isActive = selectedCategory === cat || (isAll && (selectedCategory === 'All' || selectedCategory === allLabel));
                    const count = isAll
                      ? techSkills.length
                      : techSkills.filter((s) => s.category.toLowerCase() === cat.toLowerCase()).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className="font-mono text-[11px] px-3.5 py-1.5 rounded border transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                        style={{
                          background: isActive ? 'var(--accent)' : 'var(--bg-card)',
                          color: isActive ? 'var(--accent-contrast, #ffffff)' : 'var(--text-secondary)',
                          borderColor: isActive ? 'var(--accent)' : 'var(--border-color)',
                        }}
                      >
                        <span>{cat}</span>
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded font-mono opacity-80"
                          style={{
                            background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'var(--bg-secondary)',
                            color: isActive ? 'var(--accent-contrast, #ffffff)' : 'var(--text-tertiary)',
                          }}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {loading ? (
              <p className="font-mono text-sm text-muted-foreground">{t('common.loading', 'Loading stack...')}</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {filteredTechSkills.map((tech) => (
                  <div
                    key={tech.id}
                    className="rounded-xl px-4 py-3.5 flex items-center justify-between border transition-all duration-200 hover:border-[var(--accent)] cursor-default group"
                    style={{
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                      background: 'var(--bg-card)',
                    }}
                  >
                    <span className="font-mono text-[13px] font-medium">{tech.title}</span>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded border opacity-60 group-hover:opacity-100" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-tertiary)' }}>
                      {tech.category.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Soft Skills Section */}
        {softSkills.length > 0 && (
          <section className="px-6 md:px-8 py-16 md:py-24">
            <div className="max-w-[1200px] mx-auto">
              <span className="font-mono text-[11px] tracking-wider uppercase block mb-3" style={{ color: 'var(--text-tertiary)' }}>
                {t('sections.skills_badge', '03 // collaboration')}
              </span>
              <h2 className="text-[24px] md:text-[30px] font-medium tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
                {locale === 'id' ? 'Keterampilan Interpersonal & Kolaborasi' : 'Soft Skills & Interpersonal Strengths'}
              </h2>
              <p className="text-[14px] md:text-[15px] mb-8 max-w-[600px]" style={{ color: 'var(--text-secondary)' }}>
                {locale === 'id'
                  ? 'Kekuatan yang dikembangkan melalui kolaborasi tim lintas fungsi bersama engineer, operasi, QA, dan pemangku kepentingan.'
                  : 'Strengths developed through cross-functional teamwork with engineers, operations, QA, and government stakeholders.'}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
                {softSkills.map((skill, i) => (
                  <div
                    key={i}
                    className="rounded-xl px-4 py-4 text-center font-mono text-[13px] border transition-all duration-200 hover:border-[var(--accent)] cursor-default"
                    style={{
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)',
                      background: 'var(--bg-card)',
                    }}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="px-6 md:px-8 py-16 text-center border-t" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <div className="max-w-[600px] mx-auto">
            <h2 className="text-[26px] md:text-[32px] font-medium tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
              {locale === 'id' ? 'Siap Berkolaborasi?' : 'Ready to collaborate?'}
            </h2>
            <p className="text-[15px] leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
              {locale === 'id'
                ? 'Lihat bagaimana saya menerapkan keahlian ini di proyek produksi atau hubungi saya langsung.'
                : 'Check out how I apply these skills across production systems or get in touch directly.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-sm font-medium shadow-sm"
                style={{ background: 'var(--accent)', color: 'var(--accent-contrast, #ffffff)' }}
              >
                {t('common.view_projects', 'View Projects')}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-sm font-medium border transition-all hover:bg-[var(--bg-card)]"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                {t('common.contact_me', 'Contact Me')}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} background="secondary" />
      <StatusBar settings={settings} />
    </div>
  );
}
