'use client'

import { useState, useEffect } from 'react'
import { Note, Notebook, Whiteboard as WhiteboardType } from '@/lib/store'
import NoteEditor from '@/components/NoteEditor'
import NoteList from '@/components/NoteList'
import NotebookEditor from '@/components/NotebookEditor'
import WhiteboardEditor from '@/components/Whiteboard'
import TemplateModal from '@/components/TemplateModal'
import { whiteboardsAPI, notesAPI } from '@/lib/api'

interface DashboardContentProps {
  notes: Note[]
  onLoadNotes: () => void
  user: any
  syncing: boolean
}

export default function DashboardContent({ notes, onLoadNotes, user, syncing }: DashboardContentProps) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0] || null)
  const [activeTab, setActiveTab] = useState<'notes' | 'notebooks' | 'flashcards' | 'whiteboards'>('notes')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notebooks, setNotebooks] = useState<Notebook[]>([])
  const [whiteboards, setWhiteboards] = useState<WhiteboardType[]>([])
  const [selectedNotebook, setSelectedNotebook] = useState<Notebook | null>(null)
  const [selectedWhiteboard, setSelectedWhiteboard] = useState<WhiteboardType | null>(null)
  const [showNotebookForm, setShowNotebookForm] = useState(false)
  const [notebookName, setNotebookName] = useState('')
  const [folders] = useState<string[]>(['General'])
  const [selectedFolder, setSelectedFolder] = useState('General')
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [templateType, setTemplateType] = useState<'note' | 'whiteboard'>('note')

  useEffect(() => {
    loadWhiteboards()
  }, [])

  const loadWhiteboards = async () => {
    try {
      const response = await whiteboardsAPI.getWhiteboards()
      setWhiteboards(response.data)
    } catch (error) {
      console.error('Failed to load whiteboards:', error)
    }
  }

  const handleAddNotebook = () => {
    if (!notebookName.trim()) return
    const newNotebook: Notebook = {
      id: Date.now().toString(),
      name: notebookName,
      folder: selectedFolder,
      pages: [{ id: '1', number: 1, title: 'Page 1', content: '' }]
    }
    setNotebooks([...notebooks, newNotebook])
    setSelectedNotebook(newNotebook)
    setNotebookName('')
    setShowNotebookForm(false)
  }

  const handleCreateNote = async () => {
    try {
      const response = await notesAPI.createNote(`New Note ${new Date().toLocaleTimeString()}`, '', [])
      onLoadNotes()
      setSelectedNote(response.data)
    } catch (error) {
      console.error('Failed to create note:', error)
    }
  }

  const handleCreateWhiteboard = async (template: string) => {
    try {
      const response = await whiteboardsAPI.createWhiteboard(`Whiteboard ${new Date().toLocaleTimeString()}`, template)
      setWhiteboards([response.data, ...whiteboards])
      setSelectedWhiteboard(response.data)
    } catch (error) {
      console.error('Failed to create whiteboard:', error)
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

  const handleDeleteNotebook = (id: string) => {
    setNotebooks(notebooks.filter(n => n.id !== id))
    if (selectedNotebook?.id === id) setSelectedNotebook(null)
  }

  const recentItems = [
    ...notes.slice(0, 3).map(n => ({ type: 'note' as const, ...n })),
    ...whiteboards.slice(0, 3).map(w => ({ type: 'whiteboard' as const, ...w })),
  ].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5)

  const sidebar = (
    <div className="bg-white border-r border-[var(--accent-color)]/20 flex flex-col h-full">
      <div className="p-6 bg-[var(--accent-color)]">
        <p className="text-sm text-white font-semibold">Hello, {user?.name || 'User'}</p>
      </div>

      <div className="flex border-b border-[var(--accent-color)]/20">
        {['notes', 'notebooks', 'flashcards', 'whiteboards'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 py-3 text-xs md:text-sm font-medium transition-all ${
              activeTab === tab ? 'text-[var(--accent-color)] border-b-2 border-[var(--accent-color)]' : 'text-[var(--text-color)]/70'
            }`}
          >
            <span className="capitalize">{tab}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeTab === 'notes' && (
          <>
            <button 
              onClick={() => {
                setTemplateType('note')
                setShowTemplateModal(true)
              }}
              className="w-full p-3 border-2 border-dashed border-[var(--accent-color)]/30 rounded-lg text-[var(--text-color)] hover:border-[var(--accent-color)]/60 hover:bg-[var(--accent-color)]/5 transition-all text-sm"
            >
              + New Note
            </button>
            <NoteList notes={notes} selectedNote={selectedNote} onSelectNote={(note) => {
              setSelectedNote(note)
              setSidebarOpen(false)
            }} onDeleteNote={handleDeleteNote} />
          </>
        )}
        
        {activeTab === 'notebooks' && (
          <>
            {!showNotebookForm ? (
              <button 
                onClick={() => setShowNotebookForm(true)}
                className="w-full p-3 border-2 border-dashed border-[var(--accent-color)]/30 rounded-lg text-[var(--text-color)] hover:border-[var(--accent-color)]/60 hover:bg-[var(--accent-color)]/5 transition-all text-sm"
              >
                + Create Notebook
              </button>
            ) : (
              <div className="p-3 border-2 border-[var(--accent-color)]/30 rounded-lg space-y-2 bg-white">
                <input 
                  type="text"
                  value={notebookName}
                  onChange={(e) => setNotebookName(e.target.value)}
                  placeholder="Notebook name"
                  className="w-full px-3 py-2 border border-[var(--accent-color)]/20 rounded-lg focus:outline-none focus:border-[var(--accent-color)] bg-white text-sm"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button 
                    onClick={handleAddNotebook}
                    className="flex-1 bg-[var(--accent-color)] text-white px-3 py-2 rounded-lg hover:opacity-90 font-semibold text-sm"
                  >
                    Create
                  </button>
                  <button 
                    onClick={() => {
                      setNotebookName('')
                      setShowNotebookForm(false)
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-400 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <select 
              value={selectedFolder} 
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="w-full p-2 border border-[var(--accent-color)]/20 rounded-lg bg-white text-sm"
            >
              {folders.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            {notebooks.filter(n => n.folder === selectedFolder).map(nb => (
              <div key={nb.id} className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedNotebook(nb)
                    setSidebarOpen(false)
                  }}
                  className={`flex-1 text-left p-3 rounded-lg transition-all text-sm ${
                    selectedNotebook?.id === nb.id
                      ? 'bg-[var(--accent-color)] text-white'
                      : 'bg-[var(--accent-color)]/10 text-[var(--text-color)] hover:bg-[var(--accent-color)]/20'
                  }`}
                >
                  {nb.name}
                </button>
                <button
                  onClick={() => handleDeleteNotebook(nb.id)}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                >
                  ✕
                </button>
              </div>
            ))}
          </>
        )}

        {activeTab === 'whiteboards' && (
          <>
            <button 
              onClick={() => {
                setTemplateType('whiteboard')
                setShowTemplateModal(true)
              }}
              className="w-full p-3 border-2 border-dashed border-[var(--accent-color)]/30 rounded-lg text-[var(--text-color)] hover:border-[var(--accent-color)]/60 hover:bg-[var(--accent-color)]/5 transition-all text-sm"
            >
              + New Whiteboard
            </button>
            {whiteboards.map(wb => (
              <div key={wb.id} className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedWhiteboard(wb)
                    setSidebarOpen(false)
                  }}
                  className={`flex-1 text-left p-3 rounded-lg transition-all text-sm ${
                    selectedWhiteboard?.id === wb.id
                      ? 'bg-[var(--accent-color)] text-white'
                      : 'bg-[var(--accent-color)]/10 text-[var(--text-color)] hover:bg-[var(--accent-color)]/20'
                  }`}
                >
                  {wb.title}
                </button>
                <button
                  onClick={() => handleDeleteWhiteboard(wb.id)}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                >
                  ✕
                </button>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="p-4 border-t border-[var(--accent-color)]/20 bg-white">
        <div className="text-center text-xs text-[var(--text-color)]/70">
          {syncing ? 'Syncing...' : 'Auto-sync enabled'}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
      {/* Mobile sidebar at top */}
      <div className="md:hidden">
        {sidebarOpen && (
          <div className="w-full max-h-96 overflow-y-auto">
            {sidebar}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-80 md:flex-col">
        {sidebar}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-color,#f0fdf4)]">
        {/* Mobile toggle button */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-[var(--accent-color)]/20 bg-white">
          <span className="text-sm font-semibold text-[var(--text-color)]">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-[var(--accent-color)]/10 rounded-lg"
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>
        </div>

        {selectedNotebook ? (
          <NotebookEditor notebook={selectedNotebook} onUpdateNotebook={(nb) => {
            setNotebooks(notebooks.map(n => n.id === nb.id ? nb : n))
            setSelectedNotebook(nb)
          }} />
        ) : selectedWhiteboard ? (
          <WhiteboardEditor whiteboard={selectedWhiteboard} onSave={(content) => {
            whiteboardsAPI.updateWhiteboard(selectedWhiteboard.id, selectedWhiteboard.title, content)
          }} />
        ) : selectedNote ? (
          <NoteEditor note={selectedNote} onSave={onLoadNotes} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold text-[var(--text-color)] mb-4">Welcome to Drafty</h2>
              <p className="text-[var(--text-color)]/70 mb-6">Select an item from the sidebar or create a new one to get started</p>
              <div className="space-y-2">
                {recentItems.length > 0 && (
                  <>
                    <p className="text-sm font-semibold text-[var(--text-color)]/60 mb-3">Recent Items</p>
                    {recentItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.type === 'note') setSelectedNote(item as Note)
                          else setSelectedWhiteboard(item as WhiteboardType)
                        }}
                        className="w-full p-3 text-left bg-white hover:bg-[var(--accent-color)]/10 rounded-lg text-[var(--text-color)] transition-all border border-[var(--accent-color)]/20"
                      >
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-[var(--text-color)]/60">{item.type}</div>
                      </button>
                    ))}
                  </>
                )}
              </div>
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
