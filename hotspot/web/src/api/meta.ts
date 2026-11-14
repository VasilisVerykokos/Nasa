// AI note: written with Claude Code (Claude Opus 5.5) for Person B, reviewed by the team. The `get_meta` database call (plan, section 9.4).
const URL = import.meta.env.VITE_SUPABASE_URL
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY // the public (publishable) key

/** The `meta` part of get_meta, as key → value. The data stamp reads `data_through` (a date) and `last_update` (a time). */
export async function fetchMeta(): Promise<Record<string, unknown>> {
  if (!URL || !KEY) throw new Error('The database address is not set up (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).')
  const res = await fetch(`${URL}/rest/v1/rpc/get_meta`, {
    method: 'POST',
    headers: { apikey: KEY, 'Content-Type': 'application/json' },
    body: '{}',
  })
  if (!res.ok) throw new Error(`The database answered with error ${res.status}.`)
  return (await res.json()).meta ?? {}
}
