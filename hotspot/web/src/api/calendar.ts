// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. The `calendar` database function (plan, section 9.4).
import type { Polygon } from '../lib/geo'
import type { CalendarRow } from '../lib/stats'

const URL = import.meta.env.VITE_SUPABASE_URL
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY // the public (publishable) key; the database only lets it call our four functions

/** One row per month of the whole record for the area, zeros included. Throws an Error with a readable message. */
export async function fetchCalendar(area: Polygon, signal?: AbortSignal): Promise<CalendarRow[]> {
  if (!URL || !KEY) throw new Error('The database address is not set up (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).')
  const res = await fetch(`${URL}/rest/v1/rpc/calendar`, {
    method: 'POST',
    headers: { apikey: KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ area }),
    signal,
  })
  // The database's own messages are written for people ("The area has 812 corner points; the limit is 500...").
  if (!res.ok) throw new Error((await res.json().catch(() => null))?.message ?? `The database answered with error ${res.status}.`)
  return res.json()
}
