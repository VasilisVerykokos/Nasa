// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Must-have 3: calendar heatmap (years × months) as a plain React SVG, so ExportBar can save it as an image. Words: web/content/ui-text.md.
import { type KeyboardEvent, useRef, useState } from 'react'
import { MONTH_NAMES, type Range, type View, cellColor, countColor, describeMonth, describeRaw, diffColor, fmtCount, rawOf, sensorOf } from '../lib/heatmap'
import { type CalendarRow, completeYears, currentMonth, differenceFromNormal, normalFor, yearTotals } from '../lib/stats'
import CalendarTable from './CalendarTable'

type Cell = { name: string; text: string; fill?: string; label?: string; est?: boolean; prov?: boolean; soFar?: boolean; none?: boolean }
type Props = { rows: CalendarRow[]; label: string; meta: Record<string, unknown>; fromYear?: number; toYear?: number }

// Layout in SVG units; the SVG scales to its box, so it fits a phone without sideways scrolling.
const L = 52, CW = 26, CH = 16, G = 2, TW = 64, TOP = 58, W = L + 12 * CW + TW
const KEYS: Record<string, [number, number]> = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }
const VIEWS: Record<View, string> = { count: 'Hotspots', diff: 'Difference from normal', raw: 'Raw (sensors simply added)' }
const TIP_W = 240 // tooltip width in pixels
const clamp = (v: number, hi: number) => Math.max(0, Math.min(v, hi))
const date = (v: unknown) => {
  const d = typeof v === 'string' ? new Date(v) : null
  return d && !Number.isNaN(d.getTime()) ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) : null
}

/** fromYear/toYear only choose the years shown; colours and normals always use the whole record. */
export default function CalendarHeatmap({ rows, label, meta, fromYear = -Infinity, toYear = Infinity }: Props) {
  const [view, setView] = useState<View>('count')
  const raw = view === 'raw'
  const [table, setTable] = useState(false)
  const [pos, setPos] = useState<[number, number]>([0, 0]) // the grid's single tab stop
  const [shown, setShown] = useState(false)
  const [tip, setTip] = useState({ left: 0, top: 0, below: false }) // tooltip place, in pixels inside .hm-inner
  const inner = useRef<HTMLDivElement>(null)

  const at = new Map(rows.map(r => [r.year * 12 + r.month, r]))
  const diff = new Map(differenceFromNormal(rows).map(d => [d.year * 12 + d.month, d.difference]))
  const normals = MONTH_NAMES.map((_, i) => normalFor(rows, i + 1).median)
  const max = Math.max(...rows.map(r => r.value))
  const maxAbs = Math.max(...[...diff.values()].map(Math.abs))
  const now = currentMonth(rows)
  const complete = completeYears(rows)
  const totals = yearTotals(raw ? rows.map(r => ({ ...r, value: rawOf(r) })) : rows)
  const rawMax = Math.max(...rows.map(rawOf))
  const range = Array.isArray(meta.uncertainty) ? (meta.uncertainty as Range) : null // shortcut: get_meta has one range, used for every area; a wider drawn-area range would need a second meta key
  const years = [...totals.keys()].sort((a, b) => a - b).filter(y => y >= fromYear && y <= toYear)
  const partial = years.filter(y => !complete.includes(y))
  const unit = raw ? 'detections, sensors simply added' : 'hotspots'

  const monthCell = (y: number, m: number): Cell => {
    const r = at.get(y * 12 + m)
    const when = `${MONTH_NAMES[m - 1]} ${y}`
    if (!r) return { name: `${when}, no data`, text: `${when}: no data.`, none: true }
    const soFar = r === now
    return { ...(raw ? describeRaw(r, soFar) : describeMonth(r, normals[m - 1], range, soFar)), fill: cellColor(view, r, max, diff.get(y * 12 + m)!, maxAbs),
      est: !raw && sensorOf(y, m) === 'modis', prov: r.provisional > 0, soFar }
  }
  const normalSum = normals.reduce((a, b) => a + b, 0)
  const grid: { head: string; cells: Cell[] }[] = [
    ...years.map(y => {
      const t = fmtCount(totals.get(y)!), p = partial.includes(y)
      return { head: `${y}${p ? '*' : ''}`, cells: [...MONTH_NAMES.map((_, i) => monthCell(y, i + 1)),
        { label: t, name: `${y} total, ${t} ${unit}${p ? ', partial year' : ''}`, text: `${y} total: ${t} ${unit}.${p ? ' A partial year, left out of yearly rankings.' : ''}` }] }
    }),
    // The normal row stays harmonized in the raw view: a median across the sensor change would mean nothing.
    { head: 'Normal', cells: [...normals.map((v, i) => ({ fill: view === 'diff' ? diffColor(0, maxAbs) : countColor(v, max), name: `Normal ${MONTH_NAMES[i]}, ${fmtCount(v)} hotspots`,
        text: `Normal ${MONTH_NAMES[i]}: ${fmtCount(v)} hotspots, the median of ${complete[0]} to ${complete.at(-1)}.${raw ? ' Harmonized: raw counts have no fair normal.' : ''}` })),
      { label: fmtCount(normalSum), name: `Normal year, ${fmtCount(normalSum)} hotspots`, text: `Normal year: ${fmtCount(normalSum)} hotspots, the sum of the monthly normals.` }] },
  ]
  const [pr, pc] = [clamp(pos[0], grid.length - 1), pos[1]]
  const x = (c: number) => L + c * CW
  const y = (r: number) => TOP + r * CH + (r === years.length ? 6 : 0) // a small gap before the normal row
  const bottom = y(grid.length)
  const H = bottom + 96
  const through = date(meta.data_through)

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') return setShown(false)
    const step = KEYS[e.key] ?? (e.key === 'Home' ? [0, -12] : e.key === 'End' ? [0, 12] : null)
    if (!step) return
    e.preventDefault()
    document.getElementById(`hm-${clamp(pr + step[0], grid.length - 1)}-${clamp(pc + step[1], 12)}`)?.focus()
  }
  // Puts the tooltip at the cell, kept inside the visible part of the scroll box (and so inside the viewport) sideways, and below the cell when there is no room above it.
  const show = (r: number, c: number, cell: Element) => {
    setPos([r, c]); setShown(true)
    const box = inner.current?.parentElement, base = inner.current?.getBoundingClientRect()
    if (!box || !base) return
    const b = cell.getBoundingClientRect(), w = Math.min(TIP_W, box.clientWidth - 8)
    const below = b.top - base.top < 120 || b.top < 120 // no room above the cell, in the box or on screen
    setTip({ left: Math.max(box.scrollLeft + 4, Math.min(b.left - base.left + b.width / 2 - w / 2, box.scrollLeft + box.clientWidth - w - 4)),
      top: below ? b.bottom - base.top + 6 : b.top - base.top - 6, below })
  }

  return (
    <section className="heatmap" aria-labelledby="heatmap-heading">
      <h3 id="heatmap-heading">{`Calendar, ${years[0]} to ${years.at(-1)}`}</h3>
      <fieldset className="switch">
        <legend>Show</legend>
        {(Object.keys(VIEWS) as View[]).map(v => (
          <label key={v}><input type="radio" name="hm-view" checked={view === v} onChange={() => setView(v)}
            aria-describedby={v === 'raw' && raw ? 'hm-raw-hint' : undefined} /> {VIEWS[v]}</label>
        ))}
      </fieldset>
      {raw && <p className="hint" id="hm-raw-hint">Raw: the three satellites' detections simply added. VIIRS sees smaller fires, so the count jumps in 2012. The fires did not change, the instruments did. This is what HOTSPOT corrects.</p>}
      <button type="button" onClick={() => setTable(t => !t)}>{table ? 'Show as calendar' : 'Show as table'}</button>
      {table && <CalendarTable rows={rows} />}
      {/* Hidden, not removed, in table view: the image download reads this SVG. */}
      <div hidden={table}>
        <p className="hint hm-phone">Slide the box sideways for all months.</p>
        <div className="hm-scroll">
        <div className="hm-inner" ref={inner}>
        <svg id="calendar-image" xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${W} ${H}`} width={W} height={H}
          fontFamily="system-ui, sans-serif" fontSize={11} onMouseLeave={() => setShown(false)}>
          <defs>
            <pattern id="hm-est" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="4" stroke="#fff" strokeOpacity="0.5" />
            </pattern>
            <pattern id="hm-none" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
              <rect width="4" height="4" fill="#e6e6e6" /><line x1="0" y1="0" x2="0" y2="4" stroke="#aaa" />
            </pattern>
            <linearGradient id="hm-ramp">
              {[...Array(11).keys()].map(i => {
                const s = view !== 'diff' ? i / 10 : i / 5 - 1
                return <stop key={i} offset={i / 10} stopColor={view !== 'diff' ? countColor(s * s, 1) : diffColor(Math.sign(s) * s * s, 1)} />
              })}
            </linearGradient>
          </defs>
          <rect width={W} height={H} fill="#fff" />
          <text x={0} y={16} fontSize={15} fontWeight="bold">{`${label} · ${VIEWS[view]}`}</text>
          <text x={0} y={33} fill="#555">{`${{ count: 'Hotspots per month, NOAA-20 equivalent', diff: 'Difference from normal', raw: 'Detections per month, sensors simply added' }[view]}${through ? `. Data through ${through}.` : '.'}`}</text>
          <g aria-hidden="true" fill="#333">
            {MONTH_NAMES.map((m, i) => <text key={m} x={x(i) + (CW - G) / 2} y={TOP - 5} textAnchor="middle">{m.slice(0, 3)}</text>)}
            <text x={W - 2} y={TOP - 5} textAnchor="end">Year total</text>
            {grid.map((row, r) => <text key={row.head} x={L - 6} y={y(r) + CH - 5} textAnchor="end">{row.head}</text>)}
          </g>
          <g role="grid" aria-label={`Calendar of ${raw ? 'raw detections, sensors simply added,' : 'hotspots'} per month. Use the arrow keys to move between months.`} onKeyDown={onKey}
            onBlur={e => e.currentTarget.contains(e.relatedTarget as Node) || setShown(false)}>
            {grid.map((row, r) => (
              <g role="row" key={row.head}>
                {row.cells.map((c, col) => (
                  <rect key={col} id={`hm-${r}-${col}`} role="gridcell" aria-label={c.name} tabIndex={r === pr && col === pc ? 0 : -1}
                    x={x(col)} y={y(r)} width={col === 12 ? TW - G : CW - G} height={CH - G}
                    fill={c.none ? 'url(#hm-none)' : c.fill ?? '#fff'} onFocus={e => show(r, col, e.currentTarget)} onMouseEnter={e => show(r, col, e.currentTarget)} onClick={e => show(r, col, e.currentTarget)} />
                ))}
              </g>
            ))}
          </g>
          <g aria-hidden="true" pointerEvents="none">
            {grid.flatMap((row, r) => row.cells.map((c, col) => (
              <g key={`${r}-${col}`}>
                {c.est && <rect x={x(col)} y={y(r)} width={CW - G} height={CH - G} fill="url(#hm-est)" />}
                {c.prov && <circle cx={x(col) + CW - G - 4} cy={y(r) + 4} r={2.5} fill="#fff" stroke="#000" />}
                {c.soFar && <rect x={x(col) + 1} y={y(r) + 1} width={CW - G - 2} height={CH - G - 2} fill="none" stroke="#000" strokeDasharray="2 2" />}
                {c.label && <text x={x(col) + TW - G - 4} y={y(r) + CH - 5} textAnchor="end" fill="#1a1a1a">{c.label}</text>}
              </g>
            )))}
            {shown && <rect x={x(pc) - 1} y={y(pr) - 1} width={(pc === 12 ? TW : CW) - G + 2} height={CH - G + 2} fill="none" stroke="#000" strokeWidth={2} />}
          </g>
          <g aria-hidden="true" transform={`translate(0 ${bottom + 14})`} fill="#333">
            <text y={10}>{{ count: 'Hotspots per month (square-root scale)', diff: 'Below normal · Normal · Above normal', raw: 'Same colours and maximum as Hotspots' }[view]}</text>
            <rect x={230} y={0} width={190} height={10} fill="url(#hm-ramp)" />
            {(view !== 'diff' ? ['0', fmtCount(max / 4), `${fmtCount(max)}${raw && rawMax > max ? ' or more' : ''}`] : [`-${fmtCount(maxAbs)}`, 'Normal', `+${fmtCount(maxAbs)}`]).map((t, i) => (
              <text key={i} x={230 + i * 95} y={22} fontSize={10} textAnchor={(['start', 'middle', 'end'] as const)[i]}>{t}</text>
            ))}
            {['Estimated before 2012', 'No data', 'Provisional', 'This month so far'].map((t, i) => {
              const lx = (i % 2) * 210, ly = 32 + Math.floor(i / 2) * 16
              return (
                <g key={t} transform={`translate(${lx} ${ly})`}>
                  <rect width={CW - G} height={CH - G} fill={i === 1 ? 'url(#hm-none)' : countColor(1, 4)} />
                  {i === 0 && <rect width={CW - G} height={CH - G} fill="url(#hm-est)" />}
                  {i === 2 && <circle cx={CW - G - 4} cy={4} r={2.5} fill="#fff" stroke="#000" />}
                  {i === 3 && <rect x={1} y={1} width={CW - G - 2} height={CH - G - 2} fill="none" stroke="#000" strokeDasharray="2 2" />}
                  <text x={CW + 4} y={CH - 5}>{t}</text>
                </g>
              )
            })}
            {partial.length > 0 && <text y={78}>{`* ${partial.join(' and ')} ${partial.length > 1 ? 'are partial years' : 'is a partial year'}, left out of yearly rankings.`}</text>}
            <text y={92}>{`Normal = the median of each calendar month, ${complete[0]} to ${complete.at(-1)}.`}</text>
          </g>
        </svg>
        {shown && <div className="hm-tip" aria-hidden="true" style={{ left: tip.left, top: tip.top, width: Math.min(TIP_W, (inner.current?.parentElement?.clientWidth ?? TIP_W) - 8), transform: tip.below ? undefined : 'translateY(-100%)' }}>{grid[pr].cells[pc].text}</div>}
        </div>
        </div>
        <p className="hint hm-info">Point at a month, tap it, or press Tab and use the arrow keys, to see how its number was made.</p>
        {/* The tooltip is hidden from screen readers; this line says the same text instead. */}
        <p className="sr-only" aria-live="polite">{shown ? `${grid[pr].cells[pc].text} Press another cell to compare.` : ''}</p>
      </div>
    </section>
  )
}
