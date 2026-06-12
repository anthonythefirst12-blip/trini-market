"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Category } from "@/lib/types";
import { Button } from "@/components/ui/Button";

interface FilterSidebarProps {
  categories: Category[];
  locations: string[];
  activeCategory?: string;
  activeLocation?: string;
  minPrice?: string;
  maxPrice?: string;
  q?: string;
}

export function FilterSidebar({
  categories,
  locations,
  activeCategory,
  activeLocation,
  minPrice,
  maxPrice,
  q,
}: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/listings?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearAll = () => {
    router.push("/listings");
  };

  const hasFilters = !!(activeCategory || activeLocation || minPrice || maxPrice || q);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-sm text-gray-900 uppercase tracking-wide">Filters</h3>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-blue-600 hover:text-blue-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Category</h4>
        <ul className="space-y-1">
          {categories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => updateParam("category", activeCategory === cat ? undefined : cat)}
                className={[
                  "w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  activeCategory === cat
                    ? "bg-blue-700 text-white font-medium"
                    : "text-gray-700 hover:bg-gray-100",
                ].join(" ")}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price range */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Price (TTD)</h4>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const min = fd.get("minPrice") as string;
            const max = fd.get("maxPrice") as string;
            const params = new URLSearchParams(searchParams.toString());
            if (min) params.set("minPrice", min); else params.delete("minPrice");
            if (max) params.set("maxPrice", max); else params.delete("maxPrice");
            router.push(`/listings?${params.toString()}`);
          }}
          className="space-y-2"
        >
          <div className="flex gap-2">
            <input
              name="minPrice"
              type="number"
              defaultValue={minPrice}
              placeholder="Min"
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="maxPrice"
              type="number"
              defaultValue={maxPrice}
              placeholder="Max"
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm" fullWidth>Apply</Button>
        </form>
      </div>

      {/* Location */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Location</h4>
        <ul className="space-y-1">
          {locations.map((loc) => (
            <li key={loc}>
              <button
                onClick={() => updateParam("location", activeLocation === loc ? undefined : loc)}
                className={[
                  "w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  activeLocation === loc
                    ? "bg-blue-700 text-white font-medium"
                    : "text-gray-700 hover:bg-gray-100",
                ].join(" ")}
              >
                {loc}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
