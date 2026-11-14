// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Checks the "so far" card in a running month and when the data stopped.
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vitest'
import type { CalendarRow } from '../lib/stats'
import ThisMonthCard from './ThisMonthCard'

// 2001 and 2002 complete; data through 12 Feb 2003. February so far: 9 in 2003; the same 12 days were 2 and 4 before → normal 3.
const rows: CalendarRow[] = []
for (let y = 2001; y <= 2003; y++)
  for (let m = 1; m <= 12 && (y < 2003 || m <= 2); m++)
    rows.push({ year: y, month: m, value: m === 2 ? [10, 20, 9][y - 2001] : 1, so_far: m === 2 ? [2, 4, 9][y - 2001] : 1, modis: 0, snpp: 0, noaa20: 0, provisional: 0 })
const meta = { data_through: '2003-02-12' }

it('compares the running month with the same first days', () => {
  const html = renderToStaticMarkup(<ThisMonthCard rows={rows} meta={meta} today={new Date('2003-02-13')} />)
  expect(html).toContain('February 2003 so far has 9 hotspots here, against a normal of 3.')
  expect(html).toContain('the same first 12 days of the month, 2001 to 2002. The month is not finished')
  expect(html).not.toContain('could not be loaded')
})

it('says so when the newest days are missing', () => {
  const html = renderToStaticMarkup(<ThisMonthCard rows={rows} meta={meta} today={new Date('2003-04-02')} />)
  expect(html).toContain('The newest days could not be loaded. Showing February 2003, the latest complete month.')
  expect(html).toContain('February 2003 had 9 hotspots here')
  expect(html).not.toContain('not finished')
})
