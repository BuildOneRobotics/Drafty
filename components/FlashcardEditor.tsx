'use client'

import { useState } from 'react'
import { Flashcard, Card } from '@/lib/store'
import { flashcardsAPI } from '@/lib/api'

interface FlashcardEditorProps {
  flashcard: Flashcard
  onSave: () => void
}

export default function FlashcardEditor({ flashcard, onSave }: FlashcardEditorProps) {
  const [cards, setCards] = useState<Card[]>(flashcard.cards)
  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswer, setNewAnswer] = useState('')
  const [currentCardIndex, setCurrentCardIndex] = useState<number | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)

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
    const updatedCards = cards.filter(c => c.id !== id)
    setCards(updatedCards)
    setCurrentCardIndex(null)
    setShowAnswer(false)
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
            <span className="text-sm text-[var(--text-color)]/60">
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
              <p className="text-sm text-[var(--text-color)]/60 mb-4">
                {showAnswer ? 'Answer' : 'Question'}
              </p>
              <p className="text-2xl font-semibold text-[var(--text-color)] break-words">
                {showAnswer ? currentCard.answer : currentCard.question}
              </p>
              <p className="text-xs text-[var(--text-color)]/40 mt-6">
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
              onClick={() => handleDeleteCard(currentCard.id)}
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
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Enter question..."
                className="w-full px-4 py-2 border border-[var(--accent-color)]/20 rounded-lg focus:outline-none focus:border-[var(--accent-color)] resize-none"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--text-color)] mb-2">
                Answer
              </label>
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Enter answer..."
                className="w-full px-4 py-2 border border-[var(--accent-color)]/20 rounded-lg focus:outline-none focus:border-[var(--accent-color)] resize-none"
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
                {cards.map((card, idx) => (
                  <div
                    key={card.id}
                    onClick={() => {
                      setCurrentCardIndex(idx)
                      setShowAnswer(false)
                    }}
                    className="p-4 bg-white rounded-2xl border border-[var(--accent-color)]/20 hover:border-[var(--accent-color)]/40 cursor-pointer transition-all"
                  >
                    <p className="font-semibold text-[var(--text-color)]">{card.question}</p>
                    <p className="text-sm text-[var(--text-color)]/60 mt-1">{card.answer}</p>
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
