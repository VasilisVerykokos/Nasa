// AI note: written with Claude Code (Claude Opus 5.5) for Person B, reviewed by the team. Checks the CSV builder, the calendar CSV columns, the month span and the file names.
import { describe, expect, it } from 'vitest'
import type { CalendarRow } from '../stats'
import { calendarCsv, fileName, firstDay, lastDay, span, toCsv } from '.'

describe('toCsv', () => {
  it('quotes cells with commas, quotes or line breaks, and leaves empty values empty', () => {
    expect(toCsv([{ a: 'x,y', b: 'say "hi"', c: null }])).toBe('a,b,c\r\n"x,y","say ""hi""",\r\n')
  })
  it('gives an empty file for no rows', () => {
    expect(toCsv([])).toBe('\r\n')
  })
})

describe('calendarCsv', () => {
  // 2001 and 2002 complete, 2003 partial. August: 10 in 2001, 30 in 2002 (normal: median 20, mean 20). Other months: 1.
  const rows: CalendarRow[] = []
  for (let y = 2001; y <= 2003; y++)
    for (let m = 1; m <= 12 && (y < 2003 || m <= 2); m++)
      rows.push({ year: y, month: m, value: m === 8 ? (y === 2001 ? 10 : 30.456) : 1, modis: 2, snpp: 0, noaa20: 0, provisional: 0 })

  it('has one line per month with the normal median, mean and the difference', () => {
    const lines = calendarCsv(rows).trim().split('\r\n')
    expect(lines[0]).toBe('year,month,hotspots_noaa20_equivalent,modis_detections,snpp_detections,noaa20_detections,provisional_detections,normal_median,normal_mean,difference_from_normal')
    expect(lines).toHaveLength(1 + rows.length)
    expect(lines).toContain('2002,8,30.46,2,0,0,0,20.23,20.23,10.23')
  })
})

describe('span, days and file names', () => {
  it('finds the first and last month, and the last day of a month', () => {
    const rows = [{ year: 2000, month: 11 }, { year: 2026, month: 2 }, { year: 2010, month: 5 }] as CalendarRow[]
    expect(span(rows)).toEqual({ from: '2000-11', to: '2026-02' })
    expect(firstDay('2000-11')).toBe('2000-11-01')
    expect(lastDay('2024-02')).toBe('2024-02-29')
    expect(lastDay('2026-11')).toBe('2026-11-30')
  })
  it('names files with the area and the dates', () => {
    expect(fileName('calendar', 'North Evia 2021', '2000-11', '2026-11')).toBe('hotspot-calendar_north-evia-2021_2000-11_2026-11.csv')
    expect(fileName('hotspots', '  ', '2000-11', '2026-11')).toBe('hotspot-hotspots_area_2000-11_2026-11.csv')
  })
})
