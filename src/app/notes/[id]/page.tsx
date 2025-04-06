
import NoteEditor from '@/components/templates/NoteEditor'
import Layout from '@/components/templates/Layout'

interface PageProps {
  params: {
    id: string  
  }
}

export default function NotePage({ params }: PageProps) {
  return (
    <Layout>
      <NoteEditor noteId={params.id} />
    </Layout>
  )
}