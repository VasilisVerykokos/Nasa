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
 * Pages advance by the number of rows that came back and stop at an empty page, so a server limit below PAGE cannot cut the file short.
 */
export async function fetchHotspots(area: Polygon, dateFrom: string, dateTo: string): Promise<Record<string, unknown>[]> {
  if (!URL || !KEY) throw new Error('The database address is not set up (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).')
  const all: Record<string, unknown>[] = []
  while (true) {
    const res = await fetch(`${URL}/rest/v1/rpc/hotspots_export?limit=${PAGE}&offset=${all.length}`, {
      method: 'POST',
      headers: { apikey: KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ area, date_from: dateFrom, date_to: dateTo }),
    })
    if (!res.ok) throw new Error((await res.json().catch(() => null))?.message ?? `The database answered with error ${res.status}.`)
    const page: Record<string, unknown>[] = await res.json()
    // A repeated first row means the server ignored the offset: the first page already held everything.
    if (page.length === 0 || (all.length > 0 && JSON.stringify(page[0]) === JSON.stringify(all[0]))) return all
    all.push(...page)
    if (all.length > MAX_ROWS) throw new TooManyHotspots()
  }
}
