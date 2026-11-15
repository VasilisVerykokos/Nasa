// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Must-have 1: draw an area, type a point + radius, or pick a preset.
import { type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import '@geoman-io/leaflet-geoman-free'
import 'leaflet/dist/leaflet.css'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import type { MonthPoint } from '../api/points'
import type { Outline } from '../api/meta'
import { PRESETS, circle } from '../lib/geo'
import type { Place } from '../lib/share'

export type Selection = Place & { focus?: boolean } // focus: the typed-point form was submitted, so App moves focus to the result heading
const EMPTY = { lat: '', lon: '', radius: '10' }
type Props = { onChange: (s: Selection) => void; initial?: Place; points?: MonthPoint[] | null; outlines?: Outline[]; children?: ReactNode }

/**
 * onChange must be stable (a state setter), because the map is built once. `initial` (read once) is the area to start with, from the address; default is the first preset.
 * points: one month's hotspots, drawn as dots above the area. outlines: the covered region, a thin line. Neither takes clicks, so drawing still works. children: shown under the map.
 */
export default function AreaPicker({ onChange, initial, points, outlines, children }: Props) {
  const box = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const shape = useRef<L.Layer | null>(null)
  const [point, setPoint] = useState(initial?.point ? { lat: String(initial.point.lat), lon: String(initial.point.lon), radius: String(initial.point.r) } : EMPTY)
  const [error, setError] = useState('')
  const [preset, setPreset] = useState<string | undefined>() // the preset in use, shown pressed; none for a drawn area or typed point

  // One shape at a time: a new one replaces the old one.
  const show = (place: Place, layer: L.Layer = L.geoJSON(place.area), focus = false) => {
    setPreset(place.preset)
    shape.current?.remove()
    shape.current = layer.addTo(map.current!)
    map.current!.fitBounds((layer as L.GeoJSON).getBounds(), { maxZoom: 11 })
    onChange({ ...place, focus })
  }

  useEffect(() => {
    const m = (map.current = L.map(box.current!))
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(m)
    Object.assign(m.createPane('dots').style, { zIndex: '450', pointerEvents: 'none' }) // above the drawn area (overlay pane, 400); clicks pass through to the drawing tools
    m.pm.addControls({
      position: 'topleft', drawPolygon: true, drawRectangle: true,
      drawMarker: false, drawCircleMarker: false, drawPolyline: false, drawCircle: false, drawText: false,
      editMode: false, dragMode: false, cutPolygon: false, removalMode: false, rotateMode: false,
    })
    // Geoman's tool buttons are bare icons; give them names for screen readers and a tooltip for the mouse.
    for (const [icon, name] of [['rectangle', 'Draw a rectangle'], ['polygon', 'Draw a polygon']]) {
      const a = box.current!.querySelector(`.leaflet-pm-icon-${icon}`)?.closest('a')
      if (a) { a.title = name; a.setAttribute('aria-label', name) }
    }
    m.on('pm:create', e => show({ area: (e.layer as L.Polygon).toGeoJSON().geometry as Place['area'], label: 'Drawn area' }, e.layer))
    const first = PRESETS.find(p => p.id === 'greece') ?? PRESETS[0] // the page opens on All Greece
    show(initial ?? { area: first.area, label: first.name, preset: first.id })
    return () => { m.remove(); map.current = null; shape.current = null }
  }, []) // build the map once

  useEffect(() => {
    if (!points?.length) return
    const renderer = L.canvas({ pane: 'dots' }) // one canvas, not thousands of SVG circles
    const g = L.layerGroup(points.map(p => L.circleMarker([p.latitude, p.longitude], {
      renderer, radius: 3, weight: 1, color: '#5a0000', fillColor: '#ff5a1f', fillOpacity: 0.85, interactive: false, pmIgnore: true,
    }))).addTo(map.current!)
    return () => { g.remove() }
  }, [points])

  useEffect(() => {
    if (!outlines?.length) return
    const o = L.geoJSON({ type: 'GeometryCollection', geometries: outlines } as GeoJSON.GeometryCollection, {
      interactive: false, pmIgnore: true, style: { color: '#444', weight: 1, dashArray: '4 3', fill: false },
    }).addTo(map.current!)
    return () => { o.remove() }
  }, [outlines])

  const submitPoint = (e: FormEvent) => {
    e.preventDefault()
    const lat = Number(point.lat), lon = Number(point.lon), radius = Number(point.radius)
    if (point.lat === '' || !(lat >= -90 && lat <= 90)) return setError('Latitude must be a number from -90 to 90.')
    if (point.lon === '' || !(lon >= -180 && lon <= 180)) return setError('Longitude must be a number from -180 to 180.')
    if (!(radius > 0 && radius <= 300)) return setError('Radius must be more than 0 and at most 300 km.')
    setError('')
    show({ area: circle(lat, lon, radius), label: `${point.lat.trim()}, ${point.lon.trim()}, radius ${point.radius.trim()} km`, point: { lat, lon, r: radius } }, undefined, true) // label is the typed text, so "38.0" stays "38.0"
  }

  return (
    <>
    <section aria-labelledby="area-heading">
      <h2 id="area-heading">Area</h2>
      <div className="presets">
        {PRESETS.map(p => (
          <button key={p.name} type="button" aria-pressed={preset === p.id} onClick={() => { show({ area: p.area, label: p.name, preset: p.id }); setPoint(EMPTY); setError('') }}>{p.name}</button>
        ))}
      </div>
      <div ref={box} className="map" role="region" aria-label="Map. Draw a polygon or rectangle with the tools at the top left, or use the form below." />
      {children}
    </section>
    {/* Its own card. Closed unless the address carries a point, so the answer comes sooner on a phone. */}
      <details className="point" open={!!initial?.point}>
      <summary>Or type a point</summary>
      <form onSubmit={submitPoint} noValidate>
        <label>Latitude <input inputMode="decimal" value={point.lat} onChange={e => setPoint({ ...point, lat: e.target.value })} aria-describedby="point-hint" /></label>
        <label>Longitude <input inputMode="decimal" value={point.lon} onChange={e => setPoint({ ...point, lon: e.target.value })} aria-describedby="point-hint" /></label>
        <label>Radius (km) <input aria-describedby="point-hint" inputMode="decimal" value={point.radius} onChange={e => setPoint({ ...point, radius: e.target.value })} /></label>
        <p className="hint" id="point-hint">For example latitude 38.9, longitude 23.25, radius 20 km. Draws a circle on the map.</p>
        <button type="submit">Use this point</button>
        {error && <p role="alert" className="error">{error}</p>}
      </form>
      </details>
    </>
  )
}
