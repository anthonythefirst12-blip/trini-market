export const dynamic = "force-dynamic";

import Link from "next/link";
import { categories } from "@/lib/data";
import { getPremiumListings, getFeaturedListings, getRecentListings, getCategoryCounts } from "@/lib/db";
import { ListingCard } from "@/components/listings/ListingCard";
import { Button } from "@/components/ui/Button";

export default async function HomePage() {
  const [premium, featured, recent, categoryCounts] = await Promise.all([
    getPremiumListings(),
    getFeaturedListings(),
    getRecentListings(6),
    getCategoryCounts(),
  ]);

  return (
    <>
      {/* Hero — deliberate design risk: diagonal split background with dot-grid texture */}
      <section className="relative overflow-hidden bg-white">
        {/* Dot-grid background */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle, #CBD5E1 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
        {/* Diagonal blue shape */}
        <div
          className="absolute right-0 top-0 h-full w-1/2 bg-blue-700 hidden lg:block"
          style={{ clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        />
        <div className="absolute right-0 top-0 h-full w-1/2 hidden lg:block opacity-10"
          style={{
            clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",
            backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-xl">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-5">
              Trinidad &amp; Tobago
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-gray-900 leading-tight">
              Buy &amp; Sell
              <br />
              <span className="text-blue-700">Locally.</span>
              <br />
              Right Here.
            </h1>
            <p className="mt-5 text-gray-600 text-lg leading-relaxed max-w-md">
              TriniMarket connects buyers and sellers across Trinidad &amp; Tobago — vehicles, real estate, tech, food, services and more.
            </p>

            {/* Search bar */}
            <form action="/listings" method="GET" className="mt-8 flex gap-2 max-w-lg">
              <div className="flex-1 relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  name="q"
                  placeholder="Search listings…"
                  className="w-full pl-9 pr-4 py-3 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button type="submit" size="lg">Search</Button>
            </form>

            <div className="mt-5 flex flex-wrap gap-2">
              {["Vehicles", "Electronics", "Real Estate", "Services"].map((cat) => (
                <Link
                  key={cat}
                  href={`/listings?category=${encodeURIComponent(cat)}`}
                  className="text-xs text-gray-500 border border-gray-300 rounded-full px-3 py-1 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-[#F1F3F5] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-bold text-2xl text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/listings?category=${encodeURIComponent(cat.name)}`}
                className="bg-white rounded-xl p-4 text-center hover:border-blue-300 hover:shadow-sm border border-gray-200 transition-all group focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
              >
                <div className="text-2xl mb-1">{cat.icon}</div>
                <div className="text-xs font-medium text-gray-700 group-hover:text-blue-700 transition-colors leading-tight">{cat.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{categoryCounts[cat.name] ?? 0}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Picks */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <h2 className="font-display font-bold text-2xl text-gray-900">Premium Picks</h2>
              <span className="bg-blue-700 text-white text-xs font-bold px-2.5 py-0.5 rounded">★ Premium</span>
            </div>
            <Link href="/listings" className="text-sm text-blue-700 hover:text-blue-800 font-medium transition-colors">
              View all →
            </Link>
          </div>
          <p className="text-sm text-gray-400 mb-6">Top-tier listings from our most serious sellers.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {premium.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured listings */}
      <section className="py-14 bg-[#F1F3F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-2xl text-gray-900">Featured Listings</h2>
            <Link href="/listings" className="text-sm text-blue-700 hover:text-blue-800 font-medium transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent listings */}
      <section className="bg-[#F1F3F5] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-2xl text-gray-900">Recent Listings</h2>
            <Link href="/listings" className="text-sm text-blue-700 hover:text-blue-800 font-medium transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recent.slice(0, 4).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-16 bg-blue-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display font-bold text-3xl text-white mb-3">
            Ready to sell something?
          </h2>
          <p className="text-blue-200 mb-6 text-base">
            Post your listing in minutes. Reach thousands of buyers across T&amp;T.
          </p>
          <Link href="/listings/new">
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 focus-visible:ring-white"
            >
              Post a Free Listing
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
