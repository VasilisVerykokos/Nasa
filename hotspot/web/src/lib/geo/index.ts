// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Area shapes: circle from point + radius, presets, the Greece check.

export type Polygon = { type: 'Polygon'; coordinates: [number, number][][] } // GeoJSON, [longitude, latitude]
type Box = { west: number; south: number; east: number; north: number }

const boxPolygon = (b: Box): Polygon => ({
  type: 'Polygon',
  coordinates: [[[b.west, b.south], [b.east, b.south], [b.east, b.north], [b.west, b.north], [b.west, b.south]]],
})

/** Rectangle around Greece, from pipeline/evidence/greece.geojson (lon 19.63 to 28.24, lat 34.82 to 41.75), rounded outwards. */
const ALL_GREECE: Box = { west: 19.6, south: 34.8, east: 28.3, north: 41.8 }

/** The coverage check is wider, as in the plan (about 19 to 30 E, 34 to 42 N), so a point just south of Crete or off the coast still counts as Greece; the database returns 0 hotspots for open sea. */
export const GREECE: Box = { west: 19, south: 34, east: 30, north: 42 }

/** Plan section 9.5. Both boxes are the official Copernicus areas of interest (EMSR527 AOI01 "Evia", EMSR686 Aristino; pipeline/evidence). */
export const PRESETS = [
  { id: 'north-evia', name: 'North Evia 2021', area: boxPolygon({ west: 22.966, south: 38.674, east: 23.509, north: 39.063 }) }, // id: the name in the share link
  { id: 'evros', name: 'Evros 2023', area: boxPolygon({ west: 25.536, south: 40.749, east: 26.317, north: 41.261 }) },
  { id: 'greece', name: 'All Greece', area: boxPolygon(ALL_GREECE) },
]

// shortcut: flat-earth circle (1° latitude = 111.32 km), fine for radii up to a few hundred km; use a geodesic library if larger radii matter.
/** A circle as a 64-corner polygon, so the database only ever receives one kind of shape. */
export function circle(lat: number, lon: number, radiusKm: number, corners = 64): Polygon {
  const ring: [number, number][] = []
  for (let i = 0; i <= corners; i++) {
    const a = (2 * Math.PI * (i % corners)) / corners
    ring.push([lon + (radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180))) * Math.sin(a), lat + (radiusKm / 111.32) * Math.cos(a)])
  }
  return { type: 'Polygon', coordinates: [ring] }
}

/** True when the shape lies wholly outside the rectangle around Greece ("This area is outside the covered region"). */
export function outsideGreece(p: Polygon): boolean {
  const pts = p.coordinates[0]
  const lons = pts.map(c => c[0]), lats = pts.map(c => c[1])
  return Math.max(...lons) < GREECE.west || Math.min(...lons) > GREECE.east || Math.max(...lats) < GREECE.south || Math.min(...lats) > GREECE.north
}
