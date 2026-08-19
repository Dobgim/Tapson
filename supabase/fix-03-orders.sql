-- ===========================================================================
--  Fix 03 — customer orders. Run in the Supabase SQL Editor.
--
--  No money moves through the website. A customer submits an order request
--  and states how they would prefer to pay; you then send them the payment
--  details out of band. So an order is a record of intent, and its status
--  starts at 'awaiting_payment' rather than anything implying funds received.
-- ===========================================================================

do $$ begin
  create type order_status as enum ('awaiting_payment', 'paid', 'fulfilled', 'cancelled');
exception when duplicate_object then null; end $$;

create table if not exists public.orders (
  id             uuid primary key default gen_random_uuid(),
  reference      text not null unique,

  -- Snapshot of the unit at the time of ordering. Kept as plain columns, not
  -- a join, so an order still reads correctly after the unit is edited or
  -- sold and removed from inventory.
  product_id     text,
  product_title  text not null,
  product_image  text,
  stock_number   text,
  unit_price     numeric(12,2) not null check (unit_price >= 0),

  customer_name  text not null,
  customer_email text not null,
  customer_phone text not null default '',
  delivery       text not null default 'collection',
  address        text not null default '',
  payment_method text not null,
  notes          text not null default '',

  status         order_status not null default 'awaiting_payment',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists orders_status_idx     on public.orders (status);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at
  before update on public.orders
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------------ RLS ---
alter table public.orders enable row level security;

-- Anyone may place an order. Nobody anonymous may read one back: an order row
-- carries a customer's name, email, phone and address, and the anon key is
-- public. Same reasoning as leads.
drop policy if exists "anyone may place an order" on public.orders;
create policy "anyone may place an order"
  on public.orders for insert
  to anon, authenticated
  with check (true);

drop policy if exists "orders readable by staff" on public.orders;
create policy "orders readable by staff"
  on public.orders for select
  to authenticated
  using (true);

drop policy if exists "orders updatable by staff" on public.orders;
create policy "orders updatable by staff"
  on public.orders for update
  to authenticated
  using (true) with check (true);

drop policy if exists "orders deletable by staff" on public.orders;
create policy "orders deletable by staff"
  on public.orders for delete
  to authenticated
  using (true);

-- ------------------------------------------------------------- checks -----
select 'orders table' as item, count(*)::text as value
  from information_schema.tables where table_schema = 'public' and table_name = 'orders'
union all
select 'order policies', count(*)::text from pg_policies
  where schemaname = 'public' and tablename = 'orders';
