"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

interface Props {
  sellerId: string;
}

export function SellerPresence({ sellerId }: Props) {
  const [lastSeen, setLastSeen] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("sellers")
      .select("last_seen")
      .eq("id", sellerId)
      .single()
      .then(({ data }) => {
        if (data?.last_seen) setLastSeen(data.last_seen);
      });
  }, [sellerId]);

  if (!lastSeen) return null;

  const diff = Date.now() - new Date(lastSeen).getTime();
  const mins = Math.floor(diff / 60000);

  let label: string;
  let color: string;

  if (mins < 5) {
    label = "Online now";
    color = "bg-green-500";
  } else if (mins < 60) {
    label = `Active ${mins}m ago`;
    color = "bg-amber-400";
  } else if (mins < 1440) {
    label = "Active today";
    color = "bg-gray-300";
  } else {
    return null; // Don't show if inactive for more than a day
  }

  return (
    <div className="flex items-center gap-1.5 mt-1">
      <span className={`w-2 h-2 rounded-full ${color} ${mins < 5 ? "animate-pulse" : ""}`} />
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}
