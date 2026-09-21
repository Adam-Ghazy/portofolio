'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/layout-wrapper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Pencil, Trash2, Upload, Image as ImageIcon } from 'lucide-react'
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

interface Section {
  id: number
  slug: string
  title: string
  title_id?: string
  subtitle?: string
  subtitle_id?: string
  content?: string
  content_id?: string
  image_url?: string
  sort_order: number
}

const emptyForm = {
  slug: '',
  title: '',
  title_id: '',
  subtitle: '',
  subtitle_id: '',
  content: '',
  content_id: '',
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
  const [activeLangTab, setActiveLangTab] = useState<'id' | 'en'>('id')
  const [isTranslating, setIsTranslating] = useState(false)

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

      const [enTitle, enSub, enContent] = await Promise.all([
        formData.title_id ? translateField(formData.title_id) : Promise.resolve(formData.title),
        formData.subtitle_id ? translateField(formData.subtitle_id) : Promise.resolve(formData.subtitle),
        formData.content_id && formData.slug !== 'problem' ? translateField(formData.content_id) : Promise.resolve(formData.content),
      ])

      setFormData((prev) => ({
        ...prev,
        title: enTitle || prev.title,
        subtitle: enSub || prev.subtitle,
        content: enContent || prev.content,
      }))
      toast.success('Successfully translated Indonesian to English')
    } catch {
      toast.error('Failed to auto-translate')
    } finally {
      setIsTranslating(false)
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
      const body = {
        ...formData,
        title: formData.title || formData.title_id,
        title_id: formData.title_id || formData.title,
        subtitle: formData.subtitle || formData.subtitle_id,
        subtitle_id: formData.subtitle_id || formData.subtitle,
        content: formData.content || formData.content_id,
        content_id: formData.content_id || formData.content,
        sort_order: editing ? editing.sort_order : 0,
        is_active: 1,
      }

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
      title: section.title ?? '',
      title_id: section.title_id ?? '',
      subtitle: section.subtitle ?? '',
      subtitle_id: section.subtitle_id ?? '',
      content: section.content ?? '',
      content_id: section.content_id ?? '',
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
      <div className="mx-auto max-w-[1400px] space-y-6">
        <p className="text-body-md text-muted-foreground">{sections.length} records</p>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,460px)_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>{editing ? `Edit: ${formData.slug || 'Section'}` : 'Add Section'}</CardTitle>
                  <CardDescription>
                    {activeGuide ? activeGuide.desc : 'Configure section content, titles, and media'}
                  </CardDescription>
                </div>
                <LangTabs value={activeLangTab} onChange={setActiveLangTab} />
              </div>

              <div className="pt-2">
                <AutoTranslateButton
                  onClick={handleAutoTranslateToEn}
                  busy={isTranslating}
                  disabled={isTranslating || (!formData.title_id && !formData.subtitle_id)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                      {['hero', 'problem', 'about', 'projects', 'skills', 'contact'].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setFormData({ ...formData, slug: s })}
                          className="rounded-[12px] border px-2 py-0.5 text-label-md transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          +{s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {activeLangTab === 'id' ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="title_id">
                        {formData.slug === 'hero' ? 'Nama / Judul Utama (ID) *' : 'Judul Seksi (ID) *'}
                      </Label>
                      <Input
                        id="title_id"
                        value={formData.title_id}
                        onChange={(e) => setFormData({ ...formData, title_id: e.target.value })}
                        placeholder="contoh: Adam Ghazy Al Falah"
                        required={!formData.title}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subtitle_id">
                        {formData.slug === 'hero' ? 'Ringkasan Bio / Subjudul (ID)' : 'Subjudul / Tagline (ID)'}
                      </Label>
                      <Textarea
                        id="subtitle_id"
                        value={formData.subtitle_id}
                        onChange={(e) => setFormData({ ...formData, subtitle_id: e.target.value })}
                        placeholder="Teks deskripsi ringkas..."
                        rows={3}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="title">
                        {formData.slug === 'hero' ? 'Headline / Main Title (EN) *' : 'Section Title (EN) *'}
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Adam Ghazy Al Falah"
                        required={!formData.title_id}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subtitle">
                        {formData.slug === 'hero' ? 'Bio / Subtitle Description (EN)' : 'Subtitle / Tagline (EN)'}
                      </Label>
                      <Textarea
                        id="subtitle"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        placeholder="Short descriptive text..."
                        rows={3}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="image_url">
                    {formData.slug === 'hero' ? 'Hero Profile Photo' : 'Section Image / Media'}
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="flex-1">
                        <Button variant="outline" className="w-full pointer-events-none" disabled={uploading} asChild>
                          <span className="cursor-pointer">
                            <Upload className="mr-2 h-4 w-4" strokeWidth={1.5} />
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

                    {formData.image_url && (
                      <div className="relative flex items-center gap-3 overflow-hidden rounded-[12px] border bg-muted/20 p-2">
                        <img
                          src={formData.image_url}
                          alt="preview"
                          className="h-16 w-16 rounded-[12px] border object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-label-md text-muted-foreground">{formData.image_url}</p>
                          <Badge variant="active">Active</Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">
                    {formData.slug === 'contact' ? 'Availability Tag / Note' : 'Extra Content / Data'}
                  </Label>
                  <Textarea
                    id="content"
                    value={activeLangTab === 'id' ? formData.content_id || formData.content : formData.content || formData.content_id}
                    onChange={(e) => {
                      if (activeLangTab === 'id') {
                        setFormData({ ...formData, content_id: e.target.value, content: formData.content || e.target.value })
                      } else {
                        setFormData({ ...formData, content: e.target.value, content_id: formData.content_id || e.target.value })
                      }
                    }}
                    placeholder={formData.slug === 'contact' ? 'e.g. Open to junior developer roles & projects' : 'Optional content...'}
                    rows={formData.slug === 'problem' ? 5 : 2}
                  />
                </div>

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

          <Card>
            <CardHeader>
              <CardTitle>Configured Sections</CardTitle>
              <CardDescription>{sections.length} active sections on your homepage</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="py-12 text-center text-body-md text-muted-foreground">Loading...</p>
              ) : sections.length === 0 ? (
                <p className="py-12 text-center text-body-md text-muted-foreground">No sections found</p>
              ) : (
                <ul className="divide-y divide-border">
                  {sections.map((section) => (
                    <li
                      key={section.id}
                      className="flex items-start gap-4 py-4 transition-colors hover:bg-sidebar"
                    >
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[12px] border bg-muted/30">
                        {section.image_url ? (
                          <img src={section.image_url} alt={section.title} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-label-section uppercase text-muted-foreground">
                            {section.slug.slice(0, 3)}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <Badge variant="secondary">{section.slug}</Badge>
                          {section.image_url && (
                            <span className="flex items-center gap-1 text-label-md text-muted-foreground">
                              <ImageIcon className="h-3.5 w-3.5" strokeWidth={1.5} /> photo
                            </span>
                          )}
                        </div>
                        <h4 className="truncate text-headline-sm text-foreground">{section.title}</h4>
                        {section.title_id && section.title_id !== section.title && (
                          <p className="text-label-md text-muted-foreground">ID: {section.title_id}</p>
                        )}
                        {section.subtitle && (
                          <p className="mt-0.5 line-clamp-2 text-body-sm text-muted-foreground">
                            {section.subtitle}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-[8px]"
                          onClick={() => handleEdit(section)}
                          title="Edit Section"
                          aria-label="Edit Section"
                        >
                          <Pencil className="h-4 w-4" strokeWidth={1.5} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-[8px]"
                          onClick={() => setDeleteId(section.id)}
                          title="Delete Section"
                          aria-label="Delete Section"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                        </Button>
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
              <AlertDialogTitle>Delete Section</AlertDialogTitle>
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
