'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/layout-wrapper'
import { LangTabs, AutoTranslateButton } from '@/components/admin/lang-tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Pencil, Trash2, Workflow } from 'lucide-react'
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
import { Approach } from '@/types/admin'

const emptyForm = {
  step_number: '',
  title: '',
  title_id: '',
  description: '',
  description_id: '',
  sort_order: 0,
}

export default function ApproachesAdminPage() {
  const [approaches, setApproaches] = useState<Approach[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Approach | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [activeLangTab, setActiveLangTab] = useState<'id' | 'en'>('id')
  const [isTranslating, setIsTranslating] = useState(false)

  useEffect(() => {
    fetchApproaches()
  }, [])

  async function fetchApproaches() {
    setLoading(true)
    try {
      const res = await fetch('/api/approaches')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setApproaches(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to load approach steps')
    } finally {
      setLoading(false)
    }
  }

  async function handleAutoTranslate() {
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

      const [enTitle, enDesc] = await Promise.all([
        formData.title_id ? translateField(formData.title_id) : Promise.resolve(formData.title),
        formData.description_id ? translateField(formData.description_id) : Promise.resolve(formData.description),
      ])

      setFormData((prev) => ({
        ...prev,
        title: enTitle || prev.title,
        description: enDesc || prev.description,
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
      const url = editing ? `/api/approaches/${editing.id}` : '/api/approaches'
      const method = editing ? 'PUT' : 'POST'
      const body = {
        ...formData,
        title: formData.title || formData.title_id,
        title_id: formData.title_id || formData.title,
        description: formData.description || formData.description_id,
        description_id: formData.description_id || formData.description,
        sort_order: Number(formData.sort_order) || 0,
        ...(editing ? { id: editing.id, is_active: editing.is_active ?? 1 } : { is_active: 1 }),
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error()
      toast.success(editing ? 'Approach step updated' : 'Approach step added')
      handleCancel()
      fetchApproaches()
    } catch {
      toast.error('Failed to save approach step')
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/approaches/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Approach step deleted')
      fetchApproaches()
    } catch {
      toast.error('Failed to delete approach step')
    } finally {
      setDeleteId(null)
    }
  }

  function handleEdit(item: Approach) {
    setEditing(item)
    setFormData({
      step_number: item.step_number || '',
      title: item.title,
      title_id: item.title_id ?? '',
      description: item.description || '',
      description_id: item.description_id ?? '',
      sort_order: item.sort_order || 0,
    })
  }

  function handleCancel() {
    setEditing(null)
    setFormData(emptyForm)
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-[1400px] space-y-6">
        <p className="text-body-md text-muted-foreground">{approaches.length} steps configured</p>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,480px)_minmax(0,1fr)]">
          {/* Approach Form */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Workflow className="h-5 w-5 text-primary" strokeWidth={1.5} />
                    {editing ? 'Edit Approach Step' : 'Add Approach Step'}
                  </CardTitle>
                  <CardDescription>
                    {editing
                      ? 'Update step details and methodology description'
                      : 'Add a new step to your engineering methodology'}
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
                  disabled={!formData.title_id && !formData.description_id}
                />

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="app-num">Step Number</Label>
                    <Input
                      id="app-num"
                      placeholder="e.g. 01"
                      value={formData.step_number}
                      onChange={(e) => setFormData({ ...formData, step_number: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="app-sort">Sort Order</Label>
                    <Input
                      id="app-sort"
                      type="number"
                      placeholder="1"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                    />
                  </div>
                </div>

                {activeLangTab === 'id' ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="app-title_id">Judul Tahapan (ID) *</Label>
                      <Input
                        id="app-title_id"
                        placeholder="contoh: Riset Pengguna & Alur Proses"
                        value={formData.title_id}
                        onChange={(e) => setFormData({ ...formData, title_id: e.target.value })}
                        required={!formData.title}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="app-desc_id">Deskripsi / Detail Eksekusi (ID)</Label>
                      <Textarea
                        id="app-desc_id"
                        placeholder="Jelaskan alur kerja, tindakan nyata, dan pola pikir rekayasa..."
                        value={formData.description_id}
                        onChange={(e) => setFormData({ ...formData, description_id: e.target.value })}
                        rows={4}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="app-title">Step Title (EN) *</Label>
                      <Input
                        id="app-title"
                        placeholder="e.g. User & Process Research"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required={!formData.title_id}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="app-desc">Description / Execution Details (EN)</Label>
                      <Textarea
                        id="app-desc"
                        placeholder="Describe the workflow, actions taken, and engineering mindset for this step..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1">
                    {editing ? 'Update Step' : 'Add Approach Step'}
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

          {/* Approaches List */}
          <Card>
            <CardHeader>
              <CardTitle>Approach Steps</CardTitle>
              <CardDescription>
                These steps will appear in chronological sequence in the &quot;How I Build Software&quot; grid
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-body-md text-muted-foreground text-center py-12">Loading approach steps...</p>
              ) : approaches.length === 0 ? (
                <p className="text-body-md text-muted-foreground text-center py-12">No approach steps found.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {approaches.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="flex flex-col justify-between space-y-3 rounded-[12px] border border-border bg-surface p-4 transition-colors hover:border-border-strong"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-headline-md tabular-nums text-foreground">
                            {item.step_number || String(idx + 1).padStart(2, '0')}
                          </div>
                          <Badge variant="secondary">Order {item.sort_order ?? 0}</Badge>
                        </div>

                        <h3 className="text-headline-sm text-foreground">{item.title}</h3>
                        {item.title_id && item.title_id !== item.title && (
                          <p className="text-label-md text-muted-foreground">ID: {item.title_id}</p>
                        )}

                        {item.description && (
                          <p className="pt-1 text-body-sm text-muted-foreground">{item.description}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-1 border-t border-border pt-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(item)}
                          className="h-8 w-8 rounded-[8px]"
                          aria-label="Edit approach step"
                        >
                          <Pencil className="h-4 w-4" strokeWidth={1.5} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setDeleteId(item.id!)}
                          className="h-8 w-8 rounded-[8px] text-destructive hover:text-destructive"
                          aria-label="Delete approach step"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Approach Step</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this engineering approach step? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  )
}
