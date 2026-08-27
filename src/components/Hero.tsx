'use client';

import Link from 'next/link';

export default function Hero({
  section,
  meta,
  stats = [],
}: {
  section?: any;
  meta?: string;
  stats?: Array<{ value: string; label: string }>;
}) {
  const photoUrl = section?.image_url || '/uploads/profile_hero.jpg';

  const defaultStats = [
    { value: '1+ yr', label: 'Hands-on Experience' },
    { value: '3+', label: 'Production Systems' },
    { value: '300+', label: 'Active Users Served' },
    { value: '2', label: 'Play Store Published' },
  ];

  const displayStats = stats && stats.length > 0 ? stats : defaultStats;

  return (
    <section className="min-h-screen flex flex-col justify-center pb-16 md:pb-20 pt-28 px-6 md:px-8 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[1200px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Headline & Intro */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Status & Intro badge */}
            <div className="flex flex-wrap items-center gap-2 mb-4 animate-fade-in-up" style={{ color: 'var(--text-tertiary)' }}>
              <span className="font-mono text-[11px] tracking-wider uppercase">01 // Junior Software Developer</span>
              <span className="font-mono text-[11px] tracking-wider hidden sm:inline">/ Madiun, Indonesia</span>
            </div>

            {/* Name */}
            <h1
              className="text-[34px] sm:text-[44px] md:text-[52px] lg:text-[56px] font-semibold leading-[1.08] tracking-tight mb-3 animate-fade-in-up delay-100"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
            >
              {section?.title || 'Adam Ghazy Al Falah'}
            </h1>

            {/* Professional Title & Highlights */}
            <div className="mb-5 animate-fade-in-up delay-150">
              <div className="text-[17px] sm:text-[20px] font-medium tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Mobile, Frontend & Backend Developer
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {['Flutter', 'Laravel', 'React.js', 'REST API'].map((tech, idx) => (
                  <span
                    key={idx}
                    className="font-mono text-[11px] px-2.5 py-1 rounded border font-medium"
                    style={{
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-secondary)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Summary narrative */}
            <p
              className="text-[15px] sm:text-[16px] md:text-[17px] leading-relaxed max-w-[560px] mb-8 animate-fade-in-up delay-200"
              style={{ color: 'var(--text-secondary)' }}
            >
              {section?.subtitle ||
                'Building practical digital solutions that turn real-world problems into scalable, reliable applications across mobile, frontend, and backend stacks.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-10 md:mb-12 animate-fade-in-up delay-300">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-sm font-medium transition-all duration-200 hover:opacity-90 shadow-sm"
                style={{ background: 'var(--accent)', color: 'var(--accent-contrast, #ffffff)' }}
              >
                View Projects
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <a
                href="/experience"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-sm font-medium border transition-all duration-200 hover:bg-[var(--bg-secondary)]"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                Work Experience
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-mono text-sm transition-all duration-200 hover:text-[var(--accent)]"
                style={{ color: 'var(--text-secondary)' }}
              >
                Contact Me
              </Link>
            </div>

            {/* General Developer Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 pt-7 border-t animate-fade-in-up delay-400" style={{ borderColor: 'var(--border-color)' }}>
              {displayStats.map((stat, i) => (
                <div key={i}>
                  <div
                    className="text-[26px] sm:text-[30px] md:text-[34px] font-bold leading-none font-mono tracking-tight"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="font-mono text-[10px] md:text-[11px] mt-2 tracking-wider uppercase leading-snug"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Profile Photo Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end animate-fade-in-up delay-200">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[400px]">
              
              {/* Photo Container Frame */}
              <div
                className="relative rounded-2xl overflow-hidden border p-2 transition-all duration-300 shadow-md"
                style={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="rounded-xl overflow-hidden aspect-[4/5] relative bg-[var(--bg-secondary)]">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={section?.title || 'Adam Ghazy Al Falah'}
                      className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                      <p className="text-sm font-medium text-[var(--text-secondary)]">Adam Ghazy Al Falah</p>
                      <p className="text-xs text-[var(--text-tertiary)] mt-1">Mobile, Frontend & Backend Developer</p>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  {/* Status Pill inside photo */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div
                      className="px-3 py-1 rounded text-[11px] font-mono backdrop-blur-md border"
                      style={{
                        background: 'rgba(15, 23, 42, 0.75)',
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        color: '#ffffff',
                      }}
                    >
                      Available for hire
                    </div>

                    <span
                      className="text-[10px] font-mono px-2 py-1 rounded backdrop-blur-md border"
                      style={{
                        background: 'rgba(15, 23, 42, 0.65)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.85)',
                      }}
                    >
                      Madiun, ID
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
