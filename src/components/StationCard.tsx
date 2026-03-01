import { GasStation } from '../domain/types'
import { detectBrand, formatDistance } from '../domain/utils'
import { getNavigateUrl } from '../domain/navigation'
import { Badge } from './Badge'
import { Button } from './ui'

export function StationCard({
  station,
  distanceMeters,
  isFavorite,
  onToggleFavorite,
  t,
}: {
  station: GasStation
  distanceMeters?: number
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  t: (key: string) => string
}) {
  const brand = detectBrand(station)
  const navigateUrl = getNavigateUrl(station.latitude, station.longitude, station.name)

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {station.name || brand || '—'}
            </div>
            {station.isClosed && <Badge>{t('closed')}</Badge>}
          </div>
          <div className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">{station.address || '-'}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {brand && <Badge>{brand}</Badge>}
            {distanceMeters !== undefined && <Badge>{formatDistance(distanceMeters)}</Badge>}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">€ {station.price.toFixed(3)}</div>
          <div className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">{t('lastUpdate')}: {station.lastUpdate || '-'}</div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <a href={navigateUrl} className="text-sm text-zinc-600 dark:text-zinc-300" target="_blank" rel="noreferrer">
          {t('navigate')}
        </a>
        <Button variant={isFavorite ? 'primary' : 'secondary'} size="sm" onClick={() => onToggleFavorite(station.id)}>
          {isFavorite ? '★' : '☆'}
        </Button>
      </div>
    </div>
  )
}
