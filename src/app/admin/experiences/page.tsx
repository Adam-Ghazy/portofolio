'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/layout-wrapper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Pencil, Trash2, Plus, Layers } from 'lucide-react'
import { toast } from 'sonner'
import { LangTabs, AutoTranslateButton } from '@/components/admin/lang-tabs'
import { Badge } from '@/components/ui/badge'
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
  title_id?: string
  tagline?: string
  tagline_id?: string
  description: string
  description_id?: string
  tech?: string
}

interface Experience {
  id: number
  company: string
  position: string
  position_id?: string
  program?: string
  program_id?: string
  location: string
  period: string
  description: string
  description_id?: string
  systems?: string
  systems_id?: string
  technologies?: string
  collaboration?: string
  collaboration_id?: string
  sort_order: number
  is_active: number
}

const emptyForm = {
  company: '',
  position: '',
  position_id: '',
  program: '',
  program_id: '',
  location: '',
  period: '',
  description: '',
  description_id: '',
  technologies: '',
  collaboration: '',
  collaboration_id: '',
  sort_order: 0,
}

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Experience | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [systemsList, setSystemsList] = useState<SystemItem[]>([])
  const [activeLangTab, setActiveLangTab] = useState<'id' | 'en'>('id')
  const [isTranslating, setIsTranslating] = useState(false)

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
      { title: '', title_id: '', tagline: '', tagline_id: '', description: '', description_id: '', tech: '' },
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

  async function handleAutoTranslateToEn() {
    setIsTranslating(true)
    try {
      const translateField = async (text: string) => {
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

      const [enPosition, enProgram, enDescription, enCollab] = await Promise.all([
        formData.position_id ? translateField(formData.position_id) : Promise.resolve(formData.position),
        formData.program_id ? translateField(formData.program_id) : Promise.resolve(formData.program),
        formData.description_id ? translateField(formData.description_id) : Promise.resolve(formData.description),
        formData.collaboration_id ? translateField(formData.collaboration_id) : Promise.resolve(formData.collaboration),
      ])

      const translatedSystems = await Promise.all(
        systemsList.map(async (sys) => ({
          ...sys,
          title: sys.title_id ? await translateField(sys.title_id) : sys.title,
          tagline: sys.tagline_id ? await translateField(sys.tagline_id) : sys.tagline,
          description: sys.description_id ? await translateField(sys.description_id) : sys.description,
        }))
      )

      setFormData((prev) => ({
        ...prev,
        position: enPosition || prev.position,
        program: enProgram || prev.program,
        description: enDescription || prev.description,
        collaboration: enCollab || prev.collaboration,
      }))
      setSystemsList(translatedSystems)
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
      const url = editing ? `/api/experiences/${editing.id}` : '/api/experiences'
      const method = editing ? 'PUT' : 'POST'

      const activeSystems = systemsList.filter((s) => (s.title && s.title.trim() !== '') || (s.title_id && s.title_id.trim() !== ''))

      const body = {
        ...formData,
        position: formData.position || formData.position_id,
        position_id: formData.position_id || formData.position,
        description: formData.description || formData.description_id,
        description_id: formData.description_id || formData.description,
        program: formData.program || formData.program_id,
        program_id: formData.program_id || formData.program,
        collaboration: formData.collaboration || formData.collaboration_id,
        collaboration_id: formData.collaboration_id || formData.collaboration,
        systems: JSON.stringify(activeSystems.map((s) => ({ title: s.title || s.title_id, tagline: s.tagline || s.tagline_id, description: s.description || s.description_id, tech: s.tech }))),
        systems_id: JSON.stringify(activeSystems.map((s) => ({ title: s.title_id || s.title, tagline: s.tagline_id || s.tagline, description: s.description_id || s.description, tech: s.tech }))),
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
      position: exp.position ?? '',
      position_id: exp.position_id ?? '',
      program: exp.program ?? '',
      program_id: exp.program_id ?? '',
      location: exp.location ?? '',
      period: exp.period ?? '',
      description: exp.description ?? '',
      description_id: exp.description_id ?? '',
      technologies: exp.technologies ?? '',
      collaboration: exp.collaboration ?? '',
      collaboration_id: exp.collaboration_id ?? '',
      sort_order: exp.sort_order ?? 0,
    })

    try {
      const parsedEn = exp.systems ? JSON.parse(exp.systems) : []
      const parsedId = exp.systems_id ? JSON.parse(exp.systems_id) : []
      const combined: SystemItem[] = []

      const maxLen = Math.max(parsedEn.length, parsedId.length)
      for (let i = 0; i < maxLen; i++) {
        const en = parsedEn[i] || {}
        const idItem = parsedId[i] || {}
        combined.push({
          title: en.title || idItem.title || '',
          title_id: idItem.title || en.title || '',
          tagline: en.tagline || idItem.tagline || '',
          tagline_id: idItem.tagline || en.tagline || '',
          description: en.description || idItem.description || '',
          description_id: idItem.description || en.description || '',
          tech: en.tech || idItem.tech || '',
        })
      }
      setSystemsList(combined)
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
      <div className="mx-auto max-w-[1400px] space-y-6">
        <p className="text-body-md text-muted-foreground">{experiences.length} records</p>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,520px)_minmax(0,1fr)]">
          {/* Left Form */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>{editing ? 'Edit Experience' : 'Add Experience'}</CardTitle>
                  <CardDescription>
                    {editing ? 'Update experience and system responsibilities' : 'Add a new work experience record'}
                  </CardDescription>
                </div>
                <LangTabs
                  value={activeLangTab}
                  onChange={setActiveLangTab}
                  idLabel="Indonesian (ID)"
                  enLabel="English (EN)"
                />
              </div>

              <div className="pt-2">
                <AutoTranslateButton
                  onClick={handleAutoTranslateToEn}
                  busy={isTranslating}
                  disabled={!formData.position_id && !formData.description_id}
                />
              </div>
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

                {activeLangTab === 'id' ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="position_id">Jabatan / Posisi (ID) *</Label>
                      <Input
                        id="position_id"
                        placeholder="contoh: Junior Software Developer Intern"
                        value={formData.position_id}
                        onChange={(e) => setFormData({ ...formData, position_id: e.target.value })}
                        required={!formData.position}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="program_id">Program / Jalur (ID)</Label>
                        <Input
                          id="program_id"
                          placeholder="contoh: Magang Nasional Batch 2"
                          value={formData.program_id}
                          onChange={(e) => setFormData({ ...formData, program_id: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Lokasi</Label>
                        <Input
                          id="location"
                          placeholder="contoh: Madiun, Indonesia"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description_id">Deskripsi Ringkas (ID) *</Label>
                      <Textarea
                        id="description_id"
                        placeholder="Jelaskan tanggung jawab umum, kolaborasi tim, dan kontribusi..."
                        value={formData.description_id}
                        onChange={(e) => setFormData({ ...formData, description_id: e.target.value })}
                        rows={3}
                        required={!formData.description}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="position">Position / Job Title (EN) *</Label>
                      <Input
                        id="position"
                        placeholder="e.g. Junior Software Developer Intern"
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        required={!formData.position_id}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="program">Program / Track (EN)</Label>
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

                    <div className="space-y-2">
                      <Label htmlFor="description">Overview Description (EN) *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your general responsibilities, cross-functional collaboration, and accomplishments..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        required={!formData.description_id}
                      />
                    </div>
                  </>
                )}

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
                  <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                  <Input
                    id="technologies"
                    placeholder="Laravel, REST API, Data Synchronization, MySQL, Agile/Scrum"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="collaboration">Collaboration Teams (comma-separated)</Label>
                  <Input
                    id="collaboration"
                    placeholder="Engineering, Operations, Logistics, QA/QC, Security"
                    value={activeLangTab === 'id' ? formData.collaboration_id || formData.collaboration : formData.collaboration || formData.collaboration_id}
                    onChange={(e) => {
                      if (activeLangTab === 'id') {
                        setFormData({ ...formData, collaboration_id: e.target.value, collaboration: formData.collaboration || e.target.value })
                      } else {
                        setFormData({ ...formData, collaboration: e.target.value, collaboration_id: formData.collaboration_id || e.target.value })
                      }
                    }}
                  />
                </div>

                {/* Sub-Systems / Projects Sub-Manager */}
                <div className="space-y-3 rounded-[12px] border border-border bg-sidebar p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-label-section text-muted-foreground">
                        Contributed Digital Systems
                      </span>
                      <p className="text-body-sm text-muted-foreground">Specific systems developed during this role</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddSystem}
                      className="gap-1.5"
                    >
                      <Plus className="h-4 w-4" strokeWidth={1.5} />
                      Add System
                    </Button>
                  </div>

                  {systemsList.length === 0 ? (
                    <p className="py-3 text-center text-body-sm text-muted-foreground">
                      No specific sub-systems added yet. Click &quot;Add System&quot; to highlight key internal projects.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {systemsList.map((sys, idx) => (
                        <div key={idx} className="relative space-y-2 rounded-[12px] border border-border bg-surface p-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-label-section uppercase text-muted-foreground">
                              System #{idx + 1} ({activeLangTab.toUpperCase()})
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveSystem(idx)}
                              className="h-6 w-6 rounded-[8px] text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label>Title ({activeLangTab.toUpperCase()}) *</Label>
                              <Input
                                placeholder="e.g. Paperless Inspection System"
                                value={activeLangTab === 'id' ? sys.title_id ?? sys.title : sys.title ?? sys.title_id}
                                onChange={(e) => {
                                  if (activeLangTab === 'id') {
                                    handleUpdateSystem(idx, 'title_id', e.target.value)
                                    if (!sys.title) handleUpdateSystem(idx, 'title', e.target.value)
                                  } else {
                                    handleUpdateSystem(idx, 'title', e.target.value)
                                    if (!sys.title_id) handleUpdateSystem(idx, 'title_id', e.target.value)
                                  }
                                }}
                                required
                              />
                            </div>
                            <div>
                              <Label>Tagline ({activeLangTab.toUpperCase()})</Label>
                              <Input
                                placeholder="e.g. QA/QC Workflow Digitalization"
                                value={activeLangTab === 'id' ? sys.tagline_id ?? sys.tagline : sys.tagline ?? sys.tagline_id}
                                onChange={(e) => {
                                  if (activeLangTab === 'id') {
                                    handleUpdateSystem(idx, 'tagline_id', e.target.value)
                                    if (!sys.tagline) handleUpdateSystem(idx, 'tagline', e.target.value)
                                  } else {
                                    handleUpdateSystem(idx, 'tagline', e.target.value)
                                    if (!sys.tagline_id) handleUpdateSystem(idx, 'tagline_id', e.target.value)
                                  }
                                }}
                              />
                            </div>
                          </div>

                          <div>
                            <Label>Description ({activeLangTab.toUpperCase()})</Label>
                            <Textarea
                              placeholder="Describe the system workflow, replacement of manual paper, etc..."
                              value={activeLangTab === 'id' ? sys.description_id ?? sys.description : sys.description ?? sys.description_id}
                              onChange={(e) => {
                                if (activeLangTab === 'id') {
                                  handleUpdateSystem(idx, 'description_id', e.target.value)
                                  if (!sys.description) handleUpdateSystem(idx, 'description', e.target.value)
                                } else {
                                  handleUpdateSystem(idx, 'description', e.target.value)
                                  if (!sys.description_id) handleUpdateSystem(idx, 'description_id', e.target.value)
                                }
                              }}
                              rows={2}
                            />
                          </div>

                          <div>
                            <Label>Tech Stack</Label>
                            <Input
                              placeholder="e.g. Laravel, REST API, Data Synchronization, MySQL"
                              value={sys.tech || ''}
                              onChange={(e) => handleUpdateSystem(idx, 'tech', e.target.value)}
                              className="font-mono"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1">
                    {editing ? 'Update Experience' : 'Add Experience'}
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
                <p className="py-12 text-center text-body-md text-muted-foreground">Loading...</p>
              ) : experiences.length === 0 ? (
                <p className="py-12 text-center text-body-md text-muted-foreground">No experience entries found.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {experiences.map((exp) => {
                    let parsedSystems: SystemItem[] = []
                    try {
                      parsedSystems = exp.systems ? JSON.parse(exp.systems) : []
                    } catch {
                      parsedSystems = []
                    }

                    return (
                      <li key={exp.id} className="space-y-4 py-4 transition-colors hover:bg-sidebar">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-headline-sm text-foreground">{exp.company}</h3>
                              {exp.program && <Badge variant="outline">{exp.program}</Badge>}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-body-sm text-muted-foreground">
                              <span className="text-body-sm text-foreground">{exp.position}</span>
                              {exp.position_id && exp.position_id !== exp.position && (
                                <span className="text-body-sm text-muted-foreground">({exp.position_id})</span>
                              )}
                              <span>•</span>
                              <span>{exp.location}</span>
                              <span>•</span>
                              <span className="tabular-nums">{exp.period}</span>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-[8px]"
                              onClick={() => handleEdit(exp)}
                              title="Edit"
                              aria-label="Edit"
                            >
                              <Pencil className="h-4 w-4" strokeWidth={1.5} />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-[8px]"
                              onClick={() => setDeleteId(exp.id)}
                              title="Delete"
                              aria-label="Delete"
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                            </Button>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-body-md text-muted-foreground">{exp.description}</p>

                        {/* Systems Grid */}
                        {parsedSystems.length > 0 && (
                          <div className="space-y-2 border-t border-border pt-2">
                            <span className="flex items-center gap-1.5 text-label-section uppercase text-muted-foreground">
                              <Layers className="h-3.5 w-3.5" strokeWidth={1.5} />
                              Systems & Projects ({parsedSystems.length})
                            </span>
                            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                              {parsedSystems.map((sys, sIdx) => (
                                <div key={sIdx} className="space-y-1 rounded-[12px] border border-border bg-sidebar p-3">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-body-sm text-foreground">{sys.title}</span>
                                    {sys.tagline && <Badge variant="outline">{sys.tagline}</Badge>}
                                  </div>
                                  <p className="text-body-sm text-muted-foreground line-clamp-2">{sys.description}</p>
                                  {sys.tech && (
                                    <p className="pt-0.5 text-label-sm text-muted-foreground font-mono">
                                      Stack: {sys.tech}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Collaboration Badges */}
                        {exp.collaboration && (
                          <div className="flex flex-wrap items-center gap-1.5 border-t border-border pt-2">
                            <span className="text-label-sm text-muted-foreground">Collaboration:</span>
                            {exp.collaboration.split(',').map((team, cIdx) => (
                              <Badge key={cIdx} variant="outline">
                                {team.trim()}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Tech Badges Footer */}
                        {exp.technologies && (
                          <div className="flex flex-wrap gap-1.5 border-t border-border pt-2">
                            {exp.technologies.split(',').map((tech, tIdx) => (
                              <Badge key={tIdx} variant="secondary" className="font-mono">
                                {tech.trim()}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
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
              <AlertDialogAction variant="destructive" onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  )
}
