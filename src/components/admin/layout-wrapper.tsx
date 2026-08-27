'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FileText, Briefcase, MessageSquare, Wrench, BarChart3, Settings, LayoutDashboard, LogOut, Menu } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ErrorBoundary } from './error-boundary'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Sections', href: '/admin/sections', icon: FileText },
  { name: 'Projects', href: '/admin/my-projects', icon: Briefcase },
  { name: 'Skills', href: '/admin/skills', icon: Wrench },
  { name: 'Stats', href: '/admin/stats', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

function SidebarContent({ pathname, onLogout }: { pathname: string; onLogout: () => void }) {
  return (
    <div className="flex h-full w-64 flex-col border-r bg-white dark:bg-zinc-950">
      <div className="border-b px-6 py-4">
        <Link href="/admin" prefetch={false} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <span className="font-semibold">Portfolio Admin</span>
        </Link>
      </div>

      <div className="flex-1 overflow-auto p-2">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch={false}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-medium'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Admin</span>
              <span className="text-xs text-muted-foreground">admin@portfolio</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onLogout} title="Logout">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [pathname, setPathname] = useState('')
  const pathFromHook = usePathname()

  useEffect(() => {
    setPathname(pathFromHook)
    setMounted(true)
  }, [pathFromHook])

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
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading…</div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="flex h-screen">
        <div className="hidden md:block">
          <SidebarContent pathname={pathname} onLogout={handleLogout} />
        </div>

        <Sheet>
          <SheetTrigger asChild className="md:hidden fixed top-4 left-4 z-50">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent pathname={pathname} onLogout={handleLogout} />
          </SheetContent>
        </Sheet>

        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </ErrorBoundary>
  )
}
