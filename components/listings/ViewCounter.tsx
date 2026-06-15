"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

interface Props {
  listingId: string;
  initialViews: number;
}

export function ViewCounter({ listingId, initialViews }: Props) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    const supabase = createClient();
    supabase.rpc("increment_listing_views", { p_listing_id: listingId });
    setViews((v) => v + 1);
  }, [listingId]);

  return (
    <span className="flex items-center gap-1">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      {views} {views === 1 ? "view" : "views"}
    </span>
  );
}
