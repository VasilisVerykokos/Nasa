// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Page skeleton: map column on the left, results on the right (WIREFRAME.md).
import { useEffect, useMemo, useRef, useState } from 'react'
import { fetchCalendar } from './api/calendar'
import { fetchMeta, type Outline } from './api/meta'
import { fetchMonthPoints, type MonthPoint, POINT_CAP } from './api/points'
import MapLegend from './components/MapLegend'
import AreaPicker, { type Selection } from './components/AreaPicker'
import CalendarHeatmap from './components/CalendarHeatmap'
import DataStamp from './components/DataStamp'
import DateRange from './components/DateRange'
import { recordEnd, type Range, yearsOf } from './lib/dates'
import { decodeShare, encodeShare, isMethodView } from './lib/share'
import ExportBar from './components/ExportBar'
import HeadlineCard from './components/HeadlineCard'
import MethodPage from './components/MethodPage'
import { DatabaseMessage, NoHotspots, OutsideGreece, Unreachable } from './components/Messages'
import Rankings from './components/Rankings'
import SeasonChart from './components/SeasonChart'
import YearTrend from './components/YearTrend'
import ThisMonthCard from './components/ThisMonthCard'
import { outsideGreece } from './lib/geo'
import type { CalendarRow } from './lib/stats'

type Result = { for: Selection } & ({ rows: CalendarRow[] } | { error: string; unreachable: boolean })
type Picked = { for: Selection; year: number; month: number } // a month clicked on the calendar, for one area
const NO_OUTLINES: Outline[] = []

export default function App() {
  const [selection, setSelection] = useState<Selection | null>(null)
  const [answer, setAnswer] = useState<Result | null>(null)
  const [attempt, setAttempt] = useState(0) // "Try again" raises it, which repeats the calendar call
  const [meta, setMeta] = useState<{ values: Record<string, unknown>; outlines: Outline[]; at: number } | null>(null)
  const [pick, setPick] = useState<Picked | null>(null)
  const [dots, setDots] = useState<{ for: Picked; points: MonthPoint[] | 'failed' } | null>(null)
  const month = pick?.for === selection ? pick : null // a new area clears the month
  const shown = month && dots?.for === month ? dots.points : null // null: still loading (an answer for an older month counts as loading)
  const counted = useMemo(() => (Array.isArray(shown) ? shown.filter(p => p.weight > 0) : null), [shown]) // weight 0: outside its sensor's period, not part of the month

  // The date range changes only what the screen shows, never the calendar call or the statistics (plan 9.4); it is not in any effect below.
  // The address can carry the area and the dates (share link). Read once; a bad address gives null and the default view.
  const [start] = useState(() => decodeShare(location.hash))
  const [range, setRange] = useState<Range | null>(start?.range ?? null)
  // Two views, chosen by the address: #method shows "Method and proof", anything else the calendar. No router needed.
  const [hash, setHash] = useState(location.hash)
  useEffect(() => {
    const onHash = () => { setHash(location.hash); window.scrollTo(0, 0) }
    addEventListener('hashchange', onHash)
    return () => removeEventListener('hashchange', onHash)
  }, [])
  const method = isMethodView(hash)
  // Once per visit: the data-through date for the stamp, and when it arrived. A failed call shows "Data date unavailable".
  useEffect(() => {
    fetchMeta().then(m => setMeta({ ...m, at: Date.now() })).catch(() => setMeta({ values: {}, outlines: [], at: Date.now() }))
  }, [])
  // Keep the address in step with the area and dates (replaceState, so Back is not flooded). Not on the method page, whose address must stay "#method".
  const through = meta ? recordEnd(meta.values) : null
  useEffect(() => {
    if (!selection || method) return
    const q = encodeShare(selection, range, through)
    history.replaceState(null, '', q ? `#${q}` : location.pathname + location.search)
  }, [selection, range, through, method])
  const heading = useRef<HTMLHeadingElement>(null)
  // After the point form is submitted, move to the result heading so the result (or the "outside" message) is seen.
  useEffect(() => { if (selection?.focus) heading.current?.focus() }, [selection])
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

  // One month_points load per clicked month; a newer month, Clear month or a new area cancels the older load.
  useEffect(() => {
    if (!month) return
    const ctrl = new AbortController()
    fetchMonthPoints(month.for.area, month.year, month.month, ctrl.signal)
      .then(points => setDots({ for: month, points }))
      .catch(() => ctrl.signal.aborted || setDots({ for: month, points: 'failed' })) // never a raw error: MapLegend says it plainly
    return () => ctrl.abort()
  }, [month])

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
        <aside aria-label="Area and dates">
          <AreaPicker onChange={setSelection} initial={selection ?? start?.place} points={counted} outlines={meta?.outlines ?? NO_OUTLINES}>
            <MapLegend month={month} outline={(meta?.outlines.length ?? 0) > 0} onClear={() => setPick(null)}
              dots={shown === 'failed' ? 'failed' : shown && counted ? { count: counted.length, capped: shown.length >= POINT_CAP } : null} />
          </AreaPicker>
          <DateRange through={through} onChange={setRange} initial={range} /></aside>
        <main aria-live="polite">
          {selection && <h2 ref={heading} tabIndex={-1}>{selection.label}</h2>}
          {outside ? <OutsideGreece />
            : result === 'loading' ? <p>Loading the calendar…</p>
            : 'error' in result ? (result.unreachable
                ? <Unreachable onRetry={() => { setAnswer(null); setAttempt(a => a + 1) }} />
                : <DatabaseMessage text={result.error} />)
            : result.rows.length === 0 ? <p>The database has no hotspots yet.</p>
            : result.rows.every(r => r.value === 0) ? <NoHotspots />
            : <>
                <HeadlineCard rows={result.rows} label={selection?.label ?? ''} {...(range ? yearsOf(range) : {})} year={month?.year} month={month?.month} />
                <ThisMonthCard rows={result.rows} meta={meta?.values ?? {}} />
                <CalendarHeatmap rows={result.rows} label={selection?.label ?? ''} meta={meta?.values ?? {}} {...(range ? yearsOf(range) : {})}
                  selected={month} onSelect={m => selection && setPick(p => (p?.for === selection && p.year === m.year && p.month === m.month ? p : { for: selection, ...m }))} />
                <Rankings rows={result.rows} />
                <YearTrend rows={result.rows} meta={meta?.values ?? {}} />
                <SeasonChart rows={result.rows} />
                {selection && <ExportBar rows={result.rows} label={selection.label} area={selection.area} range={range} />}
              </>}
        </main>
      </div>}
    </>
  )
}
