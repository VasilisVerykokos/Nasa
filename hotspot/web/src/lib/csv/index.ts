// AI note: written with Claude Code (Claude Opus 5.5) for Person B, reviewed by the team. CSV builders and file names for the downloads (must-have 6).
import { type CalendarRow, normalFor } from '../stats'

const cell = (v: unknown) => {
  const s = v === null || v === undefined ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v)
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/** Rows of objects to CSV text. Columns default to the keys of the first row, in their order. */
export function toCsv(rows: Record<string, unknown>[], columns = Object.keys(rows[0] ?? {})): string {
  return [columns, ...rows.map(r => columns.map(c => r[c]))].map(line => line.map(cell).join(',')).join('\r\n') + '\r\n'
}

const round = (v: number) => Math.round(v * 100) / 100

/** The calendar table: one line per month, with the normal (median and mean, as the challenge mentions both) and the difference from normal. */
export function calendarCsv(rows: CalendarRow[]): string {
  const normals = [...Array(12).keys()].map(i => normalFor(rows, i + 1))
  return toCsv(rows.map(r => {
    const n = normals[r.month - 1]
    return {
      year: r.year,
      month: r.month,
      hotspots_noaa20_equivalent: round(r.value),
      modis_detections: r.modis,
      snpp_detections: r.snpp,
      noaa20_detections: r.noaa20,
      provisional_detections: r.provisional,
      normal_median: round(n.median),
      normal_mean: round(n.mean),
      difference_from_normal: round(r.value - n.median),
    }
  }))
}

const pad = (n: number) => String(n).padStart(2, '0')

/** First and last month of the rows, as "YYYY-MM". */
export function span(rows: CalendarRow[]) {
  const keys = rows.map(r => r.year * 12 + r.month - 1)
  const ym = (k: number) => `${Math.floor(k / 12)}-${pad((k % 12) + 1)}`
  return { from: ym(Math.min(...keys)), to: ym(Math.max(...keys)) }
}

export const firstDay = (ym: string) => `${ym}-01`
export function lastDay(ym: string) {
  const [y, m] = ym.split('-').map(Number)
  return `${ym}-${pad(new Date(Date.UTC(y, m, 0)).getUTCDate())}`
}

/** "hotspot-calendar_north-evia-2021_2000-11_2026-11.csv" (ui-text.md, Downloads). The hotspots file is "hotspots_north-evia-2021_...", so the word is not doubled. */
export function fileName(kind: 'calendar' | 'hotspots', label: string, from: string, to: string, ext = 'csv') {
  const area = label.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'area'
  return `${kind === 'hotspots' ? 'hotspots' : `hotspot-${kind}`}_${area}_${from}_${to}.${ext}`
}
