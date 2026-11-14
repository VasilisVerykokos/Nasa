// AI note: written with Claude Code (Claude Sonnet 5.5) for Person B, reviewed by the team. Must-have 2: From and To dates. Words: web/content/ui-text.md, "Date range".
import { useEffect, useState } from 'react'
import { checkRange, defaultRange, RECORD_START, type Range } from '../lib/dates'

type Props = { through: string | null; onChange: (r: Range) => void }

/** `through` is the last day of the record (null while get_meta is loading). `onChange` gets only good ranges; a bad one shows its message and the last good range stays. */
export default function DateRange({ through, onChange }: Props) {
  const [from, setFrom] = useState(through ? RECORD_START : '')
  const [to, setTo] = useState(through ?? '')
  const [message, setMessage] = useState('')

  const reset = (end: string) => {
    const r = defaultRange(end)
    setFrom(r.from); setTo(r.to); setMessage(''); onChange(r)
  }
  useEffect(() => { if (through) reset(through) }, [through]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!through) return null
  const edit = (f: string, t: string) => {
    setFrom(f); setTo(t)
    const c = checkRange(f, t, through)
    if ('range' in c) { setMessage(''); onChange(c.range) } else setMessage(c.message)
  }

  return (
    <section aria-labelledby="dates-heading" className="date-range">
      <h2 id="dates-heading">Date range</h2>
      <label>From <input type="date" value={from} min="2000-11-01" max={through} onChange={e => edit(e.target.value, to)} aria-invalid={!!message} aria-describedby="dates-message" /></label>
      <label>To <input type="date" value={to} min="2000-11-01" max={through} onChange={e => edit(from, e.target.value)} aria-invalid={!!message} aria-describedby="dates-message" /></label>
      <button type="button" onClick={() => reset(through)}>Whole record</button>
      <p className="hint">These dates change which years you see. "Normal" is always worked out from the whole record.</p>
      <p id="dates-message" role="alert" aria-live="assertive" className="error">{message}</p>
    </section>
  )
}
