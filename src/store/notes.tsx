import NotesDashboard from '@/components/NotesDashboard'
import Layout from '@/components/Layout'
import { useThemeStore } from './themeStore'

export default function NotesPage() {
  return (
     <Layout >
      <NotesDashboard />
    </Layout>
  )
} 