// app/notes/[id]/page.tsx
import { use } from 'react'; // Required for unwrapping params
import NoteEditor from '@/components/templates/NoteEditor';
import Layout from '@/components/templates/Layout';

// Next.js 15.2 expects params to be a Promise
interface PageProps {
  params: Promise<{ id: string }>;
}

export default function NotePage({ params }: PageProps) {
  // Unwrap the Promise with React's `use()`
  const { id } = use(params);

  return (
    <Layout>
      <NoteEditor noteId={id} />
    </Layout>
  );
}