
import NoteEditor from '@/components/NoteEditor'
import Layout from '@/components/Layout'

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