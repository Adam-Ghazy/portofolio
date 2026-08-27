'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StatusBar from '@/components/StatusBar';
import Link from 'next/link';

interface SkillItem {
  id: number | string;
  title: string;
  description: string;
  icon?: string;
  sort_order?: number;
  is_active?: number;
}

const DEFAULT_STACK_ITEMS = [
  // Programming & Development
  { title: 'Flutter', category: 'Programming & Development' },
  { title: 'Dart', category: 'Programming & Development' },
  { title: 'Laravel', category: 'Programming & Development' },
  { title: 'PHP', category: 'Programming & Development' },
  { title: 'React.js', category: 'Programming & Development' },
  { title: 'JavaScript', category: 'Programming & Development' },
  { title: 'HTML', category: 'Programming & Development' },
  { title: 'CSS', category: 'Programming & Development' },

  // Backend & API
  { title: 'REST API', category: 'Backend & API' },
  { title: 'API Integration', category: 'Backend & API' },
  { title: 'WebSocket', category: 'Backend & API' },

  // Database
  { title: 'MySQL', category: 'Database' },

  // Tools & Infrastructure
  { title: 'Git', category: 'Tools & Infrastructure' },
  { title: 'Docker', category: 'Tools & Infrastructure' },
  { title: 'Firebase', category: 'Tools & Infrastructure' },

  // Development Practices
  { title: 'Agile', category: 'Development Practices' },
  { title: 'Scrum', category: 'Development Practices' },
  { title: 'Debugging', category: 'Development Practices' },
  { title: 'AI Coding Agents', category: 'Development Practices' },
];

const DEFAULT_SOFT_SKILLS = [
  'Problem Solving',
  'Team Collaboration',
  'Stakeholder Communication',
  'Adaptability',
  'Time Management',
];

export default function SkillsPage() {
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
        s.description?.toLowerCase() === 'soft skill'
    );
    const rawTech = skills.filter(
      (s) =>
        s.description?.toLowerCase() !== 'soft skills' &&
        s.description?.toLowerCase() !== 'soft skill'
    );

    const techMap = new Map<string, { id: string | number; title: string; category: string }>();

    // Add default items
    DEFAULT_STACK_ITEMS.forEach((item, idx) => {
      techMap.set(item.title.toLowerCase(), {
        id: `def-${idx}`,
        title: item.title,
        category: item.category,
      });
    });

    // Add/override from DB
    rawTech.forEach((item) => {
      const existing = techMap.get(item.title.toLowerCase());
      techMap.set(item.title.toLowerCase(), {
        id: item.id,
        title: item.title,
        category: item.description?.trim() || existing?.category || 'General',
      });
    });

    const softList =
      rawSoft.length > 0
        ? rawSoft.map((s) => s.title)
        : DEFAULT_SOFT_SKILLS;

    return {
      techSkills: Array.from(techMap.values()),
      softSkills: softList,
    };
  }, [skills]);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    techSkills.forEach((s) => {
      if (s.category) cats.add(s.category);
    });
    return ['All', ...Array.from(cats)];
  }, [techSkills]);

  const filteredTechSkills = useMemo(() => {
    if (selectedCategory === 'All') return techSkills;
    return techSkills.filter(
      (s) => s.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [techSkills, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col pb-6" style={{ background: 'var(--bg-primary)' }}>
      <Header />
      
      <main className="flex-1 pt-24">
        {/* Header */}
        <section className="px-6 md:px-8 py-16 md:py-24">
          <div className="max-w-[1200px] mx-auto">
            <span className="font-mono text-[11px] tracking-wider uppercase block mb-3" style={{ color: 'var(--text-tertiary)' }}>
              01 // stack & competencies
            </span>
            <h1 className="text-[36px] md:text-[52px] font-semibold tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              Skills & Tech Stack
            </h1>
            <p className="text-[16px] md:text-[18px] leading-relaxed max-w-[660px]" style={{ color: 'var(--text-secondary)' }}>
              A realistic breakdown of programming languages, frameworks, backend architectures, databases, and development workflows I use in production.
            </p>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="px-6 md:px-8 py-16 md:py-24" style={{ background: 'var(--bg-secondary)' }}>
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
              <div>
                <span className="font-mono text-[11px] tracking-wider uppercase block mb-3" style={{ color: 'var(--text-tertiary)' }}>
                  02 // technical toolkit
                </span>
                <h2 className="text-[24px] md:text-[30px] font-medium tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  Core Technologies
                </h2>
              </div>

              {/* Category Filter Tabs */}
              {categories.length > 2 && (
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const isActive = selectedCategory === cat;
                    const count =
                      cat === 'All'
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
              <p className="font-mono text-sm text-muted-foreground">Loading stack...</p>
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
                03 // collaboration
              </span>
              <h2 className="text-[24px] md:text-[30px] font-medium tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
                Soft Skills & Interpersonal Strengths
              </h2>
              <p className="text-[14px] md:text-[15px] mb-8 max-w-[600px]" style={{ color: 'var(--text-secondary)' }}>
                Strengths developed through cross-functional teamwork with engineers, operations, QA, and government stakeholders.
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
              Ready to collaborate?
            </h2>
            <p className="text-[15px] leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
              Check out how I apply these skills across production systems or get in touch directly.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-sm font-medium shadow-sm"
                style={{ background: 'var(--accent)', color: 'var(--accent-contrast, #ffffff)' }}
              >
                View Projects
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-sm font-medium border transition-all hover:bg-[var(--bg-card)]"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                Contact Me
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
