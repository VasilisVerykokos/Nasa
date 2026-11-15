// AI note: written with Claude Code (Claude Sonnet 5.5), reviewed by the team. Tests for the share link: round trips, #method, bad addresses, the corner limit.
import { describe, expect, it } from 'vitest'
import { RECORD_START } from '../dates'
import { PRESETS } from '../geo'
import { decodeShare, encodeShare, isMethodView, MAX_POINTS, type Place } from './index'

const THROUGH = '2026-11-12'
const dates = { from: '2015-01-01', to: '2020-12-31' }
const evros: Place = { area: PRESETS[1].area, label: PRESETS[1].name, preset: 'evros' }
const point: Place = { area: PRESETS[0].area, label: '38, 23.7, radius 20 km', point: { lat: 38, lon: 23.7, r: 20 } }
const drawn: Place = { label: 'Drawn area', area: { type: 'Polygon', coordinates: [[[23.1234, 38.5], [23.9, 38.5], [23.5, 39.1234], [23.1234, 38.5]]] } }
const ring = (n: number) => ({ type: 'Polygon' as const, coordinates: [Array.from({ length: n }, (_, i) => [20 + i / 1e4, 38 + (i % 7) / 1e4] as [number, number])] })

describe('share link', () => {
  it('round-trips a preset, with and without dates', () => {
    expect(encodeShare(evros, null, THROUGH)).toBe('area=evros')
    expect(decodeShare('#area=evros')).toMatchObject({ place: { preset: 'evros', area: PRESETS[1].area }, range: null })
    expect(decodeShare('#' + encodeShare(evros, dates, THROUGH))?.range).toEqual(dates)
  })
  it('leaves the dates out when they are the whole record', () => {
    expect(encodeShare(evros, { from: RECORD_START, to: THROUGH }, THROUGH)).toBe('area=evros')
  })
  it('round-trips a point, with and without dates', () => {
    expect(encodeShare(point, dates, THROUGH)).toBe('lat=38&lon=23.7&r=20&from=2015-01-01&to=2020-12-31')
    const back = decodeShare('#' + encodeShare(point, null, THROUGH))!
    expect(back.place.point).toEqual(point.point)
    expect(back.place.label).toBe(point.label)
    expect(decodeShare('#' + encodeShare(point, dates, THROUGH))?.range).toEqual(dates)
  })
  it('round-trips a drawn shape, with and without dates', () => {
    const text = encodeShare(drawn, null, THROUGH)
    expect(text).toBe('shape=38.5,23.1234;38.5,23.9;39.1234,23.5')
    expect(decodeShare('#' + text)?.place.area).toEqual(drawn.area)
    expect(decodeShare('#' + encodeShare(drawn, dates, THROUGH))).toMatchObject({ place: { area: drawn.area }, range: dates })
  })
  it('rounds corners to 4 decimals', () => {
    const p: Place = { label: 'x', area: { type: 'Polygon', coordinates: [[[23.123456, 38.1], [23.5, 38.1], [23.5, 38.6], [23.123456, 38.1]]] } }
    expect(encodeShare(p, null, THROUGH)).toContain('38.1,23.1235')
  })
  it('still opens the method page', () => {
    expect(isMethodView('#method')).toBe(true)
    expect(isMethodView('#area=evros')).toBe(false)
    expect(decodeShare('#method')).toBeNull()
  })
  it('falls back (null) on malformed or tampered addresses', () => {
    for (const bad of ['', '#', '#area=nowhere', '#lat=abc&lon=1&r=2', '#lat=91&lon=1&r=2', '#lat=38&lon=23&r=0', '#lat=38&lon=23&r=301', '#lat=38&lon=23', '#lat=&lon=&r=',
      '#lat=1e1&lon=23&r=5', '#shape=1,2;3,4', '#shape=a,b;c,d;e,f', '#shape=1,2,3;4,5,6;7,8,9', '#shape=95,2;3,4;5,6', '#area=evros&from=2020-01-01&to=2015-01-01',
      '#area=evros&from=1990-01-01&to=2000-12-31', '#area=evros&from=2015-01-01', '#area=evros&from=zzzz&to=yyyy', '#%E0%A4%A'])
      expect(decodeShare(bad), bad).toBeNull()
  })
  it('rejects a shape over the database limit of 500 points, accepts one at it', () => {
    const corners = (n: number) => 'shape=' + Array.from({ length: n }, (_, i) => `${38 + (i % 7) / 1e4},${20 + i / 1e4}`).join(';')
    expect(decodeShare('#' + corners(MAX_POINTS))).toBeNull() // 500 corners + closing point = 501
    expect(decodeShare('#' + corners(MAX_POINTS - 1))).not.toBeNull()
    expect(encodeShare({ label: 'x', area: ring(MAX_POINTS + 1) }, null, THROUGH)).toBe('') // too big to share: no area in the address
  })
})
