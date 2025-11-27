'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore, Note } from '@/lib/store'
import { notesAPI } from '@/lib/api'
import NoteEditor from '@/components/NoteEditor'
import NoteList from '@/components/NoteList'
import Navbar from '@/components/Navbar'

export default function Dashboard() {
  const router = useRouter()
  const user = useStore((state) => state.user)
  const notes = useStore((state) => state.notes)
  const setNotes = useStore((state) => state.setNotes)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      handleSync()
    }, 30000)
    return () => clearInterval(interval)
  }, [])
  const [activeTab, setActiveTab] = useState<'notes' | 'notebooks' | 'flashcards'>('notes')
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
    return (
      <div className="flex items-center justify-center h-screen bg-[#faf8f5]">
        <div className="animate-pulse text-[#c17d4a] text-2xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-[#faf8f5]">
      <Navbar />
      
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed bottom-4 right-4 z-50 bg-gradient-to-r from-[#c17d4a] to-[#d4956f] text-white p-4 rounded-full shadow-2xl"
      >
        {sidebarOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
      </button>

      <div className="flex flex-1 overflow-hidden relative">
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative w-80 bg-white shadow-2xl flex flex-col border-r border-[#e8d5c4] z-40 transition-transform duration-300 h-full`}>
          <div className="p-6 border-b bg-gradient-to-r from-[#c17d4a] to-[#d4956f]">
            <p className="text-sm text-[#faf8f5]">{user?.email}</p>
          </div>

          <div className="flex border-b border-[#e8d5c4] bg-[#f5ebe1]">
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-3 text-xs md:text-sm font-medium transition-all ${
                activeTab === 'notes'
                  ? 'bg-white text-[#c17d4a] border-b-2 border-[#c17d4a]'
                  : 'text-[#8b6f47] hover:bg-white/50'
              }`}
            >
              Notes
            </button>
            <button
              onClick={() => setActiveTab('notebooks')}
              className={`flex-1 py-3 text-xs md:text-sm font-medium transition-all ${
                activeTab === 'notebooks'
                  ? 'bg-white text-[#c17d4a] border-b-2 border-[#c17d4a]'
                  : 'text-[#8b6f47] hover:bg-white/50'
              }`}
            >
              Books
            </button>
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`flex-1 py-3 text-xs md:text-sm font-medium transition-all ${
                activeTab === 'flashcards'
                  ? 'bg-white text-[#c17d4a] border-b-2 border-[#c17d4a]'
                  : 'text-[#8b6f47] hover:bg-white/50'
              }`}
            >
              Cards
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === 'notes' && (
              <NoteList notes={notes} selectedNote={selectedNote} onSelectNote={(note) => {
                setSelectedNote(note)
                setSidebarOpen(false)
              }} />
            )}
            {activeTab === 'notebooks' && (
              <div className="p-4 space-y-3">
                {['Math', 'Science', 'History', 'English'].map((subject) => (
                  <div
                    key={subject}
                    className="p-4 bg-[#f5ebe1] rounded-2xl border border-[#e8d5c4] hover:shadow-xl hover:scale-105 transition-all transform cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-[#4a3f35]">{subject}</h3>
                        <p className="text-xs text-[#8b6f47]">0 notes</p>
                      </div>
                      <svg className="w-8 h-8 text-[#c17d4a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'flashcards' && (
              <div className="p-4 space-y-3">
                {['Vocabulary', 'Formulas', 'Dates'].map((deck) => (
                  <div
                    key={deck}
                    className="p-4 bg-[#f5ebe1] rounded-2xl border border-[#e8d5c4] hover:shadow-xl hover:scale-105 transition-all transform cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-[#4a3f35]">{deck}</h3>
                        <p className="text-xs text-[#8b6f47]">0 cards</p>
                      </div>
                      <svg className="w-8 h-8 text-[#c17d4a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-[#f5ebe1]">
            <div className="text-center text-xs text-[#8b6f47]">
              {syncing ? 'Syncing...' : 'Auto-sync enabled'}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedNote ? (
            <NoteEditor note={selectedNote} onSave={loadNotes} />
          ) : (
            <div className="flex items-center justify-center h-full bg-white p-4">
              <div className="text-center animate-fade-in">
                <svg className="w-20 h-20 md:w-28 md:h-28 mx-auto mb-6 text-[#c17d4a] animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-[#8b6f47] text-xl md:text-2xl mb-8">No notes yet</p>
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
                  className="bg-gradient-to-r from-[#c17d4a] to-[#d4956f] text-white px-8 md:px-10 py-3 md:py-4 rounded-2xl hover:from-[#a86a3d] hover:to-[#c17d4a] font-semibold shadow-xl transition-all transform hover:scale-110"
                >
                  Create First Note
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
