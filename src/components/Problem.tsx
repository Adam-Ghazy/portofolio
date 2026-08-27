'use client';

export default function Problem({ section }: { section?: any }) {
  let problems = [];
  try {
    problems = section?.content ? JSON.parse(section.content) : [];
  } catch {
    problems = [];
  }

  if (!problems.length) {
    problems = [
      {
        title: 'Problem -> Solution -> Impact',
        desc: 'Software exists to solve real human and operational friction. I design every feature focusing on measurable user time saved, reduced manual errors, and workflow efficiency.'
      },
      {
        title: 'Clean Architecture & Maintainability',
        desc: 'Whether crafting Flutter mobile architectures or Laravel REST APIs, I prioritize readable, well-structured, and strictly typed code that stays easy to maintain and expand.'
      },
      {
        title: 'Real-Time Sync & Reliability',
        desc: 'Experience building real-time queue systems and data synchronization taught me to handle state transitions, network latencies, and WebSocket communication gracefully.'
      },
      {
        title: 'Cross-Functional Collaboration',
        desc: 'From QA/QC engineers and logistics crews to village office stakeholders, I communicate proactively to turn domain requirements into intuitive, user-friendly tools.'
      }
    ];
  }

  return (
    <section className="py-20 md:py-28 px-6 md:px-8" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-[1200px] mx-auto">
        <span className="font-mono text-[11px] tracking-wider uppercase block mb-3" style={{ color: 'var(--text-tertiary)' }}>
          02 // principles
        </span>
        <h2 className="text-[26px] md:text-[34px] font-medium tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
          {section?.title || 'Engineering Methodology'}
        </h2>
        <p className="text-sm md:text-base max-w-[560px] leading-relaxed mb-12" style={{ color: 'var(--text-secondary)' }}>
          {section?.subtitle || 'How I bridge operational challenges with practical, high-impact software solutions.'}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {problems.map((p: any, i: number) => (
            <div
              key={i}
              className="rounded-2xl p-6 md:p-8 border transition-all duration-200"
              style={{ 
                background: 'var(--bg-card)', 
                borderColor: 'var(--border-color)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <span className="font-mono text-[12px] font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                  0{i + 1}.
                </span>
                <h3 className="text-[16px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {p.title}
                </h3>
              </div>
              <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
