'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/layout-wrapper'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  Briefcase,
  Building2,
  FileText,
  GraduationCap,
  Workflow,
  Wrench,
} from 'lucide-react'

interface DashboardStats {
  sections: number
  experiences: number
  projects: number
  skills: number
  stats: number
  education: number
  certifications: number
  approaches: number
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
    approaches: 0,
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
      fetch('/api/approaches').then(r => r.json()),
    ])
      .then(([sections, experiences, projects, skills, statsData, eduData, certData, approachesData]) => {
        setStats({
          sections: Array.isArray(sections) ? sections.length : 0,
          experiences: Array.isArray(experiences) ? experiences.length : 0,
          projects: Array.isArray(projects) ? projects.length : 0,
          skills: Array.isArray(skills) ? skills.length : 0,
          stats: Array.isArray(statsData) ? statsData.length : 0,
          education: Array.isArray(eduData) ? eduData.length : 0,
          certifications: Array.isArray(certData) ? certData.length : 0,
          approaches: Array.isArray(approachesData) ? approachesData.length : 0,
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
    { title: 'Approach', description: 'Engineering approach steps', value: stats.approaches, icon: Workflow, href: '/admin/approaches' },
    { title: 'Skills', description: 'Skill offerings', value: stats.skills, icon: Wrench, href: '/admin/skills' },
    { title: 'Stats', description: 'About statistics', value: stats.stats, icon: BarChart3, href: '/admin/stats' },
  ]

  const quickActions = [
    { title: 'Education & Certifications', description: 'Academic degrees, GPAs, and national certifications', href: '/admin/education', icon: GraduationCap },
    { title: 'Work Experience', description: 'Professional roles and systems delivered', href: '/admin/experiences', icon: Building2 },
    { title: 'Projects & Case Studies', description: 'Problem, solution, and impact write-ups', href: '/admin/my-projects', icon: Briefcase },
  ]

  const systemInfo = [
    { label: 'Framework', value: 'Next.js App Router' },
    { label: 'Database', value: 'SQLite (WAL)' },
    { label: 'Auth', value: 'JWT + httpOnly cookie' },
  ]

  return (
    <AdminLayout>
      <div className="mx-auto max-w-[1400px] space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-body-md text-muted-foreground">
            Overview of every managed record in the portfolio.
          </p>
          <Badge variant={loading ? 'pending' : 'active'}>
            {loading ? 'Syncing' : 'In sync'}
          </Badge>
        </div>

        <section aria-labelledby="kpi-heading" className="space-y-3">
          <h2 id="kpi-heading" className="text-label-section uppercase text-muted-foreground">
            Record counts
          </h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
              <Link key={card.title} href={card.href} className="group">
                <Card className="h-full transition-colors group-hover:border-border-strong">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-body-md text-muted-foreground">{card.title}</CardTitle>
                    <card.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-headline-lg tabular-nums text-foreground">
                      {loading ? '—' : card.value}
                    </div>
                    <p className="mt-1 text-label-md text-muted-foreground">{card.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-4 rounded-[12px] border border-border px-4 py-3 transition-colors hover:bg-sidebar hover:border-border-strong"
                >
                  <action.icon className="h-5 w-5 shrink-0 text-foreground" strokeWidth={1.5} />
                  <div className="min-w-0">
                    <p className="text-headline-sm text-foreground">{action.title}</p>
                    <p className="text-label-md text-muted-foreground">{action.description}</p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              {systemInfo.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between border-b border-border py-3 last:border-b-0"
                >
                  <span className="text-label-md text-muted-foreground">{row.label}</span>
                  <span className="text-body-md text-foreground">{row.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
