-- ===========================================================================
--  Repossessed Rides — one-shot setup
--
--  Everything the site needs, in one file. Safe to run more than once:
--  every statement either creates something absent or replaces it in place.
--  It does NOT touch your 26 product rows.
--
--  HOW TO RUN
--    Supabase Dashboard -> SQL Editor -> New query -> paste this -> Run.
--
--    If any text is highlighted in the editor, Run executes ONLY the
--    highlighted part. That is what left the orders table without its
--    policies last time. Click once in the editor to clear any selection
--    before pressing Run.
--
--  The last statement prints a summary. Check it before closing.
-- ===========================================================================

-- ------------------------------------------------------------------ types --
do $$ begin create type unit_condition as enum ('New', 'Pre-Owned');
exception when duplicate_object then null; end $$;

do $$ begin create type usage_unit as enum ('mi', 'hrs');
exception when duplicate_object then null; end $$;

do $$ begin create type lead_status as enum ('new', 'contacted', 'won', 'closed');
exception when duplicate_object then null; end $$;

do $$ begin create type order_status as enum ('awaiting_payment', 'paid', 'fulfilled', 'cancelled');
exception when duplicate_object then null; end $$;

-- -------------------------------------------------------------- utilities --
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ----------------------------------------------------------------- tables --
create table if not exists public.locations (
  id text primary key,
  name text not null,
  street text not null,
  city text not null,
  region text not null,
  postal_code text not null,
  phone text not null,
  phone_href text not null,
  email text not null,
  lat double precision,
  lng double precision,
  specialties text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  year int not null,
  make text not null,
  model text not null,
  trim text,
  category text not null,
  condition unit_condition not null default 'New',
  price numeric(12,2) not null check (price >= 0),
  msrp numeric(12,2) check (msrp >= 0),
  usage_value numeric(12,2),
  usage_unit usage_unit,
  location_id text references public.locations (id) on delete set null,
  stock_number text,
  color text,
  description text not null default '',
  specifications jsonb not null default '[]'::jsonb,
  features text[] not null default '{}',
  images text[] not null default '{}',
  featured boolean not null default false,
  special boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  kind text not null,
  name text not null default '',
  email text not null,
  phone text not null default '',
  message text not null default '',
  status lead_status not null default 'new',
  product_id text references public.products (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  product_id text,
  product_title text not null,
  product_image text,
  stock_number text,
  unit_price numeric(12,2) not null check (unit_price >= 0),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null default '',
  delivery text not null default 'collection',
  address text not null default '',
  payment_method text not null,
  notes text not null default '',
  status order_status not null default 'awaiting_payment',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- indexes --
create index if not exists products_category_idx  on public.products (category);
create index if not exists products_condition_idx on public.products (condition);
create index if not exists products_make_idx      on public.products (make);
create index if not exists leads_created_at_idx   on public.leads (created_at desc);
create index if not exists orders_status_idx      on public.orders (status);
create index if not exists orders_created_at_idx  on public.orders (created_at desc);

-- --------------------------------------------------------------- triggers --
drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at before update on public.products
  for each row execute function public.touch_updated_at();

drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at before update on public.orders
  for each row execute function public.touch_updated_at();

-- ===========================================================================
--  Row Level Security
--
--  The anon key ships to every visitor's browser, so these rules are the only
--  thing protecting your data:
--    products, locations  world-readable, staff-writable
--    leads, orders        anyone may submit, ONLY staff may read
--
--  Customer name, email, phone and address live in leads and orders. If anon
--  could read those tables, anyone holding the public key could download your
--  entire customer list.
-- ===========================================================================
alter table public.locations enable row level security;
alter table public.products  enable row level security;
alter table public.leads     enable row level security;
alter table public.orders    enable row level security;

-- locations ----------------------------------------------------------------
drop policy if exists "locations readable by everyone" on public.locations;
create policy "locations readable by everyone" on public.locations
  for select to anon, authenticated using (true);

drop policy if exists "locations writable by staff" on public.locations;
create policy "locations writable by staff" on public.locations
  for all to authenticated using (true) with check (true);

-- products -----------------------------------------------------------------
drop policy if exists "products readable by everyone" on public.products;
create policy "products readable by everyone" on public.products
  for select to anon, authenticated using (true);

drop policy if exists "products writable by staff" on public.products;
create policy "products writable by staff" on public.products
  for all to authenticated using (true) with check (true);

-- leads --------------------------------------------------------------------
drop policy if exists "anyone may submit a lead" on public.leads;
create policy "anyone may submit a lead" on public.leads
  for insert to anon, authenticated with check (true);

drop policy if exists "leads readable by staff" on public.leads;
create policy "leads readable by staff" on public.leads
  for select to authenticated using (true);

drop policy if exists "leads updatable by staff" on public.leads;
create policy "leads updatable by staff" on public.leads
  for update to authenticated using (true) with check (true);

drop policy if exists "leads deletable by staff" on public.leads;
create policy "leads deletable by staff" on public.leads
  for delete to authenticated using (true);

-- orders -------------------------------------------------------------------
drop policy if exists "anyone may place an order" on public.orders;
create policy "anyone may place an order" on public.orders
  for insert to anon, authenticated with check (true);

drop policy if exists "orders readable by staff" on public.orders;
create policy "orders readable by staff" on public.orders
  for select to authenticated using (true);

drop policy if exists "orders updatable by staff" on public.orders;
create policy "orders updatable by staff" on public.orders
  for update to authenticated using (true) with check (true);

drop policy if exists "orders deletable by staff" on public.orders;
create policy "orders deletable by staff" on public.orders
  for delete to authenticated using (true);

-- ===========================================================================
--  Storage — product photos uploaded from the dashboard
-- ===========================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 15728640,
        array['image/jpeg','image/png','image/webp','image/avif','image/heic','image/heif'])
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "product images are publicly readable" on storage.objects;
create policy "product images are publicly readable" on storage.objects
  for select to anon, authenticated using (bucket_id = 'product-images');

drop policy if exists "staff may upload product images" on storage.objects;
create policy "staff may upload product images" on storage.objects
  for insert to authenticated with check (bucket_id = 'product-images');

drop policy if exists "staff may replace product images" on storage.objects;
create policy "staff may replace product images" on storage.objects
  for update to authenticated
  using (bucket_id = 'product-images') with check (bucket_id = 'product-images');

drop policy if exists "staff may delete product images" on storage.objects;
create policy "staff may delete product images" on storage.objects
  for delete to authenticated using (bucket_id = 'product-images');

-- ===========================================================================
--  Tidy up: the three placeholder Florida stores from the original seed.
--  Every product was repointed to 'burlington' before this runs.
-- ===========================================================================
delete from public.locations where id in ('miami', 'key-largo', 'pompano');

-- ===========================================================================
--  Summary — read this before closing.
--    locations       1
--    products        26
--    lead policies   4
--    order policies  4
--    storage bucket  1
--    storage policies 4
-- ===========================================================================
select 'locations'        as item, count(*)::text as value from public.locations
union all select 'products',        count(*)::text from public.products
union all select 'leads',           count(*)::text from public.leads
union all select 'orders',          count(*)::text from public.orders
union all select 'lead policies',   count(*)::text from pg_policies
  where schemaname = 'public' and tablename = 'leads'
union all select 'order policies',  count(*)::text from pg_policies
  where schemaname = 'public' and tablename = 'orders'
union all select 'storage bucket',  count(*)::text from storage.buckets
  where id = 'product-images'
union all select 'storage policies', count(*)::text from pg_policies
  where schemaname = 'storage' and tablename = 'objects'
    and policyname like '%product images%';
