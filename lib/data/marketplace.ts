import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import type { DataResult } from "@/lib/data/catalog";

export type PublicListing = {
  id: string;
  collectibleId: string;
  createdAt: string;
  number: string;
  name: string;
  variant: string;
  category: string | null;
  imageUrl: string | null;
  collectionTitle: string;
  collectionSlug: string;
  gameSlug: string;
  gameName: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
};

export type ListingFilters = {
  q?: string;
  game?: string;
  collection?: string;
  number?: string;
  category?: string;
  sort?: "recent" | "name";
  page?: number;
};

const pageSize = 20;

function sanitize(value: string) {
  return value.replace(/[%_,.()]/g, " ").replace(/\s+/g, " ").trim();
}

function mapListing(row: {
  id: string;
  collectible_id: string;
  created_at: string;
  number: string;
  collectible_name: string;
  variant: string;
  category: string | null;
  image_url: string | null;
  collection_title: string;
  collection_slug: string;
  game_slug: string;
  game_name: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
}): PublicListing {
  return {
    id: row.id,
    collectibleId: row.collectible_id,
    createdAt: row.created_at,
    number: row.number,
    name: row.collectible_name,
    variant: row.variant,
    category: row.category,
    imageUrl: row.image_url,
    collectionTitle: row.collection_title,
    collectionSlug: row.collection_slug,
    gameSlug: row.game_slug,
    gameName: row.game_name,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
  };
}

export async function getListings(
  filters: ListingFilters,
): Promise<DataResult<{ items: PublicListing[]; total: number }>> {
  "use cache";
  cacheLife("minutes");
  cacheTag("listings");

  const supabase = createPublicClient();
  const page = Math.max(0, filters.page ?? 0);
  let query = supabase
    .from("public_listings")
    .select("*", { count: "exact" });

  const term = filters.q ? sanitize(filters.q) : "";
  if (term) {
    query = query.or(
      `collectible_name.ilike.%${term}%,number.ilike.%${term}%,username.ilike.%${term}%`,
    );
  }
  if (filters.game) {
    query = query.eq("game_slug", filters.game);
  }
  if (filters.collection) {
    query = query.eq("collection_slug", filters.collection);
  }
  if (filters.number) {
    query = query.eq("number", filters.number.trim());
  }
  if (filters.category) {
    query = query.eq("category", filters.category);
  }

  query =
    filters.sort === "name"
      ? query.order("collectible_name", { ascending: true })
      : query.order("created_at", { ascending: false });

  const { data, error, count } = await query.range(
    page * pageSize,
    page * pageSize + pageSize - 1,
  );

  if (error || !data) {
    return { ok: false, error: "unavailable" };
  }

  return {
    ok: true,
    data: { items: data.map(mapListing), total: count ?? data.length },
  };
}

export async function getProfile(username: string): Promise<
  DataResult<{
    username: string;
    displayName: string;
    avatarUrl: string | null;
    bio: string | null;
    listings: PublicListing[];
  } | null>
> {
  "use cache";
  cacheLife("minutes");
  cacheTag("listings");

  const supabase = createPublicClient();
  const profile = await supabase
    .from("profiles")
    .select("username,display_name,avatar_url,bio")
    .ilike("username", username)
    .maybeSingle();

  if (profile.error) {
    return { ok: false, error: "unavailable" };
  }

  if (!profile.data) {
    return { ok: true, data: null };
  }

  const listings = await supabase
    .from("public_listings")
    .select("*")
    .eq("username", profile.data.username)
    .order("created_at", { ascending: false })
    .limit(40);

  if (listings.error || !listings.data) {
    return { ok: false, error: "unavailable" };
  }

  return {
    ok: true,
    data: {
      username: profile.data.username,
      displayName: profile.data.display_name,
      avatarUrl: profile.data.avatar_url,
      bio: profile.data.bio,
      listings: listings.data.map(mapListing),
    },
  };
}

export async function getListing(id: string): Promise<DataResult<PublicListing | null>> {
  "use cache";
  cacheLife("minutes");
  cacheTag("listings");

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("public_listings")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return { ok: false, error: "unavailable" };
  }

  return { ok: true, data: data ? mapListing(data) : null };
}

export { pageSize };
