"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { Bell, BellRing, Loader2 } from "lucide-react";

export function SaveSearchButton() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"idle" | "loading" | "saved" | "error">("idle");

  const category = searchParams.get("category") ?? "";
  const q = searchParams.get("q") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";

  // Only render when at least one filter is active
  const hasFilters = !!(category || q || maxPrice);
  if (!hasFilters) return null;

  const handleSave = async () => {
    setStatus("loading");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Redirect to login
      window.location.href = `/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`;
      return;
    }

    // Build a human-readable label
    const parts: string[] = [];
    if (q) parts.push(`"${q}"`);
    if (category) parts.push(category);
    if (maxPrice) parts.push(`under TT$${maxPrice}`);
    const label = parts.join(" · ");

    try {
      const res = await fetch("/api/saved-searches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label,
          category: category || null,
          search_term: q || null,
          max_price: maxPrice ? Number(maxPrice) : null,
        }),
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={status === "loading" || status === "saved"}
      className={[
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
        status === "saved"
          ? "bg-green-50 border-green-300 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400"
          : status === "error"
          ? "bg-red-50 border-red-300 text-red-700 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400"
          : "bg-white border-gray-300 text-gray-600 hover:border-red-400 hover:text-red-700 hover:bg-red-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:border-red-500 dark:hover:text-red-400",
      ].join(" ")}
      title="Save this search and get email alerts for new matching listings"
    >
      {status === "loading" ? (
        <Loader2 size={11} className="animate-spin" />
      ) : status === "saved" ? (
        <BellRing size={11} />
      ) : (
        <Bell size={11} />
      )}
      {status === "saved" ? "Saved!" : status === "error" ? "Error — retry" : "Save Search"}
    </button>
  );
}
