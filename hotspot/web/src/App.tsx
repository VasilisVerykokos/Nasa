// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Page skeleton: map column on the left, results on the right (WIREFRAME.md).
import { useState } from 'react'
import AreaPicker, { type Selection } from './components/AreaPicker'
import { outsideGreece } from './lib/geo'

export default function App() {
  const [selection, setSelection] = useState<Selection | null>(null)
  return (
    <>
      <header><h1>HOTSPOT</h1></header>
      <div className="layout">
        <aside aria-label="Area and dates"><AreaPicker onChange={setSelection} /></aside>
        <main aria-live="polite">
          {selection && (outsideGreece(selection.area)
            ? <p role="alert">This area is outside the covered region (Greece).</p>
            : <p>Selected: {selection.label}. The calendar comes next.</p>)}
        </main>
      </div>
    </>
  )
}
