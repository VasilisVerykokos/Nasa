// AI note: written with Claude Code (Claude Sonnet 5.5), reviewed by the team. Should-have 5: the area and the dates live in the page address (#area=evros, #lat=38&lon=23.7&r=20&from=..., #shape=lat,lon;lat,lon;...).
import { checkRange, RECORD_START, type Range } from '../dates'
import { circle, PRESETS, type Polygon } from '../geo'

/** An area as the page keeps it. `preset` and `point` say how it was made, so the address can name it. */
export type Place = { area: Polygon; label: string; preset?: string; point?: { lat: number; lon: number; r: number } }

/** Same limit as the database (db/schema.sql counts the closing corner too). */
export const MAX_POINTS = 500

/** "#method" is the only other view; anything else is the calendar. */
export const isMethodView = (hash: string) => hash === '#method'

const round4 = (n: number) => Math.round(n * 1e4) / 1e4
const num = (s: string | null) => (s !== null && /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : NaN) // Number('') is 0 and Number('1e3') passes, so check the text first

/** The address text (without "#") for this area and range. `through` is the last day of the record; a range equal to the whole record is left out. */
export function encodeShare(place: Place, range: Range | null, through: string | null): string {
  const q = new URLSearchParams()
  const ring = place.area.coordinates[0]
  if (place.preset) q.set('area', place.preset)
  else if (place.point) { q.set('lat', String(place.point.lat)); q.set('lon', String(place.point.lon)); q.set('r', String(place.point.r)) }
  else if (ring.length <= MAX_POINTS) q.set('shape', ring.slice(0, -1).map(([lon, lat]) => `${round4(lat)},${round4(lon)}`).join(';')) // too big a shape is left out: it could not be opened again
  if (range && !(range.from === RECORD_START && range.to === through)) { q.set('from', range.from); q.set('to', range.to) }
  return q.toString().replace(/%2C/g, ',').replace(/%3B/g, ';') // keep the corners readable
}

/** Reads an address. Untrusted: any problem at all gives null, and the page shows its default view. */
export function decodeShare(hash: string): { place: Place; range: Range | null } | null {
  const q = new URLSearchParams(hash.replace(/^#/, ''))
  let place: Place | null = null
  const id = q.get('area')
  if (id !== null) {
    const p = PRESETS.find(p => p.id === id)
    if (p) place = { area: p.area, label: p.name, preset: p.id }
  } else if (q.has('lat') || q.has('lon') || q.has('r')) {
    const lat = num(q.get('lat')), lon = num(q.get('lon')), r = num(q.get('r'))
    if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180 && r > 0 && r <= 300)
      place = { area: circle(lat, lon, r), label: `${lat}, ${lon}, radius ${r} km`, point: { lat, lon, r } }
  } else if (q.has('shape')) {
    const corners = q.get('shape')!.split(';')
    const ring = corners.map(c => c.split(',').map(s => num(s || null)))
    if (corners.length >= 3 && corners.length < MAX_POINTS && ring.every(([lat, lon, extra]) => extra === undefined && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180))
      place = { area: { type: 'Polygon', coordinates: [[...ring.map(([lat, lon]) => [lon, lat] as [number, number]), [ring[0][1], ring[0][0]]]] }, label: 'Drawn area' }
  }
  if (!place) return null
  let range: Range | null = null
  if (q.has('from') || q.has('to')) {
    const c = checkRange(q.get('from') ?? '', q.get('to') ?? '', '9999-12-31') // the real last day is known only later; DateRange checks it again
    if (!('range' in c)) return null
    range = c.range
  }
  return { place, range }
}
