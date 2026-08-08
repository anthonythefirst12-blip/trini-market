"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";

export function PingPresence() {
  useEffect(() => {
    const ping = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase
        .from("sellers")
        .update({ last_seen: new Date().toISOString() })
        .eq("id", user.id);
    };
    ping();
    const interval = setInterval(ping, 60_000);
    return () => clearInterval(interval);
  }, []);

  return null;
}
