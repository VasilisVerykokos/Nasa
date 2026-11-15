// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. The `month_points` database function (plan, section 9.4), for the dots of one month on the map.
import type { Polygon } from '../lib/geo'

const URL = import.meta.env.VITE_SUPABASE_URL
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY // the public (publishable) key

export const POINT_CAP = 20_000 // month_points stops here (db/schema.sql: limit 20000)

/** weight 0: a detection outside its sensor's period, kept for the proofs; the map skips it. */
export type MonthPoint = { latitude: number; longitude: number; weight: number }

/**
 * Every row month_points returns for the area and month, up to POINT_CAP. Supabase caps each answer
 * (1,000 rows by default), so the call reads on by `offset` until an empty answer. Throws an Error with a readable message.
 */
export async function fetchMonthPoints(area: Polygon, year: number, month: number, signal?: AbortSignal): Promise<MonthPoint[]> {
  if (!URL || !KEY) throw new Error('The database address is not set up (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).')
  const all: MonthPoint[] = []
  while (all.length < POINT_CAP) {
    const res = await fetch(`${URL}/rest/v1/rpc/month_points?select=latitude,longitude,weight&offset=${all.length}`, {
      method: 'POST',
      headers: { apikey: KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ area, year, month }),
      signal,
    })
    if (!res.ok) throw new Error((await res.json().catch(() => null))?.message ?? `The database answered with error ${res.status}.`)
    const rows: MonthPoint[] = await res.json()
    if (rows.length === 0) break
    all.push(...rows)
  }
  return all
}
