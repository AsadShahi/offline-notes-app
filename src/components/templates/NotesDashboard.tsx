"use client"

import { useState, useEffect } from 'react'
import { useNotesStore } from '@/store/notesStore'
import Link from 'next/link'
import { useThemeStore } from '@/store/themeStore'
import { formatDistanceToNow } from 'date-fns'

export default function NotesDashboard() {
  const { notes, addNote, toggleFavorite, searchNotes } = useNotesStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(notes)
  const [isSearching, setIsSearching] = useState(false)
  const { theme } = useThemeStore()

  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true)
      const timer = setTimeout(() => {
        setSearchResults(searchNotes(searchQuery))
        setIsSearching(false)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setSearchResults(notes)
      setIsSearching(false)
    }
  }, [searchQuery, notes, searchNotes])

  const handleAddNote = () => {
    addNote({
      title: 'Untitled Note',
      content: '',
      isFavorite: false,
    })
  }
// sort node base the last update date
  const sortedNotes = [...searchResults].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )

  return (
    <div className={`space-y-6 ${theme === 'dark' ? 'text-gray-800 text-white' : ''}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className={`${theme === 'dark' ? 'text-gray-800' : ''}text-3xl font-bold`}>My Notes</h1>
        <button
          onClick={handleAddNote}
          className={`${theme === 'dark' ? 'text-gray-800 text-white' : ''} flex items-center cursor-pointer justify-center px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg shadow transition-colors `}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create New Note
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
        {isSearching && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>

      {sortedNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          {searchQuery ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl font-semibold mb-2">No matching notes found</h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                We couldn&apos;t find any notes matching your search. Try a different search term or create a new note.
              </p>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <h2 className="text-xl font-semibold mb-2">No notes yet</h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                Create your first note to get started. Your notes will be saved locally in your browser.
              </p>
              <button
                onClick={handleAddNote}
                className={`${theme === 'dark' ? 'text-gray-100' : ''} flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg shadow transition-colors`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create Note
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedNotes.map((note) => (
            <div
              key={note.id}
              className="group border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <Link href={`/notes/${note.id}`} className={`${theme === 'dark' ? 'bg-gray-600 text-gray-100' : ''} block`}>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {note.title}
                    </h2>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleFavorite(note.id)
                      }}
                      className={`${
                        note.isFavorite ? 'text-yellow-500' : 'text-gray-400'
                      } hover:text-yellow-500 focus:outline-none transition-colors`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  </div>
                  <div 
                    className={`${theme === 'dark' ? 'bg-gray-600 text-white' : ''} mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2 h-10 overflow-hidden`}
                    dangerouslySetInnerHTML={{ __html: note.content || 'No content' }}
                  />
                </div>
                <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : ''} px-4 py-2 bg-gray-50 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center`}>
                  <span>
                    {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                  </span> 
                  {note.isFavorite && (
                    <span className="flex items-center text-yellow-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Favorite
                    </span>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}