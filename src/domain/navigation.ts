export function getNavigateUrl(lat: number, lon: number, label?: string) {
  if (typeof window === 'undefined') return '#'
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const encoded = encodeURIComponent(label || 'Fuel Station')
  if (isIOS) return `http://maps.apple.com/?ll=${lat},${lon}&q=${encoded}`
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`
}
