"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Category } from "@/lib/types";
import { Button } from "@/components/ui/Button";

const CONDITIONS = ["New", "Like New", "Good", "Fair"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

interface FilterSidebarProps {
  categories: Category[];
  locations: string[];
  activeCategory?: string;
  activeLocation?: string;
  activeCondition?: string;
  activeSort?: string;
  minPrice?: string;
  maxPrice?: string;
  q?: string;
}

export function FilterSidebar({
  categories,
  locations,
  activeCategory,
  activeLocation,
  activeCondition,
  activeSort,
  minPrice,
  maxPrice,
  q,
}: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showOtherInput, setShowOtherInput] = useState(
    !!activeLocation && !locations.includes(activeLocation)
  );
  const [otherLocation, setOtherLocation] = useState(
    activeLocation && !locations.includes(activeLocation) ? activeLocation : ""
  );

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
    setShowOtherInput(false);
    setOtherLocation("");
    router.push("/listings");
  };

  const isOtherActive = !!activeLocation && !locations.includes(activeLocation);
  const hasFilters = !!(activeCategory || activeLocation || activeCondition || activeSort || minPrice || maxPrice || q);

  const sectionLabel = "text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5";
  const activeBtn = "bg-red-700 text-white font-semibold";
  const inactiveBtn = "text-gray-600 hover:bg-gray-100 hover:text-gray-900";
  const btn = "w-full text-left text-sm px-3 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-sm text-gray-900">Filters</h3>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-red-700 hover:text-red-900 transition-colors focus-visible:outline-none rounded"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <h4 className={sectionLabel}>Category</h4>
        <ul className="space-y-0.5">
          {categories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => updateParam("category", activeCategory === cat ? undefined : cat)}
                className={[btn, activeCategory === cat ? activeBtn : inactiveBtn].join(" ")}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Price range */}
      <div>
        <h4 className={sectionLabel}>Price (TTD)</h4>
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
              className="w-full px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              name="maxPrice"
              type="number"
              defaultValue={maxPrice}
              placeholder="Max"
              className="w-full px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm" fullWidth>Apply</Button>
        </form>
      </div>

      <div className="border-t border-gray-200" />

      {/* Sort */}
      <div>
        <h4 className={sectionLabel}>Sort By</h4>
        <ul className="space-y-0.5">
          {SORT_OPTIONS.map((opt) => (
            <li key={opt.value}>
              <button
                onClick={() => updateParam("sort", activeSort === opt.value ? undefined : opt.value)}
                className={[btn, activeSort === opt.value ? activeBtn : inactiveBtn].join(" ")}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-gray-200" />

      {/* Condition */}
      <div>
        <h4 className={sectionLabel}>Condition</h4>
        <ul className="space-y-0.5">
          {CONDITIONS.map((cond) => (
            <li key={cond}>
              <button
                onClick={() => updateParam("condition", activeCondition === cond ? undefined : cond)}
                className={[btn, activeCondition === cond ? activeBtn : inactiveBtn].join(" ")}
              >
                {cond}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-gray-200" />

      {/* Location */}
      <div>
        <h4 className={sectionLabel}>Location</h4>
        <ul className="space-y-0.5">
          {locations.map((loc) => (
            <li key={loc}>
              <button
                onClick={() => {
                  setShowOtherInput(false);
                  updateParam("location", activeLocation === loc ? undefined : loc);
                }}
                className={[btn, activeLocation === loc && !isOtherActive ? activeBtn : inactiveBtn].join(" ")}
              >
                {loc}
              </button>
            </li>
          ))}
          {/* Other option */}
          <li>
            <button
              onClick={() => {
                setShowOtherInput((v) => !v);
                if (!showOtherInput) updateParam("location", undefined);
              }}
              className={[btn, isOtherActive ? activeBtn : inactiveBtn].join(" ")}
            >
              Other…
            </button>
          </li>
        </ul>

        {showOtherInput && (
          <form
            className="mt-2 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (otherLocation.trim()) {
                updateParam("location", otherLocation.trim());
              }
            }}
          >
            <input
              value={otherLocation}
              onChange={(e) => setOtherLocation(e.target.value)}
              placeholder="e.g. Tobago, Sangre Grande"
              className="flex-1 px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-red-700 text-white text-xs font-semibold rounded-lg hover:bg-red-800 transition-colors"
            >
              Go
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
