'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore, Note } from '@/lib/store'
import { notesAPI } from '@/lib/api'
import NoteEditor from '@/components/NoteEditor'
import NoteList from '@/components/NoteList'

export default function Dashboard() {
  const router = useRouter()
  const user = useStore((state) => state.user)
  const notes = useStore((state) => state.notes)
  const setNotes = useStore((state) => state.setNotes)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  const loadNotes = async () => {
    try {
      const response = await notesAPI.getNotes()
      setNotes(response.data)
      if (response.data.length > 0) {
        setSelectedNote(response.data[0])
      }
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

    loadNotes()
  }, [])

  const handleSync = async () => {
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

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-72 bg-white shadow-xl flex flex-col border-r border-gray-200">
        <div className="p-6 border-b bg-gradient-to-r from-indigo-600 to-purple-600">
          <h1 className="text-2xl font-bold text-white">📝 Drafty</h1>
          <p className="text-sm text-indigo-100 mt-1">{user?.email}</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <NoteList notes={notes} selectedNote={selectedNote} onSelectNote={setSelectedNote} />
        </div>

        <div className="p-4 border-t space-y-2 bg-gray-50">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 font-medium shadow-sm transition-all"
          >
            {syncing ? '♻️ Syncing...' : '🔄 Sync Notes'}
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 font-medium transition-all"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <NoteEditor note={selectedNote} onSave={loadNotes} />
        ) : (
          <div className="flex items-center justify-center h-full bg-white">
            <div className="text-center">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-500 text-xl mb-6">No notes yet</p>
              <button
                onClick={() => {
                  const newNote: Note = {
                    id: Date.now().toString(),
                    title: 'New Note',
                    content: '',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    tags: [],
                  }
                  setSelectedNote(newNote)
                }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 font-medium shadow-lg transition-all"
              >
                ✨ Create First Note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
