'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Note } from '@/lib/store'
import { notesAPI } from '@/lib/api'
import ConfirmDialog from './ConfirmDialog'
import TemplateSelector from './TemplateSelector'
import { useMobile } from '@/lib/useMobile'
import { noteTemplates, Template } from '@/lib/templates'

interface NotesManagerProps {
  user: { id: string; name: string; email: string } | null
}

export default function NotesManager({ user }: NotesManagerProps) {
  const { isPhone } = useMobile()
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [showNewNote, setShowNewNote] = useState(false)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [newNoteTitle, setNewNoteTitle] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string, title: string } | null>(null)
  const [showNotesList, setShowNotesList] = useState(true)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)

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

  const handleNewNoteClick = () => {
    setShowTemplateSelector(true)
  }

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template)
    setShowTemplateSelector(false)
    setShowNewNote(true)
    if (template.id === 'blank') {
      setNewNoteTitle('')
    } else {
      setNewNoteTitle(template.name)
    }
  }

  const createNote = async () => {
    if (!newNoteTitle.trim()) return

    const content = selectedTemplate?.content || ''

    try {
      const response = await notesAPI.createNote(newNoteTitle.trim(), content, [])
      if (response?.data) {
        setNotes([response.data, ...notes])
        setSelectedNote(response.data)
        setNewNoteTitle('')
        setShowNewNote(false)
        setSelectedTemplate(null)
        if (isPhone) setShowNotesList(false)
      }
    } catch (error) {
      console.error('Failed to create note:', error)
    }
  }

  const updateNote = async (noteId: string, title: string, content: string, tags: string[] = []) => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Update local state immediately
    const updatedNote: Note = { ...selectedNote!, title, content, tags, updatedAt: new Date().toISOString() }
    setSelectedNote(updatedNote)
    setNotes(notes.map((note: Note) => note.id === noteId ? updatedNote : note))

    // Debounce save for 1 second
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        setSaving(true)
        await notesAPI.updateNote(noteId, title, content, tags)
        // Save to localStorage as backup
        localStorage.setItem(`notes-${user?.id}`, JSON.stringify(notes.map((note: Note) => note.id === noteId ? updatedNote : note)))
      } catch (error) {
        console.error('Failed to update note:', error)
        // Save locally even if API fails
        localStorage.setItem(`notes-${user?.id}`, JSON.stringify(notes.map((note: Note) => note.id === noteId ? updatedNote : note)))
      } finally {
        setSaving(false)
      }
    }, 1000)
  }

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const deleteNote = async (noteId: string) => {
    try {
      await notesAPI.deleteNote(noteId)
      setNotes(notes.filter((note: Note) => note.id !== noteId))
      if (selectedNote?.id === noteId) {
        setSelectedNote(null)
      }
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Failed to delete note:', error)
      setDeleteConfirm(null)
    }
  }

  const filteredNotes = notes.filter((note: Note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
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
      <div className={`${isPhone ? 'p-4' : 'p-6'} border-b border-[var(--accent-color)]/20 bg-white`}>
        <div className="flex justify-between items-center mb-4">
          {isPhone && selectedNote && !showNotesList ? (
            <button
              onClick={() => setShowNotesList(true)}
              className="text-[var(--accent-color)] hover:opacity-70"
            >
              ← Back
            </button>
          ) : (
            <h2 className={`${isPhone ? 'text-xl' : 'text-2xl'} font-bold text-[var(--text-color)]`}>Notes</h2>
          )}
          <button
            onClick={handleNewNoteClick}
            className={`bg-[var(--accent-color)] text-white ${isPhone ? 'px-3 py-2 text-sm' : 'px-4 py-2'} rounded-lg hover:opacity-90 transition-all`}
          >
            + {isPhone ? 'New' : 'New Note'}
          </button>
        </div>
        
        {/* Search */}
        {(!isPhone || showNotesList) && (
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
        )}
      </div>

      {/* New Note Form */}
      {showNewNote && (
        <div className={`${isPhone ? 'p-4' : 'p-6'} bg-[var(--accent-color)]/5 border-b border-[var(--accent-color)]/20`}>
          <div className={`flex ${isPhone ? 'flex-col' : 'flex-row'} gap-3`}>
            <input
              type="text"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              placeholder="Note title"
              className="flex-1 px-3 py-2 border border-[var(--accent-color)]/20 rounded-lg focus:outline-none focus:border-[var(--accent-color)] text-[var(--text-color)]"
              autoFocus
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') createNote()
                if (e.key === 'Escape') setShowNewNote(false)
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={createNote}
                className="flex-1 bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg hover:opacity-90"
              >
                Create
              </button>
              <button
                onClick={() => setShowNewNote(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Notes List */}
        {(!isPhone || showNotesList) && (
          <div className={`${isPhone ? 'w-full' : 'w-80'} border-r border-[var(--accent-color)]/20 bg-white overflow-y-auto`}>
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
                  {filteredNotes.map((note: Note) => (
                    <div
                      key={note.id}
                      onClick={() => {
                        setSelectedNote(note)
                        if (isPhone) setShowNotesList(false)
                      }}
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
                            {note.content.replace(/<[^>]*>/g, '').substring(0, 100) || 'No content'}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className={`text-xs ${
                              selectedNote?.id === note.id ? 'text-white/70' : 'text-[var(--text-color)]/60'
                            }`}>
                              {formatDate(note.updatedAt)}
                            </p>
                            {note.tags.length > 0 && (
                              <div className="flex gap-1">
                                {note.tags.slice(0, 2).map((tag: string, index: number) => (
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
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation()
                            setDeleteConfirm({ id: note.id, title: note.title })
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
        )}

        {/* Note Editor */}
        {selectedNote && (!isPhone || !showNotesList) ? (
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            <div className={`${isPhone ? 'p-3' : 'p-4'} border-b border-[var(--accent-color)]/20`}>
              <input
                type="text"
                value={selectedNote.title}
                onChange={(e) => updateNote(selectedNote.id, e.target.value, selectedNote.content, selectedNote.tags)}
                className={`${isPhone ? 'text-lg' : 'text-xl'} font-bold w-full outline-none text-[var(--text-color)] bg-transparent`}
                placeholder="Note title"
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-2 flex-wrap">
                  {selectedNote.tags.map((tag: string, index: number) => (
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
            
            {/* Rich Text Toolbar */}
            <div className={`${isPhone ? 'p-2' : 'p-3'} border-b border-[var(--accent-color)]/20 bg-[var(--accent-color)]/5 flex gap-2 overflow-x-auto`}>
              <button
                onClick={() => formatText('bold')}
                className="px-3 py-1.5 bg-white border border-[var(--accent-color)]/20 rounded hover:bg-[var(--accent-color)]/10 font-bold text-sm"
                title="Bold"
              >
                B
              </button>
              <button
                onClick={() => formatText('italic')}
                className="px-3 py-1.5 bg-white border border-[var(--accent-color)]/20 rounded hover:bg-[var(--accent-color)]/10 italic text-sm"
                title="Italic"
              >
                I
              </button>
              <button
                onClick={() => formatText('underline')}
                className="px-3 py-1.5 bg-white border border-[var(--accent-color)]/20 rounded hover:bg-[var(--accent-color)]/10 underline text-sm"
                title="Underline"
              >
                U
              </button>
              <button
                onClick={() => formatText('insertUnorderedList')}
                className="px-3 py-1.5 bg-white border border-[var(--accent-color)]/20 rounded hover:bg-[var(--accent-color)]/10 text-sm"
                title="Bullet List"
              >
                • List
              </button>
              <button
                onClick={() => formatText('insertOrderedList')}
                className="px-3 py-1.5 bg-white border border-[var(--accent-color)]/20 rounded hover:bg-[var(--accent-color)]/10 text-sm"
                title="Numbered List"
              >
                1. List
              </button>
              <select
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => formatText('fontSize', e.target.value)}
                className="px-2 py-1.5 bg-white border border-[var(--accent-color)]/20 rounded hover:bg-[var(--accent-color)]/10 text-sm"
                defaultValue="3"
              >
                <option value="1">Tiny</option>
                <option value="2">Small</option>
                <option value="3">Normal</option>
                <option value="4">Large</option>
                <option value="5">Huge</option>
              </select>
              <input
                type="color"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => formatText('foreColor', e.target.value)}
                className="w-10 h-8 border border-[var(--accent-color)]/20 rounded cursor-pointer"
                title="Text Color"
              />
            </div>

            <div className={`flex-1 ${isPhone ? 'p-3' : 'p-4'} overflow-y-auto`}>
              <div
                ref={editorRef}
                contentEditable
                onInput={(e) => {
                  const content = (e.currentTarget as HTMLDivElement).innerHTML
                  updateNote(selectedNote.id, selectedNote.title, content, selectedNote.tags)
                }}
                className="w-full h-full outline-none text-[var(--text-color)] bg-transparent leading-relaxed min-h-[200px]"
                dangerouslySetInnerHTML={{ __html: selectedNote.content || '' }}
                suppressContentEditableWarning
              />
            </div>
          </div>
        ) : (
          !isPhone && (
            <div className="flex-1 flex items-center justify-center text-[var(--text-color)]/60">
              {notes.length === 0 ? 'Create your first note to get started' : 'Select a note to start editing'}
            </div>
          )
        )}
      </div>

      {/* Template Selector */}
      {showTemplateSelector && (
        <TemplateSelector
          templates={noteTemplates}
          onSelect={handleTemplateSelect}
          onCancel={() => setShowTemplateSelector(false)}
          title="Choose a Note Template"
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        title="Delete Note?"
        message={`Are you sure you want to delete "${deleteConfirm?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={() => {
          if (deleteConfirm) {
            deleteNote(deleteConfirm.id)
          }
        }}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  )
}