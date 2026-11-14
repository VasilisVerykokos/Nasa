// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Plain calendar (years × months, year totals, normal year); colours come in the heatmap step.
import { type CalendarRow, completeYears, normalFor, yearTotals } from '../lib/stats'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const fmt = (v: number) => Math.round(v).toLocaleString('en-US')

export default function CalendarTable({ rows }: { rows: CalendarRow[] }) {
  const value = new Map(rows.map(r => [r.year * 12 + r.month, r.value]))
  const years = [...new Set(rows.map(r => r.year))]
  const complete = new Set(completeYears(rows))
  const totals = yearTotals(rows)
  return (
    <div className="calendar">
      <table>
        <caption>Hotspots per month (NOAA-20 equivalent). Normal = median of 2001 to the last complete year.</caption>
        <thead>
          <tr><th scope="col">Year</th>{MONTHS.map(m => <th key={m} scope="col">{m}</th>)}<th scope="col">Total</th></tr>
        </thead>
        <tbody>
          {years.map(y => (
            <tr key={y}>
              <th scope="row">{y}{complete.has(y) ? '' : ' (partial)'}</th>
              {MONTHS.map((_, i) => {
                const v = value.get(y * 12 + i + 1)
                return <td key={i}>{v === undefined ? '' : fmt(v)}</td>
              })}
              <td>{fmt(totals.get(y)!)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr><th scope="row">Normal year</th>{MONTHS.map((_, i) => <td key={i}>{fmt(normalFor(rows, i + 1).median)}</td>)}<td></td></tr>
        </tfoot>
      </table>
    </div>
  )
}
