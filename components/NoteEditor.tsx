'use client'

import { useState, useEffect, useRef } from 'react'
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
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTitle(note.title)
    setContent(note.content)
    setTags(note.tags.join(', '))
    if (contentRef.current) {
      contentRef.current.innerHTML = note.content
    }
  }, [note])

  const handleSave = async () => {
    setSaving(true)
    try {
      const tagArray = tags.split(',').map((t) => t.trim()).filter(Boolean)
      const htmlContent = contentRef.current?.innerHTML || content
      
      if (note.id.length < 10) {
        await notesAPI.createNote(title, htmlContent, tagArray)
      } else {
        await notesAPI.updateNote(note.id, title, htmlContent, tagArray)
      }
      
      setLastSaved(new Date().toLocaleTimeString())
      onSave()
    } catch (error) {
      console.error('Failed to save note:', error)
    } finally {
      setSaving(false)
    }
  }

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    contentRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="bg-[#faf8f5] border-b border-[#e8d5c4] shadow-sm p-4 md:p-8">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Note"
          className="text-2xl md:text-4xl font-bold w-full outline-none mb-4 text-[#4a3f35] placeholder-[#d4c4b0] bg-transparent"
        />
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Add tags"
          className="text-sm text-[#8b6f47] w-full outline-none placeholder-[#c4b5a0] bg-transparent mb-4"
        />
        
        <div className="flex flex-wrap gap-2 mb-4">
          <select
            onChange={(e) => formatText('fontSize', e.target.value)}
            className="px-3 py-2 bg-white border border-[#e8d5c4] rounded-lg text-sm hover:border-[#c17d4a] transition-colors"
          >
            <option value="3">Small</option>
            <option value="4" selected>Normal</option>
            <option value="5">Large</option>
            <option value="6">Huge</option>
          </select>

          <input
            type="color"
            onChange={(e) => formatText('foreColor', e.target.value)}
            className="w-10 h-10 border border-[#e8d5c4] rounded-lg cursor-pointer"
            title="Text Color"
          />

          <button
            onClick={() => formatText('bold')}
            className="px-4 py-2 bg-white border border-[#e8d5c4] rounded-lg hover:bg-[#f5ebe1] transition-all font-bold"
            title="Bold"
          >
            B
          </button>

          <button
            onClick={() => formatText('italic')}
            className="px-4 py-2 bg-white border border-[#e8d5c4] rounded-lg hover:bg-[#f5ebe1] transition-all italic"
            title="Italic"
          >
            I
          </button>

          <button
            onClick={() => formatText('underline')}
            className="px-4 py-2 bg-white border border-[#e8d5c4] rounded-lg hover:bg-[#f5ebe1] transition-all underline"
            title="Underline"
          >
            U
          </button>

          <button
            onClick={() => formatText('insertUnorderedList')}
            className="px-4 py-2 bg-white border border-[#e8d5c4] rounded-lg hover:bg-[#f5ebe1] transition-all"
            title="Bullet List"
          >
            • List
          </button>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-[#c17d4a] to-[#d4956f] text-white px-6 md:px-10 py-2 md:py-3 rounded-2xl hover:from-[#a86a3d] hover:to-[#c17d4a] disabled:opacity-50 font-semibold shadow-lg transition-all transform hover:scale-105"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        {lastSaved && <span className="text-xs text-green-600 ml-4">Saved at {lastSaved}</span>}
      </div>

      <div
        ref={contentRef}
        contentEditable
        className="flex-1 p-6 md:p-10 outline-none text-[#4a3f35] text-base md:text-lg leading-relaxed bg-white overflow-y-auto"
        style={{ minHeight: '300px' }}
        suppressContentEditableWarning
      />
    </div>
  )
}
