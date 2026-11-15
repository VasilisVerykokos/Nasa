// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Checks the export reads every page, with and without a Supabase limit on rows per answer.
import { afterEach, expect, it, vi } from 'vitest'

const area = { type: 'Polygon' as const, coordinates: [[[23, 38.7], [23.5, 38.7], [23.5, 39], [23, 38.7]] as [number, number][]] }

/** A fake database that behaves like hotspots_export: `page` picks 10,000 rows, then `offset` and the row limit apply. */
function fakeDatabase(total: number, rowLimit: number) {
  const data = Array.from({ length: total }, (_, i) => ({ id: i + 1 }))
  return vi.fn(async (url: string, init: { body: string }) => {
    const { page } = JSON.parse(init.body)
    const offset = Number(new URL(url).searchParams.get('offset') ?? 0)
    const rows = data.slice(page * 10_000, page * 10_000 + 10_000).slice(offset, offset + rowLimit)
    return new Response(JSON.stringify(rows), { status: 200 })
  })
}

async function load() {
  vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co')
  vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-key')
  vi.resetModules()
  return import('./hotspots')
}

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

it.each([
  ['no row limit', 25_000, 100_000],
  ['Supabase default limit of 1,000 rows', 25_000, 1_000],
  ['an exact number of pages', 20_000, 1_000],
])('returns every hotspot once, in order (%s)', async (_, total, rowLimit) => {
  vi.stubGlobal('fetch', fakeDatabase(total, rowLimit))
  const { fetchHotspots } = await load()
  const rows = await fetchHotspots(area, '2000-11-01', '2026-11-30')
  expect(rows).toHaveLength(total)
  expect(rows.every((r, i) => r.id === i + 1)).toBe(true)
})

it("passes on the database's own message", async () => {
  const message = 'This selection has 250000 hotspots; the export limit is 200,000. Choose a smaller area or a shorter date range.'
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ message }), { status: 400 })))
  const { fetchHotspots } = await load()
  await expect(fetchHotspots(area, '2000-11-01', '2026-11-30')).rejects.toThrow(message)
})
