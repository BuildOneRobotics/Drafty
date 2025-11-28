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
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setTitle(note.title)
    setContent(note.content)
    setTags(note.tags.join(', '))
    if (contentRef.current) {
      contentRef.current.textContent = note.content
    }
  }, [note])

  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(() => {
      if (title || contentRef.current?.innerHTML) handleSave()
    }, 2000)
    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current) }
  }, [title, tags])

  const handleContentChange = () => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(() => handleSave(), 2000)
  }

  const handleTitleClick = () => {
    if (title === 'Untitled Note') {
      setTitle('')
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const tagArray = tags.split(',').map((t) => t.trim()).filter(Boolean)
      const htmlContent = contentRef.current?.innerHTML || content
      
      if (note.id.length < 10) {
        await notesAPI.createNote(title || 'Untitled Note', htmlContent, tagArray)
      } else {
        await notesAPI.updateNote(note.id, title || 'Untitled Note', htmlContent, tagArray)
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
    <div className="flex flex-col h-full bg-[var(--bg-color,#f0fdf4)] p-4 md:p-8 gap-4 overflow-y-auto">
      <div className="flex gap-3 items-center">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[var(--accent-color)] text-white px-6 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 font-semibold transition-all"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        {lastSaved && <span className="text-xs text-green-600">Saved at {lastSaved}</span>}
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          onChange={(e) => formatText('fontSize', e.target.value)}
          className="px-3 py-2 bg-white border border-[var(--accent-color)]/20 rounded-lg text-sm hover:border-[var(--accent-color)]/40 transition-all"
          defaultValue="4"
        >
          <option value="3">Small</option>
          <option value="4">Normal</option>
          <option value="5">Large</option>
          <option value="6">Huge</option>
        </select>

        <input
          type="color"
          onChange={(e) => formatText('foreColor', e.target.value)}
          className="w-10 h-10 border border-[var(--accent-color)]/20 rounded-lg cursor-pointer"
          title="Text Color"
        />

        <button
          onClick={() => formatText('bold')}
          className="px-4 py-2 bg-white border border-[var(--accent-color)]/20 rounded-lg hover:bg-[var(--accent-color)]/5 transition-all font-bold"
          title="Bold"
        >
          B
        </button>

        <button
          onClick={() => formatText('italic')}
          className="px-4 py-2 bg-white border border-[var(--accent-color)]/20 rounded-lg hover:bg-[var(--accent-color)]/5 transition-all italic"
          title="Italic"
        >
          I
        </button>

        <button
          onClick={() => formatText('underline')}
          className="px-4 py-2 bg-white border border-[var(--accent-color)]/20 rounded-lg hover:bg-[var(--accent-color)]/5 transition-all underline"
          title="Underline"
        >
          U
        </button>

        <button
          onClick={() => formatText('insertUnorderedList')}
          className="px-4 py-2 bg-white border border-[var(--accent-color)]/20 rounded-lg hover:bg-[var(--accent-color)]/5 transition-all"
          title="Bullet List"
        >
          • List
        </button>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-2xl bg-white rounded-2xl p-8 md:p-12" style={{aspectRatio: '210/297'}}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onClick={handleTitleClick}
            placeholder="Untitled Note"
            className="text-3xl font-bold w-full outline-none mb-2 text-[var(--text-color)] placeholder-[var(--accent-color)]/40 bg-transparent"
          />
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Add tags"
            className="text-sm text-[var(--accent-color)]/70 w-full outline-none placeholder-[var(--accent-color)]/30 bg-transparent mb-6 pb-4 border-b border-[var(--accent-color)]/20"
          />
          
          <div
            ref={contentRef}
            contentEditable
            onInput={handleContentChange}
            className="outline-none text-[var(--text-color)] text-base leading-relaxed overflow-y-auto"
            style={{height: 'calc(100% - 120px)'}}
            suppressContentEditableWarning
          />
        </div>
      </div>
    </div>
  )
}
