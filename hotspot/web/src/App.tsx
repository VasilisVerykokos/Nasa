// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Page skeleton: map column on the left, results on the right (WIREFRAME.md).
import { useEffect, useState } from 'react'
import { fetchCalendar } from './api/calendar'
import AreaPicker, { type Selection } from './components/AreaPicker'
import CalendarTable from './components/CalendarTable'
import { outsideGreece } from './lib/geo'
import type { CalendarRow } from './lib/stats'

type Result = { for: Selection } & ({ rows: CalendarRow[] } | { error: string })

export default function App() {
  const [selection, setSelection] = useState<Selection | null>(null)
  const [answer, setAnswer] = useState<Result | null>(null)
  const outside = selection !== null && outsideGreece(selection.area)
  const result = answer?.for === selection ? answer : 'loading' // an answer for an older area counts as still loading

  // One calendar call per area change; a newer area cancels the older call.
  useEffect(() => {
    if (!selection || outside) return
    const ctrl = new AbortController()
    fetchCalendar(selection.area, ctrl.signal)
      .then(rows => setAnswer({ for: selection, rows }))
      .catch(e => ctrl.signal.aborted || setAnswer({ for: selection, error: e.message }))
    return () => ctrl.abort()
  }, [selection, outside])

  return (
    <>
      <header><h1>HOTSPOT</h1></header>
      <div className="layout">
        <aside aria-label="Area and dates"><AreaPicker onChange={setSelection} /></aside>
        <main aria-live="polite">
          {selection && <h2>{selection.label}</h2>}
          {outside ? <p role="alert">This area is outside the covered region (Greece).</p>
            : result === 'loading' ? <p>Loading the calendar…</p>
            : 'error' in result ? <p role="alert">Could not load the calendar: {result.error}</p>
            : result.rows.length === 0 ? <p>The database has no hotspots yet.</p>
            : result.rows.every(r => r.value === 0) ? <p>No hotspots found in this area in 26 years.</p>
            : <CalendarTable rows={result.rows} />}
        </main>
      </div>
    </>
  )
}
