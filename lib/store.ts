import { create } from 'zustand'

export interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  tags: string[]
  notebookId?: string
  pageNumber?: number
}

export interface Page {
  id: string
  number: number
  title: string
  content: string
}

export interface Notebook {
  id: string
  name: string
  folder: string
  pages: Page[]
}

export interface Whiteboard {
  id: string
  title: string
  template: 'plain' | 'lined' | 'grid-small' | 'grid-medium' | 'grid-large'
  content: string
  createdAt: string
  updatedAt: string
}

export interface Card {
  id: string
  question: string
  answer: string
}

export interface Flashcard {
  id: string
  title: string
  cards: Card[]
  folderId?: string
  createdAt: string
  updatedAt: string
}

export interface FlashcardFolder {
  id: string
  name: string
  color: string
}

export interface DraftyFile {
  id: string
  name: string
  folder?: string
  sharedWith: string[]
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  name: string
  buildoneId: string
}

interface Store {
  user: User | null
  notes: Note[]
  notebooks: Notebook[]
  whiteboards: Whiteboard[]
  flashcards: Flashcard[]
  flashcardFolders: FlashcardFolder[]
  files: DraftyFile[]
  setUser: (user: User | null) => void
  setNotes: (notes: Note[]) => void
  setNotebooks: (notebooks: Notebook[]) => void
  setWhiteboards: (whiteboards: Whiteboard[]) => void
  setFlashcards: (flashcards: Flashcard[]) => void
  setFlashcardFolders: (folders: FlashcardFolder[]) => void
  setFiles: (files: DraftyFile[]) => void
  addNote: (note: Note) => void
  updateNote: (id: string, note: Partial<Note>) => void
  deleteNote: (id: string) => void
  addNotebook: (notebook: Notebook) => void
  updateNotebook: (id: string, notebook: Partial<Notebook>) => void
  deleteNotebook: (id: string) => void
  addWhiteboard: (whiteboard: Whiteboard) => void
  updateWhiteboard: (id: string, whiteboard: Partial<Whiteboard>) => void
  deleteWhiteboard: (id: string) => void
  addFlashcard: (flashcard: Flashcard) => void
  updateFlashcard: (id: string, flashcard: Partial<Flashcard>) => void
  deleteFlashcard: (id: string) => void
  addFlashcardFolder: (folder: FlashcardFolder) => void
  deleteFlashcardFolder: (id: string) => void
  updateFlashcardFolder: (id: string, folder: Partial<FlashcardFolder>) => void
  addFile: (file: DraftyFile) => void
  updateFile: (id: string, file: Partial<DraftyFile>) => void
  deleteFile: (id: string) => void
}

export const useStore = create<Store>((set) => (
  {
    user: null,
    notes: [],
    notebooks: [],
    whiteboards: [],
    flashcards: [],
    flashcardFolders: [],
    files: [],
    setUser: (user) => set({ user }),
    setNotes: (notes) => set({ notes }),
    setNotebooks: (notebooks) => set({ notebooks }),
    setWhiteboards: (whiteboards) => set({ whiteboards }),
    setFlashcards: (flashcards) => set({ flashcards }),
    setFlashcardFolders: (folders) => set({ flashcardFolders: folders }),
    setFiles: (files) => set({ files }),
    addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
    updateNote: (id, updates) =>
      set((state) => ({
        notes: state.notes.map((note) =>
          note.id === id ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note
        ),
      })),
    deleteNote: (id) =>
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
      })),
    addNotebook: (notebook) => set((state) => ({ notebooks: [notebook, ...state.notebooks] })),
    updateNotebook: (id, updates) =>
      set((state) => ({
        notebooks: state.notebooks.map((nb) =>
          nb.id === id ? { ...nb, ...updates } : nb
        ),
      })),
    deleteNotebook: (id) =>
      set((state) => ({
        notebooks: state.notebooks.filter((nb) => nb.id !== id),
      })),
    addWhiteboard: (whiteboard) => set((state) => ({ whiteboards: [whiteboard, ...state.whiteboards] })),
    updateWhiteboard: (id, updates) =>
      set((state) => ({
        whiteboards: state.whiteboards.map((wb) =>
          wb.id === id ? { ...wb, ...updates, updatedAt: new Date().toISOString() } : wb
        ),
      })),
    deleteWhiteboard: (id) =>
      set((state) => ({
        whiteboards: state.whiteboards.filter((wb) => wb.id !== id),
      })),
    addFlashcard: (flashcard) => set((state) => ({ flashcards: [flashcard, ...state.flashcards] })),
    updateFlashcard: (id, updates) =>
      set((state) => ({
        flashcards: state.flashcards.map((fc) =>
          fc.id === id ? { ...fc, ...updates, updatedAt: new Date().toISOString() } : fc
        ),
      })),
    deleteFlashcard: (id) =>
      set((state) => ({
        flashcards: state.flashcards.filter((fc) => fc.id !== id),
      })),
    addFlashcardFolder: (folder) => set((state) => ({ flashcardFolders: [folder, ...state.flashcardFolders] })),
    deleteFlashcardFolder: (id) =>
      set((state) => ({
        flashcardFolders: state.flashcardFolders.filter((f) => f.id !== id),
        flashcards: state.flashcards.map((fc) => fc.folderId === id ? { ...fc, folderId: undefined } : fc),
      })),
    updateFlashcardFolder: (id, updates) =>
      set((state) => ({
        flashcardFolders: state.flashcardFolders.map((f) =>
          f.id === id ? { ...f, ...updates } : f
        ),
      })),
    addFile: (file) => set((state) => ({ files: [file, ...state.files] })),
    updateFile: (id, updates) =>
      set((state) => ({
        files: state.files.map((f) =>
          f.id === id ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f
        ),
      })),
    deleteFile: (id) =>
      set((state) => ({
        files: state.files.filter((f) => f.id !== id),
      })),
  }
))
