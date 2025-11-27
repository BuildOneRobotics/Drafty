'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-[#faf8f5] border-b border-[#e8d5c4] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">📝</span>
            <span className="text-xl font-bold text-[#c17d4a]">Drafty</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              href="/dashboard"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                pathname === '/dashboard'
                  ? 'bg-[#c17d4a] text-white'
                  : 'text-[#8b6f47] hover:bg-[#f5ebe1]'
              }`}
            >
              🏠 Home
            </Link>
            <Link
              href="/settings"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                pathname === '/settings'
                  ? 'bg-[#c17d4a] text-white'
                  : 'text-[#8b6f47] hover:bg-[#f5ebe1]'
              }`}
            >
              ⚙️ Settings
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
