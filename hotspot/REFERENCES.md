# References

Every dataset, paper, library and service the project uses (plan, section 9.8).

## Libraries

| Name | Used for | Licence | Link |
|---|---|---|---|
| Vite | Builds and serves the website | MIT | https://vite.dev |
| React | The website's interface | MIT | https://react.dev |
| TypeScript | Typed JavaScript for the website | Apache-2.0 | https://www.typescriptlang.org |
| Vitest | Tests for the website's statistics | MIT | https://vitest.dev |
| PostgreSQL | The database that holds the hotspots and runs the four functions | PostgreSQL License | https://www.postgresql.org |
| PostGIS | Map maths in the database: tests each hotspot against the drawn area | GPL-2.0-or-later | https://postgis.net |
| psycopg 3 | Connects the Python scripts to the database | LGPL-3.0 | https://www.psycopg.org |
| Python 3.13 | The data pipeline | PSF License | https://www.python.org |
| pandas | Reads, cleans, counts and weights the hotspots in the pipeline | BSD-3-Clause | https://pandas.pydata.org |
| pytest | Tests for the pipeline | MIT | https://pytest.org |

## Datasets

| Name | Used for | Link |
|---|---|---|
| NASA FIRMS, MODIS Collection 6.1 active fire product (Terra and Aqua), yearly country files, Greece 2000 to 2025 | Hotspots before 2012, and the MODIS side of the factor F1 | https://firms.modaps.eosdis.nasa.gov |
| NASA FIRMS, VIIRS 375 m active fire products (S-NPP 2012 to 2025, NOAA-20 2018 to 2025), yearly country files, Greece | Hotspots from 2012; the factors F1 and F2 | https://firms.modaps.eosdis.nasa.gov |
| EFFIS Statistics Portal, yearly burned area for Greece, 2006 to 2025 | Proof 4: our yearly record against an independent one | https://forest-fire.emergency.copernicus.eu/apps/effis.statistics/estimates |

## Papers and guides

| Reference | Used for |
|---|---|
| MODIS Collection 6 and 6.1 Active Fire Product User's Guide, version 1.0 (https://earthdata.nasa.gov/s3fs-public/2023-09/MODIS_C6_C6.1_Fire_User_Guide_1.0.pdf) | The MODIS confidence classes (table 11): we drop the low class, below 30 |

## Services

| Name | Used for | Link |
|---|---|---|
| Supabase | Hosts the PostgreSQL + PostGIS database and the secure web address the website calls | https://supabase.com |
