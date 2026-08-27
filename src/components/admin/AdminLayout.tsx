'use client';

import { ReactNode } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, Sun, Moon, LogOut, ExternalLink } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

interface AdminLayoutProps {
  children: ReactNode;
  activeTab: string;
  tabs: { key: string; label: string; icon: string }[];
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

export function AdminLayout({ children, activeTab, tabs, onTabChange, onLogout }: AdminLayoutProps) {
  const { theme, toggle } = useTheme();

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 mb-2">
        <p className="text-xs font-mono font-medium tracking-wider uppercase opacity-60">Manage</p>
      </div>
      <nav className="flex-1 space-y-1 px-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="py-4">
                  <Sidebar />
                </div>
              </SheetContent>
            </Sheet>

            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-mono font-bold text-sm">
                A
              </div>
              <span className="hidden sm:inline-block font-mono font-medium text-sm">ADAM</span>
            </a>
            <Badge variant="secondary" className="font-mono text-xs">
              ADMIN
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle}>
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="/">
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                Site
              </a>
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-3.5 w-3.5 mr-1.5" />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-56 shrink-0 border-r min-h-[calc(100vh-3.5rem)]">
          <div className="py-4">
            <Sidebar />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
