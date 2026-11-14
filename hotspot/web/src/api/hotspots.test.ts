// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Checks that the export reads every page.
import { afterEach, describe, expect, it, vi } from 'vitest'

const area = { type: 'Polygon', coordinates: [[[23, 38], [24, 38], [24, 39], [23, 38]]] }

async function load(answers: Array<{ ok: boolean; body: unknown }>) {
  vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co')
  vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-key')
  vi.resetModules()
  const calls: Array<{ page: number }> = []
  vi.stubGlobal('fetch', vi.fn(async (_url: string, init: RequestInit) => {
    calls.push(JSON.parse(init.body as string))
    const a = answers.shift()!
    return { ok: a.ok, status: a.ok ? 200 : 400, json: async () => a.body }
  }))
  const api = await import('./hotspots')
  return { api, calls }
}

const rows = (n: number) => Array.from({ length: n }, (_, i) => ({ id: i }))

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('fetchHotspots', () => {
  it('asks for page 0, 1, 2 ... until a page comes back short', async () => {
    const { api, calls } = await load([{ ok: true, body: rows(10_000) }, { ok: true, body: rows(10_000) }, { ok: true, body: rows(5) }])
    const all = await api.fetchHotspots(area as never, '2021-08-01', '2021-08-31')
    expect(all).toHaveLength(20_005)
    expect(calls.map((c) => c.page)).toEqual([0, 1, 2])
  })

  it('makes one call when everything fits in the first page', async () => {
    const { api, calls } = await load([{ ok: true, body: rows(3) }])
    expect(await api.fetchHotspots(area as never, '2021-08-01', '2021-08-31')).toHaveLength(3)
    expect(calls).toHaveLength(1)
  })

  it('turns the database refusal over 200,000 into TooManyHotspots', async () => {
    const { api } = await load([{ ok: false, body: { message: 'This selection has 250000 hotspots; the export limit is 200,000.' } }])
    await expect(api.fetchHotspots(area as never, '2000-11-01', '2026-11-30')).rejects.toBeInstanceOf(api.TooManyHotspots)
  })
})
