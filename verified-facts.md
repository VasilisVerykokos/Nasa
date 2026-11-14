# Verified facts: MODIS / VIIRS hotspots and the Greek case studies

NASA Space Apps 2026, challenge "Harmonization of MODIS and VIIRS Hot Spots".
Compiled 13 November 2026, before the hackathon. Research notes only: no code, no data processing.

## How to read this file

Every fact has a status:

- **VERIFIED**: read on the original source page on 13 Nov 2026 (link given).
- **SECOND-HAND**: found in a source that cites the original, not the original itself.
- **UNVERIFIED**: reported by Gemini or recalled from memory; nobody on the team has seen the source text. Do not put these on the project page without checking.

Research was done with AI help (Gemini for searching, Claude for checking sources in a browser). List both in the AI-use disclosure. Cite the papers and official pages below in References, not the AI tools.

---

## 1. Rules that affect us

All VERIFIED on spaceappschallenge.org.

| Rule | Detail | Source |
|---|---|---|
| No early start | "Teams are not allowed to begin working on the challenges prior to the hackathon." | [Participant FAQs](https://www.spaceappschallenge.org/resources/participant-faqs/) |
| Time window | Submission opens Sat 14 Nov 09:00, closes Sun 15 Nov 23:59, local time of our Local Event. Resubmitting is allowed until then. | [Project Submission Guide](https://www.spaceappschallenge.org/resources/project-submission-guide/) |
| Demo limit | 30-second video OR 7 slides maximum. Exceeding it means no Global Judging. | Same |
| Language and links | Everything in English. All links public, no login. | Same |
| AI use | Allowed, must be disclosed. AI-made code/data acknowledged in text and metadata; AI images watermarked. AI "should not be used to come up with your idea of how to solve the challenge". | Same |
| Citations | Every source, library and dataset must be listed, even open-source ones. | [Terms](https://www.spaceappschallenge.org/legal/) |
| License | Our work must be open source. No license named means Apache 2.0. | Same |
| NASA data | At least one NASA data source is required for a Global Award. Partner agency data (ESA is one) is encouraged. | Project Submission Guide |
| Team | 1 to 6 members, all registered at the same Local Event. | [Judging & Awards Guide](https://www.spaceappschallenge.org/resources/judging-awards-guide) |
| Judging | Scored 1 to 5 on Impact, Creativity, Validity, Relevance, Presentation. Most of the evaluation is based on the project page, not the demo. | Same |
| Dates | Nominees 3 Dec 2026, Finalists 17 Dec 2026, Winners 26 Jan 2027. | Same |

---

## 2. The data (NASA FIRMS)

### 2.1 Archive coverage (VERIFIED, [FIRMS Archive Download](https://firms.modaps.eosdis.nasa.gov/download/))

| Sensor | Resolution | Coverage |
|---|---|---|
| MODIS Collection 6.1 (Terra + Aqua) | 1 km | 1 Nov 2000 to present |
| VIIRS S-NPP | 375 m | 20 Jan 2012 to 2 Nov 2026 (ended) |
| VIIRS NOAA-20 | 375 m | 1 Apr 2018 to present |
| VIIRS NOAA-21 | 375 m | 1 Mar 2023 to present |

- Near-real-time data is replaced by standard (science quality) data after about 5 months.
- Archive requests are delivered by email after processing. Request them first thing on Saturday.
- FIRMS also offers yearly summary CSVs per country, based on standard data ([country page](https://firms.modaps.eosdis.nasa.gov/country/)). Which years and sensors each country has: not checked.

### 2.2 Live API limits (VERIFIED, [FIRMS Area API](https://firms.modaps.eosdis.nasa.gov/api/area/))

- At most 5 days per request.
- Area is a bounding box: west,south,east,north.
- Sources: `MODIS_SP`, `MODIS_NRT`, `VIIRS_SNPP_SP`, `VIIRS_SNPP_NRT`, `VIIRS_NOAA20_SP`, `VIIRS_NOAA20_NRT`, `VIIRS_NOAA21_SP`, `VIIRS_NOAA21_NRT` (SP = standard, NRT = near-real-time).
- Needs a free MAP_KEY. Limit is 5,000 transactions per 10 minutes (SECOND-HAND, [NASA Q&A document](https://appliedsciences.nasa.gov/sites/default/files/2025-05/Part%203%20FIRMS%202025%20Q&A%20Session.docx.pdf)).

### 2.3 Fields and filtering

| Fact | Status | Source |
|---|---|---|
| `type` field: 0 = presumed vegetation fire, 1 = active volcano, 2 = other static land source, 3 = offshore | SECOND-HAND (search summary of the FIRMS attribute table) | [FIRMS attributes](https://earthdata.nasa.gov/data/tools/firms/active-fire-data-attributes-modis-viirs) |
| `type` exists only in standard (archive) data, not in near-real-time data | SECOND-HAND (same) | Same |
| Bug: VIIRS files produced before May 2025 often labelled industrial sources (type 2) as vegetation fires (type 0). Fixed in version 3. **Download fresh files; do not reuse old copies.** | SECOND-HAND | [FIRMS notifications](https://firms.modaps.eosdis.nasa.gov/content/notifications/firms/news.html) |
| MODIS confidence is 0 to 100%: 0–29 low, 30–79 nominal, 80–100 high | UNVERIFIED (Gemini; matches common FIRMS documentation) | check FIRMS attribute table |
| VIIRS confidence is a category: low, nominal, high | UNVERIFIED (same) | check FIRMS attribute table |
| GFED5NRT kept only vegetation fires (fire type code = 0) | VERIFIED | [GFED5NRT paper](https://essd.copernicus.org/articles/18/7535/2026/), section 2 |

---

## 3. The satellites

| Fact | Status | Source |
|---|---|---|
| Terra's final inclination maneuver: 27 Feb 2020. Its crossing time is drifting from 10:30 AM toward early morning. | VERIFIED | [NASA Earthdata alert](https://www.earthdata.nasa.gov/data/alerts-outages/version-7.0-modis-calibrated-radiances-geolocation-data-products-now-available) |
| Aqua's final inclination maneuver: 8 Mar 2021. Its crossing time is drifting from 13:30 toward late afternoon. | VERIFIED | Same |
| Aqua projected to reach about 3:50 PM by August 2026 | SECOND-HAND | [NSIDC](https://nsidc.org/ru/node/51980) |
| Terra science data planned to stop Feb 2027; Aqua Sept 2027 (some NASA pages say shutdown could start late 2026) | SECOND-HAND | [LAADS MODIS to VIIRS transition](https://ladsweb.modaps.eosdis.nasa.gov/learn/modis-to-viirs-transition/) |
| S-NPP data delivery ended 2 Nov 2026 | VERIFIED | FIRMS notification banner |
| S-NPP, NOAA-20 and NOAA-21 share one orbit. NOAA-21 is a quarter orbit ahead of S-NPP and NOAA-20 a quarter orbit behind: about 25 minutes between neighbours, 50 minutes end to end. | SECOND-HAND | [NASA SVS](https://svs.gsfc.nasa.gov/5021) |
| JPSS equator crossing is about 13:25 local time. Gemini's "12:40 for NOAA-20/21" is WRONG. | SECOND-HAND | NASA SVS transcript |
| The three VIIRS satellites see a place "at approximately the same local solar time, but from different viewing angles" | VERIFIED | GFED5NRT paper, section 2.2 |

**What this means for us**

- MODIS data after the drift dates is not directly comparable with earlier MODIS data.
- One fire can be recorded by all three VIIRS satellites within an hour. Adding the three together inflates counts.

---

## 4. Why MODIS and VIIRS disagree (papers)

### 4.1 Fu et al. 2020 (VERIFIED, read on the paper's page)

Fu, Li, Wang et al., "Fire Detection and Fire Radiative Power in Forests and Low-Biomass Lands in Northeast Asia: MODIS versus VIIRS Fire Products", *Remote Sensing* 12(18), 2870. [DOI 10.3390/rs12182870](https://doi.org/10.3390/rs12182870)

- Compared Aqua MODIS 1 km (MYD14) with VIIRS 375 m (VNP14IMG), Northeast Asia, 2012–2017, near-simultaneous overpasses.
- Of the fire pixels VIIRS detected, MODIS missed **65% in forests** and **83% in low-biomass lands** (cropland, grassland).
- Of the fire pixels MODIS detected, VIIRS missed 35% (forests) and 53% (low-biomass).
- Monthly total fire power (FRP), VIIRS versus MODIS: slopes of **1.22, 1.32, 1.22** for the three land cover groups (R² 0.95, 0.91, 0.98). VIIRS totals are higher because it finds more fires.
- For fires both sensors detected: slopes of **0.72, 0.73, 0.70**. VIIRS gives lower power than MODIS for the same fire.
- Limit: one region only. Do not present these as global or Mediterranean values.

### 4.2 GFED5NRT, Chen et al. 2026 (VERIFIED, full text read)

Chen, van der Werf, Mu, van Wees, Hall, Giglio, et al., "Tracking recent extremes and interannual variability of global fire emissions using a near-real-time extension to the Global Fire Emissions Database", *Earth System Science Data* 18, 7535–7555. [DOI 10.5194/essd-18-7535-2026](https://doi.org/10.5194/essd-18-7535-2026)

This is the closest published precedent for what the challenge asks.

- Purpose: keep the MODIS-era fire record going with VIIRS, because of MODIS orbital drift and planned decommissioning.
- Method: scaling factors called "effective fire area" (burned area per active fire detection), derived by relating VIIRS detections to the MODIS-based GFED5 record over the **2012–2022 overlap**.
- Factors are specific to region and land cover: 14 continental regions × 16 burning types, up to 224 factors. The chosen scheme is named "Regftp".
- 16 land cover classes: 13 standard biome types plus deforestation, peatland and agricultural burning. Land cover from MODIS MCD12Q1.
- Only vegetation fires (type = 0) were used.
- Grid: 0.25° cells.
- Satellites: S-NPP and NOAA-20 processed as two separate series, then merged to reduce viewing-angle bias.
- Industrial-source mask at 0.01°: cells with more than five non-vegetation detections (type ≠ 0) in S-NPP data 2012–2022 are treated as permanent heat sources.
- Anomaly formula: Z = (v − m) / SD, where v is the monthly value, m the monthly climatological mean, SD the year-to-year standard deviation (baseline 2012–2022).
- Limit for us: their viewing-angle correction needs the raw swath image products, not the hotspot location files (CSV). We cannot reproduce that part from FIRMS CSVs.

### 4.3 Sofiev & Kouznetsov 2026 (VERIFIED, abstract read)

"Observation operator and detection limits for MODIS and VIIRS Fire Radiative Power products", *Geoscientific Model Development* 19, 10123–10142. [DOI 10.5194/gmd-19-10123-2026](https://doi.org/10.5194/gmd-19-10123-2026)

- Smallest fire MODIS detects: 3.7 MW at night, directly below the satellite, clear sky. Up to 40 MW in daytime at the edge of the swath.
- Smallest fire VIIRS reliably detects at night: 0.5 MW.
- Global average probability of detecting powerful fires: **78% for MODIS, 88% for VIIRS**. In some equatorial areas: below 30% (MODIS) and 40% (VIIRS).

### 4.4 Other papers

| Paper | What we know | Status |
|---|---|---|
| Li, Zhang, Kondragunta et al. 2018, "Comparison of Fire Radiative Power Estimates From VIIRS and MODIS Observations", *JGR Atmospheres* 123, 4545–4563. [DOI](https://doi.org/10.1029/2017JD027823) | Studies how fire power from both sensors depends on viewing angle. Use only as a general comparison reference. | VERIFIED (abstract only) |
| Kaur, Hüser, Zhang, Gehrke, Kaiser 2019, "Correcting Swath-Dependent Bias of MODIS FRP Observations With Quantile Mapping", *Remote Sensing* 11, 1205. [DOI](https://doi.org/10.3390/rs11101205) | The correct source for the quantile-mapping, viewing-angle correction (Gemini wrongly credited Li 2018). MODIS under-detects away from the satellite's ground track. | VERIFIED (abstract) |
| Giglio, Schroeder, Justice 2016, "The collection 6 MODIS active fire detection algorithm and fire products", *Remote Sensing of Environment* 178, 31–41. [DOI 10.1016/j.rse.2016.02.054](https://doi.org/10.1016/j.rse.2016.02.054) | Title, authors and DOI verified. Content claims below are not. | DOI VERIFIED |
| Schroeder, Oliva, Giglio, Csiszar 2014, "The New VIIRS 375 m active fire detection data product", *Remote Sensing of Environment* 143, 85–96. [DOI 10.1016/j.rse.2013.12.008](https://doi.org/10.1016/j.rse.2013.12.008) | Title, authors and DOI verified. Content claims below are not. | DOI VERIFIED |

**UNVERIFIED claims from those two algorithm papers** (publisher site blocked access; read the abstracts before using):

- MODIS Collection 6 daytime false-alarm rate fell to 1.2%, from 2.4% in Collection 5.
- VIIRS 375 m finds 3× more daytime and 25× more night-time fire pixels than the VIIRS 750 m product. This is VIIRS versus VIIRS, **not** VIIRS versus MODIS.
- The VIIRS fire channel saturates at 367 K, in about 8% of daytime and 1% of night-time fire pixels.
- VIIRS pixel is about 383 × 360 m below the satellite and at most about 795 × 784 m at the swath edge; a MODIS 1 km pixel grows to about 9.7 km² at the edge.
- VIIRS swath is about 3,000 km wide; MODIS about 2,300 km.

### 4.5 Gaps nobody has filled

- No published ratio of VIIRS to MODIS hotspot **counts** for the Mediterranean or southern Europe was found.
- No published MODIS or VIIRS hotspot counts were found for either case-study fire.

Any such numbers from our tool would be new. Worth saying on the project page.

---

## 5. Case study: North Evia, August 2021

| Fact | Value | Status | Source |
|---|---|---|---|
| Start | Tuesday afternoon, 3 Aug 2021 | VERIFIED | [Copernicus EMSR527](https://mapping.emergency.copernicus.eu/activations/EMSR527/) |
| Copernicus activation | EMSR527, activated 4 Aug 2021 08:22. 7 areas (Evia is AOI01), 15 products. | VERIFIED | Same |
| Mapping product dates | First estimate 5 Aug; delineation 5 Aug; monitoring updates 9, 10 and 11 Aug; grading 14 Aug | VERIFIED | Same |
| Activation centre point | 23.35°E, 38.79°N (covers Evia and Attica areas together) | VERIFIED | Copernicus API |
| Burned area growth | 7,313 ha on 5 Aug, to 50,909 ha by 11 Aug | SECOND-HAND (Gemini quoting a Copernicus bulletin; an independent site gives 50,910 ha) | [Copernicus bulletin](https://mapping.emergency.copernicus.eu/news/the-copernicus-emergency-management-service-monitors-fire-events-in-the-mediterranean-region/), [BELSPO](https://eo.belspo.be/news/wildfire-evia-greece) |
| "51,245 ha" | Not found anywhere. Do not use. | – | – |
| End of the fire | "Mostly extinguished 12 Aug 2021" | UNVERIFIED (journal site blocked). Safer: last Copernicus product is dated 14 Aug. | – |
| Greece 2021 season | More than 130,000 ha burned, worst in 13 years; about 70% from five fires in early August, all with violent pyroconvection | VERIFIED (abstract) | Giannaros et al. 2022, [DOI 10.3390/atmos13030475](https://doi.org/10.3390/atmos13030475) |
| Smoke over Athens | Aerosol optical depth up to 3.6 at 500 nm | VERIFIED (abstract) | Masoom et al. 2023, [DOI 10.5194/acp-23-8487-2023](https://doi.org/10.5194/acp-23-8487-2023) |
| Heatwave peak 46.3°C at Makrakomi | – | UNVERIFIED | check Giannaros et al. |
| VIIRS satellites operating | S-NPP and NOAA-20 (NOAA-21 not yet launched), plus Terra and Aqua, both already drifting | Derived from the coverage dates in section 2.1 | – |
| Bounding box | 22.966 to 23.509°E, 38.674 to 39.063°N (box around area of interest AOI01 "Evia"). Replaces the rough 23.0 to 23.5°E, 38.75 to 39.05°N | VERIFIED (section 10.7) | [EMSR527 AOI01 Monitoring 3 vector package](https://cems-mapping-website.s3.eu-west-1.amazonaws.com/static/activations/EMSR527/EMSR527_AOI01_DEL_MONIT03_r1_RTP01_v1_vector.zip) |

---

## 6. Case study: Evros / Dadia, August to September 2023

| Fact | Value | Status | Source |
|---|---|---|---|
| Start | 19 Aug 2023, 04:49 local time, forest area near Aristino village | VERIFIED | [Copernicus EMSR686](https://mapping.emergency.copernicus.eu/activations/EMSR686/) |
| Copernicus activation | EMSR686, activated 20 Aug 2023 08:36 UTC. 1 area, 11 products, 14 maps. | VERIFIED | Same |
| Evacuated villages (initial) | Aristino, Loutros, Agnadia, Antheia, Doriko | VERIFIED | Same |
| Activation centre point | 26.05°E, 40.87°N | VERIFIED | Copernicus API |
| Burned area growth | 72,344 ha (23 Aug), 80,873 ha (28–29 Aug), 93,880 ha (3 Sep, final monitoring product) | SECOND-HAND (80,873 seen in two independent sources; the others via Gemini) | [Technical report](https://civilprotection.gov.gr/sites/default/files/2024-02/EMSN166_Technical_Report_v01.pdf) |
| Final size, alternative figure | About 96,000 ha, "largest wildfire ever recorded in the European Union" | SECOND-HAND | [Copernicus ESOTC 2023](https://climate.copernicus.eu/esotc/2023/wildfires) |
| "94,250 ha" | Not confirmed. Use 93,880 or about 96,000 and name the source. | – | – |
| Deaths | 18 or 20 depending on the source, most of them migrants | SECOND-HAND, sources disagree | news reports |
| Dadia park | "up to 58% of the protected Natura 2000 area within the Dadia Forest" affected | VERIFIED, but a passing mention in a paper about 2024 fires | [Forests 16(2), 268](https://www.mdpi.com/1999-4907/16/2/268) |
| Greece 2023 season | Nine major fires, 1,470.31 km² burned | VERIFIED (abstract) | Dosiou et al. 2024, [DOI 10.3390/fire7010020](https://doi.org/10.3390/fire7010020) |
| "Gusts up to 120 km/h" | WRONG for Evros. That figure belongs to the Achaia-Ilia fire of 2024. | VERIFIED | Forests 16(2), 268 |
| VIIRS satellites operating | S-NPP, NOAA-20 and NOAA-21, plus Terra and Aqua (both drifting) | Derived from the coverage dates in section 2.1 | – |
| Approximate bounding box | 25.7 to 26.3°E, 40.8 to 41.2°N | UNVERIFIED (rough estimate; adjust against the Copernicus map) | – |

---

## 7. Greece yearly burned area (EFFIS)

No primary EFFIS table was read. Get the numbers from [EFFIS](https://forest-fire.emergency.copernicus.eu/) directly before quoting any.

| Year | Value | Status |
|---|---|---|
| 2007 | about 271,700 ha (worst year) | SECOND-HAND |
| 2021 | about 130,700 ha (Gemini: 130,744) | SECOND-HAND |
| 2023 | about 174,700 ha (Gemini: 174,773) | SECOND-HAND |
| 2025 | 48,998 ha in a news report of a JRC report (Gemini said 47,819) | SECOND-HAND, conflicting |
| All other years in Gemini's table | – | UNVERIFIED |

Note: one paper gives lower totals for 2021 (113,877 ha) and 2023 (165,528 ha), probably a different counting method.

---

## 8. Do not use

- The whole "Section 7" of Gemini's Evia/Dadia report (claims that the fires "validate" the harmonization). It has no source.
- Giglio DOI ending `2015.11.015`. It points to a paper about tidal wetlands.
- "NOAA-20 and NOAA-21 cross the equator at 12:40".
- "Terra's final maneuvers were in 2022".
- "120 km/h gusts" for Evros.
- "51,245 ha" for Evia.
- Gemini's proposed filter that drops saturated VIIRS pixels. It is invented and would remove the largest fires.
- Aerosol, soil-erosion and smoke-chemistry details. They are not relevant to a hotspot calendar.

## 9. Results of the follow-up checks (13 Nov, evening)

**This section supersedes the status labels in sections 2 to 7 wherever they differ.**

### 9.1 Algorithm paper abstracts

- **Giglio 2016: VERIFIED** (abstract via OpenAlex). "Overall, the MOD14 Collection 6 daytime global commission error was 1.2%, compared to 2.4% in Collection 5." Validation used Terra MODIS against more than 2,500 ASTER images. Collection 6 also retrieves fire power with a radiance-based approach, "generally decreasing FRP for all but the comparatively small fraction of high intensity fire pixels".
- **Schroeder 2014: STILL UNVERIFIED.** The publisher hides the abstract from every open index tried. The 3× / 25× figure, the 367 K saturation value and the pixel sizes remain unconfirmed. The FIRMS attribute page does confirm in words that the VIIRS I4 channel (3.55–3.93 µm) saturates frequently.

### 9.2 FIRMS attribute table (VERIFIED, [page read](https://www.earthdata.nasa.gov/data/tools/firms/active-fire-data-attributes-modis-viirs))

- MODIS `type`: 0 = presumed vegetation fire, 1 = active volcano, 2 = other static land source, 3 = offshore. Footnote: "This attribute is only available for MCD14ML (standard quality) data".
- The near-real-time VIIRS table has **no `type` field at all**.
- MODIS confidence: 0 to 100%, assigned to low, nominal or high classes. The class boundaries (0–29, 30–79, 80–100) are **not on this page**: still unverified.
- VIIRS confidence: low, nominal, high. Low daytime = sun glint areas and weak temperature anomaly (<15 K). Nominal = no glint and strong anomaly (>15 K). High = saturated pixels.
- MODIS `Satellite`: A = Aqua, T = Terra. VIIRS: N = Suomi NPP, N20 = NOAA-20, N21 = NOAA-21.
- `Scan` and `Track` give the real pixel size, which grows toward the edge of the swath.
- VIIRS fire power: "only viable across small and/or low-intensity fires" because of saturation.

### 9.3 Copernicus: Evros 2023 (VERIFIED, Copernicus EMSR686 data service)

- **Official bounding box (area of interest "Aristino"): west 25.536, south 40.749, east 26.317, north 41.261.**
- Event time: 19 Aug 2023, 02:49 UTC (04:49 local).
- Burned area per mapping product:

| Product | Image date | Burned area (ha) |
|---|---|---|
| Delineation | 20 Aug 2023 | 5,040.8 |
| Monitoring 1 | 21 Aug | 8,529.4 |
| Monitoring 2 | 23 Aug | 72,344.5 |
| Monitoring 3 | 24 Aug | 73,526.5 |
| Monitoring 4 | 25 Aug | 75,668.2 |
| Monitoring 5 | 26 Aug | 77,066.2 |
| Monitoring 6 | 28 Aug | 80,873.0 |
| Monitoring 7 | 29 Aug | 81,260.7 |
| Monitoring 8 | 2 Sep | 93,511.0 |
| Monitoring 9 | 3 Sep | 93,880.8 |

The jump from 8,529 ha to 72,344 ha between 21 and 23 August is the period our calendar and daily data should show most strongly.

### 9.4 Copernicus: Evia 2021

- **VERIFIED** ([Copernicus bulletin](https://mapping.emergency.copernicus.eu/news/the-copernicus-emergency-management-service-monitors-fire-events-in-the-mediterranean-region/)): the fire extent in northern Evia "increased from 7,313 ha to 50,909 ha between 05 and 11 August".
- **Bounding box: VERIFIED on 14 Nov** (section 10.7): west 22.966, south 38.674, east 23.509, north 39.063, read from the AOI01 vector package, not the map. EMSR527 is not in the Copernicus data service, but the activation page links each product's vector files.

### 9.5 EFFIS yearly burned area for Greece (VERIFIED, EFFIS statistics service)

Fires of about 30 ha or larger. Gemini's table was correct.

| Year | Burned area (ha) | Fires | Year | Burned area (ha) | Fires |
|---|---|---|---|---|---|
| 2006 | 16,294 | 22 | 2017 | 20,041 | 57 |
| 2007 | 271,715 | 139 | 2018 | 12,037 | 33 |
| 2008 | 24,988 | 46 | 2019 | 10,736 | 53 |
| 2009 | 42,807 | 46 | 2020 | 14,915 | 88 |
| 2010 | 6,472 | 21 | 2021 | 130,744 | 85 |
| 2011 | 35,713 | 80 | 2022 | 22,480 | 66 |
| 2012 | 52,487 | 83 | 2023 | 174,773 | 56 |
| 2013 | 19,762 | 32 | 2024 | 41,948 | 86 |
| 2014 | 14,815 | 31 | 2025 | 47,819 | 69 |
| 2015 | 11,613 | 27 | 2026 | 35,321 (year not finished) | 56 |
| 2016 | 31,707 | 52 | | | |

Source: [EFFIS Statistics Portal](https://forest-fire.emergency.copernicus.eu/apps/effis.statistics/estimates). The 48,998 ha news figure for 2025 comes from a different report; use the EFFIS number and name it.

### 9.6 FIRMS per-country yearly files for Greece (VERIFIED, FIRMS file list)

| Instrument | Years available | Files |
|---|---|---|
| MODIS | 2000 to 2025 | 26 |
| VIIRS S-NPP | 2012 to 2025 | 14 |
| VIIRS NOAA-20 | 2018 to 2025 | 8 |
| VIIRS NOAA-21 | none | 0 |

- File names follow `modis_2001_Greece.csv`. The MODIS Greece files are small (about 7 KB to 143 KB each).
- Standard-processing data, so the `type` field should be present (confirm in the file header on Saturday).
- 2026 is not included: it must come from the archive download or the API.
- Source: [FIRMS Country Yearly Summary](https://firms.modaps.eosdis.nasa.gov/country/).

### 9.7 Still open

1. Schroeder 2014 abstract (section 9.1).
2. MODIS confidence class boundaries.
3. Exact Evia bounding box from the EMSR527 PDF map. Closed 14 Nov (section 10.7).
4. Confirm the whole team is registered at the same Local Event (only the team can do this).

## 10. Updates of 14 November (after the start)

**This section supersedes sections 2 to 9 wherever they differ.** Source of each item: the second team member's session (`FOR-MASTER-PLAN.md`), which read the pages named. Items marked "both machines" were also counted on the first machine.

### 10.1 Points that are now closed

- **MODIS confidence classes: VERIFIED** (second team session; MODIS Collection 6 and 6.1 Active Fire Product User's Guide v1.0, section 8.4.3, table 11). Low: 0 to under 30. Nominal: 30 to under 80. High: 80 to 100. This closes point 2 of section 9.7.
- **Aqua start: VERIFIED.** The FIRMS FAQ gives "July 2002". The first Aqua detection in the Greece files is 4 July 2002 (both machines). MODIS detections for 2000 and 2001 are Terra only.
- **VIIRS swath width: 3,040 km** (VERIFIED, second team session, FIRMS FAQ).
- **Pixel area in the Greece files** (second machine; scan × track): MODIS median 1.32 km², 95th percentile 5.61 km², maximum 9.6 km². VIIRS median about 0.20 km², maximum 0.62 km². Consistent with the unverified figures in section 4.4.

### 10.2 New conflict

- **NOAA-21 availability: sources disagree.** The FIRMS Archive Download page gave 1 March 2023 (section 2.1); the FIRMS FAQ says 17 January 2024. We do not use NOAA-21. Do not quote a date.

### 10.3 The two VIIRS fire products (VERIFIED, second team session; NASA VIIRS Land page and FIRMS FAQ)

- 750 m (VNP14 for S-NPP, VJ114 for NOAA-20): M-bands. A replica of the MODIS Collection 6 algorithm, built for continuity with the MODIS 1 km record.
- 375 m (VNP14IMG, VJ114IMG): I-bands plus M13. Detects smaller fires and maps large fire perimeters better.
- Both come from the same instrument at the same instant. They must never be added.
- FIRMS distributes MODIS 1 km and VIIRS 375 m only. Downloading the 750 m product was not tested.

### 10.4 From the FIRMS FAQ (VERIFIED, second team session)

- A hotspot is the centre of a flagged pixel, not the position of the fire.
- NASA does not recommend hotspots for estimating burned area.

### 10.5 Counts on the Greece files (both machines, identical)

Filters: `type = 0`, MODIS confidence 30 or more, VIIRS not `l`. Quick check outside the pipeline: use as expected values, not as results for the project page. The full table is in `MASTER-PLAN.md`, section 9.7.

- F1 (S-NPP ÷ MODIS, Feb 2012 to Dec 2019): 37,448 ÷ 10,978 = 3.41. Day 3.04, night 5.54.
- F2 (NOAA-20 ÷ S-NPP, 2019 to 2025): 37,673 ÷ 36,168 = 1.04.
- Rows that are not vegetation fires: MODIS 1.6%, S-NPP 16.9%, NOAA-20 14.5%.

### 10.6 Still unverified

- Orbit altitudes (about 705 km for Terra and Aqua, about 824 km for the VIIRS satellites): general knowledge.
- MODIS swath width (about 2,330 km): general knowledge.
- The grid test and the near-simultaneous-pass counts: counted on the second machine only.
- Planned end of Terra (Feb 2027) and Aqua (Sep 2027): still second-hand.

### 10.7 Evia area and the Greece outline (second machine, 14 Nov, 18:40)

- **Evia area of interest: VERIFIED.** Read from the GeoJSON inside the [EMSR527 AOI01 Delineation Monitoring 3 vector package](https://cems-mapping-website.s3.eu-west-1.amazonaws.com/static/activations/EMSR527/EMSR527_AOI01_DEL_MONIT03_r1_RTP01_v1_vector.zip), linked from the activation page. AOI01 is named "Evia": a 19-corner polygon whose box is 22.9663 to 23.5089°E, 38.6742 to 39.0621°N. Rounded outwards for the preset: west 22.966, south 38.674, east 23.509, north 39.063. The polygon is stored in `pipeline/evidence/copernicus_evia_2021.json`.
- **Evia burnt area on 11 Aug 2021: VERIFIED twice.** The Monitoring 3 burnt-area polygon sums to 50,909.9 ha, mapped from a SPOT-6/7 image of 11 Aug 2021, 09:04 UTC. This matches the bulletin's 50,909 ha (section 9.4). Its box: 23.1755 to 23.4647°E, 38.7012 to 39.0395°N.
- **The old rough box cut off the south of the fire** (the burnt area reaches 38.701°N; the old box stopped at 38.75°N). Quick check, NOAA-20, August 2021, `type = 0`, confidence not `l`: 3,110 hotspots in the old box, 3,252 in the new box, 3,251 inside the official polygon. Second machine only; not a number for the page.
- **The Natural Earth outline is slightly tighter than FIRMS's own Greece files.** Of the 3,299 cleaned NOAA-20 hotspots in the 2025 Greece file, 48 (1.5%) fall outside `greece.geojson`, all within about 2.4 km of it (rough distance to the nearest outline corner). So cutting the 2026 API data with the outline as it is would count about 1.5% less than the archive years. Second machine only.
