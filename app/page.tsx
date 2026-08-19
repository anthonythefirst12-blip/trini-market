export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TriniSell — Buy & Sell Locally in Trinidad & Tobago",
  description: "Trinidad & Tobago's trusted online marketplace. Buy and sell cars, electronics, real estate, fashion and more — locally, safely, for free.",
  openGraph: {
    title: "TriniSell — Buy & Sell Locally in Trinidad & Tobago",
    description: "Trinidad & Tobago's trusted online marketplace. Buy and sell cars, electronics, real estate, fashion and more — locally, safely, for free.",
    type: "website",
    url: "https://trinisell.tt",
  },
  twitter: { card: "summary_large_image", title: "TriniSell", description: "Trinidad & Tobago's local marketplace." },
  alternates: { canonical: "https://trinisell.tt" },
};
import { getPremiumListings, getFeaturedListings, getRecentListings, getCategoryCounts, getSiteStats } from "@/lib/db";
import { ListingCard } from "@/components/listings/ListingCard";
import { RecentlyViewed } from "@/components/home/RecentlyViewed";
import { IslandHero } from "@/components/ui/IslandHero";
import { Laptop, Car, Home, Shirt, UtensilsCrossed, Wrench, Sofa, Bike } from "lucide-react";

const CATEGORIES = [
  { name: "Electronics",       Icon: Laptop,          color: "text-violet-500", hover: "hover:border-violet-200 hover:bg-violet-50", hoverText: "group-hover:text-violet-600", hoverCount: "group-hover:text-violet-300" },
  { name: "Vehicles",          Icon: Car,             color: "text-blue-500",   hover: "hover:border-blue-200   hover:bg-blue-50",   hoverText: "group-hover:text-blue-600",   hoverCount: "group-hover:text-blue-300"   },
  { name: "Real Estate",       Icon: Home,            color: "text-emerald-500",hover: "hover:border-emerald-200 hover:bg-emerald-50",hoverText: "group-hover:text-emerald-600",hoverCount: "group-hover:text-emerald-300"},
  { name: "Fashion",           Icon: Shirt,           color: "text-pink-500",   hover: "hover:border-pink-200   hover:bg-pink-50",   hoverText: "group-hover:text-pink-600",   hoverCount: "group-hover:text-pink-300"   },
  { name: "Food & Beverage",   Icon: UtensilsCrossed, color: "text-orange-500", hover: "hover:border-orange-200 hover:bg-orange-50", hoverText: "group-hover:text-orange-600", hoverCount: "group-hover:text-orange-300" },
  { name: "Services",          Icon: Wrench,          color: "text-gray-400",   hover: "hover:border-gray-300   hover:bg-gray-100",  hoverText: "group-hover:text-gray-700",   hoverCount: "group-hover:text-gray-400"   },
  { name: "Home & Garden",     Icon: Sofa,            color: "text-green-500",  hover: "hover:border-green-200  hover:bg-green-50",  hoverText: "group-hover:text-green-600",  hoverCount: "group-hover:text-green-300"  },
  { name: "Sports & Outdoors", Icon: Bike,            color: "text-cyan-500",   hover: "hover:border-cyan-200   hover:bg-cyan-50",   hoverText: "group-hover:text-cyan-600",   hoverCount: "group-hover:text-cyan-300"   },
];

export default async function HomePage() {
  const [premium, featured, recent, categoryCounts, stats] = await Promise.all([
    getPremiumListings(),
    getFeaturedListings(),
    getRecentListings(8),
    getCategoryCounts(),
    getSiteStats(),
  ]);

  return (
    <div className="bg-white">

      {/* Categories — above the fold */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 sm:gap-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/listings?category=${encodeURIComponent(cat.name)}`}
                className={`ripple-chip group flex flex-col items-center gap-1 p-2 sm:p-2.5 rounded-xl border border-transparent ${cat.hover} active:scale-95 transition-all duration-200 text-center`}
              >
                <cat.Icon className={`w-5 h-5 sm:w-5 sm:h-5 ${cat.color} transition-colors`} strokeWidth={1.5} />
                <span className={`text-[10px] sm:text-[11px] font-medium text-gray-600 ${cat.hoverText} leading-tight transition-colors`}>{cat.name}</span>
                <span className={`hidden sm:block text-[10px] text-gray-300 ${cat.hoverCount} transition-colors`}>{categoryCounts[cat.name] ?? 0}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hero */}
      <IslandHero listingCount={stats.listings} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-10 space-y-8 sm:space-y-12">

        {/* Premium */}
        {premium.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-xl text-gray-900">Premium Picks</h2>
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">★ Premium</span>
              </div>
              <Link href="/listings" className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors">View all →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {premium.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          </section>
        )}

        {/* Featured */}
        {featured.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-xl text-gray-900">Featured Listings</h2>
              <Link href="/listings" className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors">View all →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {featured.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          </section>
        )}

        {/* Recent */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-xl text-gray-900">Recently Listed</h2>
            <Link href="/listings" className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors">View all →</Link>
          </div>
          {recent.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="text-4xl mb-3">🏪</div>
              <p className="font-display font-semibold text-gray-700">No listings yet</p>
              <p className="text-gray-400 text-sm mt-1 mb-5">Be the first to post something!</p>
              <Link href="/listings/new" className="inline-flex items-center gap-2 bg-red-600 text-white font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-red-700 hover:shadow-[0_0_20px_rgba(220,38,38,0.35)] active:scale-95 transition-all">
                Post a Listing
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {recent.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          )}
        </section>
      </div>

      {/* Recently viewed */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <RecentlyViewed />
      </div>

      {/* CTA banner */}
      <section className="bg-gray-50 border-t border-gray-100 mt-8">
        <div className="max-w-3xl mx-auto px-4 py-14 text-center">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 mb-3">
            Ready to sell something?
          </h2>
          <p className="text-gray-500 mb-7">Post your listing in minutes. Reach buyers across T&amp;T for free.</p>
          <Link
            href="/listings/new"
            className="inline-flex items-center gap-2 bg-red-600 text-white font-bold px-8 py-3.5 rounded-full hover:bg-red-700 hover:shadow-[0_0_24px_rgba(220,38,38,0.4)] active:scale-95 transition-all duration-200"
          >
            + Post a Free Listing
          </Link>
        </div>
      </section>
    </div>
  );
}
