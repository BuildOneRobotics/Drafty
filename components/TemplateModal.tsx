'use client'

import { useState } from 'react'

interface TemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (template: 'plain' | 'lined' | 'grid-small' | 'grid-medium' | 'grid-large' | 'blank') => void
  type: 'note' | 'whiteboard'
}

export default function TemplateModal({ isOpen, onClose, onSelect, type }: TemplateModalProps) {
  if (!isOpen) return null

  const templates = type === 'whiteboard' ? [
    { id: 'plain', name: 'Plain', desc: 'Blank canvas' },
    { id: 'lined', name: 'Lined', desc: 'Lined paper' },
    { id: 'grid-small', name: 'Grid (Small)', desc: 'Small grid squares' },
    { id: 'grid-medium', name: 'Grid (Medium)', desc: 'Medium grid squares' },
    { id: 'grid-large', name: 'Grid (Large)', desc: 'Large grid squares' },
  ] : [
    { id: 'blank', name: 'Blank', desc: 'Empty note' },
    { id: 'plain', name: 'Plain', desc: 'Plain text' },
    { id: 'lined', name: 'Lined', desc: 'Lined paper' },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-bold text-[var(--text-color)] mb-6">
          Choose a template for your {type}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => {
                onSelect(template.id as any)
                onClose()
              }}
              className="p-4 border-2 border-[var(--accent-color)]/30 rounded-2xl hover:border-[var(--accent-color)] hover:bg-[var(--accent-color)]/5 transition-all text-center"
            >
              <div className="text-lg font-semibold text-[var(--text-color)]">{template.name}</div>
              <div className="text-sm text-[var(--text-color)]/60">{template.desc}</div>
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full py-2 text-[var(--text-color)] hover:bg-[var(--accent-color)]/10 rounded-lg transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
