-- ============================================================================
-- Bar Utopia — database schema
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- Safe to re-run: every statement is idempotent.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Admin allow-list
--
-- Being signed in is not enough to edit the site: the account's email must also
-- appear here. That way an accidentally-enabled public signup cannot turn a
-- stranger into an editor.
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  email text primary key,
  created_at timestamptz not null default now()
);

-- Used by every write policy below. SECURITY DEFINER so the check itself is not
-- subject to RLS on public.admins (which would otherwise recurse).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admins a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ---------------------------------------------------------------------------
-- Content tables
--
-- `id` is a bigint identity so it maps onto the `id: number` the front-end
-- already uses. `sort_order` preserves the hand-tuned ordering the hard-coded
-- arrays had; ties fall back to id.
-- ---------------------------------------------------------------------------
create table if not exists public.menu_items (
  id          bigint generated always as identity primary key,
  name        text not null,
  description text not null default '',
  category    text not null,
  image       text not null default '',
  price       text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint menu_items_category_check check (
    category in ('Food','Seafood','Vegan','Vegetarian','Cocktails','Mocktails','Hot Drinks','Cold Drinks','Coffee')
  )
);

create table if not exists public.surf_packages (
  id          bigint generated always as identity primary key,
  name        text not null,
  price       text not null default '',
  price_note  text,
  includes    text[] not null default '{}',
  excludes    text[] not null default '{}',
  cta         text not null default '',
  highlighted boolean not null default false,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.gallery_images (
  id         bigint generated always as identity primary key,
  src        text not null,
  alt        text not null default '',
  category   text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gallery_images_category_check check (
    category in ('Beach','Restaurant','Food','Drinks','Surfing','Sunbeds','Accommodation')
  )
);

-- Single-row table: `id` is pinned to 1 so there can only ever be one settings
-- record, which keeps reads a plain `.single()` with no ordering worries.
create table if not exists public.site_settings (
  id                 smallint primary key default 1,
  instagram_url      text not null default '',
  facebook_url       text not null default '',
  tripadvisor_url    text not null default '',
  booking_url        text not null default '',
  contact_address    text not null default '',
  contact_phone      text not null default '',
  contact_email      text not null default '',
  contact_hours      text not null default '',
  map_embed_url      text not null default '',
  updated_at         timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

create index if not exists menu_items_sort_idx on public.menu_items (sort_order, id);
create index if not exists surf_packages_sort_idx on public.surf_packages (sort_order, id);
create index if not exists gallery_images_sort_idx on public.gallery_images (sort_order, id);

-- Keep updated_at honest without the API having to remember to set it.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['menu_items','surf_packages','gallery_images','site_settings'] loop
    execute format('drop trigger if exists touch_updated_at on public.%I', t);
    execute format(
      'create trigger touch_updated_at before update on public.%I
         for each row execute function public.touch_updated_at()', t);
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- Anyone (including logged-out visitors) may read the content — it is a public
-- marketing site. Only allow-listed admins may write.
-- ---------------------------------------------------------------------------
alter table public.menu_items     enable row level security;
alter table public.surf_packages  enable row level security;
alter table public.gallery_images enable row level security;
alter table public.site_settings  enable row level security;
alter table public.admins         enable row level security;

do $$
declare t text;
begin
  foreach t in array array['menu_items','surf_packages','gallery_images','site_settings'] loop
    execute format('drop policy if exists "public read %1$s" on public.%1$I', t);
    execute format('drop policy if exists "admin write %1$s" on public.%1$I', t);

    execute format(
      'create policy "public read %1$s" on public.%1$I
         for select using (true)', t);

    execute format(
      'create policy "admin write %1$s" on public.%1$I
         for all to authenticated
         using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end;
$$;

-- Admins may see who else is an admin; nobody can edit the list over the API.
-- Add or remove editors from the Supabase dashboard (or the SQL editor).
drop policy if exists "admins read self" on public.admins;
create policy "admins read self" on public.admins
  for select to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage bucket for admin-uploaded photography
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do update set public = true;

drop policy if exists "public read site-images" on storage.objects;
create policy "public read site-images" on storage.objects
  for select using (bucket_id = 'site-images');

drop policy if exists "admin write site-images" on storage.objects;
create policy "admin write site-images" on storage.objects
  for all to authenticated
  using (bucket_id = 'site-images' and public.is_admin())
  with check (bucket_id = 'site-images' and public.is_admin());
