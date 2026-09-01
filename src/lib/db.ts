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
      subtitle TEXT,
      content TEXT,
      image_url TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      problem TEXT,
      solution TEXT,
      impact TEXT,
      image_url TEXT,
      year TEXT,
      role TEXT,
      tags TEXT,
      link TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS experiences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      position TEXT NOT NULL,
      program TEXT,
      location TEXT,
      period TEXT,
      description TEXT,
      systems TEXT,
      technologies TEXT,
      collaboration TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS education (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      degree TEXT NOT NULL,
      institution TEXT NOT NULL,
      location TEXT,
      period TEXT,
      gpa TEXT,
      description TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS certifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      issuer TEXT NOT NULL,
      location TEXT,
      issue_date TEXT,
      credential_info TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS about_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      value TEXT NOT NULL,
      label TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS approaches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      step_number TEXT,
      title TEXT NOT NULL,
      description TEXT,
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

  try {
    const pragmaExp = db.prepare("PRAGMA table_info(experiences)").all() as any[];
    const expCols = pragmaExp.map((c: any) => c.name);
    if (!expCols.includes('collaboration')) {
      db.exec('ALTER TABLE experiences ADD COLUMN collaboration TEXT');
      db.prepare("UPDATE experiences SET collaboration = 'Engineering, Operations, Logistics, QA/QC, Security' WHERE collaboration IS NULL OR collaboration = ''").run();
    }
  } catch (e) {
    // ignore
  }

  try {
    const pragmaProjects = db.prepare("PRAGMA table_info(projects)").all() as any[];
    const cols = pragmaProjects.map((c: any) => c.name);
    if (!cols.includes('problem')) db.exec('ALTER TABLE projects ADD COLUMN problem TEXT');
    if (!cols.includes('solution')) db.exec('ALTER TABLE projects ADD COLUMN solution TEXT');
    if (!cols.includes('impact')) db.exec('ALTER TABLE projects ADD COLUMN impact TEXT');
  } catch (e) {
    // ignore
  }

  try {
    const projSec = db.prepare("SELECT * FROM sections WHERE slug = 'projects'").get() as any;
    if (projSec && (projSec.title === 'Featured Projects' || projSec.subtitle?.includes('Google Play Store'))) {
      db.prepare(`
        UPDATE sections 
        SET title = 'Projects & Case Studies', 
            subtitle = 'A collection of web and mobile applications developed across various platforms, from production systems to open-source solutions.' 
        WHERE slug = 'projects'
      `).run();
    }
  } catch (e) {
    // ignore
  }

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
}

function seedApproaches() {
  const insApp = db.prepare(`
    INSERT OR REPLACE INTO approaches (id, step_number, title, description, sort_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insApp.run(
    1,
    '01',
    'User & Process Research',
    'Identify real friction points in daily workflows and interview end users and operators before writing code.',
    1,
    1
  );

  insApp.run(
    2,
    '02',
    'Modular Architecture',
    'Architect decoupled mobile modules, clean state management with Provider, and robust REST APIs with Laravel.',
    2,
    1
  );

  insApp.run(
    3,
    '03',
    'Real-Time Sync & QA',
    'Implement WebSocket connections, handle network fallbacks, and test edge cases to ensure zero recording errors.',
    3,
    1
  );

  insApp.run(
    4,
    '04',
    'Production Deployment',
    'Publish to Google Play Store, monitor user feedback, and iterate quickly using Agile Scrum sprints.',
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
    INSERT OR REPLACE INTO sections (slug, title, subtitle, content, image_url, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insSec.run(
    'hero',
    'Adam Ghazy Al Falah',
    'Junior Mobile, Frontend & Backend Developer building practical digital solutions that turn real-world problems into scalable, reliable applications.',
    'Mobile, Frontend & Backend Developer',
    '/uploads/profile_hero.jpg',
    1
  );

  insSec.run(
    'problem',
    'Engineering Methodology',
    'How I bridge operational challenges with practical, high-impact software solutions.',
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
    '',
    2
  );

  insSec.run(
    'about',
    'About Me',
    "I am a fresh graduate developer with 1+ year of hands-on experience building and deploying production applications across mobile, frontend, and backend stacks. Having built systems for PT. Industri Kereta Api (Persero), public government offices, and university platforms, I specialize in transforming manual workflows into intuitive digital solutions.",
    '',
    '',
    3
  );

  insSec.run(
    'experience',
    'Work Experience',
    'Professional internship experience building enterprise QA/QC inspection and logistics digitalization workflows.',
    '',
    '',
    4
  );

  insSec.run(
    'projects',
    'Projects & Case Studies',
    'A collection of web and mobile applications developed across various platforms, from production systems to open-source solutions.',
    '',
    '',
    5
  );

  insSec.run(
    'skills',
    'Skills & Tech Stack',
    'The languages, frameworks, APIs, databases, and development workflows I use to build reliable production applications.',
    '',
    '',
    6
  );

  insSec.run(
    'education',
    'Education & Certifications',
    'Academic degrees in Informatics Engineering from PENS and national technical certification from BNSP.',
    '',
    '',
    7
  );

  insSec.run(
    'contact',
    "Let's Connect",
    'Open to junior developer roles, fullstack and mobile engineering positions, and impactful project collaborations.',
    'Open to junior developer roles & projects',
    '',
    8
  );

  // 2. Work Experience (PT INKA)
  const insExp = db.prepare(`
    INSERT OR REPLACE INTO experiences (id, company, position, program, location, period, description, systems, technologies, collaboration, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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

  insExp.run(
    1,
    'PT. Industri Kereta Api (Persero)',
    'Junior Software Developer Intern',
    'Magang Nasional Batch 2',
    'Madiun, Indonesia',
    'November 2025 - May 2026',
    'Collaborated with cross-functional teams involving Engineering, Operations, and Logistics. Participated in requirement gathering, feature development, REST API integrations, data synchronization, and production deployment.',
    inkaSystems,
    'Laravel, REST API, Data Synchronization, MySQL, Agile/Scrum',
    'Engineering, Operations, Logistics, QA/QC, Security',
    1
  );

  // 3. Featured Projects
  const insProj = db.prepare(`
    INSERT OR REPLACE INTO projects (id, title, description, problem, solution, impact, year, role, tags, link, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insProj.run(
    1,
    'FoodLAB - Campus Food Ordering Platform',
    'A production campus food ordering mobile platform built to eliminate long canteen queues and streamline vendor order management.',
    'The campus canteen experienced severe overcrowding, with more than 200 students queuing daily.',
    'Built and launched FoodLAB, a campus food ordering platform connecting students directly with 10+ campus food vendors with real-time order updates.',
    'Secured IDR 20M university funding · 300+ active users · 60% reduction in average waiting time · 10+ vendors adopted · Published on Google Play Store with 4.5+ rating.',
    '2023 - 2025',
    'Mobile App Developer (Flutter)',
    'Flutter, Dart, Provider, REST API, Push Notifications, Agile Scrum',
    'https://play.google.com',
    1
  );

  insProj.run(
    2,
    'Real-Time Queue Management System',
    'A real-time digital queue management system deployed for public services in local government administration.',
    'The existing public-service queue process relied heavily on manual paper-based processes and resulted in long service waiting times.',
    'Developed and deployed a real-time mobile queue management system supporting multiple service counters with live queue tracking.',
    'Reduced manual processes by 40% · Decreased average service time from 15 min to 7 min · Multi-counter support · Published on Google Play Store for public government service.',
    '2024',
    'Mobile App Developer (Flutter)',
    'Flutter, Dart, REST API, WebSocket, Real-Time Sync',
    'https://play.google.com',
    2
  );

  // 4. Skills & Tech Stack (Without Emojis)
  const insSkill = db.prepare(`
    INSERT OR REPLACE INTO skills (id, title, description, icon, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `);

  // Programming & Development
  insSkill.run(1, 'Flutter', 'Programming & Development', '', 1);
  insSkill.run(2, 'Dart', 'Programming & Development', '', 2);
  insSkill.run(3, 'Laravel', 'Programming & Development', '', 3);
  insSkill.run(4, 'PHP', 'Programming & Development', '', 4);
  insSkill.run(5, 'React.js', 'Programming & Development', '', 5);
  insSkill.run(6, 'JavaScript', 'Programming & Development', '', 6);
  insSkill.run(7, 'HTML', 'Programming & Development', '', 7);
  insSkill.run(8, 'CSS', 'Programming & Development', '', 8);

  // Backend & API
  insSkill.run(9, 'REST API', 'Backend & API', '', 9);
  insSkill.run(10, 'API Integration', 'Backend & API', '', 10);
  insSkill.run(11, 'WebSocket', 'Backend & API', '', 11);

  // Database
  insSkill.run(12, 'MySQL', 'Database', '', 12);

  // Tools & Infrastructure
  insSkill.run(13, 'Git', 'Tools & Infrastructure', '', 13);
  insSkill.run(14, 'Docker', 'Tools & Infrastructure', '', 14);
  insSkill.run(15, 'Firebase', 'Tools & Infrastructure', '', 15);

  // Development Practices
  insSkill.run(16, 'Agile', 'Development Practices', '', 16);
  insSkill.run(17, 'Scrum', 'Development Practices', '', 17);
  insSkill.run(18, 'Debugging', 'Development Practices', '', 18);
  insSkill.run(19, 'AI Coding Agents', 'Development Practices', '', 19);

  // Soft Skills
  insSkill.run(20, 'Problem Solving', 'Soft Skills', '', 20);
  insSkill.run(21, 'Team Collaboration', 'Soft Skills', '', 21);
  insSkill.run(22, 'Stakeholder Communication', 'Soft Skills', '', 22);
  insSkill.run(23, 'Adaptability', 'Soft Skills', '', 23);
  insSkill.run(24, 'Time Management', 'Soft Skills', '', 24);

  // 5. Education
  const insEdu = db.prepare(`
    INSERT OR REPLACE INTO education (id, degree, institution, location, period, gpa, description, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insEdu.run(
    1,
    'Bachelor of Applied Informatics Engineering',
    'Electronic Engineering Polytechnic Institute of Surabaya (PENS)',
    'Surabaya, Indonesia',
    'June 2024 - July 2025',
    '3.58 / 4.00',
    'Advanced curriculum covering mobile application architecture, distributed backend services, agile development, and production software deployment.',
    1
  );

  insEdu.run(
    2,
    'Diploma in Informatics Engineering',
    'Electronic Engineering Polytechnic Institute of Surabaya (PENS)',
    'Surabaya, Indonesia',
    'June 2021 - June 2024',
    '3.69 / 4.00',
    'Core informatics engineering foundations including data structures, database design, fullstack web development, and mobile application engineering.',
    2
  );

  // 6. Certifications
  const insCert = db.prepare(`
    INSERT OR REPLACE INTO certifications (id, title, issuer, location, issue_date, credential_info, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insCert.run(
    1,
    'Junior Web Developer',
    'BNSP (Badan Nasional Sertifikasi Profesi) / Digital Talent Scholarship 2024',
    'Surabaya, Indonesia',
    'July 2024',
    'Certified in PHP-based web development, relational database integration (MySQL), and frontend web fundamentals.',
    1
  );

  // 7. General Developer Statistics
  const insStat = db.prepare(`
    INSERT OR REPLACE INTO about_stats (id, value, label, sort_order)
    VALUES (?, ?, ?, ?)
  `);

  insStat.run(1, '1+ yr', 'Hands-on Experience', 1);
  insStat.run(2, '3+', 'Production Systems Built', 2);
  insStat.run(3, '300+', 'Active Users Served', 3);
  insStat.run(4, '2', 'Play Store Apps Published', 4);

  // 8. Settings
  const insSet = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  insSet.run('site_title', 'Adam Ghazy Al Falah - Mobile, Frontend & Backend Developer');
  insSet.run('site_description', 'Portfolio of Adam Ghazy Al Falah, a Junior Mobile, Frontend & Backend Developer specializing in Flutter, Laravel, React.js, and REST API.');
  insSet.run('hero_meta', 'junior developer · flutter, laravel, react & rest api · open to work');
  insSet.run('footer_tagline', 'turning problems into solutions');
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
