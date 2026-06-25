import { MetadataRoute } from "next";
import { getListings } from "@/lib/db";

const BASE = "https://trini-market.vercel.app";

const CATEGORIES = ["Electronics","Vehicles","Real Estate","Fashion","Food & Beverage","Services","Home & Garden","Sports & Outdoors"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await getListings();

  const listingUrls = listings.map((l) => ({
    url: `${BASE}/listings/${l.id}`,
    lastModified: new Date(l.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryUrls = CATEGORIES.map((cat) => ({
    url: `${BASE}/listings?category=${encodeURIComponent(cat)}`,
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  return [
    { url: BASE, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/listings`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE}/businesses`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/pricing`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/terms`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/privacy`, changeFrequency: "monthly", priority: 0.3 },
    ...categoryUrls,
    ...listingUrls,
  ];
}
