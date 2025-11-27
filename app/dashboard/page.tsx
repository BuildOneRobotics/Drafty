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

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    loadNotes()
  }, [router, loadNotes])

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
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-indigo-600">Drafty</h1>
          <p className="text-sm text-gray-600 mt-2">{user?.email}</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <NoteList notes={notes} selectedNote={selectedNote} onSelectNote={setSelectedNote} />
        </div>

        <div className="p-4 border-t space-y-2">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {syncing ? 'Syncing...' : 'Sync'}
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <NoteEditor note={selectedNote} onSave={loadNotes} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-500 text-lg mb-4">No notes yet</p>
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
                className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
              >
                Create First Note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
