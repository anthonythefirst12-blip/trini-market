export const dynamic = "force-dynamic";

import Link from "next/link";
import { getPremiumListings, getFeaturedListings, getRecentListings, getCategoryCounts, getSiteStats } from "@/lib/db";
import { ListingCard } from "@/components/listings/ListingCard";
import { LiveSearch } from "@/components/search/LiveSearch";
import { RecentlyViewed } from "@/components/home/RecentlyViewed";
import { CountUp } from "@/components/ui/CountUp";

const CATEGORIES = [
  { name: "Electronics", icon: "💻" },
  { name: "Vehicles", icon: "🚗" },
  { name: "Real Estate", icon: "🏠" },
  { name: "Fashion", icon: "👗" },
  { name: "Food & Beverage", icon: "🍰" },
  { name: "Services", icon: "🔧" },
  { name: "Home & Garden", icon: "🪴" },
  { name: "Sports & Outdoors", icon: "🏄" },
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
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-gray-900 mb-4 leading-tight tracking-tight animate-fade-up">
            Buy &amp; Sell{" "}
            <span className="text-red-600">
              Locally
            </span>
            <br />
            <span className="text-gray-400 font-normal text-3xl sm:text-4xl">across T&amp;T</span>
          </h1>
          <p className="text-gray-500 text-lg mb-8 max-w-lg mx-auto animate-fade-up-delay-1">
            Find great deals on vehicles, electronics, real estate, and more — from Port of Spain to Tobago.
          </p>

          <div className="max-w-2xl mx-auto mb-6 animate-fade-up-delay-2">
            <LiveSearch />
          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap animate-fade-up-delay-3">
            <Link
              href="/listings/new"
              className="inline-flex items-center gap-2 bg-red-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-red-700 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] active:scale-95 transition-all duration-200"
            >
              + Post a Listing
            </Link>
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 bg-white text-gray-700 font-semibold px-6 py-3 rounded-full border border-gray-200 hover:border-red-300 hover:text-red-600 hover:shadow-[0_0_16px_rgba(220,38,38,0.15)] active:scale-95 transition-all duration-200"
            >
              Browse Listings
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-xl text-gray-900">Shop by Category</h2>
            <Link href="/listings" className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/listings?category=${encodeURIComponent(cat.name)}`}
                className="ripple-chip group flex flex-col items-center gap-2 p-3 rounded-2xl border border-transparent hover:border-red-200 hover:bg-red-50 hover:shadow-[0_0_16px_rgba(220,38,38,0.12)] active:scale-95 transition-all duration-200 text-center"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200">{cat.icon}</span>
                <span className="text-xs font-medium text-gray-600 group-hover:text-red-600 leading-tight transition-colors">{cat.name}</span>
                <span className="text-xs text-gray-300 group-hover:text-red-300 transition-colors">{categoryCounts[cat.name] ?? 0}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-10 sm:gap-20 flex-wrap">
            <div className="text-center">
              <div className="font-display font-bold text-xl text-gray-900">
                <CountUp to={stats.listings} suffix="+" />
              </div>
              <div className="text-gray-400 text-xs mt-0.5">Active Listings</div>
            </div>
            <div className="text-center">
              <div className="font-display font-bold text-xl text-gray-900">
                <CountUp to={stats.sellers} suffix="+" />
              </div>
              <div className="text-gray-400 text-xs mt-0.5">Sellers</div>
            </div>
            <div className="text-center">
              <div className="font-display font-bold text-xl text-gray-900">
                <CountUp to={8} />
              </div>
              <div className="text-gray-400 text-xs mt-0.5">Categories</div>
            </div>
            <div className="text-center">
              <div className="font-display font-bold text-xl text-gray-900">🇹🇹</div>
              <div className="text-gray-400 text-xs mt-0.5">Made for T&T</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

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
