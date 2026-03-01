'use client'

import { usePathname } from 'next/navigation'
import { useLocale } from '../lib/useLocale'
import { Container, NavLink, Select } from './ui'

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t, locale, setLocale } = useLocale()
  const pathname = usePathname()
  return (
    <div className="min-h-screen pb-16">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-zinc-900 text-white grid place-items-center text-xs font-semibold dark:bg-white dark:text-zinc-900">TS</div>
            <div>
              <div className="text-base font-semibold">{t('appName')}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Austria Fuel Prices</div>
            </div>
          </div>
          <div className="w-28">
            <Select value={locale} onChange={(e) => setLocale(e.target.value as any)}>
              <option value="en">EN</option>
              <option value="ar">AR</option>
              <option value="de">DE</option>
              <option value="hi">HI</option>
            </Select>
          </div>
        </div>
      </header>
      <Container>
        {children}
        <div className="mt-10 text-center text-xs text-zinc-500 dark:text-zinc-400">Copyright © Mahmoud Shehab</div>
      </Container>
      <nav className="fixed bottom-0 left-0 right-0 border-t border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex max-w-6xl items-center justify-around px-4 py-2 lg:px-6">
          <NavLink href="/" label={t('nearMe')} active={pathname === '/'} />
          <NavLink href="/region" label={t('region')} active={pathname === '/region'} />
          <NavLink href="/favorites" label={t('favorites')} active={pathname === '/favorites'} />
          <NavLink href="/settings" label={t('settings')} active={pathname === '/settings'} />
        </div>
      </nav>
    </div>
  )
}
