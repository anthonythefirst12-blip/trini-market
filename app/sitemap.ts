import { MetadataRoute } from "next";
import { getListings, getAllSellerIds } from "@/lib/db";

const BASE = "https://trinisell.tt";

const CATEGORIES = ["Electronics","Vehicles","Real Estate","Fashion","Food & Beverage","Services","Home & Garden","Sports & Outdoors"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [listings, sellers] = await Promise.all([getListings(), getAllSellerIds()]);

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

  const profileUrls = sellers.map((s) => ({
    url: `${BASE}/profile/${s.id}`,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const storeUrls = sellers
    .filter((s) => s.isPro)
    .map((s) => ({
      url: `${BASE}/store/${s.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [
    { url: BASE, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/listings`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE}/businesses`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/pricing`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/how-it-works`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/terms`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/privacy`, changeFrequency: "monthly", priority: 0.3 },
    ...categoryUrls,
    ...storeUrls,
    ...listingUrls,
    ...profileUrls,
  ];
}
