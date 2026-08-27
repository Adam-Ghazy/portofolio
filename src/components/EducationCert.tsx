'use client';

interface EducationItem {
  id?: number;
  degree: string;
  institution: string;
  location: string;
  period: string;
  gpa: string;
  description?: string;
}

interface CertificationItem {
  id?: number;
  title: string;
  issuer: string;
  location: string;
  issue_date: string;
  credential_info?: string;
}

const DEFAULT_EDUCATION: EducationItem[] = [
  {
    degree: 'Bachelor of Applied Informatics Engineering',
    institution: 'Electronic Engineering Polytechnic Institute of Surabaya (PENS)',
    location: 'Surabaya, Indonesia',
    period: 'June 2024 - July 2025',
    gpa: '3.58 / 4.00',
    description: 'Specialization in scalable mobile applications, distributed backend services, and agile software development lifecycle.',
  },
  {
    degree: 'Diploma in Informatics Engineering',
    institution: 'Electronic Engineering Polytechnic Institute of Surabaya (PENS)',
    location: 'Surabaya, Indonesia',
    period: 'June 2021 - June 2024',
    gpa: '3.69 / 4.00',
    description: 'Foundations of computer science, data structures, fullstack web development, and mobile application engineering.',
  },
];

const DEFAULT_CERTS: CertificationItem[] = [
  {
    title: 'Junior Web Developer',
    issuer: 'BNSP / Digital Talent Scholarship 2024',
    location: 'Surabaya, Indonesia',
    issue_date: 'July 2024',
    credential_info: 'Certified in PHP-based web development, relational database integration (MySQL), and modern frontend fundamentals.',
  },
];

export default function EducationCert({
  section,
  education = [],
  certifications = [],
}: {
  section?: any;
  education?: EducationItem[];
  certifications?: CertificationItem[];
}) {
  const eduList = education.length > 0 ? education : DEFAULT_EDUCATION;
  const certList = certifications.length > 0 ? certifications : DEFAULT_CERTS;

  return (
    <section id="education" className="py-20 md:py-28 px-6 md:px-8 relative overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-[1200px] mx-auto">
        
        {/* Section Header */}
        <div className="max-w-[640px] mb-12">
          <span className="font-mono text-[11px] tracking-wider uppercase block mb-3" style={{ color: 'var(--text-tertiary)' }}>
            07 // qualifications
          </span>
          <h2 className="text-[26px] md:text-[34px] font-medium tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
            {section?.title || 'Education & Certifications'}
          </h2>
          <p className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {section?.subtitle || 'Formal academic degrees in Informatics Engineering from PENS and national technical certifications.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Education (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="font-mono text-[12px] uppercase tracking-wider font-semibold mb-4" style={{ color: 'var(--text-tertiary)' }}>
              Academic Background
            </h3>

            {eduList.map((edu, i) => (
              <div
                key={edu.id || i}
                className="rounded-2xl p-6 md:p-7 border transition-all duration-200"
                style={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                  <div>
                    <h4 className="text-[17px] md:text-[19px] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                      {edu.degree}
                    </h4>
                    <p className="text-[14px] font-medium mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                      {edu.institution}
                    </p>
                  </div>
                  
                  {edu.gpa && (
                    <div className="self-start sm:self-auto">
                      <span className="font-mono text-[12px] font-medium px-2.5 py-0.5 rounded border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                        GPA: {edu.gpa}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[12px] font-mono mb-4" style={{ color: 'var(--text-tertiary)' }}>
                  <span>{edu.location}</span>
                  <span>/</span>
                  <span>{edu.period}</span>
                </div>

                {edu.description && (
                  <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Right Column: Certification (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="font-mono text-[12px] uppercase tracking-wider font-semibold mb-4" style={{ color: 'var(--text-tertiary)' }}>
              National Certifications
            </h3>

            {certList.map((cert, j) => (
              <div
                key={cert.id || j}
                className="rounded-2xl p-6 md:p-7 border transition-all duration-200"
                style={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                }}
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-[11px] px-2.5 py-0.5 rounded border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                    BNSP Certified
                  </span>
                  <span className="font-mono text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                    {cert.issue_date}
                  </span>
                </div>

                <h4 className="text-[18px] font-semibold tracking-tight mb-1" style={{ color: 'var(--text-primary)' }}>
                  {cert.title}
                </h4>
                <p className="text-[13.5px] font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                  {cert.issuer}
                </p>

                <div className="text-[12px] font-mono mb-4" style={{ color: 'var(--text-tertiary)' }}>
                  {cert.location}
                </div>

                {cert.credential_info && (
                  <div className="p-3.5 rounded-xl border text-[13px] leading-relaxed" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
                    <div className="font-mono text-[10px] uppercase font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>Coverage:</div>
                    {cert.credential_info}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
