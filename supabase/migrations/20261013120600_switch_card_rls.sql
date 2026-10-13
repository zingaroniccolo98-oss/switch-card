-- Row Level Security. Anonymous role can read published catalog data and active listings only.

alter table public.publishers enable row level security;
alter table public.games enable row level security;
alter table public.collections enable row level security;
alter table public.collectibles enable row level security;
alter table public.profiles enable row level security;
alter table public.user_collections enable row level security;
alter table public.user_collectibles enable row level security;
alter table public.listings enable row level security;
alter table public.wishlists enable row level security;
alter table public.user_locations enable row level security;
alter table public.trades enable row level security;
alter table public.trade_items enable row level security;
alter table public.reviews enable row level security;

revoke all on table public.publishers from anon, authenticated;
revoke all on table public.games from anon, authenticated;
revoke all on table public.collections from anon, authenticated;
revoke all on table public.collectibles from anon, authenticated;
revoke all on table public.profiles from anon, authenticated;
revoke all on table public.user_collections from anon, authenticated;
revoke all on table public.user_collectibles from anon, authenticated;
revoke all on table public.listings from anon, authenticated;
revoke all on table public.wishlists from anon, authenticated;
revoke all on table public.user_locations from anon, authenticated;
revoke all on table public.trades from anon, authenticated;
revoke all on table public.trade_items from anon, authenticated;
revoke all on table public.reviews from anon, authenticated;

grant select on table public.publishers to anon, authenticated;
grant select on table public.games to anon, authenticated;
grant select on table public.collections to anon, authenticated;
grant select on table public.collectibles to anon, authenticated;
grant select on table public.profiles to anon, authenticated;
grant select on table public.listings to anon, authenticated;
grant select on table public.reviews to anon, authenticated;
grant select on table public.public_listings to anon, authenticated;
grant select on table public.collection_stats to anon, authenticated;

grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, delete on table public.user_collections to authenticated;
grant select, insert, update, delete on table public.user_collectibles to authenticated;
grant select, insert, update, delete on table public.listings to authenticated;
grant select, insert, delete on table public.wishlists to authenticated;
grant select, insert, update, delete on table public.user_locations to authenticated;
grant select, insert, update on table public.trades to authenticated;
grant select, insert on table public.trade_items to authenticated;
grant select, insert on table public.reviews to authenticated;

create policy publishers_read on public.publishers
for select to anon, authenticated
using (true);

create policy games_read on public.games
for select to anon, authenticated
using (true);

create policy collections_read on public.collections
for select to anon, authenticated
using (catalog_status = 'published');

create policy collectibles_read on public.collectibles
for select to anon, authenticated
using (
  exists (
    select 1
    from public.collections
    where collections.id = collectibles.collection_id
      and collections.catalog_status = 'published'
  )
);

create policy profiles_read on public.profiles
for select to anon, authenticated
using (true);

create policy profiles_insert on public.profiles
for insert to authenticated
with check (id = (select auth.uid()));

create policy profiles_update on public.profiles
for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy user_collections_owner on public.user_collections
for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy user_collectibles_owner on public.user_collectibles
for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy listings_read on public.listings
for select to anon, authenticated
using (status = 'active' or owner_id = (select auth.uid()));

create policy listings_insert on public.listings
for insert to authenticated
with check (owner_id = (select auth.uid()));

create policy listings_update on public.listings
for update to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

create policy listings_delete on public.listings
for delete to authenticated
using (owner_id = (select auth.uid()));

create policy wishlists_owner on public.wishlists
for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy user_locations_owner on public.user_locations
for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy trades_read on public.trades
for select to authenticated
using (
  proposer_id = (select auth.uid())
  or recipient_id = (select auth.uid())
);

create policy trades_insert on public.trades
for insert to authenticated
with check (proposer_id = (select auth.uid()));

create policy trades_update on public.trades
for update to authenticated
using (
  proposer_id = (select auth.uid())
  or recipient_id = (select auth.uid())
)
with check (
  proposer_id = (select auth.uid())
  or recipient_id = (select auth.uid())
);

create policy trade_items_read on public.trade_items
for select to authenticated
using (
  exists (
    select 1
    from public.trades
    where trades.id = trade_items.trade_id
      and (
        trades.proposer_id = (select auth.uid())
        or trades.recipient_id = (select auth.uid())
      )
  )
);

create policy trade_items_insert on public.trade_items
for insert to authenticated
with check (
  exists (
    select 1
    from public.trades
    where trades.id = trade_items.trade_id
      and trades.proposer_id = (select auth.uid())
      and trades.status = 'proposed'
  )
);

create policy reviews_read on public.reviews
for select to anon, authenticated
using (true);

create policy reviews_insert on public.reviews
for insert to authenticated
with check (
  reviewer_id = (select auth.uid())
  and exists (
    select 1
    from public.trades
    where trades.id = reviews.trade_id
      and trades.status = 'completed'
      and (
        trades.proposer_id = (select auth.uid())
        or trades.recipient_id = (select auth.uid())
      )
      and reviewed_user_id in (trades.proposer_id, trades.recipient_id)
      and reviewed_user_id <> (select auth.uid())
  )
);
