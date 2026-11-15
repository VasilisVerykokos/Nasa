<!--
AI note: written with Claude Code (Claude Opus 5.5) for Person B on 15 Nov 2026, building on Person B's fact-checked draft, from MASTER-PLAN.md,
PROJECT-PAGE-CHOICES.md, verified-facts.md (VERIFIED facts only), README.md, hotspot/DATASET.md and the files in hotspot/web/public/proof/.
The team edits, checks and owns the final text. Every number's source is listed in the session notes, not on the page.
No open markers. No screenshots and no video: team decision on Sun 15 Nov, 13:55, because the pitch is given live.
-->

# HOTSPOT

*Harmonized Observations of Thermal Sensors for Pyro-Occurrence Trends*

## Summary

**HOTSPOT (https://hotspots.gr) turns NASA's two satellite fire records into one, and answers a question nobody could before: August 2007 had about 11,606 hotspots on the VIIRS scale (range 8,554 to 14,659), more than August 2021 (6,893) or August 2023 (5,736). MODIS counted 2007. VIIRS, which finds about 3.4 times as many hotspots, counted the later years, so simply adding the two fakes a jump: Greece goes from 2,524 hotspots in 2011 to 9,245 in 2012. With S-NPP stopped (2 November 2026) and MODIS drifting, HOTSPOT gives every Greek fire detection since November 2000 a measured weight. Pick any area and dates for a month-by-year calendar against normal. Tested blind: whole years within 7.8%.**

- **Live app:** https://hotspots.gr
- **Method and proof inside the app:** https://hotspots.gr/#method
- **Code (Apache-2.0):** https://github.com/VasilisVerykokos/Nasa
- **Open dataset:** https://github.com/VasilisVerykokos/Nasa/releases/tag/dataset-v1

---

## The challenge

### The problem

A fire hotspot is the centre of a satellite pixel that NASA's fire algorithm flagged as burning. NASA FIRMS has published hotspots since November 2000, from two kinds of instrument:

| Instrument | Satellites | Pixel | Period in our record |
|---|---|---|---|
| MODIS | Terra, and Aqua from July 2002 | 1 km | November 2000 to January 2012 |
| VIIRS | S-NPP, then NOAA-20 | 375 m | S-NPP February 2012 to December 2018, NOAA-20 from January 2019 to today |

NASA's challenge names three ways the instruments differ: **spatial resolution, sensitivity, and observation schedule**. Together they make VIIRS report far more hotspots than MODIS for the same fires. Over February 2012 to December 2019, S-NPP recorded 37,448 hotspots in Greece and MODIS recorded 10,978, a ratio of 3.41.

So any fire record that runs across 2012 breaks. Add the sensors together and 2012 looks like a disaster year when only the instrument changed (image 1). Use MODIS alone and you throw away the detail VIIRS adds. Use VIIRS alone and you lose the twelve years before 2012, including 2007, the worst fire year in Greece's EFFIS record (271,715 ha burned).

The challenge's goal, in NASA's words: by the end, **"the sensor of origin no longer matters"**.

### Who needs it, and what they ask

We started from two users, both in the audience the challenge names (early warning and emergency responders, scientists, land managers, and firefighters):

| Who | What matters to them | What they need |
|---|---|---|
| Rescuers and emergency responders | Preparing for the dangerous months and reducing the risk | Their own area compared with its history, in under a minute |
| Research teams and environmental scientists | Reliable data for research and applications | A consistent, documented record they can download and build on |

Their need in one sentence: **compare fire activity in their own area with its history**. Today the record is split between sensors that cannot be compared, and the older ones are going.

| They ask | HOTSPOT answers with |
|---|---|
| "Is this month unusual here?" | A "this month so far" card and a "difference from normal" view of the calendar |
| "When is the dangerous season here?" | The "normal year" row of the calendar and the peak season in words |
| "How does this fire compare with the worst on record here?" | One harmonized record from 2000, the top months and years, and our finding about 2007 |
| "Can I trust this number?" | Hover any month to see how its number was made. Seven proofs and the limits are on this page and in the app. |
| "Will it still work next year?" | The record ends on NOAA-20, which is still flying |
| "Can I put it in my report?" | Downloads: the calendar as CSV and as an image, the hotspots as CSV |
| "My area, not the whole country" | Draw any shape, or type a point and a radius |
| "Can I use the data in my own research?" | The open dataset with a weight on every hotspot, an open web address, and open code |

### Why now

- **S-NPP, the first VIIRS satellite, stopped delivering data on 2 November 2026.** A record built on it has to continue on NOAA-20. That is why NOAA-20 is the unit of our record.
- **The MODIS satellites are drifting.** Terra made its final orbit correction on 27 February 2020 and Aqua on 8 March 2021. They now pass at a different time of day than they used to, so their newest data no longer match their own past.
- **The overlap years will not come back.** MODIS and VIIRS both flew from 2012, and the years before MODIS drifted are the only chance to measure one against the other. HOTSPOT measures that now and builds the record on it.

---

## The solution

### What it does

Everything in this table is live at https://hotspots.gr.

| The challenge asks for | HOTSPOT |
|---|---|
| "a map where users can draw the area of interest, or an option to enter latitude and longitude" | Both. Draw a rectangle or a polygon, or type latitude, longitude and a radius. Presets: North Evia 2021, Evros 2023, All Greece. |
| "select a region and a specific date range" | "From" and "To" dates. The range picks which years the calendar shows and which hotspots the CSV holds. "Normal" always uses the whole record, so moving the dates never changes the baseline. |
| Hotspots "from the early 2000s to the present" | A calendar heatmap of years × months, from November 2000 to the newest day NASA has published. The newest months are marked provisional. A data stamp shows the date the data runs to. |
| "which periods of the year see more fires" | A "normal year" row (the median of each calendar month) and the peak season in words. A seasonal chart sets the normal year against any chosen year. |
| "which years had more burning activity" | A total for each year, the top 5 years and months, and a yearly bar chart with a standard trend test (Mann-Kendall with Sen's slope, 5% level). For All Greece and for North Evia it finds no clear trend from 2001 to 2025, and the app says so. |
| "compare the burning activity of the current month against the historical median" | A plain headline sentence for any month you click, and a "this month so far" card. The card compares the first days of the current month with the median of the same days in earlier years, not with a whole month. |
| "unusual conditions"; "anomalies against multi-year averages" | A "difference from normal" view: each month minus the median of that calendar month. The calendar CSV carries the median and the mean of every calendar month. |
| "accessible color ramps" | ColorBrewer's YlOrRd ramp, which ColorBrewer lists as colour-blind safe. Estimated, provisional and missing months are marked with patterns as well as colour. Every cell shows its number on hover, keyboard focus (arrow keys) or tap. "Show as table" turns the calendar into a table a screen reader can read. |
| "download analytics and visualizations" | The calendar as CSV and as an image (PNG) |
| "A downloadable CSV File of hot spots detected during a search" | Every hotspot in the area and date range, with all its columns and its harmonization weight |

The app also has:

- **A raw-versus-harmonized switch.** It shows the fake 2012 jump for the user's own area, then removes it (image 1).
- **Click a month to see its hotspots on the map.** The dots are the detections behind that month's number (image 5).
- **The outline of the covered area** on the map, and plain messages when an area is outside Greece, has no hotspots, or the connection is lost (with a "Try again" button).
- **A share link.** The area and dates are kept in the web address, and a "Copy link" button copies it.
- **A phone layout and keyboard access** throughout.
- **A "Method and proof" page** with the method, every proof as a chart with "Show as table", and the limits.

The headline sentence for North Evia (official Copernicus area, EMSR527) reads: **"August 2021 had 3,252 hotspots here, where a normal August has none; the highest August in 26 years."** When the normal is under 5 hotspots, HOTSPOT shows the two plain numbers and no "N times normal", so tiny baselines never produce dramatic ratios.

### How it works

**1. Clean.** We keep vegetation fires (FIRMS `type = 0`), which include agricultural burns, because the challenge counts them as burning activity. We remove fixed heat sources such as factories, because a site that is hot every day would hide the fire signal. That is our choice, and the method page says so. We also drop low-confidence detections. For MODIS that is exactly the official "low" class, below 30 (MODIS user's guide, table 11).

**2. Never add satellites that see the same thing.** The number of looks per day must stay constant across the record. Terra and Aqua pass at different times of day, so each pass is a new look, and we add them. S-NPP and NOAA-20 see nearly the same fires (over 2019 to 2025, NOAA-20 recorded 37,673 hotspots and S-NPP 36,168), so adding them would count most fires twice. We use one at a time.

**3. Measure the MODIS-to-VIIRS factor ourselves.** We compare S-NPP with MODIS over February 2012 to December 2019. Both flew in those years, and MODIS still kept its usual schedule. The factor is measured separately for day and night and for the fire season (June to September) against the rest of the year. A season-and-day/night cell with fewer than 100 MODIS detections uses a pooled factor instead.

| S-NPP hotspots per MODIS hotspot | Fire season, day | Fire season, night | Rest of year, day | Rest of year, night |
|---|---|---|---|---|
| Terra + Aqua (from July 2002) | 2.63 | 4.96 | 3.36 | 11.52 |
| Terra only (before July 2002) | 5.83 | 8.13 | 9.20 | 9.13 (pooled: only 83 detections) |

Before July 2002 only Terra flew, so that period has its own, larger factor. Most teams would miss this.

**4. Link S-NPP to NOAA-20.** Over 2019 to 2025, NOAA-20 recorded 1.04 hotspots for every S-NPP hotspot (37,673 against 36,168).

**5. Give every hotspot a weight.** The unit of the record is the **NOAA-20-equivalent hotspot**. A month's value is the sum of the weights inside the chosen area.

| Period | Source | Weight per hotspot |
|---|---|---|
| Nov 2000 to Jun 2002 | MODIS, Terra only | Terra-only factor × 1.04 |
| Jul 2002 to Jan 2012 | MODIS, Terra + Aqua | Terra + Aqua factor × 1.04 |
| Feb 2012 to Dec 2018 | VIIRS S-NPP | 1.04 |
| Jan 2019 to today | VIIRS NOAA-20 | 1 |

The weight sits on each hotspot, so any shape a user draws is summed exactly, and every download is itself harmonized data. Detections outside their sensor's period stay in the data with weight 0. They feed the raw view and the proofs.

**Measured by MODIS, converted to VIIRS units.** Values before February 2012 are real MODIS measurements. Only their conversion is estimated, so they carry a range of ±26.3%: the blind-test error on fire-season months (proof 2). Comparisons inside the MODIS years barely depend on the factor, because both months are multiplied by nearly the same number. The uncertainty matters for comparisons across the 2012 join.

**Show the arithmetic.** Hover or focus any estimated month and HOTSPOT shows where its number came from. For August 2007 in All Greece: *"Measured by MODIS, converted to VIIRS units: 3,052 MODIS detections × 3.80 = 11,606 (range 8,554 to 14,659)."* A NOAA-20 month says it was measured directly. Every number on the screen traces back to NASA's detections.

### Options we weighed

| Question | Options | Chosen | Why |
|---|---|---|---|
| How to make the sensors comparable | Add them; count grid cells instead of hotspots; a factor measured on the shared years | The factor | Adding fakes a 4.5× jump in 2012 (2,037 MODIS hotspots against 9,245 added up). A common grid only lowers the ratio from 3.41 to 2.62–2.87, whatever the cell size (proof 7). |
| Which years to fit on | All shared years; 2012 to 2019 | 2012 to 2019 | The MODIS orbits drift after the 2020 and 2021 corrections |
| One factor, or several | One for the year; day and night; day and night by season | Day and night by season | It gave the smallest error in the blind test, so we kept it |
| Which VIIRS product | 375 m; 750 m | 375 m | FIRMS distributes the 375 m product, which sees smaller fires, and the challenge asks for VIIRS's greater detail. The 750 m product, built for continuity with MODIS, would still need a factor. It is a next step. |
| Unit of the record | MODIS-equivalent; NOAA-20-equivalent | NOAA-20-equivalent | It is the instrument that continues |
| Where the correction lives | Corrected totals on a coarse grid; a weight on every hotspot | A weight on every hotspot | Any drawn shape is exact, and the download is harmonized data |
| What "normal" means | Mean; median | Median, with the mean in the CSV | One extreme year should not move "normal" |
| Coverage | The whole world; one country done fully | Greece | A complete small tool beats a half-working large one |

### Proof

Every number below was written by a script in the repository into `hotspot/web/public/proof/`. The app's method page draws each one as a chart. The last column says how much each proof is worth.

| # | Test | Result | How strong |
|---|---|---|---|
| 1 | **Before and after:** sensors simply added against the harmonized record, Greece, 2000 to 2025 | Added up, 2011 → 2012 goes from 2,524 to 9,245. Harmonized: 8,789 → 7,494. At the 2012 join, MODIS converted gives 7,289 and S-NPP converted 7,508. At the 2019 join, S-NPP converted gives 3,618 and NOAA-20 counted 3,658. | Shows the jump is gone. The factors were fitted on these years, so it shows consistency, not prediction. |
| 2 | **Blind test:** fit the factor on 2012 to 2016 only, predict 2017 to 2019 from MODIS alone, compare with what VIIRS really counted | Whole years: off by 7.8% on average (+11.2% in 2017, −3.0% in 2018, −9.3% in 2019). Fire-season months: 26.3% on average, worst 55.3%. Single 1° squares: 26.3% (32 square-years). | **Our strongest proof:** a real prediction on years the fit never saw. Weak points: only three test years, and 11 of the 12 summer months were over-predicted, so estimates before 2012 may lean high in summer. |
| 3 | **Two real fires,** day by day, against the Copernicus burned-area maps | Evros 2023: 1,061 hotspots up to the 21 August map (8,529 ha), then 1,863 more by the 23 August map (72,344 ha); the peak day was 22 August (1,410). North Evia 2021: 1,117 hotspots up to the 5 August map (7,313 ha), then 2,134 more by the 11 August map (50,909 ha); peak 5 August (752). | Timing only: the hotspots rise with the mapped growth. Hotspots are not burned area, and North Evia was mapped only twice. |
| 4 | **Against an independent record:** harmonized yearly hotspots against EFFIS burned area for Greece, 2006 to 2025 | Rank correlation 0.70 (Pearson 0.89). Both put 2007 first: 22,224 harmonized hotspots, 271,715 ha. | The only independent check of the years before 2012. Moderate: hotspots are not burned area, and the big years 2007, 2021 and 2023 pull Pearson up. 2021 and 2023 swap places between the two records. |
| 5 | **The last join:** NOAA-20 against S-NPP × 1.04, month by month, 2019 to 2025 | Correlation 0.998 over 84 months. For example, August 2021: 6,893 against 6,982. | Strong for month-to-month agreement. The 1.04 was fitted on the same years, so this does not test its size. |
| 6 | **What the factor is made of:** Aqua against S-NPP on 147 days when they passed within 5 minutes of each other | Aqua saw only 22.1% of the 0.1° cells where S-NPP saw fire: sensitivity, the large part. Where both saw fire, S-NPP gave 2.83 pixels per Aqua pixel: resolution, the small part. | Explains the factor; does not measure its size. On these passes S-NPP saw 4.39 times Aqua, against 6.03 over all passes, because a pass where only VIIRS saw fire leaves no MODIS row. Aqua only, no large fires in the sample, 147 days in eight years. |
| 7 | **The obvious alternative,** a common grid, February 2012 to December 2019 | As hotspots the ratio is 3.41. As grid cells with fire per day it is 2.62 to 2.87, for cells of about 1 to 28 km. Only 8.8% to 20.4% of VIIRS fire cells were also seen by MODIS. | Rules out the grid. It cannot bring back fires MODIS never saw. |

### Limits

- Values before February 2012 are estimates (±26.3% per month). Small or cool fires that MODIS never saw cannot be recovered. The factor corrects totals, not single fires.
- The blind test over-predicted most summer months, so summer estimates before 2012 may lean high.
- The factor is an average over fire types. An area dominated by one type, such as small agricultural burns, is corrected less exactly.
- A small area varies more than the whole country: 26.3% blind-test error for single 1° squares.
- The first year is shaky. 2001 reads high (14,813), mostly from autumn burning seen by Terra alone and multiplied by the large Terra-only factors. We make no claim that 2001 was worse than any other year.
- MODIS and VIIRS pass at different times of day. Clouds and thick smoke hide fires from both. Short satellite outages are not corrected.
- A hotspot is the centre of a flagged pixel, not the exact position of a fire. Hotspots are not burned area: NASA does not recommend them for estimating it, and a fast fire can burn a lot between two passes.
- The newest months are provisional until NASA releases its standard data (about 5 months later).
- Greece only.

| A user asks | Can HOTSPOT answer? |
|---|---|
| Was August 2007 worse than August 2021 in Greece? | Yes, with a range |
| Which months normally have the most activity in a region? | Yes |
| Where exactly did a small fire burn in 2005? | No: fires MODIS missed are unknown |
| How many hotspots did one village have in one month of 2003? | Not reliably: the factor is an average |

### Kept running in the real world

- **Daily update.** A GitHub Actions job asks NASA's FIRMS Area API for 2026 every day, cleans it like the archive years and replaces the 2026 rows in one step. On 15 November 2026 the record ran through **15 November 2026**.
- **Robust by design.** The proof charts are files inside the website, so the method page works even if the database is down. Visitors can call only the app's read functions, never the tables.
- **The rebuild works.** We followed the README's rebuild steps from a fresh copy of the repository. The tests, the proofs and the dataset export ran as written, and one missing install item we found was fixed in the README. The tests run again on every push before the site is published.

### What we tested and changed

The blind test changed the method. With one factor for the whole year it over-predicted the summer months, and MODIS seemed to catch a larger share of summer fires than of the small burns the rest of the year. So we measured a separate June-to-September factor. It lowered the error, and we kept it.

---

## Why it is important

### Who it helps, and the decisions it supports

Early warning and emergency responders, scientists, land managers and firefighters. HOTSPOT shows history, not a forecast: it helps people prepare and reduce the risk. It does not predict fires.

1. **Planning:** when does the dangerous period normally start and end here? Patrols and readiness can follow the "normal year" row and the peak season. For All Greece the app names July to October.
2. **Alert:** is this month unusual for this area? The "this month so far" card compares it with the same days in earlier years.
3. **After a fire:** how does this event compare with the worst on record here, across the change of instrument? The rankings and the finding below answer it.

### What is new

**A finding nobody could make before.** Was 2007 worse than 2021 or 2023 in Greece? MODIS counted 2007 and VIIRS counted 2021 and 2023, so their numbers could not be compared. On one scale:

- **August 2007 had about 11,606 NOAA-20-equivalent hotspots (range 8,554 to 14,659), against 6,893 in August 2021 and 5,736 in August 2023**, both measured by NOAA-20 itself. Even the low end of 2007's range is above both.
- For the whole year, 2007 had about 22,224, against 9,545 in 2021 and 9,376 in 2023. The blind test missed whole years by 11.2% at worst, so 2007 stays about twice either year.
- EFFIS burned area also ranks 2007 first (271,715 ha). For 2021 and 2023 the order differs: by hotspots they are nearly equal, while by burned area 2023 is larger (174,773 ha against 130,744 ha).

**What exists, and what we add**

| What exists | What it lacks | What HOTSPOT adds |
|---|---|---|
| NASA FIRMS, our source | Distributes MODIS and VIIRS as separate products, each in its own units | One record across the instruments, from November 2000, in NOAA-20 units |
| Fire dashboards built on VIIRS hotspots | A VIIRS-only record can only begin in 2012, when VIIRS data starts | The twelve years before 2012 on the same scale, with their range |
| Scientific products such as GFED5NRT (Chen et al. 2026), the closest published precedent | Gridded burned area and emissions for specialists; not a tool for any drawn area | A weight on every single hotspot and an app anyone can use. We reuse its factory-mask rule and credit it. |
| Any chart of hotspot counts | No way to see how a number was made | The arithmetic behind every estimate, a raw-versus-harmonized switch, and seven proofs on the same site |

**New measured ratios for the Mediterranean.** Our factors (S-NPP hotspots per MODIS hotspot in Greece: 2.63 by day and 4.96 by night in the fire season, 3.36 and 11.52 the rest of the year) are a VIIRS-to-MODIS count ratio for a Mediterranean country. We found none published. We did not search exhaustively, so we do not say none exists.

**Local impact.** The two case studies, North Evia 2021 and Evros 2023, are fires everyone in Greece remembers, checked against the official Copernicus maps.

### Use it and build on it

- **Open dataset.** All 153,804 cleaned Greek hotspots of November 2000 to December 2025, each with its weight, plus the 9 factors and a description of every column: https://github.com/VasilisVerykokos/Nasa/releases/tag/dataset-v1
- **Use our data.** The calendar behind the app is a public web address anyone can call for any area in Greece: `https://gustnedusjcdxtppojfn.supabase.co/rest/v1/rpc/calendar`. Send a GeoJSON polygon (at most 500 corners). You get one row per month from November 2000, with the harmonized value and each sensor's raw count. The public key and a ready-to-run example are in the README, section "Use our data".
- **Open code, Apache-2.0.** The README gives every step to rebuild the record from NASA's public files.

**Next steps**

1. **More countries.** The pipeline takes the country as a setting, so the Mediterranean means running it and checking the proofs for each country.
2. **NASA's VIIRS 750 m continuity product as a bridge,** to separate the resolution effect cleanly: MODIS against 750 m, then 750 m against 375 m on the same satellite.
3. **An alert** when an area goes above its normal for the month.

---

## NASA data

- **NASA FIRMS, MODIS Collection 6.1 active fire product** (Terra and Aqua, 1 km): yearly country files for Greece, 2000 to 2025
- **NASA FIRMS, VIIRS 375 m active fire products** (S-NPP and NOAA-20): yearly country files for Greece, 2012 to 2025 and 2018 to 2025
- **NASA FIRMS Area API**, VIIRS NOAA-20 375 m, standard and near-real-time data: 2026, refreshed daily
- NASA documentation: MODIS Collection 6 and 6.1 Active Fire Product User's Guide; FIRMS FAQ; NASA VIIRS Land, Active Fire Product page

## Space agency partner data and other data

- **Copernicus Emergency Management Service** (European Union), activations **EMSR527** (North Evia 2021) and **EMSR686** (Evros 2023): areas of interest and burned-area maps (proof 3, the two presets)
- **EFFIS**, the European Forest Fire Information System (Copernicus), Statistics Portal: yearly burned area for Greece, 2006 to 2025 (proof 4)
- Natural Earth, 1:10m Admin 0 Countries (public domain): the Greece outline
- Map © OpenStreetMap contributors (ODbL)

HOTSPOT is not endorsed by NASA. No NASA logos are used.

## References

### Data

| Name | Used for | Link |
|---|---|---|
| NASA FIRMS, MODIS Collection 6.1 active fire product (Terra and Aqua), yearly country files, Greece 2000 to 2025 | Hotspots before 2012, and the MODIS side of the factor | https://firms.modaps.eosdis.nasa.gov |
| NASA FIRMS, VIIRS 375 m active fire products (S-NPP 2012 to 2025, NOAA-20 2018 to 2025), yearly country files, Greece | Hotspots from 2012; both factors | https://firms.modaps.eosdis.nasa.gov |
| NASA FIRMS Area API and data-availability API, VIIRS NOAA-20 375 m, standard (VIIRS_NOAA20_SP) and near-real-time (VIIRS_NOAA20_NRT), 2026 | The current year, refreshed daily | https://firms.modaps.eosdis.nasa.gov/api/area/ |
| EFFIS Statistics Portal, yearly burned area for Greece, 2006 to 2025 | Proof 4 | https://forest-fire.emergency.copernicus.eu/apps/effis.statistics/estimates |
| Copernicus EMS, activation EMSR686 (Evros 2023): burned-area products and area of interest | Proof 3; the Evros preset | https://mapping.emergency.copernicus.eu/activations/EMSR686/ |
| Copernicus EMS, activation EMSR527 and its bulletin (North Evia 2021): area of interest AOI01 "Evia" and burned-area products | Proof 3; the North Evia preset | https://mapping.emergency.copernicus.eu/activations/EMSR527/ |
| Natural Earth, 1:10m Admin 0 Countries (public domain) | The Greece outline and its land neighbours (keeps the 2026 data inside Greece) | https://www.naturalearthdata.com |

### Papers and guides

| Reference | Used for |
|---|---|
| Giglio, L., Schroeder, W., Justice, C. O. (2016). The collection 6 MODIS active fire detection algorithm and fire products. *Remote Sensing of Environment* 178, 31–41. https://doi.org/10.1016/j.rse.2016.02.054 | The MODIS fire product |
| Schroeder, W., Oliva, P., Giglio, L., Csiszar, I. A. (2014). The New VIIRS 375 m active fire detection data product. *Remote Sensing of Environment* 143, 85–96. https://doi.org/10.1016/j.rse.2013.12.008 | The VIIRS 375 m fire product |
| Chen, Y., van der Werf, G. R., Mu, M., van Wees, D., Hall, J. V., Giglio, L., et al. (2026). Tracking recent extremes and interannual variability of global fire emissions using a near-real-time extension to the Global Fire Emissions Database. *Earth System Science Data* 18, 7535–7555. https://doi.org/10.5194/essd-18-7535-2026 | GFED5NRT: the closest precedent (factors from the overlap years); the factory-mask rule |
| Fu, Y., Li, R., Wang, X., et al. (2020). Fire Detection and Fire Radiative Power in Forests and Low-Biomass Lands in Northeast Asia: MODIS versus VIIRS Fire Products. *Remote Sensing* 12(18), 2870. https://doi.org/10.3390/rs12182870 | Background: MODIS misses many VIIRS fire pixels (Northeast Asia) |
| Sofiev, M., Kouznetsov, R. (2026). Observation operator and detection limits for MODIS and VIIRS Fire Radiative Power products. *Geoscientific Model Development* 19, 10123–10142. https://doi.org/10.5194/gmd-19-10123-2026 | Background: detection limits of both sensors |
| Mann, H. B. (1945). Nonparametric tests against trend. *Econometrica* 13(3), 245–259. https://doi.org/10.2307/1907187 | The trend test |
| Sen, P. K. (1968). Estimates of the regression coefficient based on Kendall's tau. *Journal of the American Statistical Association* 63(324), 1379–1389. https://doi.org/10.1080/01621459.1968.10480934 | The trend slope |
| MODIS Collection 6 and 6.1 Active Fire Product User's Guide, version 1.0. https://earthdata.nasa.gov/s3fs-public/2023-09/MODIS_C6_C6.1_Fire_User_Guide_1.0.pdf | The MODIS confidence classes (table 11) |
| FIRMS FAQ, NASA Earthdata. https://www.earthdata.nasa.gov/data/tools/firms/faq | What a hotspot is, satellite dates, limits of hotspot data |
| NASA VIIRS Land, Active Fire Product. https://viirsland.gsfc.nasa.gov/Products/NASA/FireESDR.html | The 750 m and 375 m VIIRS products |
| NASA Earthdata alert on the final Terra and Aqua orbit corrections. https://www.earthdata.nasa.gov/data/alerts-outages/version-7.0-modis-calibrated-radiances-geolocation-data-products-now-available | The MODIS drift dates |
| ColorBrewer, Cynthia Brewer, Penn State. https://colorbrewer2.org | The YlOrRd colour ramp |
| NASA Space Apps Challenge 2026, "Harmonization of MODIS and VIIRS Hot Spots". https://www.spaceappschallenge.org/2026/challenges/modis-and-viirs-hot-spots/ | The task and NASA's wording of the goal |

### Libraries

| Name | Used for | Licence | Link |
|---|---|---|---|
| Vite | Builds and serves the website | MIT | https://vite.dev |
| React | The website's interface | MIT | https://react.dev |
| TypeScript | Typed JavaScript for the website | Apache-2.0 | https://www.typescriptlang.org |
| Vitest | Website tests | MIT | https://vitest.dev |
| jsdom | A test-only browser for the website tests | MIT | https://github.com/jsdom/jsdom |
| Leaflet | The map | BSD-2-Clause | https://leafletjs.com |
| Leaflet-Geoman (free edition) | Drawing a polygon or rectangle | MIT | https://geoman.io |
| d3-scale-chromatic | The YlOrRd colour ramp | ISC | https://github.com/d3/d3-scale-chromatic |
| @fontsource/space-grotesk | Headings (self-hosted font) | SIL OFL 1.1 | https://fontsource.org/fonts/space-grotesk |
| @fontsource/inter | Body text (self-hosted font) | SIL OFL 1.1 | https://fontsource.org/fonts/inter |
| marked | Renders the method page text | MIT | https://marked.js.org |
| PostgreSQL | The database and its four read functions | PostgreSQL License | https://www.postgresql.org |
| PostGIS | Tests each hotspot against the drawn area | GPL-2.0-or-later | https://postgis.net |
| psycopg 3 | Connects the Python scripts to the database | LGPL-3.0 | https://www.psycopg.org |
| Python 3.13 | The data pipeline | PSF License | https://www.python.org |
| pandas | Cleans, counts and weights the hotspots | BSD-3-Clause | https://pandas.pydata.org |
| SciPy | Rank correlation for proof 4 | BSD-3-Clause | https://scipy.org |
| Requests | Downloads 2026 from the FIRMS Area API | Apache-2.0 | https://requests.readthedocs.io |
| pytest | Pipeline tests | MIT | https://pytest.org |

### Services

| Name | Used for | Link |
|---|---|---|
| Supabase | Hosts the PostgreSQL + PostGIS database and its public web address | https://supabase.com |
| OpenStreetMap tiles (© OpenStreetMap contributors, ODbL) | The background map | https://www.openstreetmap.org/copyright |
| GitHub Pages and GitHub Actions | Hosting the website; tests and publishing on every push; the daily update | https://pages.github.com |

## Use of artificial intelligence

**The code was written with Claude Code, under the team's direction and review.** The team chose the challenge, the region, the two fires and the users. The team decided each step of the method, including adopting the season split after the blind test, and can explain every one. Every AI-assisted file carries a one-line note at its top, and every session is logged in `hotspot/AI_USE.md`.

**AI tools used**

| Tool | What it did |
|---|---|
| Claude (Anthropic) | Planning discussion, checking sources in a browser, compiling our fact file, checking the plan against the judging criteria, quick feasibility counts on the public Greek FIRMS files |
| Claude Code (Claude Opus 5.5 and Claude Sonnet 5.5) | Wrote the code under the team's direction: the pipeline (cleaning, factors, weights, the seven proofs, the dataset export, the daily update), the database functions, the website and its tests. It also drafted the README, the dataset description, the screen text and this page, which the team checked against the proof files. |
| Claude in Chrome | A browser check of the calendar heatmap on the live site |
| Impeccable (a design skill used through Claude Code) | A design review of the website; the team chose which fixes to make |
| Gemini (Google) | A literature search on the sensors and the two fires. Every result was fact-checked before use. |
| ChatGPT (OpenAI) | A plain-language explanation of the topic in Greek for one team member. Its suggestions (VIIRS 750 m as the main source, a 1 km grid, an alert system) were checked against NASA's pages and the data and not adopted. |

**No AI-generated images are used.** Every image on this page is a screenshot of the live app.
