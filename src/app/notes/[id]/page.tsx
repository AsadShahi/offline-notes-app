/* Offline Notes App - Full Implementation with Next.js + TypeScript + Tailwind + Zustand using Tiptap */

// src/components/editor.tsx
"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import NoteEditor from '@/components/NoteEditor'
import Layout from '@/components/Layout'

export default function NotePage({ params }: { params: { id: string } }) {
  return (
    <Layout>
      <NoteEditor noteId={params.id} />
    </Layout>
  )
}




