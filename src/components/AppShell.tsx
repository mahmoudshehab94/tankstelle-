'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useLocale } from '../lib/useLocale'
import { Container, Select } from './ui'

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t, locale, setLocale } = useLocale()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-2xl border border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-200"
              aria-label="menu"
            >
              ☰
            </button>
            <div className="h-9 w-9 rounded-2xl bg-zinc-900 text-white grid place-items-center text-xs font-semibold dark:bg-white dark:text-zinc-900">TS</div>
            <div>
              <div className="text-base font-semibold">{t('appName')}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Austria Fuel Prices</div>
            </div>
          </div>
          <div className="w-24">
            <Select value={locale} onChange={(e) => setLocale(e.target.value as any)}>
              <option value="en">English</option>
              <option value="ar">العربية</option>
              <option value="de">Deutsch</option>
              <option value="hi">हिन्दी</option>
            </Select>
          </div>
        </div>
      </header>

      <Container>
        {children}
        <div className="mt-10 text-center text-xs text-zinc-500 dark:text-zinc-400">Copyright © Mahmoud Shehab</div>
      </Container>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white p-5 shadow-xl dark:bg-zinc-950">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">{t('appName')}</div>
              <button onClick={() => setOpen(false)} className="text-sm text-zinc-500">✕</button>
            </div>
            <nav className="mt-6 grid gap-2 text-sm">
              <Link className={pathname === '/' ? 'text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-300'} href="/">{t('nearMe')}</Link>
              <Link className={pathname === '/region' ? 'text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-300'} href="/region">{t('region')}</Link>
              <Link className={pathname === '/favorites' ? 'text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-300'} href="/favorites">{t('favorites')}</Link>
              <Link className={pathname === '/settings' ? 'text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-300'} href="/settings">{t('settings')}</Link>
            </nav>
          </aside>
        </div>
      )}
    </div>
  )
}
