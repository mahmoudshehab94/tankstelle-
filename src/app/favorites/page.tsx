'use client'

import { useEffect, useMemo } from 'react'
import { AppShell } from '../../components/AppShell'
import { Card, SectionTitle } from '../../components/ui'
import { StationCard } from '../../components/StationCard'
import { useLocale } from '../../lib/useLocale'
import { useFavorites } from '../../store/favorites'
import { loadCachedStations } from '../../data/favorites'

export default function FavoritesPage() {
  const { t } = useLocale()
  const { favorites, toggle, load } = useFavorites()

  useEffect(() => {
    load()
  }, [load])

  const cachedStations = useMemo(() => loadCachedStations(), [])
  const favoriteStations = cachedStations.filter((s) => favorites.includes(s.id))

  return (
    <AppShell>
      <div className="pt-6">
        <div className="mb-4 rounded-3xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-50 p-5 shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <SectionTitle>{t('favorites')}</SectionTitle>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">{favoriteStations.length} {t('results')}</div>
        </div>
        {favoriteStations.length === 0 && (
          <Card>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">{t('favoritesEmpty')}</div>
          </Card>
        )}
        <div className="mt-4 grid gap-3">
          {favoriteStations.map((station) => (
            <StationCard key={station.id} station={station} isFavorite={favorites.includes(station.id)} onToggleFavorite={toggle} t={t} />
          ))}
        </div>
      </div>
    </AppShell>
  )
}
