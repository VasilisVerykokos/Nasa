// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Should-have 2: yearly totals and a Mann-Kendall test with Sen's slope (two-sided, 5% level).
import { type CalendarRow, completeYears, yearTotals } from '../stats'

/** Years before this are MODIS estimates. */
export const ESTIMATE_BEFORE = 2012
export const ALPHA = 0.05

/** Harmonized total per complete year (partial years left out, the lib/stats rule). */
export function yearly(rows: CalendarRow[]) {
  const t = yearTotals(rows)
  return completeYears(rows).map(year => ({ year, total: t.get(year)! }))
}

// Standard normal CDF via erf (Abramowitz and Stegun 7.1.26, error below 1.5e-7).
function phi(z: number) {
  const x = Math.abs(z) / Math.SQRT2, t = 1 / (1 + 0.3275911 * x)
  const erf = 1 - t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429)))) * Math.exp(-x * x)
  return z >= 0 ? (1 + erf) / 2 : (1 - erf) / 2
}

/** Mann-Kendall test, two-sided, normal approximation with the tie correction and continuity correction. */
export function mannKendall(xs: number[]) {
  const n = xs.length
  let s = 0
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) s += Math.sign(xs[j] - xs[i])
  const ties = new Map<number, number>()
  for (const x of xs) ties.set(x, (ties.get(x) ?? 0) + 1)
  const variance = (n * (n - 1) * (2 * n + 5) - [...ties.values()].reduce((a, t) => a + t * (t - 1) * (2 * t + 5), 0)) / 18
  const z = variance > 0 && s !== 0 ? (s - Math.sign(s)) / Math.sqrt(variance) : 0
  const p = 2 * (1 - phi(Math.abs(z)))
  return { s, z, p, significant: p < ALPHA }
}

/** Sen's slope: the median of all pairwise slopes, in units of xs per unit of ts. */
export function sensSlope(ts: number[], xs: number[]) {
  const slopes: number[] = []
  for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < ts.length; j++) slopes.push((xs[j] - xs[i]) / (ts[j] - ts[i]))
  slopes.sort((a, b) => a - b)
  const mid = slopes.length >> 1
  return slopes.length === 0 ? 0 : slopes.length % 2 ? slopes[mid] : (slopes[mid - 1] + slopes[mid]) / 2
}

const fmt = (v: number) => v.toLocaleString('en-US', { maximumFractionDigits: Math.abs(v) < 10 ? 1 : 0 })

/** The test on the complete years and the one sentence the screen shows. */
export function trend(rows: CalendarRow[]) {
  const ys = yearly(rows)
  const first = ys[0]?.year ?? NaN, last = ys.at(-1)?.year ?? NaN
  const mk = mannKendall(ys.map(y => y.total))
  const slope = sensSlope(ys.map(y => y.year), ys.map(y => y.total))
  const significant = mk.significant && slope !== 0 // a significant S with a zero median slope says no direction worth stating
  const sentence = !significant
    ? `No clear trend in yearly fire activity here from ${first} to ${last}.`
    : `Yearly fire activity here ${slope > 0 ? 'rose' : 'fell'} by about ${fmt(Math.abs(slope))} hotspots per year from ${first} to ${last} (Mann-Kendall test with Sen's slope, 5% level).` +
      (first < ESTIMATE_BEFORE ? ` Years before ${ESTIMATE_BEFORE} are estimates.` : '')
  return { ...mk, significant, slope, first, last, years: ys, sentence }
}
