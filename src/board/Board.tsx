// /board: the dev-only style board for the October 2026 redesign (Gate 1).
// App.tsx mounts this only when import.meta.env.DEV, so it never reaches a build.

import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import BoardIndex from './BoardIndex'

const BoardA = lazy(() => import('./BoardA'))
const BoardB = lazy(() => import('./BoardB'))
const BoardC = lazy(() => import('./BoardC'))
const IdeaBuild = lazy(() => import('./BoardIdeas').then((m) => ({ default: m.IdeaBuild })))
const IdeaName = lazy(() => import('./BoardIdeas').then((m) => ({ default: m.IdeaName })))
const IdeaLetter = lazy(() => import('./BoardIdeas').then((m) => ({ default: m.IdeaLetter })))

export default function Board() {
  return (
    <Suspense fallback={<div style={{ minHeight: '120vh' }} />}>
      <Routes>
        <Route path="a" element={<BoardA />} />
        <Route path="b" element={<BoardB />} />
        <Route path="c" element={<BoardC />} />
        <Route path="i1" element={<IdeaBuild />} />
        <Route path="i2" element={<IdeaName />} />
        <Route path="i3" element={<IdeaLetter />} />
        <Route path="*" element={<BoardIndex />} />
      </Routes>
    </Suspense>
  )
}
