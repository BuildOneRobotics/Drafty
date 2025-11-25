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
      // Refresh notes list
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
      title: 'New Note',
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
        className="w-full bg-indigo-600 text-white py-2 rounded mb-4 hover:bg-indigo-700"
      >
        + New Note
      </button>

      <div className="space-y-2">
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => onSelectNote(note)}
            className={`p-3 rounded cursor-pointer transition ${
              selectedNote?.id === note.id
                ? 'bg-indigo-100 border-l-4 border-indigo-600'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{note.title}</h3>
                <p className="text-xs text-gray-500 truncate">{note.content.substring(0, 50)}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={(e) => handleDelete(note.id, e)}
                disabled={deleting === note.id}
                className="text-red-500 hover:text-red-700 text-xs ml-2"
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
