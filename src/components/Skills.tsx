'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from './I18nProvider';

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

export default function Skills({ section, skills = [] }: { section?: any; skills?: SkillItem[] }) {
  const { t, l, locale } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

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
        ? rawSoft.map((s) => (locale === 'id' && s.description_id ? s.title : s.title))
        : (locale === 'id' ? DEFAULT_SOFT_SKILLS_ID : DEFAULT_SOFT_SKILLS_EN);

    return {
      techSkills: Array.from(techMap.values()),
      softSkills: softList,
    };
  }, [skills, locale]);

  // Extract unique categories for filter
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
    <section id="skills" className="py-20 md:py-28 px-6 md:px-8 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div className="max-w-[560px]">
            <span className="font-mono text-[11px] tracking-wider uppercase block mb-3" style={{ color: 'var(--text-tertiary)' }}>
              {t('sections.skills_badge', '06 // skills')}
            </span>
            <h2 className="text-[26px] md:text-[34px] font-medium tracking-tight mb-2.5" style={{ color: 'var(--text-primary)' }}>
              {l(section, 'title') || (locale === 'id' ? 'Keahlian & Teknologi' : 'Skills & Tech Stack')}
            </h2>
            <p className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {l(section, 'subtitle') || (locale === 'id' ? 'Alat, bahasa pemrograman, dan framework yang saya gunakan untuk membangun sistem produksi yang andal.' : 'The tools, languages, and frameworks I use to build modern, reliable production applications.')}
            </p>
          </div>

          {/* Category Filter Tabs */}
          {categories.length > 2 && (
            <div className="flex flex-wrap gap-2 self-start lg:self-end lg:justify-end">
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

        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-12">
          {filteredTechSkills.map((tech) => (
            <div
              key={tech.id}
              className="rounded-xl px-4 py-3.5 flex items-center justify-between border transition-all duration-200 hover:border-[var(--accent)] cursor-default group"
              style={{
                borderColor: 'var(--border-color)',
                background: 'var(--bg-card)',
              }}
            >
              <span className="font-mono text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
                {tech.title}
              </span>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded border opacity-60 group-hover:opacity-100 transition-opacity" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-tertiary)' }}>
                {tech.category.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>

        {/* Soft Skills Banner */}
        {softSkills.length > 0 && (
          <div className="p-6 md:p-8 rounded-2xl border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
            <div className="mb-4">
              <h3 className="font-mono text-[12px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-primary)' }}>
                {locale === 'id' ? 'Keterampilan Interpersonal Utama' : 'Core Soft Skills & Strengths'}
              </h3>
              <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                {locale === 'id' ? 'Atribut komunikasi dan kolaborasi profesional yang diasah melalui proyek tim lintas fungsi.' : 'Professional collaboration and communication attributes cultivated through cross-functional team projects.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {softSkills.map((skill, sIdx) => (
                <div
                  key={sIdx}
                  className="font-mono text-[12px] px-3.5 py-1.5 rounded border font-medium"
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
