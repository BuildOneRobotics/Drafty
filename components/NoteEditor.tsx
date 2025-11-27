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
    <div className="flex flex-col h-full bg-white">
      <div className="bg-white border-b shadow-sm p-6 flex justify-between items-start">
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Note"
            className="text-3xl font-bold w-full outline-none mb-3 text-gray-800 placeholder-gray-300"
          />
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="🏷️ Add tags (comma separated)"
            className="text-sm text-gray-500 w-full outline-none placeholder-gray-400"
          />
        </div>
        <div className="text-right ml-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-2.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 font-medium shadow-md transition-all"
          >
            {saving ? '⏳ Saving...' : '💾 Save'}
          </button>
          {lastSaved && <p className="text-xs text-green-600 mt-2">✓ Saved at {lastSaved}</p>}
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing your ideas..."
        className="flex-1 p-8 outline-none resize-none text-gray-700 text-lg leading-relaxed placeholder-gray-300"
      />
    </div>
  )
}
