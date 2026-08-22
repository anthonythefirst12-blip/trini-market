"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useRef } from "react";
import { Category } from "@/lib/types";
import { Button } from "@/components/ui/Button";

const CONDITIONS = ["New", "Like New", "Good", "Fair"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

// "Other" excluded from filter sidebar (no meaningful ilike/tag match)
const SUBCATEGORIES: Partial<Record<Category, { label: string; options: string[] }>> = {
  Vehicles: {
    label: "Brand",
    options: [
      "Toyota", "Nissan", "Honda", "Mitsubishi", "Hyundai",
      "Mazda", "BMW", "Mercedes-Benz", "Ford", "Suzuki",
      "Kia", "Isuzu", "Jeep", "Land Rover", "Subaru",
      "Volkswagen", "Audi", "Chevrolet", "Dodge", "RAM",
      "Lexus", "Infiniti", "Porsche", "Peugeot", "Renault",
      "Fiat", "Volvo", "Yamaha", "Kawasaki", "Bajaj", "TVS",
    ],
  },
  "Real Estate": {
    label: "Type",
    options: [
      "Apartment", "House", "Land", "Townhouse", "Condo",
      "Villa", "Studio", "Room for Rent", "Commercial Space",
      "Office Space", "Warehouse", "Agricultural Land",
    ],
  },
  Electronics: {
    label: "Device",
    options: [
      "Smartphone", "Laptop", "Tablet", "Gaming Console", "Smart TV",
      "Camera", "Headphones", "Desktop PC", "Smartwatch", "Printer",
      "Speaker", "Monitor", "Router", "Accessories",
    ],
  },
  Fashion: {
    label: "Type",
    options: [
      "Men's Clothing", "Women's Clothing", "Shoes", "Bags & Accessories",
      "Jewelry", "Watches", "Kids' Clothing", "Sportswear",
      "Underwear & Swimwear", "Vintage & Thrift", "School Uniforms",
    ],
  },
  "Food & Beverage": {
    label: "Type",
    options: [
      "Homemade Food", "Catering Services", "Beverages", "Snacks",
      "Groceries", "Baked Goods", "Spices & Sauces", "Restaurant Equipment",
    ],
  },
  Services: {
    label: "Service",
    options: [
      "Plumbing", "Electrical", "Carpentry", "Painting", "Cleaning",
      "Landscaping", "Transportation", "IT & Tech Support", "Tutoring",
      "Beauty & Wellness", "Photography", "Event Planning",
      "Security", "Masonry & Construction",
    ],
  },
  "Home & Garden": {
    label: "Type",
    options: [
      "Furniture", "Appliances", "Garden Tools", "Home Decor", "Lighting",
      "Bedding & Bath", "Kitchen Items", "Storage", "Tools & Equipment",
      "Curtains & Blinds",
    ],
  },
  "Sports & Outdoors": {
    label: "Type",
    options: [
      "Gym Equipment", "Cycling", "Water Sports", "Football / Soccer",
      "Cricket", "Basketball", "Outdoor & Camping", "Fishing",
      "Martial Arts", "Golf", "Tennis / Racquet Sports",
    ],
  },
};

interface FilterSidebarProps {
  categories: Category[];
  locations: string[];
  activeCategory?: string;
  activeSubcategory?: string;
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
  activeSubcategory,
  activeLocation,
  activeCondition,
  activeSort,
  minPrice,
  maxPrice,
  q,
}: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const MAX_SLIDER = 100000;
  const [sliderMin, setSliderMin] = useState(parseInt(minPrice || "0", 10));
  const [sliderMax, setSliderMax] = useState(parseInt(maxPrice || String(MAX_SLIDER), 10));
  const sliderTrackRef = useRef<HTMLDivElement>(null);

  const applyPriceRange = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (sliderMin > 0) params.set("minPrice", String(sliderMin)); else params.delete("minPrice");
    if (sliderMax < MAX_SLIDER) params.set("maxPrice", String(sliderMax)); else params.delete("maxPrice");
    params.delete("page");
    router.push(`/listings?${params.toString()}`);
  }, [sliderMin, sliderMax, searchParams, router]);

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
      if (key === "category") params.delete("subcategory");
      params.delete("page");
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
  const hasFilters = !!(activeCategory || activeSubcategory || activeLocation || activeCondition || activeSort || minPrice || maxPrice || q);
  const subcategoryDef = activeCategory ? SUBCATEGORIES[activeCategory as Category] : undefined;

  const sectionLabel = "text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5";
  const activeBtn = "bg-red-700 text-white font-semibold";
  const inactiveBtn = "text-gray-600 hover:bg-gray-100 hover:text-gray-900";
  const btn = "w-full text-left text-sm px-3 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-sm text-gray-900">Filters</h3>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs text-red-700 hover:text-red-900 transition-colors focus-visible:outline-none rounded">
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

      {/* Subcategory — shown for all categories that have options */}
      {subcategoryDef && (
        <>
          <div className="border-t border-gray-200" />
          <div>
            <h4 className={sectionLabel}>{subcategoryDef.label}</h4>
            <ul className="space-y-0.5 max-h-56 overflow-y-auto pr-1">
              {subcategoryDef.options.map((sub) => (
                <li key={sub}>
                  <button
                    onClick={() => updateParam("subcategory", activeSubcategory === sub ? undefined : sub)}
                    className={[btn, activeSubcategory === sub ? activeBtn : inactiveBtn].join(" ")}
                  >
                    {sub}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <div className="border-t border-gray-200" />

      {/* Price range */}
      <div>
        <h4 className={sectionLabel}>Price (TTD)</h4>
        <div className="space-y-3">
          {/* Dual-range slider */}
          <div className="relative h-5 flex items-center" ref={sliderTrackRef}>
            <div className="absolute inset-x-0 h-1.5 bg-gray-200 rounded-full" />
            <div
              className="absolute h-1.5 bg-red-500 rounded-full"
              style={{
                left: `${(sliderMin / MAX_SLIDER) * 100}%`,
                right: `${100 - (sliderMax / MAX_SLIDER) * 100}%`,
              }}
            />
            <input
              type="range"
              min={0}
              max={MAX_SLIDER}
              step={500}
              value={sliderMin}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (v <= sliderMax - 500) setSliderMin(v);
              }}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-5"
              style={{ zIndex: sliderMin > MAX_SLIDER - 1000 ? 5 : 3 }}
            />
            <input
              type="range"
              min={0}
              max={MAX_SLIDER}
              step={500}
              value={sliderMax}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (v >= sliderMin + 500) setSliderMax(v);
              }}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-5"
              style={{ zIndex: 4 }}
            />
            {/* Min thumb */}
            <div
              className="absolute w-4 h-4 bg-white border-2 border-red-500 rounded-full shadow pointer-events-none"
              style={{ left: `calc(${(sliderMin / MAX_SLIDER) * 100}% - 8px)` }}
            />
            {/* Max thumb */}
            <div
              className="absolute w-4 h-4 bg-white border-2 border-red-500 rounded-full shadow pointer-events-none"
              style={{ left: `calc(${(sliderMax / MAX_SLIDER) * 100}% - 8px)` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>TT${sliderMin.toLocaleString()}</span>
            <span>{sliderMax >= MAX_SLIDER ? "Any max" : `TT$${sliderMax.toLocaleString()}`}</span>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              value={sliderMin || ""}
              onChange={(e) => { const v = parseInt(e.target.value || "0", 10); if (!isNaN(v) && v <= sliderMax - 500) setSliderMin(v); }}
              placeholder="Min"
              className="w-full px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="number"
              value={sliderMax >= MAX_SLIDER ? "" : sliderMax}
              onChange={(e) => { const v = parseInt(e.target.value || String(MAX_SLIDER), 10); if (!isNaN(v) && v >= sliderMin + 500) setSliderMax(Math.min(v, MAX_SLIDER)); }}
              placeholder="Max"
              className="w-full px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <Button onClick={applyPriceRange} variant="secondary" size="sm" fullWidth>Apply</Button>
        </div>
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
              if (otherLocation.trim()) updateParam("location", otherLocation.trim());
            }}
          >
            <input
              value={otherLocation}
              onChange={(e) => setOtherLocation(e.target.value)}
              placeholder="e.g. Tobago, Sangre Grande"
              className="flex-1 px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              autoFocus
            />
            <button type="submit" className="px-3 py-1.5 bg-red-700 text-white text-xs font-semibold rounded-lg hover:bg-red-800 transition-colors">
              Go
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
