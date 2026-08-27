'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StatusBar from '@/components/StatusBar';
import Link from 'next/link';

interface SystemItem {
  title: string;
  tagline?: string;
  description: string;
  tech?: string;
}

interface ExperienceItem {
  id?: number;
  company: string;
  position: string;
  program?: string;
  location: string;
  period: string;
  description: string;
  systems?: string;
  technologies?: string;
}

const DEFAULT_EXPERIENCES: ExperienceItem[] = [
  {
    company: 'PT. Industri Kereta Api (Persero)',
    position: 'Junior Software Developer Intern',
    program: 'Magang Nasional Batch 2',
    location: 'Madiun, Indonesia',
    period: 'November 2025 - May 2026',
    description: 'Contributed to the digitalization of enterprise workflows for Indonesia\'s national rolling stock manufacturer. Worked across QA/QC, Logistics, Operations, and Security departments on two production internal systems.',
    technologies: 'Laravel, PHP, REST API, Data Synchronization, MySQL, Agile/Scrum',
    systems: JSON.stringify([
      {
        title: 'Paperless Inspection System',
        tagline: 'QA/QC Workflow Digitalization',
        description: 'Contributed to building a digital inspection system replacing manual paper-based QA/QC documentation. Enabled real-time digital recording, approval, and cross-department tracking.',
        tech: 'Laravel, REST API, Data Synchronization, MySQL'
      },
      {
        title: 'Surat Jalan Online',
        tagline: 'Delivery-Order Digitalization',
        description: 'Contributed to the digitalization of the delivery-order process connecting PPO, Logistics, Security, and external courier teams with structured digital workflows and live status tracking.',
        tech: 'Laravel, REST API, Workflow Automation'
      },
    ]),
  },
];

export default function ExperiencePage() {
  const [settings, setSettings] = useState<any>({});
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/experiences').then(r => (r.ok ? r.json() : [])),
      fetch('/api/settings').then(r => (r.ok ? r.json() : {})),
    ])
      .then(([expData, settingsData]) => {
        setExperiences(Array.isArray(expData) && expData.length > 0 ? expData : DEFAULT_EXPERIENCES);
        setSettings(settingsData || {});
      })
      .catch(() => {
        setExperiences(DEFAULT_EXPERIENCES);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col pb-6" style={{ background: 'var(--bg-primary)' }}>
      <Header />

      <main className="flex-1 pt-24">
        {/* Page Header */}
        <section className="px-6 md:px-8 py-14 md:py-20">
          <div className="max-w-[1200px] mx-auto">
            <span className="font-mono text-[11px] tracking-wider uppercase block mb-3" style={{ color: 'var(--text-tertiary)' }}>
              01 // work experience
            </span>
            <h1 className="text-[36px] md:text-[52px] font-semibold tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              Work Experience
            </h1>
            <p className="text-[16px] md:text-[18px] leading-relaxed max-w-[660px]" style={{ color: 'var(--text-secondary)' }}>
              Professional internship experience building and deploying enterprise-grade software at Indonesia's national rolling stock manufacturer.
            </p>
          </div>
        </section>

        {/* Experience Cards */}
        <section className="px-6 md:px-8 pb-20">
          <div className="max-w-[1200px] mx-auto space-y-8">
            {loading ? (
              <div className="p-8 text-center font-mono text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Loading work experience...
              </div>
            ) : (
              experiences.map((exp, idx) => {
                let parsedSystems: SystemItem[] = [];
                try {
                  parsedSystems = exp.systems ? JSON.parse(exp.systems) : [];
                } catch {
                  parsedSystems = [];
                }

                return (
                  <article
                    key={exp.id || idx}
                    className="rounded-2xl border p-6 md:p-10"
                    style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b mb-6" style={{ borderColor: 'var(--border-subtle)' }}>
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5 mb-2">
                          <h2 className="text-[22px] md:text-[26px] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                            {exp.company}
                          </h2>
                          {exp.program && (
                            <span
                              className="font-mono text-[11px] px-2.5 py-0.5 rounded border"
                              style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }}
                            >
                              {exp.program}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                          <span className="font-mono font-medium" style={{ color: 'var(--text-primary)' }}>{exp.position}</span>
                          <span>/</span>
                          <span>{exp.location}</span>
                        </div>
                      </div>
                      <span
                        className="font-mono text-[12px] px-3 py-1 rounded border whitespace-nowrap self-start"
                        style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }}
                      >
                        {exp.period}
                      </span>
                    </div>

                    {/* Overview */}
                    <p className="text-[15px] leading-relaxed mb-8 max-w-[800px]" style={{ color: 'var(--text-secondary)' }}>
                      {exp.description}
                    </p>

                    {/* Systems developed at this company */}
                    {parsedSystems.length > 0 && (
                      <div>
                        <h3 className="font-mono text-[11px] uppercase tracking-wider font-semibold mb-4" style={{ color: 'var(--text-tertiary)' }}>
                          Systems Developed
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          {parsedSystems.map((proj, pIdx) => (
                            <div
                              key={pIdx}
                              className="rounded-xl p-5 border"
                              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
                            >
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="font-semibold text-[15px]" style={{ color: 'var(--text-primary)' }}>
                                  {proj.title}
                                </span>
                                {proj.tagline && (
                                  <span className="font-mono text-[10px] px-2 py-0.5 rounded border" style={{ borderColor: 'var(--border-color)', color: 'var(--text-tertiary)' }}>
                                    {proj.tagline}
                                  </span>
                                )}
                              </div>
                              <p className="text-[13px] leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
                                {proj.description}
                              </p>
                              {proj.tech && (
                                <p className="font-mono text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                                  Stack: {proj.tech}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="font-mono text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
                          Full project details including Problem, Solution, and Impact are available on the{' '}
                          <Link href="/projects" className="underline hover:text-[var(--text-primary)] transition-colors">
                            Projects page
                          </Link>.
                        </p>
                      </div>
                    )}

                    {/* Tech Stack */}
                    {exp.technologies && (
                      <div className="pt-6 border-t mt-6 flex flex-wrap gap-1.5" style={{ borderColor: 'var(--border-subtle)' }}>
                        {exp.technologies.split(',').map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="font-mono text-[11px] px-2.5 py-0.5 rounded border"
                            style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }}
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 md:px-8 py-16 text-center border-t" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <div className="max-w-[600px] mx-auto">
            <h2 className="text-[26px] md:text-[32px] font-medium tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
              See the projects in detail
            </h2>
            <p className="text-[15px] leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
              The systems built during this internship are documented as full case studies with Problem, Solution, and Impact breakdowns.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm font-medium shadow-sm hover:opacity-90 transition-all"
                style={{ background: 'var(--accent)', color: 'var(--accent-contrast, #ffffff)' }}
              >
                View Projects
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-mono text-sm font-medium border transition-all hover:bg-[var(--bg-card)]"
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
