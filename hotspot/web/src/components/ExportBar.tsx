// AI note: written with Claude Code (Claude Opus 5.5) for Person B, reviewed by the team. Downloads (must-have 6): calendar CSV and hotspots CSV. Words: web/content/ui-text.md, "Downloads".
// The calendar image waits for the heatmap, and "Copy link" for the share link (should-have 5); their buttons are added with them.
import { useState } from 'react'
import { fetchHotspots, TooManyHotspots } from '../api/hotspots'
import { calendarCsv, fileName, firstDay, lastDay, span, toCsv } from '../lib/csv'
import type { Range } from '../lib/dates'
import type { Polygon } from '../lib/geo'
import type { CalendarRow } from '../lib/stats'

const TOO_MANY = 'This selection has more than 200,000 hotspots. Make the area smaller or the dates shorter, then try again.'
const NONE = 'No hotspots to download for this area and these dates.'
const UNREACHABLE = 'We could not reach the database. Try again in a minute.'

function save(name: string, text: string) {
  const href = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }))
  Object.assign(document.createElement('a'), { href, download: name }).click()
  setTimeout(() => URL.revokeObjectURL(href), 1000) // some browsers start the download after click() returns
}

type Props = { rows: CalendarRow[]; label: string; area: Polygon; range?: Range | null }

export default function ExportBar({ rows, label, area, range }: Props) {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const { from, to } = span(rows) // the calendar CSV always holds the whole record
  const shown = range ?? { from: firstDay(from), to: lastDay(to) } // the hotspots CSV follows the date range

  async function downloadHotspots() {
    setBusy(true)
    setMessage(null)
    try {
      const list = await fetchHotspots(area, shown.from, shown.to)
      if (list.length === 0) setMessage(NONE)
      else save(fileName('hotspots', label, shown.from.slice(0, 7), shown.to.slice(0, 7)), toCsv(list))
    } catch (e) {
      setMessage(e instanceof TooManyHotspots ? TOO_MANY : e instanceof TypeError ? UNREACHABLE : (e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="downloads" aria-labelledby="downloads-heading">
      <h3 id="downloads-heading">Download</h3>
      <button type="button" onClick={() => save(fileName('calendar', label, from, to), calendarCsv(rows))}>Download calendar (CSV)</button>
      <button type="button" onClick={downloadHotspots} disabled={busy}>{busy ? 'Preparing…' : 'Download hotspots (CSV)'}</button>
      {message && <p role="alert">{message}</p>}
      <p className="hint">{`Files are named with the area and the dates, for example ${fileName('calendar', label, from, to)}`}</p>
    </section>
  )
}
