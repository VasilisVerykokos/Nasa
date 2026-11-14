// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Checks the heatmap colour scales and the "show the arithmetic" text for the three periods.
import { interpolateCividis } from 'd3-scale-chromatic'
import { describe, expect, it } from 'vitest'
import type { CalendarRow } from '../stats'
import { arithmetic, countColor, describeMonth, diffColor } from '.'

const row = (year: number, month: number, value: number, counts: Partial<CalendarRow> = {}): CalendarRow =>
  ({ year, month, value, modis: 0, snpp: 0, noaa20: 0, provisional: 0, ...counts })

describe('colour scales', () => {
  it('counts: 0 is the start of cividis, the maximum its end, a quarter of the maximum its middle (square root)', () => {
    expect(countColor(0, 400)).toBe(interpolateCividis(0))
    expect(countColor(400, 400)).toBe(interpolateCividis(1))
    expect(countColor(100, 400)).toBe(interpolateCividis(0.5))
    expect(countColor(5, 0)).toBe(interpolateCividis(0)) // an area with no hotspots never divides by zero
  })
  it('difference: normal is the near-white centre, below is blue, above is orange, the ends are the full colours', () => {
    expect(diffColor(0, 50)).toBe('rgb(242, 242, 242)')
    expect(diffColor(-50, 50)).toBe('rgb(33, 102, 172)')
    expect(diffColor(50, 50)).toBe('rgb(179, 88, 6)')
    expect(diffColor(12.5, 50)).toBe('rgb(211, 165, 124)') // square root: a quarter of the way is half the colour
    expect(diffColor(0, 0)).toBe('rgb(242, 242, 242)')
  })
})

describe('the arithmetic behind a month', () => {
  const range: [number, number] = [-0.26, 0.26]
  it('before Feb 2012: MODIS detections × the factor, with the range', () => {
    expect(arithmetic(row(2007, 8, 1400.8, { modis: 412 }), range))
      .toBe('Measured by MODIS, converted to VIIRS units: 412 MODIS detections × 3.40 = 1,401 (range 1,037 to 1,765).')
    expect(arithmetic(row(2007, 8, 5.16, { modis: 1 }), range)).toContain('1 MODIS detection × 5.16 = 5')
    expect(arithmetic(row(2012, 1, 0), range)).toBe('Measured by MODIS, converted to VIIRS units: 0 MODIS detections, so 0.')
  })
  it('Feb 2012 to Dec 2018: S-NPP detections × the factor', () => {
    expect(arithmetic(row(2012, 2, 1040, { snpp: 1000 }), range)).toBe('Counted by VIIRS S-NPP: 1,000 S-NPP detections × 1.04 = 1,040.')
    expect(arithmetic(row(2018, 12, 52, { snpp: 50 }), range)).toContain('S-NPP')
  })
  it('from 2019: measured by NOAA-20', () => {
    expect(arithmetic(row(2019, 1, 7, { noaa20: 7 }), range)).toBe('Measured by VIIRS NOAA-20, no scaling.')
  })
  it('the full text: estimate wording, difference from normal, normal = 0, provisional', () => {
    const est = describeMonth(row(2007, 8, 1400.8, { modis: 412 }), 200, range, false)
    expect(est.name).toBe('August 2007, about 1,401 hotspots, estimated')
    expect(est.text).toBe('August 2007: about 1,401 hotspots, an estimate. Measured by MODIS, converted to VIIRS units: ' +
      '412 MODIS detections × 3.40 = 1,401 (range 1,037 to 1,765). +1,201 against the normal August of 200.')
    const winter = describeMonth(row(2026, 1, 3, { noaa20: 3, provisional: 3 }), 0, range, true)
    expect(winter.name).toBe('January 2026 so far, 3 hotspots, measured, provisional')
    expect(winter.text).toBe('January 2026 so far: 3 hotspots. Measured by VIIRS NOAA-20, no scaling. Normal January: 0. ' +
      'Provisional: near-real-time data until NASA releases the final data.')
  })
})
