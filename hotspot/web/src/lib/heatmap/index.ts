// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Heatmap colours and the "show the arithmetic" text (plan 4 step 7, 9.5). Words: web/content/ui-text.md.
import { interpolateYlOrRd } from 'd3-scale-chromatic'
import type { CalendarRow } from '../stats'

export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const SNPP_START = 2012 * 12 + 2 // Feb 2012 (pipeline/config.py)
const NOAA20_START = 2019 * 12 + 1 // Jan 2019

/** get_meta's `uncertainty`: low and high error as fractions, for example [-0.263, 0.263]. */
export type Range = [number, number]

export const sensorOf = (year: number, month: number) => {
  const k = year * 12 + month
  return k < SNPP_START ? 'modis' : k < NOAA20_START ? 'snpp' : 'noaa20'
}

/** Counts: ColorBrewer YlOrRd (pale yellow to dark red, colour-blind safe) on a square-root scale, so the few huge months do not wash out the rest. Above `max`: the top colour. */
export const countColor = (v: number, max: number) => interpolateYlOrRd(max > 0 ? Math.sqrt(Math.min(Math.max(v, 0) / max, 1)) : 0)

export type View = 'count' | 'diff' | 'raw'

/** Should-have 1: the naive sum the challenge warns against, no scaling. */
export const rawOf = (r: CalendarRow) => r.modis + r.snpp + r.noaa20

/** One cell's colour. `max` is the harmonized maximum in both count views, so raw and harmonized compare by eye. */
export const cellColor = (view: View, r: CalendarRow, max: number, diff: number, maxAbs: number) =>
  view === 'diff' ? diffColor(diff, maxAbs) : countColor(view === 'raw' ? rawOf(r) : r.value, max)

// Blue, near-white at normal, orange (ColorBrewer PuOr/RdBu end colours, colour-blind safe).
const STOPS = [[33, 102, 172], [242, 242, 242], [179, 88, 6]]
const mix = (a: number[], b: number[], t: number) => `rgb(${a.map((x, i) => Math.round(x + (b[i] - x) * t)).join(', ')})`

/** Difference from normal: blue below, near-white at normal, orange above; signed square-root, like the counts. */
export function diffColor(d: number, maxAbs: number) {
  const t = maxAbs > 0 ? Math.sign(d) * Math.sqrt(Math.min(Math.abs(d) / maxAbs, 1)) : 0 // -1 .. 1
  return t < 0 ? mix(STOPS[1], STOPS[0], -t) : mix(STOPS[1], STOPS[2], t)
}

const n = (v: number) => Math.round(v).toLocaleString('en-US')
const signed = (v: number) => (Math.round(v) > 0 ? '+' : '') + n(v)

/** How the number was made: the three periods of the record. */
export function arithmetic(r: CalendarRow, range: Range | null): string {
  const sensor = sensorOf(r.year, r.month)
  if (sensor === 'noaa20') return 'Measured by VIIRS NOAA-20, no scaling.'
  const [count, name] = sensor === 'modis' ? [r.modis, 'MODIS'] : [r.snpp, 'S-NPP']
  const sum = count === 0 ? `0 ${name} detections, so 0` : `${n(count)} ${name} detection${count === 1 ? '' : 's'} × ${(r.value / count).toFixed(2)} = ${n(r.value)}`
  if (sensor === 'snpp') return `Counted by VIIRS S-NPP: ${sum}.`
  const spread = range && count > 0 ? ` (range ${n(r.value * (1 + range[0]))} to ${n(r.value * (1 + range[1]))})` : ''
  return `Measured by MODIS, converted to VIIRS units: ${sum}${spread}.`
}

/** Accessible name and the hover/focus text of one month cell. `normal` is that calendar month's median. */
export function describeMonth(r: CalendarRow, normal: number, range: Range | null, soFar: boolean) {
  const when = `${MONTH_NAMES[r.month - 1]} ${r.year}${soFar ? ' so far' : ''}`
  const estimate = sensorOf(r.year, r.month) === 'modis'
  const name = `${when}, ${estimate ? 'about ' : ''}${n(r.value)} hotspots, ${estimate ? 'estimated' : 'measured'}` +
    `${r.provisional > 0 ? ', provisional' : ''}`
  const month = MONTH_NAMES[r.month - 1]
  const text = [
    `${when}: ${estimate ? 'about ' : ''}${n(r.value)} hotspots${estimate ? ', an estimate' : ''}.`,
    arithmetic(r, range),
    normal === 0 ? `Normal ${month}: 0.` : `${signed(r.value - normal)} against the normal ${month} of ${n(normal)}.`,
    r.provisional > 0 ? 'Provisional: near-real-time data until NASA releases the final data.' : '',
  ].filter(Boolean).join(' ')
  return { name, text }
}

/** Raw view: the three counts and their sum, next to the harmonized value it should be read against. */
export function describeRaw(r: CalendarRow, soFar: boolean) {
  const when = `${MONTH_NAMES[r.month - 1]} ${r.year}${soFar ? ' so far' : ''}`
  const raw = rawOf(r)
  const name = `${when}, ${n(raw)} detections, sensors simply added${r.provisional > 0 ? ', provisional' : ''}`
  const text = [
    `${when}: ${n(raw)} detections, sensors simply added.`,
    `MODIS ${n(r.modis)} + S-NPP ${n(r.snpp)} + NOAA-20 ${n(r.noaa20)} = ${n(raw)}.`,
    `Harmonized: ${sensorOf(r.year, r.month) === 'modis' ? 'about ' : ''}${n(r.value)} hotspots.`,
    r.provisional > 0 ? 'Provisional: near-real-time data until NASA releases the final data.' : '',
  ].filter(Boolean).join(' ')
  return { name, text }
}

export const fmtCount = n
