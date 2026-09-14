'use client';

import { useLanguage } from './I18nProvider';

interface SystemItem {
  title: string;
  title_id?: string;
  tagline?: string;
  tagline_id?: string;
  description: string;
  description_id?: string;
  tech?: string;
}

interface ExperienceItem {
  id?: number;
  company: string;
  position: string;
  position_id?: string;
  program?: string;
  program_id?: string;
  location: string;
  period: string;
  description: string;
  description_id?: string;
  systems?: string;
  systems_id?: string;
  technologies?: string;
  collaboration?: string;
  collaboration_id?: string;
}

export default function Experience({ section, experiences = [] }: { section?: any; experiences?: ExperienceItem[] }) {
  const { t, l, locale } = useLanguage();

  const defaultExperiences: ExperienceItem[] = [
    {
      company: 'PT. Industri Kereta Api (Persero)',
      position: 'Junior Software Developer Intern',
      position_id: 'Junior Software Developer Intern',
      program: 'Magang Nasional Batch 2',
      program_id: 'Magang Nasional Batch 2',
      location: 'Madiun, Indonesia',
      period: 'November 2025 - May 2026',
      description: 'Collaborated with cross-functional teams involving Engineering, Operations, and Logistics. Contributed to requirement gathering, digital workflow design, REST API integrations, data synchronization, and production deployment for Indonesia’s national rolling stock manufacturer.',
      description_id: 'Berkolaborasi dengan tim lintas fungsi yang melibatkan Engineering, Operasi, dan Logistik. Terlibat dalam pengumpulan kebutuhan, perancangan alur kerja digital, integrasi REST API, sinkronisasi data, dan penyebaran produksi.',
      systems: JSON.stringify([
        {
          title: 'Paperless Inspection System',
          tagline: 'QA/QC Workflow Digitalization',
          description: 'Contributed to the development of a Paperless Inspection System for QA/QC workflows. Replaced manual paper-based documentation with an end-to-end digital system to reduce recording errors, improve documentation efficiency, and accelerate inspection sign-offs.',
          tech: 'Laravel, REST API, Data Synchronization, MySQL'
        },
        {
          title: 'Surat Jalan Online',
          tagline: 'Delivery-Order Digitalization',
          description: 'Contributed to the digitalization of the Surat Jalan Online system. Streamlined delivery-order processes across PPO (Pusat Pelayanan Operasi), Logistics, Security, and external courier teams with live status tracking.',
          tech: 'Laravel, REST API, Workflow Automation'
        }
      ]),
      systems_id: JSON.stringify([
        {
          title: 'Paperless Inspection System',
          tagline: 'Digitalisasi Inspeksi QA/QC',
          description: 'Berkontribusi dalam pengembangan sistem inspeksi digital untuk alur kerja QA/QC. Menggantikan dokumentasi berbasis kertas manual dengan alur kerja digital terstruktur guna mengurangi galat pencatatan dan meningkatkan efisiensi proses inspeksi.',
          tech: 'Laravel, REST API, Data Synchronization, MySQL'
        },
        {
          title: 'Surat Jalan Online',
          tagline: 'Digitalisasi Surat Jalan & Logistik',
          description: 'Berkontribusi dalam digitalisasi sistem Surat Jalan Online untuk mempermudah alur pesanan pengiriman antardivisi PPO, Logistik, Keamanan, dan kurir eksternal.',
          tech: 'Laravel, REST API, Workflow Automation'
        }
      ]),
      technologies: 'Laravel, REST API, Data Synchronization, MySQL, Agile/Scrum',
      collaboration: 'Engineering, Operations, Logistics, QA/QC, Security'
    }
  ];

  const items = experiences.length > 0 ? experiences : defaultExperiences;

  return (
    <section id="experience" className="py-20 md:py-28 px-6 md:px-8 relative overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-[1200px] mx-auto">
        
        {/* Section Header */}
        <div className="max-w-[640px] mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-[11px] tracking-wider uppercase" style={{ color: 'var(--text-tertiary)' }}>
              {t('sections.experience_badge', '04 // experience')}
            </span>
            <span className="text-xs px-2 py-0.5 rounded font-mono border" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
              Industry Experience
            </span>
          </div>
          <h2 className="text-[26px] md:text-[34px] font-medium tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
            {l(section, 'title') || (locale === 'id' ? 'Pengalaman Kerja' : 'Work Experience')}
          </h2>
          <p className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {l(section, 'subtitle') || (locale === 'id' ? 'Pengalaman magang profesional dalam digitalisasi alur inspeksi QA/QC dan logistik industri manufaktur.' : 'Professional internship experience digitalizing enterprise QA/QC inspection and logistics workflows.')}
          </p>
        </div>

        {/* Experience Timeline Cards */}
        <div className="space-y-8">
          {items.map((exp, idx) => {
            let parsedSystems: SystemItem[] = [];
            try {
              const rawSys = locale === 'id' && exp.systems_id ? exp.systems_id : exp.systems;
              parsedSystems = rawSys ? JSON.parse(rawSys) : [];
            } catch {
              parsedSystems = [];
            }

            return (
              <article
                key={exp.id || idx}
                className="rounded-2xl p-6 md:p-9 border transition-all duration-200 hover:shadow-md relative overflow-hidden"
                style={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                }}
              >
                {/* Header Info */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5 mb-2">
                      <h3 className="text-[20px] md:text-[24px] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                        {exp.company}
                      </h3>
                      {(exp.program || exp.program_id) && (
                        <span
                          className="font-mono text-[11px] px-2.5 py-0.5 rounded border"
                          style={{
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-secondary)',
                            borderColor: 'var(--border-color)'
                          }}
                        >
                          {l(exp, 'program')}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                      <span className="font-medium font-mono" style={{ color: 'var(--text-primary)' }}>
                        {l(exp, 'position')}
                      </span>
                      <span>-</span>
                      <span>{exp.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start">
                    <span
                      className="font-mono text-[12px] px-3 py-1 rounded border font-medium whitespace-nowrap"
                      style={{
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-secondary)',
                        borderColor: 'var(--border-color)'
                      }}
                    >
                      {exp.period}
                    </span>
                  </div>
                </div>

                {/* Overview Description */}
                <p className="text-[14.5px] leading-relaxed my-6" style={{ color: 'var(--text-secondary)' }}>
                  {l(exp, 'description')}
                </p>

                {/* Contributed Systems Breakdown */}
                {parsedSystems.length > 0 && (
                  <div className="mt-6 mb-6">
                    <h4 className="font-mono text-[11px] uppercase tracking-wider mb-4" style={{ color: 'var(--text-tertiary)' }}>
                      {t('experience.systems_heading', 'Key Digital Systems & Responsibilities')}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {parsedSystems.map((sys, sIdx) => (
                        <div
                          key={sIdx}
                          className="rounded-xl p-4 md:p-5 border transition-all duration-200"
                          style={{
                            background: 'var(--bg-secondary)',
                            borderColor: 'var(--border-subtle)'
                          }}
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="font-semibold text-[15px]" style={{ color: 'var(--text-primary)' }}>
                              {locale === 'id' && sys.title_id ? sys.title_id : sys.title}
                            </span>
                            {(sys.tagline || sys.tagline_id) && (
                              <span className="font-mono text-[10px] px-2 py-0.5 rounded border" style={{ borderColor: 'var(--border-color)', color: 'var(--text-tertiary)' }}>
                                {locale === 'id' && sys.tagline_id ? sys.tagline_id : sys.tagline}
                              </span>
                            )}
                          </div>
                          <p className="text-[13px] leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
                            {locale === 'id' && sys.description_id ? sys.description_id : sys.description}
                          </p>
                          {sys.tech && (
                            <div className="font-mono text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                              Stack: {sys.tech}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer: Collaboration & Tech Stack Badges */}
                <div className="pt-5 border-t flex flex-wrap items-center justify-between gap-4" style={{ borderColor: 'var(--border-subtle)' }}>
                  {(exp.collaboration || exp.collaboration_id) ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                        {t('experience.collaboration_label', 'Collaboration')}:
                      </span>
                      {l(exp, 'collaboration').split(',').map((team, tIdx) => (
                        <span
                          key={tIdx}
                          className="font-mono text-[11px] px-2.5 py-0.5 rounded border"
                          style={{
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-secondary)',
                            borderColor: 'var(--border-subtle)'
                          }}
                        >
                          {team.trim()}
                        </span>
                      ))}
                    </div>
                  ) : <div />}

                  <div className="flex flex-wrap gap-1.5">
                    {exp.technologies?.split(',').map((tech, techIdx) => (
                      <span
                        key={techIdx}
                        className="font-mono text-[11px] px-2.5 py-0.5 rounded border font-medium"
                        style={{
                          background: 'var(--bg-secondary)',
                          color: 'var(--text-primary)',
                          borderColor: 'var(--border-color)'
                        }}
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
