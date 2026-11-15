// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. The `get_meta` database call.
const URL = import.meta.env.VITE_SUPABASE_URL
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY // the public (publishable) key

export type Outline = GeoJSON.Polygon | GeoJSON.MultiPolygon

/** get_meta's `coverage` (country → GeoJSON) as a list of outlines; anything that is not a polygon is skipped. */
export const outlinesOf = (coverage: unknown): Outline[] =>
  Object.values(coverage && typeof coverage === 'object' ? coverage : {})
    .filter((g): g is Outline => (g?.type === 'Polygon' || g?.type === 'MultiPolygon') && Array.isArray(g.coordinates))

/** `meta` as key → value (the data stamp reads `data_through`, a date, and `last_update`, a time) and the coverage outlines. */
export async function fetchMeta(): Promise<{ values: Record<string, unknown>; outlines: Outline[] }> {
  if (!URL || !KEY) throw new Error('The database address is not set up (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).')
  const res = await fetch(`${URL}/rest/v1/rpc/get_meta`, {
    method: 'POST',
    headers: { apikey: KEY, 'Content-Type': 'application/json' },
    body: '{}',
  })
  if (!res.ok) throw new Error(`The database answered with error ${res.status}.`)
  const json = await res.json()
  return { values: json.meta ?? {}, outlines: outlinesOf(json.coverage) }
}
