// AI note: written with Claude Code (Claude Opus 5.5), reviewed by the team. Messages (must-have 8): what the page says instead of a calendar.

export function OutsideGreece() {
  return <p role="alert">This area is outside the covered region. HOTSPOT covers Greece only. Pick a preset or draw inside Greece.</p>
}

export function NoHotspots() {
  // The coverage check is a wide box, so a place just outside Greece (for example İzmir) can land here: say so instead of only "larger area".
  return <p>No hotspots were found in this area from November 2000 to today. Try a larger area. HOTSPOT covers Greece only, so places outside Greece show no hotspots.</p>
}

// The full wording adds "so you are looking at the saved North Evia example". That part waits for the saved example.
export function Unreachable({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert">
      <p>We could not reach the database. Try again in a minute.</p>
      <button type="button" onClick={onRetry}>Try again</button>
    </div>
  )
}

/** The database's own messages are already written for people (for example a shape with too many corners), so they are shown as they are. */
export function DatabaseMessage({ text }: { text: string }) {
  return <p role="alert">{text}</p>
}
