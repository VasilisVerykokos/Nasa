# References

Every dataset, paper, library and service the project uses (plan, section 9.8).

## Libraries

| Name | Used for | Licence | Link |
|---|---|---|---|
| Vite | Builds and serves the website | MIT | https://vite.dev |
| React | The website's interface | MIT | https://react.dev |
| TypeScript | Typed JavaScript for the website | Apache-2.0 | https://www.typescriptlang.org |
| Vitest | Tests for the website's statistics | MIT | https://vitest.dev |
| jsdom | A fake browser for the website tests that click the calendar (tests only, not shipped) | MIT | https://github.com/jsdom/jsdom |
| Leaflet | The map on the website | BSD-2-Clause | https://leafletjs.com |
| Leaflet-Geoman (free edition) | Drawing a polygon or rectangle on the map | MIT | https://geoman.io |
| d3-scale-chromatic | The YlOrRd colour ramp of the calendar heatmap and year chart (ColorBrewer, Cynthia Brewer, Penn State, https://colorbrewer2.org; colour-blind safe) | ISC | https://github.com/d3/d3-scale-chromatic |
| marked 15.0.12 | Turns `web/content/method.md` into the text of the "Method and proof" view | MIT | https://marked.js.org |
| PostgreSQL | The database that holds the hotspots and runs the four functions | PostgreSQL License | https://www.postgresql.org |
| PostGIS | Map maths in the database: tests each hotspot against the drawn area | GPL-2.0-or-later | https://postgis.net |
| psycopg 3 | Connects the Python scripts to the database | LGPL-3.0 | https://www.psycopg.org |
| Python 3.13 | The data pipeline | PSF License | https://www.python.org |
| pandas | Reads, cleans, counts and weights the hotspots in the pipeline | BSD-3-Clause | https://pandas.pydata.org |
| SciPy | Rank correlation (Spearman) for proof 4, called by pandas | BSD-3-Clause | https://scipy.org |
| Requests | Downloads the current year from the NASA FIRMS Area API (`pipeline/update_daily.py`) | Apache-2.0 | https://requests.readthedocs.io |
| pytest | Tests for the pipeline | MIT | https://pytest.org |

## Datasets

| Name | Used for | Link |
|---|---|---|
| NASA FIRMS, MODIS Collection 6.1 active fire product (Terra and Aqua), yearly country files, Greece 2000 to 2025 | Hotspots before 2012, and the MODIS side of the factor F1 | https://firms.modaps.eosdis.nasa.gov |
| NASA FIRMS, VIIRS 375 m active fire products (S-NPP 2012 to 2025, NOAA-20 2018 to 2025), yearly country files, Greece | Hotspots from 2012; the factors F1 and F2 | https://firms.modaps.eosdis.nasa.gov |
| NASA FIRMS Area API and data-availability API, VIIRS NOAA-20 375 m, standard (VIIRS_NOAA20_SP) and near-real-time (VIIRS_NOAA20_NRT), 2026 | The current year, from 1 Jan 2026 to the newest day; rerun daily by `pipeline/update_daily.py` | https://firms.modaps.eosdis.nasa.gov/api/area/ |
| EFFIS Statistics Portal, yearly burned area for Greece, 2006 to 2025 | Proof 4: our yearly record against an independent one | https://forest-fire.emergency.copernicus.eu/apps/effis.statistics/estimates |
| Copernicus Emergency Management Service, activation EMSR686 (Evros 2023): burned-area products and area of interest | Dates and burned area of the Evros fire; the Evros preset box | https://mapping.emergency.copernicus.eu/activations/EMSR686/ |
| Copernicus Emergency Management Service, activation EMSR527 and its bulletin on fire events in the Mediterranean (North Evia 2021) | Start date and burned area of the North Evia fire; the North Evia preset box (area of interest AOI01 "Evia", read from the Delineation Monitoring 3 vector files) | https://mapping.emergency.copernicus.eu/activations/EMSR527/ |
| Natural Earth, 1:10m Admin 0 Countries (public domain) | The Greece outline: clipping and the coverage outline. Its land neighbours (Albania, North Macedonia, Bulgaria, Turkey; `pipeline/evidence/neighbours.geojson`) keep the 2026 clip from crossing a border | https://www.naturalearthdata.com |

## Papers and guides

| Reference | Used for |
|---|---|
| MODIS Collection 6 and 6.1 Active Fire Product User's Guide, version 1.0 (https://earthdata.nasa.gov/s3fs-public/2023-09/MODIS_C6_C6.1_Fire_User_Guide_1.0.pdf) | The MODIS confidence classes (table 11): we drop the low class, below 30 |
| NASA Space Apps Challenge 2026, "Harmonization of MODIS and VIIRS Hot Spots" (https://www.spaceappschallenge.org/2026/challenges/modis-and-viirs-hot-spots/) | The task, and NASA's wording of the goal |
| FIRMS FAQ, NASA Earthdata (https://www.earthdata.nasa.gov/data/tools/firms/faq) | What a hotspot is, satellite dates, the limits of hotspot data |
| NASA VIIRS Land, Active Fire Product (https://viirsland.gsfc.nasa.gov/Products/NASA/FireESDR.html) | The two VIIRS fire products (750 m and 375 m) |

## Services

| Name | Used for | Link |
|---|---|---|
| Supabase | Hosts the PostgreSQL + PostGIS database and the secure web address the website calls | https://supabase.com |
| OpenStreetMap tiles (© OpenStreetMap contributors, ODbL) | The background map | https://www.openstreetmap.org/copyright |
| GitHub Pages and GitHub Actions | Build and host the website on every push to `main`; GitHub Actions also runs the daily update (`.github/workflows/daily-update.yml`) | https://pages.github.com |
