'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { notesAPI, authAPI } from '@/lib/api'
import Navbar from '@/components/Navbar'
import LoadingScreen from '@/components/LoadingScreen'
import DashboardContent from './dashboard-content'

export default function Dashboard() {
  const router = useRouter()
  const user = useStore((state) => state.user)
  const setUser = useStore((state) => state.setUser)
  const notes = useStore((state) => state.notes)
  const setNotes = useStore((state) => state.setNotes)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      handleSync()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadNotes = async () => {
    try {
      const response = await notesAPI.getNotes()
      setNotes(response.data)
    } catch (error) {
      console.error('Failed to load notes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const { loadTheme } = require('@/lib/theme')
    loadTheme()
    loadNotes()
    
    authAPI.getMe().then(response => {
      setUser(response.data)
    }).catch(() => {
      router.push('/login')
    })
  }, [])

  const handleSync = async () => {
    if (syncing) return
    setSyncing(true)
    try {
      await notesAPI.syncNotes()
      await loadNotes()
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      setSyncing(false)
    }
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="flex flex-col h-screen bg-[var(--bg-color,#faf8f5)] transition-colors duration-[2000ms]" style={{ fontFamily: 'var(--font-family, Inter, sans-serif)' }}>
      <Navbar />
      <DashboardContent notes={notes} onLoadNotes={loadNotes} user={user} syncing={syncing} />
      <footer className="bg-[var(--accent-color)]/20 border-t border-[var(--accent-color)]/30 py-6 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-[var(--text-color)] space-y-2 md:space-y-0">
          <div className="flex gap-4">
            <a href="/" className="hover:text-[var(--accent-color)]">Home</a>
            <a href="/settings" className="hover:text-[var(--accent-color)]">Settings</a>
            <a href="https://github.com/BuildOneRobotics/Drafty" target="_blank" className="hover:text-[var(--accent-color)]">GitHub</a>
          </div>
          <div>© 2024 Drafty • CC BY-NC 4.0 License</div>
        </div>
      </footer>
    </div>
  )
}
