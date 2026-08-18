-- ===========================================================================
--  Repossessed Rides — database schema
--  Run this once in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query).
--  It is idempotent: safe to re-run.
-- ===========================================================================

-- --------------------------------------------------------------- enums ----
do $$ begin
  create type unit_condition as enum ('New', 'Pre-Owned');
exception when duplicate_object then null; end $$;

do $$ begin
  create type lead_status as enum ('new', 'contacted', 'won', 'closed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type usage_unit as enum ('mi', 'hrs');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------- locations ----
create table if not exists public.locations (
  id            text primary key,
  name          text not null,
  street        text not null,
  city          text not null,
  region        text not null,
  postal_code   text not null,
  phone         text not null,
  phone_href    text not null,
  email         text not null,
  lat           double precision,
  lng           double precision,
  specialties   text[] not null default '{}',
  sort_order    int    not null default 0,
  created_at    timestamptz not null default now()
);

-- ------------------------------------------------------------ products ----
create table if not exists public.products (
  id             text primary key,
  year           int  not null,
  make           text not null,
  model          text not null,
  trim           text,
  category       text not null,
  condition      unit_condition not null default 'New',
  price          numeric(12,2) not null check (price >= 0),
  msrp           numeric(12,2) check (msrp >= 0),
  usage_value    numeric(12,2),
  usage_unit     usage_unit,
  location_id    text references public.locations (id) on delete set null,
  stock_number   text,
  color          text,
  description    text not null default '',
  specifications jsonb not null default '[]'::jsonb,
  features       text[] not null default '{}',
  images         text[] not null default '{}',
  featured       boolean not null default false,
  special        boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists products_category_idx  on public.products (category);
create index if not exists products_condition_idx on public.products (condition);
create index if not exists products_make_idx      on public.products (make);
create index if not exists products_special_idx   on public.products (special) where special;
create index if not exists products_featured_idx  on public.products (featured) where featured;

-- --------------------------------------------------------------- leads ----
create table if not exists public.leads (
  id         uuid primary key default gen_random_uuid(),
  reference  text not null unique,
  kind       text not null,
  name       text not null default '',
  email      text not null,
  phone      text not null default '',
  message    text not null default '',
  status     lead_status not null default 'new',
  product_id text references public.products (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists leads_status_idx     on public.leads (status);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- ------------------------------------------------- updated_at trigger -----
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
  before update on public.products
  for each row execute function public.touch_updated_at();

-- ===========================================================================
--  Row Level Security
--
--  The site ships the anon key to the browser, so RLS is the only thing
--  standing between the public and your data. Rules:
--    * anyone may READ products and locations (it is a public showroom)
--    * anyone may INSERT a lead (the storefront contact forms)
--    * NOBODY anonymous may read, update or delete leads
--    * only signed-in users may manage inventory and read/modify leads
-- ===========================================================================

alter table public.locations enable row level security;
alter table public.products  enable row level security;
alter table public.leads     enable row level security;

-- locations -----------------------------------------------------------------
drop policy if exists "locations readable by everyone" on public.locations;
create policy "locations readable by everyone"
  on public.locations for select
  to anon, authenticated
  using (true);

drop policy if exists "locations writable by staff" on public.locations;
create policy "locations writable by staff"
  on public.locations for all
  to authenticated
  using (true) with check (true);

-- products ------------------------------------------------------------------
drop policy if exists "products readable by everyone" on public.products;
create policy "products readable by everyone"
  on public.products for select
  to anon, authenticated
  using (true);

drop policy if exists "products writable by staff" on public.products;
create policy "products writable by staff"
  on public.products for all
  to authenticated
  using (true) with check (true);

-- leads ---------------------------------------------------------------------
-- Public may submit, but never read back. Staff have full access.
drop policy if exists "anyone may submit a lead" on public.leads;
create policy "anyone may submit a lead"
  on public.leads for insert
  to anon, authenticated
  with check (true);

drop policy if exists "leads readable by staff" on public.leads;
create policy "leads readable by staff"
  on public.leads for select
  to authenticated
  using (true);

drop policy if exists "leads updatable by staff" on public.leads;
create policy "leads updatable by staff"
  on public.leads for update
  to authenticated
  using (true) with check (true);

drop policy if exists "leads deletable by staff" on public.leads;
create policy "leads deletable by staff"
  on public.leads for delete
  to authenticated
  using (true);
