// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Must-have 12: this month so far against the normal for the same days. Words: web/content/ui-text.md, "This month so far".
import { MONTH_NAMES } from '../lib/heatmap'
import { type CalendarRow, completeYears, currentMonth, thisMonthSoFar } from '../lib/stats'

type Props = { rows: CalendarRow[]; meta: Record<string, unknown>; today?: Date }

export default function ThisMonthCard({ rows, meta, today = new Date() }: Props) {
  const last = currentMonth(rows)
  // The calendar ends at the newest hotspot; if that is not this month, the daily update failed or has not run.
  const stale = last.year !== today.getUTCFullYear() || last.month !== today.getUTCMonth() + 1
  const t = thisMonthSoFar(rows, stale)
  const years = completeYears(rows)
  const day = typeof meta.data_through === 'string' ? Number(meta.data_through.slice(8, 10)) : NaN
  const span = `${years[0]} to ${years.at(-1)}`
  const name = `${MONTH_NAMES[last.month - 1]} ${last.year}`
  return (
    <section className="so-far" aria-labelledby="so-far-heading">
      <h3 id="so-far-heading" className="badge">This month so far</h3>
      {stale && <p>{`The newest days could not be loaded. Showing ${name}, the latest complete month.`}</p>}
      <p className="sentence">{t.sentence}</p>
      <p className="help">
        {`Normal here is the median of the same ${day > 0 ? `first ${day} days` : 'first days'} of the month, ${span}.`}
        {stale ? '' : ' The month is not finished, so its count can still rise, and it is not ranked.'}
      </p>
    </section>
  )
}
