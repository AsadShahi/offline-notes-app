"use client"

import { useNotesStore } from '@/store/notesStore'
import Link from 'next/link'
// import { formatDistanceToNow } from 'date-fns'

export default function FavoritesPage() {
  const { notes, toggleFavorite } = useNotesStore()
  const favoriteNotes = notes.filter((note) => note.isFavorite)
  
  // Sort by most recently updated
  const sortedFavorites = [...favoriteNotes].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Favorite Notes</h1>

      {sortedFavorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-500 mb-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">No favorite notes yet</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
            Star a note to add it to your favorites. Favorite notes will appear here for quick access.
          </p>
          <Link 
            href="/notes" 
            className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Notes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedFavorites.map((note) => (
            <div
              key={note.id}
              className="group border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <Link href={`/notes/${note.id}`} className="block">
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
                      className="text-yellow-500 hover:text-yellow-600 focus:outline-none transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  </div>
                  <div 
                    className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2 h-10 overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: note.content || 'No content' }}
                  />
                </div>
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-400">
                  {/* {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })} */}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 