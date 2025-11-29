import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: `${API_URL}/api`,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  loginWithBuildOne: (code: string) => api.post('/auth/buildone', { code }),
  signup: (email: string, password: string, name: string) =>
    api.post('/auth/signup', { email, password, name }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
}

export const notesAPI = {
  getNotes: () => api.get('/notes'),
  createNote: (title: string, content: string, tags: string[] = []) =>
    api.post('/notes', { title, content, tags }),
  updateNote: (id: string, title: string, content: string, tags: string[] = []) =>
    api.put(`/notes/${id}`, { title, content, tags }),
  deleteNote: (id: string) => api.delete(`/notes/${id}`),
  syncNotes: () => api.post('/notes/sync'),
}

export const whiteboardsAPI = {
  getWhiteboards: () => api.get('/whiteboards'),
  createWhiteboard: (title: string, template: string) =>
    api.post('/whiteboards', { title, template }),
  updateWhiteboard: (id: string, title: string, content: string) =>
    api.put(`/whiteboards/${id}`, { title, content }),
  deleteWhiteboard: (id: string) => api.delete(`/whiteboards/${id}`),
}

export const flashcardsAPI = {
  getFlashcards: () => api.get('/flashcards'),
  createFlashcard: (title: string) =>
    api.post('/flashcards', { title, cards: [] }),
  updateFlashcard: (id: string, title: string, cards: any[]) =>
    api.put(`/flashcards/${id}`, { title, cards }),
  deleteFlashcard: (id: string) => api.delete(`/flashcards/${id}`),
}

export const notebooksAPI = {
  getNotebooks: () => api.get('/notebooks'),
  createNotebook: (name: string, folder?: string) =>
    api.post('/notebooks', { name, folder }),
  updateNotebook: (id: string, updates: any) =>
    api.put(`/notebooks/${id}`, updates),
  deleteNotebook: (id: string) => api.delete(`/notebooks/${id}`),
}

export default api
