-- AI note: written with Claude Code (Claude Opus 5.5), under the team's direction and review.
-- Tables, indexes, security and the four API functions. Safe to run more than once.
-- PostGIS lives in the "extensions" schema, so every PostGIS name is written as extensions.<name>.

-- ---------- Tables ----------

create table if not exists public.hotspots (
  id         bigint generated always as identity primary key,
  acq_date   date not null,
  acq_time   text not null,
  latitude   double precision not null,
  longitude  double precision not null,
  -- computed from latitude/longitude, so the loader never has to write it
  geom       extensions.geometry(Point, 4326)
             generated always as (extensions.st_setsrid(extensions.st_makepoint(longitude, latitude), 4326)) stored,
  source     text not null check (source in ('MODIS', 'SNPP', 'NOAA20')),
  satellite  text not null check (satellite in ('Terra', 'Aqua', 'S-NPP', 'NOAA-20')),
  daynight   text not null check (daynight in ('D', 'N')),
  confidence text,
  frp        double precision,
  weight     double precision not null check (weight >= 0),  -- 0 = outside its sensor's period
  quality    text not null check (quality in ('SP', 'NRT')),
  country    text not null
);
create index if not exists hotspots_geom_idx on public.hotspots using gist (geom);
create index if not exists hotspots_acq_date_idx on public.hotspots (acq_date);

-- Same columns as pipeline/factors.py fit()
create table if not exists public.factors (
  name        text not null,
  season      text not null,  -- 'fire season' (June to September), 'rest', or 'all' for F2
  daynight    text not null,
  numerator   bigint not null,
  denominator bigint not null,
  factor      double precision not null,
  uses        text not null,  -- 'own cell', or which pooled factor a cell with under 100 MODIS detections uses, and why
  start_date  date not null,
  end_date    date not null,
  primary key (name, season, daynight)
);

create table if not exists public.coverage (
  country text primary key,
  geom    extensions.geometry(MultiPolygon, 4326) not null
);

-- Keys used by the website: data_through, last_update, record_start, uncertainty (e.g. [-0.15, 0.15]), method_version
create table if not exists public.meta (
  key   text primary key,
  value jsonb not null
);

-- ---------- Security: visitors cannot read any table directly ----------

alter table public.hotspots enable row level security;
alter table public.factors  enable row level security;
alter table public.coverage enable row level security;
alter table public.meta     enable row level security;
-- No policies on purpose. Revoking also turns a direct read into a clear "permission denied" instead of 0 rows.
revoke all on public.hotspots, public.factors, public.coverage, public.meta from anon, authenticated;
revoke all on sequence public.hotspots_id_seq from anon, authenticated;

-- 10-second limit for every visitor request (Supabase's default for anon is 3 s)
alter role anon set statement_timeout = '10s';

-- ---------- Shared shape check (not callable by visitors) ----------

create or replace function public.area_shape(area jsonb)
returns extensions.geometry
language plpgsql stable set search_path = ''
as $$
declare
  g extensions.geometry;
begin
  begin
    g := extensions.st_setsrid(extensions.st_geomfromgeojson(area), 4326);
  exception when others then
    raise exception 'The area is not a valid GeoJSON shape.';
  end;
  if coalesce(extensions.geometrytype(g), '') not in ('POLYGON', 'MULTIPOLYGON') then
    raise exception 'The area must be a GeoJSON Polygon or MultiPolygon.';
  end if;
  if extensions.st_npoints(g) > 500 then
    raise exception 'The area has % corner points; the limit is 500. Draw a simpler shape.', extensions.st_npoints(g);
  end if;
  if not extensions.st_isvalid(g) then
    raise exception 'The area shape is invalid: %.', extensions.st_isvalidreason(g);
  end if;
  return g;
end
$$;

-- ---------- The four API functions ----------

-- One row per month of the whole record (months with no hotspots included as zeros), for the drawn area.
-- so_far = value for days 1..D of each month, D = day of the newest hotspot; its median is the "same days" normal.
drop function if exists public.calendar(jsonb);  -- our own function; needed because its columns changed
create function public.calendar(area jsonb)
returns table (year int, month int, value double precision, modis int, snpp int, noaa20 int, provisional int,
               so_far double precision)
language sql stable security definer set search_path = ''
as $$
  with a as (select public.area_shape(area) as g),
  hits as (
    select date_trunc('month', h.acq_date::timestamp)::date as m, extract(day from h.acq_date)::int as d,
           h.weight, h.source, h.quality
    from public.hotspots h, a
    where extensions.st_intersects(h.geom, a.g)
  ),
  months as (
    select s::date as m, extract(day from r.hi)::int as cut
    from (select min(acq_date)::timestamp lo, max(acq_date)::timestamp hi from public.hotspots) r,
         generate_series(date_trunc('month', r.lo), r.hi, interval '1 month') s
  )
  select extract(year from months.m)::int,
         extract(month from months.m)::int,
         coalesce(sum(hits.weight), 0)::double precision,
         (count(*) filter (where hits.source = 'MODIS'))::int,
         (count(*) filter (where hits.source = 'SNPP'))::int,
         (count(*) filter (where hits.source = 'NOAA20'))::int,
         (count(*) filter (where hits.quality = 'NRT'))::int,
         coalesce(sum(hits.weight) filter (where hits.d <= months.cut), 0)::double precision
  from months left join hits on hits.m = months.m
  group by months.m, months.cut
  order by months.m
$$;

-- The hotspots of one month for the map. shortcut: silently capped at 20,000 rows; a Greece month peaks far below that.
create or replace function public.month_points(area jsonb, year int, month int)
returns table (acq_date date, acq_time text, latitude double precision, longitude double precision, source text,
               satellite text, daynight text, frp double precision, weight double precision, quality text)
language sql stable security definer set search_path = ''
as $$
  with a as (select public.area_shape(area) as g)
  select h.acq_date, h.acq_time, h.latitude, h.longitude, h.source, h.satellite, h.daynight, h.frp, h.weight, h.quality
  from public.hotspots h, a
  where extensions.st_intersects(h.geom, a.g)
    and h.acq_date >= make_date(year, month, 1)
    and h.acq_date < make_date(year, month, 1) + interval '1 month'
  order by h.acq_date, h.acq_time
  limit 20000
$$;

-- Every column of the selected hotspots, 10,000 rows per page (page 0, 1, 2 ...). Refuses selections over 200,000.
create or replace function public.hotspots_export(area jsonb, date_from date, date_to date, page int default 0)
returns table (id bigint, acq_date date, acq_time text, latitude double precision, longitude double precision,
               source text, satellite text, daynight text, confidence text, frp double precision,
               weight double precision, quality text, country text)
language plpgsql stable security definer set search_path = ''
as $$
#variable_conflict use_column
declare
  g extensions.geometry := public.area_shape(area);
  n bigint;
begin
  if page is null or page < 0 then
    raise exception 'page must be 0 or more.';
  end if;
  select count(*) into n from public.hotspots h
  where extensions.st_intersects(h.geom, g) and h.acq_date between date_from and date_to;
  if n > 200000 then
    raise exception 'This selection has % hotspots; the export limit is 200,000. Choose a smaller area or a shorter date range.', n;
  end if;
  return query
    select h.id, h.acq_date, h.acq_time, h.latitude, h.longitude, h.source, h.satellite, h.daynight,
           h.confidence, h.frp, h.weight, h.quality, h.country
    from public.hotspots h
    where extensions.st_intersects(h.geom, g) and h.acq_date between date_from and date_to
    order by h.id
    offset page * 10000 limit 10000;
end
$$;

-- Everything the page needs besides the hotspots: meta keys (data_through, uncertainty ...), factors, coverage outlines.
create or replace function public.get_meta()
returns jsonb
language sql stable security definer set search_path = ''
as $$
  select jsonb_build_object(
    'meta',     (select coalesce(jsonb_object_agg(m.key, m.value), '{}'::jsonb) from public.meta m),
    'factors',  (select coalesce(jsonb_agg(to_jsonb(f) order by f.name, f.season, f.daynight), '[]'::jsonb) from public.factors f),
    'coverage', (select coalesce(jsonb_object_agg(c.country, extensions.st_asgeojson(c.geom, 5)::jsonb), '{}'::jsonb)
                 from public.coverage c)
  )
$$;

-- ---------- Who may call what ----------

revoke all on function public.area_shape(jsonb)                          from public, anon, authenticated;
revoke all on function public.calendar(jsonb)                            from public, anon, authenticated;
revoke all on function public.month_points(jsonb, int, int)              from public, anon, authenticated;
revoke all on function public.hotspots_export(jsonb, date, date, int)    from public, anon, authenticated;
revoke all on function public.get_meta()                                 from public, anon, authenticated;
grant execute on function public.calendar(jsonb)                         to anon;
grant execute on function public.month_points(jsonb, int, int)           to anon;
grant execute on function public.hotspots_export(jsonb, date, date, int) to anon;
grant execute on function public.get_meta()                              to anon;

-- Tell the Supabase web API about the new functions and the new time limit
notify pgrst, 'reload schema';
notify pgrst, 'reload config';
