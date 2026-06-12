import { getListings } from "@/lib/db";
import { ListingCard } from "@/components/listings/ListingCard";
import { FilterSidebar } from "@/components/listings/FilterSidebar";
import { ViewToggle } from "@/components/listings/ViewToggle";
import { Category } from "@/lib/types";

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

interface ListingsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    view?: "grid" | "list";
  }>;
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const params = await searchParams;
  const { q, category, location, minPrice, maxPrice, view = "grid" } = params;

  const results = await getListings({
    q,
    category,
    location,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  });

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl text-gray-900">
            {category ? `${category} Listings` : q ? `Results for "${q}"` : "All Listings"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{results.length} listing{results.length !== 1 ? "s" : ""} found</p>
        </div>

        <div className="flex gap-6 items-start">
          {/* Sidebar */}
          <aside className="hidden lg:block w-60 shrink-0">
            <FilterSidebar
              categories={CATEGORIES}
              locations={LOCATIONS}
              activeCategory={category}
              activeLocation={location}
              minPrice={minPrice}
              maxPrice={maxPrice}
              q={q}
            />
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500 hidden sm:block">
                Showing {results.length} result{results.length !== 1 ? "s" : ""}
              </p>
              <ViewToggle currentView={view} />
            </div>

            {results.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="font-display font-semibold text-lg text-gray-700">No listings found</h3>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search terms.</p>
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
          </div>
        </div>
      </div>
    </div>
  );
}
