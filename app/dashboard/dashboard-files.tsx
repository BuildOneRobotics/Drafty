'use client'

import React, { useState, useEffect } from 'react'
import FileListItem from '@/components/FileListItem'
import TemplateSelector from '@/components/TemplateSelector'
import { fileTemplates, Template } from '@/lib/templates'

interface DraftyFile {
  id: string
  name: string
  folder?: string
  sharedWith: string[]
  createdAt: string
  updatedAt?: string
}

interface User {
  id: string
  name: string
  email: string
}

interface Collaborator {
  id: string
  name: string
  canShare: boolean
}

interface FileManagerProps {
  user: User | null
}

export default function FileManager({ user }: FileManagerProps) {
  const [files, setFiles] = useState<DraftyFile[]>([])
  const [draggedFile, setDraggedFile] = useState<string | null>(null)
  const [showNewFile, setShowNewFile] = useState(false)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [folders, setFolders] = useState<string[]>(['Documents', 'Images', 'Projects'])
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

  useEffect(() => {
    loadFiles()
    loadCollaborators()
  }, [])

  const loadFiles = () => {
    const saved = localStorage.getItem(`files-${user?.id}`)
    if (saved) {
      try {
        setFiles(JSON.parse(saved))
      } catch (error) {
        console.error('Failed to parse files:', error)
        setFiles([])
      }
    }
  }

  const loadCollaborators = () => {
    // Try new key first, fallback to old key for migration
    const saved = localStorage.getItem('collaborators') || localStorage.getItem('friends')
    if (saved) {
      try {
        const allCollaborators = JSON.parse(saved)
        setCollaborators(allCollaborators.filter((f: Collaborator) => f.canShare))
        // Migrate from old key to new key
        if (localStorage.getItem('friends') && !localStorage.getItem('collaborators')) {
          localStorage.setItem('collaborators', saved)
        }
      } catch (error) {
        console.error('Failed to parse collaborators:', error)
        setCollaborators([])
      }
    }
  }

  const saveFiles = (updated: DraftyFile[]) => {
    setFiles(updated)
    localStorage.setItem(`files-${user?.id}`, JSON.stringify(updated))
  }

  const handleNewFileClick = () => {
    setShowTemplateSelector(true)
  }

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template)
    setShowTemplateSelector(false)
    setShowNewFile(true)
    if (template.id === 'blank') {
      setNewFileName('')
    } else {
      setNewFileName(template.name)
    }
  }

  const handleAddFile = () => {
    if (!newFileName.trim()) return
    const newFile: DraftyFile = {
      id: Date.now().toString(),
      name: newFileName,
      sharedWith: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    saveFiles([newFile, ...files])
    setNewFileName('')
    setShowNewFile(false)
    setSelectedTemplate(null)
  }

  const handleDeleteFile = (id: string) => {
    saveFiles(files.filter((f: DraftyFile) => f.id !== id))
    setSelectedFile(null)
  }

  const handleRenameFile = (id: string, newName: string) => {
    const updated = files.map((f: DraftyFile) => 
      f.id === id 
        ? { ...f, name: newName, updatedAt: new Date().toISOString() }
        : f
    )
    saveFiles(updated)
  }

  const handleMoveFile = (id: string, newFolder?: string) => {
    const updated = files.map((f: DraftyFile) => 
      f.id === id 
        ? { ...f, folder: newFolder, updatedAt: new Date().toISOString() }
        : f
    )
    saveFiles(updated)
  }

  const handleShareFile = (fileId: string, collaboratorId: string) => {
    const updated = files.map((f: DraftyFile) => 
      f.id === fileId && !f.sharedWith.includes(collaboratorId)
        ? { ...f, sharedWith: [...f.sharedWith, collaboratorId] }
        : f
    )
    saveFiles(updated)
  }

  const handleUnshareFile = (fileId: string, collaboratorId: string) => {
    const updated = files.map((f: DraftyFile) =>
      f.id === fileId
        ? { ...f, sharedWith: f.sharedWith.filter((id: string) => id !== collaboratorId) }
        : f
    )
    saveFiles(updated)
  }

  const handleAddFolder = () => {
    if (!newFolderName.trim() || folders.includes(newFolderName.trim())) return
    setFolders([...folders, newFolderName.trim()])
    setNewFolderName('')
    setShowNewFolder(false)
  }

  const selectedFileData = files.find((f: DraftyFile) => f.id === selectedFile)

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[var(--text-color)]">Files</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowNewFolder(true)}
            className="bg-[var(--accent-color)]/20 text-[var(--accent-color)] px-4 py-2 rounded-lg hover:bg-[var(--accent-color)]/30 transition-all"
          >
            + New Folder
          </button>
          <button
            onClick={handleNewFileClick}
            className="bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all"
          >
            + New File
          </button>
        </div>
      </div>

      {showNewFolder && (
        <div className="mb-6 p-4 bg-white rounded-2xl border border-[var(--accent-color)]/20 space-y-3">
          <input
            type="text"
            value={newFolderName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            className="w-full px-3 py-2 border border-[var(--accent-color)]/20 rounded-lg focus:outline-none focus:border-[var(--accent-color)] text-[var(--text-color)]"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddFolder}
              className="flex-1 bg-[var(--accent-color)] text-white px-3 py-2 rounded-lg hover:opacity-90"
            >
              Create Folder
            </button>
            <button
              onClick={() => setShowNewFolder(false)}
              className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showTemplateSelector && (
        <TemplateSelector
          templates={fileTemplates}
          onSelect={handleTemplateSelect}
          onCancel={() => setShowTemplateSelector(false)}
          title="Choose a File Template"
        />
      )}

      {showNewFile && (
        <div className="mb-6 p-4 bg-white rounded-2xl border border-[var(--accent-color)]/20 space-y-3">
          <input
            type="text"
            value={newFileName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFileName(e.target.value)}
            placeholder="File name"
            className="w-full px-3 py-2 border border-[var(--accent-color)]/20 rounded-lg focus:outline-none focus:border-[var(--accent-color)] text-[var(--text-color)]"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddFile}
              className="flex-1 bg-[var(--accent-color)] text-white px-3 py-2 rounded-lg hover:opacity-90"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowNewFile(false)
                setSelectedTemplate(null)
              }}
              className="flex-1 bg-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {files.length === 0 ? (
            <p className="text-[var(--text-color)]/60">No files yet. Create one to get started!</p>
          ) : (
            files.map((file: DraftyFile) => (
              <div
                key={file.id}
                draggable
                onDragStart={() => setDraggedFile(file.id)}
                onDragEnd={() => setDraggedFile(null)}
              >
                <FileListItem
                  file={file}
                  onDelete={handleDeleteFile}
                  onRename={handleRenameFile}
                  onMove={handleMoveFile}
                  onSelect={(f: DraftyFile) => setSelectedFile(f.id)}
                  isSelected={selectedFile === file.id}
                  isDragging={draggedFile === file.id}
                  folders={folders}
                />
              </div>
            ))
          )}
        </div>

        {selectedFileData && (
          <div className="bg-white rounded-2xl border border-[var(--accent-color)]/20 p-4 h-fit">
            <h3 className="font-bold text-[var(--text-color)] mb-4">File Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[var(--text-color)]/60 mb-1">Name</p>
                <p className="font-medium text-[var(--text-color)]">{selectedFileData.name}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-color)]/60 mb-1">Created</p>
                <p className="text-sm text-[var(--text-color)]">{new Date(selectedFileData.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-color)]/60 mb-2">Share with</p>
                <div className="space-y-2">
                  {collaborators.map((collaborator: Collaborator) => (
                    <label key={collaborator.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFileData.sharedWith.includes(collaborator.id)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          if (e.target.checked) {
                            handleShareFile(selectedFileData.id, collaborator.id)
                          } else {
                            handleUnshareFile(selectedFileData.id, collaborator.id)
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-[var(--text-color)]">{collaborator.name}</span>
                    </label>
                  ))}
                  {collaborators.length === 0 && (
                    <p className="text-xs text-[var(--text-color)]/60">No collaborators available for sharing</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDeleteFile(selectedFileData.id)}
                className="w-full mt-4 text-red-500 hover:text-red-700 text-sm font-medium py-2"
              >
                Delete File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
