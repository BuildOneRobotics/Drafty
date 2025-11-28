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
  setUser: (user: User | null) => void
  setNotes: (notes: Note[]) => void
  setNotebooks: (notebooks: Notebook[]) => void
  addNote: (note: Note) => void
  updateNote: (id: string, note: Partial<Note>) => void
  deleteNote: (id: string) => void
  addNotebook: (notebook: Notebook) => void
  updateNotebook: (id: string, notebook: Partial<Notebook>) => void
  deleteNotebook: (id: string) => void
}

export const useStore = create<Store>((set) => ({
  user: null,
  notes: [],
  notebooks: [],
  setUser: (user) => set({ user }),
  setNotes: (notes) => set({ notes }),
  setNotebooks: (notebooks) => set({ notebooks }),
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
}))
