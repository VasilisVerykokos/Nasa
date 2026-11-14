// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Page skeleton: map column on the left, results on the right (WIREFRAME.md).
import { useEffect, useState } from 'react'
import { fetchCalendar } from './api/calendar'
import { fetchMeta } from './api/meta'
import AreaPicker, { type Selection } from './components/AreaPicker'
import CalendarHeatmap from './components/CalendarHeatmap'
import DataStamp from './components/DataStamp'
import DateRange from './components/DateRange'
import { recordEnd, type Range, yearsOf } from './lib/dates'
import ExportBar from './components/ExportBar'
import HeadlineCard from './components/HeadlineCard'
import MethodPage from './components/MethodPage'
import { DatabaseMessage, NoHotspots, OutsideGreece, Unreachable } from './components/Messages'
import Rankings from './components/Rankings'
import ThisMonthCard from './components/ThisMonthCard'
import { outsideGreece } from './lib/geo'
import type { CalendarRow } from './lib/stats'

type Result = { for: Selection } & ({ rows: CalendarRow[] } | { error: string; unreachable: boolean })

export default function App() {
  const [selection, setSelection] = useState<Selection | null>(null)
  const [answer, setAnswer] = useState<Result | null>(null)
  const [attempt, setAttempt] = useState(0) // "Try again" raises it, which repeats the calendar call
  const [meta, setMeta] = useState<{ values: Record<string, unknown>; at: number } | null>(null)

  // The date range changes only what the screen shows, never the calendar call or the statistics (plan 9.4); it is not in any effect below.
  const [range, setRange] = useState<Range | null>(null)
  // Two views, chosen by the address: #method shows "Method and proof", anything else the calendar. No router needed.
  const [hash, setHash] = useState(location.hash)
  useEffect(() => {
    const onHash = () => { setHash(location.hash); window.scrollTo(0, 0) }
    addEventListener('hashchange', onHash)
    return () => removeEventListener('hashchange', onHash)
  }, [])
  const method = hash === '#method'
  // Once per visit: the data-through date for the stamp, and when it arrived. A failed call shows "Data date unavailable".
  useEffect(() => {
    fetchMeta().then(values => setMeta({ values, at: Date.now() })).catch(() => setMeta({ values: {}, at: Date.now() }))
  }, [])
  const outside = selection !== null && outsideGreece(selection.area)
  const result = answer?.for === selection ? answer : 'loading' // an answer for an older area counts as still loading

  // One calendar call per area change; a newer area cancels the older call.
  useEffect(() => {
    if (!selection || outside) return
    const ctrl = new AbortController()
    fetchCalendar(selection.area, ctrl.signal)
      .then(rows => setAnswer({ for: selection, rows }))
      // fetch() throws a TypeError when it gets no answer at all (offline, database down); other errors carry the database's own message.
      .catch(e => ctrl.signal.aborted || setAnswer({ for: selection, error: e.message, unreachable: e instanceof TypeError }))
    return () => ctrl.abort()
  }, [selection, outside, attempt])

  return (
    <>
      <header>
        <h1>HOTSPOT</h1>
        <nav aria-label="Views">
          <a href="#" aria-current={method ? undefined : 'page'}>Calendar</a> · <a href="#method" aria-current={method ? 'page' : undefined}>Method and proof</a>
        </nav>
        <DataStamp meta={meta?.values ?? null} now={meta?.at ?? 0} />
      </header>
      {method ? <main className="page"><MethodPage /></main> :<div className="layout">
        <aside aria-label="Area and dates"><AreaPicker onChange={setSelection} /><DateRange through={meta ? recordEnd(meta.values) : null} onChange={setRange} /></aside>
        <main aria-live="polite">
          {selection && <h2>{selection.label}</h2>}
          {outside ? <OutsideGreece />
            : result === 'loading' ? <p>Loading the calendar…</p>
            : 'error' in result ? (result.unreachable
                ? <Unreachable onRetry={() => { setAnswer(null); setAttempt(a => a + 1) }} />
                : <DatabaseMessage text={result.error} />)
            : result.rows.length === 0 ? <p>The database has no hotspots yet.</p>
            : result.rows.every(r => r.value === 0) ? <NoHotspots />
            : <>
                <HeadlineCard rows={result.rows} label={selection?.label ?? ''} />
                <ThisMonthCard rows={result.rows} meta={meta?.values ?? {}} />
                <CalendarHeatmap rows={result.rows} label={selection?.label ?? ''} meta={meta?.values ?? {}} {...(range ? yearsOf(range) : {})} />
                <Rankings rows={result.rows} />
                {selection && <ExportBar rows={result.rows} label={selection.label} area={selection.area} range={range} />}
              </>}
        </main>
      </div>}
    </>
  )
}
