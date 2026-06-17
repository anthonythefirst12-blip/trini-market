import Link from "next/link";
import { listings, categories } from "@/lib/data";
import { ListingCard } from "@/components/listings/ListingCard";
import { Button } from "@/components/ui/Button";
import { IslandMarketHero } from "@/components/ui/island-market-hero";

export default function HomePage() {
  const featured = listings.filter((l) => l.featured);
  const premium = listings.filter((l) => l.tier === "premium");

  return (
    <>
      {/* Hero */}
      <IslandMarketHero />

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
                <div className="text-xs text-gray-400 mt-0.5">{cat.count}</div>
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
            {listings.slice(0, 4).map((listing) => (
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
