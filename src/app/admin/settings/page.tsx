'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/layout-wrapper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Sparkles } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeLangTab, setActiveLangTab] = useState<'id' | 'en'>('id')
  const [isTranslating, setIsTranslating] = useState(false)
  const [formData, setFormData] = useState({
    site_title: '',
    site_description: '',
    site_description_id: '',
    hero_meta: '',
    hero_meta_id: '',
    footer_tagline: '',
    footer_tagline_id: '',
    status_left: '',
    status_left_id: '',
    status_right: '',
    status_right_id: '',
  })

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then((data: Record<string, string>) => {
        setFormData({
          site_title: data.site_title ?? '',
          site_description: data.site_description ?? '',
          site_description_id: data.site_description_id ?? '',
          hero_meta: data.hero_meta ?? '',
          hero_meta_id: data.hero_meta_id ?? '',
          footer_tagline: data.footer_tagline ?? '',
          footer_tagline_id: data.footer_tagline_id ?? '',
          status_left: data.status_left ?? '',
          status_left_id: data.status_left_id ?? '',
          status_right: data.status_right ?? '',
          status_right_id: data.status_right_id ?? '',
        })
      })
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false))
  }, [])

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

      const [enDesc, enMeta, enTagline] = await Promise.all([
        formData.site_description_id ? translateField(formData.site_description_id) : Promise.resolve(formData.site_description),
        formData.hero_meta_id ? translateField(formData.hero_meta_id) : Promise.resolve(formData.hero_meta),
        formData.footer_tagline_id ? translateField(formData.footer_tagline_id) : Promise.resolve(formData.footer_tagline),
      ])

      setFormData((prev) => ({
        ...prev,
        site_description: enDesc || prev.site_description,
        hero_meta: enMeta || prev.hero_meta,
        footer_tagline: enTagline || prev.footer_tagline,
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
    setSaving(true)
    try {
      const payload = {
        ...formData,
        site_description: formData.site_description || formData.site_description_id,
        site_description_id: formData.site_description_id || formData.site_description,
        hero_meta: formData.hero_meta || formData.hero_meta_id,
        hero_meta_id: formData.hero_meta_id || formData.hero_meta,
        footer_tagline: formData.footer_tagline || formData.footer_tagline_id,
        footer_tagline_id: formData.footer_tagline_id || formData.footer_tagline,
        status_left: formData.status_left || formData.status_left_id,
        status_left_id: formData.status_left_id || formData.status_left,
        status_right: formData.status_right || formData.status_right_id,
        status_right_id: formData.status_right_id || formData.status_right,
      }

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      toast.success('Settings saved')
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const currentPassword = (form.elements.namedItem('current_password') as HTMLInputElement).value
    const newPassword = (form.elements.namedItem('new_password') as HTMLInputElement).value
    const confirmPassword = (form.elements.namedItem('confirm_password') as HTMLInputElement).value

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      if (res.ok) {
        toast.success('Password changed successfully')
        form.reset()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to change password')
      }
    } catch {
      toast.error('Failed to change password')
    }
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage site configuration with bilingual support</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Site Information</CardTitle>
                  <CardDescription>Content shown across the portfolio</CardDescription>
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
                  disabled={isTranslating || (!formData.site_description_id && !formData.hero_meta_id && !formData.footer_tagline_id)}
                  className="w-full text-xs font-mono gap-1.5 h-8"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {isTranslating ? 'Translating ID to EN...' : 'Auto-Translate ID to EN'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground text-center py-8">Loading...</p>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="site_title">Site Title</Label>
                    <Input
                      id="site_title"
                      value={formData.site_title}
                      onChange={(e) => setFormData({ ...formData, site_title: e.target.value })}
                    />
                  </div>

                  {activeLangTab === 'id' ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="site_description_id">Deskripsi Situs (ID)</Label>
                        <Textarea
                          id="site_description_id"
                          value={formData.site_description_id}
                          onChange={(e) => setFormData({ ...formData, site_description_id: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hero_meta_id">Hero Meta Line (ID)</Label>
                        <Input
                          id="hero_meta_id"
                          placeholder="pengembang web junior · flutter, react & laravel · siap bekerja"
                          value={formData.hero_meta_id}
                          onChange={(e) => setFormData({ ...formData, hero_meta_id: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="footer_tagline_id">Tagline Footer (ID)</Label>
                        <Input
                          id="footer_tagline_id"
                          placeholder="mengubah masalah menjadi solusi"
                          value={formData.footer_tagline_id}
                          onChange={(e) => setFormData({ ...formData, footer_tagline_id: e.target.value })}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="site_description">Site Description (EN)</Label>
                        <Textarea
                          id="site_description"
                          value={formData.site_description}
                          onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hero_meta">Hero Meta Line (EN)</Label>
                        <Input
                          id="hero_meta"
                          placeholder="junior software developer · flutter, react & laravel · open to work"
                          value={formData.hero_meta}
                          onChange={(e) => setFormData({ ...formData, hero_meta: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="footer_tagline">Footer Tagline (EN)</Label>
                        <Input
                          id="footer_tagline"
                          placeholder="turning problems into solutions"
                          value={formData.footer_tagline}
                          onChange={(e) => setFormData({ ...formData, footer_tagline: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="status_left">Status Bar (Left)</Label>
                      <Input
                        id="status_left"
                        value={formData.status_left}
                        onChange={(e) => setFormData({ ...formData, status_left: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status_right">Status Bar (Right)</Label>
                      <Input
                        id="status_right"
                        value={formData.status_right}
                        onChange={(e) => setFormData({ ...formData, status_right: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Settings'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your admin password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current_password">Current Password</Label>
                  <Input id="current_password" name="current_password" type="password" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new_password">New Password</Label>
                  <Input id="new_password" name="new_password" type="password" minLength={6} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirm Password</Label>
                  <Input id="confirm_password" name="confirm_password" type="password" minLength={6} required />
                </div>

                <Button type="submit" className="w-full">Change Password</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
