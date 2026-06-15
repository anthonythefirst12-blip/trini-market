"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase-browser";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Result {
  id: string;
  title: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
}

export function LiveSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (query.length < 2) { setResults([]); setOpen(false); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from("listings")
        .select("id, title, price, currency, category, images")
        .ilike("title", `%${query}%`)
        .limit(5);
      setResults(data ?? []);
      setOpen(true);
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/listings?q=${encodeURIComponent(query)}`);
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative max-w-lg w-full">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder="Search listings…"
            className="w-full pl-9 pr-4 py-3 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-blue-800 transition-colors shrink-0"
        >
          Search
        </button>
      </form>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
          {results.map((r) => {
            const price = new Intl.NumberFormat("en-TT", {
              style: "currency",
              currency: r.currency ?? "TTD",
              minimumFractionDigits: 0,
            }).format(r.price);
            return (
              <Link
                key={r.id}
                href={`/listings/${r.id}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0"
              >
                {r.images?.[0] && (
                  <img src={r.images[0]} alt={r.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{r.title}</p>
                  <p className="text-xs text-blue-600 font-semibold">{price}</p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{r.category}</span>
              </Link>
            );
          })}
          <Link
            href={`/listings?q=${encodeURIComponent(query)}`}
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-xs text-center text-blue-600 hover:bg-blue-50 border-t border-gray-100 font-medium"
          >
            See all results for &ldquo;{query}&rdquo; →
          </Link>
        </div>
      )}
    </div>
  );
}
