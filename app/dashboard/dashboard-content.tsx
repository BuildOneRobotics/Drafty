'use client'

import React, { useState, useEffect } from 'react'
import { Note, Whiteboard as WhiteboardType } from '@/lib/store'
import NotesManager from '@/components/NotesManager'
import NotebookManager from '@/components/NotebookManager'
import FlashcardManager from '@/components/FlashcardManager'
import FileManager from './dashboard-files'
import { NoteIcon, NotebookIcon, FlashcardIcon, WhiteboardIcon, FilesIcon, CollaborateIcon } from '@/components/Icons'
import { whiteboardsAPI } from '@/lib/api'
import { useMobile } from '@/lib/useMobile'

interface User {
  id: string
  name: string
  email: string
}

interface DashboardContentProps {
  notes: Note[]
  user: User | null
  onLoadNotes?: () => Promise<void>
}

export default function DashboardContent({ notes, user, onLoadNotes }: DashboardContentProps) {
  const { isPhone } = useMobile()
  // reference the prop so it's considered used by TypeScript (some strict configs flag unused params)
  void onLoadNotes
  const [view, setView] = useState<'home' | 'notes' | 'notebooks' | 'flashcards' | 'whiteboards' | 'files' | 'collaborate'>('home')
  const [whiteboards, setWhiteboards] = useState<WhiteboardType[]>([])
  const [notebookCount, setNotebookCount] = useState(0)
  const [flashcardCount, setFlashcardCount] = useState(0)

  useEffect(() => {
    loadWhiteboards()
    loadCounts()
  }, [])

  const loadWhiteboards = async () => {
    try {
      const response = await whiteboardsAPI.getWhiteboards()
      setWhiteboards(response.data || [])
    } catch (error) {
      console.error('Failed to load whiteboards:', error)
    }
  }

  const loadCounts = () => {
    // Load counts from localStorage for display purposes
    try {
      const notebooksData = localStorage.getItem(`notebooks-${user?.id}`)
      const flashcardsData = localStorage.getItem(`flashcards-${user?.id}`)
      
      if (notebooksData) {
        const notebooks = JSON.parse(notebooksData)
        setNotebookCount(notebooks.length || 0)
      }
      
      if (flashcardsData) {
        const flashcards = JSON.parse(flashcardsData)
        setFlashcardCount(flashcards.length || 0)
      }
    } catch (error) {
      console.error('Failed to load counts:', error)
    }
  }



  const navItems = [
    { id: 'notes', label: 'Notes', Icon: NoteIcon },
    { id: 'notebooks', label: 'Notebooks', Icon: NotebookIcon },
    { id: 'flashcards', label: 'Flashcards', Icon: FlashcardIcon },
    { id: 'whiteboards', label: 'Whiteboards', Icon: WhiteboardIcon },
    { id: 'files', label: 'Files', Icon: FilesIcon },
    { id: 'collaborate', label: 'Collaborate', Icon: CollaborateIcon }
  ]

  const sidebar = (
    <div className={`${isPhone ? 'w-full' : 'md:w-80'} bg-white ${isPhone ? 'border-b' : 'border-r'} border-[var(--accent-color)]/20 flex ${isPhone ? 'flex-row overflow-x-auto' : 'flex-col'} h-${isPhone ? 'auto' : 'full'}`}>
      {!isPhone && (
        <div className="p-6 bg-[var(--accent-color)] rounded-b-3xl w-full">
          <p className="text-sm text-white font-semibold">Hello, {user?.name || 'User'}</p>
        </div>
      )}
      <div className={`${isPhone ? 'flex gap-2 p-3 overflow-x-auto' : 'p-6 space-y-3 w-full'}`}>
        <div className={`${isPhone ? 'flex gap-2' : 'grid grid-cols-2 gap-3'}`}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id as any)}
              className={`${isPhone ? 'flex-shrink-0 p-3 rounded-xl' : 'p-4 rounded-2xl'} transition-all text-center hover:scale-105 transform duration-200 ${
                view === item.id
                  ? 'bg-[var(--accent-color)] text-white shadow-md'
                  : 'bg-[var(--accent-color)]/10 text-[var(--text-color)] hover:bg-[var(--accent-color)]/20'
              }`}
            >
              <div className="flex justify-center mb-1"><item.Icon /></div>
              <div className={`${isPhone ? 'text-xs' : 'text-xs'} font-semibold whitespace-nowrap`}>{item.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className={`flex ${isPhone ? 'flex-col' : 'flex-col md:flex-row'} flex-1 overflow-hidden`}>
      {isPhone ? sidebar : <div className="hidden md:flex md:flex-col">{sidebar}</div>}

      <div className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-color,#f0fdf4)]">
        {view === 'notes' && <NotesManager user={user} />}
        
        {view === 'notebooks' && <NotebookManager user={user} />}
        
        {view === 'flashcards' && <FlashcardManager user={user} />}

        {view === 'whiteboards' && (
          <div className={`flex-1 overflow-y-auto ${isPhone ? 'p-4' : 'p-8'}`}>
            <div className={`flex ${isPhone ? 'flex-col gap-3' : 'justify-between items-center'} mb-6`}>
              <h2 className={`${isPhone ? 'text-xl' : 'text-2xl'} font-bold text-[var(--text-color)]`}>Whiteboards</h2>
              <button
                onClick={async () => {
                  try {
                    const response = await whiteboardsAPI.createWhiteboard(`Whiteboard ${whiteboards.length + 1}`, 'plain')
                    setWhiteboards([response.data, ...whiteboards])
                  } catch (error) {
                    console.error('Failed to create whiteboard:', error)
                  }
                }}
                className={`${isPhone ? 'w-full' : ''} bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all`}
              >
                + New Whiteboard
              </button>
            </div>
            
            <div className="space-y-3">
              {whiteboards.length === 0 ? (
                <p className="text-[var(--text-color)]/60">No whiteboards yet. Create one to get started!</p>
              ) : (
                whiteboards.map((whiteboard: WhiteboardType) => (
                  <div
                    key={whiteboard.id}
                    className="p-4 bg-white rounded-2xl border border-[var(--accent-color)]/20 hover:border-[var(--accent-color)]/40 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-[var(--text-color)]">{whiteboard.title}</p>
                        <p className="text-xs text-[var(--text-color)]/60">
                          Template: {whiteboard.template} • {new Date(whiteboard.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={async (e: React.MouseEvent) => {
                          e.stopPropagation()
                          try {
                            await whiteboardsAPI.deleteWhiteboard(whiteboard.id)
                            setWhiteboards(whiteboards.filter((wb: WhiteboardType) => wb.id !== whiteboard.id))
                          } catch (error) {
                            console.error('Failed to delete whiteboard:', error)
                          }
                        }}
                        className="text-red-400 hover:text-red-600 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {view === 'files' && (
          <div className="flex-1 overflow-hidden">
            <FileManager user={user} />
          </div>
        )}



        {view === 'home' && (
          <div className={`flex-1 overflow-y-auto ${isPhone ? 'p-4' : 'p-8'}`}>
            <h1 className={`${isPhone ? 'text-2xl' : 'text-4xl'} font-bold text-[var(--text-color)] mb-8`}>Welcome, {user?.name || 'User'}</h1>
            <div className={`grid ${isPhone ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-6`}>
              {[
                { id: 'notes', label: 'Notes', Icon: NoteIcon, count: notes.length },
                { id: 'notebooks', label: 'Notebooks', Icon: NotebookIcon, count: notebookCount },
                { id: 'flashcards', label: 'Flashcards', Icon: FlashcardIcon, count: flashcardCount },
                { id: 'whiteboards', label: 'Whiteboards', Icon: WhiteboardIcon, count: whiteboards.length }
              ].map(item => (
                <button key={item.id} onClick={() => setView(item.id as any)} className="p-6 bg-white rounded-3xl border border-[var(--accent-color)]/20 hover:border-[var(--accent-color)]/40 hover:shadow-lg transition-all text-left hover:scale-105 transform duration-200">
                  <div className="flex justify-center mb-4 text-[var(--accent-color)]"><item.Icon /></div>
                  <h3 className="text-xl font-bold text-[var(--text-color)] mb-1 text-center">{item.label}</h3>
                  <p className="text-sm text-[var(--text-color)]/60 text-center">{item.count} items</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>


    </div>
  )
}
