'use client'

import React, { useState, useEffect } from 'react'
import { Notebook, Page } from '@/lib/store'
import { notebooksAPI } from '@/lib/api'
import ConfirmDialog from './ConfirmDialog'

interface NotebookManagerProps {
  user: { id: string; name: string; email: string } | null
}

export default function NotebookManager({ user }: NotebookManagerProps) {
  // Reference user to avoid unused parameter warning
  void user
  const [notebooks, setNotebooks] = useState<Notebook[]>([])
  const [selectedNotebook, setSelectedNotebook] = useState<Notebook | null>(null)
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [pageContent, setPageContent] = useState('')
  const [showNewNotebook, setShowNewNotebook] = useState(false)
  const [newNotebookName, setNewNotebookName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'notebook' | 'page', id: string, name: string } | null>(null)

  useEffect(() => {
    loadNotebooks()
  }, [])

  useEffect(() => {
    if (selectedNotebook && selectedNotebook.pages.length > 0) {
      const firstPage = selectedNotebook.pages[0]
      setSelectedPage(firstPage)
      setPageContent(firstPage.content || '')
    }
  }, [selectedNotebook])

  const loadNotebooks = async () => {
    try {
      setLoading(true)
      console.log('Loading notebooks...')
      const response = await notebooksAPI.getNotebooks()
      console.log('Notebooks response:', response)
      setNotebooks(response.data || [])
    } catch (error) {
      console.error('Failed to load notebooks:', error)
      // If API fails, try to load from localStorage as fallback
      try {
        const saved = localStorage.getItem(`notebooks-${user?.id}`)
        if (saved) {
          const notebooks = JSON.parse(saved)
          setNotebooks(notebooks)
          console.log('Loaded notebooks from localStorage:', notebooks)
        }
      } catch (localError) {
        console.error('Failed to load from localStorage:', localError)
      }
    } finally {
      setLoading(false)
    }
  }

  const createNotebook = async () => {
    if (!newNotebookName.trim()) return
    
    try {
      const response = await notebooksAPI.createNotebook(newNotebookName.trim())
      if (response?.data) {
        const updatedNotebooks = [response.data, ...notebooks]
        setNotebooks(updatedNotebooks)
        setSelectedNotebook(response.data)
        setNewNotebookName('')
        setShowNewNotebook(false)
        
        // Save to localStorage as backup
        localStorage.setItem(`notebooks-${user?.id}`, JSON.stringify(updatedNotebooks))
      }
    } catch (error) {
      console.error('Failed to create notebook:', error)
      // Create notebook locally if API fails
      const newNotebook = {
        id: Date.now().toString(),
        name: newNotebookName.trim(),
        folder: '',
        pages: [{
          id: '1',
          number: 1,
          title: 'Page 1',
          content: ''
        }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      const updatedNotebooks = [newNotebook, ...notebooks]
      setNotebooks(updatedNotebooks)
      setSelectedNotebook(newNotebook)
      setNewNotebookName('')
      setShowNewNotebook(false)
      
      // Save to localStorage
      localStorage.setItem(`notebooks-${user?.id}`, JSON.stringify(updatedNotebooks))
    }
  }

  const deleteNotebook = async (notebookId: string) => {
    try {
      await notebooksAPI.deleteNotebook(notebookId)
      const updatedNotebooks = notebooks.filter(nb => nb.id !== notebookId)
      setNotebooks(updatedNotebooks)
      localStorage.setItem(`notebooks-${user?.id}`, JSON.stringify(updatedNotebooks))
      
      if (selectedNotebook?.id === notebookId) {
        setSelectedNotebook(null)
        setSelectedPage(null)
        setPageContent('')
      }
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Failed to delete notebook:', error)
      // Delete locally even if API fails
      const updatedNotebooks = notebooks.filter(nb => nb.id !== notebookId)
      setNotebooks(updatedNotebooks)
      localStorage.setItem(`notebooks-${user?.id}`, JSON.stringify(updatedNotebooks))
      
      if (selectedNotebook?.id === notebookId) {
        setSelectedNotebook(null)
        setSelectedPage(null)
        setPageContent('')
      }
      setDeleteConfirm(null)
    }
  }

  const addPage = async () => {
    if (!selectedNotebook) return

    const newPage: Page = {
      id: Date.now().toString(),
      number: selectedNotebook.pages.length + 1,
      title: `Page ${selectedNotebook.pages.length + 1}`,
      content: ''
    }

    const updatedNotebook = {
      ...selectedNotebook,
      pages: [...selectedNotebook.pages, newPage]
    }

    try {
      await notebooksAPI.updateNotebook(selectedNotebook.id, updatedNotebook)
      setSelectedNotebook(updatedNotebook)
      setNotebooks(notebooks.map(nb => nb.id === selectedNotebook.id ? updatedNotebook : nb))
      setSelectedPage(newPage)
      setPageContent('')
    } catch (error) {
      console.error('Failed to add page:', error)
    }
  }

  const updatePageContent = async (content: string) => {
    if (!selectedNotebook || !selectedPage) return

    setPageContent(content)
    setSaving(true)

    const updatedPages = selectedNotebook.pages.map(page =>
      page.id === selectedPage.id ? { ...page, content } : page
    )

    const updatedNotebook = {
      ...selectedNotebook,
      pages: updatedPages,
      updatedAt: new Date().toISOString()
    }

    const updatedNotebooks = notebooks.map(nb => nb.id === selectedNotebook.id ? updatedNotebook : nb)

    try {
      await notebooksAPI.updateNotebook(selectedNotebook.id, updatedNotebook)
      setSelectedNotebook(updatedNotebook)
      setNotebooks(updatedNotebooks)
      
      // Save to localStorage as backup
      localStorage.setItem(`notebooks-${user?.id}`, JSON.stringify(updatedNotebooks))
    } catch (error) {
      console.error('Failed to update page:', error)
      // Update locally even if API fails
      setSelectedNotebook(updatedNotebook)
      setNotebooks(updatedNotebooks)
      localStorage.setItem(`notebooks-${user?.id}`, JSON.stringify(updatedNotebooks))
    } finally {
      setSaving(false)
    }
  }

  const updatePageTitle = async (title: string) => {
    if (!selectedNotebook || !selectedPage) return

    const updatedPages = selectedNotebook.pages.map(page =>
      page.id === selectedPage.id ? { ...page, title } : page
    )

    const updatedNotebook = {
      ...selectedNotebook,
      pages: updatedPages
    }

    try {
      await notebooksAPI.updateNotebook(selectedNotebook.id, updatedNotebook)
      setSelectedNotebook(updatedNotebook)
      setNotebooks(notebooks.map(nb => nb.id === selectedNotebook.id ? updatedNotebook : nb))
      setSelectedPage({ ...selectedPage, title })
    } catch (error) {
      console.error('Failed to update page title:', error)
    }
  }

  const deletePage = async (pageId: string) => {
    if (!selectedNotebook || selectedNotebook.pages.length <= 1) return

    const updatedPages = selectedNotebook.pages.filter(page => page.id !== pageId)
    const updatedNotebook = {
      ...selectedNotebook,
      pages: updatedPages
    }

    const updatedNotebooks = notebooks.map(nb => nb.id === selectedNotebook.id ? updatedNotebook : nb)

    try {
      await notebooksAPI.updateNotebook(selectedNotebook.id, updatedNotebook)
      setSelectedNotebook(updatedNotebook)
      setNotebooks(updatedNotebooks)
      localStorage.setItem(`notebooks-${user?.id}`, JSON.stringify(updatedNotebooks))
      
      if (selectedPage?.id === pageId) {
        const newSelectedPage = updatedPages[0] || null
        setSelectedPage(newSelectedPage)
        setPageContent(newSelectedPage?.content || '')
      }
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Failed to delete page:', error)
      // Delete locally even if API fails
      setSelectedNotebook(updatedNotebook)
      setNotebooks(updatedNotebooks)
      localStorage.setItem(`notebooks-${user?.id}`, JSON.stringify(updatedNotebooks))
      
      if (selectedPage?.id === pageId) {
        const newSelectedPage = updatedPages[0] || null
        setSelectedPage(newSelectedPage)
        setPageContent(newSelectedPage?.content || '')
      }
      setDeleteConfirm(null)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-[var(--text-color)]">Loading notebooks...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[var(--accent-color)]/20 bg-white">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[var(--text-color)]">Notebooks</h2>
          <button
            onClick={() => setShowNewNotebook(true)}
            className="bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all"
          >
            + New Notebook
          </button>
        </div>
      </div>

      {/* New Notebook Form */}
      {showNewNotebook && (
        <div className="p-6 bg-[var(--accent-color)]/5 border-b border-[var(--accent-color)]/20">
          <div className="flex gap-3">
            <input
              type="text"
              value={newNotebookName}
              onChange={(e) => setNewNotebookName(e.target.value)}
              placeholder="Notebook name"
              className="flex-1 px-3 py-2 border border-[var(--accent-color)]/20 rounded-lg focus:outline-none focus:border-[var(--accent-color)] text-[var(--text-color)]"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') createNotebook()
                if (e.key === 'Escape') setShowNewNotebook(false)
              }}
            />
            <button
              onClick={createNotebook}
              className="bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg hover:opacity-90"
            >
              Create
            </button>
            <button
              onClick={() => setShowNewNotebook(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Notebooks List */}
        <div className="w-80 border-r border-[var(--accent-color)]/20 bg-white overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold text-[var(--text-color)] mb-3">Your Notebooks</h3>
            {notebooks.length === 0 ? (
              <p className="text-[var(--text-color)]/60 text-sm">No notebooks yet. Create one to get started!</p>
            ) : (
              <div className="space-y-2">
                {notebooks.map((notebook) => (
                  <div
                    key={notebook.id}
                    onClick={() => setSelectedNotebook(notebook)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedNotebook?.id === notebook.id
                        ? 'bg-[var(--accent-color)] text-white'
                        : 'bg-[var(--accent-color)]/5 hover:bg-[var(--accent-color)]/10 text-[var(--text-color)]'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{notebook.name}</p>
                        <p className={`text-xs mt-1 ${
                          selectedNotebook?.id === notebook.id ? 'text-white/70' : 'text-[var(--text-color)]/60'
                        }`}>
                          {notebook.pages.length} pages
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleteConfirm({ type: 'notebook', id: notebook.id, name: notebook.name })
                        }}
                        className={`ml-2 text-xs hover:opacity-70 ${
                          selectedNotebook?.id === notebook.id ? 'text-white' : 'text-red-500'
                        }`}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notebook Editor */}
        {selectedNotebook ? (
          <div className="flex-1 flex overflow-hidden">
            {/* Pages Sidebar */}
            <div className="w-64 border-r border-[var(--accent-color)]/20 bg-[var(--accent-color)]/5 overflow-y-auto">
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-[var(--text-color)]">Pages</h4>
                  <button
                    onClick={addPage}
                    className="text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 p-1 rounded"
                  >
                    +
                  </button>
                </div>
                <div className="space-y-1">
                  {selectedNotebook.pages.map((page) => (
                    <div
                      key={page.id}
                      onClick={() => {
                        setSelectedPage(page)
                        setPageContent(page.content || '')
                      }}
                      className={`p-2 rounded cursor-pointer transition-all ${
                        selectedPage?.id === page.id
                          ? 'bg-[var(--accent-color)] text-white'
                          : 'hover:bg-[var(--accent-color)]/10 text-[var(--text-color)]'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{page.title}</p>
                          <p className={`text-xs ${
                            selectedPage?.id === page.id ? 'text-white/70' : 'text-[var(--text-color)]/60'
                          }`}>
                            Page {page.number}
                          </p>
                        </div>
                        {selectedNotebook.pages.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeleteConfirm({ type: 'page', id: page.id, name: page.title })
                            }}
                            className={`ml-1 text-xs hover:opacity-70 ${
                              selectedPage?.id === page.id ? 'text-white' : 'text-red-500'
                            }`}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Page Editor */}
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
              {selectedPage ? (
                <>
                  <div className="p-4 border-b border-[var(--accent-color)]/20">
                    <input
                      type="text"
                      value={selectedPage.title}
                      onChange={(e) => updatePageTitle(e.target.value)}
                      className="text-xl font-bold w-full outline-none text-[var(--text-color)] bg-transparent"
                      placeholder="Page title"
                    />
                    {saving && (
                      <p className="text-xs text-[var(--accent-color)] mt-1">Saving...</p>
                    )}
                  </div>
                  <div className="flex-1 p-4">
                    <textarea
                      value={pageContent}
                      onChange={(e) => updatePageContent(e.target.value)}
                      className="w-full h-full resize-none outline-none text-[var(--text-color)] bg-transparent"
                      placeholder="Start writing your notes here..."
                    />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-[var(--text-color)]/60">
                  Select a page to start editing
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[var(--text-color)]/60">
            {notebooks.length === 0 ? 'Create your first notebook to get started' : 'Select a notebook to open'}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        title={`Delete ${deleteConfirm?.type === 'notebook' ? 'Notebook' : 'Page'}?`}
        message={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={() => {
          if (deleteConfirm?.type === 'notebook') {
            deleteNotebook(deleteConfirm.id)
          } else if (deleteConfirm?.type === 'page') {
            deletePage(deleteConfirm.id)
          }
        }}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  )
}