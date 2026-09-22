'use client';

import Link from 'next/link';
import { useLanguage } from './I18nProvider';
import ProjectMediaGallery, { ProjectMediaItem } from './ProjectMediaGallery';
import ProjectContributions from './ProjectContributions';

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
    description: 'A production campus food ordering mobile platform engineered to eliminate physical canteen queues and streamline vendor order management at PENS.',
    description_id: 'Platform pemesanan makanan kantin kampus yang dibangun untuk mengeliminasi antrean panjang dan mempermudah pengelolaan pesanan stan penjual.',
    problem: 'The campus canteen experienced daily overcrowding, with more than 200 students queuing for meals during lunch peaks.',
    problem_id: 'Kantin kampus mengalami penumpukan antrean parah dengan lebih dari 200 mahasiswa mengantre setiap hari.',
    solution: 'Engineered and launched FoodLAB, a responsive Flutter mobile platform with real-time push notifications connecting students directly with 10+ food vendors.',
    solution_id: 'Membangun dan merilis FoodLAB, platform mobile yang menghubungkan mahasiswa langsung dengan 10+ penjual makanan dengan status pesanan real-time.',
    impact: 'Secured IDR 20M university funding · 300+ active users · 60% reduction in average canteen waiting time · 10+ campus vendors · Published on Google Play Store with 4.5+ rating.',
    impact_id: 'Mendapatkan pendanaan universitas Rp20 Juta · 300+ pengguna aktif · Penurunan 60% waktu tunggu rata-rata · 10+ tenant terintegrasi · Rilis di Google Play Store rating 4.5+.',
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
    description: 'A real-time public service queue management mobile application deployed at the Gebang Putih Urban Village Office (Surabaya).',
    description_id: 'Sistem manajemen antrean digital real-time yang diterapkan untuk pelayanan publik di kantor administrasi kelurahan.',
    problem: 'Citizen administration relied heavily on manual physical tickets, causing crowded waiting halls and average service times of 15 minutes.',
    problem_id: 'Proses antrean pelayanan publik sebelumnya sangat bergantung pada kertas manual dan menimbulkan waktu tunggu yang lama.',
    solution: 'Built and deployed a real-time queue management system powered by WebSockets and REST APIs, enabling citizens to monitor line progress and counter availability live.',
    solution_id: 'Mengembangkan dan merilis sistem antrean mobile real-time yang mendukung banyak loket pelayanan dengan pelacakan antrean langsung.',
    impact: 'Reduced manual administrative processes by 40% · Cut average service time from 15 min to 7 min · Enabled multi-counter management · Published on Google Play Store.',
    impact_id: 'Mengurangi proses manual sebesar 40% · Mempersingkat waktu layanan rata-rata dari 15 menit menjadi 7 menit · Mendukung multi-loket · Rilis di Google Play Store untuk layanan publik.',
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
    tags: 'Flutter, Dart, REST API, WebSocket, Real-Time Sync',
    link: 'https://play.google.com',
  },
];

const isPlayStoreLink = (url?: string) => {
  if (!url) return false;
  const lower = url.toLowerCase();
  return lower.includes('play.google.com') || lower.includes('playstore');
};

export default function Projects({ section, projects = [] }: { section?: any; projects?: ProjectItem[] }) {
  const { t, l, locale } = useLanguage();
  const allProjects = projects.length > 0 ? projects : DEFAULT_PROJECTS;
  const displayProjects = allProjects.slice(0, 3);
  const totalProjects = allProjects.length;

  return (
    <section id="projects" className="py-20 md:py-28 px-6 md:px-8 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-[640px]">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-[11px] tracking-wider uppercase" style={{ color: 'var(--text-tertiary)' }}>
                {t('sections.projects_badge', '05 // projects')}
              </span>
              <span className="text-xs px-2 py-0.5 rounded font-mono border" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
                Web & Mobile Applications
              </span>
            </div>
            <h2 className="text-[26px] md:text-[34px] font-medium tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
              {l(section, 'title') || (locale === 'id' ? 'Proyek & Studi Kasus' : 'Projects & Case Studies')}
            </h2>
            <p className="text-sm md:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {l(section, 'subtitle') || (locale === 'id' ? 'Koleksi aplikasi web dan mobile yang dikembangkan di berbagai platform, mulai dari sistem produksi hingga solusi terbuka.' : 'A collection of web and mobile applications developed across various platforms, from production systems to open-source solutions.')}
            </p>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-mono text-xs font-medium px-4 py-2 rounded-lg border transition-all hover:bg-[var(--bg-secondary)] self-start md:self-end"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            {locale === 'id' ? `Lihat Semua Proyek (${totalProjects})` : `View All Projects (${totalProjects})`}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>

        {/* Project Cards */}
        <div className="space-y-8">
          {displayProjects.map((project, idx) => {
            const metrics = Array.isArray(project.metrics)
              ? project.metrics.filter((metric) => metric && metric.value)
              : [];
            return (
              <article
                key={project.id || idx}
                className="rounded-2xl border p-6 md:p-9 transition-all duration-200 hover:shadow-md relative overflow-hidden"
                style={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                }}
              >
                {/* Top Meta Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b mb-6" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className="font-mono text-[11px] px-2.5 py-0.5 rounded border font-medium"
                      style={{
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      {project.year || '2024 - 2025'}
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
                          style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}
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
                          style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}
                        >
                          <span>{locale === 'id' ? 'Buka Proyek' : 'Visit Project'}</span>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Title & General Description */}
                <div className="mb-6">
                  <h3 className="text-[22px] md:text-[26px] font-semibold tracking-tight mb-2.5" style={{ color: 'var(--text-primary)' }}>
                    {l(project, 'title')}
                  </h3>
                  <p className="text-[15px] leading-relaxed max-w-[900px]" style={{ color: 'var(--text-secondary)' }}>
                    {l(project, 'description')}
                  </p>
                </div>

                {/* Evidence Media Gallery (images / videos) */}
                <ProjectMediaGallery
                  media={project.media || []}
                  projectTitle={l(project, 'title')}
                  maxTiles={3}
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

                {/* Tags & Tech Footer */}
                <div className="pt-4 border-t flex flex-wrap items-center justify-between gap-3" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags?.split(',').map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="font-mono text-[11px] px-2.5 py-1 rounded border"
                        style={{
                          background: 'var(--bg-secondary)',
                          color: 'var(--text-secondary)',
                          borderColor: 'var(--border-color)',
                        }}
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="font-mono text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                    {project.year ? `${locale === 'id' ? 'Selesai' : 'Completed'}: ${project.year}` : (locale === 'id' ? 'Proyek Terverifikasi' : 'Verified Project')}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom CTA for All Projects */}
        {totalProjects > 3 && (
          <div className="flex justify-center pt-8">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 font-mono text-xs font-medium px-6 py-3 rounded-lg border transition-all hover:bg-[var(--bg-secondary)] shadow-sm"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)', background: 'var(--bg-card)' }}
            >
              {locale === 'id' ? `Lihat Semua Proyek (${totalProjects})` : `View All Projects (${totalProjects})`}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
