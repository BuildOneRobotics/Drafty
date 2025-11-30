'use client'

import React from 'react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  type?: 'danger' | 'warning' | 'info'
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'danger'
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const colors = {
    danger: {
      bg: 'bg-red-500',
      hover: 'hover:bg-red-600',
      border: 'border-red-200'
    },
    warning: {
      bg: 'bg-yellow-500',
      hover: 'hover:bg-yellow-600',
      border: 'border-yellow-200'
    },
    info: {
      bg: 'bg-blue-500',
      hover: 'hover:bg-blue-600',
      border: 'border-blue-200'
    }
  }

  const colorScheme = colors[type]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border-2 border-[var(--accent-color)]/20">
        <h3 className="text-xl font-bold text-[var(--text-color)] mb-3">{title}</h3>
        <p className="text-[var(--text-color)]/70 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 ${colorScheme.bg} ${colorScheme.hover} text-white rounded-lg transition-all font-medium`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}