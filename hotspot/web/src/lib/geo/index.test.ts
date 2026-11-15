// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Tests for the area shapes.
import { describe, expect, it } from 'vitest'
import { PRESETS, circle, outsideGreece } from './index'

describe('circle', () => {
  it('is a closed ring with every corner at the radius', () => {
    const ring = circle(38.9, 23.25, 10).coordinates[0]
    expect(ring).toHaveLength(65)
    expect(ring[0]).toEqual(ring[64])
    for (const [lon, lat] of ring) {
      const km = Math.hypot((lon - 23.25) * 111.32 * Math.cos((38.9 * Math.PI) / 180), (lat - 38.9) * 111.32)
      expect(km).toBeCloseTo(10, 6)
    }
  })
})

describe('outsideGreece', () => {
  it('accepts every preset and a circle on Athens', () => {
    for (const p of PRESETS) expect(outsideGreece(p.area)).toBe(false)
    expect(outsideGreece(circle(37.98, 23.73, 20))).toBe(false)
  })
  it('rejects Rome and Cairo', () => {
    expect(outsideGreece(circle(41.9, 12.5, 20))).toBe(true)
    expect(outsideGreece(circle(30.04, 31.24, 20))).toBe(true)
  })
  it('accepts open sea just south of Crete and the far east Aegean', () => {
    expect(outsideGreece(circle(34.5, 25, 5))).toBe(false)
    expect(outsideGreece(circle(36, 29.5, 5))).toBe(false)
  })
  it('accepts a shape that only overlaps the edge', () => {
    expect(outsideGreece(circle(40, 19.5, 20))).toBe(false)
  })
})
