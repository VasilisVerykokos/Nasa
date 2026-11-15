// AI note: written with Claude Code (Claude Sonnet 5.5), reviewed by the team. Date-range rules (must-have 2): default, validation, years shown.
export type Range = { from: string; to: string } // both "YYYY-MM-DD"

export const RECORD_START = '2000-11-01'
export const REVERSED = 'The start date must be before the end date.'
export const outsideRecord = (through: string) => `Choose dates from 1 Nov 2000 to ${new Date(`${through}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}, the whole record.`

const isDay = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s))

/** The last day of the record: `data_through` from get_meta, or today when it is missing or unreadable. */
export function recordEnd(meta: Record<string, unknown>, today = new Date()): string {
  const v = typeof meta.data_through === 'string' ? meta.data_through.slice(0, 10) : ''
  return isDay(v) ? v : today.toISOString().slice(0, 10)
}

export const defaultRange = (through: string): Range => ({ from: RECORD_START, to: through })

/** A good range, or the plain message to show next to the fields. */
export function checkRange(from: string, to: string, through: string): { range: Range } | { message: string } {
  if (!isDay(from) || !isDay(to) || from < RECORD_START || to > through || from > through || to < RECORD_START) return { message: outsideRecord(through) }
  if (from >= to) return { message: REVERSED }
  return { range: { from, to } }
}

/** The calendar years the screen shows (the calendar itself always holds the whole record). */
export const yearsOf = (r: Range) => ({ fromYear: Number(r.from.slice(0, 4)), toYear: Number(r.to.slice(0, 4)) })
