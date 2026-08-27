import type { Tab, FormErrors } from '@/types/admin';

export function validateForm(tab: Tab, form: any): FormErrors {
  const errors: FormErrors = {};

  if (tab === 'sections') {
    if (!form.slug?.trim()) errors.slug = 'Slug wajib diisi';
    if (!form.title?.trim()) errors.title = 'Title wajib diisi';
  }

  if (tab === 'projects') {
    if (!form.title?.trim()) errors.title = 'Title wajib diisi';
    if (!form.description?.trim()) errors.description = 'Description wajib diisi';
    if (form.link && !isValidUrl(form.link)) errors.link = 'URL tidak valid';
  }


  if (tab === 'skills') {
    if (!form.title?.trim()) errors.title = 'Title wajib diisi';
    if (!form.description?.trim()) errors.description = 'Description wajib diisi';
  }

  if (tab === 'stats') {
    if (!form.value?.trim()) errors.value = 'Value wajib diisi';
    if (!form.label?.trim()) errors.label = 'Label wajib diisi';
  }

  return errors;
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function sanitizeInput(value: string): string {
  return value.trim().replace(/[<>]/g, '');
}
