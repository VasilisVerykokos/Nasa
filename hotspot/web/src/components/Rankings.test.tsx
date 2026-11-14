// AI note: written with Claude Code (Claude Opus 5.5) for Person B, reviewed by the team. Checks the order of the top months and years, the peak season and the partial-year note.
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vitest'
import type { CalendarRow } from '../lib/stats'
import Rankings from './Rankings'

// 2001 and 2002 complete, 2003 partial (January and February, February is the current month).
// August: 10 in 2001, 30 in 2002. Every other month: 1. Year totals: 2001 = 21, 2002 = 41.
const rows: CalendarRow[] = []
for (let y = 2001; y <= 2003; y++)
  for (let m = 1; m <= 12 && (y < 2003 || m <= 2); m++)
    rows.push({ year: y, month: m, value: m === 8 ? (y === 2001 ? 10 : 30) : 1, modis: 0, snpp: 0, noaa20: 0, provisional: 0 })

it('ranks months and complete years from the highest, and names the peak season', () => {
  const html = renderToStaticMarkup(<Rankings rows={rows} />)
  expect(html.indexOf('Aug 2002 · 30')).toBeGreaterThan(-1)
  expect(html.indexOf('Aug 2002 · 30')).toBeLessThan(html.indexOf('Aug 2001 · 10'))
  expect(html.indexOf('2002 · 41')).toBeLessThan(html.indexOf('2001 · 21'))
  expect(html).not.toContain('2003 · ') // a partial year is never in the top years
  expect(html).not.toContain('Feb 2003') // the current month is never ranked
  expect(html).toContain('<p>August</p>') // August alone holds over 60% of a normal year (20 of 31)
  expect(html).toContain('2003 is a partial year and is left out of the top years.')
})
