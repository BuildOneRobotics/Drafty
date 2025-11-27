'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore, Note } from '@/lib/store'
import { notesAPI, authAPI } from '@/lib/api'
import NoteEditor from '@/components/NoteEditor'
import NoteList from '@/components/NoteList'
import Navbar from '@/components/Navbar'
import LoadingScreen from '@/components/LoadingScreen'

interface WhiteboardItem {
  id: string
  type: 'note' | 'circle' | 'square' | 'triangle'
  x: number
  y: number
  text: string
  color: string
}

interface Whiteboard {
  id: string
  name: string
  items: WhiteboardItem[]
}

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
  const [activeTab, setActiveTab] = useState<'notes' | 'notebooks' | 'flashcards' | 'whiteboards'>('notes')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notebooks, setNotebooks] = useState<{id: string, name: string, folder: string}[]>([])
  const [flashcards, setFlashcards] = useState<{id: string, name: string, cards: {front: string, back: string, flipped: boolean}[]}[]>([])
  const [folders, setFolders] = useState<string[]>(['General'])
  const [selectedFolder, setSelectedFolder] = useState('General')
  const [whiteboards, setWhiteboards] = useState<Whiteboard[]>([])
  const [selectedWhiteboard, setSelectedWhiteboard] = useState<string | null>(null)
  const [draggedItem, setDraggedItem] = useState<{id: string, startX: number, startY: number} | null>(null)
  const [showNotebookForm, setShowNotebookForm] = useState(false)
  const [notebookName, setNotebookName] = useState('')
  const [showFlashcardForm, setShowFlashcardForm] = useState(false)
  const [flashcardName, setFlashcardName] = useState('')
  const [showWhiteboardForm, setShowWhiteboardForm] = useState(false)
  const [whiteboardName, setWhiteboardName] = useState('')

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

  const addItemToWhiteboard = (type: 'note' | 'circle' | 'square' | 'triangle') => {
    if (!selectedWhiteboard) return
    const wb = whiteboards.find(w => w.id === selectedWhiteboard)
    if (!wb) return
    const newItem: WhiteboardItem = {
      id: Date.now().toString(),
      type,
      x: 50,
      y: 50,
      text: 'New item',
      color: '#fef3c7'
    }
    const updated = whiteboards.map(w => w.id === selectedWhiteboard ? {...w, items: [...w.items, newItem]} : w)
    setWhiteboards(updated)
  }

  const updateItemPosition = (itemId: string, x: number, y: number) => {
    const updated = whiteboards.map(w => w.id === selectedWhiteboard ? {
      ...w,
      items: w.items.map(i => i.id === itemId ? {...i, x, y} : i)
    } : w)
    setWhiteboards(updated)
  }

  const updateItemText = (itemId: string, text: string) => {
    const updated = whiteboards.map(w => w.id === selectedWhiteboard ? {
      ...w,
      items: w.items.map(i => i.id === itemId ? {...i, text} : i)
    } : w)
    setWhiteboards(updated)
  }

  const deleteItem = (itemId: string) => {
    const updated = whiteboards.map(w => w.id === selectedWhiteboard ? {
      ...w,
      items: w.items.filter(i => i.id !== itemId)
    } : w)
    setWhiteboards(updated)
  }

  const renderShape = (item: WhiteboardItem) => {
    const baseClass = 'absolute cursor-move p-2 rounded transition-all'
    const colors: {[key: string]: string} = {
      '#fef3c7': 'bg-yellow-100',
      '#fce7f3': 'bg-pink-100',
      '#dbeafe': 'bg-blue-100',
      '#dcfce7': 'bg-green-100'
    }
    
    if (item.type === 'note') {
      return (
        <div
          key={item.id}
          style={{left: `${item.x}px`, top: `${item.y}px`}}
          className={`${baseClass} ${colors[item.color] || 'bg-yellow-100'} w-32 h-32 shadow-lg`}
          onMouseDown={(e) => setDraggedItem({id: item.id, startX: e.clientX - item.x, startY: e.clientY - item.y})}
        >
          <textarea
            value={item.text}
            onChange={(e) => updateItemText(item.id, e.target.value)}
            className="w-full h-full bg-transparent outline-none text-sm resize-none"
          />
          <button onClick={() => deleteItem(item.id)} className="absolute top-1 right-1 text-red-500 text-xs">×</button>
        </div>
      )
    } else if (item.type === 'circle') {
      return (
        <div
          key={item.id}
          style={{left: `${item.x}px`, top: `${item.y}px`}}
          className={`${baseClass} w-20 h-20 rounded-full ${colors[item.color] || 'bg-blue-100'} shadow-lg flex items-center justify-center`}
          onMouseDown={(e) => setDraggedItem({id: item.id, startX: e.clientX - item.x, startY: e.clientY - item.y})}
        >
          <button onClick={() => deleteItem(item.id)} className="text-red-500 text-xs">×</button>
        </div>
      )
    } else if (item.type === 'square') {
      return (
        <div
          key={item.id}
          style={{left: `${item.x}px`, top: `${item.y}px`}}
          className={`${baseClass} w-20 h-20 ${colors[item.color] || 'bg-green-100'} shadow-lg flex items-center justify-center`}
          onMouseDown={(e) => setDraggedItem({id: item.id, startX: e.clientX - item.x, startY: e.clientY - item.y})}
        >
          <button onClick={() => deleteItem(item.id)} className="text-red-500 text-xs">×</button>
        </div>
      )
    } else if (item.type === 'triangle') {
      return (
        <div
          key={item.id}
          style={{left: `${item.x}px`, top: `${item.y}px`, width: 0, height: 0, borderLeft: '20px solid transparent', borderRight: '20px solid transparent', borderBottom: '40px solid #fca5a5'}}
          className="absolute cursor-move"
          onMouseDown={(e) => setDraggedItem({id: item.id, startX: e.clientX - item.x, startY: e.clientY - item.y})}
        />
      )
    }
  }

  if (loading) {
    return <LoadingScreen />
  }

  const currentWhiteboard = whiteboards.find(w => w.id === selectedWhiteboard)

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
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative w-80 bg-[var(--surface-color,white)] flex flex-col border-r border-[var(--accent-color)]/30 z-40 transition-transform duration-300 h-full transition-colors duration-[2000ms]`}>
          <div className="p-6 border-b bg-[var(--accent-color)] transition-colors duration-[2000ms]">
            <p className="text-sm text-white">Hello, {user?.name}</p>
          </div>

          <div className="flex border-b border-[var(--accent-color)]/30 bg-[var(--accent-color)]/5 transition-colors duration-[2000ms]">
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
            <button
              onClick={() => setActiveTab('whiteboards')}
              className="flex-1 py-3 text-xs md:text-sm font-medium relative group"
            >
              <div className={`absolute inset-1 rounded-lg transition-opacity duration-300 ${
                activeTab === 'whiteboards' ? 'bg-[var(--accent-color)]/15 opacity-100' : 'bg-[var(--accent-color)]/10 opacity-0 group-hover:opacity-100'
              }`}></div>
              <span className={`relative z-10 ${
                activeTab === 'whiteboards' ? 'text-[var(--accent-color)] font-semibold' : 'text-[var(--text-color)]/70'
              }`}>Board</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-[var(--surface-color,white)] transition-colors duration-[2000ms]">
            {activeTab === 'notes' && (
              <NoteList notes={notes} selectedNote={selectedNote} onSelectNote={(note) => {
                setSelectedNote(note)
                setSidebarOpen(false)
              }} />
            )}
            {activeTab === 'notebooks' && (
              <div className="p-4 space-y-3">
                {!showNotebookForm ? (
                  <button 
                    onClick={() => setShowNotebookForm(true)}
                    className="w-full p-4 border-2 border-dashed border-[var(--accent-color)]/30 rounded-2xl text-[var(--text-color)] hover:border-[var(--accent-color)] hover:bg-[var(--accent-color)]/5 transition-all"
                  >
                    + Create Notebook
                  </button>
                ) : (
                  <div className="p-3 border-2 border-[var(--accent-color)]/30 rounded-xl space-y-2">
                    <input 
                      type="text"
                      value={notebookName}
                      onChange={(e) => setNotebookName(e.target.value)}
                      placeholder="Notebook name"
                      className="w-full px-3 py-2 border border-[var(--accent-color)]/30 rounded-lg focus:outline-none focus:border-[var(--accent-color)] bg-[var(--bg-color,white)]"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          if (notebookName.trim()) {
                            setNotebooks([...notebooks, {id: Date.now().toString(), name: notebookName, folder: selectedFolder}])
                            setNotebookName('')
                            setShowNotebookForm(false)
                          }
                        }}
                        className="flex-1 bg-[var(--accent-color)] text-white px-3 py-2 rounded-lg hover:opacity-90"
                      >
                        Create
                      </button>
                      <button 
                        onClick={() => {
                          setNotebookName('')
                          setShowNotebookForm(false)
                        }}
                        className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                <select 
                  value={selectedFolder} 
                  onChange={(e) => setSelectedFolder(e.target.value)}
                  className="w-full p-2 border border-[var(--accent-color)]/30 rounded-lg bg-[var(--surface-color,white)]"
                >
                  {folders.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <button 
                  onClick={() => {
                    const name = prompt('Folder name:')
                    if (name && !folders.includes(name)) setFolders([...folders, name])
                  }}
                  className="w-full p-2 text-sm border border-[var(--accent-color)]/30 rounded-lg hover:bg-[var(--accent-color)]/5 bg-[var(--surface-color,white)]"
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
                {!showFlashcardForm ? (
                  <button 
                    onClick={() => setShowFlashcardForm(true)}
                    className="w-full p-4 border-2 border-dashed border-[var(--accent-color)]/30 rounded-2xl text-[var(--text-color)] hover:border-[var(--accent-color)] hover:bg-[var(--accent-color)]/5 transition-all"
                  >
                    + Create Flashcard Deck
                  </button>
                ) : (
                  <div className="p-3 border-2 border-[var(--accent-color)]/30 rounded-xl space-y-2">
                    <input 
                      type="text"
                      value={flashcardName}
                      onChange={(e) => setFlashcardName(e.target.value)}
                      placeholder="Deck name"
                      className="w-full px-3 py-2 border border-[var(--accent-color)]/30 rounded-lg focus:outline-none focus:border-[var(--accent-color)] bg-[var(--bg-color,white)]"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          if (flashcardName.trim()) {
                            setFlashcards([...flashcards, {id: Date.now().toString(), name: flashcardName, cards: [{front: 'Front', back: 'Back', flipped: false}]}])
                            setFlashcardName('')
                            setShowFlashcardForm(false)
                          }
                        }}
                        className="flex-1 bg-[var(--accent-color)] text-white px-3 py-2 rounded-lg hover:opacity-90"
                      >
                        Create
                      </button>
                      <button 
                        onClick={() => {
                          setFlashcardName('')
                          setShowFlashcardForm(false)
                        }}
                        className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
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
                        className="p-3 bg-[var(--surface-color,white)] rounded-lg cursor-pointer hover:scale-105 transition-transform"
                      >
                        <p className="text-sm text-[var(--text-color)]">{card.flipped ? card.back : card.front}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'whiteboards' && (
              <div className="p-4 space-y-3">
                {!showWhiteboardForm ? (
                  <button 
                    onClick={() => setShowWhiteboardForm(true)}
                    className="w-full p-4 border-2 border-dashed border-[var(--accent-color)]/30 rounded-2xl text-[var(--text-color)] hover:border-[var(--accent-color)] hover:bg-[var(--accent-color)]/5 transition-all"
                  >
                    + Create Whiteboard
                  </button>
                ) : (
                  <div className="p-3 border-2 border-[var(--accent-color)]/30 rounded-xl space-y-2">
                    <input 
                      type="text"
                      value={whiteboardName}
                      onChange={(e) => setWhiteboardName(e.target.value)}
                      placeholder="Whiteboard name"
                      className="w-full px-3 py-2 border border-[var(--accent-color)]/30 rounded-lg focus:outline-none focus:border-[var(--accent-color)] bg-[var(--bg-color,white)]"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          if (whiteboardName.trim()) {
                            setWhiteboards([...whiteboards, {id: Date.now().toString(), name: whiteboardName, items: []}])
                            setWhiteboardName('')
                            setShowWhiteboardForm(false)
                          }
                        }}
                        className="flex-1 bg-[var(--accent-color)] text-white px-3 py-2 rounded-lg hover:opacity-90"
                      >
                        Create
                      </button>
                      <button 
                        onClick={() => {
                          setWhiteboardName('')
                          setShowWhiteboardForm(false)
                        }}
                        className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                {whiteboards.map(wb => (
                  <button key={wb.id} onClick={() => { setSelectedWhiteboard(wb.id); setSidebarOpen(false) }} className="w-full text-left p-3 bg-[var(--accent-color)]/10 rounded-xl hover:bg-[var(--accent-color)]/20 transition-colors">
                    <span className="text-[var(--text-color)]">{wb.name}</span>
                  </button>
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
          ) : currentWhiteboard ? (
            <div className="flex-1 flex flex-col bg-[var(--bg-color,#faf8f5)]">
              <div className="p-4 border-b bg-[var(--surface-color,white)] flex gap-2">
                <button onClick={() => addItemToWhiteboard('note')} className="px-3 py-2 bg-yellow-100 rounded hover:bg-yellow-200">📝 Note</button>
                <button onClick={() => addItemToWhiteboard('circle')} className="px-3 py-2 bg-blue-100 rounded hover:bg-blue-200">⭕ Circle</button>
                <button onClick={() => addItemToWhiteboard('square')} className="px-3 py-2 bg-green-100 rounded hover:bg-green-200">⬜ Square</button>
                <button onClick={() => addItemToWhiteboard('triangle')} className="px-3 py-2 bg-red-100 rounded hover:bg-red-200">🔺 Triangle</button>
              </div>
              <div 
                className="flex-1 relative overflow-hidden bg-[var(--surface-color,white)]"
                onMouseMove={(e) => {
                  if (draggedItem) {
                    updateItemPosition(draggedItem.id, e.clientX - draggedItem.startX, e.clientY - draggedItem.startY)
                  }
                }}
                onMouseUp={() => setDraggedItem(null)}
                onMouseLeave={() => setDraggedItem(null)}
              >
                {currentWhiteboard.items.map(item => renderShape(item))}
              </div>
            </div>
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
