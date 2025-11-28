'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authAPI } from '@/lib/api'
import { useStore } from '@/lib/store'

export default function Login() {
  const router = useRouter()
  const setUser = useStore((state) => state.setUser)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authAPI.login(email.toLowerCase(), password)
      if (response.data?.token && response.data?.user) {
        localStorage.setItem('token', response.data.token)
        setUser(response.data.user)
        setTimeout(() => router.push('/dashboard'), 100)
      } else {
        setError('Invalid response from server')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      const message = err.response?.data?.message || err.message || 'Login failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-color,#faf8f5)] transition-colors duration-[2000ms] flex items-center justify-center p-4" style={{ fontFamily: 'var(--font-family, Inter, sans-serif)' }}>
      <div className="bg-[var(--surface-color,white)] p-6 md:p-8 rounded-2xl border border-[var(--accent-color)]/30 w-full max-w-md relative transition-colors duration-[2000ms] shadow-lg">
        <Link href="/" className="absolute top-6 left-6 text-[var(--text-color)]/40 hover:text-[var(--text-color)]/60 transition-colors">
          ← Back
        </Link>
        <div className="text-center mb-8">
          <svg className="w-16 h-16 mx-auto mb-3 text-[var(--accent-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h1 className="text-4xl font-bold text-[var(--accent-color)]">Drafty</h1>
          <p className="text-[var(--text-color)] mt-2">Welcome back!</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-color)] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[var(--accent-color)]/30 rounded-xl focus:outline-none focus:border-[var(--accent-color)] transition-all bg-[var(--bg-color,white)] shadow-sm"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-color)] mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[var(--accent-color)]/30 rounded-xl focus:outline-none focus:border-[var(--accent-color)] transition-all bg-[var(--bg-color,white)] shadow-sm"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--accent-color)] text-white py-3 rounded-xl hover:opacity-90 disabled:opacity-50 font-semibold transition-all transform hover:scale-[1.02] shadow-md"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-[var(--text-color)]/70 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[var(--accent-color)] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
