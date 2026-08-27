'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/layout-wrapper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Pencil, Trash2, ExternalLink, Upload } from 'lucide-react'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Project {
  id: number
  title: string
  description: string
  problem?: string
  solution?: string
  impact?: string
  image_url?: string
  year: string
  role: string
  tags: string
  link?: string
  sort_order: number
  is_active: number
}

const emptyForm = {
  title: '',
  description: '',
  problem: '',
  solution: '',
  impact: '',
  year: '',
  role: '',
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const url = editing ? `/api/projects/${editing.id}` : '/api/projects'
      const method = editing ? 'PUT' : 'POST'
      const body = editing
        ? { ...formData, sort_order: editing.sort_order, is_active: editing.is_active }
        : formData

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
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowed.includes(file.type)) {
      toast.error('Format tidak didukung. Gunakan JPG, PNG, WEBP, GIF, atau SVG.');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File terlalu besar. Maksimal 5MB.');
      return;
    }

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await res.json();
      setFormData(prev => ({ ...prev, image_url: data.url }));
      toast.success('Gambar berhasil diupload dan dikonversi');
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengupload gambar');
    } finally {
      setUploading(false);
      // reset input file
      e.target.value = '';
    }
  }

  function handleEdit(p: Project) {
    setEditing(p)
    setFormData({
      title: p.title,
      description: p.description ?? '',
      problem: p.problem ?? '',
      solution: p.solution ?? '',
      impact: p.impact ?? '',
      year: p.year ?? '',
      role: p.role ?? '',
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
          <p className="text-muted-foreground">Manage portfolio projects and deep-dive case studies</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[480px_1fr]">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>{editing ? 'Edit Project' : 'Add Project'}</CardTitle>
              <CardDescription>
                {editing ? 'Update project details and case study metrics' : 'Add a new portfolio project with problem-solution-impact details'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Overview Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                {/* Problem -> Solution -> Impact Deep-dive fields */}
                <div className="p-3.5 rounded-xl border bg-muted/20 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">Case Study Breakdown</span>
                    <span className="text-[11px] text-muted-foreground">(Displayed on Homepage & Projects page)</span>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="problem" className="text-xs font-semibold">1. Operational Problem</Label>
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
                    <Label htmlFor="solution" className="text-xs font-semibold">2. Technical Solution</Label>
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
                    <Label htmlFor="impact" className="text-xs font-semibold">3. Impact & Metrics</Label>
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
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      placeholder="Mobile App Developer (Flutter)"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    />
                  </div>
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
                          {uploading ? 'Uploading & Converting...' : 'Pilih Gambar (Auto WebP)'}
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
                <p className="text-muted-foreground text-center py-8">Loading…</p>
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
                            <p className="line-clamp-2 text-foreground/80">{p.problem || '-'}</p>
                          </div>
                          <div className="p-2 rounded bg-muted/40 border">
                            <span className="font-mono font-semibold block text-[10px] uppercase text-muted-foreground mb-0.5">Solution</span>
                            <p className="line-clamp-2 text-foreground/80">{p.solution || '-'}</p>
                          </div>
                          <div className="p-2 rounded bg-muted/40 border">
                            <span className="font-mono font-semibold block text-[10px] uppercase text-muted-foreground mb-0.5">Impact</span>
                            <p className="line-clamp-2 font-medium text-foreground/90">{p.impact || '-'}</p>
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
                          <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
                            📷 Image attached
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
