// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. "Method and proof" view (must-haves 7 and 9): reads only the static proof files, never the database.
import { marked } from 'marked'
import { useEffect, useState } from 'react'
import methodMd from '../../content/method.md?raw'

const FILES = ['factors', 'finding_augusts', 'proof1_yearly', 'proof2_blind_test', 'proof3_fires', 'proof4_effis',
  'proof5_join', 'proof6_coincident', 'proof7_grid'] as const
export type Proofs = Partial<Record<(typeof FILES)[number], any>> // the JSON files written by pipeline/validate.py and proof*.py
type Env = { VITE_SUPABASE_URL?: string; VITE_SUPABASE_ANON_KEY?: string }

const FIRE_SEASON = [6, 7, 8, 9] // pipeline/config.py FIRE_SEASON_MONTHS
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const n = (v: number, digits = 0) => v.toLocaleString('en-GB', { maximumFractionDigits: digits })
const day = (iso: string) => `${+iso.slice(8)} ${MONTHS[+iso.slice(5, 7) - 1]}`

/** Loads every proof file it can; a missing or unreadable file is left out, so its chart is skipped. */
export default function MethodPage() {
  const [proofs, setProofs] = useState<Proofs | null>(null)
  useEffect(() => {
    Promise.all(FILES.map(f => fetch(`proof/${f}.json`).then(r => (r.ok ? r.json() : undefined)).catch(() => undefined)))
      .then(data => setProofs(Object.fromEntries(FILES.map((f, i) => [f, data[i]]))))
  }, [])
  return proofs ? <Method proofs={proofs} env={import.meta.env as Env} /> : <p>Loading the proofs…</p>
}

/** method.md from "On this page" on, with its {slot} markers filled from the proof files, split at each "## " heading. */
function sections(p: Proofs, env: Env): string[] {
  const f2 = p.factors?.find((r: any) => r.name === 'F2')?.factor
  const err = p.proof2_blind_test?.summary.fire_season_month_error_pct
  const url = env.VITE_SUPABASE_URL
  const md = methodMd.replace(/\r\n/g, '\n') // a Windows checkout has CRLF line ends
  return md.slice(md.indexOf('## On this page'))
    .replace('Factors: `{slot: factors.json}`.', 'The factors are in the table below.')
    .replace('`{slot: factors.json, F2}`', f2 ? `F2 = ${f2.toFixed(3)}` : 'see the factor table')
    .replace('±`{slot: proof2_blind_test.json, fire-season error}`%', err ? `±${err}%` : 'the blind-test error')
    .replaceAll('{calendar address}', url ? `${url}/rest/v1/rpc/calendar` : 'the address in the README')
    .replaceAll('{public key}', env.VITE_SUPABASE_ANON_KEY ?? 'the public key from the README')
    .replace(/^.*\{Dataset release link.*\n/m, '') // no release yet; the line comes back when method.md gets the link
    .split(/^(?=## )/m)
}

const Md = ({ text }: { text: string }) => <div dangerouslySetInnerHTML={{ __html: marked.parse(text, { async: false }) }} /> // our own file, not user input

export function Method({ proofs: p, env }: { proofs: Proofs; env: Env }) {
  const parts = sections(p, env)
  const proofAt = parts.findIndex(s => s.startsWith('## 3.'))
  return (
    <article className="method">
      <Finding p={p} />
      {parts.slice(0, proofAt).map((s, i) => <Md key={i} text={s} />)}
      {p.factors && <FactorTable rows={p.factors} />}
      <SpliceTable />
      <section>
        <Md text={parts[proofAt].split('\n\n').slice(0, 2).join('\n\n')} />
        {charts(p).map(c => <Chart key={c.title} {...c} />)}
      </section>
      {parts.slice(proofAt + 1).map((s, i) => <Md key={i} text={s} />)}
    </article>
  )
}

/** Must-have 9: August 2007 against August 2021 and 2023, with the blind-test range (decision log, Sat 18:21). */
export function Finding({ p }: { p: Proofs }) {
  const f = p.finding_augusts
  const aug = (y: number): number | undefined => f?.augusts.find((r: any) => r.year === y)?.harmonized
  const [a07, a21, a23] = [aug(2007), aug(2021), aug(2023)]
  if (a07 === undefined || a21 === undefined || a23 === undefined) return null
  const r = f.fire_season_month_error_pct
  const low = a07 * (1 - r / 100)
  const year = (y: number): number | undefined => p.proof1_yearly?.find((x: any) => x.year === y)?.harmonized
  const [y01, y07, y21, y23] = [year(2001), year(2007), year(2021), year(2023)]
  return (
    <section className="finding" aria-labelledby="finding">
      <h2 id="finding">What the harmonized record shows</h2>
      <p>
        <strong>August 2007 had about {n(a07)} hotspots in Greece</strong> (range {n(low)} to {n(a07 * (1 + r / 100))}),
        against {n(a21)} in August 2021 and {n(a23)} in August 2023.{' '}
        {low > Math.max(a21, a23) ? 'Even the low end of the 2007 range is above both.' : 'The 2007 range overlaps them, so the order is not certain.'}
      </p>
      <p>
        2007 is measured by MODIS, converted to VIIRS units; the range is ±{r}%, the miss of our blind test on fire-season months.
        2021 and 2023 were counted by VIIRS NOAA-20 itself. All values are NOAA-20-equivalent hotspots.
        {y07 && y21 && y23 && ` Whole years: 2007 had about ${n(y07)} (±${f.yearly_error_pct}%), 2021 had ${n(y21)} and 2023 had ${n(y23)}.`}
      </p>
      {y01 && <p>2001 also looks high ({n(y01)} for the year), but most of it is autumn farm burning seen by Terra alone and multiplied by the large Terra-only factors, so we do not claim 2001 was worse than 2021 or 2023.</p>}
    </section>
  )
}

const DN: Record<string, string> = { D: 'Day', N: 'Night', all: 'All' }

function FactorTable({ rows }: { rows: any[] }) {
  return (
    <div className="scroll">
      <table>
        <caption>The factors. F1 = S-NPP ÷ MODIS hotspots; F2 = NOAA-20 ÷ S-NPP hotspots.</caption>
        <thead><tr><th>Factor</th><th>Season</th><th>Day or night</th><th>Counts</th><th>Value</th><th>Years</th><th>Note</th></tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r.name}</td><td>{r.season}</td><td>{DN[r.daynight] ?? r.daynight}</td>
              <td>{n(r.numerator)} ÷ {n(r.denominator)}</td><td>{r.factor.toFixed(3)}</td>
              <td>{r.start.slice(0, 4)} to {r.end.slice(0, 4)}</td><td>{r.uses === 'own cell' ? '' : r.uses}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SpliceTable() { // plan, section 4, step 5; the dates are in pipeline/config.py
  const rows = [['Nov 2000 to Jun 2002', 'MODIS, Terra only', 'F1 (Terra only) × F2'], ['Jul 2002 to Jan 2012', 'MODIS, Terra + Aqua', 'F1 (Terra + Aqua) × F2'],
    ['Feb 2012 to Dec 2018', 'VIIRS S-NPP', 'F2'], ['Jan 2019 to today', 'VIIRS NOAA-20', '1']]
  return (
    <div className="scroll">
      <table>
        <caption>The splice: one source at a time. Detections outside their period are kept with weight 0, for the proofs.</caption>
        <thead><tr><th>Period</th><th>Source</th><th>Weight per hotspot</th></tr></thead>
        <tbody>{rows.map(r => <tr key={r[0]}>{r.map(c => <td key={c}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  )
}

type Series = { label: string; values: (number | null)[]; bar?: boolean; right?: boolean }
type ChartProps = { title: string; caption: string; x: string[]; series: Series[]; every?: number; notes?: string[] }

const mean = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length
const ranks = (v: number[]) => v.map(a => v.filter(b => b < a).length) // shortcut: ties not averaged; fine for these sums of weights and hectares
function spearman(a: number[], b: number[]) {
  const [ra, rb] = [ranks(a), ranks(b)]
  const [ma, mb] = [mean(ra), mean(rb)]
  const cov = mean(ra.map((v, i) => (v - ma) * (rb[i] - mb)))
  return cov / Math.sqrt(mean(ra.map(v => (v - ma) ** 2)) * mean(rb.map(v => (v - mb) ** 2)))
}

/** One chart per proof file that exists, each with its one-line point worked out from the file. */
function charts(p: Proofs): ChartProps[] {
  const out: ChartProps[] = []
  if (p.proof1_yearly) {
    const y = p.proof1_yearly.filter((r: any) => r.year >= 2001) // 2000 holds only Nov and Dec
    const at = (yr: number) => y.find((r: any) => r.year === yr)
    out.push({ title: 'Proof 1. Yearly totals: plain merge against harmonized',
      caption: `When VIIRS starts in 2012 the plain merge jumps from ${n(at(2011)['naive sum'])} to ${n(at(2012)['naive sum'])}, while the harmonized record goes from ${n(at(2011).harmonized)} to ${n(at(2012).harmonized)}: the jump came from the instrument, not the fires.`,
      x: y.map((r: any) => String(r.year)), every: 5,
      series: [{ label: 'Plain merge: detections of all sensors added', values: y.map((r: any) => r['naive sum']) },
        { label: 'Harmonized, NOAA-20-equivalent hotspots', values: y.map((r: any) => r.harmonized) }] })
  }
  if (p.proof2_blind_test) {
    const { summary: s, months } = p.proof2_blind_test
    out.push({ title: 'Proof 2. Blind test: 2017 to 2019 predicted from MODIS alone',
      caption: `With the factor fitted on 2012 to 2016 only, the prediction missed whole years by ${s.yearly_error_pct}% on average, fire-season months by ${s.fire_season_month_error_pct}% (worst ${s.fire_season_month_worst_pct}%) and single 1° squares by ${s.square_year_error_pct}%.`,
      x: months.map((r: any) => `${MONTHS[r.month - 1]} ${r.year}`), every: 12,
      series: [{ label: 'Real S-NPP hotspots', values: months.map((r: any) => r.real) },
        { label: 'Predicted from MODIS', values: months.map((r: any) => r.predicted) }] })
  }
  const fires: any[] = p.proof3_fires?.fires ?? []
  for (const [i, f] of fires.entries()) {
    const maps: any[] = f.maps
    const big = maps.reduce((a, m, i) => (i > 0 && m.ha_added > maps[a].ha_added ? i : a), 1)
    const [from, to] = [maps[big - 1].date, maps[big].date]
    const inside = f.peak_day > from && f.peak_day <= to
    const ha = new Map(maps.map(m => [m.date, m.ha]))
    out.push({ title: `Proof 3${fires.length > 1 ? 'abcdefgh'[i] : ''}. ${f.name}: hotspots per day against Copernicus burned area`,
      caption: `Hotspots peaked on ${day(f.peak_day)} (${n(f.peak_hotspots)}). The biggest growth between two maps, ${day(from)} to ${day(to)} (+${n(maps[big].ha_added)} ha), came with ${n(maps[big].hotspots_since_previous_map)} of the fire's ${n(f.total_hotspots)} hotspots${inside ? ', and the peak falls inside it' : ''}.`,
      x: f.days.map((d: any) => day(d.date)), every: f.days.length > 12 ? 3 : 2,
      series: [{ label: 'Harmonized hotspots per day', values: f.days.map((d: any) => d.hotspots), bar: true },
        { label: 'Copernicus burned area, ha (right axis)', values: f.days.map((d: any) => ha.get(d.date) ?? null), right: true }] })
  }
  if (p.proof4_effis) {
    const e = p.proof4_effis
    const top = (k: string) => e.reduce((a: any, r: any) => (r[k] > a[k] ? r : a)).year
    const [th, te] = [top('harmonized'), top('effis_ha')]
    out.push({ title: 'Proof 4. Yearly hotspots against EFFIS burned area',
      caption: `Ranked year by year the two records agree with a rank correlation of ${spearman(e.map((r: any) => r.harmonized), e.map((r: any) => r.effis_ha)).toFixed(2)} over ${e.length} years; ${th === te ? `${th}${th < 2012 ? ', estimated from MODIS,' : ''} is the highest year in both` : `the highest year is ${th} in hotspots and ${te} in burned area`}. Hotspots are not burned area, so the match is not expected to be perfect.`,
      x: e.map((r: any) => String(r.year)), every: 5,
      series: [{ label: 'Harmonized hotspots', values: e.map((r: any) => r.harmonized), bar: true },
        { label: 'EFFIS burned area, ha (right axis)', values: e.map((r: any) => r.effis_ha), right: true }] })
  }
  if (p.proof5_join) {
    const j = p.proof5_join
    const err = mean(j.filter((r: any) => FIRE_SEASON.includes(r.month)).map((r: any) => Math.abs(100 * (r.snpp_x_f2 / r.noaa20 - 1))))
    out.push({ title: 'Proof 5. The last join: NOAA-20 against S-NPP × F2, monthly',
      caption: `The two lines follow each other month by month; fire-season months differ by ${n(err, 1)}% on average. F2 was fitted on these same years, so this shows the month-to-month spread, not a blind test.`,
      x: j.map((r: any) => `${MONTHS[r.month - 1]} ${r.year}`), every: 12,
      series: [{ label: 'NOAA-20, measured', values: j.map((r: any) => r.noaa20) }, { label: 'S-NPP × F2', values: j.map((r: any) => r.snpp_x_f2) }] })
  }
  if (p.proof6_coincident) {
    const r = p.proof6_coincident.rows
    out.push({ title: 'Proof 6. Aqua and S-NPP passing minutes apart: what the gap is made of',
      caption: `On the same pass, Aqua saw fire in only ${r[0].snpp_cells_also_seen_by_aqua_pct}% of the cells where S-NPP saw fire (sensitivity, the larger part); where both saw it, S-NPP had ${r[0].snpp_per_aqua_pixels_in_shared_cells} pixels per Aqua pixel (resolution). It explains the factor; it does not measure its size.`,
      x: r.map((x: any) => `Within ${x.max_minutes} min`),
      series: [{ label: 'S-NPP fire cells that Aqua also saw, %', values: r.map((x: any) => x.snpp_cells_also_seen_by_aqua_pct), bar: true },
        { label: 'Aqua fire cells that S-NPP also saw, %', values: r.map((x: any) => x.aqua_cells_also_seen_by_snpp_pct), bar: true }],
      notes: p.proof6_coincident.limits })
  }
  if (p.proof7_grid) {
    const r = p.proof7_grid.rows
    const grid = r.filter((x: any) => x.cell_deg !== null).map((x: any) => x.ratio)
    out.push({ title: 'Proof 7. Why a common grid does not harmonize the record',
      caption: `Counting grid cells with fire instead of hotspots lowers the S-NPP to MODIS ratio only from ${r[0].ratio} to between ${Math.min(...grid)} and ${Math.max(...grid)}, whatever the cell size: MODIS never sees the small fires, and only a factor covers that.`,
      x: r.map((x: any) => (x.cell_deg === null ? 'No grid' : `${x.cell_km} km cells`)),
      series: [{ label: 'S-NPP ÷ MODIS', values: r.map((x: any) => x.ratio), bar: true }] })
  }
  return out
}

function nice(max: number) { // the top of the axis: 1, 2 or 5 times a power of ten
  const p = 10 ** Math.floor(Math.log10(max))
  return [1, 2, 5, 10].find(m => m * p >= max)! * p
}

const W = 420, H = 230, L = 44, T = 8, B = 24
const strokeOf = (i: number) => `var(--c${(i % 2) + 1})`

/** Bars and lines on one or two value axes. Lines differ by dash and bars by fill, so colour is never the only signal. */
function Chart({ title, caption, x, series, every = 1, notes }: ChartProps) {
  const R = series.some(s => s.right) ? 48 : 8
  const pw = W - L - R, ph = H - T - B, band = pw / x.length
  const top = (right: boolean) => nice(Math.max(1, ...series.filter(s => !!s.right === right).flatMap(s => s.values.map(v => v ?? 0))))
  const tops = { left: top(false), right: top(true) }
  const y = (v: number, right?: boolean) => T + ph * (1 - v / (right ? tops.right : tops.left))
  const bars = series.filter(s => s.bar)
  const bw = (band * 0.8) / Math.max(1, bars.length)
  const cx = (i: number) => L + band * (i + 0.5)
  return (
    <figure className="chart">
      <figcaption><strong>{title}</strong><br />{caption}</figcaption>
      <ul className="legend">
        {series.map((s, i) => (
          <li key={s.label}><svg width="22" height="12" aria-hidden="true">
            {s.bar ? <rect x="5" y="1" width="12" height="10" {...barStyle(bars.indexOf(s), i)} />
              : <line x1="1" x2="21" y1="6" y2="6" stroke={strokeOf(i)} strokeWidth="2.5" strokeDasharray={i % 2 ? '5 3' : undefined} />}
          </svg>{s.label}</li>
        ))}
      </ul>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${title}. ${caption}`}>
        {[0, 0.5, 1].map(f => (
          <g key={f} fontSize="11" fill="currentColor">
            <line x1={L} x2={W - R} y1={T + ph * (1 - f)} y2={T + ph * (1 - f)} stroke="currentColor" opacity="0.2" />
            <text x={L - 4} y={T + ph * (1 - f) + 4} textAnchor="end">{n(tops.left * f)}</text>
            {R > 8 && <text x={W - R + 4} y={T + ph * (1 - f) + 4}>{n(tops.right * f)}</text>}
          </g>
        ))}
        {x.map((label, i) => i % every === 0 && <text key={i} x={cx(i)} y={H - 6} fontSize="11" fill="currentColor" textAnchor="middle">{label}</text>)}
        {bars.map((s, b) => s.values.map((v, i) => v !== null && (
          <rect key={`${b}-${i}`} x={cx(i) - (band * 0.4) + b * bw} width={Math.max(bw - 1, 1)} y={y(v, s.right)} height={y(0, s.right) - y(v, s.right)} {...barStyle(b, series.indexOf(s))} />)))}
        {series.map((s, i) => {
          if (s.bar) return null
          const pts = s.values.flatMap((v, k) => (v === null ? [] : [[cx(k), y(v, s.right)]]))
          return (
            <g key={s.label} stroke={strokeOf(i)} fill="none" strokeWidth="2">
              <polyline points={pts.join(' ')} strokeDasharray={i % 2 ? '5 3' : undefined} />
              {pts.length <= 40 && pts.map(([px, py], k) => <circle key={k} cx={px} cy={py} r="2.5" fill="var(--bg)" />)}
            </g>
          )
        })}
      </svg>
      <details>
        <summary>Show as table</summary>
        <div className="scroll">
          <table>
            <thead><tr><th></th>{series.map(s => <th key={s.label}>{s.label}</th>)}</tr></thead>
            <tbody>{x.map((label, i) => <tr key={i}><th>{label}</th>{series.map(s => <td key={s.label}>{s.values[i] === null ? '' : n(s.values[i]!, 1)}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </details>
      {notes && <details><summary>{`Limits of ${title.split('.')[0].toLowerCase()}`}</summary><ul>{notes.map(t => <li key={t}>{t}</li>)}</ul></details>}
    </figure>
  )
}

function barStyle(b: number, i: number) { // first bar series filled, second outlined only
  return b === 0 ? { fill: strokeOf(i), opacity: 0.75 } : { fill: 'none', stroke: strokeOf(i), strokeWidth: 1.5 }
}
