"use client";

import { useRouter } from "next/navigation";

const SORT_OPTIONS = [
  { value: "", label: "Most Relevant" },
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

interface SortSelectProps {
  activeSort?: string;
  q?: string;
  category?: string;
  subcategory?: string;
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  condition?: string;
}

export function SortSelect({ activeSort, q, category, subcategory, location, minPrice, maxPrice, condition }: SortSelectProps) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (category) sp.set("category", category);
    if (subcategory) sp.set("subcategory", subcategory);
    if (location) sp.set("location", location);
    if (minPrice) sp.set("minPrice", minPrice);
    if (maxPrice) sp.set("maxPrice", maxPrice);
    if (condition) sp.set("condition", condition);
    if (e.target.value) sp.set("sort", e.target.value);
    router.push(`/listings?${sp.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 ml-auto">
      <label htmlFor="sort-select" className="text-xs text-gray-400 font-medium whitespace-nowrap hidden sm:block">
        Sort by
      </label>
      <select
        id="sort-select"
        value={activeSort ?? ""}
        onChange={handleChange}
        className="text-sm text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none cursor-pointer"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
