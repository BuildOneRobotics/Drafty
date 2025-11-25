'use client'

import { useState, useEffect } from 'react'
import { Note } from '@/lib/store'
import { notesAPI } from '@/lib/api'

interface NoteEditorProps {
  note: Note
  onSave: () => void
}

export default function NoteEditor({ note, onSave }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [tags, setTags] = useState(note.tags.join(', '))
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)

  useEffect(() => {
    setTitle(note.title)
    setContent(note.content)
    setTags(note.tags.join(', '))
  }, [note])

  const handleSave = async () => {
    setSaving(true)
    try {
      const tagArray = tags.split(',').map((t) => t.trim()).filter(Boolean)
      
      if (note.id.length < 10) {
        // New note
        await notesAPI.createNote(title, content, tagArray)
      } else {
        // Existing note
        await notesAPI.updateNote(note.id, title, content, tagArray)
      }
      
      setLastSaved(new Date().toLocaleTimeString())
      onSave()
    } catch (error) {
      console.error('Failed to save note:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b p-6 flex justify-between items-start">
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="text-3xl font-bold w-full outline-none mb-2"
          />
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated)"
            className="text-sm text-gray-500 w-full outline-none"
          />
        </div>
        <div className="text-right">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          {lastSaved && <p className="text-xs text-gray-500 mt-2">Saved at {lastSaved}</p>}
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing your note..."
        className="flex-1 p-6 outline-none resize-none"
      />
    </div>
  )
}
