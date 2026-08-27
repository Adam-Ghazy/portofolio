'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/layout-wrapper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Pencil, Trash2, Plus, Building2, Layers } from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface SystemItem {
  title: string
  tagline?: string
  description: string
  tech?: string
}

interface Experience {
  id: number
  company: string
  position: string
  program?: string
  location: string
  period: string
  description: string
  systems?: string
  technologies?: string
  sort_order: number
  is_active: number
}

const emptyForm = {
  company: '',
  position: '',
  program: '',
  location: '',
  period: '',
  description: '',
  technologies: '',
  sort_order: 0,
}

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Experience | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [systemsList, setSystemsList] = useState<SystemItem[]>([])

  useEffect(() => {
    fetchExperiences()
  }, [])

  async function fetchExperiences() {
    try {
      const res = await fetch('/api/experiences')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setExperiences(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to load experiences')
    } finally {
      setLoading(false)
    }
  }

  function handleAddSystem() {
    setSystemsList([
      ...systemsList,
      { title: '', tagline: '', description: '', tech: '' },
    ])
  }

  function handleUpdateSystem(index: number, field: keyof SystemItem, value: string) {
    const updated = [...systemsList]
    updated[index] = { ...updated[index], [field]: value }
    setSystemsList(updated)
  }

  function handleRemoveSystem(index: number) {
    setSystemsList(systemsList.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const url = editing ? `/api/experiences/${editing.id}` : '/api/experiences'
      const method = editing ? 'PUT' : 'POST'
      const body = {
        ...formData,
        systems: JSON.stringify(systemsList.filter((s) => s.title.trim() !== '')),
        sort_order: Number(formData.sort_order) || 0,
        ...(editing ? { is_active: editing.is_active } : { is_active: 1 }),
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error()
      toast.success(editing ? 'Experience updated' : 'Experience created')
      handleCancel()
      fetchExperiences()
    } catch {
      toast.error('Failed to save experience')
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/experiences/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Experience deleted')
      fetchExperiences()
    } catch {
      toast.error('Failed to delete experience')
    } finally {
      setDeleteId(null)
    }
  }

  function handleEdit(exp: Experience) {
    setEditing(exp)
    setFormData({
      company: exp.company,
      position: exp.position,
      program: exp.program ?? '',
      location: exp.location ?? '',
      period: exp.period ?? '',
      description: exp.description ?? '',
      technologies: exp.technologies ?? '',
      sort_order: exp.sort_order ?? 0,
    })

    try {
      const parsed = exp.systems ? JSON.parse(exp.systems) : []
      setSystemsList(Array.isArray(parsed) ? parsed : [])
    } catch {
      setSystemsList([])
    }
  }

  function handleCancel() {
    setEditing(null)
    setFormData(emptyForm)
    setSystemsList([])
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Work Experience</h1>
          <p className="text-muted-foreground">Manage your work history, company roles, and system contributions</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[500px_1fr]">
          {/* Left Form */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>{editing ? 'Edit Experience' : 'Add Experience'}</CardTitle>
              <CardDescription>
                {editing ? 'Update experience and system responsibilities' : 'Add a new work experience record'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company / Organization *</Label>
                  <Input
                    id="company"
                    placeholder="e.g. PT. Industri Kereta Api (Persero)"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position / Job Title *</Label>
                  <Input
                    id="position"
                    placeholder="e.g. Junior Software Developer Intern"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="program">Program / Track</Label>
                    <Input
                      id="program"
                      placeholder="e.g. Magang Nasional Batch 2"
                      value={formData.program}
                      onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g. Madiun, Indonesia"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="period">Period / Timeline</Label>
                    <Input
                      id="period"
                      placeholder="e.g. November 2025 - May 2026"
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sort_order">Sort Order</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      placeholder="1"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Overview Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your general responsibilities, cross-functional collaboration, and accomplishments..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                  <Input
                    id="technologies"
                    placeholder="Laravel, REST API, Data Synchronization, MySQL, Agile/Scrum"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  />
                </div>

                {/* Sub-Systems / Projects Sub-Manager */}
                <div className="p-3.5 rounded-xl border bg-muted/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
                        Contributed Digital Systems
                      </span>
                      <p className="text-[11px] text-muted-foreground">Specific systems developed during this role</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddSystem}
                      className="h-7 text-xs font-mono gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add System
                    </Button>
                  </div>

                  {systemsList.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic text-center py-2">
                      No specific sub-systems added yet. Click &quot;Add System&quot; to highlight key internal projects.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {systemsList.map((sys, idx) => (
                        <div key={idx} className="p-3 rounded-lg border bg-card space-y-2 relative">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-mono font-semibold text-muted-foreground">
                              System #{idx + 1}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveSystem(idx)}
                              className="h-6 w-6 text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-[10px] text-muted-foreground">System Title *</Label>
                              <Input
                                placeholder="e.g. Paperless Inspection System"
                                value={sys.title}
                                onChange={(e) => handleUpdateSystem(idx, 'title', e.target.value)}
                                className="h-8 text-xs"
                                required
                              />
                            </div>
                            <div>
                              <Label className="text-[10px] text-muted-foreground">Tagline / Category</Label>
                              <Input
                                placeholder="e.g. QA/QC Workflow Digitalization"
                                value={sys.tagline || ''}
                                onChange={(e) => handleUpdateSystem(idx, 'tagline', e.target.value)}
                                className="h-8 text-xs"
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-[10px] text-muted-foreground">Description</Label>
                            <Textarea
                              placeholder="Describe the system workflow, replacement of manual paper, etc..."
                              value={sys.description}
                              onChange={(e) => handleUpdateSystem(idx, 'description', e.target.value)}
                              rows={2}
                              className="text-xs"
                            />
                          </div>

                          <div>
                            <Label className="text-[10px] text-muted-foreground">Tech Stack</Label>
                            <Input
                              placeholder="e.g. Laravel, REST API, Data Synchronization, MySQL"
                              value={sys.tech || ''}
                              onChange={(e) => handleUpdateSystem(idx, 'tech', e.target.value)}
                              className="h-8 text-xs font-mono"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1">
                    {editing ? 'Update Experience' : 'Create Experience'}
                  </Button>
                  {editing && (
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Right List */}
          <Card>
            <CardHeader>
              <CardTitle>Existing Experience</CardTitle>
              <CardDescription>{experiences.length} experience entries total</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground text-center py-8">Loading...</p>
              ) : experiences.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No experience entries found.</p>
              ) : (
                <div className="space-y-4">
                  {experiences.map((exp) => {
                    let parsedSystems: SystemItem[] = []
                    try {
                      parsedSystems = exp.systems ? JSON.parse(exp.systems) : []
                    } catch {
                      parsedSystems = []
                    }

                    return (
                      <div
                        key={exp.id}
                        className="p-5 rounded-xl border bg-card hover:border-primary/50 transition-colors space-y-4"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold text-lg">{exp.company}</h3>
                              {exp.program && (
                                <span className="font-mono text-xs px-2 py-0.5 rounded border bg-muted/60">
                                  {exp.program}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <span className="font-mono font-medium text-foreground">{exp.position}</span>
                              <span>•</span>
                              <span>{exp.location}</span>
                              <span>•</span>
                              <span className="font-mono">{exp.period}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <Button size="icon" variant="ghost" onClick={() => handleEdit(exp)} title="Edit">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => setDeleteId(exp.id)} title="Delete">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {exp.description}
                        </p>

                        {/* Systems Grid */}
                        {parsedSystems.length > 0 && (
                          <div className="space-y-2 pt-2 border-t">
                            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                              <Layers className="h-3.5 w-3.5" />
                              Systems & Projects ({parsedSystems.length})
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {parsedSystems.map((sys, sIdx) => (
                                <div key={sIdx} className="p-3 rounded-lg border bg-muted/30 space-y-1">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-semibold text-xs text-foreground">{sys.title}</span>
                                    {sys.tagline && (
                                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border bg-background text-muted-foreground">
                                        {sys.tagline}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2">{sys.description}</p>
                                  {sys.tech && (
                                    <p className="text-[10px] font-mono text-muted-foreground pt-0.5">
                                      Stack: {sys.tech}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tech Badges Footer */}
                        {exp.technologies && (
                          <div className="flex flex-wrap gap-1.5 pt-2 border-t">
                            {exp.technologies.split(',').map((tech, tIdx) => (
                              <span
                                key={tIdx}
                                className="font-mono text-[11px] px-2 py-0.5 rounded border bg-secondary"
                              >
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Delete Dialog */}
        <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Experience</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this experience record? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  )
}
