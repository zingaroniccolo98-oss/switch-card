-- Starter catalog so the published collections are visible.
-- Not an official Panini, Pokémon, or Yu-Gi-Oh checklist.
-- No users, listings, locations, or trades.

insert into public.publishers (name, slug)
values
  ('Panini', 'panini'),
  ('The Pokémon Company', 'the-pokemon-company'),
  ('Konami', 'konami')
on conflict (slug) do nothing;

insert into public.games (name, slug, category)
values
  ('Calcio', 'calcio', 'sport'),
  ('Pokémon', 'pokemon', 'tcg'),
  ('Yu-Gi-Oh!', 'yu-gi-oh', 'tcg')
on conflict (slug) do nothing;

insert into public.collections (
  publisher_id,
  game_id,
  title,
  slug,
  release_year,
  catalog_status,
  catalog_version,
  metadata
)
select
  p.id,
  g.id,
  seed.title,
  seed.slug,
  seed.release_year,
  'published'::public.catalog_status,
  'starter-1',
  '{"official": false}'::jsonb
from (
  values
    ('panini', 'calcio', 'Panini Calciatori 2026-27', 'panini-calciatori-2026-27', 2026),
    ('the-pokemon-company', 'pokemon', 'Pokémon', 'pokemon', 2026),
    ('konami', 'yu-gi-oh', 'Yu-Gi-Oh!', 'yu-gi-oh', 2026)
) as seed(publisher_slug, game_slug, title, slug, release_year)
join public.publishers p on p.slug = seed.publisher_slug
join public.games g on g.slug = seed.game_slug
on conflict (slug) do nothing;

insert into public.collectibles (
  collection_id,
  number,
  name,
  variant,
  category,
  source,
  metadata
)
select
  c.id,
  seed.number,
  seed.name,
  '',
  seed.category,
  'manual',
  '{"official": false}'::jsonb
from (
  values
    ('panini-calciatori-2026-27', '001', 'Lautaro Martinez', 'sticker'),
    ('panini-calciatori-2026-27', '002', 'Dusan Vlahovic', 'sticker'),
    ('panini-calciatori-2026-27', '003', 'Rafael Leao', 'sticker'),
    ('panini-calciatori-2026-27', '004', 'Federico Chiesa', 'sticker'),
    ('panini-calciatori-2026-27', '005', 'Nicolo Barella', 'sticker'),
    ('panini-calciatori-2026-27', '006', 'Alessandro Bastoni', 'sticker'),
    ('panini-calciatori-2026-27', '007', 'Khvicha Kvaratskhelia', 'sticker'),
    ('panini-calciatori-2026-27', '008', 'Victor Osimhen', 'sticker'),
    ('panini-calciatori-2026-27', '009', 'Paulo Dybala', 'sticker'),
    ('panini-calciatori-2026-27', '010', 'Gianluigi Donnarumma', 'sticker'),
    ('panini-calciatori-2026-27', '011', 'Giovanni Di Lorenzo', 'sticker'),
    ('panini-calciatori-2026-27', '012', 'Theo Hernandez', 'sticker'),
    ('panini-calciatori-2026-27', '013', 'Hakan Calhanoglu', 'sticker'),
    ('panini-calciatori-2026-27', '014', 'Ademola Lookman', 'sticker'),
    ('panini-calciatori-2026-27', '015', 'Matteo Politano', 'sticker'),
    ('panini-calciatori-2026-27', '016', 'Riccardo Calafiori', 'sticker'),
    ('panini-calciatori-2026-27', '017', 'Moise Kean', 'sticker'),
    ('panini-calciatori-2026-27', '018', 'Sandro Tonali', 'sticker'),
    ('panini-calciatori-2026-27', '019', 'Lorenzo Pellegrini', 'sticker'),
    ('panini-calciatori-2026-27', '020', 'Davide Frattesi', 'sticker'),
    ('pokemon', '001', 'Pikachu', 'card'),
    ('pokemon', '002', 'Charizard', 'card'),
    ('pokemon', '003', 'Bulbasaur', 'card'),
    ('pokemon', '004', 'Squirtle', 'card'),
    ('pokemon', '005', 'Eevee', 'card'),
    ('pokemon', '006', 'Mewtwo', 'card'),
    ('pokemon', '007', 'Gengar', 'card'),
    ('pokemon', '008', 'Lucario', 'card'),
    ('yu-gi-oh', '001', 'Blue-Eyes White Dragon', 'card'),
    ('yu-gi-oh', '002', 'Dark Magician', 'card'),
    ('yu-gi-oh', '003', 'Red-Eyes Black Dragon', 'card'),
    ('yu-gi-oh', '004', 'Exodia the Forbidden One', 'card'),
    ('yu-gi-oh', '005', 'Dark Magician Girl', 'card'),
    ('yu-gi-oh', '006', 'Summoned Skull', 'card')
) as seed(collection_slug, number, name, category)
join public.collections c on c.slug = seed.collection_slug
on conflict (collection_id, number, variant) do nothing;
