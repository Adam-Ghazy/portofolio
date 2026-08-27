'use client';

import { FormField, FormInput, FormTextarea } from '@/components/admin/FormField';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import type { Tab, FormErrors } from '@/types/admin';

interface AdminFormsProps {
  tab: Tab;
  form: any;
  formErrors: FormErrors;
  uploading: boolean;
  onFormChange: (updates: any) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AdminForms({ tab, form, formErrors, uploading, onFormChange, onFileUpload }: AdminFormsProps) {
  if (tab === 'sections') {
    return (
      <div className="space-y-4">
        <FormField label="SLUG" hint="Identifier unik" error={formErrors.slug}>
          <FormInput
            value={form.slug || ''}
            onChange={(v) => onFormChange({ slug: v })}
            placeholder="hero, about, contact..."
            error={!!formErrors.slug}
          />
        </FormField>
        <FormField label="TITLE" hint="Judul section" error={formErrors.title}>
          <FormInput
            value={form.title || ''}
            onChange={(v) => onFormChange({ title: v })}
            placeholder="Judul section"
            error={!!formErrors.title}
          />
        </FormField>
        <FormField label="SUBTITLE" hint="Deskripsi singkat">
          <FormInput
            value={form.subtitle || ''}
            onChange={(v) => onFormChange({ subtitle: v })}
            placeholder="Subtitle / deskripsi"
          />
        </FormField>
        <FormField label="CONTENT" hint="JSON untuk cards">
          <FormTextarea
            value={form.content || ''}
            onChange={(v) => onFormChange({ content: v })}
            placeholder='[{"title":"...","desc":"..."}]'
            rows={5}
            className="font-mono text-xs"
          />
        </FormField>
        <FormField label="SORT ORDER">
          <FormInput
            type="number"
            value={form.sort_order || 0}
            onChange={(v) => onFormChange({ sort_order: parseInt(v) })}
            placeholder="0"
          />
        </FormField>
      </div>
    );
  }

  if (tab === 'projects') {
    return (
      <div className="space-y-4">
        <FormField label="TITLE" hint="Nama project" error={formErrors.title}>
          <FormInput
            value={form.title || ''}
            onChange={(v) => onFormChange({ title: v })}
            placeholder="FoodLAB - Campus Food Ordering Platform"
            error={!!formErrors.title}
          />
        </FormField>
        <FormField label="DESCRIPTION" hint="Penjelasan project" error={formErrors.description}>
          <FormTextarea
            value={form.description || ''}
            onChange={(v) => onFormChange({ description: v })}
            placeholder="Deskripsi project..."
            rows={4}
            error={!!formErrors.description}
          />
        </FormField>
        <FormField label="IMAGE" hint="Upload gambar">
          <div className="flex items-center gap-3">
            <label className="flex-1">
              <Button variant="outline" className="w-full" disabled={uploading} asChild>
                <span className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Upload...' : 'Pilih gambar'}
                </span>
              </Button>
              <input type="file" onChange={onFileUpload} className="hidden" accept="image/*" />
            </label>
            {form.image_url && (
              <img
                src={form.image_url}
                className="w-16 h-16 rounded-lg object-cover border"
                alt="preview"
              />
            )}
          </div>
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="YEAR">
            <FormInput
              value={form.year || ''}
              onChange={(v) => onFormChange({ year: v })}
              placeholder="2024"
            />
          </FormField>
          <FormField label="ROLE">
            <FormInput
              value={form.role || ''}
              onChange={(v) => onFormChange({ role: v })}
              placeholder="Mobile App Developer"
            />
          </FormField>
        </div>
        <FormField label="TAGS" hint="Pisahkan dengan koma">
          <FormInput
            value={form.tags || ''}
            onChange={(v) => onFormChange({ tags: v })}
            placeholder="Flutter, Dart, REST API"
          />
        </FormField>
        <FormField label="LINK" error={formErrors.link}>
          <FormInput
            value={form.link || ''}
            onChange={(v) => onFormChange({ link: v })}
            placeholder="https://..."
            error={!!formErrors.link}
          />
        </FormField>
      </div>
    );
  }


  if (tab === 'skills') {
    return (
      <div className="space-y-4">
        <FormField label="SKILL NAME" hint="Nama skill / teknologi" error={formErrors.title}>
          <FormInput
            value={form.title || ''}
            onChange={(v) => onFormChange({ title: v })}
            placeholder="Flutter, Laravel, React.js, MySQL..."
            error={!!formErrors.title}
          />
        </FormField>
        <FormField label="CATEGORY" hint="Programming & Development, Backend & API, Database, Tools, Soft Skills" error={formErrors.description}>
          <FormInput
            value={form.description || ''}
            onChange={(v) => onFormChange({ description: v })}
            placeholder="Programming & Development"
            error={!!formErrors.description}
          />
        </FormField>
      </div>
    );
  }

  if (tab === 'stats') {
    return (
      <div className="space-y-4">
        <FormField label="VALUE" hint="Angka atau persentase" error={formErrors.value}>
          <FormInput
            value={form.value || ''}
            onChange={(v) => onFormChange({ value: v })}
            placeholder="12+"
            error={!!formErrors.value}
          />
        </FormField>
        <FormField label="LABEL" hint="Deskripsi statistik" error={formErrors.label}>
          <FormInput
            value={form.label || ''}
            onChange={(v) => onFormChange({ label: v })}
            placeholder="projects built"
            error={!!formErrors.label}
          />
        </FormField>
      </div>
    );
  }

  if (tab === 'settings') {
    return (
      <div className="space-y-4">
        {Object.entries(form).map(([key, value]) => (
          <FormField key={key} label={key.toUpperCase().replace(/_/g, ' ')}>
            <FormInput
              value={value as string}
              onChange={(v) => onFormChange({ [key]: v })}
              placeholder={key}
            />
          </FormField>
        ))}
      </div>
    );
  }

  return null;
}
