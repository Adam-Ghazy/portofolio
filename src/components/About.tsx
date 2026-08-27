'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function About({ section, stats = [] }: { section?: any; stats?: any[] }) {
  const [dbStats, setDbStats] = useState<any[]>(stats);

  useEffect(() => {
    if (!stats || stats.length === 0) {
      fetch('/api/about-stats')
        .then((r) => (r.ok ? r.json() : []))
        .then(setDbStats)
        .catch(() => {});
    }
  }, [stats]);

  const defaultStats = [
    { value: '1+ yr', label: 'Hands-on Experience' },
    { value: '3+', label: 'Production Systems' },
    { value: '300+', label: 'Active Users' },
    { value: '2', label: 'Play Store Published' },
  ];

  const displayStats = dbStats.length > 0 ? dbStats : defaultStats;

  return (
    <section id="about" className="py-20 md:py-28 px-6 md:px-8" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[1200px] mx-auto">
        <span className="font-mono text-[11px] tracking-wider uppercase block mb-3" style={{ color: 'var(--text-tertiary)' }}>
          03 // about me
        </span>
        <h2 className="text-[26px] md:text-[34px] font-medium tracking-tight mb-10" style={{ color: 'var(--text-primary)' }}>
          {section?.title || 'A Bit About Me'}
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6">
            <p className="text-[15px] md:text-[16px] leading-[1.8] mb-5" style={{ color: 'var(--text-secondary)' }}>
              {section?.subtitle ||
                "I'm Adam Ghazy Al Falah, a fresh graduate Mobile, Frontend & Backend Developer based in Madiun, Indonesia. With 1+ year of hands-on experience, I focus on building and deploying production-grade applications that solve real operational challenges."}
            </p>
            <p className="text-[14.5px] leading-[1.75] mb-8" style={{ color: 'var(--text-secondary)' }}>
              My background spans professional internship development at PT. Industri Kereta Api (Persero), public government service systems, and university platforms. I specialize in Flutter mobile engineering, Laravel REST API backends, and React.js web interfaces.
            </p>
            <div className="flex items-center gap-4">
              <Link 
                href="/about"
                className="inline-flex items-center gap-2 font-mono text-xs font-medium border px-5 py-2.5 rounded-lg transition-all duration-200 hover:bg-[var(--bg-secondary)]"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                Full Background & Journey
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link
                href="/projects"
                className="font-mono text-xs transition-colors hover:text-[var(--accent)]"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Explore Projects
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            {displayStats.map((s: any, i: number) => (
              <div
                key={s.id || i}
                className="rounded-2xl p-5 md:p-6 border transition-all duration-200"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
              >
                <div className="text-[28px] sm:text-[34px] font-bold font-mono leading-none" style={{ color: 'var(--text-primary)' }}>
                  {s.value}
                </div>
                <div className="text-[12.5px] sm:text-[13px] mt-2.5 font-medium leading-snug" style={{ color: 'var(--text-secondary)' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
