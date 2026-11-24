'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  BarChart3,
  Briefcase,
  Building2,
  FileText,
  GraduationCap,
  TrendingUp,
  Wrench,
} from 'lucide-react'

import { AdminPageHeader, AdminShell } from '@/components/admin/admin-shell'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface DashboardStats {
  sections: number
  experiences: number
  projects: number
  skills: number
  stats: number
  education: number
  certifications: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    sections: 0,
    experiences: 0,
    projects: 0,
    skills: 0,
    stats: 0,
    education: 0,
    certifications: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/sections').then(r => r.json()),
      fetch('/api/experiences').then(r => r.json()),
      fetch('/api/projects').then(r => r.json()),
      fetch('/api/skills').then(r => r.json()),
      fetch('/api/about-stats').then(r => r.json()),
      fetch('/api/education').then(r => r.json()),
      fetch('/api/certifications').then(r => r.json()),
    ])
      .then(([sections, experiences, projects, skills, statsData, eduData, certData]) => {
        setStats({
          sections: Array.isArray(sections) ? sections.length : 0,
          experiences: Array.isArray(experiences) ? experiences.length : 0,
          projects: Array.isArray(projects) ? projects.length : 0,
          skills: Array.isArray(skills) ? skills.length : 0,
          stats: Array.isArray(statsData) ? statsData.length : 0,
          education: Array.isArray(eduData) ? eduData.length : 0,
          certifications: Array.isArray(certData) ? certData.length : 0,
        })
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // KPI summaries sit above the records they summarise.
  const cards = [
    { title: 'Sections', description: 'Content sections', value: stats.sections, icon: FileText, href: '/admin/sections' },
    { title: 'Experience', description: 'Work & internship history', value: stats.experiences, icon: Building2, href: '/admin/experiences' },
    { title: 'Projects', description: 'Portfolio projects', value: stats.projects, icon: Briefcase, href: '/admin/my-projects' },
    { title: 'Education & Certs', description: `${stats.education} degrees · ${stats.certifications} ${stats.certifications === 1 ? 'certification' : 'certifications'}`, value: stats.education + stats.certifications, icon: GraduationCap, href: '/admin/education' },
    { title: 'Skills', description: 'Skill offerings', value: stats.skills, icon: Wrench, href: '/admin/skills' },
    { title: 'Stats', description: 'About statistics', value: stats.stats, icon: BarChart3, href: '/admin/stats' },
  ]

  // Activity feed is derived from the record counts already fetched above —
  // no extra API. Highest-traffic surfaces first, most recently edited unknown.
  const activity = [
    { label: 'Projects library', detail: `${stats.projects} case studies under management`, href: '/admin/my-projects' },
    { label: 'Experience timeline', detail: `${stats.experiences} roles tracked`, href: '/admin/experiences' },
    { label: 'Education & certifications', detail: `${stats.education} degrees · ${stats.certifications} certifications`, href: '/admin/education' },
  ].filter(Boolean)

  return (
    <AdminShell>
      <div className="mx-auto max-w-[1400px] space-y-6">
        <AdminPageHeader
          title="Dashboard"
          description="Overview of every managed record in the portfolio."
          actions={<Badge variant={loading ? 'pending' : 'active'}>{loading ? 'Syncing' : 'In sync'}</Badge>}
        />

        {/* Stat cards — staggered fade-up entry */}
        <div className="admin-stagger grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link key={card.title} href={card.href} className="group outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
              <Card className="h-full cursor-pointer rounded-lg border border-border bg-card p-6 transition-shadow duration-200 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <card.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <div className="mt-2 text-3xl font-bold tracking-tight tabular-nums text-foreground">
                  {loading ? '—' : card.value}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{card.description}</p>
                <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Active content
                </p>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {/* Recent activity / last-edited areas, from the same fetched counts */}
          <Card className="rounded-lg border border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Recent activity</CardTitle>
              <CardDescription>Areas with live content under management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {activity.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-4 rounded-md border border-border px-4 py-3 transition-colors duration-200 hover:bg-accent"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{item.label}</p>
                    <p className="truncate text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-lg border border-border bg-card">
            <CardHeader>
              <CardTitle className="text-base font-semibold">System</CardTitle>
              <CardDescription>Platform the admin runs on</CardDescription>
            </CardHeader>
            <CardContent>
              {[
                { label: 'Framework', value: 'Next.js App Router' },
                { label: 'Database', value: 'SQLite (WAL)' },
                { label: 'Auth', value: 'JWT + httpOnly cookie' },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between border-b border-border py-3 last:border-b-0"
                >
                  <span className="text-sm text-muted-foreground">{row.label}</span>
                  <span className="text-sm font-medium text-foreground">{row.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminShell>
  )
}
