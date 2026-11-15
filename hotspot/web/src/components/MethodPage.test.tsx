// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. The method page draws every proof that has a file, skips the rest, and takes the finding's numbers from the file.
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vitest'
import factors from '../../public/proof/factors.json'
import finding_augusts from '../../public/proof/finding_augusts.json'
import proof1_yearly from '../../public/proof/proof1_yearly.json'
import proof2_blind_test from '../../public/proof/proof2_blind_test.json'
import proof3_fires from '../../public/proof/proof3_fires.json'
import proof4_effis from '../../public/proof/proof4_effis.json'
import proof5_join from '../../public/proof/proof5_join.json'
import proof6_coincident from '../../public/proof/proof6_coincident.json'
import proof7_grid from '../../public/proof/proof7_grid.json'
import { Method, type Proofs } from './MethodPage'

const all: Proofs = { factors, finding_augusts, proof1_yearly, proof2_blind_test, proof3_fires, proof4_effis, proof5_join, proof6_coincident, proof7_grid }
const page = (p: Proofs) => renderToStaticMarkup(<Method proofs={p} env={{}} />)
const TITLES = ['Proof 1.', 'Proof 2.', 'Proof 3a. North Evia', 'Proof 3b. Evros', 'Proof 4.', 'Proof 5.', 'Proof 6.', 'Proof 7.']

it('draws a chart, a caption and a table for every proof file', () => {
  const html = page(all)
  for (const t of TITLES) expect(html).toContain(t)
  expect(html.match(/role="img"/g)).toHaveLength(TITLES.length)
  expect(html.match(/Show as table/g)).toHaveLength(TITLES.length)
  expect(html).toContain('peak falls inside it') // Evros: the 22 Aug peak lies between the 21 and 23 Aug maps
  expect(html).toContain('Limits</h2>') // the text of method.md is there
  expect(html).toContain('Limits of proof 6') // attached to its proof
  expect(html).toContain('3. The proofs</h2>')
  expect(html).toContain('NASA Space Apps 2026 challenge')
  expect(html).not.toContain('{slot')
  expect(html).toContain('±26.3%') // the range slot, filled from proof2_blind_test.json
})

it('fills every "Use our data" address and key from the settings, the curl example included', () => {
  const html = page(all)
  const filled = renderToStaticMarkup(<Method proofs={all} env={{ VITE_SUPABASE_URL: 'https://x.supabase.co', VITE_SUPABASE_ANON_KEY: 'sb_publishable_k' }} />)
  expect(html).not.toMatch(/\{calendar address\}|\{public key\}/)
  expect(filled).toContain('curl -s -X POST &quot;https://x.supabase.co/rest/v1/rpc/calendar&quot;')
  expect(filled.match(/apikey: sb_publishable_k/g)).toHaveLength(2) // the bullet and the curl example
})

it('skips missing proof files without crashing', () => {
  const html = page({ proof7_grid })
  expect(html).toContain('Proof 7.')
  for (const t of TITLES.slice(0, -1)) expect(html).not.toContain(t)
  expect(html).not.toContain('What the harmonized record shows') // no finding without its file
  expect(page({})).toContain('Limits</h2>')
})

it('words the finding with the numbers of the file, and says when the ranges overlap', () => {
  const augusts = [{ year: 2007, harmonized: 1000 }, { year: 2021, harmonized: 500 }, { year: 2023, harmonized: 400 }]
  const html = page({ finding_augusts: { fire_season_month_error_pct: 10, yearly_error_pct: 5, augusts } })
  expect(html).toContain('August 2007 had about 1,000 hotspots in Greece</strong> (range 900 to 1,100)')
  expect(html).toContain('against 500 in August 2021 and 400 in August 2023')
  expect(html).toContain('Even the low end of the 2007 range is above both')
  expect(html).toContain('measured by MODIS, converted to VIIRS units; the range is ±10%')
  const close = page({ finding_augusts: { fire_season_month_error_pct: 60, yearly_error_pct: 5, augusts } })
  expect(close).toContain('The 2007 range overlaps them')
})
