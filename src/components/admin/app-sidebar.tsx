'use client'

import Link from 'next/link'
import {
  BarChart3,
  Briefcase,
  Building2,
  ExternalLink,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Wrench,
} from 'lucide-react'

import { cn } from '@/lib/utils'

interface AdminNavItem {
  name: string
  href: string
  icon: typeof LayoutDashboard
}

interface AdminNavSection {
  label: string
  items: AdminNavItem[]
}

export const adminNavigation: AdminNavSection[] = [
  {
    label: 'Overview',
    items: [{ name: 'Dashboard', href: '/admin', icon: LayoutDashboard }],
  },
  {
    label: 'Content',
    items: [
      { name: 'Sections', href: '/admin/sections', icon: FileText },
      { name: 'Experience', href: '/admin/experiences', icon: Building2 },
      { name: 'Projects', href: '/admin/my-projects', icon: Briefcase },
      { name: 'Education & Certs', href: '/admin/education', icon: GraduationCap },
    ],
  },
  {
    label: 'Library',
    items: [
      { name: 'Skills', href: '/admin/skills', icon: Wrench },
      { name: 'Stats', href: '/admin/stats', icon: BarChart3 },
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

export function AdminSidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string
  /** Called after a link click so the mobile sheet can close. */
  onNavigate?: () => void
}) {
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
