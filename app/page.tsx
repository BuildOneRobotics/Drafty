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
          <div className="space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link href="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Capture Your Ideas, Sync Your Thoughts
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Create, organize, and manage your ideas and notes seamlessly with BuildOne integration
          </p>
          <div className="space-x-4">
            <Link href="/signup" className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 inline-block">
              Get Started
            </Link>
            <Link href="/login" className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-50 inline-block">
              Sign In
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">📝 Create Ideas</h3>
            <p className="text-gray-600">Quickly capture and organize your thoughts and ideas in one place</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">🔄 Auto Sync</h3>
            <p className="text-gray-600">Your notes sync automatically across all your devices</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">🔐 Secure Login</h3>
            <p className="text-gray-600">Sign in with Google or GitHub for secure access</p>
          </div>
        </div>
      </div>
    </div>
  )
}
