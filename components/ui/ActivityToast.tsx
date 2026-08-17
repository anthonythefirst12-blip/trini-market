"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import Image from "next/image";

interface ActivityItem {
  id: string;
  title: string;
  price: number;
  currency: string;
  location: string;
  images: string[];
  created_at: string;
}

export function ActivityToast() {
  const [toast, setToast] = useState<ActivityItem | null>(null);
  const [visible, setVisible] = useState(false);
  const poolRef = useRef<ActivityItem[]>([]);
  const idxRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showNext = () => {
    const items = poolRef.current;
    if (!items.length) return;
    const item = items[idxRef.current % items.length];
    idxRef.current++;
    setToast(item);
    setVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setVisible(false), 5000);
  };

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("listings")
      .select("id, title, price, currency, location, images, created_at")
      .eq("sold", false)
      .order("created_at", { ascending: false })
      .limit(12)
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        poolRef.current = [...data].sort(() => Math.random() - 0.5);
        const initial = setTimeout(showNext, 6000);
        timerRef.current = setInterval(showNext, 22000);
        return () => clearTimeout(initial);
      });

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!toast) return null;

  const timeAgo = () => {
    const diff = Date.now() - new Date(toast.created_at).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (days > 0) return `${days}d ago`;
    if (hrs > 0) return `${hrs}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return "just now";
  };

  const formatted = new Intl.NumberFormat("en-TT", {
    style: "currency",
    currency: toast.currency ?? "TTD",
    minimumFractionDigits: 0,
  }).format(toast.price);

  return (
    <button
      aria-label={`New listing: ${toast.title} for ${formatted}`}
      onClick={() => { window.location.href = `/listings/${toast.id}`; }}
      className="fixed bottom-6 left-6 z-[9997] flex items-center gap-3 max-w-[290px] w-full cursor-pointer group"
      style={{
        background: "var(--at-bg, #ffffff)",
        border: "1px solid var(--at-border, rgba(17,24,39,0.10))",
        borderRadius: "14px",
        padding: "10px 12px",
        boxShadow: "0 8px 32px -8px rgba(0,0,0,0.18)",
        transition: "opacity 0.4s ease, transform 0.4s ease, box-shadow 0.2s",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        pointerEvents: visible ? "auto" : "none",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px -8px rgba(0,0,0,0.26)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px -8px rgba(0,0,0,0.18)"; }}
    >
      <style>{`
        [data-theme="dark"] .activity-toast-wrap {
          --at-bg: #1c1c1c;
          --at-border: rgba(255,255,255,0.08);
        }
      `}</style>
      <div className="activity-toast-wrap" />

      {/* Thumbnail */}
      <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-gray-100 shrink-0">
        {toast.images?.[0] ? (
          <Image src={toast.images[0]} alt={toast.title} fill className="object-cover" sizes="44px" unoptimized />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-lg bg-red-50">🏷️</div>
        )}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1 text-left">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 animate-pulse" />
          <span className="text-[10px] font-medium text-gray-400 truncate">{toast.location} · {timeAgo()}</span>
        </div>
        <p className="text-xs font-semibold text-gray-900 truncate leading-snug">{toast.title}</p>
        <p className="text-xs font-bold text-red-600 mt-0.5">{formatted}</p>
      </div>

      {/* Dismiss */}
      <button
        aria-label="Dismiss"
        onClick={(e) => { e.stopPropagation(); setVisible(false); }}
        className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors text-xs leading-none"
      >
        ✕
      </button>
    </button>
  );
}
