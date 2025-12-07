'use client'

import React from 'react'
import { Template } from '@/lib/templates'

interface TemplateSelectorProps {
  templates: Template[]
  onSelect: (template: Template) => void
  onCancel: () => void
  title: string
}

export default function TemplateSelector({ templates, onSelect, onCancel, title }: TemplateSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-[var(--accent-color)]/20">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-[var(--text-color)]">{title}</h3>
            <button
              onClick={onCancel}
              className="text-[var(--text-color)]/60 hover:text-[var(--text-color)] text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => onSelect(template)}
                className="p-4 border-2 border-[var(--accent-color)]/20 rounded-xl hover:border-[var(--accent-color)] hover:bg-[var(--accent-color)]/5 transition-all text-left group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{template.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[var(--text-color)] group-hover:text-[var(--accent-color)] transition-colors">
                      {template.name}
                    </h4>
                    <p className="text-sm text-[var(--text-color)]/60 mt-1">
                      {template.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-6 border-t border-[var(--accent-color)]/20">
          <button
            onClick={onCancel}
            className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
