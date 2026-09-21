'use client'

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin/layout-wrapper"
import { AutoTranslateButton, LangTabs } from "@/components/admin/lang-tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Skill {
  id: number
  title: string
  description: string
  description_id?: string
  icon?: string
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Skill | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    description_id: '',
    icon: ''
  })
  const [activeLangTab, setActiveLangTab] = useState<'id' | 'en'>('id')
  const [isTranslating, setIsTranslating] = useState(false)

  useEffect(() => {
    fetchSkills()
  }, [])

  async function fetchSkills() {
    try {
      const res = await fetch('/api/skills')
      if (!res.ok) throw new Error()
      setSkills(await res.json())
    } catch {
      toast.error('Failed to load skills')
    } finally {
      setLoading(false)
    }
  }

  async function handleAutoTranslate() {
    if (!formData.description_id || formData.description_id.trim() === '') return
    setIsTranslating(true)
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: formData.description_id, from: 'id', to: 'en' }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setFormData((prev) => ({ ...prev, description: data.translatedText || prev.description }))
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
      const url = editing ? `/api/skills/${editing.id}` : '/api/skills'
      const method = editing ? 'PUT' : 'POST'
      const body = {
        ...formData,
        description: formData.description || formData.description_id,
        description_id: formData.description_id || formData.description,
        sort_order: (editing as any)?.sort_order ?? 0,
        is_active: 1,
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error()
      toast.success(editing ? 'Skill updated' : 'Skill created')
      setFormData({ title: '', description: '', description_id: '', icon: '' })
      setEditing(null)
      fetchSkills()
    } catch {
      toast.error('Failed to save skill')
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/skills/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Skill deleted')
      fetchSkills()
    } catch {
      toast.error('Failed to delete skill')
    } finally {
      setDeleteId(null)
    }
  }

  function handleEdit(skill: Skill) {
    setEditing(skill)
    setFormData({
      title: skill.title,
      description: skill.description,
      description_id: skill.description_id ?? '',
      icon: skill.icon || ''
    })
  }

  function handleCancel() {
    setEditing(null)
    setFormData({ title: '', description: '', description_id: '', icon: '' })
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-[1400px] space-y-6">
        <p className="text-body-md text-muted-foreground">{skills.length} records</p>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,460px)_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>{editing ? 'Edit Skill' : 'Add Skill'}</CardTitle>
                  <CardDescription>
                    {editing ? 'Update skill details and categorization' : 'Create a new skill offering'}
                  </CardDescription>
                </div>
                <LangTabs value={activeLangTab} onChange={setActiveLangTab} />
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <AutoTranslateButton
                  onClick={handleAutoTranslate}
                  busy={isTranslating}
                  disabled={!formData.description_id}
                />

                <div className="space-y-2">
                  <Label htmlFor="title">Skill Name *</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Flutter, Laravel, Docker, Problem Solving"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                {activeLangTab === 'id' ? (
                  <div className="space-y-2">
                    <Label htmlFor="description_id">Kategori / Keterangan (ID) *</Label>
                    <Input
                      id="description_id"
                      placeholder="contoh: Pemrograman & Pengembangan, Backend & API, Keterampilan Interpersonal"
                      value={formData.description_id}
                      onChange={(e) => setFormData({ ...formData, description_id: e.target.value })}
                      required={!formData.description}
                    />
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['Pemrograman & Pengembangan', 'Backend & API', 'Basis Data', 'Alat & Infrastruktur', 'Metodologi Pengembangan', 'Keterampilan Interpersonal'].map((cat) => (
                        <Button
                          key={cat}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setFormData({ ...formData, description_id: cat })}
                        >
                          +{cat}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="description">Category / Subtitle (EN) *</Label>
                    <Input
                      id="description"
                      placeholder="e.g. Programming & Development, Backend & API, Tools & Infrastructure, Soft Skills"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required={!formData.description_id}
                    />
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['Programming & Development', 'Backend & API', 'Database', 'Tools & Infrastructure', 'Development Practices', 'Soft Skills'].map((cat) => (
                        <Button
                          key={cat}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setFormData({ ...formData, description: cat })}
                        >
                          +{cat}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1">
                    {editing ? 'Update Skill' : 'Add Skill'}
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
              <CardTitle>Existing Skills</CardTitle>
              <CardDescription>{skills.length} skills total</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="py-12 text-center text-body-md text-muted-foreground">Loading...</p>
              ) : skills.length === 0 ? (
                <p className="py-12 text-center text-body-md text-muted-foreground">No skills yet</p>
              ) : (
                <ul className="divide-y divide-border">
                  {skills.map((skill) => (
                    <li
                      key={skill.id}
                      className="flex items-start justify-between gap-4 py-4 transition-colors hover:bg-sidebar"
                    >
                      <div className="min-w-0">
                        <p className="text-headline-sm text-foreground">{skill.title}</p>
                        <p className="mt-1 text-body-sm text-muted-foreground">
                          {skill.description}
                          {skill.description_id && skill.description_id !== skill.description && (
                            <span className="ml-2 text-label-md text-muted-foreground">
                              ID: {skill.description_id}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-[8px]"
                          onClick={() => handleEdit(skill)}
                          aria-label="Edit skill"
                        >
                          <Pencil className="h-4 w-4" strokeWidth={1.5} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-[8px]"
                          onClick={() => setDeleteId(skill.id)}
                          aria-label="Delete skill"
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
              <AlertDialogTitle>Delete Skill</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure? This action cannot be undone.
              </AlertDialogDescription>
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
