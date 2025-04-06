import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  isFavorite: boolean
}

interface NotesState {
  notes: Note[]
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void
  
  updateNote: (id: string, note: Partial<Note>) => void
  deleteNote: (id: string) => void
  toggleFavorite: (id: string) => void
  getNote: (id: string) => Note | undefined
  searchNotes: (query: string) => Note[]
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],

      addNote: (note) => {
        const newNote: Note = {
          ...note,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({ notes: [...state.notes, newNote] }))
      },
      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...updates, updatedAt: new Date() }
              : note
          ),
        }))
      },
      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        }))
      },
      toggleFavorite: (id) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, isFavorite: !note.isFavorite }
              : note
          ),
        }))
      },
      getNote: (id) => {
        return get().notes.find((note) => note.id === id)
      },
      searchNotes: (query) => {
        const lowerQuery = query.toLowerCase()
        return get().notes.filter(
          (note) =>
            note.title.toLowerCase().includes(lowerQuery) ||
            note.content.toLowerCase().includes(lowerQuery)
        )
      },
    }),
    {
      // name in localo storage
      name: 'notes-storage', 
    }
  )
) 