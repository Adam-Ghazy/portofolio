'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/layout-wrapper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Pencil, Trash2, ExternalLink, Upload, Sparkles } from 'lucide-react'
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

interface Project {
  id: number
  title: string
  title_id?: string
  description: string
  description_id?: string
  problem?: string
  problem_id?: string
  solution?: string
  solution_id?: string
  impact?: string
  impact_id?: string
  image_url?: string
  year: string
  role: string
  role_id?: string
  tags: string
  link?: string
  sort_order: number
  is_active: number
}

const emptyForm = {
  title: '',
  title_id: '',
  description: '',
  description_id: '',
  problem: '',
  problem_id: '',
  solution: '',
  solution_id: '',
  impact: '',
  impact_id: '',
  year: '',
  role: '',
  role_id: '',
  tags: '',
  link: '',
  image_url: '',
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Project | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [uploading, setUploading] = useState(false)
  const [activeLangTab, setActiveLangTab] = useState<'id' | 'en'>('id')
  const [isTranslating, setIsTranslating] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    try {
      const res = await fetch('/api/projects')
      if (!res.ok) throw new Error()
      setProjects(await res.json())
    } catch {
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  async function handleAutoTranslateToEn() {
    setIsTranslating(true)
    try {
      const translateField = async (text?: string) => {
        if (!text || text.trim() === '') return ''
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, from: 'id', to: 'en' }),
        })
        if (!res.ok) return text
        const data = await res.json()
        return data.translatedText || text
      }

      const [enTitle, enDesc, enProblem, enSolution, enImpact, enRole] = await Promise.all([
        formData.title_id ? translateField(formData.title_id) : Promise.resolve(formData.title),
        formData.description_id ? translateField(formData.description_id) : Promise.resolve(formData.description),
        formData.problem_id ? translateField(formData.problem_id) : Promise.resolve(formData.problem),
        formData.solution_id ? translateField(formData.solution_id) : Promise.resolve(formData.solution),
        formData.impact_id ? translateField(formData.impact_id) : Promise.resolve(formData.impact),
        formData.role_id ? translateField(formData.role_id) : Promise.resolve(formData.role),
      ])

      setFormData((prev) => ({
        ...prev,
        title: enTitle || prev.title,
        description: enDesc || prev.description,
        problem: enProblem || prev.problem,
        solution: enSolution || prev.solution,
        impact: enImpact || prev.impact,
        role: enRole || prev.role,
      }))
      toast.success('Successfully translated Indonesian to English')
    } catch {
      toast.error('Failed to auto-translate')
    } finally {
      setIsTranslating(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const url = editing ? `/api/projects/${editing.id}` : '/api/projects'
      const method = editing ? 'PUT' : 'POST'
      const body = {
        ...formData,
        title: formData.title || formData.title_id,
        title_id: formData.title_id || formData.title,
        description: formData.description || formData.description_id,
        description_id: formData.description_id || formData.description,
        problem: formData.problem || formData.problem_id,
        problem_id: formData.problem_id || formData.problem,
        solution: formData.solution || formData.solution_id,
        solution_id: formData.solution_id || formData.solution,
        impact: formData.impact || formData.impact_id,
        impact_id: formData.impact_id || formData.impact,
        role: formData.role || formData.role_id,
        role_id: formData.role_id || formData.role,
        ...(editing ? { sort_order: editing.sort_order, is_active: editing.is_active } : { sort_order: 0, is_active: 1 }),
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error()
      toast.success(editing ? 'Project updated' : 'Project created')
      setFormData(emptyForm)
      setEditing(null)
      fetchProjects()
    } catch {
      toast.error('Failed to save project')
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/projects/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Project deleted')
      fetchProjects()
    } catch {
      toast.error('Failed to delete project')
    } finally {
      setDeleteId(null)
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      toast.error('Format tidak didukung. Gunakan JPG, PNG, WEBP, GIF, atau SVG.')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File terlalu besar. Maksimal 5MB.')
      return
    }

    setUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await res.json()
      setFormData(prev => ({ ...prev, image_url: data.url }))
      toast.success('Gambar berhasil diupload')
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengupload gambar')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  function handleEdit(p: Project) {
    setEditing(p)
    setFormData({
      title: p.title ?? '',
      title_id: p.title_id ?? '',
      description: p.description ?? '',
      description_id: p.description_id ?? '',
      problem: p.problem ?? '',
      problem_id: p.problem_id ?? '',
      solution: p.solution ?? '',
      solution_id: p.solution_id ?? '',
      impact: p.impact ?? '',
      impact_id: p.impact_id ?? '',
      year: p.year ?? '',
      role: p.role ?? '',
      role_id: p.role_id ?? '',
      tags: p.tags ?? '',
      link: p.link ?? '',
      image_url: p.image_url ?? '',
    })
  }

  function handleCancel() {
    setEditing(null)
    setFormData(emptyForm)
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage portfolio projects and deep-dive case studies with bilingual support</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[500px_1fr]">
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{editing ? 'Edit Project' : 'Add Project'}</CardTitle>
                  <CardDescription>
                    {editing ? 'Update project details and case study metrics' : 'Add a new portfolio project with bilingual details'}
                  </CardDescription>
                </div>

                {/* Language Switch Tabs for Form */}
                <div className="flex items-center rounded-lg border p-0.5 bg-muted/40 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveLangTab('id')}
                    className={`px-2.5 py-1 rounded transition-all ${
                      activeLangTab === 'id' ? 'bg-primary text-primary-foreground font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Indonesian (ID)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveLangTab('en')}
                    className={`px-2.5 py-1 rounded transition-all ${
                      activeLangTab === 'en' ? 'bg-primary text-primary-foreground font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    English (EN)
                  </button>
                </div>
              </div>

              {/* Auto-Translate Button */}
              <div className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAutoTranslateToEn}
                  disabled={isTranslating || (!formData.title_id && !formData.description_id)}
                  className="w-full text-xs font-mono gap-1.5 h-8"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {isTranslating ? 'Translating ID to EN...' : 'Auto-Translate ID to EN'}
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {activeLangTab === 'id' ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="title_id">Judul Proyek (ID) *</Label>
                      <Input
                        id="title_id"
                        placeholder="contoh: FoodLAB - Platform Pemesanan Makanan Kampus"
                        value={formData.title_id}
                        onChange={(e) => setFormData({ ...formData, title_id: e.target.value })}
                        required={!formData.title}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role_id">Peran / Role (ID)</Label>
                      <Input
                        id="role_id"
                        placeholder="contoh: Pengembang Aplikasi Mobile (Flutter)"
                        value={formData.role_id}
                        onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description_id">Deskripsi Ringkas (ID) *</Label>
                      <Textarea
                        id="description_id"
                        placeholder="Deskripsi ikhtisar proyek..."
                        value={formData.description_id}
                        onChange={(e) => setFormData({ ...formData, description_id: e.target.value })}
                        rows={3}
                        required={!formData.description}
                      />
                    </div>

                    {/* Case Study Fields ID */}
                    <div className="p-3.5 rounded-xl border bg-muted/20 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">Studi Kasus (ID)</span>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="problem_id" className="text-xs font-semibold">1. Masalah Operasional (ID)</Label>
                        <Textarea
                          id="problem_id"
                          placeholder="contoh: Kantin kampus mengalami penumpukan antrean parah..."
                          value={formData.problem_id}
                          onChange={(e) => setFormData({ ...formData, problem_id: e.target.value })}
                          rows={2}
                          className="text-xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="solution_id" className="text-xs font-semibold">2. Solusi Rekayasa (ID)</Label>
                        <Textarea
                          id="solution_id"
                          placeholder="contoh: Merancang dan merilis FoodLAB dengan Flutter & notifikasi push..."
                          value={formData.solution_id}
                          onChange={(e) => setFormData({ ...formData, solution_id: e.target.value })}
                          rows={2}
                          className="text-xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="impact_id" className="text-xs font-semibold">3. Dampak Terukur (ID)</Label>
                        <Textarea
                          id="impact_id"
                          placeholder="contoh: Meraih pendanaan Rp20 Juta · 300+ pengguna aktif · Pangkas waktu tunggu 60%..."
                          value={formData.impact_id}
                          onChange={(e) => setFormData({ ...formData, impact_id: e.target.value })}
                          rows={2}
                          className="text-xs"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="title">Title (EN) *</Label>
                      <Input
                        id="title"
                        placeholder="e.g. FoodLAB - Campus Food Ordering Platform"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required={!formData.title_id}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role (EN)</Label>
                      <Input
                        id="role"
                        placeholder="e.g. Mobile App Developer (Flutter)"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Overview Description (EN) *</Label>
                      <Textarea
                        id="description"
                        placeholder="Overview description of the project..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        required={!formData.description_id}
                      />
                    </div>

                    {/* Case Study Fields EN */}
                    <div className="p-3.5 rounded-xl border bg-muted/20 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">Case Study Breakdown (EN)</span>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="problem" className="text-xs font-semibold">1. Operational Problem (EN)</Label>
                        <Textarea
                          id="problem"
                          placeholder="e.g. The campus canteen experienced severe overcrowding with 200+ students queuing daily..."
                          value={formData.problem}
                          onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                          rows={2}
                          className="text-xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="solution" className="text-xs font-semibold">2. Technical Solution (EN)</Label>
                        <Textarea
                          id="solution"
                          placeholder="e.g. Engineered and launched FoodLAB mobile ordering platform with real-time push notifications..."
                          value={formData.solution}
                          onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                          rows={2}
                          className="text-xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="impact" className="text-xs font-semibold">3. Impact & Metrics (EN)</Label>
                        <Textarea
                          id="impact"
                          placeholder="e.g. Secured IDR 20M funding · 300+ users · 60% wait reduction · Published on Google Play Store..."
                          value={formData.impact}
                          onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                          rows={2}
                          className="text-xs"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      placeholder="2024 - 2025"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      placeholder="Flutter, Dart, Provider, REST API"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link">Project URL</Label>
                  <Input
                    id="link"
                    type="url"
                    placeholder="https://play.google.com/..."
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Image</Label>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 cursor-pointer">
                      <Button type="button" variant="outline" className="w-full pointer-events-none" disabled={uploading} asChild>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          {uploading ? 'Uploading...' : 'Pilih Gambar'}
                        </span>
                      </Button>
                      <input 
                        type="file" 
                        onChange={handleFileUpload} 
                        className="hidden" 
                        accept=".jpg,.jpeg,.png,.webp,.gif,.svg"
                        disabled={uploading}
                      />
                    </label>
                    {formData.image_url && (
                      <div className="relative group w-16 h-16 shrink-0">
                        <img
                          src={formData.image_url}
                          className="w-16 h-16 rounded-lg object-cover border"
                          alt="preview"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image_url: '' })}
                          className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg text-xs"
                        >
                          Hapus
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editing ? 'Update Project' : 'Create Project'}
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

          <Card>
            <CardHeader>
              <CardTitle>Existing Projects</CardTitle>
              <CardDescription>{projects.length} projects total</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground text-center py-8">Loading...</p>
              ) : projects.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No projects yet</p>
              ) : (
                <div className="space-y-4">
                  {projects.map((p) => (
                    <div key={p.id} className="p-4 rounded-xl border bg-card hover:border-primary/50 transition-colors space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-base">{p.title}</h3>
                            {p.title_id && p.title_id !== p.title && (
                              <span className="text-xs text-muted-foreground">({p.title_id})</span>
                            )}
                            {p.year && (
                              <span className="font-mono text-xs px-2 py-0.5 rounded border bg-muted/50">
                                {p.year}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground font-mono">{p.role || 'Developer'}</p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {p.link && (
                            <Button size="icon" variant="ghost" asChild title="Open Link">
                              <a href={p.link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          <Button size="icon" variant="ghost" onClick={() => handleEdit(p)} title="Edit">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => setDeleteId(p.id)} title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {p.description}
                      </p>

                      {/* Problem, Solution, Impact Badges / Preview */}
                      {(p.problem || p.solution || p.impact) && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 border-t text-xs">
                          <div className="p-2 rounded bg-muted/40 border">
                            <span className="font-mono font-semibold block text-[10px] uppercase text-muted-foreground mb-0.5">Problem</span>
                            <p className="line-clamp-2 text-foreground/80">{p.problem || p.problem_id || '-'}</p>
                          </div>
                          <div className="p-2 rounded bg-muted/40 border">
                            <span className="font-mono font-semibold block text-[10px] uppercase text-muted-foreground mb-0.5">Solution</span>
                            <p className="line-clamp-2 text-foreground/80">{p.solution || p.solution_id || '-'}</p>
                          </div>
                          <div className="p-2 rounded bg-muted/40 border">
                            <span className="font-mono font-semibold block text-[10px] uppercase text-muted-foreground mb-0.5">Impact</span>
                            <p className="line-clamp-2 font-medium text-foreground/90">{p.impact || p.impact_id || '-'}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                        <div className="flex flex-wrap gap-1">
                          {p.tags?.split(',').map((tag, i) => (
                            <span key={i} className="text-[11px] font-mono bg-secondary px-2 py-0.5 rounded border">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                        {p.image_url && (
                          <span className="text-[11px] text-muted-foreground font-mono">
                            Image attached
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Project</AlertDialogTitle>
              <AlertDialogDescription>Are you sure? This action cannot be undone.</AlertDialogDescription>
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
