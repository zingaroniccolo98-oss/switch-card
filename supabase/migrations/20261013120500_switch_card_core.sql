-- Switch Card catalog, ownership, marketplace, and trades.
-- No seed rows. Official checklists are imported later from an authorized source.

create extension if not exists pg_trgm with schema extensions;
create extension if not exists postgis with schema extensions;

create type public.game_category as enum ('sport', 'tcg', 'other');
create type public.catalog_status as enum ('draft', 'published', 'archived');
create type public.physical_status as enum ('owned', 'stuck');
create type public.card_condition as enum ('mint', 'good', 'played');
create type public.listing_status as enum ('active', 'paused', 'reserved', 'closed');
create type public.trade_status as enum ('proposed', 'accepted', 'rejected', 'cancelled', 'completed');
create type public.trade_direction as enum ('offer', 'request');
create type public.location_precision as enum ('approximate', 'city');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_updated_at() from public, anon, authenticated;

create table public.publishers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  constraint publishers_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.games (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category public.game_category not null,
  created_at timestamptz not null default now(),
  constraint games_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  publisher_id uuid not null references public.publishers (id) on delete restrict,
  game_id uuid not null references public.games (id) on delete restrict,
  title text not null,
  slug text not null unique,
  release_year integer,
  cover_url text,
  catalog_status public.catalog_status not null default 'draft',
  catalog_version text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collections_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint collections_year_range check (release_year is null or release_year between 1900 and 2100)
);

create table public.collectibles (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections (id) on delete cascade,
  number text not null,
  name text not null,
  variant text not null default '',
  category text,
  image_url text,
  metadata jsonb not null default '{}'::jsonb,
  source text not null default 'manual',
  external_id text,
  source_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collectibles_number_present check (char_length(btrim(number)) > 0),
  constraint collectibles_name_present check (char_length(btrim(name)) > 0),
  constraint collectibles_identity unique (collection_id, number, variant),
  constraint collectibles_external_identity unique (collection_id, source, external_id)
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  display_name text not null,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_format check (username ~ '^[A-Za-z0-9_]{3,24}$'),
  constraint profiles_display_name_present check (char_length(btrim(display_name)) > 0)
);

create unique index profiles_username_lower_idx on public.profiles (lower(username));

create table public.user_collections (
  user_id uuid not null references public.profiles (id) on delete cascade,
  collection_id uuid not null references public.collections (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, collection_id)
);

create table public.user_collectibles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  collectible_id uuid not null references public.collectibles (id) on delete restrict,
  physical_status public.physical_status not null default 'owned',
  condition public.card_condition,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  user_collectible_id uuid not null references public.user_collectibles (id) on delete cascade,
  collectible_id uuid not null references public.collectibles (id) on delete restrict,
  status public.listing_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index listings_one_active_copy_idx
  on public.listings (user_collectible_id)
  where status = 'active';

create table public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  collectible_id uuid not null references public.collectibles (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint wishlists_one_per_card unique (user_id, collectible_id)
);

create table public.user_locations (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  geog extensions.geography(Point, 4326) not null,
  precision_level public.location_precision not null default 'approximate',
  consent boolean not null default false,
  updated_at timestamptz not null default now(),
  constraint user_locations_consent_required check (consent = true)
);

create table public.trades (
  id uuid primary key default gen_random_uuid(),
  proposer_id uuid not null references public.profiles (id) on delete restrict,
  recipient_id uuid not null references public.profiles (id) on delete restrict,
  status public.trade_status not null default 'proposed',
  message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trades_distinct_parties check (proposer_id <> recipient_id)
);

create table public.trade_items (
  id uuid primary key default gen_random_uuid(),
  trade_id uuid not null references public.trades (id) on delete cascade,
  user_collectible_id uuid not null references public.user_collectibles (id) on delete restrict,
  direction public.trade_direction not null,
  created_at timestamptz not null default now(),
  constraint trade_items_one_copy unique (trade_id, user_collectible_id)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  trade_id uuid not null references public.trades (id) on delete cascade,
  reviewer_id uuid not null references public.profiles (id) on delete restrict,
  reviewed_user_id uuid not null references public.profiles (id) on delete restrict,
  rating integer not null,
  comment text,
  created_at timestamptz not null default now(),
  constraint reviews_rating_range check (rating between 1 and 5),
  constraint reviews_not_self check (reviewer_id <> reviewed_user_id),
  constraint reviews_one_per_party unique (trade_id, reviewer_id)
);

