// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Should-have 4: the normal year against one chosen year, a plain React SVG line chart with "Show as table". Words: web/content/ui-text.md.
import { useId, useState } from 'react'
import { fmtCount } from '../lib/heatmap'
import { defaultYear, seasonSeries } from '../lib/season'
import { type CalendarRow, completeYears } from '../lib/stats'

// SVG units; the SVG scales to its box, so it fits 390 px without sideways scrolling.
const W = 360, H = 220, L = 44, R = 8, TOP = 30, B = 22
// Blue and orange: the heatmap's diverging end colours, colour-blind safe. Line style tells them apart too.
const NORMAL = { color: 'rgb(33, 102, 172)', dash: '5 3' }
const YEAR = { color: 'rgb(179, 88, 6)', dash: undefined }

export default function SeasonChart({ rows }: { rows: CalendarRow[] }) {
  const years = completeYears(rows)
  const [year, setYear] = useState(() => defaultYear(rows))
  const [active, setActive] = useState<number | null>(null)
  const [table, setTable] = useState(false)
  const id = useId()
  if (year === undefined) return null
  const series = seasonSeries(rows, year)
  const max = Math.max(1, ...series.flatMap(s => [s.normal, s.value]))
  const step = (W - L - R) / 12
  const x = (i: number) => L + step * (i + 0.5)
  const y = (v: number) => TOP + (H - TOP - B) * (1 - v / max)
  const path = (k: 'normal' | 'value') => series.map((s, i) => `${i ? 'L' : 'M'}${x(i)},${y(s[k])}`).join(' ')
  const say = (i: number) => `${series[i].name}: ${year} ${fmtCount(series[i].value)} hotspots, normal ${fmtCount(series[i].normal)}`
  const span = `${years[0]} to ${years.at(-1)}`

  return (
    <section className="season" aria-labelledby={`${id}-h`}>
      <h3 id={`${id}-h`}>Normal year against {year}</h3>
      <label>Year <select value={year} onChange={e => setYear(Number(e.target.value))}>
        {years.map(y => <option key={y} value={y}>{y}</option>)}
      </select></label>{' '}
      <button type="button" onClick={() => setTable(v => !v)}>{table ? 'Show as chart' : 'Show as table'}</button>
      {table ? (
        <div className="calendar">
          <table>
            <caption>Hotspots per month in {year} and in a normal year (median of {span}).</caption>
            <thead><tr><th scope="col">Month</th><th scope="col">{year}</th><th scope="col">Normal</th></tr></thead>
            <tbody>{series.map(s => <tr key={s.name}><th scope="row">{s.name}</th><td>{fmtCount(s.value)}</td><td>{fmtCount(s.normal)}</td></tr>)}</tbody>
          </table>
        </div>
      ) : (
        <>
          <svg viewBox={`0 0 ${W} ${H}`} fontFamily="system-ui, sans-serif" fontSize={10} style={{ display: 'block', width: '100%', maxWidth: 640, height: 'auto' }}
            onMouseLeave={() => setActive(null)} aria-label={`Hotspots per month, ${year} against the normal year`} role="group">
            <rect width={W} height={H} fill="#fff" />
            <g aria-hidden="true">
              {[{ ...YEAR, text: `${year}` }, { ...NORMAL, text: `Normal (median ${span})` }].map((s, k) => (
                <g key={k} transform={`translate(${L + k * 70} 10)`}>
                  <line x1={0} x2={22} y1={0} y2={0} stroke={s.color} strokeWidth={2} strokeDasharray={s.dash} />
                  <text x={26} y={3.5} fill="#333">{s.text}</text>
                </g>
              ))}
              <text x={L - 4} y={y(max) + 4} textAnchor="end" fill="#333">{fmtCount(max)}</text>
              <text x={L - 4} y={y(0)} textAnchor="end" fill="#333">0</text>
              <line x1={L} x2={W - R} y1={y(0)} y2={y(0)} stroke="#333" />
              {series.map((s, i) => <text key={s.name} x={x(i)} y={H - 8} textAnchor="middle" fill="#333">{s.name[0]}</text>)}
              <path d={path('normal')} fill="none" stroke={NORMAL.color} strokeWidth={2} strokeDasharray={NORMAL.dash} />
              <path d={path('value')} fill="none" stroke={YEAR.color} strokeWidth={2} />
              {series.map((s, i) => <circle key={s.name} cx={x(i)} cy={y(s.value)} r={2.5} fill={YEAR.color} />)}
              {active !== null && <line x1={x(active)} x2={x(active)} y1={TOP} y2={y(0)} stroke="#000" />}
            </g>
            {/* One column per month, reachable by Tab; focus or hover shows its two numbers. */}
            {series.map((s, i) => (
              <rect key={s.name} x={x(i) - step / 2} y={TOP} width={step} height={y(0) - TOP} fill="transparent" tabIndex={0} aria-label={say(i)}
                onFocus={() => setActive(i)} onBlur={() => setActive(null)} onMouseEnter={() => setActive(i)} onClick={() => setActive(i)} />
            ))}
          </svg>
          <p className="hint" aria-live="polite">{active === null ? 'Point at a month, tap it, or press Tab, to see its numbers.' : `${say(active)}.`}</p>
        </>
      )}
    </section>
  )
}
