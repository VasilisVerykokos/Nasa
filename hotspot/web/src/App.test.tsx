// @vitest-environment jsdom
// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Should-haves 3 and 8 in the whole page: a clicked month loads its dots once, the headline follows it, Clear month and a new area remove it, a failure is said plainly, the outline is drawn only when get_meta has one. The map and the database are replaced by fakes.
import { act, useEffect } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import type { Selection } from './components/AreaPicker'
import type { CalendarRow } from './lib/stats'

const box = (w: number): Selection['area'] => ({ type: 'Polygon', coordinates: [[[w, 38.7], [w + 0.3, 38.7], [w + 0.3, 39], [w, 39], [w, 38.7]]] })
const A: Selection = { area: box(23), label: 'Area A' }
const B: Selection = { area: box(22), label: 'Area B' }

const api = vi.hoisted(() => ({ calendar: vi.fn(), meta: vi.fn(), points: vi.fn(), picker: {} as Record<string, unknown> }))
vi.mock('./api/calendar', () => ({ fetchCalendar: api.calendar }))
vi.mock('./api/meta', () => ({ fetchMeta: api.meta }))
vi.mock('./api/points', () => ({ fetchMonthPoints: api.points, POINT_CAP: 20_000 }))
// The real picker needs Leaflet and a real browser. This one starts with area A, has a button for area B, and keeps its last props.
vi.mock('./components/AreaPicker', () => ({
  default: (p: { onChange: (s: Selection) => void; children?: React.ReactNode }) => {
    api.picker = p
    useEffect(() => p.onChange(A), [])
    return <div>{p.children}<button type="button" onClick={() => p.onChange(B)}>Area B</button></div>
  },
}))
const { default: App } = await import('./App')
const { failedLine, OUTLINE_LINE, PICK_HINT } = await import('./components/MapLegend')

// 2001 to 2022, August 2021 the highest month.
const rows: CalendarRow[] = []
for (let y = 2001; y <= 2022; y++)
  for (let m = 1; m <= 12; m++)
    rows.push({ year: y, month: m, value: y === 2021 && m === 8 ? 500 : y === 2005 && m === 3 ? 30 : 5, modis: 5, snpp: 0, noaa20: 5, provisional: 0 })
const GREECE: GeoJSON.Polygon = { type: 'Polygon', coordinates: [[[20, 35], [28, 35], [28, 42], [20, 35]]] }

let root: Root, page: HTMLDivElement
const $ = (sel: string) => page.querySelector<HTMLElement>(sel)
const status = () => $('.map-legend [role="status"]')!.textContent
const headline = () => $('.headline .sentence')!.textContent
const click = (el: Element | null) => act(async () => { el!.dispatchEvent(new MouseEvent('click', { bubbles: true })) }) // async: also waits for the fake answers
const cell = (name: string) => $(`[role="gridcell"][aria-label^="${name},"]`)
const button = (text: string) => [...page.querySelectorAll('button')].find(b => b.textContent === text) ?? null
const deferred = <T,>() => { let resolve!: (v: T) => void, reject!: (e: unknown) => void; const promise = new Promise<T>((a, b) => { resolve = a; reject = b }); return { promise, resolve, reject } }

async function open(outlines: GeoJSON.Polygon[] = []) {
  api.meta.mockResolvedValue({ values: {}, outlines })
  page = document.body.appendChild(document.createElement('div'))
  root = createRoot(page)
  await act(async () => root.render(<App />))
}

beforeEach(() => {
  ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  api.calendar.mockResolvedValue(rows)
})
afterEach(() => {
  act(() => root.unmount())
  page.remove()
  vi.clearAllMocks()
})

it('selecting a cell loads month_points once, for that year and month, and shows the counted dots', async () => {
  api.points.mockResolvedValue([{ latitude: 38.8, longitude: 23.3, weight: 1 }, { latitude: 38.9, longitude: 23.2, weight: 0 }, { latitude: 38.9, longitude: 23.4, weight: 1 }])
  await open()
  expect(status()).toBe(PICK_HINT)
  await click(cell('August 2021'))
  await click(cell('August 2021')) // the same month again: no second request
  expect(api.points).toHaveBeenCalledTimes(1)
  expect(api.points).toHaveBeenCalledWith(A.area, 2021, 8, expect.any(AbortSignal))
  expect(status()).toMatch(/^2 hotspots in August 2021\. Each dot is one VIIRS detection, all the same size \(not weighted\)/) // the weight-0 row is not drawn
  expect(api.picker.points).toHaveLength(2)
  expect(cell('August 2021')!.getAttribute('aria-selected')).toBe('true')
})

it('Enter on a focused cell selects it, and a second selection cancels the first request', async () => {
  const first = deferred<never>()
  api.points.mockReturnValueOnce(first.promise).mockResolvedValueOnce([])
  await open()
  await click(cell('August 2021'))
  const signal: AbortSignal = api.points.mock.calls[0][3]
  expect(status()).toBe('Loading the hotspots of August 2021…')
  act(() => { cell('July 2021')!.focus() })
  await act(async () => { cell('July 2021')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })) })
  expect(signal.aborted).toBe(true)
  expect(api.points).toHaveBeenCalledTimes(2)
  expect(api.points.mock.calls[1].slice(1, 3)).toEqual([2021, 7])
  expect(status()).toMatch(/^0 hotspots in July 2021\./)
})

it('the headline follows the selected month', async () => {
  api.points.mockResolvedValue([])
  await open()
  expect(headline()).toContain('August 2021') // the highest month, before any click
  await click(cell('March 2005'))
  expect(headline()).toContain('March 2005')
})

it('Clear month and a new area remove the selection and the dots', async () => {
  api.points.mockResolvedValue([{ latitude: 38.8, longitude: 23.3, weight: 1 }])
  await open()
  await click(cell('March 2005'))
  await click(button('Clear month'))
  expect(status()).toBe(PICK_HINT)
  expect(api.picker.points).toBeNull()
  expect(headline()).toContain('August 2021')
  expect(document.activeElement).toBe($('.map-legend [role="status"]')) // focus is not lost with the button

  const slow = deferred<never>()
  api.points.mockReturnValueOnce(slow.promise)
  await click(cell('March 2005'))
  const signal: AbortSignal = api.points.mock.calls.at(-1)![3]
  await click(button('Area B'))
  expect(signal.aborted).toBe(true)
  expect(status()).toBe(PICK_HINT)
  expect(button('Clear month')).toBeNull()
})

it('a failed request shows the plain message, not the error', async () => {
  api.points.mockRejectedValue(new Error('permission denied for function month_points'))
  await open()
  await click(cell('August 2021'))
  expect(status()).toBe(failedLine('August 2021'))
  expect(page.textContent).not.toContain('permission denied')
})

it('draws the coverage outline only when get_meta has one', async () => {
  await open()
  expect(api.picker.outlines).toEqual([])
  expect(page.textContent).not.toContain(OUTLINE_LINE)
  act(() => root.unmount()); page.remove()
  await open([GREECE])
  expect(api.picker.outlines).toEqual([GREECE])
  expect(page.textContent).toContain(OUTLINE_LINE)
})
