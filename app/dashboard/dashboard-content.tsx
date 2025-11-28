'use client'

import { useState, useEffect } from 'react'
import { Note, Notebook, Whiteboard as WhiteboardType, Flashcard } from '@/lib/store'
import NoteEditor from '@/components/NoteEditor'
import NotebookEditor from '@/components/NotebookEditor'
import WhiteboardEditor from '@/components/Whiteboard'
import FlashcardEditor from '@/components/FlashcardEditor'
import TemplateModal from '@/components/TemplateModal'
import { whiteboardsAPI, notesAPI, flashcardsAPI } from '@/lib/api'

interface DashboardContentProps {
  notes: Note[]
  onLoadNotes: () => void
  user: any
  syncing: boolean
}

export default function DashboardContent({ notes, onLoadNotes, user, syncing }: DashboardContentProps) {
  const [view, setView] = useState<'home' | 'notes' | 'notebooks' | 'flashcards' | 'whiteboards' | 'files' | 'friends'>('home')
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [notebooks, setNotebooks] = useState<Notebook[]>([])
  const [whiteboards, setWhiteboards] = useState<WhiteboardType[]>([])
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [selectedNotebook, setSelectedNotebook] = useState<Notebook | null>(null)
  const [selectedWhiteboard, setSelectedWhiteboard] = useState<WhiteboardType | null>(null)
  const [selectedFlashcard, setSelectedFlashcard] = useState<Flashcard | null>(null)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [templateType, setTemplateType] = useState<'note' | 'whiteboard'>('note')
  const [notebookName, setNotebookName] = useState('')
  const [showNewNotebook, setShowNewNotebook] = useState(false)
  const [flashcardName, setFlashcardName] = useState('')
  const [showNewFlashcard, setShowNewFlashcard] = useState(false)
  const [searchUsername, setSearchUsername] = useState('')
  const [friends, setFriends] = useState<string[]>([])
  const [allUsers, setAllUsers] = useState<string[]>(['alice', 'bob', 'charlie', 'david', 'emma'])

  useEffect(() => {
    loadWhiteboards()
    loadFlashcards()
  }, [])

  const loadWhiteboards = async () => {
    try {
      const response = await whiteboardsAPI.getWhiteboards()
      setWhiteboards(response.data)
    } catch (error) {
      console.error('Failed to load whiteboards:', error)
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

  const handleCreateNote = async () => {
    try {
      const response = await notesAPI.createNote(`New Note ${new Date().toLocaleTimeString()}`, '', [])
      onLoadNotes()
      setSelectedNote(response.data)
      setView('notes')
    } catch (error) {
      console.error('Failed to create note:', error)
    }
  }

  const handleCreateWhiteboard = async (template: string) => {
    try {
      const response = await whiteboardsAPI.createWhiteboard(`Whiteboard ${new Date().toLocaleTimeString()}`, template)
      setWhiteboards([response.data, ...whiteboards])
      setSelectedWhiteboard(response.data)
      setView('whiteboards')
    } catch (error) {
      console.error('Failed to create whiteboard:', error)
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

  const handleDeleteNote = async (id: string) => {
    try {
      await notesAPI.deleteNote(id)
      onLoadNotes()
      setSelectedNote(null)
    } catch (error) {
      console.error('Failed to delete note:', error)
    }
  }

  const handleDeleteWhiteboard = async (id: string) => {
    try {
      await whiteboardsAPI.deleteWhiteboard(id)
      setWhiteboards(whiteboards.filter(w => w.id !== id))
      setSelectedWhiteboard(null)
    } catch (error) {
      console.error('Failed to delete whiteboard:', error)
    }
  }

  const handleAddNotebook = () => {
    if (!notebookName.trim()) return
    const newNotebook: Notebook = {
      id: Date.now().toString(),
      name: notebookName,
      folder: 'General',
      pages: [{ id: '1', number: 1, title: 'Page 1', content: '' }]
    }
    setNotebooks([...notebooks, newNotebook])
    setSelectedNotebook(newNotebook)
    setNotebookName('')
    setShowNewNotebook(false)
    setView('notebooks')
  }

  const handleAddFriend = (username: string) => {
    if (!friends.includes(username)) {
      setFriends([...friends, username])
      setSearchUsername('')
    }
  }

  const handleRemoveFriend = (username: string) => {
    setFriends(friends.filter(f => f !== username))
  }

  const sidebar = (
    <div className="w-full md:w-80 bg-white border-r border-[var(--accent-color)]/20 flex flex-col h-full">
      <div className="p-6 bg-[var(--accent-color)]">
        <p className="text-sm text-white font-semibold">Hello, {user?.name || 'User'}</p>
      </div>

      <div className="p-6 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'notes', label: 'Notes', icon: '📝' },
            { id: 'notebooks', label: 'Notebooks', icon: '📓' },
            { id: 'flashcards', label: 'Flashcards', icon: '🎴' },
            { id: 'whiteboards', label: 'Whiteboards', icon: '🎨' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id as any)}
              className={`p-4 rounded-2xl transition-all text-center ${
                view === item.id
                  ? 'bg-[var(--accent-color)] text-white'
                  : 'bg-[var(--accent-color)]/10 text-[var(--text-color)] hover:bg-[var(--accent-color)]/20'
              }`}
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-xs font-semibold">{item.label}</div>
            </button>
          ))}
        </div>

        <div className="border-t border-[var(--accent-color)]/20 pt-3 space-y-2">
          {[
            { id: 'files', label: 'Files' },
            { id: 'friends', label: 'Friends' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id as any)}
              className={`w-full p-3 rounded-xl transition-all text-left text-sm ${
                view === item.id
                  ? 'bg-[var(--accent-color)] text-white'
                  : 'bg-[var(--accent-color)]/10 text-[var(--text-color)] hover:bg-[var(--accent-color)]/20'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
      <div className="hidden md:flex md:flex-col">{sidebar}</div>

      <div className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-color,#f0fdf4)]">
        {view === 'home' && (
          <div className="flex-1 overflow-y-auto p-8">
            <h1 className="text-4xl font-bold text-[var(--text-color)] mb-8">Welcome, {user?.name || 'User'}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'notes', label: 'Notes', icon: '📝', count: notes.length },
                { id: 'notebooks', label: 'Notebooks', icon: '📓', count: notebooks.length },
                { id: 'flashcards', label: 'Flashcards', icon: '🎴', count: flashcards.length },
                { id: 'whiteboards', label: 'Whiteboards', icon: '🎨', count: whiteboards.length }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id as any)}
                  className="p-6 bg-white rounded-3xl border border-[var(--accent-color)]/20 hover:border-[var(--accent-color)]/40 transition-all text-left"
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="text-xl font-bold text-[var(--text-color)] mb-1">{item.label}</h3>
                  <p className="text-sm text-[var(--text-color)]/60">{item.count} items</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {view === 'notes' && (
          <div className="flex-1 overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[var(--text-color)]">Notes</h2>
              <button
                onClick={() => {
                  setTemplateType('note')
                  setShowTemplateModal(true)
                }}
                className="bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg hover:opacity-90"
              >
                + New Note
              </button>
            </div>
            {selectedNote ? (
              <NoteEditor note={selectedNote} onSave={onLoadNotes} />
            ) : (
              <div className="space-y-2">
                {notes.map(note => (
                  <div
                    key={note.id}
                    onClick={() => setSelectedNote(note)}
                    className="p-4 bg-white rounded-2xl border border-[var(--accent-color)]/20 hover:border-[var(--accent-color)]/40 cursor-pointer transition-all"
                  >
                    <h3 className="font-bold text-[var(--text-color)]">{note.title}</h3>
                    <p className="text-sm text-[var(--text-color)]/60">{note.content.substring(0, 50)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'notebooks' && (
          <div className="flex-1 overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[var(--text-color)]">Notebooks</h2>
              <button
                onClick={() => setShowNewNotebook(true)}
                className="bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg hover:opacity-90"
              >
                + New Notebook
              </button>
            </div>
            {showNewNotebook && (
              <div className="mb-6 p-4 bg-white rounded-2xl border border-[var(--accent-color)]/20 space-y-3">
                <input
                  type="text"
                  value={notebookName}
                  onChange={(e) => setNotebookName(e.target.value)}
                  placeholder="Notebook name"
                  className="w-full px-3 py-2 border border-[var(--accent-color)]/20 rounded-lg focus:outline-none focus:border-[var(--accent-color)]"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddNotebook}
                    className="flex-1 bg-[var(--accent-color)] text-white px-3 py-2 rounded-lg hover:opacity-90"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowNewNotebook(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {selectedNotebook ? (
              <NotebookEditor notebook={selectedNotebook} onUpdateNotebook={setSelectedNotebook} />
            ) : (
              <div className="space-y-2">
                {notebooks.map(nb => (
                  <div
                    key={nb.id}
                    onClick={() => setSelectedNotebook(nb)}
                    className="p-4 bg-white rounded-2xl border border-[var(--accent-color)]/20 hover:border-[var(--accent-color)]/40 cursor-pointer transition-all"
                  >
                    <h3 className="font-bold text-[var(--text-color)]">{nb.name}</h3>
                    <p className="text-sm text-[var(--text-color)]/60">{nb.pages.length} pages</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'flashcards' && (
          <div className="flex-1 overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[var(--text-color)]">Flashcards</h2>
              <button
                onClick={() => setShowNewFlashcard(true)}
                className="bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg hover:opacity-90"
              >
                + New Flashcard Set
              </button>
            </div>
            {showNewFlashcard && (
              <div className="mb-6 p-4 bg-white rounded-2xl border border-[var(--accent-color)]/20 space-y-3">
                <input
                  type="text"
                  value={flashcardName}
                  onChange={(e) => setFlashcardName(e.target.value)}
                  placeholder="Flashcard set name"
                  className="w-full px-3 py-2 border border-[var(--accent-color)]/20 rounded-lg focus:outline-none focus:border-[var(--accent-color)]"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddFlashcard}
                    className="flex-1 bg-[var(--accent-color)] text-white px-3 py-2 rounded-lg hover:opacity-90"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowNewFlashcard(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {selectedFlashcard ? (
              <FlashcardEditor flashcard={selectedFlashcard} onSave={loadFlashcards} />
            ) : (
              <div className="space-y-2">
                {flashcards.map(fc => (
                  <div
                    key={fc.id}
                    className="p-4 bg-white rounded-2xl border border-[var(--accent-color)]/20 hover:border-[var(--accent-color)]/40 transition-all"
                  >
                    <div
                      onClick={() => setSelectedFlashcard(fc)}
                      className="cursor-pointer"
                    >
                      <h3 className="font-bold text-[var(--text-color)]">{fc.title}</h3>
                      <p className="text-sm text-[var(--text-color)]/60">{fc.cards.length} cards</p>
                    </div>
                    <button
                      onClick={() => handleDeleteFlashcard(fc.id)}
                      className="mt-2 text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'whiteboards' && (
          <div className="flex-1 overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[var(--text-color)]">Whiteboards</h2>
              <button
                onClick={() => {
                  setTemplateType('whiteboard')
                  setShowTemplateModal(true)
                }}
                className="bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg hover:opacity-90"
              >
                + New Whiteboard
              </button>
            </div>
            {selectedWhiteboard ? (
              <WhiteboardEditor whiteboard={selectedWhiteboard} onSave={(content) => {
                whiteboardsAPI.updateWhiteboard(selectedWhiteboard.id, selectedWhiteboard.title, content)
              }} />
            ) : (
              <div className="space-y-2">
                {whiteboards.map(wb => (
                  <div
                    key={wb.id}
                    onClick={() => setSelectedWhiteboard(wb)}
                    className="p-4 bg-white rounded-2xl border border-[var(--accent-color)]/20 hover:border-[var(--accent-color)]/40 cursor-pointer transition-all"
                  >
                    <h3 className="font-bold text-[var(--text-color)]">{wb.title}</h3>
                    <p className="text-sm text-[var(--text-color)]/60">{wb.template}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'files' && (
          <div className="flex-1 overflow-y-auto p-8">
            <h2 className="text-2xl font-bold text-[var(--text-color)] mb-6">Files</h2>
            <p className="text-[var(--text-color)]/60">File management coming soon</p>
          </div>
        )}

        {view === 'friends' && (
          <div className="flex-1 overflow-y-auto p-8">
            <h2 className="text-2xl font-bold text-[var(--text-color)] mb-6">Friends</h2>
            <div className="mb-6 space-y-3">
              <input
                type="text"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                placeholder="Search username..."
                className="w-full px-4 py-2 border border-[var(--accent-color)]/20 rounded-lg focus:outline-none focus:border-[var(--accent-color)]"
              />
              {searchUsername && (
                <div className="space-y-2">
                  {allUsers.filter(u => u.includes(searchUsername.toLowerCase())).map(user => (
                    <div key={user} className="flex items-center justify-between p-3 bg-white rounded-lg border border-[var(--accent-color)]/20">
                      <span className="text-[var(--text-color)]">{user}</span>
                      <button
                        onClick={() => handleAddFriend(user)}
                        className="bg-[var(--accent-color)] text-white px-3 py-1 rounded-lg text-sm hover:opacity-90"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <h3 className="font-bold text-[var(--text-color)] mb-3">Your Friends</h3>
            <div className="space-y-2">
              {friends.length === 0 ? (
                <p className="text-[var(--text-color)]/60">No friends yet</p>
              ) : (
                friends.map(friend => (
                  <div key={friend} className="flex items-center justify-between p-3 bg-white rounded-lg border border-[var(--accent-color)]/20">
                    <span className="text-[var(--text-color)]">{friend}</span>
                    <button
                      onClick={() => handleRemoveFriend(friend)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelect={templateType === 'note' ? handleCreateNote : handleCreateWhiteboard}
        type={templateType}
      />
    </div>
  )
}
