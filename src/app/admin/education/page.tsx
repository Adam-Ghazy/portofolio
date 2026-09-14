'use client'

import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/layout-wrapper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Pencil, Trash2, GraduationCap, Award, Calendar, MapPin, Sparkles } from 'lucide-react'
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
import { Education, Certification } from '@/types/admin'

const emptyEduForm = {
  degree: '',
  degree_id: '',
  institution: '',
  location: '',
  period: '',
  gpa: '',
  description: '',
  description_id: '',
  sort_order: 0,
}

const emptyCertForm = {
  title: '',
  title_id: '',
  issuer: '',
  location: '',
  issue_date: '',
  credential_info: '',
  credential_info_id: '',
  sort_order: 0,
}

export default function EducationAdminPage() {
  const [activeTab, setActiveTab] = useState<'education' | 'certifications'>('education')
  
  // Education state
  const [educationList, setEducationList] = useState<Education[]>([])
  const [loadingEdu, setLoadingEdu] = useState(true)
  const [editingEdu, setEditingEdu] = useState<Education | null>(null)
  const [eduFormData, setEduFormData] = useState(emptyEduForm)
  const [deleteEduId, setDeleteEduId] = useState<number | null>(null)
  const [eduLangTab, setEduLangTab] = useState<'id' | 'en'>('id')
  const [isTranslatingEdu, setIsTranslatingEdu] = useState(false)

  // Certifications state
  const [certList, setCertList] = useState<Certification[]>([])
  const [loadingCerts, setLoadingCerts] = useState(true)
  const [editingCert, setEditingCert] = useState<Certification | null>(null)
  const [certFormData, setCertFormData] = useState(emptyCertForm)
  const [deleteCertId, setDeleteCertId] = useState<number | null>(null)
  const [certLangTab, setCertLangTab] = useState<'id' | 'en'>('id')
  const [isTranslatingCert, setIsTranslatingCert] = useState(false)

  useEffect(() => {
    fetchEducation()
    fetchCertifications()
  }, [])

  async function fetchEducation() {
    setLoadingEdu(true)
    try {
      const res = await fetch('/api/education')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setEducationList(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to load education records')
    } finally {
      setLoadingEdu(false)
    }
  }

  async function fetchCertifications() {
    setLoadingCerts(true)
    try {
      const res = await fetch('/api/certifications')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setCertList(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Failed to load certifications')
    } finally {
      setLoadingCerts(false)
    }
  }

  async function handleAutoTranslateEdu() {
    setIsTranslatingEdu(true)
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

      const [enDegree, enDesc] = await Promise.all([
        eduFormData.degree_id ? translateField(eduFormData.degree_id) : Promise.resolve(eduFormData.degree),
        eduFormData.description_id ? translateField(eduFormData.description_id) : Promise.resolve(eduFormData.description),
      ])

      setEduFormData((prev) => ({
        ...prev,
        degree: enDegree || prev.degree,
        description: enDesc || prev.description,
      }))
      toast.success('Successfully translated Indonesian to English')
    } catch {
      toast.error('Failed to auto-translate')
    } finally {
      setIsTranslatingEdu(false)
    }
  }

  async function handleAutoTranslateCert() {
    setIsTranslatingCert(true)
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

      const [enTitle, enInfo] = await Promise.all([
        certFormData.title_id ? translateField(certFormData.title_id) : Promise.resolve(certFormData.title),
        certFormData.credential_info_id ? translateField(certFormData.credential_info_id) : Promise.resolve(certFormData.credential_info),
      ])

      setCertFormData((prev) => ({
        ...prev,
        title: enTitle || prev.title,
        credential_info: enInfo || prev.credential_info,
      }))
      toast.success('Successfully translated Indonesian to English')
    } catch {
      toast.error('Failed to auto-translate')
    } finally {
      setIsTranslatingCert(false)
    }
  }

  // Handle Education Submit
  async function handleEduSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const url = editingEdu ? `/api/education/${editingEdu.id}` : '/api/education'
      const method = editingEdu ? 'PUT' : 'POST'
      const body = {
        ...eduFormData,
        degree: eduFormData.degree || eduFormData.degree_id,
        degree_id: eduFormData.degree_id || eduFormData.degree,
        description: eduFormData.description || eduFormData.description_id,
        description_id: eduFormData.description_id || eduFormData.description,
        sort_order: Number(eduFormData.sort_order) || 0,
        ...(editingEdu ? { id: editingEdu.id, is_active: editingEdu.is_active ?? 1 } : { is_active: 1 }),
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error()
      toast.success(editingEdu ? 'Education record updated' : 'Education record added')
      handleEduCancel()
      fetchEducation()
    } catch {
      toast.error('Failed to save education record')
    }
  }

  // Handle Education Delete
  async function handleEduDelete() {
    if (!deleteEduId) return
    try {
      const res = await fetch(`/api/education/${deleteEduId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Education record deleted')
      fetchEducation()
    } catch {
      toast.error('Failed to delete education record')
    } finally {
      setDeleteEduId(null)
    }
  }

  function handleEduEdit(item: Education) {
    setEditingEdu(item)
    setEduFormData({
      degree: item.degree,
      degree_id: item.degree_id ?? '',
      institution: item.institution,
      location: item.location || '',
      period: item.period || '',
      gpa: item.gpa || '',
      description: item.description || '',
      description_id: item.description_id || '',
      sort_order: item.sort_order || 0,
    })
  }

  function handleEduCancel() {
    setEditingEdu(null)
    setEduFormData(emptyEduForm)
  }

  // Handle Certifications Submit
  async function handleCertSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const url = editingCert ? `/api/certifications/${editingCert.id}` : '/api/certifications'
      const method = editingCert ? 'PUT' : 'POST'
      const body = {
        ...certFormData,
        title: certFormData.title || certFormData.title_id,
        title_id: certFormData.title_id || certFormData.title,
        credential_info: certFormData.credential_info || certFormData.credential_info_id,
        credential_info_id: certFormData.credential_info_id || certFormData.credential_info,
        sort_order: Number(certFormData.sort_order) || 0,
        ...(editingCert ? { id: editingCert.id, is_active: editingCert.is_active ?? 1 } : { is_active: 1 }),
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error()
      toast.success(editingCert ? 'Certification updated' : 'Certification added')
      handleCertCancel()
      fetchCertifications()
    } catch {
      toast.error('Failed to save certification')
    }
  }

  // Handle Certifications Delete
  async function handleCertDelete() {
    if (!deleteCertId) return
    try {
      const res = await fetch(`/api/certifications/${deleteCertId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Certification deleted')
      fetchCertifications()
    } catch {
      toast.error('Failed to delete certification')
    } finally {
      setDeleteCertId(null)
    }
  }

  function handleCertEdit(item: Certification) {
    setEditingCert(item)
    setCertFormData({
      title: item.title,
      title_id: item.title_id ?? '',
      issuer: item.issuer,
      location: item.location || '',
      issue_date: item.issue_date || '',
      credential_info: item.credential_info || '',
      credential_info_id: item.credential_info_id || '',
      sort_order: item.sort_order || 0,
    })
  }

  function handleCertCancel() {
    setEditingCert(null)
    setCertFormData(emptyCertForm)
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Education & Certifications</h1>
            <p className="text-muted-foreground">
              Manage academic degrees, universities, GPAs, and national professional certifications with bilingual support
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="education" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span>Academic Education ({educationList.length})</span>
            </TabsTrigger>
            <TabsTrigger value="certifications" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>Certifications ({certList.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* ======================= EDUCATION TAB ======================= */}
          <TabsContent value="education" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[500px_1fr]">
              {/* Education Form */}
              <Card className="h-fit">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        {editingEdu ? 'Edit Education' : 'Add Education'}
                      </CardTitle>
                      <CardDescription>
                        {editingEdu ? 'Update degree and academic institution details' : 'Add a degree or educational qualification'}
                      </CardDescription>
                    </div>

                    {/* Language Switch Tabs */}
                    <div className="flex items-center rounded-lg border p-0.5 bg-muted/40 font-mono text-xs">
                      <button
                        type="button"
                        onClick={() => setEduLangTab('id')}
                        className={`px-2.5 py-1 rounded transition-all ${
                          eduLangTab === 'id' ? 'bg-primary text-primary-foreground font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        ID
                      </button>
                      <button
                        type="button"
                        onClick={() => setEduLangTab('en')}
                        className={`px-2.5 py-1 rounded transition-all ${
                          eduLangTab === 'en' ? 'bg-primary text-primary-foreground font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'
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
                      onClick={handleAutoTranslateEdu}
                      disabled={isTranslatingEdu || (!eduFormData.degree_id && !eduFormData.description_id)}
                      className="w-full text-xs font-mono gap-1.5 h-8"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      {isTranslatingEdu ? 'Translating ID to EN...' : 'Auto-Translate ID to EN'}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleEduSubmit} className="space-y-4">
                    {eduLangTab === 'id' ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="edu-degree_id">Gelar / Jurusan (ID) *</Label>
                          <Input
                            id="edu-degree_id"
                            placeholder="contoh: Sarjana Terapan Teknik Informatika"
                            value={eduFormData.degree_id}
                            onChange={(e) => setEduFormData({ ...eduFormData, degree_id: e.target.value })}
                            required={!eduFormData.degree}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edu-description_id">Rincian Kurikulum / Peminatan (ID)</Label>
                          <Textarea
                            id="edu-description_id"
                            placeholder="Jelaskan bidang kurikulum, mata kuliah utama, fokus rekayasa..."
                            value={eduFormData.description_id}
                            onChange={(e) => setEduFormData({ ...eduFormData, description_id: e.target.value })}
                            rows={3}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="edu-degree">Degree / Major (EN) *</Label>
                          <Input
                            id="edu-degree"
                            placeholder="e.g. Bachelor of Applied Informatics Engineering"
                            value={eduFormData.degree}
                            onChange={(e) => setEduFormData({ ...eduFormData, degree: e.target.value })}
                            required={!eduFormData.degree_id}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edu-description">Curriculum / Specialization Details (EN)</Label>
                          <Textarea
                            id="edu-description"
                            placeholder="Describe key curriculum areas, coursework, thesis, or engineering focus..."
                            value={eduFormData.description}
                            onChange={(e) => setEduFormData({ ...eduFormData, description: e.target.value })}
                            rows={3}
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="edu-institution">Institution / University *</Label>
                      <Input
                        id="edu-institution"
                        placeholder="e.g. Electronic Engineering Polytechnic Institute of Surabaya (PENS)"
                        value={eduFormData.institution}
                        onChange={(e) => setEduFormData({ ...eduFormData, institution: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="edu-gpa">GPA / Grade</Label>
                        <Input
                          id="edu-gpa"
                          placeholder="e.g. 3.58 / 4.00"
                          value={eduFormData.gpa}
                          onChange={(e) => setEduFormData({ ...eduFormData, gpa: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edu-sort">Sort Order</Label>
                        <Input
                          id="edu-sort"
                          type="number"
                          placeholder="1"
                          value={eduFormData.sort_order}
                          onChange={(e) => setEduFormData({ ...eduFormData, sort_order: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="edu-period">Period / Years</Label>
                        <Input
                          id="edu-period"
                          placeholder="e.g. June 2024 - July 2025"
                          value={eduFormData.period}
                          onChange={(e) => setEduFormData({ ...eduFormData, period: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edu-location">Location</Label>
                        <Input
                          id="edu-location"
                          placeholder="e.g. Surabaya, Indonesia"
                          value={eduFormData.location}
                          onChange={(e) => setEduFormData({ ...eduFormData, location: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button type="submit" className="flex-1">
                        {editingEdu ? 'Update Education' : 'Add Education Record'}
                      </Button>
                      {editingEdu && (
                        <Button type="button" variant="outline" onClick={handleEduCancel}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Education List */}
              <Card>
                <CardHeader>
                  <CardTitle>Academic Records</CardTitle>
                  <CardDescription>{educationList.length} education entries recorded</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingEdu ? (
                    <p className="text-muted-foreground text-center py-8">Loading education records...</p>
                  ) : educationList.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No academic records found.</p>
                  ) : (
                    <div className="space-y-4">
                      {educationList.map((edu) => (
                        <div
                          key={edu.id}
                          className="p-4 rounded-xl border bg-card hover:border-primary/50 transition-colors space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-semibold text-base">{edu.degree}</h3>
                                {edu.degree_id && edu.degree_id !== edu.degree && (
                                  <span className="text-xs text-muted-foreground">({edu.degree_id})</span>
                                )}
                                {edu.gpa && (
                                  <span className="font-mono text-xs px-2 py-0.5 rounded border bg-muted/60 font-medium">
                                    GPA: {edu.gpa}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm font-medium text-muted-foreground">{edu.institution}</p>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-mono">
                                {edu.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {edu.location}
                                  </span>
                                )}
                                {edu.location && edu.period && <span>•</span>}
                                {edu.period && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {edu.period}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <Button size="icon" variant="ghost" onClick={() => handleEduEdit(edu)} title="Edit">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setDeleteEduId(edu.id!)}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {edu.description && (
                            <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t">
                              {edu.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ======================= CERTIFICATIONS TAB ======================= */}
          <TabsContent value="certifications" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[500px_1fr]">
              {/* Certification Form */}
              <Card className="h-fit">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        {editingCert ? 'Edit Certification' : 'Add Certification'}
                      </CardTitle>
                      <CardDescription>
                        {editingCert ? 'Update certification and credential details' : 'Add a professional or national certification'}
                      </CardDescription>
                    </div>

                    {/* Language Switch Tabs */}
                    <div className="flex items-center rounded-lg border p-0.5 bg-muted/40 font-mono text-xs">
                      <button
                        type="button"
                        onClick={() => setCertLangTab('id')}
                        className={`px-2.5 py-1 rounded transition-all ${
                          certLangTab === 'id' ? 'bg-primary text-primary-foreground font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        ID
                      </button>
                      <button
                        type="button"
                        onClick={() => setCertLangTab('en')}
                        className={`px-2.5 py-1 rounded transition-all ${
                          certLangTab === 'en' ? 'bg-primary text-primary-foreground font-semibold shadow-sm' : 'text-muted-foreground hover:text-foreground'
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
                      onClick={handleAutoTranslateCert}
                      disabled={isTranslatingCert || (!certFormData.title_id && !certFormData.credential_info_id)}
                      className="w-full text-xs font-mono gap-1.5 h-8"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      {isTranslatingCert ? 'Translating ID to EN...' : 'Auto-Translate ID to EN'}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleCertSubmit} className="space-y-4">
                    {certLangTab === 'id' ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="cert-title_id">Nama Sertifikasi (ID) *</Label>
                          <Input
                            id="cert-title_id"
                            placeholder="contoh: Junior Web Developer"
                            value={certFormData.title_id}
                            onChange={(e) => setCertFormData({ ...certFormData, title_id: e.target.value })}
                            required={!certFormData.title}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cert-info_id">Cakupan Kompetensi (ID)</Label>
                          <Textarea
                            id="cert-info_id"
                            placeholder="contoh: Sertifikasi kompetensi dalam rekayasa web berbasis PHP, MySQL..."
                            value={certFormData.credential_info_id}
                            onChange={(e) => setCertFormData({ ...certFormData, credential_info_id: e.target.value })}
                            rows={3}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="cert-title">Certificate Title (EN) *</Label>
                          <Input
                            id="cert-title"
                            placeholder="e.g. Junior Web Developer"
                            value={certFormData.title}
                            onChange={(e) => setCertFormData({ ...certFormData, title: e.target.value })}
                            required={!certFormData.title_id}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cert-info">Coverage & Credential Info (EN)</Label>
                          <Textarea
                            id="cert-info"
                            placeholder="e.g. Certified in PHP-based web development, relational database integration (MySQL)..."
                            value={certFormData.credential_info}
                            onChange={(e) => setCertFormData({ ...certFormData, credential_info: e.target.value })}
                            rows={3}
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="cert-issuer">Issuing Organization *</Label>
                      <Input
                        id="cert-issuer"
                        placeholder="e.g. BNSP (Badan Nasional Sertifikasi Profesi) / Digital Talent Scholarship"
                        value={certFormData.issuer}
                        onChange={(e) => setCertFormData({ ...certFormData, issuer: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="cert-date">Issue Date</Label>
                        <Input
                          id="cert-date"
                          placeholder="e.g. July 2024"
                          value={certFormData.issue_date}
                          onChange={(e) => setCertFormData({ ...certFormData, issue_date: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cert-sort">Sort Order</Label>
                        <Input
                          id="cert-sort"
                          type="number"
                          placeholder="1"
                          value={certFormData.sort_order}
                          onChange={(e) => setCertFormData({ ...certFormData, sort_order: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cert-location">Location</Label>
                      <Input
                        id="cert-location"
                        placeholder="e.g. Surabaya, Indonesia"
                        value={certFormData.location}
                        onChange={(e) => setCertFormData({ ...certFormData, location: e.target.value })}
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button type="submit" className="flex-1">
                        {editingCert ? 'Update Certification' : 'Add Certification'}
                      </Button>
                      {editingCert && (
                        <Button type="button" variant="outline" onClick={handleCertCancel}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Certifications List */}
              <Card>
                <CardHeader>
                  <CardTitle>Professional Certifications</CardTitle>
                  <CardDescription>{certList.length} certifications recorded</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingCerts ? (
                    <p className="text-muted-foreground text-center py-8">Loading certifications...</p>
                  ) : certList.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No certifications found.</p>
                  ) : (
                    <div className="space-y-4">
                      {certList.map((cert) => (
                        <div
                          key={cert.id}
                          className="p-4 rounded-xl border bg-card hover:border-primary/50 transition-colors space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-semibold text-base">{cert.title}</h3>
                                {cert.title_id && cert.title_id !== cert.title && (
                                  <span className="text-xs text-muted-foreground">({cert.title_id})</span>
                                )}
                                {cert.issue_date && (
                                  <span className="font-mono text-xs px-2 py-0.5 rounded border bg-muted/60 font-medium">
                                    {cert.issue_date}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm font-medium text-muted-foreground">{cert.issuer}</p>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-mono">
                                {cert.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {cert.location}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <Button size="icon" variant="ghost" onClick={() => handleCertEdit(cert)} title="Edit">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setDeleteCertId(cert.id!)}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {cert.credential_info && (
                            <div className="p-3 rounded-lg border bg-muted/30 text-xs text-muted-foreground leading-relaxed">
                              <span className="font-mono text-[10px] uppercase font-semibold block mb-0.5 text-foreground/80">
                                Coverage & Competency:
                              </span>
                              {cert.credential_info}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog for Education */}
        <AlertDialog open={deleteEduId !== null} onOpenChange={() => setDeleteEduId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Education Record</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this education entry? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleEduDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Confirmation Dialog for Certification */}
        <AlertDialog open={deleteCertId !== null} onOpenChange={() => setDeleteCertId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Certification</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this certification? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleCertDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  )
}
