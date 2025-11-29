'use client'

import { useState, useEffect } from 'react'
import { Note, Whiteboard as WhiteboardType, Flashcard, FlashcardFolder, Notebook } from '@/lib/store'
import FlashcardEditor from '@/components/FlashcardEditor'
import NotebookEditor from '@/components/NotebookEditor'
import FileManager from './dashboard-files'
import { NoteIcon, NotebookIcon, FlashcardIcon, WhiteboardIcon, FilesIcon, FriendsIcon } from '@/components/Icons'
import { whiteboardsAPI, flashcardsAPI, notebooksAPI } from '@/lib/api'
import { autoCommit } from '@/lib/git'
import { useMobile } from '@/lib/useMobile'

interface DashboardContentProps {
  notes: Note[]
  user: any
  onLoadNotes?: () => Promise<void>
}

export default function DashboardContent({ notes, user, onLoadNotes }: DashboardContentProps) {
  const { isPhone } = useMobile()
  // reference the prop so it's considered used by TypeScript (some strict configs flag unused params)
  void onLoadNotes
  const [view, setView] = useState<'home' | 'notes' | 'notebooks' | 'flashcards' | 'whiteboards' | 'files' | 'friends'>('home')
  const [whiteboards, setWhiteboards] = useState<WhiteboardType[]>([])
  const [notebooks, setNotebooks] = useState<Notebook[]>([])
  const [selectedNotebook, setSelectedNotebook] = useState<Notebook | null>(null)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [flashcardFolders, setFlashcardFolders] = useState<FlashcardFolder[]>([])
  const [selectedFlashcard, setSelectedFlashcard] = useState<Flashcard | null>(null)
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null)
  const [flashcardName, setFlashcardName] = useState('')
  const [showNewFlashcard, setShowNewFlashcard] = useState(false)
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [newFolderColor, setNewFolderColor] = useState('#22c55e')
  const [draggedFlashcard, setDraggedFlashcard] = useState<string | null>(null)

  useEffect(() => {
    loadWhiteboards()
    loadNotebooks()
    loadFlashcards()
    loadSavedData()
  }, [])

  const loadSavedData = () => {
    const saved = localStorage.getItem(`dashboardData-${user?.id}`)
    if (saved) {
      const data = JSON.parse(saved)
      setFlashcardFolders(data.flashcardFolders || [])
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const data = { flashcardFolders }
      localStorage.setItem(`dashboardData-${user?.id}`, JSON.stringify(data))
      autoCommit(`Update dashboard data for ${user?.name}`)
    }, 2000)
    return () => clearTimeout(timer)
  }, [flashcardFolders, user?.id, user?.name])

  const loadWhiteboards = async () => {
    try {
      const response = await whiteboardsAPI.getWhiteboards()
      setWhiteboards(response.data)
    } catch (error) {
      console.error('Failed to load whiteboards:', error)
    }
  }

  const loadNotebooks = async () => {
    try {
      const response = await notebooksAPI.getNotebooks()
      setNotebooks(response.data)
    } catch (error) {
      console.error('Failed to load notebooks:', error)
    }
  }

  const loadFlashcards = async () => {
    try {
      const response = await flashcardsAPI.getFlashcards()
      setFlashcards(response.data)
    } catch (error) {
      console.error('Failed to load flashcards:', error)
    }
  }

  const handleAddFlashcard = async () => {
    if (!flashcardName.trim()) return
    try {
      const response = await flashcardsAPI.createFlashcard(flashcardName)
      setFlashcards([response.data, ...flashcards])
      setSelectedFlashcard(response.data)
      setFlashcardName('')
      setShowNewFlashcard(false)
      setView('flashcards')
    } catch (error) {
      console.error('Failed to create flashcard:', error)
    }
  }

  const handleDeleteFlashcard = async (id: string) => {
    try {
      await flashcardsAPI.deleteFlashcard(id)
      setFlashcards(flashcards.filter(f => f.id !== id))
      setSelectedFlashcard(null)
    } catch (error) {
      console.error('Failed to delete flashcard:', error)
    }
  }

  const handleAddFolder = () => {
    if (!newFolderName.trim()) return
    const folder: FlashcardFolder = {
      id: Date.now().toString(),
      name: newFolderName,
      color: newFolderColor
    }
    setFlashcardFolders([...flashcardFolders, folder])
    setNewFolderName('')
    setNewFolderColor('#22c55e')
    setShowNewFolder(false)
  }

  const handleDeleteFolder = (id: string) => {
    setFlashcardFolders(flashcardFolders.filter(f => f.id !== id))
    setFlashcards(flashcards.map(fc => fc.folderId === id ? { ...fc, folderId: undefined } : fc))
  }

  const handleMoveFlashcard = (flashcardId: string, folderId?: string) => {
    setFlashcards(flashcards.map(fc => fc.id === flashcardId ? { ...fc, folderId } : fc))
  }

  const navItems = [
    { id: 'notes', label: 'Notes', Icon: NoteIcon },
    { id: 'notebooks', label: 'Notebooks', Icon: NotebookIcon },
    { id: 'flashcards', label: 'Flashcards', Icon: FlashcardIcon },
    { id: 'whiteboards', label: 'Whiteboards', Icon: WhiteboardIcon },
    { id: 'files', label: 'Files', Icon: FilesIcon },
    { id: 'friends', label: 'Friends', Icon: FriendsIcon }
  ]

  const sidebar = (
    <div className={`${isPhone ? 'w-full' : 'md:w-80'} bg-white ${isPhone ? 'border-b' : 'border-r'} border-[var(--accent-color)]/20 flex ${isPhone ? 'flex-row overflow-x-auto' : 'flex-col'} h-${isPhone ? 'auto' : 'full'}`}>
      {!isPhone && (
        <div className="p-6 bg-[var(--accent-color)] rounded-b-3xl w-full">
          <p className="text-sm text-white font-semibold">Hello, {user?.name || 'User'}</p>
        </div>
      )}
      <div className={`${isPhone ? 'flex gap-2 p-3 overflow-x-auto' : 'p-6 space-y-3 w-full'}`}>
        <div className={`${isPhone ? 'flex gap-2' : 'grid grid-cols-2 gap-3'}`}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id as any)}
              className={`${isPhone ? 'flex-shrink-0 p-3 rounded-xl' : 'p-4 rounded-2xl'} transition-all text-center hover:scale-105 transform duration-200 ${
                view === item.id
                  ? 'bg-[var(--accent-color)] text-white shadow-md'
                  : 'bg-[var(--accent-color)]/10 text-[var(--text-color)] hover:bg-[var(--accent-color)]/20'
              }`}
            >
              <div className="flex justify-center mb-1"><item.Icon /></div>
              <div className={`${isPhone ? 'text-xs' : 'text-xs'} font-semibold whitespace-nowrap`}>{item.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className={`flex ${isPhone ? 'flex-col' : 'flex-col md:flex-row'} flex-1 overflow-hidden`}>
      {isPhone ? sidebar : <div className="hidden md:flex md:flex-col">{sidebar}</div>}

      <div className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-color,#f0fdf4)]">
        {view === 'flashcards' && (
          <div className={`flex-1 overflow-y-auto ${isPhone ? 'p-4' : 'p-8'}`}>
            <div className={`flex ${isPhone ? 'flex-col gap-3' : 'justify-between items-center'} mb-6`}>
              <h2 className={`${isPhone ? 'text-xl' : 'text-2xl'} font-bold text-[var(--text-color)]`}>Flashcards</h2>
              <div className={`flex ${isPhone ? 'flex-col w-full' : 'gap-2'} gap-2`}>
                <button onClick={() => setShowNewFolder(true)} className={`${isPhone ? 'w-full' : ''} bg-[var(--accent-color)]/20 text-[var(--accent-color)] px-4 py-2 rounded-lg hover:bg-[var(--accent-color)]/30 transition-all text-sm`}>+ New Folder</button>
                <button onClick={() => setShowNewFlashcard(true)} className={`${isPhone ? 'w-full' : ''} bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all text-sm`}>+ New Flashcard Set</button>
              </div>
            </div>
            {showNewFolder && (
              <div className="mb-6 p-4 bg-white rounded-2xl border border-[var(--accent-color)]/20 space-y-3">
                <input type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="Folder name" className="w-full px-3 py-2 border border-[var(--accent-color)]/20 rounded-lg focus:outline-none focus:border-[var(--accent-color)] text-[var(--text-color)]" autoFocus />
                <div className="flex items-center gap-2">
                  <input type="color" value={newFolderColor} onChange={(e) => setNewFolderColor(e.target.value)} className="w-12 h-10 rounded cursor-pointer" />
                  <span className="text-sm text-[var(--text-color)]">{newFolderColor}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleAddFolder} className="flex-1 bg-[var(--accent-color)] text-white px-3 py-2 rounded-lg hover:opacity-90">Create</button>
                  <button onClick={() => setShowNewFolder(false)} className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
                </div>
              </div>
            )}
            {showNewFlashcard && (
              <div className="mb-6 p-4 bg-white rounded-2xl border border-[var(--accent-color)]/20 space-y-3">
                <input type="text" value={flashcardName} onChange={(e) => setFlashcardName(e.target.value)} placeholder="Flashcard set name" className="w-full px-3 py-2 border border-[var(--accent-color)]/20 rounded-lg focus:outline-none focus:border-[var(--accent-color)] text-[var(--text-color)]" autoFocus />
                <div className="flex gap-2">
                  <button onClick={handleAddFlashcard} className="flex-1 bg-[var(--accent-color)] text-white px-3 py-2 rounded-lg hover:opacity-90">Create</button>
                  <button onClick={() => setShowNewFlashcard(false)} className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
                </div>
              </div>
            )}
            {selectedFlashcard ? (
              <FlashcardEditor flashcard={selectedFlashcard} onSave={loadFlashcards} />
            ) : (
              <div className="space-y-4">
                {flashcardFolders.map(folder => {
                  const folderCards = flashcards.filter(fc => fc.folderId === folder.id)
                  return (
                    <div key={folder.id} className="bg-white rounded-2xl border border-[var(--accent-color)]/20 overflow-hidden" onDragOver={(e) => { e.preventDefault() }} onDrop={(e) => { e.preventDefault(); if (draggedFlashcard) handleMoveFlashcard(draggedFlashcard, folder.id); setDraggedFlashcard(null) }}>
                      <button onClick={() => setExpandedFolder(expandedFolder === folder.id ? null : folder.id)} className="w-full p-4 flex items-center justify-between hover:bg-[var(--accent-color)]/5 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{backgroundColor: folder.color}}></div>
                          <span className="font-semibold text-[var(--text-color)]">{folder.name}</span>
                          <span className="text-xs text-[var(--text-color)]/60">({folderCards.length})</span>
                        </div>
                        <span className="text-[var(--text-color)]/60">{expandedFolder === folder.id ? '▼' : '▶'}</span>
                      </button>
                      {expandedFolder === folder.id && (
                        <div className="border-t border-[var(--accent-color)]/20 p-4 space-y-2">
                          {folderCards.map(fc => (
                            <div key={fc.id} draggable onDragStart={() => setDraggedFlashcard(fc.id)} onDragEnd={() => setDraggedFlashcard(null)} className="p-3 bg-[var(--accent-color)]/5 rounded-lg cursor-move hover:bg-[var(--accent-color)]/10" onClick={() => setSelectedFlashcard(fc)}>
                              <p className="font-semibold text-[var(--text-color)]">{fc.title}</p>
                              <p className="text-xs text-[var(--text-color)]/60">{fc.cards.length} cards</p>
                            </div>
                          ))}
                          <button onClick={() => handleDeleteFolder(folder.id)} className="w-full mt-2 text-red-500 hover:text-red-700 text-sm py-2">Delete Folder</button>
                        </div>
                      )}
                    </div>
                  )
                })}
                {flashcards.filter(fc => !fc.folderId).length > 0 && (
                  <div className="bg-white rounded-2xl border border-[var(--accent-color)]/20 p-4 space-y-2" onDragOver={(e) => { e.preventDefault() }} onDrop={(e) => { e.preventDefault(); if (draggedFlashcard) handleMoveFlashcard(draggedFlashcard); setDraggedFlashcard(null) }}>
                    <h3 className="font-semibold text-[var(--text-color)] mb-3">Ungrouped</h3>
                    {flashcards.filter(fc => !fc.folderId).map(fc => (
                      <div key={fc.id} draggable onDragStart={() => setDraggedFlashcard(fc.id)} onDragEnd={() => setDraggedFlashcard(null)} className="p-3 bg-[var(--accent-color)]/5 rounded-lg cursor-move hover:bg-[var(--accent-color)]/10" onClick={() => setSelectedFlashcard(fc)}>
                        <p className="font-semibold text-[var(--text-color)]">{fc.title}</p>
                        <p className="text-xs text-[var(--text-color)]/60">{fc.cards.length} cards</p>
                        <button onClick={() => handleDeleteFlashcard(fc.id)} className="mt-2 text-red-500 hover:text-red-700 text-xs">Delete</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {view === 'whiteboards' && (
          <div className={`flex-1 overflow-y-auto ${isPhone ? 'p-4' : 'p-8'}`}>
            <div className={`flex ${isPhone ? 'flex-col gap-3' : 'justify-between items-center'} mb-6`}>
              <h2 className={`${isPhone ? 'text-xl' : 'text-2xl'} font-bold text-[var(--text-color)]`}>Whiteboards</h2>
              <button
                onClick={async () => {
                  try {
                    const response = await whiteboardsAPI.createWhiteboard(`Whiteboard ${whiteboards.length + 1}`, 'plain')
                    setWhiteboards([response.data, ...whiteboards])
                  } catch (error) {
                    console.error('Failed to create whiteboard:', error)
                  }
                }}
                className={`${isPhone ? 'w-full' : ''} bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all`}
              >
                + New Whiteboard
              </button>
            </div>
            
            <div className="space-y-3">
              {whiteboards.length === 0 ? (
                <p className="text-[var(--text-color)]/60">No whiteboards yet. Create one to get started!</p>
              ) : (
                whiteboards.map(whiteboard => (
                  <div
                    key={whiteboard.id}
                    className="p-4 bg-white rounded-2xl border border-[var(--accent-color)]/20 hover:border-[var(--accent-color)]/40 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-[var(--text-color)]">{whiteboard.title}</p>
                        <p className="text-xs text-[var(--text-color)]/60">
                          Template: {whiteboard.template} • {new Date(whiteboard.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation()
                          try {
                            await whiteboardsAPI.deleteWhiteboard(whiteboard.id)
                            setWhiteboards(whiteboards.filter(wb => wb.id !== whiteboard.id))
                          } catch (error) {
                            console.error('Failed to delete whiteboard:', error)
                          }
                        }}
                        className="text-red-400 hover:text-red-600 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {view === 'files' && (
          <FileManager user={user} />
        )}

        {view === 'notebooks' && (
          <div className={`flex-1 overflow-y-auto ${isPhone ? 'p-4' : 'p-8'}`}>
            <div className={`flex ${isPhone ? 'flex-col gap-3' : 'justify-between items-center'} mb-6`}>
              <h2 className={`${isPhone ? 'text-xl' : 'text-2xl'} font-bold text-[var(--text-color)]`}>Notebooks</h2>
              <button
                onClick={async () => {
                  try {
                    const response = await notebooksAPI.createNotebook(`Notebook ${notebooks.length + 1}`)
                    setNotebooks([response.data, ...notebooks])
                    setSelectedNotebook(response.data)
                  } catch (error) {
                    console.error('Failed to create notebook:', error)
                  }
                }}
                className={`${isPhone ? 'w-full' : ''} bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all`}
              >
                + New Notebook
              </button>
            </div>
            
            {selectedNotebook ? (
              <div className="bg-white rounded-2xl border border-[var(--accent-color)]/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[var(--text-color)]">{selectedNotebook.name}</h3>
                  <button
                    onClick={() => setSelectedNotebook(null)}
                    className="text-[var(--text-color)]/60 hover:text-[var(--text-color)] text-xl"
                  >
                    ✕
                  </button>
                </div>
                <NotebookEditor 
                  notebook={selectedNotebook} 
                  onUpdateNotebook={async (updated) => {
                    try {
                      await notebooksAPI.updateNotebook(updated.id, updated)
                      setSelectedNotebook(updated)
                      setNotebooks(notebooks.map(nb => nb.id === updated.id ? updated : nb))
                    } catch (error) {
                      console.error('Failed to update notebook:', error)
                    }
                  }}
                />
              </div>
            ) : (
              <div className="space-y-3">
                {notebooks.length === 0 ? (
                  <p className="text-[var(--text-color)]/60">No notebooks yet. Create one to get started!</p>
                ) : (
                  notebooks.map(notebook => (
                    <div
                      key={notebook.id}
                      onClick={() => setSelectedNotebook(notebook)}
                      className="p-4 bg-white rounded-2xl border border-[var(--accent-color)]/20 hover:border-[var(--accent-color)]/40 cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-[var(--text-color)]">{notebook.name}</p>
                          <p className="text-xs text-[var(--text-color)]/60">
                            {notebook.pages.length} pages • {notebook.folder || 'Root'}
                          </p>
                        </div>
                        <button
                          onClick={async (e) => {
                            e.stopPropagation()
                            try {
                              await notebooksAPI.deleteNotebook(notebook.id)
                              setNotebooks(notebooks.filter(nb => nb.id !== notebook.id))
                            } catch (error) {
                              console.error('Failed to delete notebook:', error)
                            }
                          }}
                          className="text-red-400 hover:text-red-600 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {view === 'home' && (
          <div className={`flex-1 overflow-y-auto ${isPhone ? 'p-4' : 'p-8'}`}>
            <h1 className={`${isPhone ? 'text-2xl' : 'text-4xl'} font-bold text-[var(--text-color)] mb-8`}>Welcome, {user?.name || 'User'}</h1>
            <div className={`grid ${isPhone ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-6`}>
              {[
                { id: 'notes', label: 'Notes', Icon: NoteIcon, count: notes.length },
                { id: 'notebooks', label: 'Notebooks', Icon: NotebookIcon, count: notebooks.length },
                { id: 'flashcards', label: 'Flashcards', Icon: FlashcardIcon, count: flashcards.length },
                { id: 'whiteboards', label: 'Whiteboards', Icon: WhiteboardIcon, count: whiteboards.length }
              ].map(item => (
                <button key={item.id} onClick={() => setView(item.id as any)} className="p-6 bg-white rounded-3xl border border-[var(--accent-color)]/20 hover:border-[var(--accent-color)]/40 hover:shadow-lg transition-all text-left hover:scale-105 transform duration-200">
                  <div className="flex justify-center mb-4 text-[var(--accent-color)]"><item.Icon /></div>
                  <h3 className="text-xl font-bold text-[var(--text-color)] mb-1 text-center">{item.label}</h3>
                  <p className="text-sm text-[var(--text-color)]/60 text-center">{item.count} items</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>


    </div>
  )
}
