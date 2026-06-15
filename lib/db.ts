import { supabase } from "./supabase";
import { Listing, Seller, Comment, CommentReply } from "./types";
import { Category, ListingCondition } from "./types";

// ── Row types (snake_case from Postgres) ─────────────────────────────────────

interface SellerRow {
  id: string;
  name: string;
  avatar: string;
  joined_date: string;
  rating: number;
  review_count: number;
  location: string;
  verified: boolean;
  is_pro: boolean;
  business_name: string | null;
  bio: string | null;
  banner: string | null;
  listing_count: number;
}

interface ListingRow {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  condition: string;
  location: string;
  images: string[];
  seller_id: string;
  created_at: string;
  featured: boolean;
  tier: "free" | "featured" | "premium";
  tags: string[];
  negotiable: boolean;
  comment_count: number;
  views: number;
  sellers: SellerRow;
}

interface CommentReplyRow {
  id: string;
  comment_id: string;
  author_name: string;
  author_avatar: string;
  text: string;
  created_at: string;
}

interface CommentRow {
  id: string;
  listing_id: string;
  author_name: string;
  author_avatar: string;
  text: string;
  created_at: string;
  comment_replies: CommentReplyRow[];
}

// ── Mappers ───────────────────────────────────────────────────────────────────

function mapSeller(row: SellerRow): Seller {
  return {
    id: row.id,
    name: row.name,
    avatar: row.avatar,
    joinedDate: row.joined_date,
    rating: row.rating,
    reviewCount: row.review_count,
    location: row.location,
    verified: row.verified,
    isPro: row.is_pro,
    businessName: row.business_name ?? undefined,
    bio: row.bio ?? undefined,
    banner: row.banner ?? undefined,
    listingCount: row.listing_count ?? undefined,
  };
}

function mapListing(row: ListingRow): Listing {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price,
    currency: row.currency as "TTD" | "USD",
    category: row.category as Category,
    condition: row.condition as ListingCondition,
    location: row.location,
    images: row.images ?? [],
    seller: mapSeller(row.sellers),
    createdAt: row.created_at,
    featured: row.featured,
    tier: row.tier,
    tags: row.tags ?? [],
    negotiable: row.negotiable,
    commentCount: row.comment_count,
    views: row.views ?? 0,
  };
}

function mapComment(row: CommentRow): Comment {
  return {
    id: row.id,
    listingId: row.listing_id,
    authorName: row.author_name,
    authorAvatar: row.author_avatar,
    text: row.text,
    createdAt: row.created_at,
    replies: (row.comment_replies ?? []).map(
      (r): CommentReply => ({
        id: r.id,
        authorName: r.author_name,
        authorAvatar: r.author_avatar,
        text: r.text,
        createdAt: r.created_at,
      })
    ),
  };
}

// ── Listings ──────────────────────────────────────────────────────────────────

export async function getListings(filters?: {
  q?: string;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<Listing[]> {
  let query = supabase
    .from("listings")
    .select("*, sellers(*)")
    .order("created_at", { ascending: false });

  if (filters?.q) {
    query = query.ilike("title", `%${filters.q}%`);
  }
  if (filters?.category) {
    query = query.eq("category", filters.category);
  }
  if (filters?.location) {
    query = query.ilike("location", `%${filters.location}%`);
  }
  if (filters?.minPrice !== undefined) {
    query = query.gte("price", filters.minPrice);
  }
  if (filters?.maxPrice !== undefined) {
    query = query.lte("price", filters.maxPrice);
  }

  const { data, error } = await query;
  if (error) { console.error("getListings:", error.message); return []; }
  return (data as ListingRow[]).map(mapListing);
}

export async function getListing(id: string): Promise<Listing | null> {
  const { data, error } = await supabase
    .from("listings")
    .select("*, sellers(*)")
    .eq("id", id)
    .single();

  if (error) { console.error("getListing:", error.message); return null; }
  return mapListing(data as ListingRow);
}

export async function getSellerListings(sellerId: string): Promise<Listing[]> {
  const { data, error } = await supabase
    .from("listings")
    .select("*, sellers(*)")
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });

  if (error) { console.error("getSellerListings:", error.message); return []; }
  return (data as ListingRow[]).map(mapListing);
}

export async function getPremiumListings(): Promise<Listing[]> {
  const { data, error } = await supabase
    .from("listings")
    .select("*, sellers(*)")
    .eq("tier", "premium")
    .order("created_at", { ascending: false });

  if (error) { console.error("getPremiumListings:", error.message); return []; }
  return (data as ListingRow[]).map(mapListing);
}

export async function getFeaturedListings(): Promise<Listing[]> {
  const { data, error } = await supabase
    .from("listings")
    .select("*, sellers(*)")
    .in("tier", ["featured", "premium"])
    .order("created_at", { ascending: false });

  if (error) { console.error("getFeaturedListings:", error.message); return []; }
  return (data as ListingRow[]).map(mapListing);
}

export async function getRecentListings(limit = 6): Promise<Listing[]> {
  const { data, error } = await supabase
    .from("listings")
    .select("*, sellers(*)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) { console.error("getRecentListings:", error.message); return []; }
  return (data as ListingRow[]).map(mapListing);
}

/** Count of listings per category — used for the homepage category grid */
export async function getCategoryCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from("listings")
    .select("category");

  if (error || !data) return {};
  const counts: Record<string, number> = {};
  for (const row of data) {
    counts[row.category] = (counts[row.category] ?? 0) + 1;
  }
  return counts;
}

// ── Comments ──────────────────────────────────────────────────────────────────

export async function getComments(listingId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*, comment_replies(*)")
    .eq("listing_id", listingId)
    .order("created_at", { ascending: true });

  if (error) { console.error("getComments:", error.message); return []; }
  return (data as CommentRow[]).map(mapComment);
}

// ── Business Directory ────────────────────────────────────────────────────────

const BIZ_CATEGORIES = ["Real Estate", "Vehicles", "Services"];

export interface BusinessEntry {
  seller: Seller;
  categories: string[];
  listingCount: number;
}

export async function getBusinesses(): Promise<BusinessEntry[]> {
  // Fetch all listings in target categories, then filter pro sellers in JS
  const { data, error } = await supabase
    .from("listings")
    .select("category, seller_id, sellers(*)")
    .in("category", BIZ_CATEGORIES);

  if (error) { console.error("getBusinesses:", error.message); return []; }

  const seen = new Map<string, BusinessEntry>();

  for (const row of (data as unknown as ListingRow[])) {
    if (!row.sellers?.is_pro) continue;
    const seller = mapSeller(row.sellers);
    if (!seen.has(seller.id)) {
      seen.set(seller.id, { seller, categories: [], listingCount: 0 });
    }
    const entry = seen.get(seller.id)!;
    if (!entry.categories.includes(row.category)) {
      entry.categories.push(row.category);
    }
    entry.listingCount += 1;
  }

  return Array.from(seen.values());
}
