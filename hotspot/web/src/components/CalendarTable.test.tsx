// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Checks the plain calendar renders rows, totals and the normal year.
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vitest'
import type { CalendarRow } from '../lib/stats'
import CalendarTable from './CalendarTable'

it('shows each year with its total, marks partial years, and adds the normal year', () => {
  const rows: CalendarRow[] = []
  for (let y = 2001; y <= 2003; y++)
    for (let m = 1; m <= 12 && (y < 2003 || m <= 2); m++)
      rows.push({ year: y, month: m, value: m === 8 ? y - 1990 : 1, modis: 0, snpp: 0, noaa20: 0, provisional: 0 })
  const html = renderToStaticMarkup(<CalendarTable rows={rows} />)
  expect(html).toContain('<th scope="row">2001</th>')
  expect(html).toContain('2003 (partial)')
  expect(html).toContain('<td>22</td>') // 2001 total: 11 months × 1 + August 11
  expect(html).toContain('Normal year')
  expect(html.split('<tfoot>')[1]).toContain('<td>12</td>') // August normal: median of 11 and 12 = 11.5, shown rounded
})
