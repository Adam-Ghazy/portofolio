'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/layout-wrapper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pencil, Trash2, TrendingUp } from 'lucide-react'
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
import { AutoTranslateButton, LangTabs } from '@/components/admin/lang-tabs'

interface Stat {
  id: number
  value: string
  label: string
  label_id?: string
  sort_order: number
}

const emptyForm = { value: '', label: '', label_id: '' }

export default function StatsPage() {
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Stat | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [activeLangTab, setActiveLangTab] = useState<'id' | 'en'>('id')
  const [isTranslating, setIsTranslating] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const res = await fetch('/api/about-stats')
      if (!res.ok) throw new Error()
      setStats(await res.json())
    } catch {
      toast.error('Failed to load stats')
    } finally {
      setLoading(false)
    }
  }

  async function handleAutoTranslate() {
    if (!formData.label_id || formData.label_id.trim() === '') return
    setIsTranslating(true)
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: formData.label_id, from: 'id', to: 'en' }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setFormData((prev) => ({ ...prev, label: data.translatedText || prev.label }))
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
      const url = editing ? `/api/about-stats/${editing.id}` : '/api/about-stats'
      const method = editing ? 'PUT' : 'POST'
      const body = {
        ...formData,
        label: formData.label || formData.label_id,
        label_id: formData.label_id || formData.label,
        sort_order: editing ? editing.sort_order : 0,
        is_active: 1,
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error()
      toast.success(editing ? 'Stat updated' : 'Stat created')
      setFormData(emptyForm)
      setEditing(null)
      fetchStats()
    } catch {
      toast.error('Failed to save stat')
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/about-stats/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Stat deleted')
      fetchStats()
    } catch {
      toast.error('Failed to delete stat')
    } finally {
      setDeleteId(null)
    }
  }

  function handleEdit(stat: Stat) {
    setEditing(stat)
    setFormData({
      value: stat.value,
      label: stat.label,
      label_id: stat.label_id ?? '',
    })
  }

  function handleCancel() {
    setEditing(null)
    setFormData(emptyForm)
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-[1400px] space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-body-md text-muted-foreground">{stats.length} records</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>{editing ? 'Edit Stat' : 'Add Stat'}</CardTitle>
                  <CardDescription>
                    {editing ? 'Update statistic' : 'Create a new statistic'}
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
                  disabled={!formData.label_id}
                />

                <div className="space-y-2">
                  <Label htmlFor="value">Value *</Label>
                  <Input
                    id="value"
                    placeholder="1+ yr"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    required
                  />
                </div>

                {activeLangTab === 'id' ? (
                  <div className="space-y-2">
                    <Label htmlFor="label_id">Label (ID) *</Label>
                    <Input
                      id="label_id"
                      placeholder="contoh: Pengalaman Praktis"
                      value={formData.label_id}
                      onChange={(e) => setFormData({ ...formData, label_id: e.target.value })}
                      required={!formData.label}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="label">Label (EN) *</Label>
                    <Input
                      id="label"
                      placeholder="e.g. Hands-on Experience"
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      required={!formData.label_id}
                    />
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1">
                    {editing ? 'Update Stat' : 'Add Stat'}
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
              <CardTitle>Existing Stats</CardTitle>
              <CardDescription>{stats.length} stats total</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="py-12 text-center text-body-md text-muted-foreground">Loading...</p>
              ) : stats.length === 0 ? (
                <p className="py-12 text-center text-body-md text-muted-foreground">No stats yet</p>
              ) : (
                <ul className="divide-y divide-border">
                  {stats.map((stat) => (
                    <li
                      key={stat.id}
                      className="flex items-start justify-between gap-4 py-4 transition-colors hover:bg-sidebar"
                    >
                      <div className="flex min-w-0 gap-3">
                        <TrendingUp
                          className="mt-1 h-4 w-4 shrink-0 text-muted-foreground"
                          strokeWidth={1.5}
                        />
                        <div className="min-w-0">
                          <p className="text-headline-lg tabular-nums text-foreground">{stat.value}</p>
                          <p className="mt-1 text-body-sm text-muted-foreground">{stat.label}</p>
                          {stat.label_id && stat.label_id !== stat.label && (
                            <p className="mt-1 text-label-md text-muted-foreground">ID: {stat.label_id}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-[8px]"
                          onClick={() => handleEdit(stat)}
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" strokeWidth={1.5} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-[8px]"
                          onClick={() => setDeleteId(stat.id)}
                          aria-label="Delete"
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
              <AlertDialogTitle>Delete Stat</AlertDialogTitle>
              <AlertDialogDescription>Are you sure? This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant={'destructive' as never} onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  )
}
