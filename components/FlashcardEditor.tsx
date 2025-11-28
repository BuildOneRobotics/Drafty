'use client'

import { useState } from 'react'
import { Flashcard, Card } from '@/lib/store'
import { flashcardsAPI } from '@/lib/api'

interface FlashcardEditorProps {
  flashcard: Flashcard
  onSave: () => void
}

export default function FlashcardEditor({ flashcard, onSave }: FlashcardEditorProps) {
  const [cards, setCards] = useState(flashcard.cards as Card[])
  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswer, setNewAnswer] = useState('')
  const [currentCardIndex, setCurrentCardIndex] = useState(null as number | null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [editingId, setEditingId] = useState(null as string | null)
  const [confirmDelete, setConfirmDelete] = useState(null as string | null)

  const handleAddCard = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return
    const newCard: Card = {
      id: Date.now().toString(),
      question: newQuestion,
      answer: newAnswer,
    }
    const updatedCards = [...cards, newCard]
    setCards(updatedCards)
    setNewQuestion('')
    setNewAnswer('')
    saveFlashcard(updatedCards)
  }

  const handleDeleteCard = (id: string) => {
    const updatedCards = cards.filter((c: Card) => c.id !== id)
    setCards(updatedCards)
    setCurrentCardIndex(null)
    setShowAnswer(false)
    setConfirmDelete(null)
    saveFlashcard(updatedCards)
  }

  const handleEditCard = (id: string, question: string, answer: string) => {
    const updatedCards = cards.map((c: Card) => c.id === id ? { ...c, question, answer } : c)
    setCards(updatedCards)
    setEditingId(null)
    saveFlashcard(updatedCards)
  }

  const saveFlashcard = async (updatedCards: Card[]) => {
    try {
      await flashcardsAPI.updateFlashcard(flashcard.id, flashcard.title, updatedCards)
      onSave()
    } catch (error) {
      console.error('Failed to save flashcard:', error)
    }
  }

  const currentCard = currentCardIndex !== null ? cards[currentCardIndex] : null

  return (
    <div className="space-y-6">
      {currentCard ? (
        <div className="max-w-2xl mx-auto">
          <div className="mb-4 flex justify-between items-center">
            <span className="text-sm text-[var(--text-color)]">
              Card {currentCardIndex! + 1} of {cards.length}
            </span>
            <button
              onClick={() => {
                setCurrentCardIndex(null)
                setShowAnswer(false)
              }}
              className="text-sm text-[var(--accent-color)] hover:underline"
            >
              Back to List
            </button>
          </div>

          <div
            onClick={() => setShowAnswer(!showAnswer)}
            className="bg-white rounded-3xl border-2 border-[var(--accent-color)] p-8 min-h-64 flex items-center justify-center cursor-pointer hover:shadow-lg transition-all"
          >
            <div className="text-center">
              <p className="text-sm text-[var(--text-color)] mb-4">
                {showAnswer ? 'Answer' : 'Question'}
              </p>
              <p className="text-2xl font-semibold text-[var(--text-color)] break-words">
                {showAnswer ? currentCard.answer : currentCard.question}
              </p>
              <p className="text-xs text-[var(--text-color)] mt-6">
                Click to {showAnswer ? 'see question' : 'reveal answer'}
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6 justify-center">
            <button
              onClick={() => {
                if (currentCardIndex! > 0) {
                  setCurrentCardIndex(currentCardIndex! - 1)
                  setShowAnswer(false)
                }
              }}
              disabled={currentCardIndex === 0}
              className="px-4 py-2 bg-[var(--accent-color)]/20 text-[var(--accent-color)] rounded-lg disabled:opacity-50"
            >
              ← Previous
            </button>
            <button
              onClick={() => setEditingId(currentCard.id)}
              className="px-4 py-2 bg-blue-500/20 text-blue-600 rounded-lg hover:bg-blue-500/30"
            >
              Edit
            </button>
            <button
              onClick={() => setConfirmDelete(currentCard.id)}
              className="px-4 py-2 bg-red-500/20 text-red-600 rounded-lg hover:bg-red-500/30"
            >
              Delete
            </button>
            <button
              onClick={() => {
                if (currentCardIndex! < cards.length - 1) {
                  setCurrentCardIndex(currentCardIndex! + 1)
                  setShowAnswer(false)
                }
              }}
              disabled={currentCardIndex === cards.length - 1}
              className="px-4 py-2 bg-[var(--accent-color)]/20 text-[var(--accent-color)] rounded-lg disabled:opacity-50"
            >
              Next →
            </button>
          </div>

          {confirmDelete === currentCard.id && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-700 mb-3">Are you sure you want to delete this card?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDeleteCard(currentCard.id)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {editingId === currentCard.id && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-[var(--accent-color)]/20 space-y-3">
              <input
                type="text"
                defaultValue={currentCard.question}
                placeholder="Question"
                className="w-full px-3 py-2 border border-[var(--accent-color)]/20 rounded-lg focus:outline-none focus:border-[var(--accent-color)] text-[var(--text-color)]"
                id="edit-question"
              />
              <input
                type="text"
                defaultValue={currentCard.answer}
                placeholder="Answer"
                className="w-full px-3 py-2 border border-[var(--accent-color)]/20 rounded-lg focus:outline-none focus:border-[var(--accent-color)] text-[var(--text-color)]"
                id="edit-answer"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const q = (document.getElementById('edit-question') as HTMLInputElement).value
                    const a = (document.getElementById('edit-answer') as HTMLInputElement).value
                    handleEditCard(currentCard.id, q, a)
                  }}
                  className="flex-1 bg-[var(--accent-color)] text-white px-3 py-2 rounded-lg hover:opacity-90"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[var(--accent-color)]/20 p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[var(--text-color)] mb-2">
                Question
              </label>
              <textarea
                value={newQuestion}
                onChange={(e: any) => setNewQuestion(e.target.value)}
                placeholder="Enter question..."
                className="w-full px-4 py-2 border border-[var(--accent-color)]/20 rounded-lg focus:outline-none focus:border-[var(--accent-color)] resize-none text-[var(--text-color)]"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--text-color)] mb-2">
                Answer
              </label>
              <textarea
                value={newAnswer}
                onChange={(e: any) => setNewAnswer(e.target.value)}
                placeholder="Enter answer..."
                className="w-full px-4 py-2 border border-[var(--accent-color)]/20 rounded-lg focus:outline-none focus:border-[var(--accent-color)] resize-none text-[var(--text-color)]"
                rows={3}
              />
            </div>
            <button
              onClick={handleAddCard}
              className="w-full bg-[var(--accent-color)] text-white py-2 rounded-lg hover:opacity-90"
            >
              Add Card
            </button>
          </div>

          {cards.length > 0 && (
            <div>
              <h3 className="font-semibold text-[var(--text-color)] mb-3">Cards ({cards.length})</h3>
              <div className="space-y-2">
                {cards.map((card: Card, idx: number) => (
                  <div
                    key={card.id}
                    onClick={() => {
                      setCurrentCardIndex(idx)
                      setShowAnswer(false)
                    }}
                    className="p-4 bg-white rounded-2xl border border-[var(--accent-color)]/20 hover:border-[var(--accent-color)]/40 cursor-pointer transition-all"
                  >
                    <p className="font-semibold text-[var(--text-color)]">{card.question}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
