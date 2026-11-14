# AI note: written with Claude Code (Claude Sonnet 5.5), under the team's direction and review.
"""Checks hotspot/.env against Supabase and NASA FIRMS. Prints only PASS/FAIL, never a key or password.

Run from the hotspot folder:  py -3.13 scripts/check_env.py
(For the database test also run once:  py -3.13 -m pip install --user "psycopg[binary]")
"""
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

ENV_PATH = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent / ".env"
REQUIRED = ["SUPABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_SERVICE_KEY", "SUPABASE_DB_PASSWORD",
            "SUPABASE_DB_HOST", "SUPABASE_DB_USER", "FIRMS_MAP_KEY"]

env = {}
for line in ENV_PATH.read_text(encoding="utf-8-sig").splitlines():
    line = line.strip()
    if line and not line.startswith("#") and "=" in line:
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip()

failed = False


def show(name, ok, note=""):
    global failed
    failed = failed or not ok
    print(f"{'PASS' if ok else 'FAIL'}  {name}  {note}".rstrip())


def get(url, key=None):
    headers = {"apikey": key} if key else {}  # new-style keys go in "apikey", not "Authorization"
    try:
        return urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=20).status, ""
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()[:150]
    except Exception as e:
        return None, str(e)[:150]


for k in REQUIRED:
    v = env.get(k, "")
    show(f"{k} is filled in", bool(v))
    if v and (" " in v or v[0] in "\"'" or v[-1] in "\"'"):
        show(f"{k} has no spaces or quotes", False, "remove them")

url = env.get("SUPABASE_URL", "")
url_ok = bool(re.fullmatch(r"https://[a-z0-9]+\.supabase\.co", url))
show("SUPABASE_URL format", url_ok, "" if url_ok else "must be https://<ref>.supabase.co, nothing after it, no 'SUPABASE_URL=' inside")

anon = env.get("SUPABASE_ANON_KEY", "")
if anon:
    show("anon key starts with sb_publishable_", anon.startswith("sb_publishable_"), "(you may have copied the wrong key)" if not anon.startswith("sb_publishable_") else "")
if url_ok and anon:
    s, msg = get(url + "/auth/v1/settings", anon)
    show("Supabase accepts the publishable key", s == 200, f"(HTTP {s}) {msg}" if s != 200 else "")
if url_ok and env.get("SUPABASE_SERVICE_KEY"):
    s, msg = get(url + "/rest/v1/", env["SUPABASE_SERVICE_KEY"])
    show("Supabase accepts the secret key", s == 200, f"(HTTP {s}) {msg}" if s != 200 else "")

if env.get("FIRMS_MAP_KEY"):
    s, msg = get(f"https://firms.modaps.eosdis.nasa.gov/api/data_availability/csv/{env['FIRMS_MAP_KEY']}/VIIRS_NOAA20_SP")
    show("NASA accepts the FIRMS key", s == 200, f"(HTTP {s})" if s != 200 else "")

try:
    import psycopg
except ImportError:
    print("SKIP  database test (run: py -3.13 -m pip install --user \"psycopg[binary]\")")
else:
    if all(env.get(k) for k in ("SUPABASE_DB_HOST", "SUPABASE_DB_USER", "SUPABASE_DB_PASSWORD")):
        try:
            with psycopg.connect(host=env["SUPABASE_DB_HOST"], port=5432, user=env["SUPABASE_DB_USER"],
                                 password=env["SUPABASE_DB_PASSWORD"], dbname="postgres",
                                 connect_timeout=15, sslmode="require") as c:
                show("database password works", True)
                rows = c.execute("select n.nspname from pg_extension e join pg_namespace n on n.oid = e.extnamespace "
                                 "where e.extname = 'postgis'").fetchall()
                show("PostGIS installed", bool(rows), f"(schema: {rows[0][0]})" if rows else "")
        except Exception as e:
            show("database connection", False, str(e).splitlines()[0][:160])

print("\nALL GOOD" if not failed else "\nSOMETHING FAILED - fix the FAIL lines above")
sys.exit(1 if failed else 0)
