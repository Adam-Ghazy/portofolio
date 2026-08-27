'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Problem from '@/components/Problem';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import EducationCert from '@/components/EducationCert';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import StatusBar from '@/components/StatusBar';

const safeFetch = (url: string) =>
  fetch(url)
    .then((r) => (r.ok ? r.json() : []))
    .catch(() => []);

const safeFetchObj = (url: string) =>
  fetch(url)
    .then((r) => (r.ok ? r.json() : {}))
    .catch(() => ({}));

export default function Home() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      safeFetch('/api/sections'),
      safeFetch('/api/projects'),
      safeFetch('/api/experiences'),
      safeFetch('/api/education'),
      safeFetch('/api/certifications'),
      safeFetch('/api/skills'),
      safeFetch('/api/about-stats'),
      safeFetchObj('/api/settings'),
    ]).then(([sections, projects, experiences, education, certifications, skills, stats, settings]) => {
      setData({ sections, projects, experiences, education, certifications, skills, stats, settings });
    });
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ color: 'var(--accent)' }} />
          <p className="font-mono text-sm" style={{ color: 'var(--text-tertiary)' }}>loading portfolio system…</p>
        </div>
      </div>
    );
  }

  const findSection = (slug: string) =>
    (data.sections || []).find((s: any) => s.slug === slug) || { title: '', subtitle: '', content: '' };

  return (
    <div className="min-h-screen pb-6" style={{ background: 'var(--bg-primary)' }}>
      <Header />
      <main>
        <Hero section={findSection('hero')} meta={data.settings?.hero_meta} stats={data.stats} />
        <Problem section={findSection('problem')} />
        <About section={findSection('about')} stats={data.stats} />
        <Experience section={findSection('experience')} experiences={data.experiences} />
        <Projects section={findSection('projects') || findSection('work')} projects={data.projects} />
        <Skills section={findSection('skills')} skills={data.skills} />
        <EducationCert
          section={findSection('education')}
          education={data.education}
          certifications={data.certifications}
        />
        <Contact section={findSection('contact')} />
      </main>
      <Footer settings={data.settings} background="primary" />
      <StatusBar settings={data.settings} />
    </div>
  );
}