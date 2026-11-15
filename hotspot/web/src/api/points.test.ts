// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Checks month_points is read past Supabase's 1,000-row answers, up to its 20,000 cap, and that coverage outlines are read safely.
import { afterEach, expect, it, vi } from 'vitest'
import { outlinesOf } from './meta'

const area = { type: 'Polygon' as const, coordinates: [[[23, 38.7], [23.5, 38.7], [23.5, 39], [23, 38.7]] as [number, number][]] }

/** Behaves like month_points behind Supabase: `total` rows (at most 20,000), 1,000 per answer, read on by `offset`. */
const fakeDatabase = (total: number) => vi.fn(async (url: string, _init: RequestInit) => {
  const offset = Number(new URL(url).searchParams.get('offset'))
  const rows = Array.from({ length: Math.max(0, Math.min(total, 20_000) - offset) }, (_, i) => ({ latitude: 38, longitude: 23, weight: offset + i })).slice(0, 1000)
  return new Response(JSON.stringify(rows), { status: 200 })
})

async function load() {
  vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co')
  vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-key')
  vi.resetModules()
  return import('./points')
}
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals() })

it.each([[2_500], [3_000], [0], [25_000]])('reads every row once, in order (%i in the month)', async total => {
  const db = fakeDatabase(total)
  vi.stubGlobal('fetch', db)
  const { fetchMonthPoints } = await load()
  const rows = await fetchMonthPoints(area, 2021, 8)
  expect(rows).toHaveLength(Math.min(total, 20_000))
  expect(rows.every((r, i) => r.weight === i)).toBe(true)
  expect(JSON.parse(db.mock.calls[0][1].body as string)).toEqual({ area, year: 2021, month: 8 })
})

it("passes on the database's own message", async () => {
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ message: 'The area must be a GeoJSON Polygon or MultiPolygon.' }), { status: 400 })))
  const { fetchMonthPoints } = await load()
  await expect(fetchMonthPoints(area, 2021, 8)).rejects.toThrow('The area must be a GeoJSON Polygon or MultiPolygon.')
})

it('keeps only polygon outlines from get_meta coverage, and none when there is no coverage', () => {
  const greece = { type: 'MultiPolygon', coordinates: [[[[20, 35], [28, 35], [28, 42], [20, 35]]]] }
  expect(outlinesOf(undefined)).toEqual([])
  expect(outlinesOf({})).toEqual([])
  expect(outlinesOf({ Greece: greece, Bad: { type: 'Point', coordinates: [1, 2] }, Worse: null })).toEqual([greece])
})
