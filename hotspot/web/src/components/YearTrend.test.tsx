// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Checks the yearly bar chart: complete years only, estimates marked with their blind-test range, the sentence and the table button.
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vitest'
import type { CalendarRow } from '../lib/stats'
import YearTrend from './YearTrend'

const rows: CalendarRow[] = []
for (let y = 2009; y <= 2014; y++)
  for (let m = 1; m <= (y === 2014 ? 2 : 12); m++) rows.push({ year: y, month: m, value: m === 8 ? 100 : 0, modis: 0, snpp: 0, noaa20: 0, provisional: 0 })

it('draws complete years, marks the estimates with their range, and says the sentence', () => {
  const out = renderToStaticMarkup(<YearTrend rows={rows} meta={{ uncertainty: [-0.25, 0.25] }} />)
  expect(out).toContain('No clear trend in yearly fire activity here from 2009 to 2013.')
  expect(out).toContain('<title>2011: about 100 hotspots, an estimate (range 75 to 125)</title>')
  expect(out).toContain('<title>2012: 100 hotspots</title>')
  expect(out).not.toContain('2014:')
  expect(out.match(/url\(#yt-est\)/g)).toHaveLength(3) // 2009 to 2011
  expect(out).toContain('the range from the blind test (-25% to +25%)')
  expect(out).toContain('>Show as table</button>')
})
