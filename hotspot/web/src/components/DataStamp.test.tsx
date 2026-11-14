// AI note: written with Claude Code (Claude Opus 5.5) for Person B, reviewed by the team. Checks the data stamp's three states and the "updated daily" rule.
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vitest'
import DataStamp from './DataStamp'

const now = Date.parse('2026-11-14T18:00:00Z')

it('shows the date, and "updated daily" only after a recent update', () => {
  const recent = renderToStaticMarkup(<DataStamp meta={{ data_through: '2026-11-12', last_update: '2026-11-13T03:00:00Z' }} now={now} />)
  expect(recent).toContain('Data through 12 Nov 2026, updated daily')
  const stale = renderToStaticMarkup(<DataStamp meta={{ data_through: '2026-11-12', last_update: '2026-11-01T03:00:00Z' }} now={now} />)
  expect(stale).toContain('Data through 12 Nov 2026<')
  expect(stale).not.toContain('updated daily')
})

it('says the date is unavailable when the database has none, and shows nothing while loading', () => {
  expect(renderToStaticMarkup(<DataStamp meta={{}} now={now} />)).toContain('Data date unavailable')
  expect(renderToStaticMarkup(<DataStamp meta={null} now={now} />)).toBe('')
})
