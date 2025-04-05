// src/app/page.tsx → /notes (Dashboard)
"use client";
import Link from "next/link";

import { redirect } from 'next/navigation'

export default function HomePage() {
  redirect('/notes')
}