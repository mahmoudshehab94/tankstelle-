import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tankstelle',
  description: 'Austria fuel prices from E-Control',
  manifest: '/manifest.json',
}

export const viewport = {
  themeColor: '#0f172a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-zinc-50 text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
        {children}
      </body>
    </html>
  )
}
