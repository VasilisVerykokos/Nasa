# HOTSPOT

**One consistent 26-year fire record from NASA MODIS and VIIRS hotspots. Pick any area in Greece and see how much it burned, month by month, on a single scale.**

Entry for the NASA Space Apps Challenge 2026, challenge *Harmonization of MODIS and VIIRS Hot Spots*.
Full name: *Harmonized Observations of Thermal Sensors for Pyro-Occurrence Trends*.

> **Status:** planning. The pipeline and the web app are not built yet; this README describes what the project will do, not what already runs.

## The problem

NASA has tracked fire hotspots from space since November 2000, but with two different sensors:

| Sensor | Sharpness | Period |
|---|---|---|
| MODIS (Terra, Aqua) | 1 km | Nov 2000 to now, but being retired (planned 2027) |
| VIIRS (S-NPP, NOAA-20) | 375 m | 2012 onward; S-NPP ended 2 Nov 2026 |

VIIRS sees smaller fires, so simply adding the two records together fakes a jump in 2012. And with MODIS ending, long fire records break unless the two sensors are joined properly.

## What HOTSPOT does

- Choose an area (draw it on a map, or type latitude, longitude and radius) and a date range.
- See a **burning-activity calendar** (years × months) with a colour-blind-safe colour ramp, a "normal year" row (the historical median) and a "difference from normal" view.
- Get one plain sentence comparing a month with normal, plus top months, top years and the peak fire season.
- Compare the current month so far against normal, using 2026 data.
- Download the calendar (CSV, image) and the hotspots themselves (CSV, with their harmonization weight).
- Open on a ready example (North Evia 2021), with case studies of North Evia (Aug 2021) and Evros/Dadia (Aug to Sep 2023).

Intended users, in the challenge's words: early warning and emergency responders, scientists, land managers and firefighters.

## How the harmonization works

Every hotspot gets a **weight** that converts it to a NOAA-20-equivalent hotspot. A month's value is the sum of the weights in the area.

1. **Clean:** keep vegetation fires (`type = 0`, which includes agricultural burns), drop low-confidence detections and fixed industrial heat sources.
2. **Never add satellites together:** the three VIIRS satellites share one orbit about 25 minutes apart, so adding them counts one fire up to three times.
3. **F1 (MODIS to VIIRS):** S-NPP hotspots ÷ MODIS hotspots over the same place and months, fitted on February 2012 to December 2019 only (MODIS orbits drift after 2020). Separate factors for day and night, and for the Terra-only period before Aqua.
4. **F2 (S-NPP to NOAA-20):** measured on the shared years 2019 to 2025.
5. **Splice:**

| Period | Source | Weight per hotspot |
|---|---|---|
| Nov 2000 to Jun 2002 | MODIS, Terra only | F1 (Terra only) × F2 |
| Jul 2002 to Jan 2012 | MODIS, Terra + Aqua | F1 × F2 |
| Feb 2012 to Dec 2018 | VIIRS S-NPP | F2 |
| Jan 2019 to today | VIIRS NOAA-20 | 1 |

The uncertainty range comes from a blind test: fit on 2012 to 2016, predict 2017 to 2019 from MODIS alone, compare with what VIIRS counted. Every estimated value will show the arithmetic behind it (for example, detections × factor = value, with a range).

### Planned proofs

1. Naive merge against harmonized yearly totals (the fake 2012 jump disappears).
2. The blind test above.
3. Daily hotspots against Copernicus burned-area maps for the two case-study fires.
4. Yearly harmonized hotspots against EFFIS burned area for Greece, 2006 to 2025.
5. NOAA-20 against S-NPP × F2, monthly, 2019 to 2025.

### Limits

- Values before 2012 are estimates; fires too small for MODIS to see cannot be recovered.
- Small areas are less certain than the whole country.
- Clouds and thick smoke hide fires from both sensors.
- The newest months are provisional until NASA publishes standard data (about 5 months later).
- Hotspots are not burned area.

## Planned architecture

```
NASA FIRMS yearly files (2000-2025)      NASA FIRMS API (2026, daily)
        |                                        |
        v                                        v
 Python pipeline (clean, factors,          Daily update script
 weights, proofs)                                |
        +------------------+---------------------+
                           v
              Supabase (PostgreSQL + PostGIS), 4 SQL functions
                           |
                           v
        React + Vite + MapLibre website on GitHub Pages
```

## What is in this repository

| Path | Contents |
|---|---|
| `hotspot/` | The code: pipeline, database and web app |
| `LICENSE` | Apache License 2.0 |

The raw NASA files (Greece yearly files from FIRMS) are not stored here; the pipeline downloads them.

## Data and references

- **NASA FIRMS** (Fire Information for Resource Management System): MODIS Collection 6.1 and VIIRS 375 m active fire products. https://www.earthdata.nasa.gov/data/tools/firms
- **Copernicus EMS** (activations EMSR527 and EMSR686) and **EFFIS** burned-area statistics, for validation.
- Natural Earth (outline of Greece) and OpenStreetMap through OpenFreeMap (map).
- Papers behind the method: Chen et al. 2026 (GFED5NRT, https://doi.org/10.5194/essd-18-7535-2026), Fu et al. 2020 (https://doi.org/10.3390/rs12182870) and Giglio et al. 2016 (https://doi.org/10.1016/j.rse.2016.02.054).

## AI use disclosure

The plan, source checking and code are made with AI help: Claude (planning, source checking, code), Gemini (literature search) and the Impeccable design skill used through Claude. The team directs the work and must be able to explain every step of the method. Files written with AI carry a note in their header.

## Licence

Open source under the Apache License 2.0. See [LICENSE](LICENSE).
