'use client'

import React from 'react'
import { Template } from '@/lib/templates'
import * as TemplateIcons from './TemplateIcons'

interface TemplateSelectorProps {
  templates: Template[]
  onSelect: (template: Template) => void
  onCancel: () => void
  title: string
}

export default function TemplateSelector({ templates, onSelect, onCancel, title }: TemplateSelectorProps) {
  const getIconComponent = (iconName: string) => {
    const IconComponent = (TemplateIcons as any)[iconName]
    return IconComponent ? <IconComponent /> : <TemplateIcons.BlankNoteIcon />
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-[var(--accent-color)]/20">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-[var(--text-color)]">{title}</h3>
              <p className="text-sm text-[var(--text-color)]/60 mt-1">
                Choose a template to get started quickly, or start from scratch
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-[var(--text-color)]/60 hover:text-[var(--text-color)] text-2xl no-hover flex-shrink-0 ml-4"
            >
              ×
            </button>
          </div>
        </div>
        
        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-[var(--accent-color)]/10 to-[var(--accent-color)]/5 px-6 py-4 border-b border-[var(--accent-color)]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-[var(--accent-color)]">
                ✨ Save time with pre-formatted templates
              </p>
              <p className="text-xs text-[var(--text-color)]/70 mt-1">
                Professional layouts ready to customize. Click any template to preview and use.
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => onSelect(template)}
                className="p-4 border-2 border-[var(--accent-color)]/20 rounded-xl hover:border-[var(--accent-color)] hover:bg-[var(--accent-color)]/5 transition-all text-left group flex flex-col h-full relative overflow-hidden"
              >
                {/* Hover overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-color)]/0 to-[var(--accent-color)]/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                <div className="flex items-start gap-3 mb-3 relative z-10">
                  <div className="text-[var(--accent-color)] flex-shrink-0 group-hover:scale-110 transition-transform">
                    {getIconComponent(template.icon as string)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[var(--text-color)] group-hover:text-[var(--accent-color)] transition-colors truncate">
                      {template.name}
                    </h4>
                    <p className="text-xs text-[var(--text-color)]/60 mt-1 line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                </div>
                {template.preview && (
                  <div className="mt-auto pt-3 border-t border-[var(--accent-color)]/10 relative z-10">
                    <div 
                      className="text-xs text-[var(--text-color)]/70 bg-[var(--accent-color)]/5 rounded p-2"
                      dangerouslySetInnerHTML={{ __html: template.preview }}
                    />
                  </div>
                )}
                
                {/* Click to use indicator */}
                <div className="mt-2 text-xs text-[var(--accent-color)] font-medium opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                  Click to use →
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-6 border-t border-[var(--accent-color)]/20 bg-gray-50">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-[var(--text-color)]/60">
              💡 <strong>Tip:</strong> All templates are fully customizable after creation
            </p>
            <button
              onClick={onCancel}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-all flex-shrink-0"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
