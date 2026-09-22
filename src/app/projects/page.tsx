'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StatusBar from '@/components/StatusBar';
import Link from 'next/link';
import { useLanguage } from '@/components/I18nProvider';
import ProjectMediaGallery, { ProjectMediaItem } from '@/components/ProjectMediaGallery';
import ProjectContributions from '@/components/ProjectContributions';

interface ProjectMetric {
  value: string;
  label?: string;
  label_id?: string;
}

interface ProjectItem {
  id?: number;
  title: string;
  title_id?: string;
  description: string;
  description_id?: string;
  problem?: string;
  problem_id?: string;
  solution?: string;
  solution_id?: string;
  impact?: string;
  impact_id?: string;
  paragraph1?: string;
  paragraph1_id?: string;
  paragraph2?: string;
  paragraph2_id?: string;
  metrics?: ProjectMetric[];
  contributions?: string;
  contributions_id?: string;
  image_url?: string;
  year?: string;
  role?: string;
  role_id?: string;
  tags?: string;
  link?: string;
  media?: ProjectMediaItem[];
}

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 1,
    title: 'FoodLAB - Campus Food Ordering Platform',
    title_id: 'FoodLAB - Platform Pemesanan Makanan Kampus',
    role: 'Mobile App Developer (Flutter)',
    role_id: 'Pengembang Aplikasi Mobile (Flutter)',
    year: '2023 - 2025',
    description: 'A production campus food ordering platform built to eliminate physical canteen queues and streamline vendor order management at the Electronic Engineering Polytechnic Institute of Surabaya (PENS).',
    description_id: 'Platform pemesanan makanan kantin kampus yang dibangun untuk mengeliminasi antrean panjang dan mempermudah pengelolaan pesanan stan penjual di Politeknik Elektronika Negeri Surabaya (PENS).',
    problem: 'The campus canteen experienced daily overcrowding, with more than 200 students queuing physically during peak hours, causing significant wait times and congested dining spaces.',
    problem_id: 'Kantin kampus mengalami penumpukan antrean parah setiap hari dengan lebih dari 200 mahasiswa mengantre fisik saat jam makan siang.',
    solution: 'Engineered and launched FoodLAB as a complete mobile ordering solution using Flutter, Provider state management, REST APIs, and real-time push notifications. Enabled students to browse menus, place orders in advance, and receive live preparation status alerts.',
    solution_id: 'Merancang dan merilis FoodLAB sebagai solusi pemesanan mobile lengkap menggunakan Flutter, manajemen state Provider, REST API, dan notifikasi push real-time.',
    impact: 'Secured IDR 20M university development funding · Scaled successfully from a final project MVP into an active production system · Reached 300+ active users across campus · Reduced average waiting time by 60% · Onboarded 10+ campus food vendors · Published on the Google Play Store with a 4.5+ star rating.',
    impact_id: 'Meraih pendanaan pengembangan universitas Rp20 Juta · Berkembang dari MVP tugas akhir menjadi sistem produksi aktif · Menjangkau 300+ pengguna aktif kampus · Memangkas waktu tunggu 60% · Mengintegrasikan 10+ penjual makanan · Rilis di Google Play Store dengan rating 4.5+ bintang.',
    paragraph1: 'The PENS campus canteen hit the same problem every lunch hour: more than 200 students queued in the same window while each food stall ran a single manual ordering line. Queues stretched across the canteen and vendors lost orders from students who chose not to wait.',
    paragraph1_id: 'Kantin kampus PENS mengalami masalah yang sama tiap jam makan siang: lebih dari 200 mahasiswa mengantre di jam yang sama, sementara setiap stan makanan hanya punya satu jalur pemesanan manual. Antrean memanjang dan vendor kehilangan pesanan dari mahasiswa yang memilih tidak menunggu.',
    paragraph2: 'I built the Flutter application on a Provider architecture with a dedicated REST API integration layer for menu browsing, cart, and order placement. A real-time push notification service drives order status updates, so students never walk back to the stall to check progress. I also coordinated vendor onboarding for 10+ canteen tenants, from menu setup through verification.',
    paragraph2_id: 'Saya membangun aplikasi Flutter dengan arsitektur Provider dan lapisan integrasi REST API khusus untuk browsing menu, cart, dan alur pemesanan. Layanan push notification real-time mengirim update status pesanan, jadi mahasiswa tidak perlu kembali ke stan untuk mengecek progres. Saya juga mengoordinasikan onboarding 10+ tenant kantin, dari setup menu sampai verifikasi.',
    metrics: [
      { value: '300+', label: 'Active Users', label_id: 'Pengguna Aktif' },
      { value: '60%', label: 'Waiting Time Cut', label_id: 'Waktu Tunggu Turun' },
      { value: '10+', label: 'Vendors Onboarded', label_id: 'Tenant Terintegrasi' },
      { value: 'Rp 20jt', label: 'University Funding', label_id: 'Pendanaan Universitas' },
      { value: '4.5+', label: 'Play Store Rating', label_id: 'Rating Play Store' },
    ],
    contributions: 'Engineered the complete Flutter mobile application architecture with Provider state management.\nBuilt the REST API integration layer for menu browsing, cart, and order placement flows.\nImplemented the real-time push notification service for live order status updates.\nCoordinated vendor onboarding for 10+ campus food tenants.',
    contributions_id: 'Merancang arsitektur aplikasi mobile Flutter secara menyeluruh dengan manajemen state Provider.\nMembangun lapisan integrasi REST API untuk alur menu, keranjang, dan pemesanan.\nMengimplementasikan layanan notifikasi push real-time untuk status pesanan langsung.\nMengoordinasikan onboarding 10+ tenant makanan kampus.',
    tags: 'Flutter, Dart, Provider, REST API, Push Notifications, Agile Scrum',
    link: 'https://play.google.com',
  },
  {
    id: 2,
    title: 'Real-Time Queue Management System',
    title_id: 'Sistem Manajemen Antrean Real-Time',
    role: 'Mobile App Developer (Flutter)',
    role_id: 'Pengembang Aplikasi Mobile (Flutter)',
    year: '2024',
    description: 'A real-time public service queue management mobile application deployed at the Gebang Putih Urban Village Office (Kantor Kelurahan Gebang Putih, Surabaya).',
    description_id: 'Aplikasi mobile manajemen antrean pelayanan publik real-time yang diterapkan di Kantor Kelurahan Gebang Putih, Surabaya.',
    problem: 'The existing administrative queue process relied on physical manual tickets, leading to crowded waiting halls, unpredictable wait times, and an average service time of 15 minutes per citizen.',
    problem_id: 'Proses antrean administrasi sebelumnya mengandalkan tiket fisik manual yang menyebabkan ruang tunggu padat dan waktu layanan rata-rata 15 menit per warga.',
    solution: 'Developed and deployed a real-time digital queue management application. Integrated WebSockets and REST APIs for instantaneous multi-counter queue state synchronization and live status notifications.',
    solution_id: 'Mengembangkan dan merilis aplikasi antrean digital real-time terintegrasi WebSockets dan REST API untuk sinkronisasi loket multi-layanan secara instan.',
    impact: 'Reduced manual administrative processes by 40% · Reduced average citizen service time from 15 minutes down to 7 minutes · Supported multiple service counters simultaneously · Published to Google Play Store and successfully deployed for public local government use.',
    impact_id: 'Mengurangi proses manual administrasi sebesar 40% · Mempersingkat waktu layanan warga dari 15 menit menjadi 7 menit · Mendukung multi-loket simultan · Rilis di Google Play Store untuk pemerintahan lokal.',
    paragraph1: 'Citizen administration at the Gebang Putih urban village office ran on physical paper tickets. Staff issued numbers by hand, waiting halls filled up with no signal of how long the wait would be, and average service time sat at 15 minutes per citizen. With several counters open at once, nobody had a shared view of which counter was free.',
    paragraph1_id: 'Pelayanan administrasi warga di kantor kelurahan Gebang Putih berjalan dengan tiket kertas fisik. Staf menerbitkan nomor antrean secara manual, ruang tunggu penuh tanpa kejelasan berapa lama warga harus menunggu, dan waktu layanan rata-rata 15 menit per warga. Dengan beberapa loket dibuka bersamaan, tidak ada gambaran bersama loket mana yang sedang kosong.',
    paragraph2: 'I developed and deployed the queue application on Flutter, with WebSockets keeping every counter state synchronized so citizens watch the line move live instead of waiting blind. Counter state is managed centrally, which lets staff open or close service counters without reissuing tickets. I handled the production deployment at the village office and ran the onboarding sessions for staff and citizens.',
    paragraph2_id: 'Saya mengembangkan dan merilis aplikasi antrean berbasis Flutter, dengan WebSocket menjaga state setiap loket tetap tersinkron sehingga warga bisa memantau antrean bergerak langsung alih-alih menunggu tanpa kepastian. State loket dikelola terpusat, jadi staf bisa membuka atau menutup loket tanpa menerbitkan ulang tiket. Saya menangani deployment produksi di kantor kelurahan dan memandu sesi onboarding untuk staf maupun warga.',
    metrics: [
      { value: '40%', label: 'Manual Process Cut', label_id: 'Proses Manual Turun' },
      { value: '15→7 min', label: 'Service Time', label_id: 'Waktu Layanan' },
      { value: 'Multi', label: 'Counter Support', label_id: 'Dukungan Loket' },
      { value: 'Play', label: 'Store Published', label_id: 'Rilis Play Store' },
    ],
    contributions: 'Developed the real-time queue mobile application with WebSocket live synchronization.\nDesigned multi-counter queue state management and the live tracking UI.\nDeployed and maintained the production application at the urban village office.\nLed user onboarding sessions for office staff and citizens.',
    contributions_id: 'Mengembangkan aplikasi mobile antrean real-time dengan sinkronisasi WebSocket.\nMerancang manajemen state antrean multi-loket dan UI pelacakan langsung.\nMelakukan deployment dan pemeliharaan aplikasi produksi di kantor kelurahan.\nMemandu sesi onboarding bagi staf kantor dan warga.',
    tags: 'Flutter, Dart, REST API, WebSocket, Real-Time Sync, Public Service',
    link: 'https://play.google.com',
  },
];

const isPlayStoreLink = (url?: string) => {
  if (!url) return false;
  const lower = url.toLowerCase();
  return lower.includes('play.google.com') || lower.includes('playstore');
};

export default function ProjectsPage() {
  const { t, l, locale } = useLanguage();
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
              {t('sections.projects_badge', '01 // portfolio & projects')}
            </span>
            <h1 className="text-[36px] md:text-[52px] font-semibold tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              {locale === 'id' ? 'Semua Proyek' : 'All Projects'}
            </h1>
            <p className="text-[16px] md:text-[18px] leading-relaxed max-w-[720px]" style={{ color: 'var(--text-secondary)' }}>
              {locale === 'id'
                ? 'Koleksi lengkap aplikasi web dan mobile, studi kasus rekayasa, serta solusi digital yang dikembangkan dengan teknologi modern.'
                : 'A complete showcase of web and mobile applications, engineering case studies, and digital solutions developed with modern tech stacks.'}
            </p>
          </div>
        </section>

        {/* Projects List */}
        <section className="px-6 md:px-8 pb-20">
          <div className="max-w-[1200px] mx-auto space-y-12">
            {loading ? (
              <div className="p-8 text-center font-mono text-sm" style={{ color: 'var(--text-tertiary)' }}>
                {t('common.loading', 'Loading projects...')}
              </div>
            ) : (
              projects.map((project, idx) => {
                const metrics = Array.isArray(project.metrics)
                  ? project.metrics.filter((metric) => metric && metric.value)
                  : [];
                return (
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
                          {l(project, 'role') || 'Software Developer'}
                        </span>
                      </div>

                      {project.link && (
                        <div className="flex items-center gap-2">
                          {isPlayStoreLink(project.link) ? (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 rounded border transition-colors hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
                              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                            >
                              <svg className="w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3.609 1.814L13.792 12 3.61 22.186a2.404 2.404 0 0 1-.61-1.636V3.45c0-.626.226-1.203.609-1.636zm11.238 11.241l2.42 2.42-12.01 6.84 9.59-9.26zm2.42-2.11l2.84 1.62a1.644 1.644 0 0 1 0 2.87l-2.84 1.62-2.28-2.28 2.28-2.21zm-2.42-2.11L5.257 1.945l12.01 6.84-2.42 2.42z"/>
                              </svg>
                              <span>Google Play Store</span>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
                            </a>
                          ) : (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 rounded border transition-colors hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
                              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                            >
                              <span>{locale === 'id' ? 'Buka Proyek' : 'Visit Project'}</span>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Title & Overview */}
                    <div className="mb-8">
                      <h2 className="text-[24px] md:text-[30px] font-semibold tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
                        {l(project, 'title')}
                      </h2>
                      <p className="text-[15px] md:text-[16px] leading-relaxed max-w-[960px]" style={{ color: 'var(--text-secondary)' }}>
                        {l(project, 'description')}
                      </p>
                    </div>

                    {/* Evidence Media Gallery (images / videos) */}
                    <ProjectMediaGallery
                      media={project.media || []}
                      projectTitle={l(project, 'title')}
                    />

                    {/* Narrative: operational context + engineering decisions */}
                    {(l(project, 'paragraph1') || l(project, 'paragraph2')) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7 mb-6">
                        {l(project, 'paragraph1') && (
                          <p className="text-[14.5px] leading-[1.78]" style={{ color: 'var(--text-secondary)' }}>
                            {l(project, 'paragraph1')}
                          </p>
                        )}
                        {l(project, 'paragraph2') && (
                          <p className="text-[14.5px] leading-[1.78]" style={{ color: 'var(--text-secondary)' }}>
                            {l(project, 'paragraph2')}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Verified metrics */}
                    {metrics.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {metrics.map((metric, mIdx) => (
                          <div
                            key={mIdx}
                            className="flex flex-col gap-0.5 rounded-[10px] border px-3.5 py-2.5"
                            style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}
                          >
                            <span
                              className="font-mono text-[14px] font-bold whitespace-nowrap tracking-tight"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {metric.value}
                            </span>
                            <span
                              className="font-mono text-[9.5px] uppercase tracking-[0.09em] whitespace-nowrap"
                              style={{ color: 'var(--text-tertiary)' }}
                            >
                              {locale === 'id' ? metric.label_id || metric.label : metric.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* My Contributions */}
                    <ProjectContributions
                      contributions={project.contributions}
                      contributions_id={project.contributions_id}
                    />

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
                        {project.year ? `${locale === 'id' ? 'Selesai' : 'Completed'}: ${project.year}` : (locale === 'id' ? 'Proyek Terverifikasi' : 'Verified Project')}
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 md:px-8 py-16 text-center border-t" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
          <div className="max-w-[600px] mx-auto">
            <h2 className="text-[26px] md:text-[32px] font-medium tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
              {locale === 'id' ? 'Mencari Software Engineer Junior yang Teruji?' : 'Looking for a Production-Proven Junior Developer?'}
            </h2>
            <p className="text-[15px] leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
              {locale === 'id'
                ? 'Saya terbuka untuk posisi penuh waktu junior mobile, frontend, dan backend. Mari membangun perangkat lunak yang bermakna.'
                : "I am open to full-time junior mobile, frontend, and backend engineering positions. Let's build software that makes a difference."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm font-medium shadow-sm hover:opacity-90 transition-all"
                style={{ background: 'var(--accent)', color: 'var(--accent-contrast, #ffffff)' }}
              >
                {t('common.contact_me', 'Get in Touch')}
              </Link>
              <Link
                href="/experience"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-mono text-sm font-medium border transition-all hover:bg-[var(--bg-card)]"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                {t('common.work_experience', 'View Work Experience')}
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
