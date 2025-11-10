import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Discipline Dashboard',
  description: 'Track your habits and stay disciplined',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
