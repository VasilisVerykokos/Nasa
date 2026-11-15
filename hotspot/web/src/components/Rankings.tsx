// AI note: written with Claude Code (Claude Opus 5.5) for Person B, reviewed by the team. Rankings (must-have 5): top 5 months, top 5 years, peak season. Words: web/content/ui-text.md.
import { type CalendarRow, completeYears, peakSeason, topMonths, topYears } from '../lib/stats'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const fmt = (v: number) => Math.round(v).toLocaleString('en-US')
const joinAnd = (xs: (string | number)[]) => (xs.length < 2 ? `${xs[0]}` : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`)

export default function Rankings({ rows }: { rows: CalendarRow[] }) {
  const complete = new Set(completeYears(rows))
  const partial = [...new Set(rows.map(r => r.year))].filter(y => !complete.has(y)).sort((a, b) => a - b)
  const season = peakSeason(rows)
  return (
    <section className="rankings" aria-labelledby="rankings-heading">
      <h3 id="rankings-heading">Rankings</h3>
      <div>
        <h4>Top 5 months</h4>
        <ol>
          {topMonths(rows).map(r => (
            <li key={r.year * 12 + r.month}>{`${MONTHS[r.month - 1]} ${r.year} · ${fmt(r.value)}`}</li>
          ))}
        </ol>
      </div>
      <div>
        <h4>Top 5 years</h4>
        <ol>
          {topYears(rows).map(t => (
            <li key={t.year}>{`${t.year} · ${fmt(t.total)}`}</li>
          ))}
        </ol>
      </div>
      <div>
        <h4>Peak season in a normal year</h4>
        <p>{season ?? 'Not named: a normal year here has fewer than 5 hotspots, too few to show a season.'}</p>
      </div>
      {partial.length > 0 && (
        <p className="note">
          {`${joinAnd(partial)} ${partial.length === 1 ? 'is a partial year and is' : 'are partial years and are'} left out of the top years.`}
        </p>
      )}
    </section>
  )
}
