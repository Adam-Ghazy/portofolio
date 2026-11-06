'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/components/I18nProvider';
import { UntiPage, UntiSection, UntiCard, SectionPill, StatusPill } from '@/components/unti/UntiPrimitives';

const inputStyle = {
  background: 'var(--bg-secondary)',
  borderRadius: 'var(--radius-pill)',
  padding: '10px 20px',
  fontSize: 16,
  letterSpacing: '-0.01em',
  lineHeight: 1.2,
  color: 'var(--text-primary)',
  outline: 'none',
  width: '100%',
  border: 'none',
} as const;

export default function ContactPage() {
  const { t, l, locale } = useLanguage();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [section, setSection] = useState<Record<string, unknown>>({});
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/settings').then((r) => (r.ok ? r.json() : {})),
      fetch('/api/sections?slug=contact').then((r) => (r.ok ? r.json() : {})),
    ])
      .then(([settingsData, sectionData]) => {
        setSettings(settingsData || {});
        setSection(sectionData || {});
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        setForm({ name: '', email: '', subject: '', message: '' });
      }
    } catch {
      // Network failure: keep the form filled so the visitor can retry.
    } finally {
      setSending(false);
    }
  };

  const footerRows = [
    settings.email && { label: 'E-mail', content: settings.email, href: `mailto:${settings.email}` },
    settings.phone && { label: 'Phone', content: settings.phone, href: `tel:${settings.phone.replace(/[^+\d]/g, '')}` },
    settings.linkedin && { label: 'LinkedIn', content: '/in/adamghazy', href: settings.linkedin, newTab: true },
    settings.location && { label: 'Location', content: settings.location, href: '#' },
  ].filter(Boolean) as { label: string; content: string; href: string; newTab?: boolean }[];

  const labelCls = 'unti-meta-sm block mb-[5px]';

  return (
    <UntiPage
      location={settings.location || 'Madiun, Indonesia'}
      rows={footerRows}
      copyright={`2026 © ${settings.site_title?.split(' - ')[0] || 'Adam Ghazy Al Falah'}`}
    >
      <UntiSection>
        <UntiCard>
          <StatusPill label={locale === 'id' ? 'Terbuka untuk kerja' : 'Available for Work'} />
          <h1 className="unti-title m-0 text-balance">
            {l(section, 'title') || t('contact.title', "Let's Connect")}
          </h1>
          <p className="unti-body m-0 text-pretty">
            {l(section, 'subtitle') ||
              t(
                'contact.subtitle',
                'Whether you have an entry-level software engineering role, a mobile application project, or simply want to connect - feel free to reach out.'
              )}
          </p>
        </UntiCard>
      </UntiSection>

      <UntiSection>
        <UntiCard>
          <SectionPill label={locale === 'id' ? 'Kirim Pesan' : 'Send a Message'} />
          {sent && (
            <div className="unti-pill" style={{ width: '100%' }}>
              {t('contact.success_msg', 'Message sent successfully! I will get back to you as soon as possible.')}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-[10px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
              <div>
                <label htmlFor="contact-name" className={labelCls}>
                  {t('contact.name_label', 'Your Name')}
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={inputStyle}
                  placeholder={t('contact.name_placeholder', 'e.g. Sarah Jenkins')}
                  required
                />
              </div>
              <div>
                <label htmlFor="contact-email" className={labelCls}>
                  {t('contact.email_label', 'Email Address')}
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={inputStyle}
                  placeholder={t('contact.email_placeholder', 'e.g. sarah@company.com')}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="contact-subject" className={labelCls}>
                {t('contact.subject_label', 'Subject')}
              </label>
              <input
                id="contact-subject"
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                style={inputStyle}
                placeholder={t('contact.subject_placeholder', 'Junior Developer Opportunity / Project Inquiry')}
              />
            </div>
            <div>
              <label htmlFor="contact-message" className={labelCls}>
                {t('contact.message_label', 'Message')}
              </label>
              <textarea
                id="contact-message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                style={{ ...inputStyle, minHeight: 140, resize: 'vertical' }}
                placeholder={t('contact.message_placeholder', "Tell me about your team, role opening, or what you'd like to build...")}
                required
              />
            </div>
            <button type="submit" disabled={sending} className="unti-cta" style={{ width: '100%' }}>
              {sending ? t('contact.sending_btn', 'Sending...') : t('contact.submit_btn', 'Send Message')}
            </button>
          </form>
        </UntiCard>
      </UntiSection>

      <UntiSection>
        <UntiCard>
          <SectionPill label={locale === 'id' ? 'Kontak Langsung' : 'Direct Contact'} />
          <div className="flex flex-col gap-[10px]">
            {footerRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between w-full"
                style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-photo)', padding: 20, gap: 20, border: '1px solid var(--border-subtle)' }}
              >
                <span className="unti-muted">{row.label}</span>
                <a
                  href={row.href}
                  target={row.newTab || row.href.startsWith('http') ? '_blank' : undefined}
                  rel={row.newTab || row.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="unti-heading truncate hover:opacity-70 transition-opacity"
                  style={{ fontSize: 16 }}
                >
                  {row.content}
                </a>
              </div>
            ))}
          </div>
        </UntiCard>
      </UntiSection>
    </UntiPage>
  );
}
