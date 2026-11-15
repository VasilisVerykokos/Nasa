// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Should-have 4: the series behind the seasonal chart (SeasonChart.tsx).
import { MONTH_NAMES } from '../heatmap'
import { type CalendarRow, normalFor, topYears } from '../stats'

/** Default year: the highest total among complete years. */
export const defaultYear = (rows: CalendarRow[]) => topYears(rows, 1)[0]?.year

/** Twelve monthly values: the normal (median, normalFor) and the chosen year. */
export function seasonSeries(rows: CalendarRow[], year: number) {
  const at = new Map(rows.filter(r => r.year === year).map(r => [r.month, r.value]))
  return MONTH_NAMES.map((name, i) => ({ name, normal: normalFor(rows, i + 1).median, value: at.get(i + 1) ?? 0 }))
}
