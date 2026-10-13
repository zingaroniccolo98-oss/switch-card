import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";

export type GameOption = {
  slug: string;
  name: string;
};

export type CollectionSummary = {
  id: string;
  title: string;
  slug: string;
  coverUrl: string | null;
  releaseYear: number | null;
  collectibleCount: number;
};

export type CollectibleSummary = {
  id: string;
  number: string;
  name: string;
  variant: string;
  category: string | null;
  imageUrl: string | null;
};

export type DataResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: "unavailable" };

function unavailable<T>(): DataResult<T> {
  return { ok: false, error: "unavailable" };
}

export async function getGames(): Promise<DataResult<GameOption[]>> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog");

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("games")
    .select("slug,name")
    .order("name");

  if (error || !data) {
    return unavailable();
  }

  return { ok: true, data };
}

export async function getPublishedCollections(): Promise<
  DataResult<CollectionSummary[]>
> {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog");

  const supabase = createPublicClient();
  const [{ data, error }, stats] = await Promise.all([
    supabase
      .from("collections")
      .select("id,title,slug,cover_url,release_year")
      .eq("catalog_status", "published")
      .order("release_year", { ascending: false })
      .limit(24),
    supabase.from("collection_stats").select("collection_id,collectible_count"),
  ]);

  if (error || !data || stats.error || !stats.data) {
    return unavailable();
  }

  const counts = new Map(
    stats.data.map((row) => [row.collection_id, row.collectible_count]),
  );

  return {
    ok: true,
    data: data.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      coverUrl: row.cover_url,
      releaseYear: row.release_year,
      collectibleCount: counts.get(row.id) ?? 0,
    })),
  };
}

export async function getCollection(slug: string): Promise<
  DataResult<{
    collection: CollectionSummary;
    collectibles: CollectibleSummary[];
  } | null>
> {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog");

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("collections")
    .select("id,title,slug,cover_url,release_year")
    .eq("slug", slug)
    .eq("catalog_status", "published")
    .maybeSingle();

  if (error) {
    return unavailable();
  }

  if (!data) {
    return { ok: true, data: null };
  }

  const cards = await supabase
    .from("collectibles")
    .select("id,number,name,variant,category,image_url")
    .eq("collection_id", data.id)
    .order("number")
    .limit(80);

  if (cards.error || !cards.data) {
    return unavailable();
  }

  return {
    ok: true,
    data: {
      collection: {
        id: data.id,
        title: data.title,
        slug: data.slug,
        coverUrl: data.cover_url,
        releaseYear: data.release_year,
        collectibleCount: cards.data.length,
      },
      collectibles: cards.data.map((card) => ({
        id: card.id,
        number: card.number,
        name: card.name,
        variant: card.variant,
        category: card.category,
        imageUrl: card.image_url,
      })),
    },
  };
}

export async function getCollectible(id: string): Promise<
  DataResult<{
    id: string;
    number: string;
    name: string;
    variant: string;
    category: string | null;
    imageUrl: string | null;
    collectionTitle: string;
    collectionSlug: string;
  } | null>
> {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog");

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("collectibles")
    .select("id,number,name,variant,category,image_url,collections!inner(title,slug,catalog_status)")
    .eq("id", id)
    .eq("collections.catalog_status", "published")
    .maybeSingle();

  if (error) {
    return unavailable();
  }

  if (!data) {
    return { ok: true, data: null };
  }

  const collection = Array.isArray(data.collections)
    ? data.collections[0]
    : data.collections;

  return {
    ok: true,
    data: {
      id: data.id,
      number: data.number,
      name: data.name,
      variant: data.variant,
      category: data.category,
      imageUrl: data.image_url,
      collectionTitle: collection?.title ?? "",
      collectionSlug: collection?.slug ?? "",
    },
  };
}
