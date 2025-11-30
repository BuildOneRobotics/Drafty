'use client'

import React, { useState, useEffect } from 'react'
import { Flashcard, Card, FlashcardFolder } from '@/lib/store'
import { flashcardsAPI } from '@/lib/api'
import ConfirmDialog from './ConfirmDialog'

interface FlashcardManagerProps {
  user: { id: string; name: string; email: string } | null
}

export default function FlashcardManager({ user }: FlashcardManagerProps) {
  // Reference user to avoid unused parameter warning
  void user
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [folders, setFolders] = useState<FlashcardFolder[]>([])
  const [selectedFlashcard, setSelectedFlashcard] = useState<Flashcard | null>(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [studyMode, setStudyMode] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [showNewFlashcard, setShowNewFlashcard] = useState(false)
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [newFlashcardName, setNewFlashcardName] = useState('')
  const [newFolderName, setNewFolderName] = useState('')
  const [newFolderColor, setNewFolderColor] = useState('#22c55e')
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'flashcard' | 'folder' | 'card', id: string, name: string } | null>(null)

  useEffect(() => {
    loadFlashcards()
    loadFolders()
  }, [])

  const loadFlashcards = async () => {
    try {
      setLoading(true)
      const response = await flashcardsAPI.getFlashcards()
      setFlashcards(response.data || [])
    } catch (error) {
      console.error('Failed to load flashcards:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadFolders = () => {
    const saved = localStorage.getItem(`flashcard-folders-${user?.id}`)
    if (saved) {
      try {
        setFolders(JSON.parse(saved))
      } catch (error) {
        console.error('Failed to load folders:', error)
      }
    }
  }

  const saveFolders = (updatedFolders: FlashcardFolder[]) => {
    setFolders(updatedFolders)
    localStorage.setItem(`flashcard-folders-${user?.id}`, JSON.stringify(updatedFolders))
  }

  const createFlashcard = async () => {
    if (!newFlashcardName.trim()) return

    try {
      const response = await flashcardsAPI.createFlashcard(newFlashcardName.trim())
      if (response?.data) {
        setFlashcards([response.data, ...flashcards])
        setSelectedFlashcard(response.data)
        setNewFlashcardName('')
        setShowNewFlashcard(false)
        setEditMode(true)
      }
    } catch (error) {
      console.error('Failed to create flashcard:', error)
    }
  }

  const deleteFlashcard = async (flashcardId: string) => {
    try {
      await flashcardsAPI.deleteFlashcard(flashcardId)
      setFlashcards(flashcards.filter(fc => fc.id !== flashcardId))
      if (selectedFlashcard?.id === flashcardId) {
        setSelectedFlashcard(null)
        setStudyMode(false)
        setEditMode(false)
      }
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Failed to delete flashcard:', error)
      setDeleteConfirm(null)
    }
  }

  const createFolder = () => {
    if (!newFolderName.trim()) return

    const newFolder: FlashcardFolder = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
      color: newFolderColor
    }

    saveFolders([...folders, newFolder])
    setNewFolderName('')
    setNewFolderColor('#22c55e')
    setShowNewFolder(false)
  }

  const deleteFolder = (folderId: string) => {
    saveFolders(folders.filter(f => f.id !== folderId))
    // Remove folder association from flashcards
    const updatedFlashcards = flashcards.map(fc => 
      fc.folderId === folderId ? { ...fc, folderId: undefined } : fc
    )
    setFlashcards(updatedFlashcards)
    setDeleteConfirm(null)
  }

  const moveToFolder = async (flashcardId: string, folderId?: string) => {
    const updatedFlashcards = flashcards.map(fc =>
      fc.id === flashcardId ? { ...fc, folderId } : fc
    )
    setFlashcards(updatedFlashcards)
    
    // Update the selected flashcard if it's the one being moved
    if (selectedFlashcard?.id === flashcardId) {
      setSelectedFlashcard({ ...selectedFlashcard, folderId })
    }
  }

  const addCard = async () => {
    if (!selectedFlashcard) return

    const newCard: Card = {
      id: Date.now().toString(),
      question: '',
      answer: ''
    }

    const updatedFlashcard = {
      ...selectedFlashcard,
      cards: [...selectedFlashcard.cards, newCard]
    }

    try {
      await flashcardsAPI.updateFlashcard(selectedFlashcard.id, updatedFlashcard.title, updatedFlashcard.cards)
      setSelectedFlashcard(updatedFlashcard)
      setFlashcards(flashcards.map(fc => fc.id === selectedFlashcard.id ? updatedFlashcard : fc))
    } catch (error) {
      console.error('Failed to add card:', error)
    }
  }

  const updateCard = async (cardId: string, question: string, answer: string) => {
    if (!selectedFlashcard) return

    const updatedCards = selectedFlashcard.cards.map(card =>
      card.id === cardId ? { ...card, question, answer } : card
    )

    const updatedFlashcard = {
      ...selectedFlashcard,
      cards: updatedCards
    }

    try {
      await flashcardsAPI.updateFlashcard(selectedFlashcard.id, updatedFlashcard.title, updatedFlashcard.cards)
      setSelectedFlashcard(updatedFlashcard)
      setFlashcards(flashcards.map(fc => fc.id === selectedFlashcard.id ? updatedFlashcard : fc))
    } catch (error) {
      console.error('Failed to update card:', error)
    }
  }

  const deleteCard = async (cardId: string) => {
    if (!selectedFlashcard || selectedFlashcard.cards.length <= 1) return

    const updatedCards = selectedFlashcard.cards.filter(card => card.id !== cardId)
    const updatedFlashcard = {
      ...selectedFlashcard,
      cards: updatedCards
    }

    try {
      await flashcardsAPI.updateFlashcard(selectedFlashcard.id, updatedFlashcard.title, updatedFlashcard.cards)
      setSelectedFlashcard(updatedFlashcard)
      setFlashcards(flashcards.map(fc => fc.id === selectedFlashcard.id ? updatedFlashcard : fc))
      
      if (currentCardIndex >= updatedCards.length) {
        setCurrentCardIndex(Math.max(0, updatedCards.length - 1))
      }
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Failed to delete card:', error)
      setDeleteConfirm(null)
    }
  }

  const startStudyMode = () => {
    if (!selectedFlashcard || selectedFlashcard.cards.length === 0) return
    setStudyMode(true)
    setEditMode(false)
    setCurrentCardIndex(0)
    setShowAnswer(false)
  }

  const nextCard = () => {
    if (!selectedFlashcard) return
    setCurrentCardIndex((prev) => (prev + 1) % selectedFlashcard.cards.length)
    setShowAnswer(false)
  }

  const prevCard = () => {
    if (!selectedFlashcard) return
    setCurrentCardIndex((prev) => (prev - 1 + selectedFlashcard.cards.length) % selectedFlashcard.cards.length)
    setShowAnswer(false)
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-[var(--text-color)]">Loading flashcards...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[var(--accent-color)]/20 bg-white">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[var(--text-color)]">Flashcards</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowNewFolder(true)}
              className="bg-[var(--accent-color)]/20 text-[var(--accent-color)] px-4 py-2 rounded-lg hover:bg-[var(--accent-color)]/30 transition-all"
            >
              + New Folder
            </button>
            <button
              onClick={() => setShowNewFlashcard(true)}
              className="bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all"
            >
              + New Flashcard Set
            </button>
          </div>
        </div>
      </div>

      {/* New Forms */}
      {showNewFlashcard && (
        <div className="p-6 bg-[var(--accent-color)]/5 border-b border-[var(--accent-color)]/20">
          <div className="flex gap-3">
            <input
              type="text"
              value={newFlashcardName}
              onChange={(e) => setNewFlashcardName(e.target.value)}
              placeholder="Flashcard set name"
              className="flex-1 px-3 py-2 border border-[var(--accent-color)]/20 rounded-lg focus:outline-none focus:border-[var(--accent-color)] text-[var(--text-color)]"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') createFlashcard()
                if (e.key === 'Escape') setShowNewFlashcard(false)
              }}
            />
            <button onClick={createFlashcard} className="bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg hover:opacity-90">Create</button>
            <button onClick={() => setShowNewFlashcard(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
          </div>
        </div>
      )}

      {showNewFolder && (
        <div className="p-6 bg-[var(--accent-color)]/5 border-b border-[var(--accent-color)]/20">
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="flex-1 px-3 py-2 border border-[var(--accent-color)]/20 rounded-lg focus:outline-none focus:border-[var(--accent-color)] text-[var(--text-color)]"
              autoFocus
            />
            <input
              type="color"
              value={newFolderColor}
              onChange={(e) => setNewFolderColor(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <button onClick={createFolder} className="bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg hover:opacity-90">Create</button>
            <button onClick={() => setShowNewFolder(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">Cancel</button>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Flashcards List */}
        <div className="w-80 border-r border-[var(--accent-color)]/20 bg-white overflow-y-auto">
          <div className="p-4">
            {/* Folders */}
            {folders.map((folder) => {
              const folderFlashcards = flashcards.filter(fc => fc.folderId === folder.id)
              return (
                <div key={folder.id} className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: folder.color }}></div>
                      <h4 className="font-semibold text-[var(--text-color)]">{folder.name}</h4>
                      <span className="text-xs text-[var(--text-color)]/60">({folderFlashcards.length})</span>
                    </div>
                    <button
                      onClick={() => setDeleteConfirm({ type: 'folder', id: folder.id, name: folder.name })}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-1 ml-5">
                    {folderFlashcards.map((flashcard) => (
                      <div
                        key={flashcard.id}
                        onClick={() => {
                          setSelectedFlashcard(flashcard)
                          setStudyMode(false)
                          setEditMode(false)
                        }}
                        className={`p-2 rounded cursor-pointer transition-all ${
                          selectedFlashcard?.id === flashcard.id
                            ? 'bg-[var(--accent-color)] text-white'
                            : 'hover:bg-[var(--accent-color)]/10 text-[var(--text-color)]'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{flashcard.title}</p>
                            <p className={`text-xs ${
                              selectedFlashcard?.id === flashcard.id ? 'text-white/70' : 'text-[var(--text-color)]/60'
                            }`}>
                              {flashcard.cards.length} cards
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeleteConfirm({ type: 'flashcard', id: flashcard.id, name: flashcard.title })
                            }}
                            className={`ml-1 text-xs hover:opacity-70 ${
                              selectedFlashcard?.id === flashcard.id ? 'text-white' : 'text-red-500'
                            }`}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Ungrouped Flashcards */}
            <div>
              <h4 className="font-semibold text-[var(--text-color)] mb-2">Ungrouped</h4>
              <div className="space-y-1">
                {flashcards.filter(fc => !fc.folderId).map((flashcard) => (
                  <div
                    key={flashcard.id}
                    onClick={() => {
                      setSelectedFlashcard(flashcard)
                      setStudyMode(false)
                      setEditMode(false)
                    }}
                    className={`p-2 rounded cursor-pointer transition-all ${
                      selectedFlashcard?.id === flashcard.id
                        ? 'bg-[var(--accent-color)] text-white'
                        : 'hover:bg-[var(--accent-color)]/10 text-[var(--text-color)]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{flashcard.title}</p>
                        <p className={`text-xs ${
                          selectedFlashcard?.id === flashcard.id ? 'text-white/70' : 'text-[var(--text-color)]/60'
                        }`}>
                          {flashcard.cards.length} cards
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteFlashcard(flashcard.id)
                        }}
                        className={`ml-1 text-xs hover:opacity-70 ${
                          selectedFlashcard?.id === flashcard.id ? 'text-white' : 'text-red-500'
                        }`}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {flashcards.length === 0 && (
              <p className="text-[var(--text-color)]/60 text-sm">No flashcards yet. Create one to get started!</p>
            )}
          </div>
        </div>

        {/* Flashcard Viewer/Editor */}
        {selectedFlashcard ? (
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            {/* Controls */}
            <div className="p-4 border-b border-[var(--accent-color)]/20">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-[var(--text-color)]">{selectedFlashcard.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditMode(!editMode)
                      setStudyMode(false)
                    }}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      editMode
                        ? 'bg-[var(--accent-color)] text-white'
                        : 'bg-[var(--accent-color)]/20 text-[var(--accent-color)]'
                    }`}
                  >
                    {editMode ? 'View Mode' : 'Edit Mode'}
                  </button>
                  <button
                    onClick={startStudyMode}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      studyMode
                        ? 'bg-[var(--accent-color)] text-white'
                        : 'bg-[var(--accent-color)]/20 text-[var(--accent-color)]'
                    }`}
                  >
                    Study Mode
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {editMode ? (
                <div className="h-full overflow-y-auto p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-[var(--text-color)]">Cards ({selectedFlashcard.cards.length})</h4>
                    <button
                      onClick={addCard}
                      className="bg-[var(--accent-color)] text-white px-3 py-1 rounded text-sm hover:opacity-90"
                    >
                      + Add Card
                    </button>
                  </div>
                  <div className="space-y-4">
                    {selectedFlashcard.cards.map((card, index) => (
                      <div key={card.id} className="border border-[var(--accent-color)]/20 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-sm font-medium text-[var(--text-color)]">Card {index + 1}</span>
                          {selectedFlashcard.cards.length > 1 && (
                            <button
                              onClick={() => setDeleteConfirm({ type: 'card', id: card.id, name: `Card ${index + 1}` })}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Question</label>
                            <textarea
                              value={card.question}
                              onChange={(e) => updateCard(card.id, e.target.value, card.answer)}
                              className="w-full p-2 border border-[var(--accent-color)]/20 rounded focus:outline-none focus:border-[var(--accent-color)] text-[var(--text-color)]"
                              rows={2}
                              placeholder="Enter the question..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[var(--text-color)] mb-1">Answer</label>
                            <textarea
                              value={card.answer}
                              onChange={(e) => updateCard(card.id, card.question, e.target.value)}
                              className="w-full p-2 border border-[var(--accent-color)]/20 rounded focus:outline-none focus:border-[var(--accent-color)] text-[var(--text-color)]"
                              rows={2}
                              placeholder="Enter the answer..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : studyMode && selectedFlashcard.cards.length > 0 ? (
                <div className="h-full flex flex-col">
                  <div className="flex-1 flex items-center justify-center p-8">
                    <div className="max-w-2xl w-full">
                      <div className="text-center mb-6">
                        <span className="text-sm text-[var(--text-color)]/60">
                          Card {currentCardIndex + 1} of {selectedFlashcard.cards.length}
                        </span>
                      </div>
                      <div className="bg-[var(--accent-color)]/5 rounded-2xl p-8 min-h-[300px] flex items-center justify-center">
                        <div className="text-center">
                          <div className="mb-6">
                            <h4 className="text-lg font-semibold text-[var(--text-color)] mb-4">
                              {showAnswer ? 'Answer' : 'Question'}
                            </h4>
                            <p className="text-xl text-[var(--text-color)]">
                              {showAnswer 
                                ? selectedFlashcard.cards[currentCardIndex]?.answer || 'No answer provided'
                                : selectedFlashcard.cards[currentCardIndex]?.question || 'No question provided'
                              }
                            </p>
                          </div>
                          <button
                            onClick={() => setShowAnswer(!showAnswer)}
                            className="bg-[var(--accent-color)] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all"
                          >
                            {showAnswer ? 'Show Question' : 'Show Answer'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-[var(--accent-color)]/20 flex justify-center gap-4">
                    <button
                      onClick={prevCard}
                      className="bg-[var(--accent-color)]/20 text-[var(--accent-color)] px-4 py-2 rounded-lg hover:bg-[var(--accent-color)]/30 transition-all"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={nextCard}
                      className="bg-[var(--accent-color)]/20 text-[var(--accent-color)] px-4 py-2 rounded-lg hover:bg-[var(--accent-color)]/30 transition-all"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-[var(--text-color)]/60">
                  {selectedFlashcard.cards.length === 0 
                    ? 'No cards yet. Switch to edit mode to add some cards!'
                    : 'Click "Study Mode" to start studying or "Edit Mode" to modify cards'
                  }
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[var(--text-color)]/60">
            {flashcards.length === 0 ? 'Create your first flashcard set to get started' : 'Select a flashcard set to study'}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        title={`Delete ${deleteConfirm?.type === 'flashcard' ? 'Flashcard Set' : deleteConfirm?.type === 'folder' ? 'Folder' : 'Card'}?`}
        message={`Are you sure you want to delete "${deleteConfirm?.name}"? ${deleteConfirm?.type === 'folder' ? 'Flashcards in this folder will be moved to Ungrouped.' : 'This action cannot be undone.'}`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={() => {
          if (deleteConfirm?.type === 'flashcard') {
            deleteFlashcard(deleteConfirm.id)
          } else if (deleteConfirm?.type === 'folder') {
            deleteFolder(deleteConfirm.id)
          } else if (deleteConfirm?.type === 'card') {
            deleteCard(deleteConfirm.id)
          }
        }}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  )
}