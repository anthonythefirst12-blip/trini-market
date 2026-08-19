"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import Image from "next/image";

interface Result {
  id: string;
  title: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
}

const TRENDING = ["Toyota Hilux", "iPhone 15", "Apartment POS", "Laptop", "Honda Fit"];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SearchOverlay({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setActiveIdx(-1);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from("listings")
        .select("id, title, price, currency, category, images")
        .ilike("title", `%${query.trim()}%`)
        .limit(6);
      setResults(data ?? []);
      setActiveIdx(-1);
      setLoading(false);
    }, 200);
    return () => clearTimeout(t);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIdx >= 0 && results[activeIdx]) {
      window.location.href = `/listings/${results[activeIdx].id}`;
    } else if (query.trim()) {
      window.location.href = `/listings?q=${encodeURIComponent(query.trim())}`;
    }
    onClose();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    const total = results.length;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, total - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, -1)); }
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[80px] px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className="w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
        style={{
          background: "var(--so-bg, #ffffff)",
          border: "1px solid var(--so-border, rgba(17,24,39,0.10))",
        }}
      >
        <style>{`
          [data-theme="dark"] { --so-bg: #1c1c1c; --so-border: rgba(255,255,255,0.08); --so-row: rgba(255,255,255,0.04); --so-row-hover: rgba(255,255,255,0.06); --so-text: #f0f0f0; --so-muted: #9ca3af; }
          :root { --so-row: #f9fafb; --so-row-hover: #fef2f2; --so-text: #111827; --so-muted: #6b7280; }
        `}</style>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex items-center px-4 border-b" style={{ borderColor: "var(--so-border)" }}>
          <svg className="w-5 h-5 text-gray-400 shrink-0 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Search listings, categories, locations…"
            className="flex-1 py-4 bg-transparent text-base outline-none"
            style={{ color: "var(--so-text)" }}
          />
          {loading && (
            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin shrink-0" />
          )}
          <button type="button" onClick={onClose}
            className="ml-3 text-xs font-medium text-gray-400 hover:text-gray-600 shrink-0 px-2 py-1 rounded border border-gray-200 transition-colors">
            ESC
          </button>
        </form>

        {/* Results */}
        {results.length > 0 ? (
          <div>
            {results.map((r, i) => {
              const price = new Intl.NumberFormat("en-TT", {
                style: "currency", currency: r.currency ?? "TTD", minimumFractionDigits: 0,
              }).format(r.price);
              return (
                <a
                  key={r.id}
                  href={`/listings/${r.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 transition-colors border-b last:border-0"
                  style={{
                    borderColor: "var(--so-border)",
                    background: activeIdx === i ? "var(--so-row-hover)" : "transparent",
                    color: "var(--so-text)",
                  }}
                  onMouseEnter={() => setActiveIdx(i)}
                >
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {r.images?.[0] ? (
                      <Image src={r.images[0]} alt={r.title} fill className="object-cover" sizes="40px" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-base">📦</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">{r.title}</p>
                    <p className="text-xs font-bold text-red-600">{price}</p>
                  </div>
                  <span className="text-xs shrink-0" style={{ color: "var(--so-muted)" }}>{r.category}</span>
                </a>
              );
            })}
            <a
              href={`/listings?q=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="block px-4 py-3 text-sm font-semibold text-center text-red-600 hover:bg-red-50 transition-colors"
            >
              See all results for &ldquo;{query}&rdquo; →
            </a>
          </div>
        ) : query.length < 2 ? (
          <div className="px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--so-muted)" }}>
              Trending searches
            </p>
            <div className="flex flex-wrap gap-2">
              {TRENDING.map((t) => (
                <button
                  key={t}
                  onClick={() => { window.location.href = `/listings?q=${encodeURIComponent(t)}`; onClose(); }}
                  className="text-xs font-medium px-3 py-1.5 rounded-full border transition-colors hover:border-red-400 hover:text-red-700"
                  style={{ borderColor: "var(--so-border)", color: "var(--so-muted)" }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        ) : query.length >= 2 && !loading && results.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-2xl mb-2">🔍</p>
            <p className="text-sm font-medium" style={{ color: "var(--so-muted)" }}>No results for &ldquo;{query}&rdquo;</p>
            <a href={`/listings?q=${encodeURIComponent(query)}`} onClick={onClose}
              className="text-xs text-red-600 hover:text-red-700 font-semibold mt-2 inline-block">
              Browse all listings →
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
