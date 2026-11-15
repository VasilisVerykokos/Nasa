// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Tests for the statistics rules on made-up calendars.
import { describe, expect, it } from 'vitest'
import {
  type CalendarRow, completeYears, compare, differenceFromNormal, headline, normalFor, peakSeason, thisMonthSoFar, topMonths, topYears,
} from './index'

// Every month from (y0, m0) to (y1, m1); value = base[month] × mult[year].
function makeRows(y0: number, m0: number, y1: number, m1: number, base: number[], mult: Record<number, number>): CalendarRow[] {
  const rows: CalendarRow[] = []
  for (let y = y0, m = m0; y * 12 + m <= y1 * 12 + m1; m === 12 ? (y++, (m = 1)) : m++)
    rows.push({ year: y, month: m, value: base[m - 1] * mult[y], modis: 0, snpp: 0, noaa20: 0, provisional: 0 })
  return rows
}

// Record runs Nov 2000 to Mar 2004 (Mar 2004 = current month, in progress).
// 2000 and 2004 are partial; 2001-2003 are complete with multipliers 1, 6, 2 → normal = base × 2, mean = base × 3.
//                 Jan Feb Mar Apr May Jun Jul  Aug Sep Oct Nov Dec
const BASE = [0, 2, 3, 0, 0, 5, 40, 100, 30, 0, 10, 0]
const rows = makeRows(2000, 11, 2004, 3, BASE, { 2000: 30, 2001: 1, 2002: 6, 2003: 2, 2004: 70 })
rows.find(r => r.year === 2004 && r.month === 1)!.value = 7 // January normal is 0, but January 2004 had 7

describe('complete years', () => {
  it('leaves out the partial first year and the current year', () => {
    expect(completeYears(rows)).toEqual([2001, 2002, 2003])
  })
  it('a year whose December is the current month is still partial', () => {
    expect(completeYears(makeRows(2001, 1, 2003, 12, BASE, { 2001: 1, 2002: 1, 2003: 1 }))).toEqual([2001, 2002])
  })
})

describe('normalFor', () => {
  it('is the median over complete years, with the mean beside it', () => {
    expect(normalFor(rows, 8)).toEqual({ median: 200, mean: 300 }) // Augusts 100, 600, 200
    expect(normalFor(rows, 2)).toEqual({ median: 4, mean: 6 }) // 2, 12, 4; February 2004 (140) not counted
    expect(normalFor(rows, 11).median).toBe(20) // November 2000 (300) not counted
  })
})

describe('compare', () => {
  it('gives N times normal and the rank among finished months of that name', () => {
    expect(compare(rows, 2002, 8)).toMatchObject({ value: 600, normal: 200, ratio: 3, rank: 1, of: 3, soFar: false })
    expect(compare(rows, 2003, 8)).toMatchObject({ ratio: 1, rank: 2, of: 3 })
  })
  it('normal = 0: no ratio, never divides by zero', () => {
    expect(compare(rows, 2004, 1)).toMatchObject({ value: 7, normal: 0, ratio: null, rank: 1, of: 4 })
  })
  it('normal below 5: no ratio', () => {
    expect(compare(rows, 2004, 2)).toMatchObject({ value: 140, normal: 4, ratio: null })
  })
  it('the current month is "so far" and not ranked; finished months are not ranked against it', () => {
    expect(compare(rows, 2004, 3)).toMatchObject({ value: 210, soFar: true, rank: null, of: 3 })
    expect(compare(rows, 2002, 3)).toMatchObject({ value: 18, rank: 1 }) // 18 < 210, still 1st
  })
})

describe('headline (must-have 4)', () => {
  it('N times normal, highest', () => {
    expect(headline(rows, 2002, 8)).toBe('August 2002 was 3.0 times the normal August here, the highest August in 3 years.')
  })
  it('N times normal, 2nd highest', () => {
    expect(headline(rows, 2003, 8)).toBe('August 2003 was 1.0 times the normal August here, the 2nd highest August in 3 years.')
  })
  it('normal = 0', () => {
    expect(headline(rows, 2004, 1)).toBe('January 2004 had 7 hotspots here, where a normal January has none; the highest January in 4 years.')
  })
  it('normal below 5', () => {
    expect(headline(rows, 2004, 2)).toBe('February 2004 had 140 hotspots here, against a normal of 4, the highest February in 4 years.')
  })
})

describe('topMonths inside a date range', () => {
  it('picks from the shown years only, but keeps the whole record for the rank', () => {
    expect(topMonths(rows, 1)[0]).toMatchObject({ year: 2002, month: 8 })
    const inRange = topMonths(rows, 1, 2003, 2004)[0]
    expect(inRange).toMatchObject({ year: 2003, month: 8 })
    expect(compare(rows, inRange.year, inRange.month).rank).toBe(2) // still ranked against all years
  })
})

describe('thisMonthSoFar (must-have 12)', () => {
  it('compares the current month so far with its normal, without a rank', () => {
    const t = thisMonthSoFar(rows)
    expect(t).toMatchObject({ year: 2004, month: 3, value: 210, normal: 6, ratio: 35, rank: null })
    expect(t.sentence).toBe('March 2004 so far is 35.0 times the normal March here.')
  })
  it('uses the same first days (so_far) for the normal, and drops "so far" when the data stopped', () => {
    const days = rows.map(r => (r.month === 3 ? { ...r, so_far: r.value / 3 } : r)) // normal March for the same days: 6 / 3 = 2
    expect(thisMonthSoFar(days)).toMatchObject({ normal: 2, ratio: null, sentence: 'March 2004 so far has 210 hotspots here, against a normal of 2.' })
    expect(thisMonthSoFar(days, true).sentence).toBe('March 2004 had 210 hotspots here, against a normal of 2.')
    expect(thisMonthSoFar(rows.map(r => ({ ...r, so_far: 0 }))).sentence).toBe('March 2004 so far has 210 hotspots here, where a normal March has none.')
  })
})

describe('rankings', () => {
  it('top 5 months leave out the current month (March 2004 = 210 would be 4th)', () => {
    expect(topMonths(rows).map(r => `${r.year}-${r.month}:${r.value}`))
      .toEqual(['2002-8:600', '2000-11:300', '2002-7:240', '2003-8:200', '2002-9:180'])
  })
  it('top years leave out partial years (2000 = 300 and 2004 = 357 would beat 2001 = 190)', () => {
    expect(topYears(rows)).toEqual([{ year: 2002, total: 1140 }, { year: 2003, total: 380 }, { year: 2001, total: 190 }])
  })
})

describe('peakSeason', () => {
  it('picks the highest-normal months until they hold 60% of a normal year', () => {
    // normals: Aug 200, Jul 80, Sep 60 ... of 380. Aug alone = 53%, Aug + Jul = 74%.
    expect(peakSeason(rows)).toBe('July to August')
  })
  it('runs across the new year', () => {
    const winter = makeRows(2001, 1, 2003, 1, [50, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 50], { 2001: 1, 2002: 1, 2003: 1 })
    expect(peakSeason(winter)).toBe('December to January')
  })
  it('names separate seasons', () => {
    const two = makeRows(2001, 1, 2003, 1, [0, 0, 50, 0, 0, 0, 0, 50, 0, 0, 0, 0], { 2001: 1, 2002: 1, 2003: 1 })
    expect(peakSeason(two)).toBe('March and August')
  })
  it('is null for an area with no hotspots', () => {
    expect(peakSeason(makeRows(2001, 1, 2003, 1, Array(12).fill(0), { 2001: 1, 2002: 1, 2003: 1 }))).toBeNull()
  })
  it('is null when a normal year has fewer than 5 hotspots, and named from 5 up', () => {
    const few = (n: number) => makeRows(2001, 1, 2003, 1, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, n, 0], { 2001: 1, 2002: 1, 2003: 1 })
    expect(peakSeason(few(4))).toBeNull()
    expect(peakSeason(few(5))).toBe('November')
  })
})

describe('differenceFromNormal', () => {
  it('is value minus the normal of that month', () => {
    const d = differenceFromNormal(rows)
    expect(d.find(r => r.year === 2002 && r.month === 8)!.difference).toBe(400)
    expect(d.find(r => r.year === 2001 && r.month === 1)!.difference).toBe(0)
    expect(d.find(r => r.year === 2001 && r.month === 8)!.difference).toBe(-100)
  })
})
