"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  const [activeIdx, setActiveIdx] = useState(-1);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (query.length < 2) { setResults([]); setOpen(false); setActiveIdx(-1); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from("listings")
        .select("id, title, price, currency, category, images")
        .ilike("title", `%${query}%`)
        .limit(6);
      setResults(data ?? []);
      setOpen(true);
      setActiveIdx(-1);
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIdx >= 0 && results[activeIdx]) {
      router.push(`/listings/${results[activeIdx].id}`);
      setOpen(false);
      return;
    }
    if (query.trim()) {
      router.push(`/listings?q=${encodeURIComponent(query)}`);
      setOpen(false);
    }
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!open) return;
    const total = results.length + 1; // +1 for "see all" row
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % total);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i - 1 + total) % total);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }, [open, results.length]);

  return (
    <div ref={ref} className="relative max-w-lg w-full">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search listings…"
            aria-autocomplete="list"
            aria-expanded={open}
            className="w-full pl-9 pr-4 py-3 rounded-lg border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
        <button
          type="submit"
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors shrink-0"
        >
          Search
        </button>
      </form>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
          {results.map((r, i) => {
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
                className={`flex items-center gap-3 px-4 py-3 transition-colors border-b border-gray-50 last:border-0 ${activeIdx === i ? "bg-red-50" : "hover:bg-red-50"}`}
              >
                {r.images?.[0] ? (
                  <img src={r.images[0]} alt={r.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg shrink-0">📦</div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{r.title}</p>
                  <p className="text-xs text-red-600 font-semibold">{price}</p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{r.category}</span>
              </Link>
            );
          })}
          <Link
            href={`/listings?q=${encodeURIComponent(query)}`}
            onClick={() => setOpen(false)}
            className={`block px-4 py-2.5 text-xs text-center text-red-600 border-t border-gray-100 font-medium transition-colors ${activeIdx === results.length ? "bg-red-50" : "hover:bg-red-50"}`}
          >
            See all results for &ldquo;{query}&rdquo; →
          </Link>
        </div>
      )}
    </div>
  );
}
