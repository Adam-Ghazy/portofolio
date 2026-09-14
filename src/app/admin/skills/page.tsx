'use client'

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin/layout-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Trash2, Wrench, Sparkles, Terminal } from "lucide-react"
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
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Skills & Tech Stack</h1>
            <p className="text-muted-foreground">Manage core technologies, categories, and interpersonal skills with bilingual support</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{editing ? 'Edit Skill' : 'Add Skill'}</CardTitle>
                  <CardDescription>
                    {editing ? 'Update skill details and categorization' : 'Create a new skill offering'}
                  </CardDescription>
                </div>

                {/* Language Switch Tabs */}
                <div className="flex items-center rounded-lg border p-0.5 bg-muted/40 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveLangTab('id')}
                    className={`px-2.5 py-1 rounded transition-all ${
                      activeLangTab === 'id' ? 'bg-primary text-primary-foreground font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    ID
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveLangTab('en')}
                    className={`px-2.5 py-1 rounded transition-all ${
                      activeLangTab === 'en' ? 'bg-primary text-primary-foreground font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>

              {/* Auto Translate Button */}
              <div className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAutoTranslate}
                  disabled={isTranslating || !formData.description_id}
                  className="w-full text-xs font-mono gap-1.5 h-8"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {isTranslating ? 'Translating ID to EN...' : 'Auto-Translate Category ID to EN'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFormData({ ...formData, description_id: cat })}
                          className="text-[11px] font-mono px-2 py-0.5 rounded border hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          +{cat}
                        </button>
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
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFormData({ ...formData, description: cat })}
                          className="text-[11px] font-mono px-2 py-0.5 rounded border hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          +{cat}
                        </button>
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

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Existing Skills</CardTitle>
                <CardDescription>{skills.length} skills total</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground text-center py-8">Loading...</p>
                ) : skills.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No skills yet</p>
                ) : (
                  <div className="space-y-3">
                    {skills.map((skill) => (
                      <Card key={skill.id}>
                        <CardContent className="p-3.5">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-lg border bg-muted/40 flex items-center justify-center font-mono text-xs font-semibold text-primary shrink-0">
                                <Terminal className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-semibold text-sm leading-tight">{skill.title}</h3>
                                <p className="text-xs text-muted-foreground font-mono">
                                  {skill.description}
                                  {skill.description_id && skill.description_id !== skill.description && (
                                    <span> / {skill.description_id}</span>
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleEdit(skill)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setDeleteId(skill.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
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
              <AlertDialogTitle>Delete Skill</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure? This action cannot be undone.
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
