"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase-browser";
import Link from "next/link";

type Notif = {
  id: string;
  type: "message" | "review" | "offer";
  title: string;
  body: string;
  href: string;
  time: string;
  read: boolean;
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const loadNotifs = async (uid: string) => {
    const supabase = createClient();
    const [messagesRes, reviewsRes] = await Promise.all([
      supabase
        .from("messages")
        .select("id, content, created_at, listing_id, read, sender_id, senders:sellers!messages_sender_id_fkey(name)")
        .eq("receiver_id", uid)
        .order("created_at", { ascending: false })
        .limit(15),
      supabase
        .from("seller_reviews")
        .select("id, rating, comment, created_at, reviewers:sellers!seller_reviews_user_id_fkey(name)")
        .eq("seller_id", uid)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    const built: Notif[] = [];
    for (const m of messagesRes.data ?? []) {
      const isOffer = m.content?.startsWith("💰 Offer:");
      const senderName = (m.senders as { name?: string } | null)?.name ?? "Someone";
      built.push({
        id: `msg-${m.id}`,
        type: isOffer ? "offer" : "message",
        title: isOffer ? `New offer from ${senderName}` : `Message from ${senderName}`,
        body: m.content?.slice(0, 80) ?? "",
        href: "/messages",
        time: m.created_at,
        read: m.read ?? false,
      });
    }
    for (const r of reviewsRes.data ?? []) {
      const reviewerName = (r.reviewers as { name?: string } | null)?.name ?? "Someone";
      built.push({
        id: `rev-${r.id}`,
        type: "review",
        title: `${reviewerName} left you a ${r.rating}★ review`,
        body: r.comment ?? "No comment left.",
        href: "/dashboard",
        time: r.created_at,
        read: false,
      });
    }
    built.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    setNotifs(built.slice(0, 12));
  };

  // Resolve user on mount
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) { setUserId(user.id); loadNotifs(user.id); }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) { setNotifs([]); setUserId(null); }
      else if (session.user) { setUserId(session.user.id); loadNotifs(session.user.id); }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Realtime subscription — only runs once userId is known
  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();
    // Unique name per mount so we never hit an already-subscribed channel
    const channel = supabase
      .channel(`notif-bell-${userId}-${Date.now()}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `receiver_id=eq.${userId}`,
      }, () => loadNotifs(userId))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (!userId) return null;

  const unread = notifs.filter((n) => !n.read).length;

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }

  const icon = {
    message: "💬",
    offer: "💰",
    review: "⭐",
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
        className="relative p-2 text-gray-500 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-100"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-gray-200 shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-display font-semibold text-sm text-gray-900">Notifications</h3>
            {unread > 0 && (
              <button
                onClick={async () => {
                  const supabase = createClient();
                  const unreadIds = notifs.filter((n) => !n.read && n.id.startsWith("msg-")).map((n) => n.id.replace("msg-", ""));
                  if (unreadIds.length) await supabase.from("messages").update({ read: true }).in("id", unreadIds);
                  setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
                }}
                className="text-xs text-red-600 hover:text-red-700 font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
            {notifs.length === 0 ? (
              <div className="py-10 text-center">
                <div className="text-3xl mb-2">🔔</div>
                <p className="text-gray-400 text-sm">No notifications yet</p>
              </div>
            ) : (
              notifs.map((n) => (
                <Link
                  key={n.id}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className={`flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${!n.read ? "bg-red-50/40" : ""}`}
                >
                  <span className="text-xl shrink-0 mt-0.5">{icon[n.type]}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-snug ${!n.read ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{n.body}</p>
                    <p className="text-xs text-gray-300 mt-1">{timeAgo(n.time)}</p>
                  </div>
                  {!n.read && <span className="w-2 h-2 bg-red-500 rounded-full shrink-0 mt-2" />}
                </Link>
              ))
            )}
          </div>

          <div className="px-4 py-2.5 border-t border-gray-100">
            <Link href="/messages" onClick={() => setOpen(false)} className="block text-center text-xs text-red-600 hover:text-red-700 font-medium">
              View all messages →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
