"use client"

import { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { useNotesStore } from '@/store/notesStore'

export default function SettingsPage() {
    const { theme, toggleTheme } = useThemeStore()
    const { notes } = useNotesStore()
    const [showExportSuccess, setShowExportSuccess] = useState(false)
    const [showImportSuccess, setShowImportSuccess] = useState(false)
    const [importError, setImportError] = useState('')

    const handleExportNotes = () => {
        try {
            const notesData = JSON.stringify(notes, null, 2)
            const blob = new Blob([notesData], { type: 'application/json' })
            const url = URL.createObjectURL(blob)

            const a = document.createElement('a')
            a.href = url
            a.download = `notes-backup-${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)

            setShowExportSuccess(true)
            setTimeout(() => setShowExportSuccess(false), 3000)
        } catch (error) {
            console.error("Error exporting notes:", error)
        }
    }

    const handleImportNotes = (event: React.ChangeEvent<HTMLInputElement>) => {
        setImportError('')
        setShowImportSuccess(false)

        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()

        reader.onload = (e) => {
            try {
                const content = e.target?.result as string
                const importedNotes = JSON.parse(content)

                if (!Array.isArray(importedNotes)) {
                    setImportError('Invalid file format. The imported file must contain an array of notes.')
                    return
                }

                // Validate the structure of imported notes here if needed

                // Handle the imported notes (you'd need to add an importNotes method to your store)
                // notesStore.importNotes(importedNotes)

                setShowImportSuccess(true)
                setTimeout(() => setShowImportSuccess(false), 3000)
            } catch (error) {
                console.error("Error importing notes:", error)
                setImportError('Could not parse the imported file. Please make sure it is a valid JSON file.')
            }
        }

        reader.readAsText(file)

        // Reset the input value to allow reimporting the same file
        event.target.value = ''
    }

    return (

        <div className={`${theme=='dark'?'bg-dark text-gray-800':''} space-y-8 max-w-2xl`}>

            <h1 className={`${theme=='dark'?'bg-dark text-gray-200':''}text-3xl font-bold`}>Settings</h1>

            <div className="space-y-6">
                {/* Theme Setting */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                    <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold">Appearance</h2>
                    </div>
                    <div className="px-6 py-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium">Theme</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Choose your preferred theme
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => toggleTheme('light')}
                                    className={`flex items-center justify-center px-3 py-2 rounded-md transition-colors ${theme === 'light'
                                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => toggleTheme('dark')}
                                    className={`flex items-center justify-center px-3 py-2 rounded-md transition-colors ${theme === 'dark'
                                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => toggleTheme('system')}
                                    className={`flex items-center justify-center px-3 py-2 rounded-md transition-colors ${theme === 'system'
                                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Data Management */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                    <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold">Data Management</h2>
                    </div>
                    <div className="px-6 py-5 space-y-6">
                        {/* Export */}

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-medium">Export Notes</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Download a backup of all your notes
                                </p>
                            </div>
                            <button
                                onClick={handleExportNotes}
                                className="flex items-center justify-center px-4 py-2 bg-primary-600 hover:bg-primary-700  rounded-lg transition-colors sm:w-auto w-full"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Export Notes
                            </button>
                        </div>

                        {showExportSuccess && (
                            <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-3 rounded-md text-sm flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Notes successfully exported!
                            </div>
                        )}

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            {/* Import */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-medium">Import Notes</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Restore notes from a backup file
                                    </p>
                                </div>
                                <label className="flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors cursor-pointer sm:w-auto w-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Import Notes
                                    <input
                                        type="file"
                                        accept=".json"
                                        className="hidden"
                                        onChange={handleImportNotes}
                                    />
                                </label>
                            </div>

                            {showImportSuccess && (
                                <div className="mt-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-3 rounded-md text-sm flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Notes successfully imported!
                                </div>
                            )}

                            {importError && (
                                <div className="mt-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-3 rounded-md text-sm flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {importError}
                                </div>
                            )}
                        </div>
                    </div>
                </div>





                {/* App Information */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                    <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold">About</h2>
                    </div>
                    <div className="px-6 py-5">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium">Notes App</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Version 1.0.0
                                </p>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                A local-first note-taking application built with React, Next.js, and TipTap.
                                All your notes are stored locally in your browser for privacy and offline access.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2 text-sm pt-2">
                                <span className="text-gray-500 dark:text-gray-400">
                                    {notes.length} notes stored
                                </span>
                                <span className="hidden sm:block text-gray-300 dark:text-gray-700">•</span>
                                <span className="text-gray-500 dark:text-gray-400">
                                    {/* favorite notes lenght */}
                                    {notes.filter(note => note.isFavorite).length} favorites
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
} 