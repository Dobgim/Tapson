-- ===========================================================================
--  Fix 02 — product image storage. Run in the Supabase SQL Editor.
--
--  Creates the bucket the admin dashboard uploads into, and the access rules
--  around it: anyone may VIEW a product photo (it is a public showroom), only
--  a signed-in operator may add, replace or remove one.
-- ===========================================================================

-- Public bucket, 15 MB per file, images only. Phone photos are large, and the
-- uploader downsizes them in the browser before they ever leave the device,
-- so this ceiling is a backstop rather than the normal case.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  15728640,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/heic', 'image/heif']
)
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- --------------------------------------------------------------- policies --
drop policy if exists "product images are publicly readable" on storage.objects;
create policy "product images are publicly readable"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists "staff may upload product images" on storage.objects;
create policy "staff may upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "staff may replace product images" on storage.objects;
create policy "staff may replace product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');

drop policy if exists "staff may delete product images" on storage.objects;
create policy "staff may delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');

-- ------------------------------------------------------------- checks -----
-- Expect: one bucket row, and four policies.
select 'bucket' as item, count(*)::text as value from storage.buckets where id = 'product-images'
union all
select 'storage policies', count(*)::text from pg_policies
  where schemaname = 'storage' and tablename = 'objects'
    and policyname like '%product images%';
