// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. The lines under the map: the clicked month's dots (should-have 3) and the coverage outline (should-have 8).
import { useRef } from 'react'
import { POINT_CAP } from '../api/points'
import { MONTH_NAMES, sensorOf } from '../lib/heatmap'

type Month = { year: number; month: number }
/** dots: null while loading, 'failed', or the number of dots drawn and whether month_points hit its row limit. */
type Props = { month: Month | null; dots: null | 'failed' | { count: number; capped: boolean }; outline: boolean; onClear: () => void }

export const PICK_HINT = 'Click a month on the calendar to see its hotspots on this map.'
export const OUTLINE_LINE = 'Outline: the area HOTSPOT covers (Greece).'
export const failedLine = (when: string) => `The hotspots of ${when} could not be loaded. Try again in a minute.`

export default function MapLegend({ month, dots, outline, onClear }: Props) {
  const line = useRef<HTMLParagraphElement>(null)
  const when = month && `${MONTH_NAMES[month.month - 1]} ${month.year}`
  return (
    <div className="map-legend">
      {/* role="status": a new month, its count or its failure is read out by screen readers. */}
      <p role="status" ref={line} tabIndex={-1}>
        {!month ? PICK_HINT
          : dots === null ? `Loading the hotspots of ${when}…`
          : dots === 'failed' ? failedLine(when!)
          : `${dots.count.toLocaleString('en-US')} hotspot${dots.count === 1 ? '' : 's'} in ${when}. Each dot is one ${sensorOf(month.year, month.month) === 'modis' ? 'MODIS' : 'VIIRS'} detection, all the same size (not weighted). Dots before February 2012 are MODIS, later ones VIIRS.${dots.capped ? ` The map limit of ${POINT_CAP.toLocaleString('en-US')} rows was reached, so some hotspots are missing.` : ''}`}
      </p>
      {/* Focus goes to the line above, so it is not lost when the button disappears. */}
      {month && <button type="button" onClick={() => { onClear(); line.current?.focus() }}>Clear month</button>}
      {outline && <p className="hint">{OUTLINE_LINE}</p>}
    </div>
  )
}
