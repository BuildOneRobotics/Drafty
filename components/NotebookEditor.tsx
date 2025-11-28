'use client'

import { useState } from 'react'
import { Notebook, Page } from '@/lib/store'

interface NotebookEditorProps {
  notebook: Notebook
  onUpdateNotebook: (notebook: Notebook) => void
}

export default function NotebookEditor({ notebook, onUpdateNotebook }: NotebookEditorProps) {
  const [selectedPage, setSelectedPage] = useState<Page | null>(notebook.pages[0] || null)
  const [pageContent, setPageContent] = useState(selectedPage?.content || '')
  const [showPageForm, setShowPageForm] = useState(false)

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

  return (
    <div className="flex h-full gap-4 p-6 bg-[var(--surface-color,white)]">
      <div className="w-32 flex flex-col gap-3 bg-[var(--bg-color,#faf8f5)] p-4 rounded-2xl shadow-md">
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
                  ? 'bg-[var(--accent-color)] text-white shadow-md'
                  : 'bg-[var(--surface-color,white)] text-[var(--text-color)] hover:bg-[var(--accent-color)]/10'
              }`}
            >
              {page.number}
            </button>
          ))}
        </div>
        {!showPageForm ? (
          <button
            onClick={() => setShowPageForm(true)}
            className="w-full px-3 py-2 border-2 border-dashed border-[var(--accent-color)]/30 rounded-lg text-sm hover:border-[var(--accent-color)] transition-all"
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

      <div className="flex-1 flex flex-col bg-[var(--bg-color,#faf8f5)] rounded-2xl shadow-md p-6">
        {selectedPage ? (
          <>
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
            <textarea
              value={pageContent}
              onChange={(e) => handleUpdatePageContent(e.target.value)}
              className="flex-1 p-4 bg-[var(--surface-color,white)] rounded-xl outline-none text-[var(--text-color)] resize-none shadow-sm"
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
