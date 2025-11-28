'use client'

import { Note } from '@/lib/store'
import { notesAPI } from '@/lib/api'
import { useState } from 'react'

interface NoteListProps {
  notes: Note[]
  selectedNote: Note | null
  onSelectNote: (note: Note) => void
  onDeleteNote?: (id: string) => void
}

export default function NoteList({ notes, selectedNote, onSelectNote, onDeleteNote }: NoteListProps) {
  const [deleting, setDeleting] = useState<string | null>(null)
  const [renaming, setRenaming] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState('')

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleting(id)
    try {
      await notesAPI.deleteNote(id)
      if (onDeleteNote) {
        onDeleteNote(id)
      } else {
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to delete note:', error)
    } finally {
      setDeleting(null)
    }
  }

  const handleRename = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const note = notes.find(n => n.id === id)
    if (!note) return
    setRenaming(id)
    setNewTitle(note.title)
  }

  const saveRename = async (id: string) => {
    if (!newTitle.trim()) return
    const note = notes.find(n => n.id === id)
    if (!note) return
    try {
      await notesAPI.updateNote(id, newTitle, note.content, note.tags)
      window.location.reload()
    } catch (error) {
      console.error('Failed to rename note:', error)
    } finally {
      setRenaming(null)
    }
  }

  return (
    <div className="space-y-2">
      {notes.map((note) => (
        <div
          key={note.id}
          onClick={() => onSelectNote(note)}
          className={`p-4 rounded-lg cursor-pointer transition-all transform hover:translate-y-[-2px] relative ${ 
            selectedNote?.id === note.id
              ? 'bg-[var(--accent-color)]/10'
              : 'bg-[var(--bg-color)] hover:bg-[var(--accent-color)]/5'
          }`}
        >
          {selectedNote?.id === note.id && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent-color)] rounded-l-lg"></div>
          )}
          {renaming === note.id ? (
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="flex-1 px-3 py-2 border border-[var(--accent-color)]/20 rounded-lg outline-none bg-[var(--surface-color,white)]"
                autoFocus
              />
              <button
                onClick={() => saveRename(note.id)}
                className="text-green-600 hover:text-green-700 text-sm font-bold px-2"
              >
                ✓
              </button>
              <button
                onClick={() => setRenaming(null)}
                className="text-red-500 hover:text-red-700 text-sm font-bold px-2"
              >
                ✕
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[var(--text-color)] truncate">{note.title}</h3>
                  <p className="text-sm text-[var(--text-color)]/70 truncate mt-1">{note.content.substring(0, 50)}</p>
                  <p className="text-xs text-[var(--text-color)]/50 mt-2">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-1 ml-2">
                  <button
                    onClick={(e) => handleRename(note.id, e)}
                    className="text-blue-400 hover:text-blue-600 text-sm transition-colors"
                    title="Rename"
                  >
                    ✎
                  </button>
                  <button
                    onClick={(e) => handleDelete(note.id, e)}
                    disabled={deleting === note.id}
                    className="text-red-400 hover:text-red-600 text-sm transition-colors"
                    title="Delete"
                  >
                    {deleting === note.id ? '...' : '✕'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
