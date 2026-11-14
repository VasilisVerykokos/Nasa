// AI note: written with Claude Code (Claude Sonnet 5.5) for Person B, reviewed by the team. Checks the date-range rules and that dates never trigger a calendar call.
import { expect, it, vi } from 'vitest'
import app from '../../App.tsx?raw'
import { fetchCalendar } from '../../api/calendar'
import { checkRange, defaultRange, outsideRecord, recordEnd, REVERSED, yearsOf } from '.'

vi.mock('../../api/calendar', () => ({ fetchCalendar: vi.fn() }))

const through = '2026-11-12'

it('defaults to the whole record: 2000-11-01 to the data-through date, or today if get_meta failed', () => {
  expect(defaultRange(recordEnd({ data_through: '2026-11-12' }))).toEqual({ from: '2000-11-01', to: through })
  expect(recordEnd({}, new Date('2026-11-14T10:00:00Z'))).toBe('2026-11-14')
  expect(recordEnd({ data_through: 'soon' }, new Date('2026-11-14T10:00:00Z'))).toBe('2026-11-14')
})

it('accepts a good range', () => {
  expect(checkRange('2021-07-01', '2021-09-30', through)).toEqual({ range: { from: '2021-07-01', to: '2021-09-30' } })
  expect(checkRange('2000-11-01', through, through)).toHaveProperty('range')
})

it('rejects a reversed range with the plain message', () => {
  expect(checkRange('2022-01-01', '2021-01-01', through)).toEqual({ message: REVERSED })
  expect(checkRange('2022-01-01', '2022-01-01', through)).toEqual({ message: REVERSED })
})

it('rejects a range outside the record', () => {
  const message = outsideRecord(through)
  expect(checkRange('1999-01-01', '2021-01-01', through)).toEqual({ message })
  expect(checkRange('2021-01-01', '2026-12-31', through)).toEqual({ message })
  expect(checkRange('', '2021-01-01', through)).toEqual({ message })
  expect(message).toBe('Choose dates from 1 Nov 2000 to 12 Nov 2026, the whole record.')
})

it('gives the years to show', () => {
  expect(yearsOf({ from: '2005-03-01', to: '2012-09-30' })).toEqual({ fromYear: 2005, toYear: 2012 })
})

it('does not call the calendar when only the dates change', () => {
  checkRange('2021-01-01', '2022-01-01', through)
  yearsOf(defaultRange(through))
  expect(fetchCalendar).not.toHaveBeenCalled()
  // The calendar call in App depends on the area and the retry counter only.
  expect(app).toMatch(/\[selection, outside, attempt\]/)
})
