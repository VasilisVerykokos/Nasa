// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Checks each message shows the wording the page uses.
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vitest'
import { DatabaseMessage, NoHotspots, OutsideGreece, Unreachable } from './Messages'

it('shows the agreed words for each case', () => {
  expect(renderToStaticMarkup(<OutsideGreece />)).toContain('HOTSPOT covers Greece only. Pick a preset or draw inside Greece.')
  expect(renderToStaticMarkup(<NoHotspots />)).toContain('from November 2000 to today. Try a larger area.')
  const unreachable = renderToStaticMarkup(<Unreachable onRetry={() => {}} />)
  expect(unreachable).toContain('We could not reach the database.')
  expect(unreachable).toContain('>Try again</button>')
})

it("shows the database's own message unchanged", () => {
  const text = 'The area has 812 corner points; the limit is 500.'
  expect(renderToStaticMarkup(<DatabaseMessage text={text} />)).toContain(text)
})
