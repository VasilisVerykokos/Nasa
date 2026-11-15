// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Checks the headline card's sentence, its number line and its help line.
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vitest'
import type { CalendarRow } from '../lib/stats'
import HeadlineCard from './HeadlineCard'

// 2001 and 2002 complete, 2003 partial (January and February, February is the current month).
// August: 10 in 2001, 30 in 2002, so the normal August is 20. Every other month: 1.
const rows: CalendarRow[] = []
for (let y = 2001; y <= 2003; y++)
  for (let m = 1; m <= 12 && (y < 2003 || m <= 2); m++)
    rows.push({ year: y, month: m, value: m === 8 ? (y === 2001 ? 10 : 30) : 1, modis: 0, snpp: 0, noaa20: 0, provisional: 0 })

it('shows the "N times" sentence, the two numbers under it, and the years of the normal', () => {
  const html = renderToStaticMarkup(<HeadlineCard rows={rows} label="North Evia 2021" year={2002} month={8} />)
  expect(html).not.toContain('selected month')
  expect(html).toContain('August 2002 was 1.5 times the normal August here, the highest August in 2 years.')
  expect(html).toContain('30 hotspots against a normal of 20.')
  expect(html).toContain('for that calendar month, 2001 to 2002.')
})

it('shows the highest month when no month is picked', () => {
  const html = renderToStaticMarkup(<HeadlineCard rows={rows} label="Test" />)
  expect(html).toContain('August 2002 was 1.5 times the normal August here')
})

it('does not repeat the numbers when the normal is below 5', () => {
  const html = renderToStaticMarkup(<HeadlineCard rows={rows} label="Test" year={2002} month={3} />)
  expect(html).toContain('March 2002 had 1 hotspot here, against a normal of 1')
  expect(html.split('against a normal').length - 1).toBe(1)
})

it('picks the headline month from inside the shown years', () => {
  // 2002 holds the highest August overall (30); with only 2003 shown the card falls back to the current month, not to 2002.
  const html = renderToStaticMarkup(<HeadlineCard rows={rows} label="Test" fromYear={2001} toYear={2001} />)
  expect(html).toContain('August 2001 was 0.5 times the normal August here, the 2nd highest August in 2 years.')
  expect(html).not.toContain('August 2002')
})
