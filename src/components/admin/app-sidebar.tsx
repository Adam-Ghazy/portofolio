'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  BarChart3,
  Briefcase,
  Building2,
  ExternalLink,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Workflow,
  Wrench,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface AdminNavItem {
  name: string
  href: string
  icon: typeof LayoutDashboard
  /** Optional live counter badge, fed from `useNavCounts`. */
  countKey?: NavCountKey
}

interface AdminNavSection {
  label: string
  items: AdminNavItem[]
}

type NavCountKey =
  | 'sections'
  | 'experiences'
  | 'projects'
  | 'education'
  | 'certifications'
  | 'approaches'
  | 'skills'
  | 'stats'

type NavCounts = Record<NavCountKey, number>

/** One nav config drives the sidebar, the breadcrumb title, and the ⌘K palette. */
export const adminNavigation: AdminNavSection[] = [
  {
    label: 'Overview',
    items: [{ name: 'Dashboard', href: '/admin', icon: LayoutDashboard }],
  },
  {
    label: 'Content',
    items: [
      { name: 'Sections', href: '/admin/sections', icon: FileText, countKey: 'sections' },
      { name: 'Experience', href: '/admin/experiences', icon: Building2, countKey: 'experiences' },
      { name: 'Projects', href: '/admin/my-projects', icon: Briefcase, countKey: 'projects' },
      {
        name: 'Education & Certs',
        href: '/admin/education',
        icon: GraduationCap,
        countKey: 'education',
      },
      { name: 'Approach', href: '/admin/approaches', icon: Workflow, countKey: 'approaches' },
    ],
  },
  {
    label: 'Library',
    items: [
      { name: 'Skills', href: '/admin/skills', icon: Wrench, countKey: 'skills' },
      { name: 'Stats', href: '/admin/stats', icon: BarChart3, countKey: 'stats' },
    ],
  },
  {
    label: 'System',
    items: [{ name: 'Settings', href: '/admin/settings', icon: Settings }],
  },
]

const flatNavigation = adminNavigation.flatMap((section) => section.items)

export function adminPageTitle(pathname: string) {
  return (
    flatNavigation.find((item) =>
      item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
    )?.name ?? 'Dashboard'
  )
}

function isActive(pathname: string, href: string) {
  return href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
}

/**
 * Counters for the sidebar badges. Calls the same list APIs the dashboard uses
 * (no new endpoints) and caches in sessionStorage for 60s so navigation between
 * admin pages stays request-free.
 */
const countEndpoints: [NavCountKey, string][] = [
  ['sections', '/api/sections'],
  ['experiences', '/api/experiences'],
  ['projects', '/api/projects'],
  ['education', '/api/education'],
  ['certifications', '/api/certifications'],
  ['approaches', '/api/approaches'],
  ['skills', '/api/skills'],
  ['stats', '/api/about-stats'],
]

const COUNTS_CACHE_KEY = 'admin-nav-counts'
const COUNTS_TTL_MS = 60_000

function readCachedCounts(): NavCounts | null {
  try {
    const raw = sessionStorage.getItem(COUNTS_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { at: number; counts: NavCounts }
    if (Date.now() - parsed.at > COUNTS_TTL_MS) return null
    return parsed.counts
  } catch {
    return null
  }
}

function cacheCounts(counts: NavCounts) {
  try {
    sessionStorage.setItem(COUNTS_CACHE_KEY, JSON.stringify({ at: Date.now(), counts }))
  } catch {
    // Cache is an optimization; fetch again next mount.
  }
}

function useNavCounts() {
  // Lazy init reads the session cache synchronously; the admin shell only
  // renders this component after mount, so SSR never sees a divergent value.
  const [counts, setCounts] = useState<NavCounts | null>(() => readCachedCounts())

  useEffect(() => {
    if (counts) return
    let cancelled = false
    Promise.all(
      countEndpoints.map(([, url]) =>
        fetch(url)
          .then((r) => (r.ok ? r.json() : []))
          .catch(() => [])
      )
    ).then((responses) => {
      if (cancelled) return
      const next = Object.fromEntries(
        countEndpoints.map(([key], i) => [key, Array.isArray(responses[i]) ? responses[i].length : 0])
      ) as NavCounts
      // Education & Certs is one nav item, so its badge carries the combined total.
      next.education = next.education + next.certifications
      setCounts(next)
      cacheCounts(next)
    })
    return () => {
      cancelled = true
    }
  }, [counts])

  return counts
}

export function AdminSidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string
  /** Called after a link click so the mobile sheet can close. */
  onNavigate?: () => void
}) {
  const counts = useNavCounts()
  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-sidebar-border px-6">
        <Link href="/admin" prefetch={false} onClick={onNavigate} className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-primary text-label-md font-semibold text-primary-foreground">
            A
          </span>
          <span className="whitespace-nowrap text-headline-sm text-foreground">
            Portfolio Admin
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin sections">
        {adminNavigation.map((section) => (
          <div key={section.label} className="mb-5 last:mb-0">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(pathname, item.href)
                const count = item.countKey ? counts?.[item.countKey] : undefined
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      prefetch={false}
                      onClick={onNavigate}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex h-9 items-center gap-2.5 rounded-[8px] px-3 text-body-md transition-all duration-200 motion-safe:hover:translate-x-[3px]',
                        active
                          ? 'bg-accent font-medium text-accent-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                      <span className="truncate">{item.name}</span>
                      {typeof count === 'number' && (
                        <Badge
                          variant="secondary"
                          className="ml-auto h-5 min-w-5 justify-center rounded-full px-1.5 tabular-nums"
                        >
                          {count}
                        </Badge>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Shortcut card — the prototype's "Upgrade to Pro" slot, portfolio edition. */}
      <div className="shrink-0 border-t border-sidebar-border p-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-[12px] border border-border bg-card p-3 transition-shadow duration-200 hover:shadow-md"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 shrink-0 text-foreground" strokeWidth={1.5} />
            <span className="text-label-md font-medium text-foreground">View Site</span>
          </div>
          <p className="mt-1 text-label-sm text-muted-foreground">
            Open the public portfolio
          </p>
        </a>
      </div>
    </div>
  )
}
