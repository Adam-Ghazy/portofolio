'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Bell, LogOut, Menu, Search, UserRound } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Toaster } from '@/components/ui/sonner'
import { useMounted } from '@/hooks/use-mounted'
import { cn } from '@/lib/utils'
import { ErrorBoundary } from './error-boundary'
import { ThemeToggle } from './ThemeToggle'
import { CommandPalette } from './command-palette'
import { AdminSidebarNav, adminPageTitle } from './app-sidebar'

/**
 * The single admin shell — every /admin page renders `<AdminShell>` and nothing
 * else mounts a sidebar or header. Desktop: fixed w-64 sidebar. Mobile: Sheet.
 * Header: SidebarTrigger + breadcrumb left, search/theme/bell/avatar right.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const mounted = useMounted()
  const pathname = usePathname() || ''
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const title = adminPageTitle(pathname)

  // ⌘K / Ctrl+K opens the palette from any admin page.
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setPaletteOpen((v) => !v)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

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
        {/* Desktop: fixed w-64 sidebar */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar md:block">
          <AdminSidebarNav pathname={pathname} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col md:pl-64">
          <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
            {/* Mobile: off-canvas sidebar */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 md:hidden"
                  aria-label="Open navigation"
                >
                  <Menu className="h-4 w-4" strokeWidth={1.5} />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-64 border-sidebar-border bg-sidebar p-0 [&>button]:right-3"
              >
                <SheetTitle className="sr-only">Admin navigation</SheetTitle>
                <AdminSidebarNav
                  pathname={pathname}
                  onNavigate={() => setMobileOpen(false)}
                />
              </SheetContent>
            </Sheet>

            <Separator orientation="vertical" className="h-5 md:hidden" />

            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <Link
                    href="/admin"
                    prefetch={false}
                    className="transition-colors hover:text-foreground"
                  >
                    Dashboard
                  </Link>
                </BreadcrumbItem>
                {pathname !== '/admin' && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="max-w-[40vw] truncate font-medium">
                        {title}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>

            <div className="ml-auto flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPaletteOpen(true)}
                aria-label="Search (Command K)"
                title="Search (⌘K)"
              >
                <Search className="h-4 w-4" strokeWidth={1.5} />
              </Button>
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="relative h-8 w-8"
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell className="h-4 w-4" strokeWidth={1.5} />
                <span
                  aria-hidden
                  className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-destructive"
                />
              </Button>

              <Separator orientation="vertical" className="mx-1 h-5" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="rounded-full outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Open account menu"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-label-sm font-semibold text-primary-foreground">
                        AD
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="text-label-md text-foreground">Admin</span>
                      <span className="text-label-sm text-muted-foreground">
                        admin@portfolio
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/admin/settings')}>
                    <UserRound className="h-4 w-4" strokeWidth={1.5} />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault()
                      handleLogout()
                    }}
                  >
                    <LogOut className="h-4 w-4" strokeWidth={1.5} />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} onLogout={handleLogout} />
      <Toaster />
    </ErrorBoundary>
  )
}

/** Page heading: bold tracking-tight title + muted subtitle (+ optional actions). */
export function AdminPageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-3', className)}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions}
    </div>
  )
}
