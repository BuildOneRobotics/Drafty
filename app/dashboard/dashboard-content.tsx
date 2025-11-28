'use client'

import { useState } from 'react'
import { Note, Notebook } from '@/lib/store'
import NoteEditor from '@/components/NoteEditor'
import NoteList from '@/components/NoteList'
import NotebookEditor from '@/components/NotebookEditor'

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
  const [selectedNotebook, setSelectedNotebook] = useState<Notebook | null>(null)
  const [showNotebookForm, setShowNotebookForm] = useState(false)
  const [notebookName, setNotebookName] = useState('')
  const [folders] = useState<string[]>(['General'])
  const [selectedFolder, setSelectedFolder] = useState('General')

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

  const sidebar = (
    <div className="bg-[var(--accent-color)]/8 rounded-3xl border-2 border-[var(--accent-color)] flex flex-col h-full m-4 md:m-0 md:rounded-2xl">
      <div className="p-6 rounded-t-3xl md:rounded-t-2xl bg-[var(--accent-color)]">
        <p className="text-sm text-white font-semibold">Hello, {user?.name || 'User'}</p>
      </div>

      <div className="flex border-b border-[var(--accent-color)]/20 bg-[var(--accent-color)]/5">
        {['notes', 'notebooks', 'flashcards', 'whiteboards'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 py-3 text-xs md:text-sm font-medium transition-all ${
              activeTab === tab ? 'text-[var(--accent-color)] font-semibold' : 'text-[var(--text-color)]/70'
            }`}
          >
            <span className="capitalize">{tab}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto bg-transparent p-4 space-y-3">
        {activeTab === 'notes' && <NoteList notes={notes} selectedNote={selectedNote} onSelectNote={(note) => {
          setSelectedNote(note)
          setSidebarOpen(false)
        }} />}
        
        {activeTab === 'notebooks' && (
          <>
            {!showNotebookForm ? (
              <button 
                onClick={() => setShowNotebookForm(true)}
                className="w-full p-4 border-2 border-dashed border-[var(--accent-color)]/30 rounded-2xl text-[var(--text-color)] hover:border-[var(--accent-color)]/60 hover:bg-[var(--accent-color)]/10 transition-all"
              >
                + Create Notebook
              </button>
            ) : (
              <div className="p-3 border-2 border-[var(--accent-color)]/30 rounded-2xl space-y-2 bg-[var(--bg-color,#faf8f5)]">
                <input 
                  type="text"
                  value={notebookName}
                  onChange={(e) => setNotebookName(e.target.value)}
                  placeholder="Notebook name"
                  className="w-full px-3 py-2 border border-[var(--accent-color)]/20 rounded-xl focus:outline-none focus:border-[var(--accent-color)] bg-[var(--surface-color,white)]"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button 
                    onClick={handleAddNotebook}
                    className="flex-1 bg-[var(--accent-color)] text-white px-3 py-2 rounded-xl hover:opacity-90 font-semibold"
                  >
                    Create
                  </button>
                  <button 
                    onClick={() => {
                      setNotebookName('')
                      setShowNotebookForm(false)
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 rounded-xl hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <select 
              value={selectedFolder} 
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="w-full p-2 border border-[var(--accent-color)]/20 rounded-xl bg-[var(--surface-color,white)]"
            >
              {folders.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            {notebooks.filter(n => n.folder === selectedFolder).map(nb => (
              <button
                key={nb.id}
                onClick={() => {
                  setSelectedNotebook(nb)
                  setSidebarOpen(false)
                }}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  selectedNotebook?.id === nb.id
                    ? 'bg-[var(--accent-color)] text-white'
                    : 'bg-[var(--accent-color)]/10 text-[var(--text-color)] hover:bg-[var(--accent-color)]/20'
                }`}
              >
                {nb.name}
              </button>
            ))}
          </>
        )}
      </div>

      <div className="p-4 border-t border-[var(--accent-color)]/20 bg-transparent rounded-b-3xl md:rounded-b-2xl">
        <div className="text-center text-xs text-[var(--text-color)]/70">
          {syncing ? 'Syncing...' : 'Auto-sync enabled'}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col md:flex-row flex-1 overflow-hidden relative">
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile toggle button */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-[var(--accent-color)]/10 bg-[var(--surface-color,white)]">
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
        ) : selectedNote ? (
          <NoteEditor note={selectedNote} onSave={onLoadNotes} />
        ) : (
          <div className="flex items-center justify-center h-full bg-[var(--surface-color,white)]">
            <div className="text-center">
              <p className="text-[var(--accent-color)]/70 text-xl">Select a note or create a notebook</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
