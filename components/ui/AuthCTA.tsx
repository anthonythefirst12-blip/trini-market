"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

export function AuthCTA() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
    });
  }, []);

  if (loggedIn === null) return <div className="h-12" />;

  if (loggedIn) {
    return (
      <Link
        href="/listings/new"
        className="inline-flex items-center gap-2 bg-red-600 text-white font-bold px-8 py-3.5 rounded-full hover:bg-red-700 hover:shadow-[0_0_24px_rgba(220,38,38,0.4)] active:scale-95 transition-all duration-200"
      >
        + Post a Listing
      </Link>
    );
  }

  return (
    <Link
      href="/auth/register"
      className="inline-flex items-center gap-2 bg-red-600 text-white font-bold px-8 py-3.5 rounded-full hover:bg-red-700 hover:shadow-[0_0_24px_rgba(220,38,38,0.4)] active:scale-95 transition-all duration-200"
    >
      Create Free Account
    </Link>
  );
}
