'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Toaster } from '@/components/ui/sonner'
import { useMounted } from '@/hooks/use-mounted'
import { cn } from '@/lib/utils'
import { ErrorBoundary } from './error-boundary'
import { ThemeToggle } from './ThemeToggle'
import {
  BarChart3,
  Briefcase,
  Building2,
  ExternalLink,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Workflow,
  Wrench,
} from 'lucide-react'

/**
 * Industrial Governance admin navigation — DESIGN.md § Sidebar Navigation.
 * Grouped by lifecycle: every item carries a thin-stroke monochrome icon,
 * exactly one item is active per screen, and the active item is a white pill.
 */
const navigation = [
  {
    group: 'Overview',
    items: [{ name: 'Dashboard', href: '/admin', icon: LayoutDashboard }],
  },
  {
    group: 'Content',
    items: [
      { name: 'Sections', href: '/admin/sections', icon: FileText },
      { name: 'Experience', href: '/admin/experiences', icon: Building2 },
      { name: 'Projects', href: '/admin/my-projects', icon: Briefcase },
      { name: 'Education & Certs', href: '/admin/education', icon: GraduationCap },
      { name: 'Approach', href: '/admin/approaches', icon: Workflow },
    ],
  },
  {
    group: 'Library',
    items: [
      { name: 'Skills', href: '/admin/skills', icon: Wrench },
      { name: 'Stats', href: '/admin/stats', icon: BarChart3 },
    ],
  },
  {
    group: 'System',
    items: [{ name: 'Settings', href: '/admin/settings', icon: Settings }],
  },
]

const flatNavigation = navigation.flatMap((section) => section.items)

/**
 * `rail` collapses to the 64px icon rail between 768px and 1279px and expands to
 * the fixed 240px anchor from 1280px up. `drawer` is always fully expanded — it
 * only ever renders inside the mobile off-canvas sheet.
 */
function SidebarNav({
  pathname,
  onLogout,
  variant,
}: {
  pathname: string
  onLogout: () => void
  variant: 'rail' | 'drawer'
}) {
  const rail = variant === 'rail'
  // At md–xl the rail collapses to icons and the marker would be unreadable
  // noise; CSS can't express this in JSX, so track it with a matchMedia.
  const [railExpanded, setRailExpanded] = useState(true)

  useEffect(() => {
    if (!rail) return
    const mq = window.matchMedia('(min-width: 1280px)')
    const apply = () => setRailExpanded(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [rail])

  return (
    <div
      className={cn(
        'flex h-full flex-col border-r border-sidebar-border bg-sidebar',
        rail ? 'w-16 xl:w-60' : 'w-60'
      )}
    >
      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b border-sidebar-border',
          rail ? 'justify-center px-3 xl:justify-start xl:px-6' : 'gap-2 px-6'
        )}
      >
        <Link href="/admin" prefetch={false} className="flex items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-primary text-label-md font-semibold text-primary-foreground">
            A
          </span>
          <span
            className={cn(
              'text-headline-sm whitespace-nowrap text-foreground',
              rail && 'hidden xl:inline'
            )}
          >
            Portfolio Admin
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {navigation.map((section) => (
          <div key={section.group} className="mb-4 last:mb-0">
            <p
              className={cn(
                'mb-4 px-3 text-label-section uppercase text-muted-foreground',
                rail && 'hidden xl:block'
              )}
            >
              {section.group}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active =
                  item.href === '/admin'
                    ? pathname === '/admin'
                    : pathname.startsWith(item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      prefetch={false}
                      title={item.name}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'relative flex h-9 items-center gap-2.5 rounded-[12px] text-body-md transition-colors',
                        rail ? 'justify-center px-0 xl:justify-start xl:px-3' : 'px-3',
                        active
                          ? 'bg-surface font-semibold text-foreground shadow-card'
                          : 'text-muted-foreground hover:bg-surface/60 hover:text-foreground'
                      )}
                    >
                      {/* Active marker: the system's sole accent (#222222) is
                          reserved for active navigation (DESIGN.md Colors) — the
                          white pill alone is 1.02:1 on the #FAFAFA rail. Hidden
                          only in the collapsed icon rail (no room to read it). */}
                      {active && railExpanded && (
                        <span
                          aria-hidden
                          className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-primary"
                        />
                      )}
                      <item.icon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-colors',
                          active ? 'text-primary' : 'text-muted-foreground'
                        )}
                        strokeWidth={1.5}
                      />
                      <span className={cn('truncate', rail && 'hidden xl:inline')}>
                        {item.name}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-sidebar-border p-3">
        <div
          className={cn(
            'flex items-center',
            rail ? 'justify-center xl:justify-between' : 'justify-between'
          )}
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className={cn('flex flex-col', rail && 'hidden xl:flex')}>
              <span className="text-label-md text-foreground">Admin</span>
              <span className="text-label-sm text-muted-foreground">admin@portfolio</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            title="Log out"
            aria-label="Log out"
            className={cn('h-8 w-8', rail && 'hidden xl:inline-flex')}
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const mounted = useMounted()
  const pathname = usePathname() || ''
  const title =
    flatNavigation.find((item) =>
      item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
    )?.name ?? 'Dashboard'

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' })
    } catch (err) {
      console.error('Logout error:', err)
    }
    window.location.href = '/admin/login'
  }

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-body-md text-muted-foreground">Loading…</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-background text-foreground">
        {/* Fixed rail: 64px icon rail on tablet, 240px anchor at >=1280px */}
        <div className="fixed inset-y-0 left-0 z-30 hidden md:block">
          <SidebarNav pathname={pathname} onLogout={handleLogout} variant="rail" />
        </div>
        <div className="hidden w-16 shrink-0 md:block xl:w-60" aria-hidden />

        <div className="flex min-w-0 flex-1 flex-col">
          {/* One header row per app: breadcrumb + title left, chrome right */}
          <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-surface px-4 md:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="outline" size="icon" aria-label="Open navigation">
                    <Menu className="h-4 w-4" strokeWidth={1.5} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-60 border-r border-sidebar-border p-0">
                  <SheetTitle className="sr-only">Admin navigation</SheetTitle>
                  <SidebarNav pathname={pathname} onLogout={handleLogout} variant="drawer" />
                </SheetContent>
              </Sheet>

              <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2">
                <Link
                  href="/admin"
                  prefetch={false}
                  className="text-label-md text-muted-foreground transition-colors hover:text-foreground"
                >
                  Admin
                </Link>
                <span className="text-label-md text-border-strong" aria-hidden>
                  /
                </span>
                <span className="truncate text-headline-sm text-foreground">{title}</span>
              </nav>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
                  <span className="hidden sm:inline">View site</span>
                </Link>
              </Button>
              <ThemeToggle />
              <Button
                variant="outline"
                size="icon"
                onClick={handleLogout}
                title="Log out"
                aria-label="Log out"
                className="md:hidden"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.5} />
              </Button>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
      <Toaster />
    </ErrorBoundary>
  )
}
