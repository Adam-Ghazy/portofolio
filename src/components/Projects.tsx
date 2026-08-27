'use client';

import Link from 'next/link';

interface ProjectItem {
  id?: number;
  title: string;
  description: string;
  problem?: string;
  solution?: string;
  impact?: string;
  image_url?: string;
  year?: string;
  role?: string;
  tags?: string;
  link?: string;
}

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 1,
    title: 'FoodLAB - Campus Food Ordering Platform',
    role: 'Mobile App Developer (Flutter)',
    year: '2023 - 2025',
    description: 'A production campus food ordering mobile platform engineered to eliminate physical canteen queues and streamline vendor order management at PENS.',
    problem: 'The campus canteen experienced daily overcrowding, with more than 200 students queuing for meals during lunch peaks.',
    solution: 'Engineered and launched FoodLAB, a responsive Flutter mobile platform with real-time push notifications connecting students directly with 10+ food vendors.',
    impact: 'Secured IDR 20M university funding · 300+ active users · 60% reduction in average canteen waiting time · 10+ campus vendors · Published on Google Play Store with 4.5+ rating.',
    tags: 'Flutter, Dart, Provider, REST API, Push Notifications, Agile Scrum',
    link: 'https://play.google.com',
  },
  {
    id: 2,
    title: 'Real-Time Queue Management System',
    role: 'Mobile App Developer (Flutter)',
    year: '2024',
    description: 'A real-time public service queue management mobile application deployed at the Gebang Putih Urban Village Office (Surabaya).',
    problem: 'Citizen administration relied heavily on manual physical tickets, causing crowded waiting halls and average service times of 15 minutes.',
    solution: 'Built and deployed a real-time queue management system powered by WebSockets and REST APIs, enabling citizens to monitor line progress and counter availability live.',
    impact: 'Reduced manual administrative processes by 40% · Cut average service time from 15 min to 7 min · Enabled multi-counter management · Published on Google Play Store.',
    tags: 'Flutter, Dart, REST API, WebSocket, Real-Time Sync',
    link: 'https://play.google.com',
  },
];

export default function Projects({ section, projects = [] }: { section?: any; projects?: ProjectItem[] }) {
  const displayProjects = projects.length > 0 ? projects : DEFAULT_PROJECTS;

  return (
    <section id="projects" className="py-20 md:py-28 px-6 md:px-8 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-[640px]">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-[11px] tracking-wider uppercase" style={{ color: 'var(--text-tertiary)' }}>
                05 // projects
              </span>
              <span className="text-xs px-2 py-0.5 rounded font-mono border" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
                Production Deployed
              </span>
            </div>
            <h2 className="text-[26px] md:text-[34px] font-medium tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
              {section?.title || 'Featured Projects'}
            </h2>
            <p className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {section?.subtitle || 'Production applications built, funded, and published to the Google Play Store with verified real-world impact.'}
            </p>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-mono text-xs font-medium px-4 py-2 rounded-lg border transition-all hover:bg-[var(--bg-secondary)] self-start md:self-end"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            All Projects Detail
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>

        {/* Project Cards */}
        <div className="space-y-8">
          {displayProjects.map((project, idx) => (
            <article
              key={project.id || idx}
              className="rounded-2xl border p-6 md:p-9 transition-all duration-200 hover:shadow-md relative overflow-hidden"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
              }}
            >
              {/* Top Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b mb-6" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className="font-mono text-[11px] px-2.5 py-0.5 rounded border font-medium"
                    style={{
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    {project.year || '2024 - 2025'}
                  </span>
                  <span className="font-mono text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {project.role || 'Mobile App Developer'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] px-2.5 py-0.5 rounded border" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}>
                    Google Play Store
                  </span>
                </div>
              </div>

              {/* Title & General Description */}
              <div className="mb-6">
                <h3 className="text-[22px] md:text-[26px] font-semibold tracking-tight mb-2.5" style={{ color: 'var(--text-primary)' }}>
                  {project.title}
                </h3>
                <p className="text-[15px] leading-relaxed max-w-[900px]" style={{ color: 'var(--text-secondary)' }}>
                  {project.description}
                </p>
              </div>

              {/* Problem -> Solution -> Impact Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Problem */}
                <div
                  className="rounded-xl p-4 md:p-5 border"
                  style={{
                    background: 'var(--bg-secondary)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  <div className="font-mono text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Problem
                  </div>
                  <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {project.problem || 'Long physical queue times and manual service tracking.'}
                  </p>
                </div>

                {/* Solution */}
                <div
                  className="rounded-xl p-4 md:p-5 border"
                  style={{
                    background: 'var(--bg-secondary)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  <div className="font-mono text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Solution
                  </div>
                  <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {project.solution || 'Digital mobile workflow with real-time status updates.'}
                  </p>
                </div>

                {/* Impact */}
                <div
                  className="rounded-xl p-4 md:p-5 border"
                  style={{
                    background: 'var(--bg-secondary)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  <div className="font-mono text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Impact & Results
                  </div>
                  <p className="text-[13px] leading-relaxed font-medium" style={{ color: 'var(--text-primary)' }}>
                    {project.impact || 'Verified production metrics and user satisfaction.'}
                  </p>
                </div>
              </div>

              {/* Tags & Tech Footer */}
              <div className="pt-4 border-t flex flex-wrap items-center justify-between gap-3" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags?.split(',').map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="font-mono text-[11px] px-2.5 py-1 rounded border"
                      style={{
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-secondary)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>

                <div className="font-mono text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                  Production Verified
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
