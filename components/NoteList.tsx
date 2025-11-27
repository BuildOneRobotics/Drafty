'use client'

import { Note } from '@/lib/store'
import { notesAPI } from '@/lib/api'
import { useState } from 'react'

interface NoteListProps {
  notes: Note[]
  selectedNote: Note | null
  onSelectNote: (note: Note) => void
}

export default function NoteList({ notes, selectedNote, onSelectNote }: NoteListProps) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleting(id)
    try {
      await notesAPI.deleteNote(id)
      window.location.reload()
    } catch (error) {
      console.error('Failed to delete note:', error)
    } finally {
      setDeleting(null)
    }
  }

  const handleNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
    }
    onSelectNote(newNote)
  }

  return (
    <div className="p-4">
      <button
        onClick={handleNewNote}
        className="w-full bg-[var(--accent-color)] text-white py-3 rounded-2xl mb-4 hover:opacity-90 font-semibold transition-all transform hover:translate-y-[-2px]"
      >
        + New Note
      </button>

      <div className="space-y-3">
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => onSelectNote(note)}
            className={`p-4 rounded-2xl cursor-pointer transition-all transform hover:translate-y-[-2px] ${
              selectedNote?.id === note.id
                ? 'bg-[var(--accent-color)]/10 border-l-4 border-[var(--accent-color)]'
                : 'bg-[var(--bg-color)] hover:bg-[var(--accent-color)]/5'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[var(--text-color)] truncate">{note.title}</h3>
                <p className="text-sm text-[var(--text-color)]/70 truncate mt-1">{note.content.substring(0, 50)}</p>
                <p className="text-xs text-[var(--text-color)]/50 mt-2">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={(e) => handleDelete(note.id, e)}
                disabled={deleting === note.id}
                className="text-red-400 hover:text-red-600 text-sm ml-2 transition-colors"
              >
                {deleting === note.id ? '...' : '✕'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
