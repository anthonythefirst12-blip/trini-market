"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { Bell, Trash2, Search, ArrowRight, Loader2 } from "lucide-react";

interface SavedSearch {
  id: string;
  label: string;
  category: string | null;
  search_term: string | null;
  max_price: number | null;
  created_at: string;
  last_notified_at: string | null;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function buildHref(s: SavedSearch) {
  const p = new URLSearchParams();
  if (s.category) p.set("category", s.category);
  if (s.search_term) p.set("q", s.search_term);
  if (s.max_price) p.set("maxPrice", String(s.max_price));
  return `/listings?${p.toString()}`;
}

export default function SavedSearchesPage() {
  const router = useRouter();
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth/login"); return; }
      const res = await fetch("/api/saved-searches");
      if (res.ok) {
        const json = await res.json();
        setSearches(json.searches ?? []);
      }
      setLoading(false);
    };
    load();
  }, [router]);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const supabase = createClient();
    await supabase.from("saved_searches").delete().eq("id", id);
    setSearches((prev) => prev.filter((s) => s.id !== id));
    setDeleting(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#111111] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#111111]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Saved Searches</h1>
            <p className="text-sm text-gray-400 mt-0.5">Get email alerts when new listings match your search</p>
          </div>
          <Link
            href="/listings"
            className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            Browse →
          </Link>
        </div>

        {searches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Bell size={28} className="text-gray-300 dark:text-gray-600" strokeWidth={1.5} />
            </div>
            <p className="font-semibold text-gray-700 dark:text-gray-300 text-lg">No saved searches</p>
            <p className="text-gray-400 text-sm mt-1 max-w-xs leading-relaxed">
              Browse listings and tap <strong className="font-semibold text-gray-500 dark:text-gray-400">Save Search</strong> to get email alerts for new matches.
            </p>
            <Link
              href="/listings"
              className="mt-6 inline-flex items-center gap-2 bg-red-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-red-700 transition-colors"
            >
              <Search size={14} strokeWidth={2} />
              Browse Listings
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {searches.map((s) => (
              <div
                key={s.id}
                className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-4 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                  <Bell size={16} className="text-red-600" strokeWidth={1.5} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{s.label}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    Saved {timeAgo(s.created_at)}
                    {s.last_notified_at && ` · Last alert ${timeAgo(s.last_notified_at)}`}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={buildHref(s)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
                  >
                    View <ArrowRight size={11} strokeWidth={2.5} />
                  </Link>
                  <button
                    onClick={() => handleDelete(s.id)}
                    disabled={deleting === s.id}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    aria-label="Delete saved search"
                  >
                    {deleting === s.id
                      ? <Loader2 size={14} className="animate-spin" />
                      : <Trash2 size={14} strokeWidth={1.5} />
                    }
                  </button>
                </div>
              </div>
            ))}

            <p className="text-xs text-gray-400 dark:text-gray-600 text-center pt-2">
              Alerts are sent by email when new listings match your saved searches.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
