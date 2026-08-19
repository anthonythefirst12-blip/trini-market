"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase-browser";
import Link from "next/link";
import { Bell, MessageCircle, Star, DollarSign, CheckCircle, XCircle } from "lucide-react";

type NotifType = "message" | "review" | "offer" | "offer_accepted" | "offer_declined";

type Notif = {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  href: string;
  time: string;
  read: boolean;
};

const TYPE_META: Record<NotifType, { Icon: React.ElementType; color: string; bg: string }> = {
  message:        { Icon: MessageCircle, color: "text-blue-500",  bg: "bg-blue-50"  },
  offer:          { Icon: DollarSign,    color: "text-amber-500", bg: "bg-amber-50" },
  offer_accepted: { Icon: CheckCircle,   color: "text-green-500", bg: "bg-green-50" },
  offer_declined: { Icon: XCircle,       color: "text-red-400",   bg: "bg-red-50"   },
  review:         { Icon: Star,          color: "text-yellow-500",bg: "bg-yellow-50"},
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

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
        .select("id, text, listing_title, listing_id, created_at, read, sender_id")
        .eq("receiver_id", uid)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("seller_reviews")
        .select("id, rating, comment, created_at")
        .eq("seller_id", uid)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    const built: Notif[] = [];

    for (const m of messagesRes.data ?? []) {
      const text: string = m.text ?? "";
      let type: NotifType = "message";
      let title = `New message about "${m.listing_title}"`;

      if (text.startsWith("💰 Offer:")) {
        type = "offer";
        title = `New offer on "${m.listing_title}"`;
      } else if (text.startsWith("✅ Offer accepted")) {
        type = "offer_accepted";
        title = `Offer accepted on "${m.listing_title}"`;
      } else if (text.startsWith("❌ Offer declined")) {
        type = "offer_declined";
        title = `Offer declined on "${m.listing_title}"`;
      }

      built.push({
        id: `msg-${m.id}`,
        type,
        title,
        body: text.slice(0, 90),
        href: `/messages?to=${m.sender_id}&listing=${m.listing_id}&title=${encodeURIComponent(m.listing_title ?? "")}`,
        time: m.created_at,
        read: m.read ?? false,
      });
    }

    for (const r of reviewsRes.data ?? []) {
      built.push({
        id: `rev-${r.id}`,
        type: "review",
        title: `You received a ${r.rating}★ review`,
        body: r.comment?.slice(0, 90) ?? "No comment left.",
        href: "/dashboard",
        time: r.created_at,
        read: false,
      });
    }

    built.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    setNotifs(built.slice(0, 15));
  };

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

  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();
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

  const markAllRead = async () => {
    const supabase = createClient();
    const unreadMsgIds = notifs
      .filter((n) => !n.read && n.id.startsWith("msg-"))
      .map((n) => n.id.replace("msg-", ""));
    if (unreadMsgIds.length) {
      await supabase.from("messages").update({ read: true }).in("id", unreadMsgIds);
    }
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
        className="relative p-2 text-gray-500 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-100"
      >
        <Bell size={20} strokeWidth={1.5} />
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
              <button onClick={markAllRead} className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors">
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[420px] overflow-y-auto divide-y divide-gray-50">
            {notifs.length === 0 ? (
              <div className="py-10 text-center">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
                  <Bell size={22} className="text-gray-300" strokeWidth={1.5} />
                </div>
                <p className="text-gray-400 text-sm font-medium">No notifications yet</p>
                <p className="text-gray-300 text-xs mt-1">Messages and reviews will appear here</p>
              </div>
            ) : (
              notifs.map((n) => {
                const { Icon, color, bg } = TYPE_META[n.type];
                return (
                  <Link
                    key={n.id}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className={`flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${!n.read ? "bg-red-50/30" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon size={15} className={color} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${!n.read ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                        {n.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{n.body}</p>
                      <p className="text-xs text-gray-300 mt-1">{timeAgo(n.time)}</p>
                    </div>
                    {!n.read && <span className="w-2 h-2 bg-red-500 rounded-full shrink-0 mt-2.5" />}
                  </Link>
                );
              })
            )}
          </div>

          <div className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-between">
            <Link href="/messages" onClick={() => setOpen(false)} className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors">
              All messages →
            </Link>
            <Link href="/dashboard" onClick={() => setOpen(false)} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
