// app/notes/[id]/page.tsx
import { use } from 'react'; // Required for unwrapping params
import NoteEditor from '@/components/templates/NoteEditor';
import Layout from '@/components/templates/Layout';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function NotePage({ params }: PageProps) {

  const { id } = use(params);

  return (
    <Layout>
      <NoteEditor noteId={id} />
    </Layout>
  );
}