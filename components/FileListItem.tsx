'use client'

import React, { useState, useRef, useEffect } from 'react'
import ConfirmDialog from './ConfirmDialog'

interface FileListItemProps {
  file: {
    id: string
    name: string
    folder?: string
    sharedWith?: string[]
    createdAt?: string
    updatedAt?: string
  }
  onDelete: (id: string) => void
  onRename: (id: string, newName: string) => void
  onMove: (id: string, newFolder?: string) => void
  onSelect?: (file: any) => void
  isSelected?: boolean
  isDragging?: boolean
  folders?: string[]
}

export default function FileListItem({ 
  file, 
  onDelete, 
  onRename, 
  onMove, 
  onSelect, 
  isSelected, 
  isDragging,
  folders = []
}: FileListItemProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState(file.name)
  const [showMoveMenu, setShowMoveMenu] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  const menuRef = useRef<HTMLDivElement>(null)
  const renameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
        setShowMoveMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      renameInputRef.current.focus()
      renameInputRef.current.select()
    }
  }, [isRenaming])

  const handleRename = () => {
    if (newName.trim() && newName !== file.name) {
      onRename(file.id, newName.trim())
    }
    setIsRenaming(false)
    setShowMenu(false)
  }

  const handleDelete = () => {
    onDelete(file.id)
    setShowDeleteConfirm(false)
    setShowMenu(false)
  }

  const handleConfirmDelete = () => {
    handleDelete()
  }

  const handleMove = (folder?: string) => {
    onMove(file.id, folder)
    setShowMoveMenu(false)
    setShowMenu(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRename()
    } else if (e.key === 'Escape') {
      setNewName(file.name)
      setIsRenaming(false)
    }
  }

  return (
    <div
      className={`p-4 bg-white rounded-2xl border-2 cursor-pointer transition-all relative ${
        isSelected
          ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/5'
          : 'border-[var(--accent-color)]/20 hover:border-[var(--accent-color)]/40'
      } ${isDragging ? 'opacity-50' : ''}`}
      onClick={() => onSelect?.(file)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          {isRenaming ? (
            <input
              ref={renameInputRef}
              type="text"
              value={newName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyPress}
              className="w-full font-semibold text-[var(--text-color)] bg-transparent border-b border-[var(--accent-color)] outline-none"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            />
          ) : (
            <p className="font-semibold text-[var(--text-color)] truncate">{file.name}</p>
          )}
          <div className="flex items-center gap-2 mt-1">
            {file.folder && (
              <span className="text-xs text-[var(--text-color)]/60 bg-[var(--accent-color)]/10 px-2 py-1 rounded">
                {file.folder}
              </span>
            )}
            {file.sharedWith && file.sharedWith.length > 0 && (
              <span className="text-xs text-[var(--text-color)]/60">
                Shared with {file.sharedWith.length}
              </span>
            )}
            {file.updatedAt && (
              <span className="text-xs text-[var(--text-color)]/40">
                {new Date(file.updatedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="p-2 hover:bg-[var(--accent-color)]/10 rounded-lg transition-colors"
            aria-label="File options"
          >
            <span className="text-[var(--text-color)]/60 text-lg">⋮</span>
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-[var(--accent-color)]/20 rounded-lg shadow-lg z-10 min-w-[120px]">
              <button
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation()
                  setIsRenaming(true)
                  setShowMenu(false)
                }}
                className="w-full px-3 py-2 text-left text-sm text-[var(--text-color)] hover:bg-[var(--accent-color)]/10 transition-colors"
              >
                Rename
              </button>
              
              <button
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation()
                  setShowMoveMenu(true)
                }}
                className="w-full px-3 py-2 text-left text-sm text-[var(--text-color)] hover:bg-[var(--accent-color)]/10 transition-colors"
              >
                Move to...
              </button>
              
              <button
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation()
                  setShowDeleteConfirm(true)
                }}
                className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
          
          {showMoveMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-[var(--accent-color)]/20 rounded-lg shadow-lg z-20 min-w-[140px]">
              <button
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation()
                  handleMove()
                }}
                className="w-full px-3 py-2 text-left text-sm text-[var(--text-color)] hover:bg-[var(--accent-color)]/10 transition-colors"
              >
                Root folder
              </button>
              {folders.map((folder) => (
                <button
                  key={folder}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation()
                    handleMove(folder)
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-[var(--text-color)] hover:bg-[var(--accent-color)]/10 transition-colors"
                >
                  {folder}
                </button>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete File?"
        message={`Are you sure you want to delete "${file.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  )
}