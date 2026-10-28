-- Manbir Narang site: run this once in Supabase -> SQL Editor -> New query -> Run.

-- 1) Listings you type in from /admin
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  location text not null,
  price numeric not null default 0,
  status text not null default 'New listing',
  category text not null default 'Lakefront',
  beds int not null default 0,
  baths numeric not null default 0,
  sqft int not null default 0,
  description text,
  photos text[] not null default '{}',
  photo_count int,
  featured boolean not null default true,
  published boolean not null default true,
  sort int not null default 0
);

-- 2) Messages sent from the contact and valuation forms
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kind text not null default 'contact',
  name text not null,
  email text not null,
  phone text,
  address text,
  interest text,
  message text
);

alter table public.listings enable row level security;
alter table public.inquiries enable row level security;

-- Everyone can read published listings; only the signed-in admin can change them
drop policy if exists "public reads published listings" on public.listings;
create policy "public reads published listings" on public.listings
  for select using (published = true);

drop policy if exists "admin reads all listings" on public.listings;
create policy "admin reads all listings" on public.listings
  for select to authenticated using (true);

drop policy if exists "admin writes listings" on public.listings;
create policy "admin writes listings" on public.listings
  for all to authenticated using (true) with check (true);

-- Visitors can send an enquiry (but cannot read anyone else's); admin reads and deletes
drop policy if exists "anyone sends an enquiry" on public.inquiries;
create policy "anyone sends an enquiry" on public.inquiries
  for insert to anon, authenticated
  with check (
    char_length(name) between 1 and 200
    and char_length(email) between 3 and 320
    and (message is null or char_length(message) <= 5000)
  );

drop policy if exists "admin reads enquiries" on public.inquiries;
create policy "admin reads enquiries" on public.inquiries
  for select to authenticated using (true);

drop policy if exists "admin deletes enquiries" on public.inquiries;
create policy "admin deletes enquiries" on public.inquiries
  for delete to authenticated using (true);

-- 3) Photo storage: public can view, only the signed-in admin can upload or remove
insert into storage.buckets (id, name, public)
values ('listing-photos', 'listing-photos', true)
on conflict (id) do nothing;

drop policy if exists "public views listing photos" on storage.objects;
create policy "public views listing photos" on storage.objects
  for select using (bucket_id = 'listing-photos');

drop policy if exists "admin uploads listing photos" on storage.objects;
create policy "admin uploads listing photos" on storage.objects
  for insert to authenticated with check (bucket_id = 'listing-photos');

drop policy if exists "admin updates listing photos" on storage.objects;
create policy "admin updates listing photos" on storage.objects
  for update to authenticated using (bucket_id = 'listing-photos');

drop policy if exists "admin deletes listing photos" on storage.objects;
create policy "admin deletes listing photos" on storage.objects
  for delete to authenticated using (bucket_id = 'listing-photos');

-- 4) Listing page details (added Oct 2026). Safe to run more than once.
alter table public.listings add column if not exists slug text;
alter table public.listings add column if not exists mls text;
alter table public.listings add column if not exists year_built int;
alter table public.listings add column if not exists lot_size text;
alter table public.listings add column if not exists taxes numeric;
alter table public.listings add column if not exists features text[] not null default '{}';
