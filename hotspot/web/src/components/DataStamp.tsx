// AI note: written with Claude Code (Claude Opus 5.5) for Person B, reviewed by the team. Data stamp: "Data through {date}, updated daily". Words: web/content/ui-text.md, "Header and footer".

const DAY = 86_400_000
const toDate = (v: unknown) => {
  const d = typeof v === 'string' ? new Date(v) : null
  return d && !Number.isNaN(d.getTime()) ? d : null
}
const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })

/** `meta` is null while it loads (nothing is shown yet); `now` is when it arrived, in milliseconds. "updated daily" appears only if the last update is at most 2 days old, so the page never claims an update that stopped. */
export default function DataStamp({ meta, now }: { meta: Record<string, unknown> | null; now: number }) {
  if (meta === null) return null
  const through = toDate(meta.data_through)
  if (!through) return <p className="data-stamp">Data date unavailable</p>
  const updated = toDate(meta.last_update)
  const daily = updated !== null && now - updated.getTime() <= 2 * DAY
  return <p className="data-stamp">{`Data through ${fmt(through)}${daily ? ', updated daily' : ''}`}</p>
}
