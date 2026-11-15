// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Checks the heatmap grid: a named cell for every month, total and normal, one tab stop, marks and the year filter.
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vitest'
import type { CalendarRow } from '../lib/stats'
import CalendarHeatmap, { SCROLL_CUE, scrollState } from './CalendarHeatmap'

// Nov 2010 to Feb 2013: a partial first year, MODIS and S-NPP months, and a current month that is provisional.
const rows: CalendarRow[] = []
for (let y = 2010; y <= 2013; y++)
  for (let m = 1; m <= 12; m++)
    if ((y > 2010 || m >= 11) && (y < 2013 || m <= 2))
      rows.push({ year: y, month: m, value: m === 8 ? 40 : 2, modis: 1, snpp: 1, noaa20: 0, provisional: y === 2013 && m === 2 ? 2 : 0 })
const html = (props = {}) => renderToStaticMarkup(<CalendarHeatmap rows={rows} label="North Evia 2021" meta={{ uncertainty: [-0.26, 0.26], data_through: '2013-02-12' }} {...props} />)

it('draws a named cell for every month, total and normal, in a keyboard grid with one tab stop', () => {
  const out = html()
  expect(out.match(/role="row"/g)).toHaveLength(5) // 2010 to 2013, plus the normal row
  expect(out.match(/role="gridcell"/g)).toHaveLength(5 * 13)
  expect(out.match(/role="gridcell" aria-label="[^"]+"/g)).toHaveLength(5 * 13)
  expect(out.match(/tabindex="0"/g)).toHaveLength(1)
  expect(out).toContain('aria-label="August 2011, about 40 hotspots, estimated"')
  expect(out).toContain('aria-label="August 2012, 40 hotspots, measured"')
  expect(out).toContain('aria-label="February 2013 so far, 2 hotspots, measured, provisional"')
  expect(out).toContain('aria-label="January 2010, no data"')
  expect(out).toContain('aria-label="2011 total, 62 hotspots"')
  expect(out).toContain('aria-label="Normal August, 40 hotspots"')
  expect(out).toContain('2010*') // partial years marked
  expect(out).toContain('Data through 12 Feb 2013')
})

it('shows only the chosen years', () => {
  const out = html({ fromYear: 2011, toYear: 2012 })
  expect(out.match(/role="row"/g)).toHaveLength(3)
  expect(out).toContain('Calendar, 2011 to 2012')
})

// No fake browser is installed, so the sizes are mocked on the plain numbers the component reads from its box.
it('says what the scroll box hides: wide when content is wider than the box, more until scrolled to the end', () => {
  expect(scrollState({ scrollWidth: 560, clientWidth: 358, scrollLeft: 0 })).toEqual({ wide: true, more: true })
  expect(scrollState({ scrollWidth: 560, clientWidth: 358, scrollLeft: 100 })).toEqual({ wide: true, more: true })
  expect(scrollState({ scrollWidth: 560, clientWidth: 358, scrollLeft: 202 })).toEqual({ wide: true, more: false }) // at the end
  expect(scrollState({ scrollWidth: 640, clientWidth: 640, scrollLeft: 0 })).toEqual({ wide: false, more: false }) // fits: no cue
  expect(scrollState({ scrollWidth: 0, clientWidth: 0, scrollLeft: 0 })).toEqual({ wide: false, more: false }) // hidden in table view
})

it('keeps the cue text out of the first draw, before the box is measured, and the cue line is the agreed wording', () => {
  expect(html()).not.toContain(SCROLL_CUE)
  expect(SCROLL_CUE).toBe('Scroll sideways for September to December and the year totals.')
})
