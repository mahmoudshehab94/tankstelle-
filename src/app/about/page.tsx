'use client'

import { AppShell } from '../../components/AppShell'
import { Card, SectionTitle } from '../../components/ui'
import { useLocale } from '../../lib/useLocale'

export default function AboutPage() {
  const { t } = useLocale()
  return (
    <AppShell>
      <div className="pt-6">
        <div className="mb-4 rounded-3xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-5 shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <SectionTitle>{t('about')}</SectionTitle>
        </div>
        <Card>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">{t('aboutText')}</p>
        </Card>
      </div>
    </AppShell>
  )
}
