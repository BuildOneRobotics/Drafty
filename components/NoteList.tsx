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

  return (
    <div className="space-y-2">
      {notes.map((note) => (
        <div
          key={note.id}
          onClick={() => onSelectNote(note)}
          className={`p-4 rounded-lg cursor-pointer transition-all transform hover:translate-y-[-2px] relative flex justify-between items-start ${ 
            selectedNote?.id === note.id
              ? 'bg-[var(--accent-color)]/10'
              : 'bg-[var(--bg-color)] hover:bg-[var(--accent-color)]/5'
          }`}
        >
          {selectedNote?.id === note.id && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent-color)] rounded-l-lg"></div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-[var(--text-color)] truncate">{note.title}</h3>
            <p className="text-sm text-[var(--text-color)] truncate mt-1">{note.content.substring(0, 50)}</p>
            <p className="text-xs text-[var(--text-color)] mt-2">
              {new Date(note.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={(e) => handleDelete(note.id, e)}
            disabled={deleting === note.id}
            className="text-red-400 hover:text-red-600 text-sm transition-colors ml-2 flex-shrink-0"
            title="Delete"
          >
            {deleting === note.id ? '...' : '✕'}
          </button>
        </div>
      ))}
    </div>
  )
}
