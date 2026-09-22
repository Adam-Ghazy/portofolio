'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/layout-wrapper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Pencil, Trash2, ExternalLink, Upload, ArrowUp, ArrowDown, Images, Film } from 'lucide-react'
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
import { LangTabs, AutoTranslateButton } from '@/components/admin/lang-tabs'
import { Badge } from '@/components/ui/badge'
import { MIN_PROJECT_MEDIA, countProjectMedia } from '@/lib/project-media-rules'

interface MediaItem {
  media_type: string
  url: string
  caption: string
  caption_id: string
}

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
  contributions?: string
  contributions_id?: string
  year: string
  role: string
  role_id?: string
  tags: string
  link?: string
  sort_order: number
  is_active: number
  media?: MediaItem[]
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
  contributions: '',
  contributions_id: '',
  year: '',
  role: '',
  role_id: '',
  tags: '',
  link: '',
  media: [] as MediaItem[],
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Project | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [uploadingMedia, setUploadingMedia] = useState(false)
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

      const [enTitle, enDesc, enProblem, enSolution, enImpact, enContrib, enRole] = await Promise.all([
        formData.title_id ? translateField(formData.title_id) : Promise.resolve(formData.title),
        formData.description_id ? translateField(formData.description_id) : Promise.resolve(formData.description),
        formData.problem_id ? translateField(formData.problem_id) : Promise.resolve(formData.problem),
        formData.solution_id ? translateField(formData.solution_id) : Promise.resolve(formData.solution),
        formData.impact_id ? translateField(formData.impact_id) : Promise.resolve(formData.impact),
        formData.contributions_id ? translateField(formData.contributions_id) : Promise.resolve(formData.contributions),
        formData.role_id ? translateField(formData.role_id) : Promise.resolve(formData.role),
      ])

      setFormData((prev) => ({
        ...prev,
        title: enTitle || prev.title,
        description: enDesc || prev.description,
        problem: enProblem || prev.problem,
        solution: enSolution || prev.solution,
        impact: enImpact || prev.impact,
        contributions: enContrib || prev.contributions,
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

    const count = countProjectMedia(formData.media)
    if (count < MIN_PROJECT_MEDIA) {
      toast.error(`Minimal ${MIN_PROJECT_MEDIA} media bukti (gambar/video). Saat ini ${count}.`)
      return
    }

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
        contributions: formData.contributions || formData.contributions_id,
        contributions_id: formData.contributions_id || formData.contributions,
        role: formData.role || formData.role_id,
        role_id: formData.role_id || formData.role,
        media: formData.media.map((m, i) => ({ ...m, sort_order: i })),
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

  async function handleMediaUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const isVideo = file.type.startsWith('video/')
    const allowedImages = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']

    if (!isVideo && !allowedImages.includes(file.type)) {
      toast.error('Format tidak didukung. Gunakan JPG, PNG, WEBP, GIF, SVG, MP4, WEBM, atau MOV.')
      return
    }

    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error(isVideo ? 'Video terlalu besar. Maksimal 50MB.' : 'Gambar terlalu besar. Maksimal 5MB.')
      return
    }

    setUploadingMedia(true)
    try {
      const fd = new FormData()
      fd.append('file', file)

      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Upload failed')
      }
      const data = await res.json()
      setFormData((prev) => ({
        ...prev,
        media: [...prev.media, { media_type: data.media_type || 'image', url: data.url, caption: '', caption_id: '' }],
      }))
      toast.success(isVideo ? 'Video berhasil diupload' : 'Gambar berhasil diupload & dikonversi ke WebP')
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengupload media')
    } finally {
      setUploadingMedia(false)
      e.target.value = ''
    }
  }

  function updateMedia(idx: number, patch: Partial<MediaItem>) {
    setFormData((prev) => ({
      ...prev,
      media: prev.media.map((m, i) => (i === idx ? { ...m, ...patch } : m)),
    }))
  }

  function moveMedia(idx: number, dir: -1 | 1) {
    setFormData((prev) => {
      const next = [...prev.media]
      const target = idx + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[idx], next[target]] = [next[target], next[idx]]
      return { ...prev, media: next }
    })
  }

  function removeMedia(idx: number) {
    setFormData((prev) => ({ ...prev, media: prev.media.filter((_, i) => i !== idx) }))
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
      contributions: p.contributions ?? '',
      contributions_id: p.contributions_id ?? '',
      year: p.year ?? '',
      role: p.role ?? '',
      role_id: p.role_id ?? '',
      tags: p.tags ?? '',
      link: p.link ?? '',
      media: (p.media || []).map((m) => ({
        media_type: m.media_type || 'image',
        url: m.url,
        caption: m.caption ?? '',
        caption_id: m.caption_id ?? '',
      })),
    })
  }

  function handleCancel() {
    setEditing(null)
    setFormData(emptyForm)
  }

  const mediaCount = countProjectMedia(formData.media)
  const mediaError =
    mediaCount < MIN_PROJECT_MEDIA
      ? `Minimal ${MIN_PROJECT_MEDIA} media bukti (gambar/video). Saat ini ${mediaCount}.`
      : null

  return (
    <AdminLayout>
      <div className="mx-auto max-w-[1400px] space-y-6">
        <p className="text-body-md text-muted-foreground">{projects.length} records</p>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,500px)_minmax(0,1fr)]">
          <Card className="h-fit">
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>{editing ? 'Edit Project' : 'Add Project'}</CardTitle>
                  <CardDescription>
                    {editing ? 'Update project details and case study metrics' : 'Add a new portfolio project with bilingual details'}
                  </CardDescription>
                </div>
                <LangTabs
                  value={activeLangTab}
                  onChange={setActiveLangTab}
                  idLabel="Indonesian (ID)"
                  enLabel="English (EN)"
                />
              </div>
              <AutoTranslateButton
                onClick={handleAutoTranslateToEn}
                busy={isTranslating}
                disabled={isTranslating || (!formData.title_id && !formData.description_id)}
              />
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
                    <div className="space-y-3 rounded-[12px] border border-border bg-sidebar p-4">
                      <span className="text-label-section text-muted-foreground">Studi Kasus (ID)</span>

                      <div className="space-y-1.5">
                        <Label htmlFor="problem_id">1. Masalah Operasional (ID)</Label>
                        <Textarea
                          id="problem_id"
                          placeholder="contoh: Kantin kampus mengalami penumpukan antrean parah..."
                          value={formData.problem_id}
                          onChange={(e) => setFormData({ ...formData, problem_id: e.target.value })}
                          rows={2}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="solution_id">2. Solusi Rekayasa (ID)</Label>
                        <Textarea
                          id="solution_id"
                          placeholder="contoh: Merancang dan merilis FoodLAB dengan Flutter & notifikasi push..."
                          value={formData.solution_id}
                          onChange={(e) => setFormData({ ...formData, solution_id: e.target.value })}
                          rows={2}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="impact_id">3. Dampak Terukur (ID)</Label>
                        <Textarea
                          id="impact_id"
                          placeholder="contoh: Meraih pendanaan Rp20 Juta · 300+ pengguna aktif · Pangkas waktu tunggu 60%..."
                          value={formData.impact_id}
                          onChange={(e) => setFormData({ ...formData, impact_id: e.target.value })}
                          rows={2}
                        />
                      </div>
                    </div>

                    {/* Contributions ID */}
                    <div className="space-y-1.5 rounded-[12px] border border-border bg-sidebar p-4">
                      <Label htmlFor="contributions_id">Kontribusi Saya (ID)</Label>
                      <Textarea
                        id="contributions_id"
                        placeholder={'Satu kontribusi per baris, contoh:\nMerancang arsitektur aplikasi Flutter dengan Provider.\nMembangun integrasi REST API untuk alur pemesanan.'}
                        value={formData.contributions_id}
                        onChange={(e) => setFormData({ ...formData, contributions_id: e.target.value })}
                        rows={4}
                      />
                      <p className="text-label-md text-muted-foreground">Tampilkan apa saja yang Anda kerjakan di proyek ini — satu poin per baris.</p>
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
                    <div className="space-y-3 rounded-[12px] border border-border bg-sidebar p-4">
                      <span className="text-label-section text-muted-foreground">Case Study Breakdown (EN)</span>

                      <div className="space-y-1.5">
                        <Label htmlFor="problem">1. Operational Problem (EN)</Label>
                        <Textarea
                          id="problem"
                          placeholder="e.g. The campus canteen experienced severe overcrowding with 200+ students queuing daily..."
                          value={formData.problem}
                          onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                          rows={2}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="solution">2. Technical Solution (EN)</Label>
                        <Textarea
                          id="solution"
                          placeholder="e.g. Engineered and launched FoodLAB mobile ordering platform with real-time push notifications..."
                          value={formData.solution}
                          onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                          rows={2}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="impact">3. Impact & Metrics (EN)</Label>
                        <Textarea
                          id="impact"
                          placeholder="e.g. Secured IDR 20M funding · 300+ users · 60% wait reduction · Published on Google Play Store..."
                          value={formData.impact}
                          onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                          rows={2}
                        />
                      </div>
                    </div>

                    {/* Contributions EN */}
                    <div className="space-y-1.5 rounded-[12px] border border-border bg-sidebar p-4">
                      <Label htmlFor="contributions">My Contributions (EN)</Label>
                      <Textarea
                        id="contributions"
                        placeholder={'One contribution per line, e.g.:\nEngineered the Flutter app architecture with Provider.\nBuilt the REST API integration for ordering flows.'}
                        value={formData.contributions}
                        onChange={(e) => setFormData({ ...formData, contributions: e.target.value })}
                        rows={4}
                      />
                      <p className="text-label-md text-muted-foreground">Explain what you personally worked on in this project — one point per line.</p>
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

                {/* Evidence Media Gallery Manager */}
                <div className="space-y-3 rounded-[12px] border border-border bg-sidebar p-4">
                  <div className="flex items-center justify-between gap-3">
                    <Label className="flex items-center gap-1.5">
                      <Images className="h-4 w-4" strokeWidth={1.5} />
                      Media Bukti (Gambar / Video)
                    </Label>
                    <span className="text-label-md text-muted-foreground">
                      {mediaCount} / {MIN_PROJECT_MEDIA} media
                    </span>
                  </div>
                  <label className="block cursor-pointer">
                    <Button type="button" variant="outline" className="pointer-events-none w-full" disabled={uploadingMedia} asChild>
                      <span>
                        <Upload className="mr-2 h-4 w-4" strokeWidth={1.5} />
                        {uploadingMedia ? 'Uploading...' : 'Upload Gambar / Video Bukti'}
                      </span>
                    </Button>
                    <input type="file" onChange={handleMediaUpload} className="hidden" accept=".jpg,.jpeg,.png,.webp,.gif,.svg,.mp4,.webm,.mov,.mkv,image/*,video/mp4,video/webm,video/quicktime" disabled={uploadingMedia} />
                  </label>
                  <p className="text-body-sm text-muted-foreground">
                    Gambar → WebP (maks 5MB). Video maks 50MB.
                  </p>

                  {mediaError && (
                    <p className="text-body-sm text-destructive">
                      {mediaError} Tambahkan media lewat tombol di atas.
                    </p>
                  )}

                  {formData.media.map((m, idx) => (
                    <div key={idx} className="space-y-2 rounded-[12px] border border-border bg-surface p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-12 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-border bg-muted">
                          {m.media_type === 'video' ? (
                            <video src={`${m.url}#t=0.001`} preload="metadata" muted playsInline className="h-full w-full object-cover" />
                          ) : (
                            <img src={m.url} alt={`media ${idx + 1}`} className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <Badge variant="secondary">
                            {m.media_type === 'video' ? <Film className="h-3 w-3" strokeWidth={1.5} /> : null}
                            {m.media_type === 'video' ? 'VIDEO' : 'IMAGE'}-{String(idx + 1).padStart(2, '0')}
                          </Badge>
                          <span className="mt-0.5 block truncate text-label-md text-muted-foreground">{m.url}</span>
                        </div>
                        <div className="flex shrink-0 items-center gap-0.5">
                          <Button type="button" size="icon" variant="ghost" className="h-7 w-7 rounded-[8px]" onClick={() => moveMedia(idx, -1)} disabled={idx === 0} title="Naikkan urutan" aria-label="Naikkan urutan">
                            <ArrowUp className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </Button>
                          <Button type="button" size="icon" variant="ghost" className="h-7 w-7 rounded-[8px]" onClick={() => moveMedia(idx, 1)} disabled={idx === formData.media.length - 1} title="Turunkan urutan" aria-label="Turunkan urutan">
                            <ArrowDown className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </Button>
                          <Button type="button" size="icon" variant="ghost" className="h-7 w-7 rounded-[8px] text-destructive hover:text-destructive" onClick={() => removeMedia(idx)} title="Hapus media" aria-label="Hapus media">
                            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <Input placeholder="Caption (ID) — opsional" value={m.caption_id} onChange={(e) => updateMedia(idx, { caption_id: e.target.value })} />
                        <Input placeholder="Caption (EN) — optional" value={m.caption} onChange={(e) => updateMedia(idx, { caption: e.target.value })} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1" disabled={!!mediaError}>{editing ? 'Update Project' : 'Add Project'}</Button>
                  {editing && <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>}
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
                <p className="py-12 text-center text-body-md text-muted-foreground">Loading...</p>
              ) : projects.length === 0 ? (
                <p className="py-12 text-center text-body-md text-muted-foreground">No projects yet</p>
              ) : (
                <ul className="divide-y divide-border">
                  {projects.map((p) => (
                    <li key={p.id} className="space-y-3 py-4 transition-colors hover:bg-sidebar">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-headline-sm text-foreground">{p.title}</h3>
                            {p.title_id && p.title_id !== p.title && <span className="text-label-md text-muted-foreground">({p.title_id})</span>}
                            {p.year && <Badge variant="secondary">{p.year}</Badge>}
                          </div>
                          <p className="text-label-md text-muted-foreground">{p.role || 'Developer'}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          {p.link && (
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-[8px]" asChild title="Open Link">
                              <a href={p.link} target="_blank" rel="noopener noreferrer" aria-label="Open project link">
                                <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
                              </a>
                            </Button>
                          )}
                          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-[8px]" onClick={() => handleEdit(p)} title="Edit" aria-label="Edit project">
                            <Pencil className="h-4 w-4" strokeWidth={1.5} />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-[8px]" onClick={() => setDeleteId(p.id)} title="Delete" aria-label="Delete project">
                            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                          </Button>
                        </div>
                      </div>
                      <p className="text-body-md text-muted-foreground line-clamp-2">{p.description}</p>
                      {(p.problem || p.solution || p.impact) && (
                        <div className="grid grid-cols-1 gap-2 border-t border-border pt-2 md:grid-cols-3">
                          <div className="rounded-[12px] border border-border bg-sidebar p-3">
                            <span className="mb-1 block text-label-section uppercase text-muted-foreground">Problem</span>
                            <p className="text-body-sm text-foreground line-clamp-2">{p.problem || p.problem_id || '-'}</p>
                          </div>
                          <div className="rounded-[12px] border border-border bg-sidebar p-3">
                            <span className="mb-1 block text-label-section uppercase text-muted-foreground">Solution</span>
                            <p className="text-body-sm text-foreground line-clamp-2">{p.solution || p.solution_id || '-'}</p>
                          </div>
                          <div className="rounded-[12px] border border-border bg-sidebar p-3">
                            <span className="mb-1 block text-label-section uppercase text-muted-foreground">Impact</span>
                            <p className="text-body-sm text-foreground line-clamp-2">{p.impact || p.impact_id || '-'}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                        <div className="flex flex-wrap gap-1">
                          {p.tags?.split(',').map((tag, i) => <Badge key={i} variant="secondary">{tag.trim()}</Badge>)}
                        </div>
                        {p.media && p.media.length > 0 && (
                          <span className="text-label-md text-muted-foreground">
                            {p.media.length} media bukti
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
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
              <AlertDialogAction variant="destructive" onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  )
}
