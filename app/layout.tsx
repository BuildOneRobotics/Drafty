import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Drafty - Ideas & Notes',
  description: 'Create, organize, and sync your ideas and notes with BuildOne',
  icons: {
    icon: '/favicon.svg',
  },
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
