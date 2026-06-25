export const dynamic = "force-dynamic";

import { getListings } from "@/lib/db";
import { ListingCard } from "@/components/listings/ListingCard";
import { FilterSidebar } from "@/components/listings/FilterSidebar";
import { ViewToggle } from "@/components/listings/ViewToggle";
import { Category } from "@/lib/types";
import Link from "next/link";
import { MobileFilterDrawer } from "@/components/listings/MobileFilterDrawer";

const CATEGORIES: Category[] = [
  "Electronics",
  "Vehicles",
  "Real Estate",
  "Fashion",
  "Food & Beverage",
  "Services",
  "Home & Garden",
  "Sports & Outdoors",
];

const CATEGORY_ICONS: Record<string, string> = {
  Electronics: "📱",
  Vehicles: "🚗",
  "Real Estate": "🏠",
  Fashion: "👗",
  "Food & Beverage": "🍽️",
  Services: "⚙️",
  "Home & Garden": "🌿",
  "Sports & Outdoors": "⚽",
};

const LOCATIONS = [
  "Port of Spain",
  "San Fernando",
  "Chaguanas",
  "Arima",
  "Tunapuna",
  "Couva",
  "Fyzabad",
  "Debe",
  "Diego Martin",
  "Maraval",
];

const PAGE_SIZE = 24;

interface ListingsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    condition?: string;
    sort?: string;
    view?: "grid" | "list";
    page?: string;
  }>;
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const params = await searchParams;
  const { q, category, location, minPrice, maxPrice, condition, sort, view = "grid", page: pageParam } = params;
  const page = Math.max(1, Number(pageParam ?? 1));

  const results = await getListings({
    q,
    category,
    location,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    condition,
    sort,
    page,
  });

  const hasNextPage = results.length === PAGE_SIZE;
  const hasPrevPage = page > 1;

  const buildPageUrl = (p: number) => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (category) sp.set("category", category);
    if (location) sp.set("location", location);
    if (minPrice) sp.set("minPrice", minPrice);
    if (maxPrice) sp.set("maxPrice", maxPrice);
    if (condition) sp.set("condition", condition);
    if (sort) sp.set("sort", sort);
    if (view !== "grid") sp.set("view", view);
    sp.set("page", String(p));
    return `/listings?${sp.toString()}`;
  };

  const pageTitle = category
    ? `${CATEGORY_ICONS[category] ?? ""} ${category}`
    : q
    ? `Results for "${q}"`
    : "All Listings";

  return (
    <div className="min-h-screen bg-slate-800">
      {/* Header band — diagonal stripe texture, no floating icons */}
      <div className="relative overflow-hidden bg-slate-900 border-b border-slate-700">
        {/* Diagonal stripe overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              #60a5fa 0px,
              #60a5fa 1px,
              transparent 1px,
              transparent 12px
            )`,
          }}
        />
        {/* Blue bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">Marketplace</p>
              <h1 className="font-display font-bold text-3xl text-white">{pageTitle}</h1>
              <p className="text-slate-400 text-sm mt-1">
                {results.length} listing{results.length !== 1 ? "s" : ""} found
                {location ? ` in ${location}` : ""}
                {condition ? ` · ${condition}` : ""}
              </p>
            </div>
            <ViewToggle currentView={view} />
          </div>

          {/* Category quick-filter chips */}
          <div className="mt-5 flex gap-2 flex-wrap">
            <Link
              href="/listings"
              className={[
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                !category
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/40"
                  : "border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-200",
              ].join(" ")}
            >
              All
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/listings?category=${encodeURIComponent(cat)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                className={[
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                  category === cat
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/40"
                    : "border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-200",
                ].join(" ")}
              >
                <span>{CATEGORY_ICONS[cat]}</span>
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6 items-start">
          {/* Sidebar */}
          <aside className="hidden lg:block w-60 shrink-0">
            <FilterSidebar
              categories={CATEGORIES}
              locations={LOCATIONS}
              activeCategory={category}
              activeLocation={location}
              activeCondition={condition}
              activeSort={sort}
              minPrice={minPrice}
              maxPrice={maxPrice}
              q={q}
            />
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter trigger */}
            <div className="mb-4 lg:hidden">
              <MobileFilterDrawer
                categories={CATEGORIES}
                locations={LOCATIONS}
                activeCategory={category}
                activeLocation={location}
                activeCondition={condition}
                activeSort={sort}
                minPrice={minPrice}
                maxPrice={maxPrice}
                q={q}
              />
            </div>
            {results.length === 0 ? (
              <div className="text-center py-20 bg-slate-700/50 rounded-2xl border border-slate-600">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="font-display font-semibold text-lg text-slate-200">No listings found</h3>
                <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or search terms.</p>
              </div>
            ) : view === "list" ? (
              <div className="flex flex-col gap-3">
                {results.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} view="list" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {results.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {(hasPrevPage || hasNextPage) && (
              <div className="flex items-center justify-center gap-3 mt-8">
                {hasPrevPage ? (
                  <Link href={buildPageUrl(page - 1)} className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold rounded-xl transition-colors">
                    ← Previous
                  </Link>
                ) : (
                  <span className="px-5 py-2.5 bg-slate-800 text-slate-600 text-sm font-semibold rounded-xl cursor-not-allowed">← Previous</span>
                )}
                <span className="text-slate-400 text-sm">Page {page}</span>
                {hasNextPage ? (
                  <Link href={buildPageUrl(page + 1)} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors">
                    Next →
                  </Link>
                ) : (
                  <span className="px-5 py-2.5 bg-slate-800 text-slate-600 text-sm font-semibold rounded-xl cursor-not-allowed">Next →</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
