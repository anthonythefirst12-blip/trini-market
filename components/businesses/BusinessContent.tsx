"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BusinessEntry } from "@/app/businesses/page";
import { Home, Car, Wrench } from "lucide-react";

const FILTERS = ["All", "Real Estate", "Vehicles", "Services"] as const;
type Filter = (typeof FILTERS)[number];

const categoryMeta: Record<string, { badge: string; darkBadge: string; Icon: React.ElementType }> = {
  "Real Estate": { badge: "bg-red-100 text-red-700", darkBadge: "bg-red-900/40 text-red-300", Icon: Home },
  Vehicles:      { badge: "bg-orange-100 text-orange-700", darkBadge: "bg-orange-900/40 text-orange-300", Icon: Car },
  Services:      { badge: "bg-amber-100 text-amber-700", darkBadge: "bg-amber-900/40 text-amber-300", Icon: Wrench },
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
        <svg key={star} className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
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
  const meta = categoryMeta[primaryCat] ?? { badge: "bg-gray-100 text-gray-700", darkBadge: "bg-gray-800 text-gray-300", Icon: Home };

  return (
    <Link href={`/store/${seller.id}`} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-2xl">
      <article className="biz-card rounded-2xl border-2 group-hover:border-red-300 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.12)] transition-all overflow-hidden h-full flex flex-col">
        <div className="relative h-32 bg-gray-900 overflow-hidden">
          {seller.banner ? (
            <Image src={seller.banner} alt={seller.businessName ?? seller.name} fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-900 to-red-700" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          </div>
          <div className="absolute -bottom-6 left-5">
            <div className="w-14 h-14 rounded-xl border-4 border-white overflow-hidden bg-gray-100 shadow-md">
              <Image src={seller.avatar} alt={seller.name} width={56} height={56} className="object-cover" />
            </div>
          </div>
        </div>

        <div className="pt-9 px-5 pb-5 flex flex-col flex-1">
          <div className="mb-3">
            <h3 className="biz-card-title font-display font-bold text-base leading-snug group-hover:text-red-600 transition-colors">
              {seller.businessName ?? seller.name}
            </h3>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {entry.categories.map((cat) => {
                const m = categoryMeta[cat];
                return (
                  <span key={cat} className={`text-xs font-semibold px-2 py-0.5 rounded-full ${m?.badge ?? "bg-gray-100 text-gray-600"}`}>
                    {cat}
                  </span>
                );
              })}
            </div>
          </div>
          {seller.bio && <p className="biz-card-sub text-xs leading-relaxed line-clamp-2 mb-4 flex-1">{seller.bio}</p>}
          <div className="flex items-center justify-between pt-3 biz-card-border border-t mt-auto">
            <StarRating rating={seller.rating} />
            <div className="flex items-center gap-3 text-xs biz-card-meta">
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
  const filtered = active === "All" ? businesses : businesses.filter((b) => b.categories.includes(active));

  return (
    <div className="biz-content-wrap">
      <style>{`
        .biz-content-wrap { background: #fafafa; }
        .biz-industry-strip { background: #ffffff; border-color: #e5e7eb; }
        .biz-industry-title { color: #111827; }
        .biz-industry-desc { color: #6b7280; }
        .biz-industry-icon { color: #dc2626; background: rgba(220,38,38,0.07); }
        .biz-filter-btn { border-color: #e5e7eb; color: #4b5563; background: #ffffff; }
        .biz-filter-btn:hover { border-color: #fca5a5; color: #dc2626; }
        .biz-filter-btn-active { background: #dc2626; border-color: #dc2626; color: #ffffff; }
        .biz-card { background: #ffffff; border-color: #e5e7eb; }
        .biz-card-title { color: #111827; }
        .biz-card-sub { color: #6b7280; }
        .biz-card-meta { color: #9ca3af; }
        .biz-card-border { border-color: #f3f4f6; }
        .biz-empty { color: #9ca3af; }

        [data-theme="dark"] .biz-content-wrap { background: #111111; }
        [data-theme="dark"] .biz-industry-strip { background: #1c1c1c; border-color: #2a2a2a; }
        [data-theme="dark"] .biz-industry-title { color: #f3f4f6; }
        [data-theme="dark"] .biz-industry-desc { color: rgba(255,255,255,0.35); }
        [data-theme="dark"] .biz-industry-icon { color: #fca5a5; background: rgba(220,38,38,0.15); }
        [data-theme="dark"] .biz-filter-btn { border-color: #2a2a2a; color: #9ca3af; background: #1c1c1c; }
        [data-theme="dark"] .biz-filter-btn:hover { border-color: #ef4444; color: #fca5a5; }
        [data-theme="dark"] .biz-filter-btn-active { background: #dc2626; border-color: #dc2626; color: #ffffff; }
        [data-theme="dark"] .biz-card { background: #1c1c1c; border-color: #2a2a2a; }
        [data-theme="dark"] .biz-card-title { color: #f9fafb; }
        [data-theme="dark"] .biz-card-sub { color: rgba(255,255,255,0.4); }
        [data-theme="dark"] .biz-card-meta { color: rgba(255,255,255,0.3); }
        [data-theme="dark"] .biz-card-border { border-color: #2a2a2a; }
        [data-theme="dark"] .biz-empty { color: rgba(255,255,255,0.2); }

        @media (prefers-color-scheme: dark) {
          :root:not([data-theme="light"]) .biz-content-wrap { background: #111111; }
          :root:not([data-theme="light"]) .biz-industry-strip { background: #1c1c1c; border-color: #2a2a2a; }
          :root:not([data-theme="light"]) .biz-industry-title { color: #f3f4f6; }
          :root:not([data-theme="light"]) .biz-industry-desc { color: rgba(255,255,255,0.35); }
          :root:not([data-theme="light"]) .biz-industry-icon { color: #fca5a5; background: rgba(220,38,38,0.15); }
          :root:not([data-theme="light"]) .biz-filter-btn { border-color: #2a2a2a; color: #9ca3af; background: #1c1c1c; }
          :root:not([data-theme="light"]) .biz-filter-btn:hover { border-color: #ef4444; color: #fca5a5; }
          :root:not([data-theme="light"]) .biz-filter-btn-active { background: #dc2626; border-color: #dc2626; color: #ffffff; }
          :root:not([data-theme="light"]) .biz-card { background: #1c1c1c; border-color: #2a2a2a; }
          :root:not([data-theme="light"]) .biz-card-title { color: #f9fafb; }
          :root:not([data-theme="light"]) .biz-card-sub { color: rgba(255,255,255,0.4); }
          :root:not([data-theme="light"]) .biz-card-meta { color: rgba(255,255,255,0.3); }
          :root:not([data-theme="light"]) .biz-card-border { border-color: #2a2a2a; }
          :root:not([data-theme="light"]) .biz-empty { color: rgba(255,255,255,0.2); }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Industry strips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {(["Real Estate", "Vehicles", "Services"] as const).map((cat) => {
            const m = categoryMeta[cat];
            return (
              <div key={cat} className="biz-industry-strip rounded-xl border p-4 flex gap-3 items-start transition-colors">
                <div className="biz-industry-icon w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
                  <m.Icon className="w-4 h-4" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="biz-industry-title font-display font-semibold text-sm">{cat}</h3>
                  <p className="biz-industry-desc text-xs leading-relaxed mt-0.5">{industryDescriptions[cat]}</p>
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
                "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500",
                active === f ? "biz-filter-btn-active" : "biz-filter-btn",
              ].join(" ")}
            >
              {f === "All" ? "All Businesses" : f}
              <span className="ml-1.5 text-xs opacity-60">
                ({f === "All" ? businesses.length : businesses.filter((b) => b.categories.includes(f)).length})
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="biz-empty text-center py-20">No businesses in this category yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((b) => <BusinessCard key={b.seller.id} entry={b} />)}
          </div>
        )}
      </div>
    </div>
  );
}
