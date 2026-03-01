import { useEffect, useState } from 'react'
import { defaultLocale, Locale, translations } from './i18n'

const STORAGE_KEY = 'tankstelle:locale'

export function useLocale() {
  const [locale, setLocale] = useState<Locale>(defaultLocale)

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? (localStorage.getItem(STORAGE_KEY) as Locale | null) : null
    if (stored && translations[stored]) setLocale(stored)
  }, [])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.lang = locale
    }
  }, [locale])

  const t = (key: string) => translations[locale][key] || translations[defaultLocale][key] || key

  const set = (next: Locale) => {
    setLocale(next)
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, next)
  }

  return { locale, setLocale: set, t }
}
