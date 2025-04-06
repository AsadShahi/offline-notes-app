"use client"

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useNotesStore } from '@/store/notesStore'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { formatDistanceToNow } from 'date-fns'
import debounce from 'lodash.debounce'
import EditorToolbar from '@/components/modules/tiptap/EditorToolbar'
import DeleteConfirmationModal from '@/components/modules/modal/DeleteConfirmationModal'
import NotFound from '@/app/not-found'

interface NoteEditorProps {
  noteId: string
}

export default function NoteEditor({ noteId }: NoteEditorProps) {
  const router = useRouter()
  const { getNote, updateNote, deleteNote, toggleFavorite } = useNotesStore()
  const note = getNote(noteId)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Initialize title from note
  useEffect(() => {
    if (note) {
      setTitle(note.title)
    }
  }, [note])

  // Create debounced save functions
  const saveContent = useCallback(
    (content: string) => {
      if (noteId) {
        setIsSaving(true)
        updateNote(noteId, { content })
        setLastSaved(new Date())
        setTimeout(() => setIsSaving(false), 500)
      }
    },
    [noteId, updateNote]
  )

  const debouncedSaveContent = useMemo(
    () => debounce(saveContent, 1000),
    [saveContent]
  )

  const saveTitle = useCallback(
    (newTitle: string) => {
      if (noteId && note && newTitle !== note.title) {
        setIsSaving(true)
        updateNote(noteId, { title: newTitle })
        setLastSaved(new Date())
        setTimeout(() => setIsSaving(false), 500)
      }
    },
    [noteId, note, updateNote]
  )

  const debouncedSaveTitle = useMemo(
    () => debounce(saveTitle, 500),
    [saveTitle]
  )

  // Handle title changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    debouncedSaveTitle(newTitle)
  }

  // Editor setup
  const editor = useEditor({
    extensions: [StarterKit],
    content: note?.content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg dark:prose-invert focus:outline-none max-w-none',
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML()
      debouncedSaveContent(content)
    },
  })

  // Sync editor content when note changes
  useEffect(() => {
    if (note && editor && note.content !== editor.getHTML()) {
      editor.commands.setContent(note.content)
    }
  }, [note, editor])

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSaveContent.cancel()
      debouncedSaveTitle.cancel()
    }
  }, [debouncedSaveContent, debouncedSaveTitle])

  const handleDelete = () => {
    if (noteId) {
      deleteNote(noteId)
      router.push('/notes')
    }
  }

  if (!note) {
    return <NotFound />
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="text-3xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-md w-full py-1 px-2 -ml-2"
            placeholder="Untitled Note"
            aria-label="Note title"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <SaveStatus isSaving={isSaving} lastSaved={lastSaved} />
          
          <button
            onClick={() => toggleFavorite(noteId)}
            className={`p-2 rounded-md ${
              note.isFavorite ? 'text-yellow-500' : 'text-gray-400'
            } hover:text-yellow-500 focus:outline-none transition-colors`}
            aria-label={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <StarIcon isFilled={note.isFavorite} />
          </button>
          
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 rounded-md text-gray-400 hover:text-red-500 focus:outline-none transition-colors"
            aria-label="Delete note"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {editor && <EditorToolbar editor={editor} />}

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 min-h-[500px] bg-white dark:bg-gray-800 shadow-sm">
        <EditorContent editor={editor} className="min-h-[500px]" />
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
      />
    </div>
  )
}

// Extracted components:

interface SaveStatusProps {
  isSaving: boolean
  lastSaved: Date | null
}

function SaveStatus({ isSaving, lastSaved }: SaveStatusProps) {
  return (
    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
      {isSaving ? (
        <span className="flex items-center">
          <SpinnerIcon className="mr-2" />
          Saving...
        </span>
      ) : lastSaved ? (
        <span>Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}</span>
      ) : null}
    </div>
  )
}

interface StarIconProps {
  isFilled: boolean
}

function StarIcon({ isFilled }: StarIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={isFilled ? "currentColor" : "none"} stroke="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  )
}

function SpinnerIcon({ className = "" }) {
  return (
    <svg className={`animate-spin h-4 w-4 text-gray-500 ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  )
}