'use client'

import { useEffect, useRef } from 'react'
import { GasStation } from '../domain/types'

export function StationMap({
  stations,
  userLocation,
  onSelect,
}: {
  stations: GasStation[]
  userLocation?: { latitude: number; longitude: number }
  onSelect: (station: GasStation) => void
}) {
  const mapRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const markersRef = useRef<any>(null)
  const leafletRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    let mounted = true
    import('leaflet').then((L) => {
      if (!mounted) return
      const el = containerRef.current
      if (!el) return
      leafletRef.current = L
      L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.9.4/dist/images/'
      mapRef.current = L.map(el).setView([48.2082, 16.3738], 12)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current)
      markersRef.current = L.layerGroup().addTo(mapRef.current)
    })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    const L = leafletRef.current
    if (!mapRef.current || !markersRef.current || !L) return
    markersRef.current.clearLayers()

    if (userLocation) {
      const userMarker = L.circleMarker([userLocation.latitude, userLocation.longitude], {
        radius: 6,
        color: '#0f172a',
        fillColor: '#0f172a',
        fillOpacity: 0.9,
      })
      userMarker.addTo(markersRef.current)
    }

    stations.forEach((s) => {
      const marker = L.marker([s.latitude, s.longitude])
      marker.on('click', () => onSelect(s))
      marker.addTo(markersRef.current)
    })

    if (userLocation) {
      mapRef.current.setView([userLocation.latitude, userLocation.longitude], 12)
    } else if (stations[0]) {
      mapRef.current.setView([stations[0].latitude, stations[0].longitude], 12)
    }
  }, [stations, userLocation, onSelect])

  return <div ref={containerRef} className="h-full w-full rounded-2xl" />
}
