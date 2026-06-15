"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BusinessEntry } from "@/app/businesses/page";

const FILTERS = ["All", "Real Estate", "Vehicles", "Services"] as const;
type Filter = (typeof FILTERS)[number];

const categoryStyles: Record<string, { badge: string; icon: string }> = {
  "Real Estate": { badge: "bg-emerald-100 text-emerald-700", icon: "🏢" },
  Vehicles:      { badge: "bg-blue-100 text-blue-700",        icon: "🚗" },
  Services:      { badge: "bg-amber-100 text-amber-700",      icon: "⚙️" },
};

const industryDescriptions: Record<string, string> = {
  "Real Estate": "Licensed agencies and brokers for residential, commercial & investment properties.",
  Vehicles:      "Authorised dealerships offering new & pre-owned vehicles with finance options.",
  Services:      "Established companies offering corporate contracts and professional solutions.",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-0.5">{rating}</span>
    </div>
  );
}

function BusinessCard({ entry }: { entry: BusinessEntry }) {
  const { seller } = entry;
  const primaryCat = entry.categories[0];
  const style = categoryStyles[primaryCat] ?? { badge: "bg-gray-100 text-gray-700", icon: "🏷️" };

  return (
    <Link href={`/store/${seller.id}`} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl">
      <article className="bg-white rounded-2xl border-2 border-gray-200 group-hover:border-blue-300 group-hover:shadow-lg transition-all overflow-hidden h-full flex flex-col">
        {/* Banner */}
        <div className="relative h-32 bg-gray-900 overflow-hidden">
          {seller.banner ? (
            <Image
              src={seller.banner}
              alt={seller.businessName ?? seller.name}
              fill
              className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-800 to-blue-600" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Verified badge */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 bg-blue-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          </div>

          {/* Avatar overlapping banner */}
          <div className="absolute -bottom-6 left-5">
            <div className="w-14 h-14 rounded-xl border-4 border-white overflow-hidden bg-gray-100 shadow-md">
              <Image src={seller.avatar} alt={seller.name} width={56} height={56} className="object-cover" />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="pt-9 px-5 pb-5 flex flex-col flex-1">
          <div className="mb-3">
            <h3 className="font-display font-bold text-gray-900 text-base leading-snug group-hover:text-blue-700 transition-colors">
              {seller.businessName ?? seller.name}
            </h3>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {entry.categories.map((cat) => (
                <span key={cat} className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryStyles[cat]?.badge ?? "bg-gray-100 text-gray-600"}`}>
                  {categoryStyles[cat]?.icon} {cat}
                </span>
              ))}
            </div>
          </div>

          {seller.bio && (
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4 flex-1">
              {seller.bio}
            </p>
          )}

          {/* Footer stats */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
            <StarRating rating={seller.rating} />
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {entry.listingCount} listings
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {seller.location}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function BusinessContent({ businesses }: { businesses: BusinessEntry[] }) {
  const [active, setActive] = useState<Filter>("All");

  const filtered = active === "All"
    ? businesses
    : businesses.filter((b) => b.categories.includes(active));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Industry info strips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {(["Real Estate", "Vehicles", "Services"] as const).map((cat, i) => {
          const neonClass = i === 0 ? "neon-blue" : i === 1 ? "neon-cyan" : "neon-purple";
          const borderColor = i === 0
            ? "border-blue-400/60 hover:border-blue-400"
            : i === 1
            ? "border-cyan-400/60 hover:border-cyan-400"
            : "border-purple-400/60 hover:border-purple-400";
          return (
            <div key={cat} className={`relative bg-white rounded-xl border-2 ${borderColor} p-4 flex gap-3 items-start transition-all duration-200 group`}>
              {/* Subtle neon inner glow on hover */}
              <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${neonClass}`} style={{ pointerEvents: "none" }} />
              <span className="text-2xl relative z-10">{categoryStyles[cat].icon}</span>
              <div className="relative z-10">
                <h3 className="font-display font-semibold text-sm text-gray-900">{cat}</h3>
                <p className="text-xs text-gray-400 leading-relaxed mt-0.5">{industryDescriptions[cat]}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={[
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              active === f
                ? "bg-blue-700 text-white"
                : "bg-gray-50 border border-gray-300 text-gray-600 hover:border-blue-300 hover:text-blue-700",
            ].join(" ")}
          >
            {f === "All" ? "All Businesses" : `${categoryStyles[f]?.icon} ${f}`}
            <span className="ml-1.5 text-xs opacity-70">
              ({f === "All" ? businesses.length : businesses.filter((b) => b.categories.includes(f)).length})
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No businesses in this category yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((b) => (
            <BusinessCard key={b.seller.id} entry={b} />
          ))}
        </div>
      )}
    </div>
  );
}
