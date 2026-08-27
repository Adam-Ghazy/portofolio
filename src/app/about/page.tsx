'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StatusBar from '@/components/StatusBar';
import Link from 'next/link';

export default function AboutPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [education, setEducation] = useState<any[]>([]);
  const [certs, setCerts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/about-stats').then(r => (r.ok ? r.json() : [])).then(setStats).catch(() => {});
    fetch('/api/settings').then(r => (r.ok ? r.json() : {})).then(setSettings).catch(() => {});
    fetch('/api/education').then(r => (r.ok ? r.json() : [])).then(setEducation).catch(() => {});
    fetch('/api/certifications').then(r => (r.ok ? r.json() : [])).then(setCerts).catch(() => {});
  }, []);

  const defaultStats = [
    { id: 1, value: '1+ yr', label: 'Hands-on Experience' },
    { id: 2, value: '3+', label: 'Production Systems' },
    { id: 3, value: '300+', label: 'Active Users Served' },
    { id: 4, value: '2', label: 'Play Store Published' },
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  return (
    <div className="min-h-screen flex flex-col pb-6" style={{ background: 'var(--bg-primary)' }}>
      <Header />
      
      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="px-6 md:px-8 py-16 md:py-24">
          <div className="max-w-[1200px] mx-auto">
            <span className="font-mono text-[11px] tracking-wider uppercase block mb-3" style={{ color: 'var(--text-tertiary)' }}>
              01 // profile & journey
            </span>
            <h1 className="text-[36px] md:text-[52px] font-semibold tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
              Adam Ghazy Al Falah
            </h1>
            <div className="text-[18px] md:text-[20px] font-medium mb-6" style={{ color: 'var(--text-secondary)' }}>
              Mobile, Frontend & Backend Developer / Madiun, Indonesia
            </div>
            
            <div className="max-w-[720px] space-y-4 text-[15px] md:text-[16px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <p>
                I am a fresh graduate software engineer with over 1 year of hands-on experience building and deploying production-grade applications across mobile, frontend, and backend environments.
              </p>
              <p>
                My engineering experience includes digitalizing enterprise QA/QC and logistics workflows during an internship at <strong>PT. Industri Kereta Api (Persero) / PT INKA</strong>, building a real-time queue management system for public government administration at the Gebang Putih Urban Village Office, and launching <strong>FoodLAB</strong> - a campus food ordering mobile platform that secured IDR 20M university funding and served 300+ active users across 10+ food vendors.
              </p>
              <p>
                I prioritize clean architecture, strict typing, responsive user experiences, and measurable operational impact - delivering reliable software that reduces manual friction.
              </p>
            </div>
          </div>
        </section>

        {/* General Developer Stats */}
        <section className="px-6 md:px-8 py-12 border-y" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {displayStats.map((s: any) => (
              <div key={s.id || s.label} className="text-center">
                <div className="text-[34px] md:text-[42px] font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
                  {s.value}
                </div>
                <div className="text-[12px] md:text-[13px] mt-1 font-medium font-mono uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education & Certifications */}
        <section className="px-6 md:px-8 py-16 md:py-24">
          <div className="max-w-[1200px] mx-auto">
            <span className="font-mono text-[11px] tracking-wider uppercase block mb-3" style={{ color: 'var(--text-tertiary)' }}>
              02 // background
            </span>
            <h2 className="text-[26px] md:text-[32px] font-medium tracking-tight mb-10" style={{ color: 'var(--text-primary)' }}>
              Education & Certifications
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Education */}
              <div className="space-y-4">
                <h3 className="font-mono text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                  Academic Degrees
                </h3>

                <div className="rounded-2xl p-6 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h4 className="font-semibold text-[17px]" style={{ color: 'var(--text-primary)' }}>
                      Bachelor of Applied Informatics Engineering
                    </h4>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                      GPA: 3.58 / 4.00
                    </span>
                  </div>
                  <div className="text-[13.5px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Electronic Engineering Polytechnic Institute of Surabaya (PENS)
                  </div>
                  <div className="text-xs font-mono mt-1" style={{ color: 'var(--text-tertiary)' }}>
                    Surabaya, Indonesia / June 2024 - July 2025
                  </div>
                </div>

                <div className="rounded-2xl p-6 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h4 className="font-semibold text-[17px]" style={{ color: 'var(--text-primary)' }}>
                      Diploma in Informatics Engineering
                    </h4>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                      GPA: 3.69 / 4.00
                    </span>
                  </div>
                  <div className="text-[13.5px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Electronic Engineering Polytechnic Institute of Surabaya (PENS)
                  </div>
                  <div className="text-xs font-mono mt-1" style={{ color: 'var(--text-tertiary)' }}>
                    Surabaya, Indonesia / June 2021 - June 2024
                  </div>
                </div>
              </div>

              {/* Certification */}
              <div className="space-y-4">
                <h3 className="font-mono text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                  Professional Certification
                </h3>

                <div className="rounded-2xl p-6 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h4 className="font-semibold text-[17px]" style={{ color: 'var(--text-primary)' }}>
                      Junior Web Developer
                    </h4>
                    <span className="font-mono text-xs px-2 py-0.5 rounded border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                      July 2024
                    </span>
                  </div>
                  <div className="text-[13.5px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Digital Talent Scholarship 2024 / BNSP (Badan Nasional Sertifikasi Profesi)
                  </div>
                  <div className="text-xs font-mono mt-1 mb-4" style={{ color: 'var(--text-tertiary)' }}>
                    Surabaya, Indonesia
                  </div>
                  <p className="text-[13px] leading-relaxed p-3 rounded-lg border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
                    Certified competency in PHP-based web engineering, relational database management (MySQL), and frontend web fundamentals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Engineering Approach */}
        <section className="px-6 md:px-8 py-16 md:py-24 border-t" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <div className="max-w-[1200px] mx-auto">
            <span className="font-mono text-[11px] tracking-wider uppercase block mb-3" style={{ color: 'var(--text-tertiary)' }}>
              03 // approach
            </span>
            <h2 className="text-[26px] md:text-[32px] font-medium tracking-tight mb-10" style={{ color: 'var(--text-primary)' }}>
              How I Build Software
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: '01', title: 'User & Process Research', desc: 'Identify real friction points in daily workflows and interview end users and operators before writing code.' },
                { num: '02', title: 'Modular Architecture', desc: 'Architect decoupled mobile modules, clean state management with Provider, and robust REST APIs with Laravel.' },
                { num: '03', title: 'Real-Time Sync & QA', desc: 'Implement WebSocket connections, handle network fallbacks, and test edge cases to ensure zero recording errors.' },
                { num: '04', title: 'Production Deployment', desc: 'Publish to Google Play Store, monitor user feedback, and iterate quickly using Agile Scrum sprints.' },
              ].map((step, i) => (
                <div key={i} className="rounded-2xl p-6 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                  <div className="font-mono text-[28px] font-bold mb-3" style={{ color: 'var(--accent)' }}>{step.num}</div>
                  <h3 className="text-[16px] font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 md:px-8 py-16 text-center" style={{ background: 'var(--bg-primary)' }}>
          <div className="max-w-[600px] mx-auto">
            <h2 className="text-[28px] md:text-[34px] font-medium tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              Let&apos;s Build Something Impactful
            </h2>
            <p className="text-[15px] leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
              I am actively seeking junior engineering opportunities and collaborative production projects.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm font-medium shadow-sm hover:opacity-90 transition-all"
                style={{ background: 'var(--accent)', color: 'var(--accent-contrast, #ffffff)' }}
              >
                Contact Me
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-mono text-sm font-medium border transition-all hover:bg-[var(--bg-secondary)]"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                Explore Projects
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
