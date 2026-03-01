'use client'

import { useEffect, useState } from 'react'
import { AppShell } from '../../components/AppShell'
import { Button, Card, SectionTitle, Select } from '../../components/ui'
import { useLocale } from '../../lib/useLocale'
import { useSettings } from '../../store/settings'
import { clearClientCache } from '../../data/econtrol.api'
import type { FuelType } from '../../domain/types'
import Link from 'next/link'

export default function SettingsPage() {
  const { t, locale, setLocale } = useLocale()
  const { defaultFuel, setDefaultFuel, load } = useSettings()
  const [message, setMessage] = useState('')

  useEffect(() => {
    load()
  }, [load])

  const onClearCache = () => {
    clearClientCache()
    setMessage(t('cacheCleared'))
    setTimeout(() => setMessage(''), 2000)
  }

  return (
    <AppShell>
      <div className="pt-6">
        <div className="mb-4 rounded-3xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-5 shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <SectionTitle>{t('settings')}</SectionTitle>
        </div>
        <div className="grid gap-4">
          <Card>
            <div className="text-sm text-zinc-600 dark:text-zinc-300">{t('defaultFuel')}</div>
            <Select value={defaultFuel} onChange={(e) => setDefaultFuel(e.target.value as FuelType)} className="mt-2">
              <option value="DIE">Diesel</option>
              <option value="SUP">Super</option>
              <option value="GAS">Gas</option>
            </Select>
          </Card>

          <Card>
            <div className="text-sm text-zinc-600 dark:text-zinc-300">{t('language')}</div>
            <Select value={locale} onChange={(e) => setLocale(e.target.value as any)} className="mt-2">
              <option value="en">English</option>
              <option value="ar">العربية</option>
              <option value="de">Deutsch</option>
              <option value="hi">हिन्दी</option>
            </Select>
          </Card>

          <Card>
            <Button onClick={onClearCache}>{t('clearCache')}</Button>
            {message && <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{message}</div>}
          </Card>

          <Card>
            <Link href="/about" className="text-sm text-zinc-600 dark:text-zinc-300">
              {t('about')}
            </Link>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
