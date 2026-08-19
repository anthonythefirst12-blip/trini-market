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
import { getPremiumListings, getFeaturedListings, getRecentListings, getCategoryCounts, getSiteStats, getTrendingListings } from "@/lib/db";
import { ListingCard } from "@/components/listings/ListingCard";
import { RecentlyViewed } from "@/components/home/RecentlyViewed";
import { IslandHero } from "@/components/ui/IslandHero";
import { Laptop, Car, Home, Shirt, UtensilsCrossed, Wrench, Sofa, Bike, TrendingUp, Store, ArrowRight } from "lucide-react";

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
  const [premium, featured, recent, categoryCounts, stats, trending] = await Promise.all([
    getPremiumListings(),
    getFeaturedListings(),
    getRecentListings(8),
    getCategoryCounts(),
    getSiteStats(),
    getTrendingListings(8),
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10">

        {/* Top Picks — premium + featured + trending merged, max 4 */}
        {(() => {
          const topPicks = [...premium, ...featured, ...trending.filter(t => !premium.find(p => p.id === t.id) && !featured.find(f => f.id === t.id))].slice(0, 4);
          if (topPicks.length === 0) return null;
          return (
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-red-600" strokeWidth={1.5} />
                  <h2 className="font-display font-bold text-lg text-gray-900">Top Picks</h2>
                </div>
                <Link href="/listings" className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors">View all →</Link>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {topPicks.map((l) => <ListingCard key={l.id} listing={l} />)}
              </div>
            </section>
          );
        })()}

        {/* Recently Listed — main focus */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg text-gray-900">Recently Listed</h2>
            <Link href="/listings" className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors">Browse all →</Link>
          </div>
          {recent.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="font-display font-semibold text-gray-700 mb-1">No listings yet</p>
              <p className="text-gray-400 text-sm mb-5">Be the first to post something!</p>
              <Link href="/listings/new" className="inline-flex items-center gap-2 bg-red-600 text-white font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-red-700 active:scale-95 transition-all">
                Post a Listing
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {recent.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          )}
        </section>
      </div>

      {/* Recently viewed */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <RecentlyViewed />
      </div>

      {/* Business Storefront — mid banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="relative overflow-hidden rounded-2xl bg-gray-900 px-6 py-8 sm:px-10 sm:py-9">
          {/* glow */}
          <div className="absolute -top-10 -right-10 w-56 h-56 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10">
            {/* Icon */}
            <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-600 shrink-0">
              <Store className="w-6 h-6 text-white" strokeWidth={1.5} />
            </span>

            {/* Copy */}
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-white text-lg sm:text-xl mb-1">Own a business? Get your storefront.</p>
              <p className="text-gray-400 text-sm mb-4">Dealerships, real estate agencies, tech stores &amp; service businesses — get a verified branded page and reach serious buyers across T&amp;T.</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: Car,    label: "Dealerships",      color: "text-blue-400" },
                  { icon: Home,   label: "Real Estate",      color: "text-emerald-400" },
                  { icon: Laptop, label: "Tech Stores",      color: "text-violet-400" },
                  { icon: Wrench, label: "Service Businesses", color: "text-gray-400" },
                ].map(({ icon: Icon, label, color }) => (
                  <span key={label} className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-300">
                    <Icon className={`w-3.5 h-3.5 ${color}`} strokeWidth={1.5} />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/businesses"
              className="shrink-0 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
            >
              Get Started
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
