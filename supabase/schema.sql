create extension if not exists pgcrypto;

create table if not exists saved_searches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  filters jsonb not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists scans (
  id uuid primary key default gen_random_uuid(),
  search_id uuid references saved_searches(id) on delete set null,
  filters jsonb not null,
  summary jsonb not null,
  items jsonb not null,
  scanned_at timestamptz not null default now()
);

create index if not exists scans_scanned_at_idx on scans(scanned_at desc);
create index if not exists scans_search_id_idx on scans(search_id);
