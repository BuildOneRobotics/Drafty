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
        className="w-full bg-gradient-to-r from-[#c17d4a] to-[#d4956f] text-white py-3 rounded-2xl mb-4 hover:from-[#a86a3d] hover:to-[#c17d4a] font-semibold shadow-lg transition-all transform hover:scale-105"
      >
        ✨ New Note
      </button>

      <div className="space-y-3">
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => onSelectNote(note)}
            className={`p-4 rounded-2xl cursor-pointer transition-all transform hover:scale-105 ${
              selectedNote?.id === note.id
                ? 'bg-gradient-to-r from-[#f5ebe1] to-[#faf8f5] border-l-4 border-[#c17d4a] shadow-lg'
                : 'bg-[#faf8f5] hover:bg-[#f5ebe1] hover:shadow-md'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#4a3f35] truncate">{note.title}</h3>
                <p className="text-sm text-[#8b6f47] truncate mt-1">{note.content.substring(0, 50)}</p>
                <p className="text-xs text-[#a89080] mt-2">
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
