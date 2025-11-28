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
      contentRef.current.innerHTML = note.content
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
    <div className="flex flex-col h-full bg-[var(--surface-color,white)] transition-colors duration-[2000ms]">
      <div className="bg-[var(--bg-color,#faf8f5)] border-b border-[var(--accent-color)]/20 shadow-md p-4 md:p-8 transition-colors duration-[2000ms] rounded-b-2xl">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onClick={handleTitleClick}
          placeholder="Untitled Note"
          className="text-2xl md:text-4xl font-bold w-full outline-none mb-4 text-[var(--text-color,#4a3f35)] placeholder-[var(--accent-color)]/40 bg-transparent transition-colors duration-[2000ms]"
        />
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Add tags"
          className="text-sm text-[var(--accent-color)]/70 w-full outline-none placeholder-[var(--accent-color)]/30 bg-transparent mb-4 transition-colors duration-[2000ms]"
        />
        
        <div className="flex flex-wrap gap-2 mb-4">
          <select
            onChange={(e) => formatText('fontSize', e.target.value)}
            className="px-3 py-2 bg-[var(--surface-color,white)] border border-[var(--accent-color)]/30 rounded-xl text-sm hover:border-[var(--accent-color)] transition-all duration-[2000ms] shadow-sm"
          >
            <option value="3">Small</option>
            <option value="4" selected>Normal</option>
            <option value="5">Large</option>
            <option value="6">Huge</option>
          </select>

          <input
            type="color"
            onChange={(e) => formatText('foreColor', e.target.value)}
            className="w-10 h-10 border border-[var(--accent-color)]/30 rounded-xl cursor-pointer shadow-sm"
            title="Text Color"
          />

          <button
            onClick={() => formatText('bold')}
            className="px-4 py-2 bg-[var(--surface-color,white)] border border-[var(--accent-color)]/30 rounded-xl hover:bg-[var(--accent-color)]/10 transition-all font-bold duration-[2000ms] shadow-sm"
            title="Bold"
          >
            B
          </button>

          <button
            onClick={() => formatText('italic')}
            className="px-4 py-2 bg-[var(--surface-color,white)] border border-[var(--accent-color)]/30 rounded-xl hover:bg-[var(--accent-color)]/10 transition-all italic duration-[2000ms] shadow-sm"
            title="Italic"
          >
            I
          </button>

          <button
            onClick={() => formatText('underline')}
            className="px-4 py-2 bg-[var(--surface-color,white)] border border-[var(--accent-color)]/30 rounded-xl hover:bg-[var(--accent-color)]/10 transition-all underline duration-[2000ms] shadow-sm"
            title="Underline"
          >
            U
          </button>

          <button
            onClick={() => formatText('insertUnorderedList')}
            className="px-4 py-2 bg-[var(--surface-color,white)] border border-[var(--accent-color)]/30 rounded-xl hover:bg-[var(--accent-color)]/10 transition-all duration-[2000ms] shadow-sm"
            title="Bullet List"
          >
            • List
          </button>
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[var(--accent-color)] text-white px-6 md:px-10 py-2 md:py-3 rounded-2xl hover:opacity-90 disabled:opacity-50 font-semibold shadow-lg transition-all transform hover:scale-105 duration-[2000ms]"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          {lastSaved && <span className="text-xs text-green-600">Saved at {lastSaved}</span>}
        </div>
      </div>

      <div
        ref={contentRef}
        contentEditable
        onInput={handleContentChange}
        className="flex-1 p-6 md:p-10 outline-none text-[var(--text-color,#4a3f35)] text-base md:text-lg leading-relaxed bg-[var(--surface-color,white)] overflow-y-auto transition-colors duration-[2000ms]"
        style={{ minHeight: '300px' }}
        suppressContentEditableWarning
      />
    </div>
  )
}
