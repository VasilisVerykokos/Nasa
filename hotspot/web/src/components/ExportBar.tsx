// AI note: written with Claude Code (Claude Opus 5.5) for Person B, reviewed by the team. Downloads (must-have 6): calendar CSV, calendar image and hotspots CSV. Words: web/content/ui-text.md, "Downloads".
// "Copy link" (should-have 5) copies the page address, which App keeps up to date with the area and the dates.
import { useState } from 'react'
import { fetchHotspots, TooManyHotspots } from '../api/hotspots'
import { calendarCsv, fileName, firstDay, lastDay, span, toCsv } from '../lib/csv'
import type { Range } from '../lib/dates'
import type { Polygon } from '../lib/geo'
import type { CalendarRow } from '../lib/stats'

const TOO_MANY = 'This selection has more than 200,000 hotspots. Make the area smaller or the dates shorter, then try again.'
const NONE = 'No hotspots to download for this area and these dates.'
const UNREACHABLE = 'We could not reach the database. Try again in a minute.'

function save(name: string, data: BlobPart, type = 'text/csv;charset=utf-8') {
  const href = URL.createObjectURL(new Blob([data], { type }))
  Object.assign(document.createElement('a'), { href, download: name }).click()
  setTimeout(() => URL.revokeObjectURL(href), 1000) // some browsers start the download after click() returns
}

/** The heatmap's SVG (CalendarHeatmap, id "calendar-image") drawn to PNG at 2× size; SVG if the browser cannot make the PNG. */
async function saveImage(svg: SVGSVGElement, name: string) {
  const text = new XMLSerializer().serializeToString(svg)
  try {
    const img = new Image()
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(text)
    await img.decode()
    const canvas = Object.assign(document.createElement('canvas'), { width: svg.width.baseVal.value * 2, height: svg.height.baseVal.value * 2 })
    canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
    const png = await new Promise<Blob | null>(done => canvas.toBlob(done, 'image/png'))
    if (!png) throw new Error('no PNG')
    save(name, png, 'image/png')
  } catch {
    save(name.replace(/png$/, 'svg'), text, 'image/svg+xml')
  }
}

type Props = { rows: CalendarRow[]; label: string; area: Polygon; range?: Range | null }

export default function ExportBar({ rows, label, area, range }: Props) {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [copied, setCopied] = useState('') // announced to screen readers
  const [manual, setManual] = useState('') // the link in a text box, when the clipboard is not available
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

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(location.href)
      setManual(''); setCopied('Link copied')
    } catch {
      setCopied(''); setManual(location.href) // no clipboard, or permission refused
    }
  }

  return (
    <section className="downloads" aria-labelledby="downloads-heading">
      <h3 id="downloads-heading">Download</h3>
      <div className="actions">
      <button type="button" className="primary" onClick={() => save(fileName('calendar', label, from, to), calendarCsv(rows))}>Download calendar (CSV)</button>
      <button type="button" className="secondary" onClick={() => {
        const svg = document.getElementById('calendar-image')
        if (svg instanceof SVGSVGElement) saveImage(svg, fileName('calendar', label, from, to, 'png'))
      }}>Download calendar (image)</button>
      <button type="button" className="secondary" onClick={downloadHotspots} disabled={busy}>{busy ? 'Preparing…' : 'Download hotspots (CSV)'}</button>
      <button type="button" className="secondary" onClick={copyLink}>Copy link</button>
      </div>
      <p role="status" className="hint">{copied}</p>
      {manual && <label>Copy this link: <input readOnly value={manual} onFocus={e => e.target.select()} autoFocus /></label>}
      {message && <p role="alert">{message}</p>}
      <p className="hint">{`Files are named with the area and the dates, for example ${fileName('calendar', label, from, to)}`}</p>
    </section>
  )
}
