"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface ActiveFiltersProps {
  category?: string;
  location?: string;
  condition?: string;
  minPrice?: string;
  maxPrice?: string;
  q?: string;
}

function buildUrl(params: URLSearchParams, removeKey: string) {
  const next = new URLSearchParams(params.toString());
  next.delete(removeKey);
  if (removeKey === "minPrice") next.delete("maxPrice");
  next.delete("page");
  const str = next.toString();
  return `/listings${str ? `?${str}` : ""}`;
}

export function ActiveFilters({ category, location, condition, minPrice, maxPrice, q }: ActiveFiltersProps) {
  const searchParams = useSearchParams();

  const chips: { label: string; key: string }[] = [];
  if (category) chips.push({ label: category, key: "category" });
  if (location) chips.push({ label: location, key: "location" });
  if (condition) chips.push({ label: condition, key: "condition" });
  if (minPrice || maxPrice) {
    const label = minPrice && maxPrice
      ? `$${minPrice}–$${maxPrice}`
      : minPrice
      ? `From $${minPrice}`
      : `Up to $${maxPrice}`;
    chips.push({ label, key: "minPrice" });
  }
  if (q) chips.push({ label: `"${q}"`, key: "q" });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {chips.map((chip) => (
        <Link
          key={chip.key}
          href={buildUrl(searchParams, chip.key === "minPrice" ? "minPrice" : chip.key)}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-full hover:bg-red-100 transition-colors"
        >
          {chip.label}
          <span className="text-red-400 hover:text-red-700 ml-0.5 leading-none">×</span>
        </Link>
      ))}
      <Link
        href="/listings"
        className="inline-flex items-center px-3 py-1 text-gray-500 text-xs font-medium hover:text-gray-700 transition-colors"
      >
        Clear all
      </Link>
    </div>
  );
}
