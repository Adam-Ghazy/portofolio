'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/layout-wrapper'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Briefcase, Building2, Wrench, BarChart3, GraduationCap, Workflow } from 'lucide-react'

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

  const cards = [
    { title: 'Sections', description: 'Content sections', value: stats.sections, icon: FileText, href: '/admin/sections' },
    { title: 'Experience', description: 'Work & internship history', value: stats.experiences, icon: Building2, href: '/admin/experiences' },
    { title: 'Projects', description: 'Portfolio projects', value: stats.projects, icon: Briefcase, href: '/admin/my-projects' },
    { title: 'Education & Certs', description: `${stats.education} Degrees · ${stats.certifications} Certifications`, value: stats.education + stats.certifications, icon: GraduationCap, href: '/admin/education' },
    { title: 'Approach', description: 'Engineering approach steps', value: stats.approaches, icon: Workflow, href: '/admin/approaches' },
    { title: 'Skills', description: 'Skill offerings', value: stats.skills, icon: Wrench, href: '/admin/skills' },
    { title: 'Stats', description: 'About statistics', value: stats.stats, icon: BarChart3, href: '/admin/stats' },
  ]

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your portfolio content</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link key={card.title} href={card.href}>
              <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <card.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? '…' : card.value}</div>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your portfolio content</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Link href="/admin/education" className="flex items-center gap-4 rounded-lg border p-4 hover:bg-accent transition-colors">
                <GraduationCap className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">Manage Education & Certifications</p>
                  <p className="text-sm text-muted-foreground">Update academic degrees, GPAs, and national certifications</p>
                </div>
              </Link>
              <Link href="/admin/experiences" className="flex items-center gap-4 rounded-lg border p-4 hover:bg-accent transition-colors">
                <Building2 className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">Manage Work Experience</p>
                  <p className="text-sm text-muted-foreground">Add or update professional roles and systems</p>
                </div>
              </Link>
              <Link href="/admin/my-projects" className="flex items-center gap-4 rounded-lg border p-4 hover:bg-accent transition-colors">
                <Briefcase className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">Manage Projects & Case Studies</p>
                  <p className="text-sm text-muted-foreground">Showcase your latest work with problem-solution-impact</p>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Info</CardTitle>
              <CardDescription>Portfolio admin details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Framework</span>
                <span className="font-medium">Next.js App Router</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Database</span>
                <span className="font-medium">SQLite (WAL)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Auth</span>
                <span className="font-medium">JWT + httpOnly cookie</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
