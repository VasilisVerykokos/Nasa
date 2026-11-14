// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Must-have 1: draw an area, type a point + radius, or pick a preset.
import { type FormEvent, useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import '@geoman-io/leaflet-geoman-free'
import 'leaflet/dist/leaflet.css'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import { PRESETS, circle, type Polygon } from '../lib/geo'

export type Selection = { area: Polygon; label: string }

/** onChange must be stable (a state setter), because the map is built once. */
export default function AreaPicker({ onChange }: { onChange: (s: Selection) => void }) {
  const box = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const shape = useRef<L.Layer | null>(null)
  const [point, setPoint] = useState({ lat: '', lon: '', radius: '10' })
  const [error, setError] = useState('')

  // One shape at a time: a new one replaces the old one.
  const show = (area: Polygon, label: string, layer: L.Layer = L.geoJSON(area)) => {
    shape.current?.remove()
    shape.current = layer.addTo(map.current!)
    map.current!.fitBounds((layer as L.GeoJSON).getBounds(), { maxZoom: 11 })
    onChange({ area, label })
  }

  useEffect(() => {
    const m = (map.current = L.map(box.current!))
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(m)
    m.pm.addControls({
      position: 'topleft', drawPolygon: true, drawRectangle: true,
      drawMarker: false, drawCircleMarker: false, drawPolyline: false, drawCircle: false, drawText: false,
      editMode: false, dragMode: false, cutPolygon: false, removalMode: false, rotateMode: false,
    })
    m.on('pm:create', e => show((e.layer as L.Polygon).toGeoJSON().geometry as Polygon, 'Drawn area', e.layer))
    show(PRESETS[0].area, PRESETS[0].name)
    return () => { m.remove(); map.current = null; shape.current = null }
  }, []) // build the map once

  const submitPoint = (e: FormEvent) => {
    e.preventDefault()
    const lat = Number(point.lat), lon = Number(point.lon), radius = Number(point.radius)
    if (point.lat === '' || !(lat >= -90 && lat <= 90)) return setError('Latitude must be a number from -90 to 90.')
    if (point.lon === '' || !(lon >= -180 && lon <= 180)) return setError('Longitude must be a number from -180 to 180.')
    if (!(radius > 0 && radius <= 300)) return setError('Radius must be more than 0 and at most 300 km.')
    setError('')
    show(circle(lat, lon, radius), `${lat}, ${lon}, radius ${radius} km`)
  }

  return (
    <section aria-labelledby="area-heading">
      <h2 id="area-heading">Area</h2>
      <div className="presets">
        {PRESETS.map(p => (
          <button key={p.name} type="button" onClick={() => show(p.area, p.name)}>{p.name}</button>
        ))}
      </div>
      <div ref={box} className="map" role="region" aria-label="Map. Draw a polygon or rectangle with the tools at the top left, or use the form below." />
      <form onSubmit={submitPoint} noValidate>
        <h3>Or type a point</h3>
        <label>Latitude <input inputMode="decimal" value={point.lat} onChange={e => setPoint({ ...point, lat: e.target.value })} placeholder="38.9" /></label>
        <label>Longitude <input inputMode="decimal" value={point.lon} onChange={e => setPoint({ ...point, lon: e.target.value })} placeholder="23.25" /></label>
        <label>Radius (km) <input inputMode="decimal" value={point.radius} onChange={e => setPoint({ ...point, radius: e.target.value })} /></label>
        <button type="submit">Use this point</button>
        {error && <p role="alert" className="error">{error}</p>}
      </form>
    </section>
  )
}
