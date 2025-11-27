'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (isLoggedIn) {
    router.push('/dashboard')
    return null
  }

  return (
    <div className="min-h-screen bg-[var(--bg-color,#faf8f5)] transition-colors duration-[2000ms] flex flex-col" style={{ fontFamily: 'var(--font-family, Inter, sans-serif)' }}>
      <nav className="bg-white border-b border-[var(--accent-color)]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-[var(--accent-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h1 className="text-2xl font-bold text-[var(--accent-color)]">Drafty</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/login" className="text-[var(--text-color)] hover:text-[var(--accent-color)] px-4 py-2 rounded-lg hover:bg-[var(--accent-color)]/10 transition-all font-medium">
              Login
            </Link>
            <Link href="/signup" className="bg-[var(--accent-color)] text-white px-6 py-2 rounded-lg hover:opacity-90 font-medium transition-all">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-16">
            <svg className="w-24 h-24 mx-auto mb-6 text-[var(--accent-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-5xl md:text-6xl font-bold text-[var(--text-color)] mb-6">
              Capture Your Ideas
            </h2>
            <p className="text-xl md:text-2xl text-[var(--text-color)]/70 mb-10 max-w-3xl mx-auto">
              Create, organize, and manage your notes seamlessly. Simple, fast, and beautiful.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="bg-[var(--accent-color)] text-white px-10 py-4 rounded-xl hover:opacity-90 inline-block font-semibold transition-all transform hover:scale-105">
                Get Started Free
              </Link>
              <Link href="/login" className="border-2 border-[var(--accent-color)] text-[var(--accent-color)] px-10 py-4 rounded-xl hover:bg-[var(--accent-color)]/10 inline-block font-semibold transition-all transform hover:scale-105">
                Sign In
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-[var(--accent-color)]/30 transition-all duration-300 transform hover:translate-y-[-4px]">
              <svg className="w-16 h-16 mx-auto mb-4 text-[var(--accent-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <h3 className="text-2xl font-bold mb-4 text-[var(--text-color)] text-center">Create Ideas</h3>
              <p className="text-[var(--text-color)]/70 leading-relaxed text-center">Quickly capture and organize your thoughts in a beautiful, distraction-free editor</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[var(--accent-color)]/30 transition-all duration-300 transform hover:translate-y-[-4px]">
              <svg className="w-16 h-16 mx-auto mb-4 text-[var(--accent-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <h3 className="text-2xl font-bold mb-4 text-[var(--text-color)] text-center">Auto Sync</h3>
              <p className="text-[var(--text-color)]/70 leading-relaxed text-center">Your notes sync automatically and securely across all your devices</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[var(--accent-color)]/30 transition-all duration-300 transform hover:translate-y-[-4px]">
              <svg className="w-16 h-16 mx-auto mb-4 text-[var(--accent-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-2xl font-bold mb-4 text-[var(--text-color)] text-center">Lightning Fast</h3>
              <p className="text-[var(--text-color)]/70 leading-relaxed text-center">Built for speed with instant search and seamless performance</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-[var(--accent-color)]/20 border-t border-[var(--accent-color)]/30 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-[var(--text-color)] text-sm">
          © 2024 Drafty. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
