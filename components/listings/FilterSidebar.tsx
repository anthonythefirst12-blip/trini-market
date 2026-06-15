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

  const sectionLabel = "text-xs font-bold text-slate-400 uppercase tracking-widest mb-3";
  const activeBtn = "bg-blue-600 text-white font-semibold shadow-sm shadow-blue-900/40";
  const inactiveBtn = "text-slate-300 hover:bg-slate-700 hover:text-white";
  const btn = "w-full text-left text-sm px-3 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5 space-y-6 shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-sm text-white uppercase tracking-widest">Filters</h3>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors focus-visible:outline-none rounded"
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
      <div className="border-t border-slate-700" />

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
              className="w-full px-3 py-1.5 text-sm bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="maxPrice"
              type="number"
              defaultValue={maxPrice}
              placeholder="Max"
              className="w-full px-3 py-1.5 text-sm bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm" fullWidth>Apply</Button>
        </form>
      </div>

      <div className="border-t border-slate-700" />

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

      <div className="border-t border-slate-700" />

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

      <div className="border-t border-slate-700" />

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
              className="flex-1 px-3 py-1.5 text-sm bg-slate-700 border border-blue-500/50 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-500 transition-colors"
            >
              Go
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
