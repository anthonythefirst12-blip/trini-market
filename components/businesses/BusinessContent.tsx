"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BusinessEntry } from "@/app/businesses/page";
import { Home, Car, Wrench, MapPin, Star, Package, Search, ArrowRight } from "lucide-react";

const SECTORS = [
  { key: "Real Estate", label: "Real Estate",  Icon: Home,   desc: "Agencies & brokers" },
  { key: "Vehicles",   label: "Dealerships",   Icon: Car,    desc: "New & pre-owned" },
  { key: "Services",   label: "Services",      Icon: Wrench, desc: "Professional firms" },
] as const;

type Sector = typeof SECTORS[number]["key"] | "All";

function BusinessCard({ entry }: { entry: BusinessEntry }) {
  const { seller } = entry;
  return (
    <Link href={`/store/${seller.id}`} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-2xl">
      <article className="biz-card rounded-2xl border overflow-hidden h-full flex flex-col transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-0.5">

        {/* Banner */}
        <div className="relative h-36 bg-gradient-to-br from-red-950 to-gray-900 overflow-hidden shrink-0">
          {seller.banner ? (
            <Image
              src={seller.banner}
              alt={seller.businessName ?? seller.name}
              fill
              className="object-cover opacity-70 group-hover:opacity-85 group-hover:scale-[1.03] transition-all duration-500"
              sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-red-800 to-gray-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Verified badge */}
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            ✓ Verified
          </span>

          {/* Logo */}
          <div className="absolute -bottom-5 left-4">
            <div className="w-12 h-12 rounded-xl border-[3px] border-white shadow-md overflow-hidden bg-white shrink-0">
              {seller.avatar ? (
                <Image src={seller.avatar} alt={seller.name} width={48} height={48} className="object-cover w-full h-full" unoptimized />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center font-bold text-red-400 text-lg">
                  {(seller.businessName ?? seller.name).charAt(0)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="pt-8 px-4 pb-4 flex flex-col flex-1 gap-2">
          <div>
            <h3 className="biz-card-title font-display font-bold text-sm leading-snug group-hover:text-red-600 transition-colors line-clamp-1">
              {seller.businessName ?? seller.name}
            </h3>
            {seller.location && (
              <p className="biz-card-meta text-xs flex items-center gap-1 mt-0.5">
                <MapPin size={11} strokeWidth={2} className="shrink-0" />
                {seller.location}
              </p>
            )}
          </div>

          {seller.bio && (
            <p className="biz-card-sub text-xs leading-relaxed line-clamp-2 flex-1">{seller.bio}</p>
          )}

          <div className="flex items-center justify-between pt-2 biz-card-border border-t mt-auto">
            <div className="flex items-center gap-3">
              {seller.reviewCount > 0 && (
                <span className="flex items-center gap-1 text-xs biz-card-meta">
                  <Star size={11} className="text-amber-400 fill-amber-400 shrink-0" />
                  <span className="font-medium">{seller.rating.toFixed(1)}</span>
                  <span className="opacity-60">({seller.reviewCount})</span>
                </span>
              )}
              <span className="flex items-center gap-1 text-xs biz-card-meta">
                <Package size={11} className="shrink-0" />
                {entry.listingCount} listings
              </span>
            </div>
            <span className="text-xs text-red-600 font-semibold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              View <ArrowRight size={11} strokeWidth={2.5} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function BusinessContent({ businesses }: { businesses: BusinessEntry[] }) {
  const [sector, setSector] = useState<Sector>("All");
  const [query, setQuery] = useState("");

  const filtered = businesses.filter((b) => {
    const matchesSector = sector === "All" || b.categories.includes(sector);
    const matchesQuery = query.trim() === "" ||
      (b.seller.businessName ?? b.seller.name).toLowerCase().includes(query.toLowerCase()) ||
      b.seller.location?.toLowerCase().includes(query.toLowerCase());
    return matchesSector && matchesQuery;
  });

  const count = (s: Sector) => s === "All" ? businesses.length : businesses.filter((b) => b.categories.includes(s)).length;

  return (
    <div className="biz-content-wrap">
      <style>{`
        .biz-content-wrap { background: #fafafa; }
        .biz-sector-card { background: #ffffff; border-color: #e5e7eb; color: #374151; }
        .biz-sector-card:hover { border-color: #fca5a5; }
        .biz-sector-card-active { background: #dc2626; border-color: #dc2626; color: #ffffff; }
        .biz-sector-icon { background: rgba(220,38,38,0.08); color: #dc2626; }
        .biz-sector-icon-active { background: rgba(255,255,255,0.2); color: #ffffff; }
        .biz-search { background: #ffffff; border-color: #e5e7eb; color: #111827; }
        .biz-search:focus { border-color: #dc2626; }
        .biz-search::placeholder { color: #9ca3af; }
        .biz-card { background: #ffffff; border-color: #e5e7eb; }
        .biz-card-title { color: #111827; }
        .biz-card-sub { color: #6b7280; }
        .biz-card-meta { color: #9ca3af; }
        .biz-card-border { border-color: #f3f4f6; }
        .biz-empty { color: #9ca3af; }
        .biz-count { color: #6b7280; }

        [data-theme="dark"] .biz-content-wrap { background: #111111; }
        [data-theme="dark"] .biz-sector-card { background: #1c1c1c; border-color: #2a2a2a; color: #d1d5db; }
        [data-theme="dark"] .biz-sector-card:hover { border-color: #ef4444; }
        [data-theme="dark"] .biz-sector-card-active { background: #dc2626; border-color: #dc2626; color: #ffffff; }
        [data-theme="dark"] .biz-sector-icon { background: rgba(220,38,38,0.15); color: #fca5a5; }
        [data-theme="dark"] .biz-sector-icon-active { background: rgba(255,255,255,0.2); color: #ffffff; }
        [data-theme="dark"] .biz-search { background: #1c1c1c; border-color: #2a2a2a; color: #f9fafb; }
        [data-theme="dark"] .biz-search:focus { border-color: #dc2626; }
        [data-theme="dark"] .biz-search::placeholder { color: rgba(255,255,255,0.3); }
        [data-theme="dark"] .biz-card { background: #1c1c1c; border-color: #2a2a2a; }
        [data-theme="dark"] .biz-card-title { color: #f9fafb; }
        [data-theme="dark"] .biz-card-sub { color: rgba(255,255,255,0.4); }
        [data-theme="dark"] .biz-card-meta { color: rgba(255,255,255,0.3); }
        [data-theme="dark"] .biz-card-border { border-color: #2a2a2a; }
        [data-theme="dark"] .biz-empty { color: rgba(255,255,255,0.2); }
        [data-theme="dark"] .biz-count { color: rgba(255,255,255,0.35); }

        @media (prefers-color-scheme: dark) {
          :root:not([data-theme="light"]) .biz-content-wrap { background: #111111; }
          :root:not([data-theme="light"]) .biz-sector-card { background: #1c1c1c; border-color: #2a2a2a; color: #d1d5db; }
          :root:not([data-theme="light"]) .biz-sector-card:hover { border-color: #ef4444; }
          :root:not([data-theme="light"]) .biz-sector-card-active { background: #dc2626; border-color: #dc2626; color: #ffffff; }
          :root:not([data-theme="light"]) .biz-sector-icon { background: rgba(220,38,38,0.15); color: #fca5a5; }
          :root:not([data-theme="light"]) .biz-sector-icon-active { background: rgba(255,255,255,0.2); color: #ffffff; }
          :root:not([data-theme="light"]) .biz-search { background: #1c1c1c; border-color: #2a2a2a; color: #f9fafb; }
          :root:not([data-theme="light"]) .biz-search:focus { border-color: #dc2626; }
          :root:not([data-theme="light"]) .biz-search::placeholder { color: rgba(255,255,255,0.3); }
          :root:not([data-theme="light"]) .biz-card { background: #1c1c1c; border-color: #2a2a2a; }
          :root:not([data-theme="light"]) .biz-card-title { color: #f9fafb; }
          :root:not([data-theme="light"]) .biz-card-sub { color: rgba(255,255,255,0.4); }
          :root:not([data-theme="light"]) .biz-card-meta { color: rgba(255,255,255,0.3); }
          :root:not([data-theme="light"]) .biz-card-border { border-color: #2a2a2a; }
          :root:not([data-theme="light"]) .biz-empty { color: rgba(255,255,255,0.2); }
          :root:not([data-theme="light"]) .biz-count { color: rgba(255,255,255,0.35); }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Sector tabs */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {SECTORS.map(({ key, label, Icon, desc }) => {
            const isActive = sector === key;
            return (
              <button
                key={key}
                onClick={() => setSector(isActive ? "All" : key)}
                className={`biz-sector-card rounded-2xl border-2 px-4 py-4 text-left flex items-center gap-3 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${isActive ? "biz-sector-card-active" : ""}`}
              >
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isActive ? "biz-sector-icon-active" : "biz-sector-icon"}`}>
                  <Icon size={17} strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                  <p className="font-display font-bold text-sm leading-none">{label}</p>
                  <p className={`text-xs mt-0.5 ${isActive ? "opacity-80" : "opacity-60"}`}>{desc} · {count(key)}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Search + result count */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} strokeWidth={1.8} className="absolute left-3 top-1/2 -translate-y-1/2 biz-card-meta pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or location…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="biz-search w-full border rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none transition-colors"
            />
          </div>
          <p className="biz-count text-sm">
            {filtered.length} {filtered.length === 1 ? "business" : "businesses"}
          </p>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="biz-empty text-center py-24 text-sm">
            No businesses found{query ? ` for "${query}"` : ""}.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((b) => <BusinessCard key={b.seller.id} entry={b} />)}
          </div>
        )}
      </div>
    </div>
  );
}
