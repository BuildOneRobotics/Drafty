'use client'

import { useState, useEffect, useRef } from 'react'
import { Notebook, Page } from '@/lib/store'

interface NotebookEditorProps {
  notebook: Notebook
  onUpdateNotebook: (notebook: Notebook) => void
}

export default function NotebookEditor({ notebook, onUpdateNotebook }: NotebookEditorProps) {
  const [selectedPage, setSelectedPage] = useState<Page | null>(notebook.pages[0] || null)
  const [pageContent, setPageContent] = useState(selectedPage?.content || '')
  const [showPageForm, setShowPageForm] = useState(false)
  const contentRef = useRef<HTMLDivElement | null>(null)

  // Sync selectedPage when notebook prop changes (keep reference in sync)
  useEffect(() => {
    if (!selectedPage) return
    const updated = notebook.pages.find(p => p.id === selectedPage.id)
    if (updated) {
      setSelectedPage(updated)
      setPageContent(updated.content || '')
      if (contentRef.current) contentRef.current.innerHTML = updated.content || ''
    }
  }, [notebook.pages])

  // When selectedPage changes, update editor content
  useEffect(() => {
    setPageContent(selectedPage?.content || '')
    if (contentRef.current) contentRef.current.innerHTML = selectedPage?.content || ''
  }, [selectedPage])

  const handleAddPage = () => {
    const newPage: Page = {
      id: Date.now().toString(),
      number: notebook.pages.length + 1,
      title: `Page ${notebook.pages.length + 1}`,
      content: ''
    }
    const updated = { ...notebook, pages: [...notebook.pages, newPage] }
    onUpdateNotebook(updated)
    setSelectedPage(newPage)
    setShowPageForm(false)
  }

  const handleUpdatePageContent = (content: string) => {
    if (!selectedPage) return
    setPageContent(content)
    const updated = {
      ...notebook,
      pages: notebook.pages.map(p => p.id === selectedPage.id ? { ...p, content } : p)
    }
    onUpdateNotebook(updated)
  }

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value)
  }

  return (
    <div className="flex h-full gap-4 p-6 bg-[var(--surface-color,white)]">
      <div className="w-32 flex flex-col gap-3 bg-[var(--bg-color,#faf8f5)] p-4 rounded-lg">
        <h3 className="font-semibold text-[var(--text-color)] text-sm">{notebook.name}</h3>
        <div className="flex-1 overflow-y-auto space-y-2">
          {notebook.pages.map(page => (
            <button
              key={page.id}
              onClick={() => {
                setSelectedPage(page)
                setPageContent(page.content)
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                selectedPage?.id === page.id
                  ? 'bg-[var(--accent-color)] text-white'
                  : 'bg-[var(--surface-color,white)] text-[var(--text-color)] hover:bg-[var(--accent-color)]/10'
              }`}
            >
              <div className="font-semibold">Page {page.number}</div>
              <div className="text-xs opacity-70 truncate">{page.title}</div>
            </button>
          ))}
        </div>
        {!showPageForm ? (
          <button
            onClick={() => setShowPageForm(true)}
            className="w-full px-3 py-2 border-2 border-dashed border-[var(--accent-color)]/20 rounded-lg text-sm hover:border-[var(--accent-color)]/40 transition-all text-[var(--text-color)]"
          >
            + Page
          </button>
        ) : (
          <div className="space-y-2">
            <button
              onClick={handleAddPage}
              className="w-full px-3 py-2 bg-[var(--accent-color)] text-white rounded-lg text-sm hover:opacity-90"
            >
              Add
            </button>
            <button
              onClick={() => setShowPageForm(false)}
              className="w-full px-3 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col bg-[var(--bg-color,#faf8f5)] rounded-lg p-6">
        {selectedPage ? (
          <>
            <div className="flex gap-2 mb-4 flex-wrap">
              <button
                onClick={() => formatText('bold')}
                className="px-3 py-2 bg-white border border-[var(--accent-color)]/20 rounded-lg text-sm font-bold hover:bg-[var(--accent-color)]/5"
              >
                B
              </button>
              <button
                onClick={() => formatText('italic')}
                className="px-3 py-2 bg-white border border-[var(--accent-color)]/20 rounded-lg text-sm italic hover:bg-[var(--accent-color)]/5"
              >
                I
              </button>
              <button
                onClick={() => formatText('underline')}
                className="px-3 py-2 bg-white border border-[var(--accent-color)]/20 rounded-lg text-sm underline hover:bg-[var(--accent-color)]/5"
              >
                U
              </button>
              <button
                onClick={() => formatText('insertUnorderedList')}
                className="px-3 py-2 bg-white border border-[var(--accent-color)]/20 rounded-lg text-sm hover:bg-[var(--accent-color)]/5"
              >
                • List
              </button>
            </div>
            <input
              type="text"
              value={selectedPage.title}
              onChange={(e) => {
                const updated = {
                  ...notebook,
                  pages: notebook.pages.map(p => p.id === selectedPage.id ? { ...p, title: e.target.value } : p)
                }
                onUpdateNotebook(updated)
                setSelectedPage({ ...selectedPage, title: e.target.value })
              }}
              className="text-2xl font-bold mb-4 outline-none bg-transparent text-[var(--text-color)]"
            />
            <div
              ref={contentRef}
              contentEditable
              onInput={(e) => handleUpdatePageContent((e.currentTarget as HTMLDivElement).innerHTML || '')}
              className="flex-1 p-4 bg-[var(--surface-color,white)] rounded-lg outline-none text-[var(--text-color)] overflow-y-auto"
              suppressContentEditableWarning
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-[var(--text-color)]/50">
            No pages yet
          </div>
        )}
      </div>
    </div>
  )
}
