'use client'

import { useState, useEffect } from 'react'
import { Note, Notebook, Whiteboard as WhiteboardType, Flashcard, FlashcardFolder } from '@/lib/store'
import NoteEditor from '@/components/NoteEditor'
import NotebookEditor from '@/components/NotebookEditor'
import WhiteboardEditor from '@/components/Whiteboard'
import FlashcardEditor from '@/components/FlashcardEditor'
import TemplateModal from '@/components/TemplateModal'
import { NoteIcon, NotebookIcon, FlashcardIcon, WhiteboardIcon, FilesIcon, FriendsIcon } from '@/components/Icons'
import { whiteboardsAPI, notesAPI, flashcardsAPI } from '@/lib/api'

interface DashboardContentProps {
  notes: Note[]
  onLoadNotes: () => void
  user: any
}

export default function DashboardContent({ notes, onLoadNotes, user }: DashboardContentProps) {
  const [view, setView] = useState<'home' | 'notes' | 'notebooks' | 'flashcards' | 'whiteboards' | 'files' | 'friends'>('home')
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [notebooks, setNotebooks] = useState<Notebook[]>([])
  const [whiteboards, setWhiteboards] = useState<WhiteboardType[]>([])
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [flashcardFolders, setFlashcardFolders] = useState<FlashcardFolder[]>([])
  const [selectedNotebook, setSelectedNotebook] = useState<Notebook | null>(null)
  const [selectedWhiteboard, setSelectedWhiteboard] = useState<WhiteboardType | null>(null)
  const [selectedFlashcard, setSelectedFlashcard] = useState<Flashcard | null>(null)
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [templateType, setTemplateType] = useState<'note' | 'whiteboard'>('note')
  const [notebookName, setNotebookName] = useState('')
  const [showNewNotebook, setShowNewNotebook] = useState(false)
  const [flashcardName, setFlashcardName] = useState('')
  const [showNewFlashcard, setShowNewFlashcard] = useState(false)
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [newFolderColor, setNewFolderColor] = useState('#22c55e')
  const [searchUsername, setSearchUsername] = useState('')
  const [friends, setFriends] = useState<string[]>([])
  const [files, setFiles] = useState<{id: string, name: string, folder?: string}[]>([
    {id: '1', name: 'Document.pdf'},
    {id: '2', name: 'Image.png'},
    {id: '3', name: 'Spreadsheet.xlsx'}
  ])
  const [draggedFile, setDraggedFile] = useState<string | null>(null)
  const allUsers = ['alice', 'bob', 'charlie', 'david', 'emma']

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
      <div className="p-6 bg-[var(--accent-color)] rounded-b-3xl">
        <p className="text-sm text-white font-semibold">Hello, {user?.name || 'User'}</p>
      </div>

      <div className="p-6 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'notes', label: 'Notes', Icon: NoteIcon },
            { id: 'notebooks', label: 'Notebooks', Icon: NotebookIcon },
            { id: 'flashcards', label: 'Flashcards', Icon: FlashcardIcon },
            { id: 'whiteboards', label: 'Whiteboards', Icon: WhiteboardIcon }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id as any)}
              className={`p-4 rounded-2xl transition-all text-center hover:scale-105 transform duration-200 ${
                view === item.id
                  ? 'bg-[var(--accent-color)] text-white shadow-md'
                  : 'bg-[var(--accent-color)]/10 text-[var(--text-color)] hover:bg-[var(--accent-color)]/20'
              }`}
            >
              <div className="flex justify-center mb-2"><item.Icon /></div>
              <div className="text-xs font-semibold">{item.label}</div>
            </button>
          ))}
        </div>

        <div className="border-t border-[var(--accent-color)]/20 pt-3 space-y-2">
          {[
            { id: 'files', label: 'Files', Icon: FilesIcon },
            { id: 'friends', label: 'Friends', Icon: FriendsIcon }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id as any)}
              className={`w-full p-3 rounded-xl transition-all text-left text-sm flex items-center gap-2 hover:scale-105 transform duration-200 ${
                view === item.id
                  ? 'bg-[var(--accent-color)] text-white shadow-md'
                  : 'bg-[var(--accent-color)]/10 text-[var(--text-color)] hover:bg-[var(--accent-color)]/20'
              }`}
            >
              <item.Icon />
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
        {view === 'flashcards' && (
          <div className="flex-1 overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[var(--text-color)]">Flashcards</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowNewFolder(true)}
                  className="bg-[var(--accent-color)]/20 text-[var(--accent-color)] px-4 py-2 rounded-lg hover:bg-[var(--accent-color)]/30 transition-all"
                >
                  + New Folder
                </button>
                <button
                  onClick={() => setShowNewFlashcard(true)}
                  className="bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all"
                >
                  + New Flashcard Set
                </button>
              </div>
            </div>
            {showNewFolder && (
              <div className="mb-6 p-4 bg-white rounded-2xl border border-[var(--accent-color)]/20 space-y-3">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder name"
                  className="w-full px-3 py-2 border border-[var(--accent-color)]/20 rounded-lg focus:outline-none focus:border-[var(--accent-color)] text-[var(--text-color)]"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newFolderColor}
                    onChange={(e) => setNewFolderColor(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <span className="text-sm text-[var(--text-color)]">{newFolderColor}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddFolder}
                    className="flex-1 bg-[var(--accent-color)] text-white px-3 py-2 rounded-lg hover:opacity-90"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowNewFolder(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {showNewFlashcard && (
              <div className="mb-6 p-4 bg-white rounded-2xl border border-[var(--accent-color)]/20 space-y-3">
                <input
                  type="text"
                  value={flashcardName}
                  onChange={(e) => setFlashcardName(e.target.value)}
                  placeholder="Flashcard set name"
                  className="w-full px-3 py-2 border border-[var(--accent-color)]/20 rounded-lg focus:outline-none focus:border-[var(--accent-color)] text-[var(--text-color)]"
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
              <div className="space-y-4">
                {flashcardFolders.map(folder => {
                  const folderFlashcards = flashcards.filter(fc => fc.folderId === folder.id)
                  return (
                    <div key={folder.id} className="bg-white rounded-2xl border border-[var(--accent-color)]/20 overflow-hidden">
                      <button
                        onClick={() => setExpandedFolder(expandedFolder === folder.id ? null : folder.id)}
                        className="w-full p-4 flex items-center justify-between hover:bg-[var(--accent-color)]/5 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{backgroundColor: folder.color}}></div>
                          <span className="font-semibold text-[var(--text-color)]">{folder.name}</span>
                          <span className="text-xs text-[var(--text-color)]/60">({folderFlashcards.length})</span>
                        </div>
                        <span className="text-[var(--text-color)]/60">{expandedFolder === folder.id ? '▼' : '▶'}</span>
                      </button>
                      {expandedFolder === folder.id && (
                        <div className="border-t border-[var(--accent-color)]/20 p-4 space-y-2">
                          {folderFlashcards.map(fc => (
                            <div key={fc.id} className="p-3 bg-[var(--accent-color)]/5 rounded-lg cursor-pointer hover:bg-[var(--accent-color)]/10" onClick={() => setSelectedFlashcard(fc)}>
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
                  <div className="bg-white rounded-2xl border border-[var(--accent-color)]/20 p-4 space-y-2">
                    <h3 className="font-semibold text-[var(--text-color)] mb-3">Ungrouped</h3>
                    {flashcards.filter(fc => !fc.folderId).map(fc => (
                      <div key={fc.id} className="p-3 bg-[var(--accent-color)]/5 rounded-lg cursor-pointer hover:bg-[var(--accent-color)]/10" onClick={() => setSelectedFlashcard(fc)}>
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

        {view === 'files' && (
          <div className="flex-1 overflow-y-auto p-8">
            <h2 className="text-2xl font-bold text-[var(--text-color)] mb-6">Files</h2>
            <div className="space-y-3">
              {files.map(file => (
                <div
                  key={file.id}
                  draggable
                  onDragStart={() => setDraggedFile(file.id)}
                  onDragEnd={() => setDraggedFile(null)}
                  className={`p-4 bg-white rounded-2xl border border-[var(--accent-color)]/20 cursor-move transition-all ${
                    draggedFile === file.id ? 'opacity-50' : 'hover:border-[var(--accent-color)]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[var(--text-color)]">{file.name}</p>
                      {file.folder && <p className="text-xs text-[var(--text-color)]/60">Folder: {file.folder}</p>}
                    </div>
                    <span className="text-xs text-[var(--text-color)]/40">⋮⋮</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'home' && (
          <div className="flex-1 overflow-y-auto p-8">
            <h1 className="text-4xl font-bold text-[var(--text-color)] mb-8">Welcome, {user?.name || 'User'}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'notes', label: 'Notes', Icon: NoteIcon, count: notes.length },
                { id: 'notebooks', label: 'Notebooks', Icon: NotebookIcon, count: notebooks.length },
                { id: 'flashcards', label: 'Flashcards', Icon: FlashcardIcon, count: flashcards.length },
                { id: 'whiteboards', label: 'Whiteboards', Icon: WhiteboardIcon, count: whiteboards.length }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id as any)}
                  className="p-6 bg-white rounded-3xl border border-[var(--accent-color)]/20 hover:border-[var(--accent-color)]/40 hover:shadow-lg transition-all text-left hover:scale-105 transform duration-200"
                >
                  <div className="flex justify-center mb-4 text-[var(--accent-color)]"><item.Icon /></div>
                  <h3 className="text-xl font-bold text-[var(--text-color)] mb-1 text-center">{item.label}</h3>
                  <p className="text-sm text-[var(--text-color)]/60 text-center">{item.count} items</p>
                </button>
              ))}
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
