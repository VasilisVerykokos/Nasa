<!-- AI note: drafted with Claude (Sonnet 5.5) on 14 Nov 2026 from MASTER-PLAN.md section 9.5 and web research. Person B reviews and redraws it on paper. -->

# HOTSPOT: screen wireframe and UI guide

For Person A (builds) and Person B (words, testing, simple parts). Layout comes from `MASTER-PLAN.md` section 9.5. Nothing here adds a feature: it only places the must-haves and says how to build them well.

Status: draft v1, Saturday 14 Nov. Person B draws it on paper (one sheet desktop, one sheet phone); Person A approves in five minutes before the skeleton. Photograph the paper: it is process evidence for the project page.

---

## 1. Desktop screen (view "Calendar"), 1280 px wide

```
+----------------------------------------------------------------------------------+
| HOTSPOT   [Calendar]  [Method and proof]                  Data through 12 Nov 2026|  <- header (DataStamp)
+----------------------------------------------------------------------------------+
| LEFT 40%  (map column)           | RIGHT 60%  (results column, scrolls)          |
|                                  |                                               |
| Area                             | +-------------------------------------------+ |
| [North Evia 2021][Evros 2023]    | | HEADLINE (HeadlineCard)                    | |
| [All Greece]       (presets)     | | "August 2021 was N times the normal       | |
|                                  | |  August here, the highest in 26 years."   | |
| +------------------------------+ | +-------------------------------------------+ |
| |                              | | +-------------------------------------------+ |
| |        MAP (MapLibre)        | | | THIS MONTH SO FAR (ThisMonthCard)         | |
| |   draw: [polygon][rectangle] | | | "November 2026, 12 days: X vs normal Y"   | |
| |   Greece outline shown       | | +-------------------------------------------+ |
| |   drawn area highlighted     | |                                               | |
| |                              | | Show: (o) Hotspots  ( ) Difference from normal | |
| +------------------------------+ | [ ] Raw sensors, not harmonized (should)      | |
|                                  | +-------------------------------------------+ |
| Or type a point                  | | CALENDAR HEATMAP                           | |
| Lat [      ] Lon [      ]        | |       Jan Feb Mar ... Dec | Year total     | |
| Radius [   ] km  [Use this]      | | 2001  .   .   .  ...  .   |   n           | |
|                                  | | 2002  ...                                  | |
| Date range                       | | ...                                        | |
| From [2000-11] To [2026-11]      | | 2026* ...  (* partial year)               | |
|                                  | | Normal year (median)  ...                  | |
| (message area: "No hotspots...", | | legend: colour ramp + "estimated before    | |
|  "Outside Greece")               | |  2012" pattern + "no data" grey pattern    | |
|                                  | | [Show as table]                            | |
|                                  | +-------------------------------------------+ |
|                                  | | RANKINGS (3 small columns)                 | |
|                                  | | Top 5 months | Top 5 years | Peak season   | |
|                                  | +-------------------------------------------+ |
|                                  | | EXPORT BAR                                 | |
|                                  | | [Calendar CSV][Calendar image][Hotspots CSV]| |
|                                  | | [Copy link] (should)                       | |
|                                  | +-------------------------------------------+ |
+----------------------------------------------------------------------------------+
| Footer: NASA FIRMS, Copernicus EMS, EFFIS, Natural Earth, OpenStreetMap | Apache-2.0 |
+----------------------------------------------------------------------------------+
```

Why the map is on the left and fixed: the map plus panel pattern works when each updates the other (choosing a month can later highlight the map), and the map column should stay in view while the results column scrolls. Keep the area controls under the map so one column means "where and when", the other "what we found".

Reading order (top to bottom of the right column) follows the judge's three questions: the sentence answers "how does this month compare", the calendar shows "which periods and years", rankings name them, exports let people take them away.

## 2. Phone screen (should-have 6), 375 px wide, one column

```
+---------------------------+
| HOTSPOT  [=] menu         |
| Data through 12 Nov 2026  |
+---------------------------+
| [North Evia][Evros][Greece]|  (horizontal scroll, presets)
| MAP (height 40% of screen)|
| [Draw] [Type lat/lon]     |
| From [   ] To [   ]       |
+---------------------------+
| HEADLINE sentence         |
| THIS MONTH SO FAR         |
| Hotspots | Difference     |
| CALENDAR (scrolls sideways|
|  inside its box; year col |
|  stays fixed) [Table]     |
| Rankings (stacked)        |
| Exports (full-width btns) |
+---------------------------+
```

Rules: design the phone first and widen it; the sentence comes before the calendar on the phone because it is readable without scrolling sideways; every touch target at least 44 x 44 px; hover information must also work by tap.

## 3. Method and proof view

```
+---------------------------------------------+
| Header (same)                               |
| 1. What HOTSPOT does (3 lines)              |
| 2. How the harmonization works (plain words)|
| 3. The five proofs: chart + caption each    |
| 4. Limits (bullet list, honest)             |
| 5. Why now (S-NPP ended 2 Nov 2026 ...)     |
| 6. Use our data (calendar function note)    |
| 7. References and attribution               |
+---------------------------------------------+
```

## 4. Component list with states (what A builds, what B can take)

| Component | Default | Loading | Empty or error | Owner |
|---|---|---|---|---|
| AreaPicker | North Evia preset selected | map skeleton (grey box with "Loading map") | tiles fail: fall back to OSM tiles (plan section 15) | A |
| DateRange | whole record | n/a | "From" after "To": inline message, no request sent | B (later) |
| HeadlineCard | sentence | grey text bar | normal below 5: "8 against a normal of 2", never "4 times" | B |
| ThisMonthCard | "so far" label | grey bar | API failed: shows last complete month and says so | B |
| CalendarHeatmap | filled | skeleton grid of grey cells with the same size, so nothing jumps | "No hotspots found in this area in 26 years" | A |
| Rankings | 3 lists | 5 grey lines each | hidden if no data | B |
| ExportBar | 3 buttons | button shows "Preparing..." and is disabled | hotspots CSV above 200,000 rows: message "Narrow the area or dates" | B |
| DataStamp | "Data through [date], updated daily" | n/a | date unknown: "Data date unavailable" | B |
| Messages | hidden | n/a | "This area is outside the covered region (Greece)" | B |

Global rule from the plan: the page starts from the saved North Evia example and then refreshes. It never shows an empty screen or a raw error. Show the old content with a thin "Updating..." line instead of blanking it.

## 5. Best practices (sourced, applied to this project)

**Layout and map**
1. Map and panel support each other: the map gives place, the panel gives numbers and actions. Choosing a month should update the map (should-have 3), and presets update both. Source: Admiralty "Find a location" pattern.
2. Keep one main action per area: draw, or type coordinates. Present them as two clear routes to the same result.
3. A collapsing layout must not hide anything critical: on the phone the results stay reachable below the map. Source: Admiralty pattern.
4. Interactive maps are not accessible by default. The latitude, longitude, radius form is the non-mouse route and the calendar table view is the text route. Say this in the method page.
5. Use landmarks: `header`, `main`, `aside` (map column), `section` with a heading for each card. Give the map region and result updates an accessible label, and announce a result change with `aria-live="polite"` ("Calendar updated for North Evia").
6. After a preset or draw, do not steal keyboard focus; after an error message appears, move focus to it.

**Calendar heatmap (the key picture)**
7. Colour-blind safe ramp (viridis or cividis) for counts, blue to orange for the difference view. The plan already fixes this. Source: Visa and NHS Scotland data visualisation guidance.
8. Colour is never the only signal. Cells carry numbers on hover and on keyboard focus; estimated years (before 2012) and no-data cells carry a pattern, not only a shade. Test by viewing a screenshot in greyscale.
9. Tooltips must work on focus and on tap, not only hover; Esc closes them. Give each cell an accessible name such as "August 2021, 14,203 hotspots, estimated" so a screen reader needs no tooltip.
10. Provide a real table ("Show as table"), reachable by keyboard. It also helps B check numbers.
11. Square-root colour scale, with the legend showing real values, because a few months are 10 to 50 times the typical one (plan section 9.5).
12. Fixed cell size and a pinned year column; the grid must not change size when data loads.

**Words and trust**
13. Plain language, short sentences, no jargon: write "hotspot" once with a one-line meaning ("a spot a satellite saw as hot, usually a fire"). B owns all text.
14. Show the arithmetic on hover ("412 detections x 3.4 = 1,401, range 1,250 to 1,640"). Estimated months are labelled as estimates.
15. Honest numbers: normal below 5 shows two plain numbers; 2000 and 2026 are left out of yearly rankings; the current month says "so far".
16. Every button names its result: "Download calendar (CSV)", not "Export".

**States and speed**
17. Design four states for every component: default, loading, empty, error (section 4). Skeletons that match the final size avoid layout jumps.
18. One `calendar` call per area change. Debounce the typed latitude, longitude and radius so a request is sent when typing stops (about 500 ms), not on every key.
19. Disable a button while its job runs, and say what is happening.

**Responsive**
20. Mobile first. Check three widths: 375, 768, 1280. Settle early that the layout is one fluid design with one change point (stack below about 900 px), not three separate designs.
21. Minimum text 16 px on the phone; touch targets at least 44 x 44 px; no horizontal page scroll (the calendar scrolls inside its own box).

**Visual design (decisions 9 and 10 are still open)**
22. Calm, neutral surface (light grey or white, or dark) so the heatmap colours carry all the attention. One accent colour for buttons and focus rings.
23. Contrast: normal text at least 4.5 to 1, large text and interface borders at least 3 to 1 (WCAG 2.2 AA). Visible focus ring on every control.
24. Two fonts at most, one size scale (for example 14, 16, 20, 28), one spacing scale (4, 8, 16, 24, 32 px). Name these as variables once (CSS variables or Tailwind theme) so A and B never invent values.
25. No NASA logos (competition rule, plan section 1). Attribution lives in the footer and method page.

**Working together on the UI**
26. Each component is one small file that receives ready numbers as props and displays them. B's parts must not call the database or compute statistics: those live in `stats` and A's code.
27. A builds the skeleton and one worked example first; B copies that pattern. B does not edit a file A is working on without asking.
28. Annotate the paper wireframe with behaviour, not decoration: what happens on click, on hover, while loading, on error. Annotations are the handoff.
29. Review in the browser at 375 and 1280, with the keyboard only (Tab through everything), and in greyscale. Log every finding in the feedback log.
30. Five-minute test with an outsider: give them one task ("Find which August was worst in North Evia") and watch without helping. Write down where they stop.

## 6. Annotation sheet for the paper wireframe (copy onto the paper)

Number each box on the drawing and write these notes beside it:

1. Presets: click selects area, calendar reloads, map zooms to the area.
2. Map: draw polygon or rectangle; one shape at a time; drawing again replaces the old one.
3. Lat/lon/radius: "Use this" draws a circle on the map; invalid values show a message under the field.
4. Date range: changes what the screen shows; the calendar always loads the whole record.
5. Headline: updates for the clicked or latest full month.
6. Heatmap: click a cell selects the month (headline updates); hover or focus shows number and arithmetic.
7. Table toggle: swaps heatmap for a table, same numbers.
8. Exports: three files named with the area and dates.
9. Messages: "no hotspots", "outside Greece", "network problem, showing saved example".

## 7. Sources

- [Admiralty design system, Find a location pattern](https://designsystem.admiralty.co.uk/patterns/find-a-location)
- [UXPin, Map UI layouts and design tips](https://www.uxpin.com/studio/blog/map-ui)
- [ArcGIS JavaScript, creating app layouts](https://developers.arcgis.com/javascript/latest/creating-app-layouts/)
- [Visa design system, heatmap accessibility](https://design.visa.com/data-visualization/charts/heatmap/accessibility/)
- [NHS Scotland Turas design system, accessible data visualisation](https://www.turasdesignsystem.nhs.scot/design/data-visualisation/accessible-data/)
- [Smashing Magazine, accessibility standards and chart design](https://www.smashingmagazine.com/2024/02/accessibility-standards-empower-better-chart-visual-design)
- [Smashing Magazine, Wireframing: the perfectionist's guide](https://www.smashingmagazine.com/2016/11/wireframe-perfectionist-guide/)
- [Decode, wireframe annotations guide](https://decode.agency/article/wireframe-annotations)
- [Adobe XD, common wireframing issues to avoid](https://xd.adobe.com/ideas/process/wireframing/common-wireframing-issues-to-avoid)

Items 20 to 24 (breakpoints, font sizes, spacing scale, WCAG 2.2 AA contrast thresholds) are standard practice and WCAG numbers from general knowledge, not from a specific page above.
