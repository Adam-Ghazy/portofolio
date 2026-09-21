import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbPath = path.join(process.cwd(), 'data', 'portfolio.db');
let db: Database.Database;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initTables();
  }
  return db;
}

function ensureColumn(table: string, column: string, type: string = 'TEXT') {
  try {
    const pragma = db.prepare(`PRAGMA table_info(${table})`).all() as any[];
    const cols = pragma.map((c: any) => c.name);
    if (!cols.includes(column)) {
      db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
    }
  } catch (e) {
    // ignore
  }
}

function initTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS sections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT,
      title_id TEXT,
      subtitle TEXT,
      subtitle_id TEXT,
      content TEXT,
      content_id TEXT,
      image_url TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      title_id TEXT,
      description TEXT,
      description_id TEXT,
      problem TEXT,
      problem_id TEXT,
      solution TEXT,
      solution_id TEXT,
      impact TEXT,
      impact_id TEXT,
      image_url TEXT,
      year TEXT,
      role TEXT,
      role_id TEXT,
      tags TEXT,
      link TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS project_media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      media_type TEXT NOT NULL DEFAULT 'image',
      url TEXT NOT NULL,
      caption TEXT,
      caption_id TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS experiences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      position TEXT NOT NULL,
      position_id TEXT,
      program TEXT,
      program_id TEXT,
      location TEXT,
      period TEXT,
      description TEXT,
      description_id TEXT,
      systems TEXT,
      systems_id TEXT,
      technologies TEXT,
      collaboration TEXT,
      collaboration_id TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS education (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      degree TEXT NOT NULL,
      degree_id TEXT,
      institution TEXT NOT NULL,
      location TEXT,
      period TEXT,
      gpa TEXT,
      description TEXT,
      description_id TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS certifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      title_id TEXT,
      issuer TEXT NOT NULL,
      location TEXT,
      issue_date TEXT,
      credential_info TEXT,
      credential_info_id TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      description_id TEXT,
      icon TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS about_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      value TEXT NOT NULL,
      label TEXT NOT NULL,
      label_id TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS approaches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      step_number TEXT,
      title TEXT NOT NULL,
      title_id TEXT,
      description TEXT,
      description_id TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Non-destructive migrations for bilingual columns
  ensureColumn('sections', 'title_id');
  ensureColumn('sections', 'subtitle_id');
  ensureColumn('sections', 'content_id');

  ensureColumn('projects', 'title_id');
  ensureColumn('projects', 'description_id');
  ensureColumn('projects', 'problem_id');
  ensureColumn('projects', 'solution_id');
  ensureColumn('projects', 'impact_id');
  ensureColumn('projects', 'role_id');
  ensureColumn('projects', 'contributions');
  ensureColumn('projects', 'contributions_id');

  ensureColumn('experiences', 'position_id');
  ensureColumn('experiences', 'program_id');
  ensureColumn('experiences', 'description_id');
  ensureColumn('experiences', 'systems_id');
  ensureColumn('experiences', 'collaboration');
  ensureColumn('experiences', 'collaboration_id');

  ensureColumn('education', 'degree_id');
  ensureColumn('education', 'description_id');

  ensureColumn('certifications', 'title_id');
  ensureColumn('certifications', 'credential_info_id');

  ensureColumn('skills', 'description_id');

  ensureColumn('about_stats', 'label_id');

  ensureColumn('approaches', 'title_id');
  ensureColumn('approaches', 'description_id');

  const expCount = db.prepare('SELECT COUNT(*) as c FROM experiences').get() as { c: number };
  const eduCount = db.prepare('SELECT COUNT(*) as c FROM education').get() as { c: number };
  const secCount = db.prepare("SELECT COUNT(*) as c FROM sections WHERE slug = 'experience'").get() as { c: number };
  const appCount = db.prepare('SELECT COUNT(*) as c FROM approaches').get() as { c: number };

  if (expCount.c === 0 || eduCount.c === 0 || secCount.c === 0) {
    seedDefaults();
  }

  if (appCount.c === 0) {
    seedApproaches();
  }

  // Populate default Indonesian translations for initial seed if missing
  seedIndonesianTranslations();
}

function seedIndonesianTranslations() {
  try {
    // Update default stats in Indonesian
    db.prepare("UPDATE about_stats SET label_id = 'Pengalaman Praktis' WHERE id = 1 AND (label_id IS NULL OR label_id = '')").run();
    db.prepare("UPDATE about_stats SET label_id = 'Sistem Produksi' WHERE id = 2 AND (label_id IS NULL OR label_id = '')").run();
    db.prepare("UPDATE about_stats SET label_id = 'Pengguna Aktif Dilayani' WHERE id = 3 AND (label_id IS NULL OR label_id = '')").run();
    db.prepare("UPDATE about_stats SET label_id = 'Aplikasi Play Store Rilis' WHERE id = 4 AND (label_id IS NULL OR label_id = '')").run();

    // Update approaches in Indonesian
    db.prepare(`
      UPDATE approaches 
      SET title_id = 'Riset Pengguna & Alur Proses',
          description_id = 'Mengidentifikasi titik friksi operasional dan mewawancarai pengguna langsung sebelum menulis kode.'
      WHERE id = 1 AND (title_id IS NULL OR title_id = '')
    `).run();

    db.prepare(`
      UPDATE approaches 
      SET title_id = 'Arsitektur Modular & Terstruktur',
          description_id = 'Merancang modul aplikasi mobile yang decoupled, manajemen state bersih dengan Provider, dan REST API andal dengan Laravel.'
      WHERE id = 2 AND (title_id IS NULL OR title_id = '')
    `).run();

    db.prepare(`
      UPDATE approaches 
      SET title_id = 'Sinkronisasi Real-Time & QA',
          description_id = 'Menerapkan koneksi WebSocket, penanganan latensi jaringan, serta pengujian edge case untuk memastikan nol galat pencatatan.'
      WHERE id = 3 AND (title_id IS NULL OR title_id = '')
    `).run();

    db.prepare(`
      UPDATE approaches 
      SET title_id = 'Penyebaran Produksi & Iterasi',
          description_id = 'Publikasi ke Google Play Store, pemantauan umpan balik pengguna, dan iterasi cepat dengan sprint Agile Scrum.'
      WHERE id = 4 AND (title_id IS NULL OR title_id = '')
    `).run();

    // Update sections in Indonesian
    db.prepare(`
      UPDATE sections
      SET title_id = 'Adam Ghazy Al Falah',
          subtitle_id = 'Junior Mobile, Frontend & Backend Developer yang membangun solusi digital praktis untuk mengubah tantangan nyata menjadi aplikasi andal dan terukur.'
      WHERE slug = 'hero' AND (subtitle_id IS NULL OR subtitle_id = '')
    `).run();

    db.prepare(`
      UPDATE sections
      SET title_id = 'Metodologi Rekayasa',
          subtitle_id = 'Bagaimana saya menjembatani tantangan operasional dengan solusi perangkat lunak yang berdampak nyata.'
      WHERE slug = 'problem' AND (subtitle_id IS NULL OR subtitle_id = '')
    `).run();

    db.prepare(`
      UPDATE sections
      SET title_id = 'Tentang Saya',
          subtitle_id = 'Saya adalah pengembang perangkat lunak lulusan baru dengan pengalaman 1+ tahun membangun dan merilis aplikasi produksi di bidang mobile, frontend, dan backend. Berpengalaman mengembangkan sistem di PT. Industri Kereta Api (Persero), instansi pemerintahan, dan universitas.'
      WHERE slug = 'about' AND (subtitle_id IS NULL OR subtitle_id = '')
    `).run();

    db.prepare(`
      UPDATE sections
      SET title_id = 'Pengalaman Kerja',
          subtitle_id = 'Pengalaman magang profesional dalam digitalisasi alur inspeksi QA/QC dan logistik industri manufaktur.'
      WHERE slug = 'experience' AND (subtitle_id IS NULL OR subtitle_id = '')
    `).run();

    db.prepare(`
      UPDATE sections
      SET title_id = 'Proyek & Studi Kasus',
          subtitle_id = 'Koleksi aplikasi web dan mobile yang dikembangkan di berbagai platform, mulai dari sistem produksi hingga solusi terbuka.'
      WHERE slug = 'projects' AND (subtitle_id IS NULL OR subtitle_id = '')
    `).run();

    db.prepare(`
      UPDATE sections
      SET title_id = 'Keahlian & Teknologi',
          subtitle_id = 'Bahasa pemrograman, framework, API, basis data, dan metodologi pengembangan yang saya gunakan dalam membangun sistem andal.'
      WHERE slug = 'skills' AND (subtitle_id IS NULL OR subtitle_id = '')
    `).run();

    db.prepare(`
      UPDATE sections
      SET title_id = 'Pendidikan & Sertifikasi',
          subtitle_id = 'Gelar akademik Teknik Informatika dari PENS dan sertifikasi kompetensi teknis nasional dari BNSP.'
      WHERE slug = 'education' AND (subtitle_id IS NULL OR subtitle_id = '')
    `).run();

    db.prepare(`
      UPDATE sections
      SET title_id = 'Mari Terhubung',
          subtitle_id = 'Terbuka untuk peluang junior developer, rekayasa mobile & fullstack, serta kolaborasi proyek berdampak.'
      WHERE slug = 'contact' AND (subtitle_id IS NULL OR subtitle_id = '')
    `).run();

    // Update experience
    db.prepare(`
      UPDATE experiences
      SET position_id = 'Junior Software Developer Intern',
          program_id = 'Magang Nasional Batch 2',
          description_id = 'Berkolaborasi dengan tim lintas fungsi yang melibatkan Engineering, Operasi, dan Logistik. Terlibat dalam pengumpulan kebutuhan, pengembangan fitur, integrasi REST API, sinkronisasi data, dan penyebaran produksi.'
      WHERE id = 1 AND (description_id IS NULL OR description_id = '')
    `).run();

    // Update projects
    db.prepare(`
      UPDATE projects
      SET title_id = 'FoodLAB - Platform Pemesanan Makanan Kampus',
          role_id = 'Pengembang Aplikasi Mobile (Flutter)',
          description_id = 'Platform pemesanan makanan kantin kampus yang dibangun untuk mengeliminasi antrean panjang dan mempermudah pengelolaan pesanan stan penjual.',
          problem_id = 'Kantin kampus mengalami penumpukan antrean parah dengan lebih dari 200 mahasiswa mengantre setiap hari.',
          solution_id = 'Membangun dan merilis FoodLAB, platform mobile yang menghubungkan mahasiswa langsung dengan 10+ penjual makanan dengan status pesanan real-time.',
          impact_id = 'Mendapatkan pendanaan universitas Rp20 Juta · 300+ pengguna aktif · Penurunan 60% waktu tunggu rata-rata · 10+ tenant terintegrasi · Rilis di Google Play Store rating 4.5+.'
      WHERE id = 1 AND (title_id IS NULL OR title_id = '')
    `).run();

    db.prepare(`
      UPDATE projects
      SET title_id = 'Sistem Manajemen Antrean Real-Time',
          role_id = 'Pengembang Aplikasi Mobile (Flutter)',
          description_id = 'Sistem manajemen antrean digital real-time yang diterapkan untuk pelayanan publik di kantor administrasi kelurahan.',
          problem_id = 'Proses antrean pelayanan publik sebelumnya sangat bergantung pada kertas manual dan menimbulkan waktu tunggu yang lama.',
          solution_id = 'Mengembangkan dan merilis sistem antrean mobile real-time yang mendukung banyak loket pelayanan dengan pelacakan antrean langsung.',
          impact_id = 'Mengurangi proses manual sebesar 40% · Mempersingkat waktu layanan rata-rata dari 15 menit menjadi 7 menit · Mendukung multi-loket · Rilis di Google Play Store untuk layanan publik.',
          contributions_id = 'Mengembangkan aplikasi mobile antrean real-time dengan sinkronisasi WebSocket.\nMerancang manajemen state antrean multi-loket dan UI pelacakan langsung.\nMelakukan deployment dan pemeliharaan aplikasi produksi di kantor kelurahan.\nMemandu sesi onboarding bagi staf kantor dan warga.'
      WHERE id = 2 AND (title_id IS NULL OR title_id = '')
    `).run();

    db.prepare(`
      UPDATE projects
      SET contributions_id = 'Merancang arsitektur aplikasi mobile Flutter secara menyeluruh dengan manajemen state Provider.\nMembangun lapisan integrasi REST API untuk alur menu, keranjang, dan pemesanan.\nMengimplementasikan layanan notifikasi push real-time untuk status pesanan langsung.\nMengoordinasikan onboarding 10+ tenant makanan kampus.'
      WHERE id = 1 AND (contributions_id IS NULL OR contributions_id = '')
    `).run();

    db.prepare(`
      UPDATE projects
      SET contributions_id = 'Mengembangkan aplikasi mobile antrean real-time dengan sinkronisasi WebSocket.\nMerancang manajemen state antrean multi-loket dan UI pelacakan langsung.\nMelakukan deployment dan pemeliharaan aplikasi produksi di kantor kelurahan.\nMemandu sesi onboarding bagi staf kantor dan warga.'
      WHERE id = 2 AND (contributions_id IS NULL OR contributions_id = '')
    `).run();

    db.prepare(`
      UPDATE projects
      SET contributions = 'Engineered the complete Flutter mobile application architecture with Provider state management.\nBuilt the REST API integration layer for menu browsing, cart, and order placement flows.\nImplemented the real-time push notification service for live order status updates.\nCoordinated vendor onboarding for 10+ campus food tenants.'
      WHERE id = 1 AND (contributions IS NULL OR contributions = '')
    `).run();

    db.prepare(`
      UPDATE projects
      SET contributions = 'Developed the real-time queue mobile application with WebSocket live synchronization.\nDesigned multi-counter queue state management and the live tracking UI.\nDeployed and maintained the production application at the urban village office.\nLed user onboarding sessions for office staff and citizens.'
      WHERE id = 2 AND (contributions IS NULL OR contributions = '')
    `).run();

    // Update education
    db.prepare(`
      UPDATE education
      SET degree_id = 'Sarjana Terapan Teknik Informatika',
          description_id = 'Kurikulum lanjutan mencakup arsitektur aplikasi mobile, layanan backend terdistribusi, pengembangan agile, dan penyebaran perangkat lunak produksi.'
      WHERE id = 1 AND (degree_id IS NULL OR degree_id = '')
    `).run();

    db.prepare(`
      UPDATE education
      SET degree_id = 'Diploma Teknik Informatika',
          description_id = 'Fondasi inti teknik informatika termasuk struktur data, desain basis data, pengembangan web fullstack, dan rekayasa aplikasi mobile.'
      WHERE id = 2 AND (degree_id IS NULL OR degree_id = '')
    `).run();

    // Update certifications
    db.prepare(`
      UPDATE certifications
      SET title_id = 'Junior Web Developer',
          credential_info_id = 'Sertifikasi kompetensi dalam rekayasa web berbasis PHP, manajemen basis data relasional (MySQL), dan fundamental web frontend.'
      WHERE id = 1 AND (credential_info_id IS NULL OR credential_info_id = '')
    `).run();

    // Update settings
    const insSet = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    insSet.run('hero_meta_id', 'junior developer · flutter, laravel, react & rest api · terbuka untuk kerja');
    insSet.run('footer_tagline_id', 'mengubah masalah menjadi solusi digital');
    insSet.run('site_description_id', 'Portofolio Adam Ghazy Al Falah, Pengembang Perangkat Lunak Junior yang berfokus pada Flutter, Laravel, React.js, dan REST API.');
  } catch (e) {
    console.error('Error seeding Indonesian translations:', e);
  }
}

function seedApproaches() {
  const insApp = db.prepare(`
    INSERT OR REPLACE INTO approaches (id, step_number, title, title_id, description, description_id, sort_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insApp.run(
    1,
    '01',
    'User & Process Research',
    'Riset Pengguna & Alur Proses',
    'Identify real friction points in daily workflows and interview end users and operators before writing code.',
    'Mengidentifikasi titik friksi operasional dan mewawancarai pengguna langsung sebelum menulis kode.',
    1,
    1
  );

  insApp.run(
    2,
    '02',
    'Modular Architecture',
    'Arsitektur Modular & Terstruktur',
    'Architect decoupled mobile modules, clean state management with Provider, and robust REST APIs with Laravel.',
    'Merancang modul aplikasi mobile yang decoupled, manajemen state bersih dengan Provider, dan REST API andal dengan Laravel.',
    2,
    1
  );

  insApp.run(
    3,
    '03',
    'Real-Time Sync & QA',
    'Sinkronisasi Real-Time & QA',
    'Implement WebSocket connections, handle network fallbacks, and test edge cases to ensure zero recording errors.',
    'Menerapkan koneksi WebSocket, penanganan latensi jaringan, serta pengujian edge case untuk memastikan nol galat pencatatan.',
    3,
    1
  );

  insApp.run(
    4,
    '04',
    'Production Deployment',
    'Penyebaran Produksi & Iterasi',
    'Publish to Google Play Store, monitor user feedback, and iterate quickly using Agile Scrum sprints.',
    'Publikasi ke Google Play Store, pemantauan umpan balik pengguna, dan iterasi cepat dengan sprint Agile Scrum.',
    4,
    1
  );
}

export function seedDefaults(force = false) {
  if (force) {
    db.exec(`
      DELETE FROM sections;
      DELETE FROM projects;
      DELETE FROM experiences;
      DELETE FROM education;
      DELETE FROM certifications;
      DELETE FROM skills;
      DELETE FROM about_stats;
      DELETE FROM approaches;
    `);
  }

  // 1. Sections
  const insSec = db.prepare(`
    INSERT OR REPLACE INTO sections (slug, title, title_id, subtitle, subtitle_id, content, content_id, image_url, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insSec.run(
    'hero',
    'Adam Ghazy Al Falah',
    'Adam Ghazy Al Falah',
    'Junior Mobile, Frontend & Backend Developer building practical digital solutions that turn real-world problems into scalable, reliable applications.',
    'Junior Mobile, Frontend & Backend Developer yang membangun solusi digital praktis untuk mengubah tantangan nyata menjadi aplikasi andal dan terukur.',
    'Mobile, Frontend & Backend Developer',
    'Mobile, Frontend & Backend Developer',
    '/uploads/profile_hero.jpg',
    1
  );

  insSec.run(
    'problem',
    'Engineering Methodology',
    'Metodologi Rekayasa',
    'How I bridge operational challenges with practical, high-impact software solutions.',
    'Bagaimana saya menjembatani tantangan operasional dengan solusi perangkat lunak yang berdampak nyata.',
    JSON.stringify([
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
    ]),
    JSON.stringify([
      {
        title: 'Masalah -> Solusi -> Dampak',
        desc: 'Perangkat lunak hadir untuk menyelesaikan friksi manusia dan operasional nyata. Saya merancang setiap fitur berfokus pada efisiensi waktu, pengurangan galat manual, dan produktivitas alur kerja.'
      },
      {
        title: 'Arsitektur Bersih & Kemudahan Pemeliharaan',
        desc: 'Baik merancang arsitektur mobile Flutter maupun REST API Laravel, saya mengutamakan kode yang rapi, terstruktur, dan bertipe ketat agar mudah dirawat dan dikembangkan.'
      },
      {
        title: 'Sinkronisasi Real-Time & Keandalan',
        desc: 'Pengalaman membangun sistem antrean dan sinkronisasi data mengajarkan saya menangani transisi state, latensi jaringan, dan komunikasi WebSocket secara tangguh.'
      },
      {
        title: 'Kolaborasi Lintas Fungsi',
        desc: 'Mulai dari insinyur QA/QC dan staf logistik hingga pemangku kepentingan kantor pemerintahan, saya berkomunikasi secara proaktif untuk mengubah kebutuhan domain menjadi sistem yang intuitif.'
      }
    ]),
    '',
    2
  );

  insSec.run(
    'about',
    'About Me',
    'Tentang Saya',
    'I am a fresh graduate developer with 1+ year of hands-on experience building and deploying production applications across mobile, frontend, and backend stacks. Having built systems for PT. Industri Kereta Api (Persero), public government offices, and university platforms, I specialize in transforming manual workflows into intuitive digital solutions.',
    'Saya adalah pengembang perangkat lunak lulusan baru dengan pengalaman 1+ tahun membangun dan merilis aplikasi produksi di bidang mobile, frontend, dan backend. Berpengalaman mengembangkan sistem di PT. Industri Kereta Api (Persero), instansi pemerintahan, dan universitas.',
    '',
    '',
    '',
    3
  );

  insSec.run(
    'experience',
    'Work Experience',
    'Pengalaman Kerja',
    'Professional internship experience building enterprise QA/QC inspection and logistics digitalization workflows.',
    'Pengalaman magang profesional dalam digitalisasi alur inspeksi QA/QC dan logistik industri manufaktur.',
    '',
    '',
    '',
    4
  );

  insSec.run(
    'projects',
    'Projects & Case Studies',
    'Proyek & Studi Kasus',
    'A collection of web and mobile applications developed across various platforms, from production systems to open-source solutions.',
    'Koleksi aplikasi web dan mobile yang dikembangkan di berbagai platform, mulai dari sistem produksi hingga solusi terbuka.',
    '',
    '',
    '',
    5
  );

  insSec.run(
    'skills',
    'Skills & Tech Stack',
    'Keahlian & Teknologi',
    'The languages, frameworks, APIs, databases, and development workflows I use to build reliable production applications.',
    'Bahasa pemrograman, framework, API, basis data, dan metodologi pengembangan yang saya gunakan dalam membangun sistem andal.',
    '',
    '',
    '',
    6
  );

  insSec.run(
    'education',
    'Education & Certifications',
    'Pendidikan & Sertifikasi',
    'Academic degrees in Informatics Engineering from PENS and national technical certification from BNSP.',
    'Gelar akademik Teknik Informatika dari PENS dan sertifikasi kompetensi teknis nasional dari BNSP.',
    '',
    '',
    '',
    7
  );

  insSec.run(
    'contact',
    "Let's Connect",
    'Mari Terhubung',
    'Open to junior developer roles, fullstack and mobile engineering positions, and impactful project collaborations.',
    'Terbuka untuk peluang junior developer, rekayasa mobile & fullstack, serta kolaborasi proyek berdampak.',
    'Open to junior developer roles & projects',
    'Terbuka untuk peluang junior developer & proyek',
    '',
    8
  );

  // 2. Work Experience (PT INKA)
  const insExp = db.prepare(`
    INSERT OR REPLACE INTO experiences (id, company, position, position_id, program, program_id, location, period, description, description_id, systems, systems_id, technologies, collaboration, collaboration_id, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const inkaSystems = JSON.stringify([
    {
      title: 'Paperless Inspection System',
      tagline: 'QA/QC Inspection Digitalization',
      description: 'Contributed to the development of a digital inspection system for QA/QC workflows. The system replaced manual paper-based documentation with a structured digital workflow to reduce recording errors, improve documentation efficiency, and streamline QA/QC inspection processes.',
      tech: 'Laravel, REST API, Data Synchronization, MySQL'
    },
    {
      title: 'Surat Jalan Online',
      tagline: 'Delivery-Order Digitalization',
      description: 'Contributed to the digitalization of the Surat Jalan Online system, streamlining delivery-order processes across PPO (Pusat Pelayanan Operasi), Logistics, Security, and external courier teams.',
      tech: 'Laravel, REST API, Workflow Automation'
    }
  ]);

  const inkaSystemsId = JSON.stringify([
    {
      title: 'Paperless Inspection System',
      tagline: 'Digitalisasi Inspeksi QA/QC',
      description: 'Berkontribusi dalam pengembangan sistem inspeksi digital untuk alur kerja QA/QC. Sistem ini menggantikan dokumentasi berbasis kertas manual dengan alur kerja digital terstruktur guna mengurangi galat pencatatan dan meningkatkan efisiensi proses inspeksi.',
      tech: 'Laravel, REST API, Data Synchronization, MySQL'
    },
    {
      title: 'Surat Jalan Online',
      tagline: 'Digitalisasi Surat Jalan & Logistik',
      description: 'Berkontribusi dalam digitalisasi sistem Surat Jalan Online untuk mempermudah alur pesanan pengiriman antardivisi PPO, Logistik, Keamanan, dan kurir eksternal.',
      tech: 'Laravel, REST API, Workflow Automation'
    }
  ]);

  insExp.run(
    1,
    'PT. Industri Kereta Api (Persero)',
    'Junior Software Developer Intern',
    'Junior Software Developer Intern',
    'Magang Nasional Batch 2',
    'Magang Nasional Batch 2',
    'Madiun, Indonesia',
    'November 2025 - May 2026',
    'Collaborated with cross-functional teams involving Engineering, Operations, and Logistics. Participated in requirement gathering, feature development, REST API integrations, data synchronization, and production deployment.',
    'Berkolaborasi dengan tim lintas fungsi yang melibatkan Engineering, Operasi, dan Logistik. Terlibat dalam pengumpulan kebutuhan, pengembangan fitur, integrasi REST API, sinkronisasi data, dan penyebaran produksi.',
    inkaSystems,
    inkaSystemsId,
    'Laravel, REST API, Data Synchronization, MySQL, Agile/Scrum',
    'Engineering, Operations, Logistics, QA/QC, Security',
    'Engineering, Operations, Logistics, QA/QC, Security',
    1
  );

  // 3. Featured Projects
  const insProj = db.prepare(`
    INSERT OR REPLACE INTO projects (id, title, title_id, description, description_id, problem, problem_id, solution, solution_id, impact, impact_id, contributions, contributions_id, year, role, role_id, tags, link, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insProj.run(
    1,
    'FoodLAB - Campus Food Ordering Platform',
    'FoodLAB - Platform Pemesanan Makanan Kampus',
    'A production campus food ordering mobile platform built to eliminate long canteen queues and streamline vendor order management.',
    'Platform pemesanan makanan kantin kampus yang dibangun untuk mengeliminasi antrean panjang dan mempermudah pengelolaan pesanan stan penjual.',
    'The campus canteen experienced severe overcrowding, with more than 200 students queuing daily.',
    'Kantin kampus mengalami penumpukan antrean parah dengan lebih dari 200 mahasiswa mengantre setiap hari.',
    'Built and launched FoodLAB, a campus food ordering platform connecting students directly with 10+ campus food vendors with real-time order updates.',
    'Membangun dan merilis FoodLAB, platform mobile yang menghubungkan mahasiswa langsung dengan 10+ penjual makanan dengan status pesanan real-time.',
    'Secured IDR 20M university funding · 300+ active users · 60% reduction in average waiting time · 10+ vendors adopted · Published on Google Play Store with 4.5+ rating.',
    'Mendapatkan pendanaan universitas Rp20 Juta · 300+ pengguna aktif · Penurunan 60% waktu tunggu rata-rata · 10+ tenant terintegrasi · Rilis di Google Play Store rating 4.5+.',
    'Engineered the complete Flutter mobile application architecture with Provider state management.\nBuilt the REST API integration layer for menu browsing, cart, and order placement flows.\nImplemented the real-time push notification service for live order status updates.\nCoordinated vendor onboarding for 10+ campus food tenants.',
    'Merancang arsitektur aplikasi mobile Flutter secara menyeluruh dengan manajemen state Provider.\nMembangun lapisan integrasi REST API untuk alur menu, keranjang, dan pemesanan.\nMengimplementasikan layanan notifikasi push real-time untuk status pesanan langsung.\nMengoordinasikan onboarding 10+ tenant makanan kampus.',
    '2023 - 2025',
    'Mobile App Developer (Flutter)',
    'Pengembang Aplikasi Mobile (Flutter)',
    'Flutter, Dart, Provider, REST API, Push Notifications, Agile Scrum',
    'https://play.google.com',
    1
  );

  insProj.run(
    2,
    'Real-Time Queue Management System',
    'Sistem Manajemen Antrean Real-Time',
    'A real-time digital queue management system deployed for public services in local government administration.',
    'Sistem manajemen antrean digital real-time yang diterapkan untuk pelayanan publik di kantor administrasi kelurahan.',
    'The existing public-service queue process relied heavily on manual paper-based processes and resulted in long service waiting times.',
    'Proses antrean pelayanan publik sebelumnya sangat bergantung pada kertas manual dan menimbulkan waktu tunggu yang lama.',
    'Developed and deployed a real-time mobile queue management system supporting multiple service counters with live queue tracking.',
    'Mengembangkan dan merilis sistem antrean mobile real-time yang mendukung banyak loket pelayanan dengan pelacakan antrean langsung.',
    'Reduced manual processes by 40% · Decreased average service time from 15 min to 7 min · Multi-counter support · Published on Google Play Store for public government service.',
    'Mengurangi proses manual sebesar 40% · Mempersingkat waktu layanan rata-rata dari 15 menit menjadi 7 menit · Mendukung multi-loket · Rilis di Google Play Store untuk layanan publik.',
    'Developed the real-time queue mobile application with WebSocket live synchronization.\nDesigned multi-counter queue state management and the live tracking UI.\nDeployed and maintained the production application at the urban village office.\nLed user onboarding sessions for office staff and citizens.',
    'Mengembangkan aplikasi mobile antrean real-time dengan sinkronisasi WebSocket.\nMerancang manajemen state antrean multi-loket dan UI pelacakan langsung.\nMelakukan deployment dan pemeliharaan aplikasi produksi di kantor kelurahan.\nMemandu sesi onboarding bagi staf kantor dan warga.',
    '2024',
    'Mobile App Developer (Flutter)',
    'Pengembang Aplikasi Mobile (Flutter)',
    'Flutter, Dart, REST API, WebSocket, Real-Time Sync',
    'https://play.google.com',
    2
  );

  // 4. Skills
  const insSkill = db.prepare(`
    INSERT OR REPLACE INTO skills (id, title, description, description_id, icon, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insSkill.run(1, 'Flutter', 'Programming & Development', 'Pemrograman & Pengembangan', '', 1);
  insSkill.run(2, 'Dart', 'Programming & Development', 'Pemrograman & Pengembangan', '', 2);
  insSkill.run(3, 'Laravel', 'Programming & Development', 'Pemrograman & Pengembangan', '', 3);
  insSkill.run(4, 'PHP', 'Programming & Development', 'Pemrograman & Pengembangan', '', 4);
  insSkill.run(5, 'React.js', 'Programming & Development', 'Pemrograman & Pengembangan', '', 5);
  insSkill.run(6, 'JavaScript', 'Programming & Development', 'Pemrograman & Pengembangan', '', 6);
  insSkill.run(7, 'HTML', 'Programming & Development', 'Pemrograman & Pengembangan', '', 7);
  insSkill.run(8, 'CSS', 'Programming & Development', 'Pemrograman & Pengembangan', '', 8);

  insSkill.run(9, 'REST API', 'Backend & API', 'Backend & API', '', 9);
  insSkill.run(10, 'API Integration', 'Backend & API', 'Backend & API', '', 10);
  insSkill.run(11, 'WebSocket', 'Backend & API', 'Backend & API', '', 11);

  insSkill.run(12, 'MySQL', 'Database', 'Basis Data', '', 12);

  insSkill.run(13, 'Git', 'Tools & Infrastructure', 'Alat & Infrastruktur', '', 13);
  insSkill.run(14, 'Docker', 'Tools & Infrastructure', 'Alat & Infrastruktur', '', 14);
  insSkill.run(15, 'Firebase', 'Tools & Infrastructure', 'Alat & Infrastruktur', '', 15);

  insSkill.run(16, 'Agile', 'Development Practices', 'Metodologi Pengembangan', '', 16);
  insSkill.run(17, 'Scrum', 'Development Practices', 'Metodologi Pengembangan', '', 17);
  insSkill.run(18, 'Debugging', 'Development Practices', 'Metodologi Pengembangan', '', 18);
  insSkill.run(19, 'AI Coding Agents', 'Development Practices', 'Metodologi Pengembangan', '', 19);

  insSkill.run(20, 'Problem Solving', 'Soft Skills', 'Keterampilan Interpersonal', '', 20);
  insSkill.run(21, 'Team Collaboration', 'Soft Skills', 'Keterampilan Interpersonal', '', 21);
  insSkill.run(22, 'Stakeholder Communication', 'Soft Skills', 'Keterampilan Interpersonal', '', 22);
  insSkill.run(23, 'Adaptability', 'Soft Skills', 'Keterampilan Interpersonal', '', 23);
  insSkill.run(24, 'Time Management', 'Soft Skills', 'Keterampilan Interpersonal', '', 24);

  // 5. Education
  const insEdu = db.prepare(`
    INSERT OR REPLACE INTO education (id, degree, degree_id, institution, location, period, gpa, description, description_id, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insEdu.run(
    1,
    'Bachelor of Applied Informatics Engineering',
    'Sarjana Terapan Teknik Informatika',
    'Electronic Engineering Polytechnic Institute of Surabaya (PENS)',
    'Surabaya, Indonesia',
    'June 2024 - July 2025',
    '3.58 / 4.00',
    'Advanced curriculum covering mobile application architecture, distributed backend services, agile development, and production software deployment.',
    'Kurikulum lanjutan mencakup arsitektur aplikasi mobile, layanan backend terdistribusi, pengembangan agile, dan penyebaran perangkat lunak produksi.',
    1
  );

  insEdu.run(
    2,
    'Diploma in Informatics Engineering',
    'Diploma Teknik Informatika',
    'Electronic Engineering Polytechnic Institute of Surabaya (PENS)',
    'Surabaya, Indonesia',
    'June 2021 - June 2024',
    '3.69 / 4.00',
    'Core informatics engineering foundations including data structures, database design, fullstack web development, and mobile application engineering.',
    'Fondasi inti teknik informatika termasuk struktur data, desain basis data, pengembangan web fullstack, dan rekayasa aplikasi mobile.',
    2
  );

  // 6. Certifications
  const insCert = db.prepare(`
    INSERT OR REPLACE INTO certifications (id, title, title_id, issuer, location, issue_date, credential_info, credential_info_id, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insCert.run(
    1,
    'Junior Web Developer',
    'Junior Web Developer',
    'BNSP (Badan Nasional Sertifikasi Profesi) / Digital Talent Scholarship 2024',
    'Surabaya, Indonesia',
    'July 2024',
    'Certified in PHP-based web development, relational database integration (MySQL), and frontend web fundamentals.',
    'Sertifikasi kompetensi dalam rekayasa web berbasis PHP, manajemen basis data relasional (MySQL), dan fundamental web frontend.',
    1
  );

  // 7. General Developer Statistics
  const insStat = db.prepare(`
    INSERT OR REPLACE INTO about_stats (id, value, label, label_id, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `);

  insStat.run(1, '1+ yr', 'Hands-on Experience', 'Pengalaman Praktis', 1);
  insStat.run(2, '3+', 'Production Systems Built', 'Sistem Produksi', 2);
  insStat.run(3, '300+', 'Active Users Served', 'Pengguna Aktif Dilayani', 3);
  insStat.run(4, '2', 'Play Store Apps Published', 'Aplikasi Play Store Rilis', 4);

  // 8. Settings
  const insSet = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  insSet.run('site_title', 'Adam Ghazy Al Falah - Mobile, Frontend & Backend Developer');
  insSet.run('site_description', 'Portfolio of Adam Ghazy Al Falah, a Junior Mobile, Frontend & Backend Developer specializing in Flutter, Laravel, React.js, and REST API.');
  insSet.run('site_description_id', 'Portofolio Adam Ghazy Al Falah, Pengembang Perangkat Lunak Junior yang berfokus pada Flutter, Laravel, React.js, dan REST API.');
  insSet.run('hero_meta', 'junior developer · flutter, laravel, react & rest api · open to work');
  insSet.run('hero_meta_id', 'junior developer · flutter, laravel, react & rest api · terbuka untuk kerja');
  insSet.run('footer_tagline', 'turning problems into solutions');
  insSet.run('footer_tagline_id', 'mengubah masalah menjadi solusi digital');
  insSet.run('status_left', 'ADAM GHAZY // JUNIOR DEVELOPER');
  insSet.run('status_right', 'designed & built by Adam Ghazy Al Falah · © 2026');
  insSet.run('email', 'ghozyalfalah02@gmail.com');
  insSet.run('phone', '(+62) 85784269105');
  insSet.run('linkedin', 'https://www.linkedin.com/in/adamghazy');
  insSet.run('location', 'Madiun, Indonesia');

  // Seed default admin - password: admin123
  const defaultPasswordHash = bcrypt.hashSync('admin123', 12);
  db.prepare('INSERT OR IGNORE INTO admin_users (username, password_hash) VALUES (?, ?)')
    .run('admin', defaultPasswordHash);
}

export default getDb;
