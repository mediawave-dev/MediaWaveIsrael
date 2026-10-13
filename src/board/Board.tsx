// /board: the dev-only style board for the October 2026 redesign (Gate 1).
// App.tsx mounts this only when import.meta.env.DEV, so it never reaches a build.

import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import BoardIndex from './BoardIndex'

const BoardA = lazy(() => import('./BoardA'))
const BoardB = lazy(() => import('./BoardB'))
const BoardC = lazy(() => import('./BoardC'))
const BoardD = lazy(() => import('./BoardD'))
const BoardE = lazy(() => import('./BoardE'))
const BoardF = lazy(() => import('./BoardF'))
const BoardG = lazy(() => import('./BoardG'))
const BoardH = lazy(() => import('./BoardH'))
const BoardI = lazy(() => import('./BoardI'))
const BoardJ = lazy(() => import('./BoardJ'))
const BoardK = lazy(() => import('./BoardK'))
const BoardL = lazy(() => import('./BoardL'))
const BoardM = lazy(() => import('./BoardM'))
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
        <Route path="d" element={<BoardD />} />
        <Route path="e" element={<BoardE />} />
        <Route path="f" element={<BoardF />} />
        <Route path="g" element={<BoardG />} />
        <Route path="h" element={<BoardH />} />
        <Route path="i" element={<BoardI />} />
        <Route path="j" element={<BoardJ />} />
        <Route path="k" element={<BoardK />} />
        <Route path="l" element={<BoardL />} />
        <Route path="m" element={<BoardM />} />
        <Route path="i1" element={<IdeaBuild />} />
        <Route path="i2" element={<IdeaName />} />
        <Route path="i3" element={<IdeaLetter />} />
        <Route path="*" element={<BoardIndex />} />
      </Routes>
    </Suspense>
  )
}
