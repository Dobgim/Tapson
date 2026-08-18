-- ===========================================================================
--  Fix 01 — run this in the Supabase SQL Editor.
--
--  Two problems found by probing the live project with the anon key:
--
--  1. Anonymous INSERT into public.leads was refused (SQLSTATE 42501). Every
--     storefront form — contact, trade-in, financing, service, test ride —
--     posts as the anon role, so all of them would fail in production. The
--     insert policy is (re)created below.
--
--  2. public.locations still held the three placeholder Florida stores from
--     an earlier seed run, alongside the real Burlington one. Removing them
--     keeps the table consistent with the site.
-- ===========================================================================

-- --------------------------------------------------------------- leads ----
alter table public.leads enable row level security;

-- Public may submit an enquiry, and may never read one back. Reading is what
-- would expose customer names, emails and phone numbers to anyone holding the
-- anon key, which ships in the browser.
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

-- ----------------------------------------------------------- locations ----
-- Products were all repointed to 'burlington' before this runs, so nothing
-- references the placeholder rows.
delete from public.locations where id in ('miami', 'key-largo', 'pompano');

-- ------------------------------------------------------------- checks -----
-- Expect: 1 location, 26 products, and four policies on leads.
select 'locations' as table, count(*) from public.locations
union all
select 'products', count(*) from public.products
union all
select 'lead policies', count(*) from pg_policies
  where schemaname = 'public' and tablename = 'leads';
