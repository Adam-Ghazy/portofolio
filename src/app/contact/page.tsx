'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StatusBar from '@/components/StatusBar';

export default function ContactPage() {
  const [settings, setSettings] = useState<any>({});
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then(r => (r.ok ? r.json() : {})).then(setSettings).catch(() => {});
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
      // ignore
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-6" style={{ background: 'var(--bg-primary)' }}>
      <Header />
      
      <main className="flex-1 pt-24">
        {/* Header */}
        <section className="px-6 md:px-8 py-14 md:py-20">
          <div className="max-w-[1200px] mx-auto">
            <span className="font-mono text-[11px] tracking-wider uppercase block mb-3" style={{ color: 'var(--text-tertiary)' }}>
              01 // connect
            </span>
            <h1 className="text-[36px] md:text-[52px] font-semibold tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              Let&apos;s Connect
            </h1>
            <p className="text-[16px] md:text-[18px] leading-relaxed max-w-[660px]" style={{ color: 'var(--text-secondary)' }}>
              Whether you have an entry-level software engineering role, a mobile application project, or simply want to connect - feel free to reach out.
            </p>
          </div>
        </section>

        {/* Form & Info */}
        <section className="px-6 md:px-8 pb-20">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Contact Form (7 cols) */}
            <div className="lg:col-span-7 rounded-2xl p-6 md:p-8 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <h2 className="text-[18px] font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
                Send a Direct Message
              </h2>
              
              {sent && (
                <div className="mb-6 px-4 py-3 rounded-lg text-sm font-medium border" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>
                  Message sent successfully! I will get back to you as soon as possible.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono tracking-wider block mb-1.5" style={{ color: 'var(--text-tertiary)' }}>YOUR NAME</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors"
                      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                      placeholder="e.g. Sarah Jenkins"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono tracking-wider block mb-1.5" style={{ color: 'var(--text-tertiary)' }}>EMAIL ADDRESS</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors"
                      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                      placeholder="e.g. sarah@company.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-mono tracking-wider block mb-1.5" style={{ color: 'var(--text-tertiary)' }}>SUBJECT</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={e => setForm({...form, subject: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors"
                    style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                    placeholder="Junior Developer Opportunity / Project Inquiry"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono tracking-wider block mb-1.5" style={{ color: 'var(--text-tertiary)' }}>MESSAGE</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors min-h-[140px] resize-none"
                    style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                    placeholder="Tell me about your team, role opening, or what you'd like to build..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending || !form.name || !form.email || !form.message}
                  className="w-full py-3 rounded-lg text-sm font-medium font-mono transition-all disabled:opacity-50 hover:opacity-90 shadow-sm"
                  style={{ background: 'var(--accent)', color: 'var(--accent-contrast, #ffffff)' }}
                >
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Info (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Availability */}
              <div className="rounded-2xl p-6 md:p-8 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <span className="font-mono text-[11px] tracking-wider uppercase block mb-3" style={{ color: 'var(--text-tertiary)' }}>
                  Availability Status
                </span>
                <div className="font-semibold text-[16px] mb-2" style={{ color: 'var(--text-primary)' }}>
                  Open for Junior Opportunities
                </div>
                <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Available for full-time junior mobile, frontend, backend, or fullstack software engineering positions, hybrid/remote roles, and production contract projects.
                </p>
              </div>

              {/* Direct Channels */}
              <div className="rounded-2xl p-6 md:p-8 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                <span className="font-mono text-[11px] tracking-wider uppercase block mb-4" style={{ color: 'var(--text-tertiary)' }}>
                  Direct Contact Info
                </span>
                <div className="space-y-3">
                  <a
                    href="mailto:ghozyalfalah02@gmail.com"
                    className="flex items-center justify-between p-3.5 rounded-xl border transition-colors hover:bg-[var(--bg-secondary)]"
                    style={{ borderColor: 'var(--border-subtle)' }}
                  >
                    <span className="font-mono text-xs sm:text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      ghozyalfalah02@gmail.com
                    </span>
                    <span className="font-mono text-xs" style={{ color: 'var(--text-tertiary)' }}>Email</span>
                  </a>

                  <a
                    href="tel:+6285784269105"
                    className="flex items-center justify-between p-3.5 rounded-xl border transition-colors hover:bg-[var(--bg-secondary)]"
                    style={{ borderColor: 'var(--border-subtle)' }}
                  >
                    <span className="font-mono text-xs sm:text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      (+62) 85784269105
                    </span>
                    <span className="font-mono text-xs" style={{ color: 'var(--text-tertiary)' }}>Call / WA</span>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/adamghazy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-xl border transition-colors hover:bg-[var(--bg-secondary)]"
                    style={{ borderColor: 'var(--border-subtle)' }}
                  >
                    <span className="font-mono text-xs sm:text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      linkedin.com/in/adamghazy
                    </span>
                    <span className="font-mono text-xs" style={{ color: 'var(--text-tertiary)' }}>LinkedIn</span>
                  </a>

                  <div
                    className="flex items-center justify-between p-3.5 rounded-xl border"
                    style={{ borderColor: 'var(--border-subtle)' }}
                  >
                    <span className="font-mono text-xs sm:text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      Madiun, Indonesia
                    </span>
                    <span className="font-mono text-xs" style={{ color: 'var(--text-tertiary)' }}>Location</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer settings={settings} background="primary" />
      <StatusBar settings={settings} />
    </div>
  );
}
