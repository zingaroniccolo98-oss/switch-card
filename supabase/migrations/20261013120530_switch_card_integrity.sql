create index collections_game_idx on public.collections (game_id);
create index collections_status_idx on public.collections (catalog_status);
create index collectibles_collection_idx on public.collectibles (collection_id, number);
create index collectibles_name_trgm_idx on public.collectibles using gin (name extensions.gin_trgm_ops);
create index user_collectibles_user_idx on public.user_collectibles (user_id, collectible_id);
create index listings_status_idx on public.listings (status, created_at desc);
create index listings_collectible_idx on public.listings (collectible_id) where status = 'active';
create index trades_proposer_idx on public.trades (proposer_id, created_at desc);
create index trades_recipient_idx on public.trades (recipient_id, created_at desc);
create index user_locations_geog_idx on public.user_locations using gist (geog);

create or replace function public.enforce_listing_copy()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  copy_row public.user_collectibles%rowtype;
begin
  select * into copy_row
  from public.user_collectibles
  where id = new.user_collectible_id;

  if copy_row.id is null then
    raise exception 'copy not found';
  end if;

  if copy_row.user_id <> new.owner_id then
    raise exception 'copy does not belong to the listing owner';
  end if;

  if copy_row.physical_status = 'stuck' and new.status = 'active' then
    raise exception 'a stuck copy cannot have an active listing';
  end if;

  new.collectible_id := copy_row.collectible_id;
  return new;
end;
$$;

revoke all on function public.enforce_listing_copy() from public, anon, authenticated;

create trigger listings_enforce_copy
before insert or update of user_collectible_id, owner_id, status, collectible_id
on public.listings
for each row execute function public.enforce_listing_copy();

create or replace function public.prevent_stuck_listed_copy()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.physical_status = 'stuck' and exists (
    select 1 from public.listings
    where user_collectible_id = new.id and status = 'active'
  ) then
    raise exception 'close the active listing before marking the copy as stuck';
  end if;
  return new;
end;
$$;

revoke all on function public.prevent_stuck_listed_copy() from public, anon, authenticated;

create trigger user_collectibles_block_stuck_listing
before update of physical_status on public.user_collectibles
for each row execute function public.prevent_stuck_listed_copy();

create trigger collections_set_updated_at
before update on public.collections
for each row execute function public.set_updated_at();

create trigger collectibles_set_updated_at
before update on public.collectibles
for each row execute function public.set_updated_at();

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger user_collectibles_set_updated_at
before update on public.user_collectibles
for each row execute function public.set_updated_at();

create trigger listings_set_updated_at
before update on public.listings
for each row execute function public.set_updated_at();

create trigger trades_set_updated_at
before update on public.trades
for each row execute function public.set_updated_at();

create trigger user_locations_set_updated_at
before update on public.user_locations
for each row execute function public.set_updated_at();

create view public.public_listings
with (security_invoker = true) as
select
  l.id,
  l.owner_id,
  l.collectible_id,
  l.created_at,
  c.number,
  c.name as collectible_name,
  c.variant,
  c.category,
  c.image_url,
  col.title as collection_title,
  col.slug as collection_slug,
  g.slug as game_slug,
  g.name as game_name,
  p.username,
  p.display_name,
  p.avatar_url
from public.listings l
join public.collectibles c on c.id = l.collectible_id
join public.collections col on col.id = c.collection_id
join public.games g on g.id = col.game_id
join public.profiles p on p.id = l.owner_id
where l.status = 'active'
  and col.catalog_status = 'published';

comment on table public.user_locations is
  'Private coordinates. Never exposed through a public policy or view.';
comment on view public.public_listings is
  'Active listings safe for anonymous read. Coordinates are not included.';

create view public.collection_stats
with (security_invoker = true) as
select collection_id, count(*)::integer as collectible_count
from public.collectibles
group by collection_id;
