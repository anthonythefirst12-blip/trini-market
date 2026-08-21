export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getListings } from "@/lib/db";

export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string>> }): Promise<Metadata> {
  const params = await searchParams;
  const category = params.category ?? "";
  const search = params.search ?? "";
  const title = category
    ? `${category} for Sale in Trinidad & Tobago | TriniSell`
    : search
    ? `"${search}" — TriniSell Search Results`
    : "Browse Listings | TriniSell";
  const description = category
    ? `Find the best ${category.toLowerCase()} deals in Trinidad & Tobago on TriniSell. Buy and sell locally.`
    : "Browse thousands of listings across all categories on TriniSell — Trinidad & Tobago's local marketplace.";
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary", title, description },
    alternates: {
      canonical: category
        ? `https://trinisell.tt/listings?category=${encodeURIComponent(category)}`
        : "https://trinisell.tt/listings",
    },
  };
}
import { ListingCard } from "@/components/listings/ListingCard";
import { FilterSidebar } from "@/components/listings/FilterSidebar";
import { ViewToggle } from "@/components/listings/ViewToggle";
import { ActiveFilters } from "@/components/listings/ActiveFilters";
import { SortSelect } from "@/components/listings/SortSelect";
import { Category } from "@/lib/types";
import Link from "next/link";
import { MobileFilterDrawer } from "@/components/listings/MobileFilterDrawer";
import { CategoryHero } from "@/components/listings/CategoryHero";
import { Car, Home, Laptop, Shirt, UtensilsCrossed, Wrench, Sofa, Dumbbell } from "lucide-react";

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

// Colours mirror CategoryHero gradients — active bg, active text, inactive icon tint
const CAT_COLOR: Record<Category, { icon: React.ElementType; active: string; inactive: string; dot: string }> = {
  Electronics:      { icon: Laptop,          active: "bg-violet-600 border-violet-600 text-white",   inactive: "text-violet-500 border-violet-200 hover:border-violet-400 hover:text-violet-700 hover:bg-violet-50", dot: "bg-violet-400" },
  Vehicles:         { icon: Car,             active: "bg-blue-600 border-blue-600 text-white",       inactive: "text-blue-500 border-blue-200 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50",          dot: "bg-blue-400" },
  "Real Estate":    { icon: Home,            active: "bg-emerald-600 border-emerald-600 text-white", inactive: "text-emerald-600 border-emerald-200 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50", dot: "bg-emerald-400" },
  Fashion:          { icon: Shirt,           active: "bg-pink-600 border-pink-600 text-white",       inactive: "text-pink-500 border-pink-200 hover:border-pink-400 hover:text-pink-700 hover:bg-pink-50",          dot: "bg-pink-400" },
  "Food & Beverage":{ icon: UtensilsCrossed, active: "bg-orange-500 border-orange-500 text-white",   inactive: "text-orange-500 border-orange-200 hover:border-orange-400 hover:text-orange-700 hover:bg-orange-50", dot: "bg-orange-400" },
  Services:         { icon: Wrench,          active: "bg-gray-700 border-gray-700 text-white",       inactive: "text-gray-500 border-gray-300 hover:border-gray-500 hover:text-gray-700 hover:bg-gray-100",         dot: "bg-gray-400" },
  "Home & Garden":  { icon: Sofa,            active: "bg-green-600 border-green-600 text-white",     inactive: "text-green-600 border-green-200 hover:border-green-400 hover:text-green-700 hover:bg-green-50",     dot: "bg-green-400" },
  "Sports & Outdoors":{ icon: Dumbbell,      active: "bg-cyan-600 border-cyan-600 text-white",       inactive: "text-cyan-600 border-cyan-200 hover:border-cyan-400 hover:text-cyan-700 hover:bg-cyan-50",         dot: "bg-cyan-400" },
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
    subcategory?: string;
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
  const { q, category, subcategory, location, minPrice, maxPrice, condition, sort, view = "grid", page: pageParam } = params;
  const page = Math.max(1, Number(pageParam ?? 1));

  const results = await getListings({
    q,
    category,
    subcategory,
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
    if (subcategory) sp.set("subcategory", subcategory);
    if (location) sp.set("location", location);
    if (minPrice) sp.set("minPrice", minPrice);
    if (maxPrice) sp.set("maxPrice", maxPrice);
    if (condition) sp.set("condition", condition);
    if (sort) sp.set("sort", sort);
    if (view !== "grid") sp.set("view", view);
    sp.set("page", String(p));
    return `/listings?${sp.toString()}`;
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Category hero banner (only shown when a category is selected) */}
      {category && <CategoryHero category={category} count={results.length} />}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="font-display font-bold text-2xl text-gray-900">
                {category ?? (q ? `Results for "${q}"` : "All Listings")}
              </h1>
              <p className="text-gray-400 text-sm mt-0.5">
                {results.length} listing{results.length !== 1 ? "s" : ""}
                {location ? ` in ${location}` : ""}
                {condition ? ` · ${condition}` : ""}
              </p>
            </div>
            <ViewToggle currentView={view} />
          </div>

          {/* Category chips */}
          <div className="mt-4 flex gap-2 flex-wrap">
            <Link
              href="/listings"
              className={[
                "inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all",
                !category
                  ? "bg-red-700 border-red-700 text-white"
                  : "border-gray-300 text-gray-600 hover:border-red-400 hover:text-red-700 bg-white",
              ].join(" ")}
            >
              All
            </Link>
            {CATEGORIES.map((cat) => {
              const meta = CAT_COLOR[cat];
              const Icon = meta.icon;
              const isActive = category === cat;
              return (
                <Link
                  key={cat}
                  href={`/listings?category=${encodeURIComponent(cat)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                  className={[
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all bg-white",
                    isActive ? meta.active : meta.inactive,
                  ].join(" ")}
                >
                  <Icon size={11} strokeWidth={2} />
                  {cat}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6 items-start">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <FilterSidebar
              categories={CATEGORIES}
              locations={LOCATIONS}
              activeCategory={category}
              activeSubcategory={subcategory}
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
            {/* Mobile filter drawer + sort bar */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="lg:hidden">
                <MobileFilterDrawer
                  categories={CATEGORIES}
                  locations={LOCATIONS}
                  activeCategory={category}
                  activeSubcategory={subcategory}
                  activeLocation={location}
                  activeCondition={condition}
                  activeSort={sort}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  q={q}
                />
              </div>
              <SortSelect activeSort={sort} q={q} category={category} subcategory={subcategory} location={location} minPrice={minPrice} maxPrice={maxPrice} condition={condition} />
            </div>
            {/* Active filter chips */}
            <ActiveFilters
              category={category}
              subcategory={subcategory}
              location={location}
              condition={condition}
              minPrice={minPrice}
              maxPrice={maxPrice}
              q={q}
            />
            {results.length === 0 ? (
              <div className="py-20 bg-white rounded-2xl border border-gray-200 flex flex-col items-center gap-4">
                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <div className="text-center">
                  <h3 className="font-display font-semibold text-gray-700">No listings found</h3>
                  <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or broadening your search.</p>
                </div>
                <Link href="/listings" className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors">
                  Clear all filters →
                </Link>
              </div>
            ) : view === "list" ? (
              <div className="flex flex-col gap-3">
                {results.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} view="list" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {results.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {(hasPrevPage || hasNextPage) && (
              <div className="flex items-center justify-center gap-3 mt-8">
                {hasPrevPage ? (
                  <Link href={buildPageUrl(page - 1)} className="px-5 py-2.5 bg-white border border-gray-200 hover:border-red-400 hover:text-red-700 text-gray-600 text-sm font-semibold rounded-xl transition-colors">
                    ← Previous
                  </Link>
                ) : (
                  <span className="px-5 py-2.5 bg-white border border-gray-100 text-gray-300 text-sm font-semibold rounded-xl cursor-not-allowed select-none">← Previous</span>
                )}
                <span className="text-gray-400 text-sm font-medium">Page {page}</span>
                {hasNextPage ? (
                  <Link href={buildPageUrl(page + 1)} className="px-5 py-2.5 bg-white border border-gray-200 hover:border-red-400 hover:text-red-700 text-gray-600 text-sm font-semibold rounded-xl transition-colors">
                    Next →
                  </Link>
                ) : (
                  <span className="px-5 py-2.5 bg-white border border-gray-100 text-gray-300 text-sm font-semibold rounded-xl cursor-not-allowed select-none">Next →</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
