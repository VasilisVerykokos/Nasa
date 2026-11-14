<!-- AI note: drafted with Claude Code (Claude Opus 5.5) on 14 Nov 2026 from "HOTSPOT Mockup.pdf", the earlier limits.md draft and MASTER-PLAN.md sections 4, 5 and 12, checked against verified-facts.md and the decision log. Person B owns the words. -->

# HOTSPOT: text of the "Method and proof" page

For Person A. Sections in the order of the page. `{slot: file}` means the number is read from that proof file, which a script in the repository wrote. Do not type those numbers into the page by hand. Every other number here is a VERIFIED fact from `verified-facts.md`.

---

## On this page

1. What HOTSPOT does
2. How the harmonization works
3. The five proofs
4. Limits
5. What it can and cannot answer
6. Why now
7. Use our data
8. References and attribution

## 1. What HOTSPOT does

HOTSPOT puts two satellite fire records on one calendar for Greece, from November 2000 to this week. A hotspot is a spot a satellite saw as hot, usually a fire.

Pick an area and you see every month as a coloured cell, the normal year beside it, and a plain sentence for any month you press.

Every number can be opened to show how it was made.

HOTSPOT stands for Harmonized Observations of Thermal Sensors for Pyro-Occurrence Trends.

## 2. How the harmonization works

**The problem.** NASA has watched for fires from space with two kinds of instrument. MODIS has flown since 2000 and sees the ground in squares about 1 km wide. VIIRS has flown since 2012 and sees squares of 375 m. They differ in three ways:

- **Resolution.** One fire covers more small squares than large ones, so VIIRS reports more hotspots for the same fire.
- **Sensitivity.** VIIRS also notices small or cool fires that MODIS never sees at all. `{Keep this sentence only if proof 7 is published as a script:}` Our grid test shows this is the larger part of the difference.
- **Observation schedule.** The satellites pass over Greece at different times of day.

Put the two lists side by side and the count jumps in 2012, even though nothing changed on the ground. Our goal, in NASA's words: "the sensor of origin no longer matters".

**What we do, step by step.**

1. **Clean.** We keep vegetation fires only, which includes agricultural burns, because the challenge counts them as burning activity. We remove volcanoes, factories and gas flares: a factory that is hot every day would hide the fire signal. We also drop detections the satellite itself marks as low confidence.
2. **One instrument at a time.** Two VIIRS satellites fly the same orbit minutes apart and see the same fire, so adding them would count it twice. Terra and Aqua both carry MODIS but pass at different hours, so each pass is a new look: we add those two. What must stay the same across 26 years is the number of looks per day.
3. **Measure the factor.** From February 2012 to December 2019 both instruments flew and the MODIS satellites still kept their usual times. Over those years we count how many VIIRS hotspots there are for each MODIS hotspot. We measure it separately by day and by night, and for the fire season (June to September) and the rest of the year, because MODIS misses small burns more often than large summer fires. Before July 2002 only Terra flew, so that period has its own factors. Factors: `{slot: factors.json}`.
4. **Convert.** Every MODIS detection before February 2012 gets a weight equal to its factor. A month's value is the sum of the weights. The result is measured by MODIS, converted to VIIRS units.
5. **Join the two VIIRS satellites.** S-NPP stopped on 2 November 2026, so the record ends on NOAA-20. A second, small factor joins them, measured the same way on 2019 to 2025: `{slot: factors.json, F2}`.
6. **Give a range.** We tested the method blind (proof 2). The size of its miss becomes the range on every estimate: ±`{slot: proof2_blind_test.json, fire-season error}`%.

The unit of the whole record is the **NOAA-20-equivalent hotspot**: what NOAA-20 would have counted.

**Show the arithmetic.** On the calendar, hover, focus or tap an estimated month to see the MODIS detections, the conversion, the result and its range. A measured month says which satellite counted it.

**Where the estimate matters.** Comparing two months inside the MODIS years (August 2007 against August 2005) barely depends on the factor, because both are scaled by nearly the same number. The uncertainty matters when you compare across the join, for example 2007 against 2021.

## 3. The five proofs

A method that scales old counts needs evidence that it works. Each proof is a chart made by a script in the project, with a caption that says what to look for.

**1. Before and after: yearly totals, plain merge against harmonized.**
What to look for: the plain merge jumps in 2012. The harmonized line does not.

**2. Blind test: predict years the method never saw.**
What to look for: we fit the factor on 2012 to 2016, predict 2017 to 2019 from MODIS alone, and compare with what VIIRS really counted. The gap is the error: `{slot: proof2_blind_test.json}` for whole years, for fire-season months, and for single 1° squares.

**3. Two real fires, day by day, against Copernicus maps.**
What to look for: Evros grew from 8,529 ha to 72,344 ha between 21 and 23 August 2023. North Evia grew from 7,313 ha to 50,909 ha between 5 and 11 August 2021. The hotspot count should rise with them.

**4. Yearly hotspots against EFFIS burned area, 2006 to 2025.**
What to look for: an independent European record tests the estimates before 2012. 2007, the worst year at 271,715 ha, lies in the MODIS-only years. Hotspots are not burned area, so the match is not expected to be perfect.

**5. The last join: NOAA-20 against S-NPP, monthly, 2019 to 2025.**
What to look for: the two lines should sit on each other. If they do, the join between the two VIIRS satellites is clean.

*Two optional checks (only if their scripts are finished): how often both instruments see the same fire when they pass minutes apart, and why putting both on a common grid does not remove the difference.*

## 4. Limits

- **A hotspot is not a fire.** It is the centre of a pixel that a satellite flagged as hot. We know a fire burns somewhere inside that pixel, not exactly where.
- **Hotspots are not burned area.** A fast fire can burn a large area between two satellite passes. NASA itself does not recommend using hotspots to estimate burned area.
- **Before 2012 the values are estimates.** Small or cool fires that MODIS never saw cannot be recovered. The factor corrects the average, not each fire. Estimated months carry a hatch pattern and a range.
- **The factor is an average.** It differs between day and night, between seasons and from year to year. An area dominated by one kind of fire, such as small agricultural burns, is corrected less exactly.
- **Small areas are less certain than large ones.** The factor is measured on all of Greece. For a small area the blind test misses by more than for the whole country.
- **Satellites pass at fixed times.** MODIS and VIIRS look at different times of day, so they can see different stages of the same fire.
- **Clouds and thick smoke hide fires** from both instruments. Short satellite outages are not corrected.
- **The newest months are provisional.** They use near-real-time data until NASA releases the final data, about five months later.
- **Partial years.** 2000 and 2026 are left out of yearly rankings, and the current month is marked "so far".
- **Small numbers.** When the normal is below 5 we show two plain numbers and no "times normal", because small numbers are noise.
- **Greece only.** An area outside Greece shows a message, not a calendar.
- **Drawing needs a mouse.** The latitude, longitude and radius form and the table view work without one.

## 5. What it can and cannot answer

| Question | Answer |
|---|---|
| Was August 2007 worse than August 2021 in Greece? | Yes, with a range |
| Which months usually burn most in a region? | Yes |
| Where exactly did a small fire burn in 2005? | No. Fires MODIS missed cannot be placed on a map. |
| How many hotspots did one village have in one month of 2003? | Unreliable. The factor is an average and does not hold for very small areas or counts. |

HOTSPOT corrects totals, not single fires. The challenge asks for the first kind of question: months and years against the normal.

## 6. Why now

The satellites behind the record are changing. Suomi NPP stopped delivering fire data on 2 November 2026. Terra and Aqua made their last orbit corrections on 27 February 2020 and 8 March 2021, and have been drifting away from their usual passing times since then.

Every long fire record that relies on MODIS must now be joined to VIIRS, or it stops. Without that join, the count jumps in 2012, and comparing a year from the 2000s with this year means comparing two different instruments. HOTSPOT makes the join, measures how well it works, and ends its record on NOAA-20, which continues to fly.

## 7. Use our data

The calendar that drives the screen is a function anyone can call for any area in Greece.

- **Address:** `{Person A: https://<project>.supabase.co/rest/v1/rpc/calendar}`
- **Send:** a POST request with the header `apikey: {public key}` and the body `{"area": <a GeoJSON polygon, longitude then latitude>}`. At most 500 corner points.
- **You get back:** one row per year and month of the whole record, with the harmonized value and the raw counts of each satellite.
- **Limits:** Greece only; 10 seconds per request. The same numbers come as files from the three download buttons on the Calendar view.
- **The full dataset:** `{Dataset release link: added on Sunday}`

## 8. References and attribution

**Data**

- Fire detections: NASA FIRMS (MODIS Collection 6.1, VIIRS S-NPP and NOAA-20 375 m).
- Burned-area maps of two fires: Copernicus Emergency Management Service, activations EMSR527 (Evia, 2021) and EMSR686 (Evros, 2023).
- Yearly burned area for Greece: EFFIS, the European Forest Fire Information System.
- Greece outline: Natural Earth. Base map: © OpenStreetMap contributors.

**Papers**

- Giglio, Schroeder and Justice (2016). The collection 6 MODIS active fire detection algorithm and fire products. *Remote Sensing of Environment* 178, 31–41. doi:10.1016/j.rse.2016.02.054
- Schroeder, Oliva, Giglio and Csiszar (2014). The New VIIRS 375 m active fire detection data product. *Remote Sensing of Environment* 143, 85–96. doi:10.1016/j.rse.2013.12.008
- Li, Zhang, Kondragunta et al. (2018). Comparison of fire radiative power estimates from VIIRS and MODIS observations. *JGR Atmospheres* 123, 4545–4563. doi:10.1029/2017JD027823
- Kaur, Hüser, Zhang, Gehrke and Kaiser (2019). Correcting swath-dependent bias of MODIS FRP observations with quantile mapping. *Remote Sensing* 11, 1205. doi:10.3390/rs11101205

The full list, with every library and service the project uses, is in `REFERENCES.md` in the repository. HOTSPOT is open source under the Apache-2.0 licence and is not endorsed by NASA.
