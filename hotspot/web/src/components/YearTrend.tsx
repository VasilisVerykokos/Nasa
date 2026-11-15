// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Should-have 2: yearly totals as a plain React SVG bar chart, the trend sentence and "Show as table". Words: web/content/ui-text.md.
import { useState } from 'react'
import { countColor, fmtCount, type Range } from '../lib/heatmap'
import type { CalendarRow } from '../lib/stats'
import { ESTIMATE_BEFORE, trend } from '../lib/trend'

type Props = { rows: CalendarRow[]; meta: Record<string, unknown> }

// SVG units; the SVG scales to its box, so it fits 390 px without sideways scrolling.
const W = 360, H = 220, L = 44, R = 6, TOP = 12, B = 22
const BAR = countColor(1, 4) // the heatmap legend's sample colour

export default function YearTrend({ rows, meta }: Props) {
  const [table, setTable] = useState(false)
  const t = trend(rows)
  // shortcut: get_meta's single range is per month; applying it to a year total is conservative (monthly errors partly cancel). Upgrade if the blind test reports a yearly range.
  const range = Array.isArray(meta.uncertainty) ? (meta.uncertainty as Range) : null
  const est = (y: number) => y < ESTIMATE_BEFORE
  const span = (v: number) => (range ? [v * (1 + range[0]), v * (1 + range[1])] : null)
  const max = Math.max(1, ...t.years.map(y => span(y.total)?.[1] ?? y.total))
  const step = (W - L - R) / Math.max(t.years.length, 1)
  const x = (i: number) => L + i * step
  const y = (v: number) => TOP + (H - TOP - B) * (1 - v / max)
  const pct = range ? `${Math.round(range[0] * 100)}% to +${Math.round(range[1] * 100)}%` : null
  const note = `Hatched bars (before ${ESTIMATE_BEFORE}) are estimates converted from MODIS${pct ? `; the line on each shows the range from the blind test (${pct})` : ', with a range from the blind test'}.`
  const describe = (yr: number, v: number) => {
    const s = est(yr) ? span(v) : null
    return `${yr}: ${est(yr) ? 'about ' : ''}${fmtCount(v)} hotspots${est(yr) ? `, an estimate${s ? ` (range ${fmtCount(s[0])} to ${fmtCount(s[1])})` : ''}` : ''}`
  }

  return (
    <section className="trend" aria-labelledby="trend-heading">
      <h3 id="trend-heading">Hotspots per year</h3>
      <p>{t.sentence}</p>
      <button type="button" onClick={() => setTable(v => !v)}>{table ? 'Show as chart' : 'Show as table'}</button>
      {table ? (
        <div className="calendar">
          <table>
            <caption>Hotspots per complete year (NOAA-20 equivalent). {note}</caption>
            <thead><tr><th scope="col">Year</th><th scope="col">Hotspots</th><th scope="col">Range</th></tr></thead>
            <tbody>
              {t.years.map(({ year, total }) => {
                const s = est(year) ? span(total) : null
                return <tr key={year}><th scope="row">{year}{est(year) ? ' (estimate)' : ''}</th><td>{fmtCount(total)}</td><td>{s ? `${fmtCount(s[0])} to ${fmtCount(s[1])}` : ''}</td></tr>
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Bar chart of hotspots per year, ${t.first} to ${t.last}. ${t.sentence} Use "Show as table" for the numbers.`}
            fontFamily="system-ui, sans-serif" fontSize={10} style={{ display: 'block', width: '100%', maxWidth: 640, height: 'auto' }}>
            <defs>
              <pattern id="yt-est" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="4" stroke="#fff" strokeOpacity="0.6" />
              </pattern>
            </defs>
            <rect width={W} height={H} fill="#fff" />
            <g fill="#333">
              <text x={L - 4} y={y(max) + 4} textAnchor="end">{fmtCount(max)}</text>
              <text x={L - 4} y={y(0)} textAnchor="end">0</text>
            </g>
            <line x1={L} x2={W - R} y1={y(0)} y2={y(0)} stroke="#333" />
            {t.years.map(({ year, total }, i) => {
              const s = est(year) ? span(total) : null, cx = x(i) + step / 2
              return (
                <g key={year}>
                  <title>{describe(year, total)}</title>
                  <rect x={x(i) + 1} y={y(total)} width={step - 2} height={y(0) - y(total)} fill={BAR} />
                  {est(year) && <rect x={x(i) + 1} y={y(total)} width={step - 2} height={y(0) - y(total)} fill="url(#yt-est)" stroke="#000" strokeWidth={0.5} />}
                  {s && <line x1={cx} x2={cx} y1={y(s[0])} y2={y(s[1])} stroke="#000" />}
                  {((i % 5 === 0 && i < t.years.length - 3) || i === t.years.length - 1) && <text x={cx} y={H - 8} textAnchor="middle" fill="#333">{year}</text>}
                </g>
              )
            })}
          </svg>
          <p className="hint">{note} Point at a bar to see its number.</p>
        </>
      )}
    </section>
  )
}
