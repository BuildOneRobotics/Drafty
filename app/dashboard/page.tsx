'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore, Note } from '@/lib/store'
import { notesAPI, authAPI } from '@/lib/api'
import NoteEditor from '@/components/NoteEditor'
import NoteList from '@/components/NoteList'
import Navbar from '@/components/Navbar'
import LoadingScreen from '@/components/LoadingScreen'

export default function Dashboard() {
  const router = useRouter()
  const user = useStore((state) => state.user)
  const setUser = useStore((state) => state.setUser)
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
  const [notebooks, setNotebooks] = useState<{id: string, name: string, folder: string}[]>([])
  const [flashcards, setFlashcards] = useState<{id: string, name: string, cards: {front: string, back: string, flipped: boolean}[]}[]>([])
  const [folders, setFolders] = useState<string[]>(['General'])
  const [selectedFolder, setSelectedFolder] = useState('General')

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
      
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed bottom-4 right-4 z-50 bg-[var(--accent-color)] text-white p-4 rounded-full"
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
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative w-80 bg-white flex flex-col border-r border-[var(--accent-color)]/30 z-40 transition-transform duration-300 h-full`}>
          <div className="p-6 border-b bg-[var(--accent-color)]">
            <p className="text-sm text-white">Hello, {user?.name}</p>
          </div>

          <div className="flex border-b border-[var(--accent-color)]/30 bg-[var(--accent-color)]/5">
            <button
              onClick={() => setActiveTab('notes')}
              className="flex-1 py-3 text-xs md:text-sm font-medium relative group"
            >
              <div className={`absolute inset-1 rounded-lg transition-opacity duration-300 ${
                activeTab === 'notes' ? 'bg-[var(--accent-color)]/15 opacity-100' : 'bg-[var(--accent-color)]/10 opacity-0 group-hover:opacity-100'
              }`}></div>
              <span className={`relative z-10 ${
                activeTab === 'notes' ? 'text-[var(--accent-color)] font-semibold' : 'text-[var(--text-color)]/70'
              }`}>Notes</span>
            </button>
            <button
              onClick={() => setActiveTab('notebooks')}
              className="flex-1 py-3 text-xs md:text-sm font-medium relative group"
            >
              <div className={`absolute inset-1 rounded-lg transition-opacity duration-300 ${
                activeTab === 'notebooks' ? 'bg-[var(--accent-color)]/15 opacity-100' : 'bg-[var(--accent-color)]/10 opacity-0 group-hover:opacity-100'
              }`}></div>
              <span className={`relative z-10 ${
                activeTab === 'notebooks' ? 'text-[var(--accent-color)] font-semibold' : 'text-[var(--text-color)]/70'
              }`}>Books</span>
            </button>
            <button
              onClick={() => setActiveTab('flashcards')}
              className="flex-1 py-3 text-xs md:text-sm font-medium relative group"
            >
              <div className={`absolute inset-1 rounded-lg transition-opacity duration-300 ${
                activeTab === 'flashcards' ? 'bg-[var(--accent-color)]/15 opacity-100' : 'bg-[var(--accent-color)]/10 opacity-0 group-hover:opacity-100'
              }`}></div>
              <span className={`relative z-10 ${
                activeTab === 'flashcards' ? 'text-[var(--accent-color)] font-semibold' : 'text-[var(--text-color)]/70'
              }`}>Cards</span>
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
                <button 
                  onClick={() => {
                    const name = prompt('Notebook name:')
                    if (name) setNotebooks([...notebooks, {id: Date.now().toString(), name, folder: selectedFolder}])
                  }}
                  className="w-full p-4 border-2 border-dashed border-[var(--accent-color)]/30 rounded-2xl text-[var(--text-color)] hover:border-[var(--accent-color)] hover:bg-[var(--accent-color)]/5 transition-all"
                >
                  + Create Notebook
                </button>
                <select 
                  value={selectedFolder} 
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  className="w-full p-2 border border-[var(--accent-color)]/30 rounded-lg"
                >
                  {folders.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <button 
                  onClick={() => {
                    const name = prompt('Folder name:')
                    if (name && !folders.includes(name)) setFolders([...folders, name])
                  }}
                  className="w-full p-2 text-sm border border-[var(--accent-color)]/30 rounded-lg hover:bg-[var(--accent-color)]/5"
                >
                  + New Folder
                </button>
                {notebooks.filter(n => n.folder === selectedFolder).map(nb => (
                  <div key={nb.id} className="p-3 bg-[var(--accent-color)]/10 rounded-xl">
                    <span className="text-[var(--text-color)]">{nb.name}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'flashcards' && (
              <div className="p-4 space-y-3">
                <button 
                  onClick={() => {
                    const name = prompt('Deck name:')
                    if (name) setFlashcards([...flashcards, {id: Date.now().toString(), name, cards: [{front: 'Front', back: 'Back', flipped: false}]}])
                  }}
                  className="w-full p-4 border-2 border-dashed border-[var(--accent-color)]/30 rounded-2xl text-[var(--text-color)] hover:border-[var(--accent-color)] hover:bg-[var(--accent-color)]/5 transition-all"
                >
                  + Create Flashcard Deck
                </button>
                {flashcards.map(deck => (
                  <div key={deck.id} className="p-3 bg-[var(--accent-color)]/10 rounded-xl space-y-2">
                    <div className="font-semibold text-[var(--text-color)]">{deck.name}</div>
                    {deck.cards.map((card, i) => (
                      <div 
                        key={i}
                        onClick={() => {
                          const updated = [...flashcards]
                          const deckIndex = updated.findIndex(d => d.id === deck.id)
                          updated[deckIndex].cards[i].flipped = !updated[deckIndex].cards[i].flipped
                          setFlashcards(updated)
                        }}
                        className="p-3 bg-white rounded-lg cursor-pointer hover:scale-105 transition-transform"
                      >
                        <p className="text-sm text-[var(--text-color)]">{card.flipped ? card.back : card.front}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-[var(--accent-color)]/5">
            <div className="text-center text-xs text-[var(--text-color)]/70">
              {syncing ? 'Syncing...' : 'Auto-sync enabled'}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedNote ? (
            <NoteEditor note={selectedNote} onSave={loadNotes} />
          ) : (
            <div className="flex items-center justify-center h-full bg-[var(--surface-color,white)] p-4 transition-colors duration-[2000ms]">
              <div className="text-center animate-fade-in">
                <svg className="w-20 h-20 md:w-28 md:h-28 mx-auto mb-6 text-[var(--accent-color)] animate-bounce transition-colors duration-[2000ms]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-[var(--accent-color)]/70 text-xl md:text-2xl mb-8 transition-colors duration-[2000ms]">No notes yet</p>
                <button
                  onClick={() => {
                    const newNote: Note = {
                      id: Date.now().toString(),
                      title: 'Untitled Note',
                      content: '',
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      tags: [],
                    }
                    setSelectedNote(newNote)
                  }}
                  className="bg-[var(--accent-color)] text-white px-8 md:px-10 py-3 md:py-4 rounded-2xl hover:opacity-90 font-semibold shadow-xl transition-all transform hover:scale-110 duration-[2000ms]"
                >
                  Create First Note
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-[var(--accent-color)]/20 border-t border-[var(--accent-color)]/30 py-6 px-4 mt-auto">
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
