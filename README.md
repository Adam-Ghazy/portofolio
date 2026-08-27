# portfolio-next

A production-ready portfolio website with a built-in admin dashboard. Built on Next.js 16 App Router with SQLite, JWT authentication, and full content management via a protected admin panel.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.9 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| Database | SQLite via better-sqlite3 (WAL mode) |
| Auth | JWT + bcryptjs |
| Image Processing | Sharp |
| Language | TypeScript |

---

## Getting Started

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Set JWT_SECRET in .env.local

# Start development server
npm run dev
```

**Default access:**
- Site: `http://localhost:3000`
- Admin: `http://localhost:3000/admin` — credentials: `admin` / `admin123`

> Change the default admin password before any public deployment.

---

## Project Structure

```
portfolio-next/
├── src/
│   ├── app/
│   │   ├── page.tsx            # Homepage
│   │   ├── about/              # About page
│   │   ├── work/               # Projects page
│   │   ├── services/           # Services page
│   │   ├── contact/            # Contact page
│   │   ├── admin/              # Admin dashboard
│   │   ├── api/
│   │   │   ├── auth/           # Login / logout
│   │   │   ├── projects/       # Projects CRUD
│   │   │   ├── sections/       # Sections CRUD
│   │   │   ├── services/       # Services CRUD
│   │   │   ├── testimonials/   # Testimonials CRUD
│   │   │   ├── about-stats/    # Stats CRUD
│   │   │   ├── settings/       # Site settings
│   │   │   └── upload/         # Image upload
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Work.tsx
│   │   ├── Services.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Contact.tsx
│   │   ├── Footer.tsx
│   │   ├── StatusBar.tsx
│   │   └── ThemeProvider.tsx
│   ├── lib/
│   │   ├── db.ts               # Database connection + schema
│   │   ├── auth.ts             # Auth middleware
│   │   └── validation.ts       # Form validation
│   └── types/
│       └── admin.ts
├── public/
│   └── uploads/                # User-uploaded images
├── data/
│   └── portfolio.db            # SQLite database (auto-created)
├── .env.example
├── DEPLOYMENT.md
└── package.json
```

---

## Admin Dashboard

Login at `/admin` to manage all site content:

- **Sections** — Edit hero, about, and contact copy
- **Projects** — Add and manage portfolio projects with images
- **Services** — Define service offerings
- **Testimonials** — Manage client quotes
- **Stats** — About page statistics
- **Settings** — Site title, meta description, footer text

---

## API Reference

All write operations require a valid JWT, sent either as an `httpOnly` cookie or an `Authorization: Bearer <token>` header.

**Public (GET):**

```
GET /api/sections
GET /api/projects
GET /api/testimonials
GET /api/services
GET /api/about-stats
GET /api/settings
```

**Protected (POST / PUT / DELETE):**

```
POST   /api/auth          Login
DELETE /api/auth          Logout
POST   /api/upload        Image upload
POST   /api/projects      Create project
PUT    /api/projects/:id  Update project
DELETE /api/projects/:id  Delete project
# Same pattern for sections, services, testimonials, about-stats
```

---

## Database Schema

Defined in `src/lib/db.ts`. Tables:

| Table | Purpose |
|---|---|
| `sections` | Page sections (hero, about, etc.) |
| `projects` | Portfolio projects |
| `testimonials` | Client testimonials |
| `services` | Service offerings |
| `about_stats` | About page statistics |
| `settings` | Site-wide settings |
| `admin_users` | Admin credentials |

---

## Scripts

```bash
npm run dev      # Start dev server on port 3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Environment Variables

```env
# Required
JWT_SECRET=<32+ character random string>

# Optional
NODE_ENV=production
DB_PATH=/custom/path/to/db
```

---

## Security

**Implemented:**
- JWT authentication via `httpOnly` cookies
- Auth middleware on all write routes
- File upload validation (type, size, extension whitelist)
- SQL injection prevention via prepared statements
- Password hashing with bcrypt

**Recommended for production:**
- Replace the default admin password
- Use a strong, randomly generated `JWT_SECRET`
- Serve over HTTPS
- Schedule regular database backups
- Keep dependencies up to date

---

## Performance Notes

- **Build time:** ~6s with Turbopack
- **Database:** SQLite with WAL mode for concurrent reads
- **Images:** Processed with Sharp
- **Lighthouse:** 95+ score when deployed with SSL and CDN

**Known limitations:**

- SQLite is not suitable for high-traffic workloads (100+ concurrent writes). Migrate to PostgreSQL for scale.
- Uploaded images are stored in `public/uploads/`. Use an object store (S3, R2, etc.) for production deployments with multiple instances.

---

## Customization

**Default content** — Edit `seedDefaults()` in `src/lib/db.ts` to change the initial site title, hero text, projects, and services.

**Styling** — CSS variables are defined in `src/app/globals.css`. Fonts are imported in `src/app/layout.tsx`.

**Components** — All components in `src/components/` are self-contained. Override styles via CSS variables or Tailwind classes.

---

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full instructions covering:

- VPS / self-hosted (PM2 + Nginx + SSL)
- Vercel
- Docker

---

## Changelog

### v2.0 — July 2026

- Admin dashboard with full CRUD
- JWT authentication and auth middleware
- File upload with validation
- Form validation and error handling
- TypeScript types
- Security hardening
- Dark/light theme
- Mobile-responsive admin
- Deployment guide

### v1.0 — June 2026

- Initial static HTML portfolio

---

## License

MIT — see [LICENSE](./LICENSE) for details.

---

Built by Mtex
