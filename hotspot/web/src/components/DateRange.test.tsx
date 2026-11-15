// AI note: written with Claude Code (Claude Sonnet 5.5), reviewed by the team. Checks the date fields, their labels and the "Whole record" button.
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vitest'
import DateRange from './DateRange'

it('shows labelled From and To fields set to the whole record, and a reset button', () => {
  const html = renderToStaticMarkup(<DateRange through="2026-11-12" onChange={() => {}} />)
  expect(html).toContain('>Date range</h2>')
  expect(html).toContain('From <input type="date"')
  expect(html).toContain('To <input type="date"')
  expect(html).toContain('value="2000-11-01"')
  expect(html).toContain('value="2026-11-12"')
  expect(html).toContain('>Whole record</button>')
  expect(html).toContain('role="alert"') // the message area exists from the start, so screen readers announce it when it fills
})

it('shows nothing until the data-through date is known', () => {
  expect(renderToStaticMarkup(<DateRange through={null} onChange={() => {}} />)).toBe('')
})
