'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/layout-wrapper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pencil, Trash2, TrendingUp, Sparkles } from 'lucide-react'
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
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Stats</h1>
          <p className="text-muted-foreground">Manage about section statistics with bilingual support</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{editing ? 'Edit Stat' : 'Add Stat'}</CardTitle>
                  <CardDescription>
                    {editing ? 'Update statistic' : 'Create a new statistic'}
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

              {/* Auto-Translate Button */}
              <div className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAutoTranslate}
                  disabled={isTranslating || !formData.label_id}
                  className="w-full text-xs font-mono gap-1.5 h-8"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {isTranslating ? 'Translating ID to EN...' : 'Auto-Translate ID to EN'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    {editing ? 'Update' : 'Create'}
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
                <CardTitle>Existing Stats</CardTitle>
                <CardDescription>{stats.length} stats total</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground text-center py-8">Loading...</p>
                ) : stats.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No stats yet</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {stats.map((stat) => (
                      <Card key={stat.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <TrendingUp className="h-4 w-4 text-primary" />
                                <p className="text-2xl font-bold">{stat.value}</p>
                              </div>
                              <p className="text-sm text-muted-foreground">{stat.label}</p>
                              {stat.label_id && stat.label_id !== stat.label && (
                                <p className="text-xs text-muted-foreground font-mono">ID: {stat.label_id}</p>
                              )}
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              <Button size="icon" variant="ghost" onClick={() => handleEdit(stat)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => setDeleteId(stat.id)}>
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
              <AlertDialogTitle>Delete Stat</AlertDialogTitle>
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
