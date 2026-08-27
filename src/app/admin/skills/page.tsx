'use client'

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin/layout-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Pencil, Trash2, Wrench } from "lucide-react"
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
  icon: string
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Skill | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: ''
  })

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const url = editing ? `/api/skills/${editing.id}` : '/api/skills'
      const method = editing ? 'PUT' : 'POST'
      const body = editing
        ? { ...formData, sort_order: (editing as any).sort_order ?? 0, is_active: 1 }
        : formData

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error()
      toast.success(editing ? 'Skill updated' : 'Skill created')
      setFormData({ title: '', description: '', icon: '' })
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
      icon: skill.icon
    })
  }

  function handleCancel() {
    setEditing(null)
    setFormData({ title: '', description: '', icon: '' })
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
            <p className="text-muted-foreground">Manage skill offerings</p>
          </div>
        </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{editing ? 'Edit Skill' : 'Add Skill'}</CardTitle>
            <CardDescription>
              {editing ? 'Update skill details' : 'Create a new skill offering'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Skill Name *</Label>
                <Input
                  id="title"
                  placeholder="e.g. React, Next.js, Docker, Problem Solving"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Category / Subtitle *</Label>
                <Input
                  id="description"
                  placeholder="e.g. Frontend, Backend, DevOps & Tools, Soft Skills"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Frontend', 'Backend', 'DevOps & Tools', 'Soft Skills'].map((cat) => (
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

              <div className="space-y-2">
                <Label htmlFor="icon">Icon (Emoji or Image/SVG URL)</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="icon"
                    placeholder="e.g. ⚛️, 🚀, 🐳, 🐍, or https://..."
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  />
                  <div className="w-10 h-10 rounded-lg border flex items-center justify-center text-xl shrink-0 bg-muted/40">
                    {formData.icon ? (
                      formData.icon.startsWith('http') ? (
                        <img src={formData.icon} alt="preview" className="w-6 h-6 object-contain" />
                      ) : (
                        formData.icon
                      )
                    ) : (
                      '⚡'
                    )}
                  </div>
                </div>

                {/* Quick Emoji Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['⚛️', '▲', '📘', '🎨', '🟢', '🚂', '🐍', '🐘', '📦', '🐳', '☁️', '🐧', '🧩', '💬', '🤝', '⚡', '💻', '🛠️', '🔥', '🚀'].map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: em })}
                      className="w-7 h-7 rounded border text-sm flex items-center justify-center hover:bg-accent transition-colors"
                      title={em}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview */}
              {formData.title && (
                <div className="p-3 rounded-xl border bg-muted/20 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Preview:</span>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{formData.icon || '⚡'}</span>
                    <div>
                      <p className="text-sm font-semibold">{formData.title}</p>
                      <p className="text-xs text-muted-foreground font-mono uppercase">{formData.description || 'Category'}</p>
                    </div>
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
                <div className="space-y-4">
                  {skills.map((skill) => (
                    <Card key={skill.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl flex-shrink-0">
                            {skill.icon || <Wrench className="h-6 w-6" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold mb-1">{skill.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {skill.description}
                            </p>
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
