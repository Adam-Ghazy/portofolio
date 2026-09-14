'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { I18nextProvider, useTranslation as useI18nTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';
import enTranslation from '@/locales/en.json';

interface LanguageContextType {
  locale: 'en' | 'id';
  setLocale: (lng: 'en' | 'id') => void;
  t: (key: string, fallback?: string) => string;
  l: (item: any, field: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (key: string, fallback?: string) => fallback || key,
  l: (item: any, field: string) => (item ? item[field] || '' : ''),
});

/**
 * Helper to resolve nested keys in static dictionary like 'sections.hero_badge'
 */
function getNestedValue(obj: any, path: string): string | undefined {
  if (!obj) return undefined;
  const parts = path.split('.');
  let curr = obj;
  for (const part of parts) {
    if (curr && typeof curr === 'object' && part in curr) {
      curr = curr[part];
    } else {
      return undefined;
    }
  }
  return typeof curr === 'string' ? curr : undefined;
}

function LanguageContextInner({ children }: { children: React.ReactNode }) {
  const { t: i18nTranslate, i18n: i18nInstance } = useI18nTranslation();
  const [mounted, setMounted] = useState(false);
  const [currentLng, setCurrentLng] = useState<'en' | 'id'>('en');

  useEffect(() => {
    setMounted(true);
    // Determine language from i18n instance or localStorage after mount
    const saved = typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') : null;
    const initialLng = (saved?.startsWith('id') || i18nInstance.language?.startsWith('id')) ? 'id' : 'en';
    setCurrentLng(initialLng);
    if (i18nInstance.language !== initialLng) {
      i18nInstance.changeLanguage(initialLng);
    }

    const handleLanguageChange = (lng: string) => {
      setCurrentLng(lng.startsWith('id') ? 'id' : 'en');
    };

    i18nInstance.on('languageChanged', handleLanguageChange);
    return () => {
      i18nInstance.off('languageChanged', handleLanguageChange);
    };
  }, [i18nInstance]);

  const setLocale = (lng: 'en' | 'id') => {
    i18nInstance.changeLanguage(lng);
    setCurrentLng(lng);
    if (typeof window !== 'undefined') {
      localStorage.setItem('i18nextLng', lng);
    }
  };

  /**
   * Safe translate function.
   * If not mounted yet (SSR & initial client hydration), always use EN dictionary
   * to guarantee 100% hydration matching between Server HTML and Client initial DOM.
   */
  const t = (key: string, fallback?: string): string => {
    if (!mounted) {
      const enVal = getNestedValue(enTranslation, key);
      return enVal || fallback || key;
    }
    const val = i18nTranslate(key, { defaultValue: fallback }) as string;
    return val || fallback || key;
  };

  /**
   * Safe dynamic record resolver.
   * If not mounted yet (SSR & initial client hydration), always returns the English field.
   */
  const l = (item: any, field: string): string => {
    if (!item) return '';

    const effectiveLng = mounted ? currentLng : 'en';
    const isId = effectiveLng === 'id';
    const valId = item[`${field}_id`];
    const valEn = item[`${field}_en`];
    const valDefault = item[field];

    if (isId) {
      if (valId && typeof valId === 'string' && valId.trim() !== '') return valId;
      if (valDefault && typeof valDefault === 'string' && valDefault.trim() !== '') return valDefault;
      if (valEn && typeof valEn === 'string' && valEn.trim() !== '') return valEn;
    } else {
      if (valEn && typeof valEn === 'string' && valEn.trim() !== '') return valEn;
      if (valDefault && typeof valDefault === 'string' && valDefault.trim() !== '') return valDefault;
      if (valId && typeof valId === 'string' && valId.trim() !== '') return valId;
    }

    return valDefault || valId || valEn || '';
  };

  const contextValue = useMemo(() => ({
    locale: mounted ? currentLng : 'en',
    setLocale,
    t,
    l,
  }), [mounted, currentLng, i18nTranslate]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <LanguageContextInner>{children}</LanguageContextInner>
    </I18nextProvider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
