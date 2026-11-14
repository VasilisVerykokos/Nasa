// AI note: written with Claude Code (Claude Opus 5.5) for Person B, reviewed by the team. The `hotspots_export` database call (plan, section 9.4), read in pages.
import type { Polygon } from '../lib/geo'

const URL = import.meta.env.VITE_SUPABASE_URL
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY // the public (publishable) key

export const PAGE = 10_000
export const MAX_ROWS = 200_000

/** More than MAX_ROWS hotspots: the page asks for a smaller area or shorter dates. */
export class TooManyHotspots extends Error {}

/**
 * Every hotspot in the area and dates, with all the columns the database returns.
 * The database function hands out pages of PAGE rows by number (page 0, 1, 2 ...); a short page is the last one.
 * The database itself refuses selections over MAX_ROWS.
 */
export async function fetchHotspots(area: Polygon, dateFrom: string, dateTo: string): Promise<Record<string, unknown>[]> {
  if (!URL || !KEY) throw new Error('The database address is not set up (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).')
  const all: Record<string, unknown>[] = []
  for (let page = 0; ; page++) {
    const res = await fetch(`${URL}/rest/v1/rpc/hotspots_export`, {
      method: 'POST',
      headers: { apikey: KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ area, date_from: dateFrom, date_to: dateTo, page }),
    })
    if (!res.ok) {
      const message: string = (await res.json().catch(() => null))?.message ?? `The database answered with error ${res.status}.`
      throw message.includes('export limit') ? new TooManyHotspots(message) : new Error(message)
    }
    const rows: Record<string, unknown>[] = await res.json()
    all.push(...rows)
    if (rows.length < PAGE) return all
  }
}
