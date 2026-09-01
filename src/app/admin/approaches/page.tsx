'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/layout-wrapper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Pencil, Trash2, Workflow, Plus, Layers, CheckCircle2 } from 'lucide-react'
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
  description: '',
  sort_order: 0,
}

export default function ApproachesAdminPage() {
  const [approaches, setApproaches] = useState<Approach[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Approach | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [deleteId, setDeleteId] = useState<number | null>(null)

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const url = editing ? `/api/approaches/${editing.id}` : '/api/approaches'
      const method = editing ? 'PUT' : 'POST'
      const body = {
        ...formData,
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
      description: item.description || '',
      sort_order: item.sort_order || 0,
    })
  }

  function handleCancel() {
    setEditing(null)
    setFormData(emptyForm)
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Engineering Approach</h1>
            <p className="text-muted-foreground">
              Manage &quot;03 // approach - How I Build Software&quot; methodology cards shown on the About page
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[460px_1fr]">
          {/* Approach Form */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5 text-primary" />
                {editing ? 'Edit Approach Step' : 'Add Approach Step'}
              </CardTitle>
              <CardDescription>
                {editing
                  ? 'Update step details and methodology description'
                  : 'Add a new step to your engineering methodology'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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

                <div className="space-y-2">
                  <Label htmlFor="app-title">Step Title *</Label>
                  <Input
                    id="app-title"
                    placeholder="e.g. User & Process Research"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="app-desc">Description / Execution Details</Label>
                  <Textarea
                    id="app-desc"
                    placeholder="Describe the workflow, actions taken, and engineering mindset for this step..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                {/* Live Card Preview */}
                {(formData.title || formData.step_number || formData.description) && (
                  <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      Live Preview (About Page Style):
                    </span>
                    <div className="p-4 rounded-2xl border bg-card space-y-2">
                      <div className="font-mono text-2xl font-bold text-primary">
                        {formData.step_number || '01'}
                      </div>
                      <h4 className="font-semibold text-sm text-foreground">
                        {formData.title || 'Step Title'}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {formData.description || 'Step description will appear here...'}
                      </p>
                    </div>
                  </div>
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
              <CardTitle className="flex items-center justify-between">
                <span>Approach Steps</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {approaches.length} steps configured
                </span>
              </CardTitle>
              <CardDescription>
                These steps will appear in chronological sequence in the &quot;How I Build Software&quot; grid
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground text-center py-8">Loading approach steps...</p>
              ) : approaches.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No approach steps found.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {approaches.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="p-5 rounded-2xl border bg-card hover:border-primary/50 transition-colors flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="font-mono text-2xl font-bold text-primary">
                            {item.step_number || String(idx + 1).padStart(2, '0')}
                          </div>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded border bg-muted/60 text-muted-foreground">
                            Order: {item.sort_order ?? 0}
                          </span>
                        </div>

                        <h3 className="font-semibold text-base text-foreground leading-snug">
                          {item.title}
                        </h3>

                        {item.description && (
                          <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-1 pt-2 border-t">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(item)}
                          className="h-8 px-2 text-xs flex items-center gap-1.5"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteId(item.id!)}
                          className="h-8 px-2 text-xs text-destructive hover:text-destructive flex items-center gap-1.5"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
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
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  )
}
