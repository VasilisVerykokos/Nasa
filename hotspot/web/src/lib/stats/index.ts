// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Statistics rules of MASTER-PLAN section 9.5.

export type CalendarRow = { year: number; month: number; value: number; modis: number; snpp: number; noaa20: number; provisional: number }

/** Share of a normal year the peak season must hold (decision log, JUDGE-QUESTIONS.md). */
export const PEAK_SEASON_SHARE = 0.6
/** Below this normal, show two plain numbers instead of "N times". */
export const SMALL_NORMAL = 5

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const key = (r: { year: number; month: number }) => r.year * 12 + r.month

// Relies on calendar() returning a row for every month, zeros included (db/schema.sql, decision log Sat 17:26).
/** The latest month in the data: the current month, still in progress ("so far"). */
export const currentMonth = (rows: CalendarRow[]) => rows.reduce((a, b) => (key(b) > key(a) ? b : a))

/** Years with all 12 months, minus the current year: 2001 to 2025 today. */
export function completeYears(rows: CalendarRow[]): number[] {
  const now = currentMonth(rows).year
  const count = new Map<number, number>()
  for (const r of rows) count.set(r.year, (count.get(r.year) ?? 0) + 1)
  return [...count].filter(([y, n]) => n === 12 && y !== now).map(([y]) => y).sort((a, b) => a - b)
}

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b)
  const mid = s.length >> 1
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

/** Normal for a calendar month = median over complete years. The mean is for the CSV. */
export function normalFor(rows: CalendarRow[], month: number) {
  const years = new Set(completeYears(rows))
  const xs = rows.filter(r => r.month === month && years.has(r.year)).map(r => r.value)
  return { median: median(xs), mean: xs.reduce((a, b) => a + b, 0) / xs.length }
}

const isCurrent = (rows: CalendarRow[], r: CalendarRow) => key(r) === key(currentMonth(rows))

/** A month against its normal: "N times" (null if normal < 5) and rank among finished months of that name (null for the current month). */
export function compare(rows: CalendarRow[], year: number, month: number) {
  const row = rows.find(r => r.year === year && r.month === month)
  if (!row) throw new Error(`No data for ${year}-${month}`)
  const normal = normalFor(rows, month).median
  const soFar = isCurrent(rows, row)
  const peers = rows.filter(r => r.month === month && !isCurrent(rows, r))
  return {
    year, month, value: row.value, normal, soFar,
    ratio: normal < SMALL_NORMAL ? null : row.value / normal,
    rank: soFar ? null : 1 + peers.filter(r => r.value > row.value).length,
    of: peers.length,
  }
}

const fmt = (v: number) => v.toLocaleString('en-US', { maximumFractionDigits: v < 10 ? 1 : 0 })
const ordinal = (n: number) => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th')
const hotspots = (v: number) => `${fmt(v)} hotspot${v === 1 ? '' : 's'}`

/** Must-have 4: "August 2021 was N times the normal August here, the highest in 26 years." */
export function headline(rows: CalendarRow[], year: number, month: number): string {
  const c = compare(rows, year, month)
  const name = MONTHS[month - 1]
  const when = `${name} ${year}${c.soFar ? ' so far' : ''}`
  const body =
    c.normal === 0 ? `${when} ${c.soFar ? 'has' : 'had'} ${hotspots(c.value)} here (normal: 0)`
    : c.ratio === null ? `${when} ${c.soFar ? 'has' : 'had'} ${hotspots(c.value)} here, against a normal of ${fmt(c.normal)}`
    : `${when} ${c.soFar ? 'is' : 'was'} ${c.ratio.toFixed(1)} times the normal ${name} here`
  const rank = c.rank === null ? '' : `, the ${c.rank === 1 ? '' : ordinal(c.rank) + ' '}highest in ${c.of} years`
  return body + rank + '.'
}

/** Must-have 12: this month so far against normal. */
export function thisMonthSoFar(rows: CalendarRow[]) {
  const { year, month } = currentMonth(rows)
  return { ...compare(rows, year, month), sentence: headline(rows, year, month) }
}

/** Top months among finished months (the current month is never ranked). */
export const topMonths = (rows: CalendarRow[], n = 5) =>
  rows.filter(r => !isCurrent(rows, r)).sort((a, b) => b.value - a.value || key(a) - key(b)).slice(0, n)

/** Total per year, all years (partial ones included, for the calendar's total column). */
export function yearTotals(rows: CalendarRow[]) {
  const t = new Map<number, number>()
  for (const r of rows) t.set(r.year, (t.get(r.year) ?? 0) + r.value)
  return t
}

/** Top years among complete years only: the first year and the current year are partial. */
export function topYears(rows: CalendarRow[], n = 5) {
  const t = yearTotals(rows)
  return completeYears(rows).map(year => ({ year, total: t.get(year)! })).sort((a, b) => b.total - a.total || a.year - b.year).slice(0, n)
}

/** Peak season: highest-normal months that together hold PEAK_SEASON_SHARE of a normal year, as "July to September". Null if the normal year is empty. */
export function peakSeason(rows: CalendarRow[]): string | null {
  const normals = MONTHS.map((_, i) => normalFor(rows, i + 1).median)
  const total = normals.reduce((a, b) => a + b, 0)
  if (total === 0) return null
  const picked = new Set<number>()
  let sum = 0
  for (const m of [...normals.keys()].sort((a, b) => normals[b] - normals[a] || a - b)) {
    if (sum >= PEAK_SEASON_SHARE * total) break
    picked.add(m)
    sum += normals[m]
  }
  // Group picked months into runs of neighbours; December runs on into January.
  const start = [...Array(12).keys()].find(m => !picked.has(m))! // exists: picking stops before all 12
  const runs: number[][] = []
  for (let i = 1; i <= 12; i++) {
    const m = (start + i) % 12
    if (!picked.has(m)) continue
    if (picked.has((m + 11) % 12) && runs.length) runs[runs.length - 1].push(m)
    else runs.push([m])
  }
  const phrases = runs.map(r => (r.length === 1 ? MONTHS[r[0]] : `${MONTHS[r[0]]} to ${MONTHS[r[r.length - 1]]}`))
  return phrases.length === 1 ? phrases[0] : `${phrases.slice(0, -1).join(', ')} and ${phrases[phrases.length - 1]}`
}

/** Second calendar view: each cell's value minus the normal for its month. */
export function differenceFromNormal(rows: CalendarRow[]) {
  const normals = MONTHS.map((_, i) => normalFor(rows, i + 1).median)
  return rows.map(r => ({ year: r.year, month: r.month, difference: r.value - normals[r.month - 1] }))
}
