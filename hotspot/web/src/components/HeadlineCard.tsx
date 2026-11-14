// AI note: written with Claude Code (Claude Opus 5.5) for Person B, reviewed by the team. Headline card (must-have 4): one plain sentence comparing a month with its normal. Words: web/content/ui-text.md.
import { type CalendarRow, compare, completeYears, currentMonth, headline, topMonths } from '../lib/stats'

const fmt = (v: number) => Math.round(v).toLocaleString('en-US')

type Props = { rows: CalendarRow[]; label: string; year?: number; month?: number }

export default function HeadlineCard({ rows, label, ...picked }: Props) {
  // Until a month can be clicked on the calendar (should-have 3), the card shows the area's highest month.
  const top = topMonths(rows, 1)[0] ?? currentMonth(rows)
  const year = picked.year ?? top.year
  const month = picked.month ?? top.month
  const c = compare(rows, year, month)
  const years = completeYears(rows)
  return (
    <section className="headline" aria-label="Selected month">
      <p className="label">{`${label}: selected month`}</p>
      <p className="sentence">{headline(rows, year, month)}</p>
      {/* The two short forms of the sentence already give both numbers, so this line only follows the "N times" form. */}
      {c.ratio !== null && (
        <p>{`${fmt(c.value)} hotspot${fmt(c.value) === '1' ? '' : 's'} against a normal of ${fmt(c.normal)}.`}</p>
      )}
      <p className="help">
        {`A hotspot is a spot a satellite saw as hot, usually a fire. Normal is the middle value (median) for that calendar month, ${years[0]} to ${years[years.length - 1]}.`}
      </p>
    </section>
  )
}
