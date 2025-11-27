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
        await notesAPI.createNote(title, content, tagArray)
      } else {
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
      <div className="bg-[#faf8f5] border-b border-[#e8d5c4] shadow-sm p-8 flex justify-between items-start">
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Note"
            className="text-4xl font-bold w-full outline-none mb-4 text-[#4a3f35] placeholder-[#d4c4b0] bg-transparent"
          />
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="🏷️ Add tags (comma separated)"
            className="text-sm text-[#8b6f47] w-full outline-none placeholder-[#c4b5a0] bg-transparent"
          />
        </div>
        <div className="text-right ml-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-[#c17d4a] to-[#d4956f] text-white px-10 py-3 rounded-2xl hover:from-[#a86a3d] hover:to-[#c17d4a] disabled:opacity-50 font-semibold shadow-lg transition-all transform hover:scale-105"
          >
            {saving ? '⏳ Saving...' : '💾 Save'}
          </button>
          {lastSaved && <p className="text-xs text-green-600 mt-3">✓ Saved at {lastSaved}</p>}
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing your ideas..."
        className="flex-1 p-10 outline-none resize-none text-[#4a3f35] text-lg leading-relaxed placeholder-[#d4c4b0] bg-white"
        style={{ fontFamily: 'inherit' }}
      />
    </div>
  )
}
