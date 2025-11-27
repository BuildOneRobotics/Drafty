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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Drafty</h1>
          <div className="flex gap-3">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all font-medium">
              Login
            </Link>
            <Link href="/signup" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 font-medium shadow-md transition-all">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="text-7xl mb-6">📝</div>
          <h2 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Capture Your Ideas
          </h2>
          <p className="text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Create, organize, and manage your notes seamlessly. Simple, fast, and beautiful.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 inline-block font-semibold shadow-xl transition-all transform hover:scale-105">
              ✨ Get Started Free
            </Link>
            <Link href="/login" className="border-2 border-indigo-600 text-indigo-600 px-10 py-4 rounded-xl hover:bg-indigo-50 inline-block font-semibold transition-all transform hover:scale-105">
              🚀 Sign In
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
            <div className="text-5xl mb-4">✏️</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Create Ideas</h3>
            <p className="text-gray-600 leading-relaxed">Quickly capture and organize your thoughts in a beautiful, distraction-free editor</p>
          </div>
          <div className="bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
            <div className="text-5xl mb-4">🔄</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Auto Sync</h3>
            <p className="text-gray-600 leading-relaxed">Your notes sync automatically and securely across all your devices</p>
          </div>
          <div className="bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Lightning Fast</h3>
            <p className="text-gray-600 leading-relaxed">Built for speed with instant search and seamless performance</p>
          </div>
        </div>
      </div>
    </div>
  )
}
