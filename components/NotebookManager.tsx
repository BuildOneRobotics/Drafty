'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Notebook, Page } from '@/lib/store'
import { notebooksAPI } from '@/lib/api'
import ConfirmDialog from './ConfirmDialog'
import TemplateSelector from './TemplateSelector'
import { useMobile } from '@/lib/useMobile'
import { notebookTemplates, Template } from '@/lib/templates'

interface NotebookManagerProps {
  user: { id: string; name: string; email: string } | null
}

export default function NotebookManager({ user }: NotebookManagerProps) {
  const { isPhone } = useMobile()
  const [notebooks, setNotebooks] = useState<Notebook[]>([])
  const [selectedNotebook, setSelectedNotebook] = useState<Notebook | null>(null)
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [pageContent, setPageContent] = useState('')
  const [showNewNotebook, setShowNewNotebook] = useState(false)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [newNotebookName, setNewNotebookName] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'notebook' | 'page', id: string, name: string } | null>(null)
  const [showNotebookList, setShowNotebookList] = useState(true)
  const [showPageList, setShowPageList] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const lastPageIdRef = useRef<string | null>(null)

  useEffect(() => {
    loadNotebooks()
  }, [])

  useEffect(() => {
    if (selectedNotebook && selectedNotebook.pages.length > 0) {
      const firstPage = selectedNotebook.pages[0]
      setSelectedPage(firstPage)
      // Only set content when notebook (and therefore page selection) changes
      setPageContent(firstPage.content || '')
      lastPageIdRef.current = firstPage.id
      if (editorRef.current) editorRef.current.innerHTML = firstPage.content || ''
    }
  }, [selectedNotebook])

  const loadNotebooks = async () => {
    try {
      setLoading(true)
      console.log('Loading notebooks...')
      const response = await notebooksAPI.getNotebooks()
      console.log('Notebooks response:', response)
      // Axios responses may wrap payload in `data` key (e.g. { data: [...] })
      const payload = response?.data?.data ?? response?.data ?? []
      setNotebooks(payload || [])
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

  const handleNewNotebookClick = () => {
    setShowTemplateSelector(true)
  }

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template)
    setShowTemplateSelector(false)
    setShowNewNotebook(true)
    if (template.id === 'blank') {
      setNewNotebookName('')
    } else {
      setNewNotebookName(template.name)
    }
  }

  const createNotebook = async () => {
    if (!newNotebookName.trim()) return
    
    const initialContent = selectedTemplate?.content || ''
    
    try {
      const response = await notebooksAPI.createNotebook(newNotebookName.trim())
      const created = response?.data?.data ?? response?.data ?? null
      if (created) {
        // Update first page with template content
        const notebookWithTemplate = {
          ...created,
          pages: [{
            ...((created.pages && created.pages[0]) || { id: '1', number: 1, title: 'Page 1' }),
            content: initialContent
          }]
        }
        
        const updatedNotebooks: Notebook[] = [notebookWithTemplate, ...notebooks]
        setNotebooks(updatedNotebooks)
        setSelectedNotebook(notebookWithTemplate)
        setNewNotebookName('')
        setShowNewNotebook(false)
        setSelectedTemplate(null)
        
        if (isPhone) {
          setShowNotebookList(false)
          setShowPageList(true)
        }
        
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
          content: initialContent
        }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      const updatedNotebooks: Notebook[] = [newNotebook, ...notebooks]
      setNotebooks(updatedNotebooks)
      setSelectedNotebook(newNotebook)
      setNewNotebookName('')
      setShowNewNotebook(false)
      setSelectedTemplate(null)
      
      if (isPhone) {
        setShowNotebookList(false)
        setShowPageList(true)
      }
      
      // Save to localStorage
      localStorage.setItem(`notebooks-${user?.id}`, JSON.stringify(updatedNotebooks))
    }
  }

  const deleteNotebook = async (notebookId: string) => {
    try {
      await notebooksAPI.deleteNotebook(notebookId)
      const updatedNotebooks: Notebook[] = notebooks.filter((nb: Notebook) => nb.id !== notebookId)
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
      const updatedNotebooks: Notebook[] = notebooks.filter((nb: Notebook) => nb.id !== notebookId)
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
      setNotebooks(notebooks.map((nb: Notebook) => nb.id === selectedNotebook.id ? updatedNotebook : nb))
      setSelectedPage(newPage)
      setPageContent('')
    } catch (error) {
      console.error('Failed to add page:', error)
    }
  }

  const updatePageContent = async (content: string) => {
    if (!selectedNotebook || !selectedPage) return

    setPageContent(content)
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // Debounce save for 1 second
    saveTimeoutRef.current = setTimeout(async () => {
      setSaving(true)

      const updatedPages: Page[] = selectedNotebook.pages.map((page: Page) =>
        page.id === selectedPage.id ? { ...page, content } : page
      )

      const updatedNotebook: Notebook = {
        ...selectedNotebook,
        pages: updatedPages,
        updatedAt: new Date().toISOString()
      }

      const updatedNotebooks: Notebook[] = notebooks.map((nb: Notebook) => nb.id === selectedNotebook.id ? updatedNotebook : nb)

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
        // don't overwrite editor DOM here to avoid moving caret
      }
    }, 1000)
  }

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const updatePageTitle = async (title: string) => {
    if (!selectedNotebook || !selectedPage) return

    const updatedPages: Page[] = selectedNotebook.pages.map((page: Page) =>
      page.id === selectedPage.id ? { ...page, title } : page
    )

    const updatedNotebook: Notebook = {
      ...selectedNotebook,
      pages: updatedPages
    }

    try {
      await notebooksAPI.updateNotebook(selectedNotebook.id, updatedNotebook)
      setSelectedNotebook(updatedNotebook)
      setNotebooks(notebooks.map((nb: Notebook) => nb.id === selectedNotebook.id ? updatedNotebook : nb))
      setSelectedPage({ ...selectedPage, title })
    } catch (error) {
      console.error('Failed to update page title:', error)
    }
  }

  const deletePage = async (pageId: string) => {
    if (!selectedNotebook || selectedNotebook.pages.length <= 1) return

    const updatedPages: Page[] = selectedNotebook.pages.filter((page: Page) => page.id !== pageId)
    const updatedNotebook: Notebook = {
      ...selectedNotebook,
      pages: updatedPages
    }

    const updatedNotebooks: Notebook[] = notebooks.map((nb: Notebook) => nb.id === selectedNotebook.id ? updatedNotebook : nb)

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
      <div className={`${isPhone ? 'p-4' : 'p-6'} border-b border-[var(--accent-color)]/20 bg-white`}>
        <div className="flex justify-between items-center">
          {isPhone && selectedNotebook && !showNotebookList ? (
            <button
              onClick={() => {
                setShowNotebookList(true)
                setShowPageList(false)
              }}
              className="text-[var(--accent-color)] hover:opacity-70"
            >
              ← Back
            </button>
          ) : (
            <h2 className={`${isPhone ? 'text-xl' : 'text-2xl'} font-bold text-[var(--text-color)]`}>
              {selectedNotebook && !showNotebookList ? selectedNotebook.name : 'Notebooks'}
            </h2>
          )}
          <button
            onClick={handleNewNotebookClick}
            className={`bg-[var(--accent-color)] text-white ${isPhone ? 'px-3 py-2 text-sm' : 'px-4 py-2'} rounded-lg hover:opacity-90 transition-all`}
          >
            + {isPhone ? 'New' : 'New Notebook'}
          </button>
        </div>
      </div>

      {/* New Notebook Form */}
      {showNewNotebook && (
        <div className={`${isPhone ? 'p-4' : 'p-6'} bg-[var(--accent-color)]/5 border-b border-[var(--accent-color)]/20`}>
          <div className={`flex ${isPhone ? 'flex-col' : 'flex-row'} gap-3`}>
            <input
              type="text"
              value={newNotebookName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewNotebookName(e.target.value)}
              placeholder="Notebook name"
              className="flex-1 px-3 py-2 border border-[var(--accent-color)]/20 rounded-lg focus:outline-none focus:border-[var(--accent-color)] text-[var(--text-color)]"
              autoFocus
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') createNotebook()
                if (e.key === 'Escape') setShowNewNotebook(false)
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={createNotebook}
                className="flex-1 bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg hover:opacity-90"
              >
                Create
              </button>
              <button
                onClick={() => setShowNewNotebook(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Notebooks List */}
        {(!isPhone || showNotebookList) && (
          <div className={`${isPhone ? 'w-full' : 'w-80'} border-r border-[var(--accent-color)]/20 bg-white overflow-y-auto`}>
            <div className="p-4">
              <h3 className="font-semibold text-[var(--text-color)] mb-3">Your Notebooks</h3>
              {notebooks.length === 0 ? (
                <p className="text-[var(--text-color)]/60 text-sm">No notebooks yet. Create one to get started!</p>
              ) : (
                <div className="space-y-2">
                  {notebooks.map((notebook: Notebook) => (
                    <div
                      key={notebook.id}
                      onClick={() => {
                        setSelectedNotebook(notebook)
                        if (isPhone) {
                          setShowNotebookList(false)
                          setShowPageList(true)
                        }
                      }}
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
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
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
        )}

        {/* Notebook Editor */}
        {selectedNotebook && (!isPhone || !showNotebookList) ? (
          <div className="flex-1 flex overflow-hidden">
            {/* Pages Sidebar */}
            {(!isPhone || showPageList) && (
              <div className={`${isPhone ? 'w-full' : 'w-64'} border-r border-[var(--accent-color)]/20 bg-[var(--accent-color)]/5 overflow-y-auto`}>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    {isPhone && (
                      <button
                        onClick={() => {
                          setShowPageList(false)
                          setShowNotebookList(true)
                        }}
                        className="text-[var(--accent-color)] hover:opacity-70"
                      >
                        ← Notebooks
                      </button>
                    )}
                    <h4 className="font-semibold text-[var(--text-color)]">Pages</h4>
                    <button
                      onClick={addPage}
                      className="text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 px-2 py-1 rounded"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="space-y-1">
                    {selectedNotebook.pages.map((page: Page) => (
                      <div
                        key={page.id}
                        onClick={() => {
                          setSelectedPage(page)
                          setPageContent(page.content || '')
                          if (isPhone) setShowPageList(false)
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
                              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
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
            )}

            {/* Page Editor */}
            {(!isPhone || (!showPageList && !showNotebookList)) && (
              <div className="flex-1 flex flex-col overflow-hidden bg-white">
                {selectedPage ? (
                  <>
                    <div className={`${isPhone ? 'p-3' : 'p-4'} border-b border-[var(--accent-color)]/20`}>
                      {isPhone && (
                        <button
                          onClick={() => setShowPageList(true)}
                          className="text-[var(--accent-color)] hover:opacity-70 mb-2"
                        >
                          ← Pages
                        </button>
                      )}
                      <input
                        type="text"
                        value={selectedPage.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePageTitle(e.target.value)}
                        className={`${isPhone ? 'text-lg' : 'text-xl'} font-bold w-full outline-none text-[var(--text-color)] bg-transparent`}
                        placeholder="Page title"
                      />
                      <div className="flex items-center justify-between mt-2">
                        {saving && (
                          <p className="text-xs text-[var(--accent-color)]">Saving...</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Rich Text Toolbar */}
                    <div className={`${isPhone ? 'p-2' : 'p-3'} border-b border-[var(--accent-color)]/20 bg-[var(--accent-color)]/5 flex gap-2 overflow-x-auto`}>
                      <button
                        onClick={() => formatText('bold')}
                        className="px-3 py-1.5 bg-white border border-[var(--accent-color)]/20 rounded hover:bg-[var(--accent-color)]/10 font-bold text-sm"
                        title="Bold"
                      >
                        B
                      </button>
                      <button
                        onClick={() => formatText('italic')}
                        className="px-3 py-1.5 bg-white border border-[var(--accent-color)]/20 rounded hover:bg-[var(--accent-color)]/10 italic text-sm"
                        title="Italic"
                      >
                        I
                      </button>
                      <button
                        onClick={() => formatText('underline')}
                        className="px-3 py-1.5 bg-white border border-[var(--accent-color)]/20 rounded hover:bg-[var(--accent-color)]/10 underline text-sm"
                        title="Underline"
                      >
                        U
                      </button>
                      <button
                        onClick={() => formatText('insertUnorderedList')}
                        className="px-3 py-1.5 bg-white border border-[var(--accent-color)]/20 rounded hover:bg-[var(--accent-color)]/10 text-sm"
                        title="Bullet List"
                      >
                        • List
                      </button>
                      <button
                        onClick={() => formatText('insertOrderedList')}
                        className="px-3 py-1.5 bg-white border border-[var(--accent-color)]/20 rounded hover:bg-[var(--accent-color)]/10 text-sm"
                        title="Numbered List"
                      >
                        1. List
                      </button>
                      <select
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => formatText('fontSize', e.target.value)}
                        className="px-2 py-1.5 bg-white border border-[var(--accent-color)]/20 rounded hover:bg-[var(--accent-color)]/10 text-sm"
                        defaultValue="3"
                      >
                        <option value="1">Tiny</option>
                        <option value="2">Small</option>
                        <option value="3">Normal</option>
                        <option value="4">Large</option>
                        <option value="5">Huge</option>
                      </select>
                      <input
                        type="color"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => formatText('foreColor', e.target.value)}
                        className="w-10 h-8 border border-[var(--accent-color)]/20 rounded cursor-pointer"
                        title="Text Color"
                      />
                    </div>

                    <div className={`flex-1 ${isPhone ? 'p-3' : 'p-4'} overflow-y-auto`}>
                      <div
                        ref={editorRef}
                        contentEditable
                        onInput={(e: React.FormEvent<HTMLDivElement>) => {
                          const content = (e.currentTarget as HTMLDivElement).innerHTML
                          updatePageContent(content)
                        }}
                        className="w-full h-full outline-none text-[var(--text-color)] bg-transparent leading-relaxed min-h-[200px]"
                        suppressContentEditableWarning
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-[var(--text-color)]/60">
                    Select a page to start editing
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          !isPhone && (
            <div className="flex-1 flex items-center justify-center text-[var(--text-color)]/60">
              {notebooks.length === 0 ? 'Create your first notebook to get started' : 'Select a notebook to open'}
            </div>
          )
        )}
      </div>

      {/* Template Selector */}
      {showTemplateSelector && (
        <TemplateSelector
          templates={notebookTemplates}
          onSelect={handleTemplateSelect}
          onCancel={() => setShowTemplateSelector(false)}
          title="Choose a Notebook Template"
        />
      )}

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