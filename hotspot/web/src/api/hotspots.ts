// AI note: written with Claude Code (Claude Opus 5.5) for Person B, reviewed by the team. The `hotspots_export` database call (plan, section 9.4), read page by page.
import type { Polygon } from '../lib/geo'

const URL = import.meta.env.VITE_SUPABASE_URL
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY // the public (publishable) key

export const PAGE = 10_000 // rows per page of hotspots_export (db/schema.sql: offset page * 10000 limit 10000)
export const MAX_ROWS = 200_000 // the database stops above this with its own message; this is a second guard

/** More than MAX_ROWS hotspots: the page asks for a smaller area or shorter dates. */
export class TooManyHotspots extends Error {}

/**
 * Every hotspot in the area and dates, with all the columns the database returns.
 * Pages go through the function's own `page` input. Inside a page the call moves on by `offset`, so a Supabase limit
 * on rows per answer (1,000 by default) cannot cut a page short. A page with fewer than PAGE rows is the last one.
 */
export async function fetchHotspots(area: Polygon, dateFrom: string, dateTo: string): Promise<Record<string, unknown>[]> {
  if (!URL || !KEY) throw new Error('The database address is not set up (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).')
  const all: Record<string, unknown>[] = []
  for (let page = 0; ; page++) {
    let inPage = 0
    while (inPage < PAGE) {
      const res = await fetch(`${URL}/rest/v1/rpc/hotspots_export?offset=${inPage}`, {
        method: 'POST',
        headers: { apikey: KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ area, date_from: dateFrom, date_to: dateTo, page }),
      })
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.message ?? `The database answered with error ${res.status}.`)
      const rows: Record<string, unknown>[] = await res.json()
      if (rows.length === 0) break
      all.push(...rows)
      inPage += rows.length
      if (all.length > MAX_ROWS) throw new TooManyHotspots()
    }
    if (inPage < PAGE) return all
  }
}
