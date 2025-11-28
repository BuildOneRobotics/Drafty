'use client'

import { useState, useEffect } from 'react'

interface DraftyFile {
  id: string
  name: string
  folder?: string
  sharedWith: string[]
  createdAt: string
}

interface FileManagerProps {
  user: any
}

export default function FileManager({ user }: FileManagerProps) {
  const [files, setFiles] = useState<DraftyFile[]>([])
  const [draggedFile, setDraggedFile] = useState<string | null>(null)
  const [showNewFile, setShowNewFile] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [shareWith, setShareWith] = useState<string>('')
  const [friends, setFriends] = useState<{id: string, name: string, canShare: boolean}[]>([])

  useEffect(() => {
    loadFiles()
    loadFriends()
  }, [])

  const loadFiles = () => {
    const saved = localStorage.getItem(`files-${user?.id}`)
    if (saved) {
      setFiles(JSON.parse(saved))
    }
  }

  const loadFriends = () => {
    const saved = localStorage.getItem('friends')
    if (saved) {
      const allFriends = JSON.parse(saved)
      setFriends(allFriends.filter((f: any) => f.canShare))
    }
  }

  const saveFiles = (updated: DraftyFile[]) => {
    setFiles(updated)
    localStorage.setItem(`files-${user?.id}`, JSON.stringify(updated))
  }

  const handleAddFile = () => {
    if (!newFileName.trim()) return
    const newFile: DraftyFile = {
      id: Date.now().toString(),
      name: newFileName,
      sharedWith: [],
      createdAt: new Date().toISOString()
    }
    saveFiles([newFile, ...files])
    setNewFileName('')
    setShowNewFile(false)
  }

  const handleDeleteFile = (id: string) => {
    saveFiles(files.filter(f => f.id !== id))
    setSelectedFile(null)
  }

  const handleShareFile = (fileId: string, friendId: string) => {
    const updated = files.map(f => 
      f.id === fileId && !f.sharedWith.includes(friendId)
        ? { ...f, sharedWith: [...f.sharedWith, friendId] }
        : f
    )
    saveFiles(updated)
  }

  const handleUnshareFile = (fileId: string, friendId: string) => {
    const updated = files.map(f =>
      f.id === fileId
        ? { ...f, sharedWith: f.sharedWith.filter(id => id !== friendId) }
        : f
    )
    saveFiles(updated)
  }

  const handleMoveFile = (fileId: string, folder?: string) => {
    const updated = files.map(f =>
      f.id === fileId ? { ...f, folder } : f
    )
    saveFiles(updated)
  }

  const selectedFileData = files.find(f => f.id === selectedFile)

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[var(--text-color)]">Files</h2>
        <button
          onClick={() => setShowNewFile(true)}
          className="bg-[var(--accent-color)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all"
        >
          + New File
        </button>
      </div>

      {showNewFile && (
        <div className="mb-6 p-4 bg-white rounded-2xl border border-[var(--accent-color)]/20 space-y-3">
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
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
              onClick={() => setShowNewFile(false)}
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
            files.map(file => (
              <div
                key={file.id}
                draggable
                onDragStart={() => setDraggedFile(file.id)}
                onDragEnd={() => setDraggedFile(null)}
                onClick={() => setSelectedFile(file.id)}
                className={`p-4 bg-white rounded-2xl border-2 cursor-move transition-all ${
                  selectedFile === file.id
                    ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/5'
                    : 'border-[var(--accent-color)]/20 hover:border-[var(--accent-color)]/40'
                } ${draggedFile === file.id ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[var(--text-color)]">{file.name}</p>
                    <p className="text-xs text-[var(--text-color)]/60">
                      {file.folder ? `Folder: ${file.folder}` : 'Root'} • Shared with {file.sharedWith.length}
                    </p>
                  </div>
                  <span className="text-xs text-[var(--text-color)]/40">⋮⋮</span>
                </div>
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
                  {friends.map(friend => (
                    <label key={friend.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFileData.sharedWith.includes(friend.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleShareFile(selectedFileData.id, friend.id)
                          } else {
                            handleUnshareFile(selectedFileData.id, friend.id)
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-[var(--text-color)]">{friend.name}</span>
                    </label>
                  ))}
                  {friends.length === 0 && (
                    <p className="text-xs text-[var(--text-color)]/60">No friends available for sharing</p>
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
