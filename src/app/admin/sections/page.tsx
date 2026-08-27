'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/layout-wrapper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Pencil, Trash2, Upload, Image as ImageIcon, Sparkles } from 'lucide-react'
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

interface Section {
  id: number
  slug: string
  title: string
  subtitle?: string
  content?: string
  image_url?: string
  sort_order: number
}

const emptyForm = {
  slug: '',
  title: '',
  subtitle: '',
  content: '',
  image_url: '',
}

const SECTION_GUIDES: Record<string, { label: string; desc: string; imageHint?: string }> = {
  hero: {
    label: 'Hero Section (Header)',
    desc: 'Main landing area at the top of the homepage. Set your headline, bio, and hero photo.',
    imageHint: 'Profile photo displayed prominently on the right side of the hero section.',
  },
  problem: {
    label: 'Problem Section',
    desc: 'Highlights the real challenges and pain points you solve.',
  },
  about: {
    label: 'About Section',
    desc: 'Overview story and stats introducing who you are and what you do.',
  },
  work: {
    label: 'Projects Section',
    desc: 'Header and subtitle for your web & mobile projects showcase.',
  },
  projects: {
    label: 'Projects Section',
    desc: 'Header and subtitle for your web & mobile projects showcase.',
  },
  skills: {
    label: 'Skills Section',
    desc: 'Header and subtitle for your technical stack & skills grid.',
  },
  contact: {
    label: 'Contact CTA Section',
    desc: 'Final call-to-action area with availability info.',
  },
}

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Section | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState(emptyForm)

  useEffect(() => {
    fetchSections()
  }, [])

  async function fetchSections() {
    try {
      const res = await fetch('/api/sections')
      if (!res.ok) throw new Error()
      setSections(await res.json())
    } catch {
      toast.error('Failed to load sections')
    } finally {
      setLoading(false)
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const data = new FormData()
    data.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Upload failed')
      }

      const json = await res.json()
      setFormData((prev) => ({ ...prev, image_url: json.url }))
      toast.success('Image uploaded successfully')
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const url = editing ? `/api/sections/${editing.id}` : '/api/sections'
      const method = editing ? 'PUT' : 'POST'
      const body = editing
        ? { ...formData, sort_order: editing.sort_order, is_active: 1 }
        : formData

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error()
      toast.success(editing ? 'Section updated' : 'Section created')
      setFormData(emptyForm)
      setEditing(null)
      fetchSections()
    } catch {
      toast.error('Failed to save section')
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/sections/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Section deleted')
      fetchSections()
    } catch {
      toast.error('Failed to delete section')
    } finally {
      setDeleteId(null)
    }
  }

  function handleEdit(section: Section) {
    setEditing(section)
    setFormData({
      slug: section.slug,
      title: section.title,
      subtitle: section.subtitle ?? '',
      content: section.content ?? '',
      image_url: section.image_url ?? '',
    })
  }

  function handleCancel() {
    setEditing(null)
    setFormData(emptyForm)
  }

  const activeGuide = formData.slug ? SECTION_GUIDES[formData.slug] : null

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Sections</h1>
          <p className="text-muted-foreground">Manage and customize your portfolio landing page sections</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Form Column */}
          <div className="lg:col-span-5">
            <Card>
              <CardHeader>
                <CardTitle>{editing ? `Edit: ${formData.slug || 'Section'}` : 'Add Section'}</CardTitle>
                <CardDescription>
                  {activeGuide ? activeGuide.desc : 'Configure section content, titles, and media'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Slug field & presets */}
                  <div className="space-y-2">
                    <Label htmlFor="slug">Section Identifier (Slug) *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().trim() })}
                      placeholder="hero, problem, about, contact..."
                      required
                      disabled={!!editing}
                    />
                    {!editing && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {['hero', 'problem', 'about', 'work', 'skills', 'contact'].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setFormData({ ...formData, slug: s })}
                            className="text-[11px] font-mono px-2 py-0.5 rounded border hover:bg-accent hover:text-accent-foreground transition-colors"
                          >
                            +{s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Title field */}
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      {formData.slug === 'hero' ? 'Headline / Main Title *' : 'Section Title *'}
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Hi, I'm Adam."
                      required
                    />
                  </div>

                  {/* Subtitle field */}
                  <div className="space-y-2">
                    <Label htmlFor="subtitle">
                      {formData.slug === 'hero' ? 'Bio / Subtitle Description' : 'Subtitle / Tagline'}
                    </Label>
                    <Textarea
                      id="subtitle"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="Short descriptive text..."
                      rows={3}
                    />
                  </div>

                  {/* Image / Photo Upload (especially for Hero) */}
                  <div className="space-y-2">
                    <Label htmlFor="image_url">
                      {formData.slug === 'hero' ? 'Hero Profile Photo' : 'Section Image / Media'}
                    </Label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <label className="flex-1">
                          <Button variant="outline" className="w-full" disabled={uploading} asChild>
                            <span className="cursor-pointer">
                              <Upload className="h-4 w-4 mr-2" />
                              {uploading ? 'Uploading...' : 'Choose photo to upload'}
                            </span>
                          </Button>
                          <input type="file" onChange={handleFileUpload} className="hidden" accept="image/*" />
                        </label>
                        {formData.image_url && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setFormData({ ...formData, image_url: '' })}
                          >
                            Remove
                          </Button>
                        )}
                      </div>

                      {/* Image Preview Box */}
                      {formData.image_url ? (
                        <div className="relative rounded-xl overflow-hidden border bg-muted/20 p-2 flex items-center gap-3">
                          <img
                            src={formData.image_url}
                            alt="preview"
                            className="w-16 h-16 rounded-lg object-cover border"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-mono truncate text-muted-foreground">{formData.image_url}</p>
                            <p className="text-[11px] text-green-600 dark:text-green-400 mt-0.5">✓ Ready & active</p>
                          </div>
                        </div>
                      ) : (
                        formData.slug === 'hero' && (
                          <p className="text-xs text-muted-foreground">
                            💡 Upload your portrait photo here to display it on the right side of the Hero section.
                          </p>
                        )
                      )}
                    </div>
                  </div>

                  {/* Content field */}
                  <div className="space-y-2">
                    <Label htmlFor="content">
                      {formData.slug === 'contact' ? 'Availability Tag / Note' : 'Extra Content / Data'}
                    </Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder={formData.slug === 'contact' ? 'e.g. Open to junior developer roles & projects' : 'Optional content...'}
                      rows={formData.slug === 'problem' ? 5 : 2}
                      className={formData.slug === 'problem' ? 'font-mono text-xs' : ''}
                    />
                    {formData.slug === 'problem' && (
                      <p className="text-[11px] text-muted-foreground font-mono">
                        Format: JSON array of cards [{`{"title":"...","desc":"..."}`}]
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button type="submit" className="flex-1">
                      {editing ? 'Update Section' : 'Add Section'}
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
          </div>

          {/* Table Column */}
          <div className="lg:col-span-7">
            <Card>
              <CardHeader>
                <CardTitle>Configured Sections</CardTitle>
                <CardDescription>{sections.length} active sections on your homepage</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground text-center py-8">Loading…</p>
                ) : sections.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No sections found</p>
                ) : (
                  <div className="space-y-3">
                    {sections.map((section) => (
                      <div
                        key={section.id}
                        className="rounded-xl border p-4 flex items-start gap-4 hover:border-primary/50 transition-colors bg-card"
                      >
                        {/* Section Thumbnail / Icon */}
                        <div className="w-14 h-14 rounded-lg border bg-muted/30 flex items-center justify-center shrink-0 overflow-hidden">
                          {section.image_url ? (
                            <img src={section.image_url} alt={section.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-mono text-xs font-semibold text-muted-foreground uppercase">
                              {section.slug.slice(0, 3)}
                            </span>
                          )}
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded uppercase font-semibold bg-accent text-accent-foreground">
                              {section.slug}
                            </span>
                            {section.image_url && (
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                                <ImageIcon className="w-3 h-3" /> photo
                              </span>
                            )}
                          </div>
                          <h4 className="font-semibold text-sm truncate">{section.title}</h4>
                          {section.subtitle && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                              {section.subtitle}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1 shrink-0">
                          <Button size="icon" variant="ghost" onClick={() => handleEdit(section)} title="Edit Section">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => setDeleteId(section.id)} title="Delete Section">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Section</AlertDialogTitle>
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
