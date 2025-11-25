import { create } from 'zustand'

export interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  tags: string[]
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
  setUser: (user: User | null) => void
  setNotes: (notes: Note[]) => void
  addNote: (note: Note) => void
  updateNote: (id: string, note: Partial<Note>) => void
  deleteNote: (id: string) => void
}

export const useStore = create<Store>((set) => ({
  user: null,
  notes: [],
  setUser: (user) => set({ user }),
  setNotes: (notes) => set({ notes }),
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
}))
