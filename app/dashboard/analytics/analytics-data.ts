// Pure data-derivation helpers for the analytics dashboard.
// Everything here is computed from the REAL data in lib/data.ts — no random mocks.
// Kept framework-agnostic (no React) so it can be reused and reasoned about.

import { listings, inquiries, walletTransactions } from "@/lib/data";
import type { Category, Listing, ListingTier } from "@/lib/types";

export type { Category, ListingTier };

// Brand-aligned palette. Primary is the TriniMarket blue (#1D4ED8); the rest
// are tints/complements chosen for AA contrast on white and clear separation.
export const PALETTE = [
  "#1D4ED8", // primary blue
  "#0EA5E9", // sky
  "#7C3AED", // violet
  "#F59E0B", // amber
  "#10B981", // emerald
  "#EF4444", // red
  "#EC4899", // pink
  "#14B8A6", // teal
];

export const TIER_COLORS: Record<ListingTier, string> = {
  premium: "#1D4ED8",
  featured: "#7C3AED",
  free: "#94A3B8",
};

export const TIER_LABELS: Record<ListingTier, string> = {
  premium: "Premium",
  featured: "Featured",
  free: "Free",
};

// All distinct categories present in the data, sorted for stable UI ordering.
export const ALL_CATEGORIES: Category[] = Array.from(
  new Set(listings.map((l) => l.category)),
).sort() as Category[];

// Time-range options drive the inquiries/wallet trend window.
export const TIME_RANGES = [
  { id: "30d", label: "30 days", days: 30 },
  { id: "90d", label: "90 days", days: 90 },
  { id: "all", label: "All time", days: Number.POSITIVE_INFINITY },
] as const;

export type TimeRangeId = (typeof TIME_RANGES)[number]["id"];

// "Today" per the project's currentDate context (2026-06-16). A fixed reference
// keeps the demo deterministic regardless of the real wall clock.
const REFERENCE_DATE = new Date("2026-06-16T00:00:00Z");

function daysAgo(dateStr: string): number {
  const d = new Date(dateStr);
  return Math.floor((REFERENCE_DATE.getTime() - d.getTime()) / 86_400_000);
}

export function formatTTD(amount: number, fractionDigits = 0): string {
  return new Intl.NumberFormat("en-TT", {
    style: "currency",
    currency: "TTD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
}

export function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-TT", {
    month: "short",
    day: "numeric",
  });
}

export interface TopListing {
  id: string;
  title: string;
  category: Category;
  tier: ListingTier;
  price: number;
  inquiries: number;
  comments: number;
}

export interface Metrics {
  totalListings: number;
  totalInquiries: number;
  avgPrice: number;
  paidShare: number; // fraction of listings that are featured OR premium
  paidCount: number;
  totalWalletSpend: number;
  categoryData: { category: string; listings: number; inquiries: number }[];
  tierData: { name: string; tier: ListingTier; value: number }[];
  trendData: { date: string; label: string; inquiries: number; spend: number }[];
  topListings: TopListing[];
}

/**
 * Compute all dashboard metrics for a given category filter + time range.
 * @param category a Category, or "all" for no category filter
 * @param rangeId  one of the TIME_RANGES ids
 */
export function computeMetrics(
  category: Category | "all",
  rangeId: TimeRangeId,
): Metrics {
  const range = TIME_RANGES.find((r) => r.id === rangeId) ?? TIME_RANGES[0];
  const maxDays = range.days;
  const inRange = (dateStr: string) => daysAgo(dateStr) <= maxDays;

  // Listings filtered by category. The time filter applies to events
  // (inquiries / spend), not the listing catalogue itself.
  const filteredListings: Listing[] =
    category === "all"
      ? listings
      : listings.filter((l) => l.category === category);

  const listingIds = new Set(filteredListings.map((l) => l.id));

  const scopedInquiries = inquiries.filter(
    (i) => listingIds.has(i.listingId) && inRange(i.createdAt),
  );

  // Wallet spend is account-level (not tagged by category) — scope by time only.
  const scopedSpend = walletTransactions.filter(
    (t) => t.type === "spend" && inRange(t.date),
  );
  const totalWalletSpend = scopedSpend.reduce((sum, t) => sum + t.amount, 0);

  const totalListings = filteredListings.length;
  const totalInquiries = scopedInquiries.length;

  const avgPrice =
    totalListings === 0
      ? 0
      : filteredListings.reduce((sum, l) => sum + l.price, 0) / totalListings;

  const paidCount = filteredListings.filter((l) => l.tier !== "free").length;
  const paidShare = totalListings === 0 ? 0 : paidCount / totalListings;

  // Listings + inquiries grouped by category.
  const categoryMap = new Map<string, { listings: number; inquiries: number }>();
  for (const l of filteredListings) {
    const entry = categoryMap.get(l.category) ?? { listings: 0, inquiries: 0 };
    entry.listings += 1;
    categoryMap.set(l.category, entry);
  }
  for (const i of scopedInquiries) {
    const listing = listings.find((l) => l.id === i.listingId);
    if (!listing) continue;
    const entry = categoryMap.get(listing.category) ?? {
      listings: 0,
      inquiries: 0,
    };
    entry.inquiries += 1;
    categoryMap.set(listing.category, entry);
  }
  const categoryData = Array.from(categoryMap.entries())
    .map(([cat, v]) => ({ category: cat, ...v }))
    .sort((a, b) => b.listings - a.listings);

  // Listings by tier (for the donut).
  const tierCounts: Record<ListingTier, number> = {
    free: 0,
    featured: 0,
    premium: 0,
  };
  for (const l of filteredListings) tierCounts[l.tier] += 1;
  const tierData = (Object.keys(tierCounts) as ListingTier[])
    .map((tier) => ({ name: TIER_LABELS[tier], tier, value: tierCounts[tier] }))
    .filter((d) => d.value > 0);

  // Trend: bucket inquiries + spend by day, keep only days inside the window,
  // then order chronologically for the area chart.
  const trendMap = new Map<string, { inquiries: number; spend: number }>();
  const ensure = (date: string) =>
    trendMap.get(date) ?? { inquiries: 0, spend: 0 };
  for (const i of scopedInquiries) {
    const date = i.createdAt.slice(0, 10);
    const e = ensure(date);
    e.inquiries += 1;
    trendMap.set(date, e);
  }
  for (const t of scopedSpend) {
    const date = t.date.slice(0, 10);
    const e = ensure(date);
    e.spend += t.amount;
    trendMap.set(date, e);
  }
  const trendData = Array.from(trendMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, v]) => ({ date, label: formatDateShort(date), ...v }));

  // Top listings: engagement = inquiries in window + the listing's comments.
  const inquiryCountByListing = new Map<string, number>();
  for (const i of scopedInquiries) {
    inquiryCountByListing.set(
      i.listingId,
      (inquiryCountByListing.get(i.listingId) ?? 0) + 1,
    );
  }
  const topListings: TopListing[] = filteredListings.map((l) => ({
    id: l.id,
    title: l.title,
    category: l.category,
    tier: l.tier,
    price: l.price,
    inquiries: inquiryCountByListing.get(l.id) ?? 0,
    comments: l.commentCount ?? 0,
  }));

  return {
    totalListings,
    totalInquiries,
    avgPrice,
    paidShare,
    paidCount,
    totalWalletSpend,
    categoryData,
    tierData,
    trendData,
    topListings,
  };
}
