// AI note: written with Claude Code (Claude Opus 5.5) for Person B, reviewed by the team. Checks the download buttons and the file-name hint for the current area.
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vitest'
import type { Polygon } from '../lib/geo'
import type { CalendarRow } from '../lib/stats'
import ExportBar from './ExportBar'

const rows: CalendarRow[] = []
for (let y = 2001; y <= 2003; y++)
  for (let m = 1; m <= 12 && (y < 2003 || m <= 2); m++)
    rows.push({ year: y, month: m, value: 1, modis: 0, snpp: 0, noaa20: 0, provisional: 0 })
const area: Polygon = { type: 'Polygon', coordinates: [[[23, 38.7], [23.5, 38.7], [23.5, 39], [23, 38.7]]] }

it('offers the two CSV downloads and names the file after the area and the months', () => {
  const html = renderToStaticMarkup(<ExportBar rows={rows} label="North Evia 2021" area={area} />)
  expect(html).toContain('>Download calendar (CSV)</button>')
  expect(html).toContain('>Download hotspots (CSV)</button>')
  expect(html).toContain('hotspot-calendar_north-evia-2021_2001-01_2003-02.csv')
})
