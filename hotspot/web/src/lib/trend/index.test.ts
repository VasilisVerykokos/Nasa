// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Checks the Mann-Kendall test, Sen's slope, the complete-years rule and the trend sentence.
import { expect, it } from 'vitest'
import type { CalendarRow } from '../stats'
import { mannKendall, sensSlope, trend, yearly } from '.'

/** Monthly rows for whole years; `total(y)` is spread as one month's value. `extra` adds a partial current year. */
function rows(from: number, to: number, total: (y: number) => number, extra?: number): CalendarRow[] {
  const out: CalendarRow[] = []
  for (let y = from; y <= to; y++)
    for (let m = 1; m <= 12; m++) out.push({ year: y, month: m, value: m === 8 ? total(y) : 0, modis: 0, snpp: 0, noaa20: 0, provisional: 0 })
  if (extra !== undefined) for (let m = 1; m <= 3; m++) out.push({ year: to + 1, month: m, value: extra, modis: 0, snpp: 0, noaa20: 0, provisional: 0 })
  return out
}

it('finds a significant upward trend in an increasing series', () => {
  const r = mannKendall([1, 2, 3, 4, 5])
  expect(r.s).toBe(10)
  expect(r.z).toBeCloseTo(9 / Math.sqrt(50 / 3), 6) // (S - 1) / sqrt(n(n-1)(2n+5)/18)
  expect(r.p).toBeCloseTo(0.0275, 3)
  expect(r.significant).toBe(true)
})

it('finds no trend in a flat or a shuffled series', () => {
  const flat = mannKendall(Array(20).fill(7))
  expect(flat).toMatchObject({ s: 0, z: 0, significant: false })
  expect(flat.p).toBeCloseTo(1, 6)
  expect(mannKendall([5, 1, 4, 2, 3, 5, 1, 4, 2, 3, 4, 2]).significant).toBe(false)
})

it("computes Sen's slope as the median pairwise slope", () => {
  expect(sensSlope([2001, 2002, 2003, 2004], [10, 12, 14, 16])).toBe(2)
  expect(sensSlope([1, 2, 3], [0, 10, 11])).toBe(5.5) // slopes 10, 5.5, 1
})

it('leaves out the partial first and current years', () => {
  const r = rows(2001, 2025, () => 1, 999)
  r.unshift({ year: 2000, month: 12, value: 999, modis: 0, snpp: 0, noaa20: 0, provisional: 0 })
  expect(yearly(r).map(y => y.year)).toEqual([...Array(25).keys()].map(i => 2001 + i))
})

it('says "no clear trend" when the test is not significant', () => {
  const t = trend(rows(2001, 2025, y => [5, 1, 4, 2, 3][y % 5], 999))
  expect(t.sentence).toBe('No clear trend in yearly fire activity here from 2001 to 2025.')
})

it('gives the direction and the slope when significant, and flags the estimates', () => {
  const up = trend(rows(2001, 2025, y => 100 + 3 * (y - 2001), 0))
  expect(up.sentence).toBe("Yearly fire activity here rose by about 3 hotspots per year from 2001 to 2025 (Mann-Kendall test with Sen's slope, 5% level). Years before 2012 are estimates.")
  expect(trend(rows(2013, 2025, y => 500 - 20 * (y - 2013), 0)).sentence).toBe("Yearly fire activity here fell by about 20 hotspots per year from 2013 to 2025 (Mann-Kendall test with Sen's slope, 5% level).")
})
