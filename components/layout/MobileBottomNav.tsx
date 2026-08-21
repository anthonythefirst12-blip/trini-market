"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, Search, Plus, MessageCircle, User } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

export function MobileBottomNav() {
  const pathname = usePathname();
  const [userId, setUserId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();
    supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("receiver_id", userId)
      .eq("read", false)
      .then(({ count }) => setUnreadCount(count ?? 0));

    // Unread notifications (reviews received)
    supabase
      .from("seller_reviews")
      .select("id", { count: "exact", head: true })
      .eq("seller_id", userId)
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .then(({ count }) => setUnreadNotifs(count ?? 0));
  }, [userId]);

  const accountHref = userId ? "/dashboard" : "/auth/login";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const tabClass = (href: string) =>
    isActive(href)
      ? "text-red-600"
      : "text-gray-400";

  const labelClass = (href: string) =>
    isActive(href)
      ? "text-red-600"
      : "text-gray-500";

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#111111] border-t border-gray-200 dark:border-white/10">
      <div className="flex items-center justify-around px-2 h-[60px] pb-safe">
        {/* Home */}
        <Link href="/" className={`flex flex-col items-center gap-0.5 ${tabClass("/")}`}>
          <Home size={isActive("/") ? 20 : 22} strokeWidth={1.5} />
          <span className={`text-[10px] font-medium ${labelClass("/")}`}>Home</span>
        </Link>

        {/* Browse */}
        <Link href="/listings" className={`flex flex-col items-center gap-0.5 ${tabClass("/listings")}`}>
          <Search size={isActive("/listings") ? 20 : 22} strokeWidth={1.5} />
          <span className={`text-[10px] font-medium ${labelClass("/listings")}`}>Browse</span>
        </Link>

        {/* Sell — center raised button */}
        <Link href="/listings/new" className="flex flex-col items-center -translate-y-3">
          <span className="flex items-center justify-center w-12 h-12 rounded-full bg-red-600 shadow-lg">
            <Plus size={22} strokeWidth={1.5} className="text-white" />
          </span>
        </Link>

        {/* Messages */}
        <Link href="/messages" className={`flex flex-col items-center gap-0.5 relative ${tabClass("/messages")}`}>
          <span className="relative">
            <MessageCircle size={isActive("/messages") ? 20 : 22} strokeWidth={1.5} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-600" />
            )}
          </span>
          <span className={`text-[10px] font-medium ${labelClass("/messages")}`}>Messages</span>
        </Link>

        {/* Account */}
        <Link href={accountHref} className={`flex flex-col items-center gap-0.5 relative ${tabClass(accountHref)}`}>
          <span className="relative">
            <User size={isActive(accountHref) ? 20 : 22} strokeWidth={1.5} />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-600" />
            )}
          </span>
          <span className={`text-[10px] font-medium ${labelClass(accountHref)}`}>Account</span>
        </Link>
      </div>
    </nav>
  );
}
