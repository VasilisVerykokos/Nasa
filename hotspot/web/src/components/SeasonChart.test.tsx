// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Checks the seasonal chart: the normal line is normalFor, the default year, and the series follows the chosen year.
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vitest'
import { type CalendarRow, normalFor } from '../lib/stats'
import { defaultYear, seasonSeries } from '../lib/season'
import SeasonChart from './SeasonChart'

// 2001 to 2004 complete, 2005 partial and bigger than all (must not be the default). 2003 is the biggest complete year.
const rows: CalendarRow[] = []
for (let y = 2001; y <= 2005; y++)
  for (let m = 1; m <= (y === 2005 ? 2 : 12); m++)
    rows.push({ year: y, month: m, value: y === 2005 ? 5000 : (y === 2003 ? 100 : y - 2000) * m, modis: 0, snpp: 0, noaa20: 0, provisional: 0 })

it('draws the normal line from normalFor for every month', () => {
  seasonSeries(rows, 2002).forEach((s, i) => expect(s.normal).toBe(normalFor(rows, i + 1).median))
})

it('defaults to the complete year with the highest total', () => {
  expect(defaultYear(rows)).toBe(2003)
  const out = renderToStaticMarkup(<SeasonChart rows={rows} />)
  expect(out).toContain('Normal year against 2003')
  expect(out).toContain('<option value="2003" selected="">2003</option>')
  expect(out).not.toContain('<option value="2005"')
  expect(out.match(/tabindex="0"/g)).toHaveLength(12) // one focusable column per month
})

it('changes the series with the year and keeps the normal', () => {
  const a = seasonSeries(rows, 2001), b = seasonSeries(rows, 2004)
  expect(a.map(s => s.value)).toEqual(rows.filter(r => r.year === 2001).map(r => r.value))
  expect(b.map(s => s.value)).toEqual(rows.filter(r => r.year === 2004).map(r => r.value))
  expect(a.map(s => s.value)).not.toEqual(b.map(s => s.value))
  expect(a.map(s => s.normal)).toEqual(b.map(s => s.normal))
})
