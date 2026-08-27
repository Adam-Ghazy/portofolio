'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StatusBar from '@/components/StatusBar';
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
    description: 'A production campus food ordering platform built to eliminate physical canteen queues and streamline vendor order management at the Electronic Engineering Polytechnic Institute of Surabaya (PENS).',
    problem: 'The campus canteen experienced daily overcrowding, with more than 200 students queuing physically during peak hours, causing significant wait times and congested dining spaces.',
    solution: 'Engineered and launched FoodLAB as a complete mobile ordering solution using Flutter, Provider state management, REST APIs, and real-time push notifications. Enabled students to browse menus, place orders in advance, and receive live preparation status alerts.',
    impact: 'Secured IDR 20M university development funding · Scaled successfully from a final project MVP into an active production system · Reached 300+ active users across campus · Reduced average waiting time by 60% · Onboarded 10+ campus food vendors · Published on the Google Play Store with a 4.5+ star rating.',
    tags: 'Flutter, Dart, Provider, REST API, Push Notifications, Agile Scrum',
    link: 'https://play.google.com',
  },
  {
    id: 2,
    title: 'Real-Time Queue Management System',
    role: 'Mobile App Developer (Flutter)',
    year: '2024',
    description: 'A real-time public service queue management mobile application deployed at the Gebang Putih Urban Village Office (Kantor Kelurahan Gebang Putih, Surabaya).',
    problem: 'The existing administrative queue process relied on physical manual tickets, leading to crowded waiting halls, unpredictable wait times, and an average service time of 15 minutes per citizen.',
    solution: 'Developed and deployed a real-time digital queue management application. Integrated WebSockets and REST APIs for instantaneous multi-counter queue state synchronization and live status notifications.',
    impact: 'Reduced manual administrative processes by 40% · Reduced average citizen service time from 15 minutes down to 7 minutes · Supported multiple service counters simultaneously · Published to Google Play Store and successfully deployed for public local government use.',
    tags: 'Flutter, Dart, REST API, WebSocket, Real-Time Sync, Public Service',
    link: 'https://play.google.com',
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [settings, setSettings] = useState<any>({});
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
      .catch(() => {
        setProjects(DEFAULT_PROJECTS);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col pb-6" style={{ background: 'var(--bg-primary)' }}>
      <Header />
      
      <main className="flex-1 pt-24">
        {/* Header */}
        <section className="px-6 md:px-8 py-14 md:py-20">
          <div className="max-w-[1200px] mx-auto">
            <span className="font-mono text-[11px] tracking-wider uppercase block mb-3" style={{ color: 'var(--text-tertiary)' }}>
              01 // portfolio & case studies
            </span>
            <h1 className="text-[36px] md:text-[52px] font-semibold tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              Featured Projects
            </h1>
            <p className="text-[16px] md:text-[18px] leading-relaxed max-w-[680px]" style={{ color: 'var(--text-secondary)' }}>
              Real-world production applications engineered with Flutter, REST APIs, and modern architecture - proven with measurable metrics, university funding, and Google Play Store deployments.
            </p>
          </div>
        </section>

        {/* Projects List */}
        <section className="px-6 md:px-8 pb-20">
          <div className="max-w-[1200px] mx-auto space-y-12">
            {loading ? (
              <div className="p-8 text-center font-mono text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Loading production projects...
              </div>
            ) : (
              projects.map((project, idx) => (
                <article
                  key={project.id || idx}
                  className="rounded-2xl border p-6 md:p-10 transition-all duration-200 hover:shadow-md"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                >
                  {/* Meta Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b mb-6" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className="font-mono text-[11px] px-2.5 py-0.5 rounded border font-medium"
                        style={{
                          background: 'var(--bg-secondary)',
                          color: 'var(--text-primary)',
                          borderColor: 'var(--border-color)',
                        }}
                      >
                        {project.year || '2024'}
                      </span>
                      <span className="font-mono text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                        {project.role || 'Mobile App Developer'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] px-2.5 py-0.5 rounded border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                        Google Play Store Published
                      </span>
                    </div>
                  </div>

                  {/* Title & Overview */}
                  <div className="mb-8">
                    <h2 className="text-[24px] md:text-[30px] font-semibold tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
                      {project.title}
                    </h2>
                    <p className="text-[15px] md:text-[16px] leading-relaxed max-w-[960px]" style={{ color: 'var(--text-secondary)' }}>
                      {project.description}
                    </p>
                  </div>

                  {/* 3-Column Problem -> Solution -> Impact Deep-Dive */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
                    
                    {/* Problem */}
                    <div className="rounded-xl p-5 md:p-6 border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
                      <div className="font-mono text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                        The Operational Problem
                      </div>
                      <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {project.problem || 'Manual workflows resulting in delays and lack of real-time visibility.'}
                      </p>
                    </div>

                    {/* Solution */}
                    <div className="rounded-xl p-5 md:p-6 border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
                      <div className="font-mono text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Technical Solution
                      </div>
                      <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {project.solution || 'Modular mobile application with real-time state synchronization and notifications.'}
                      </p>
                    </div>

                    {/* Impact */}
                    <div className="rounded-xl p-5 md:p-6 border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
                      <div className="font-mono text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Verified Impact & Metrics
                      </div>
                      <p className="text-[13.5px] leading-relaxed font-medium" style={{ color: 'var(--text-primary)' }}>
                        {project.impact || 'Proven user adoption and operational efficiency gains.'}
                      </p>
                    </div>

                  </div>

                  {/* Footer Stack & Actions */}
                  <div className="pt-5 border-t flex flex-wrap items-center justify-between gap-4" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="flex flex-wrap gap-2">
                      {project.tags?.split(',').map((tag, j) => (
                        <span
                          key={j}
                          className="font-mono text-[11px] px-3 py-1 rounded border font-medium"
                          style={{
                            background: 'var(--bg-secondary)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>

                    <div className="font-mono text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      Production Verified
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 md:px-8 py-16 text-center border-t" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <div className="max-w-[600px] mx-auto">
            <h2 className="text-[26px] md:text-[32px] font-medium tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
              Looking for a Production-Proven Junior Developer?
            </h2>
            <p className="text-[15px] leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
              I am open to full-time junior mobile, frontend, and backend engineering positions. Let&apos;s build software that makes a difference.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm font-medium shadow-sm hover:opacity-90 transition-all"
                style={{ background: 'var(--accent)', color: 'var(--accent-contrast, #ffffff)' }}
              >
                Get in Touch
              </Link>
              <Link
                href="/#experience"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-mono text-sm font-medium border transition-all hover:bg-[var(--bg-card)]"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                View Work Experience
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
