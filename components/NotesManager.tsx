'use client'

import React, { useState, useEffect } from 'react'
import { Note } from '@/lib/store'
import { notesAPI } from '@/lib/api'

interface NotesManagerProps {
  user: { id: string; name: string; email: string } | null
}

export default function NotesManager({ user }: NotesManagerProps) {
  // Reference user to avoid unused parameter warning
  void user
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [showNewNote, setShowNewNote] = useState(false)
  const [newNoteTitle, setNewNoteTitle] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = async () => {
    try {
      setLoading(true)
      const response = await notesAPI.getNotes()
      setNotes(response.data || [])
    } catch (error) {
      console.error('Failed to load notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const createNote = async () => {
    if (!newNoteTitle.trim()) return

    try {
      const response = await notesAPI.createNote(newNoteTitle.trim(), '', [])
      if (response?.data) {
        setNotes([response.data, ...notes])
        setSelectedNote(response.data)
        setNewNoteTitle('')
        setShowNewNote(false)
      }
    } catch (error) {
      console.error('Failed to create note:', error)
    }
  }

  const updateNote = async (noteId: string, title: string, content: string, tags: string[] = []) => {
    try {
      setSaving(true)
      await notesAPI.updateNote(noteId, title, content, tags)
      const updatedNote = { ...selectedNote!, title, content, tags, updatedAt: new Date().toISOString() }
      setSelectedNote(updatedNote)
      setNotes(notes.map(note => note.id === noteId ? updatedNote : note))
    } catch (error) {
      console.error('Failed to update note:', error)
    } finally {
      setSaving(false)
    }
  }

  const deleteNote = async (noteId: string) => {
    try {
      await notesAPI.deleteNote(noteId)
      setNotes(notes.filter(note => note.id !== noteId))
      if (selectedNote?.id === noteId) {
        setSelectedNote(null)
      }
    } catch (error) {
      console.error('Failed to delete note:', error)
    }
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-[var(--text-color)]">Loading notes...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[var(--accent-color)]/20 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[var(--text-color)]">Notes</h2>
          <button
            onClick={() => setShowNewNote(true)}
            className="bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all"
          >
            + New Note
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notes..."
            className="w-full px-4 py-2 pl-10 border border-[var(--accent-color)]/20 rounded-lg focus:outline-none focus:border-[var(--accent-color)] text-[var(--text-color)]"
          />
          <svg className="absolute left-3 top-2.5 w-5 h-5 text-[var(--text-color)]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* New Note Form */}
      {showNewNote && (
        <div className="p-6 bg-[var(--accent-color)]/5 border-b border-[var(--accent-color)]/20">
          <div className="flex gap-3">
            <input
              type="text"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              placeholder="Note title"
              className="flex-1 px-3 py-2 border border-[var(--accent-color)]/20 rounded-lg focus:outline-none focus:border-[var(--accent-color)] text-[var(--text-color)]"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') createNote()
                if (e.key === 'Escape') setShowNewNote(false)
              }}
            />
            <button
              onClick={createNote}
              className="bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg hover:opacity-90"
            >
              Create
            </button>
            <button
              onClick={() => setShowNewNote(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Notes List */}
        <div className="w-80 border-r border-[var(--accent-color)]/20 bg-white overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-[var(--text-color)]">
                {searchTerm ? `Search Results (${filteredNotes.length})` : `All Notes (${notes.length})`}
              </h3>
            </div>
            
            {filteredNotes.length === 0 ? (
              <p className="text-[var(--text-color)]/60 text-sm">
                {searchTerm ? 'No notes match your search.' : 'No notes yet. Create one to get started!'}
              </p>
            ) : (
              <div className="space-y-2">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => setSelectedNote(note)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedNote?.id === note.id
                        ? 'bg-[var(--accent-color)] text-white'
                        : 'bg-[var(--accent-color)]/5 hover:bg-[var(--accent-color)]/10 text-[var(--text-color)]'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{note.title}</p>
                        <p className={`text-sm mt-1 line-clamp-2 ${
                          selectedNote?.id === note.id ? 'text-white/70' : 'text-[var(--text-color)]/60'
                        }`}>
                          {note.content.substring(0, 100) || 'No content'}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className={`text-xs ${
                            selectedNote?.id === note.id ? 'text-white/70' : 'text-[var(--text-color)]/60'
                          }`}>
                            {formatDate(note.updatedAt)}
                          </p>
                          {note.tags.length > 0 && (
                            <div className="flex gap-1">
                              {note.tags.slice(0, 2).map((tag, index) => (
                                <span
                                  key={index}
                                  className={`text-xs px-2 py-1 rounded ${
                                    selectedNote?.id === note.id
                                      ? 'bg-white/20 text-white'
                                      : 'bg-[var(--accent-color)]/20 text-[var(--accent-color)]'
                                  }`}
                                >
                                  {tag}
                                </span>
                              ))}
                              {note.tags.length > 2 && (
                                <span className={`text-xs ${
                                  selectedNote?.id === note.id ? 'text-white/70' : 'text-[var(--text-color)]/60'
                                }`}>
                                  +{note.tags.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNote(note.id)
                        }}
                        className={`ml-2 text-xs hover:opacity-70 ${
                          selectedNote?.id === note.id ? 'text-white' : 'text-red-500'
                        }`}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Note Editor */}
        {selectedNote ? (
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            <div className="p-4 border-b border-[var(--accent-color)]/20">
              <input
                type="text"
                value={selectedNote.title}
                onChange={(e) => updateNote(selectedNote.id, e.target.value, selectedNote.content, selectedNote.tags)}
                className="text-xl font-bold w-full outline-none text-[var(--text-color)] bg-transparent"
                placeholder="Note title"
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-2">
                  {selectedNote.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-[var(--accent-color)]/20 text-[var(--accent-color)] rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {saving && (
                  <p className="text-xs text-[var(--accent-color)]">Saving...</p>
                )}
              </div>
            </div>
            <div className="flex-1 p-4">
              <textarea
                value={selectedNote.content}
                onChange={(e) => updateNote(selectedNote.id, selectedNote.title, e.target.value, selectedNote.tags)}
                className="w-full h-full resize-none outline-none text-[var(--text-color)] bg-transparent"
                placeholder="Start writing your note here..."
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[var(--text-color)]/60">
            {notes.length === 0 ? 'Create your first note to get started' : 'Select a note to start editing'}
          </div>
        )}
      </div>
    </div>
  )
}