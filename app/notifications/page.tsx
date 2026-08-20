"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
import {
  Bell, MessageCircle, Star, DollarSign, CheckCircle, XCircle,
} from "lucide-react";

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

const TYPE_META: Record<NotifType, { Icon: React.ElementType; color: string; bg: string; darkBg: string }> = {
  message:        { Icon: MessageCircle, color: "text-blue-500",   bg: "bg-blue-50",   darkBg: "dark:bg-blue-900/20"   },
  offer:          { Icon: DollarSign,    color: "text-amber-500",  bg: "bg-amber-50",  darkBg: "dark:bg-amber-900/20"  },
  offer_accepted: { Icon: CheckCircle,   color: "text-green-500",  bg: "bg-green-50",  darkBg: "dark:bg-green-900/20"  },
  offer_declined: { Icon: XCircle,       color: "text-red-400",    bg: "bg-red-50",    darkBg: "dark:bg-red-900/20"    },
  review:         { Icon: Star,          color: "text-yellow-500", bg: "bg-yellow-50", darkBg: "dark:bg-yellow-900/20" },
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

function groupLabel(iso: string): string {
  const now = new Date();
  const d = new Date(iso);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - 86400000);
  const weekStart = new Date(todayStart.getTime() - 6 * 86400000);

  if (d >= todayStart) return "Today";
  if (d >= yesterdayStart) return "Yesterday";
  if (d >= weekStart) return "This Week";
  return "Earlier";
}

const GROUP_ORDER = ["Today", "Yesterday", "This Week", "Earlier"];

export default function NotificationsPage() {
  const router = useRouter();
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/auth/login"); return; }
      setUserId(user.id);

      const [messagesRes, reviewsRes] = await Promise.all([
        supabase
          .from("messages")
          .select("id, text, listing_title, listing_id, created_at, read, sender_id")
          .eq("receiver_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("seller_reviews")
          .select("id, rating, comment, created_at")
          .eq("seller_id", user.id)
          .order("created_at", { ascending: false }),
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
          body: text.slice(0, 120),
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
          body: r.comment?.slice(0, 120) ?? "No comment left.",
          href: "/dashboard",
          time: r.created_at,
          read: false,
        });
      }

      built.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setNotifs(built);
      setLoading(false);
    };
    load();
  }, [router]);

  const markAllRead = async () => {
    if (!userId) return;
    const supabase = createClient();
    const unreadMsgIds = notifs
      .filter((n) => !n.read && n.id.startsWith("msg-"))
      .map((n) => n.id.replace("msg-", ""));
    if (unreadMsgIds.length) {
      await supabase.from("messages").update({ read: true }).in("id", unreadMsgIds);
    }
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markOneRead = async (notif: Notif) => {
    if (notif.read) return;
    if (notif.id.startsWith("msg-")) {
      const supabase = createClient();
      await supabase.from("messages").update({ read: true }).eq("id", notif.id.replace("msg-", ""));
    }
    setNotifs((prev) => prev.map((n) => n.id === notif.id ? { ...n, read: true } : n));
  };

  const unreadCount = notifs.filter((n) => !n.read).length;

  // Group notifications
  const grouped: Record<string, Notif[]> = {};
  for (const n of notifs) {
    const label = groupLabel(n.time);
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(n);
  }

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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-400 mt-0.5">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Empty state */}
        {notifs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Bell size={28} className="text-gray-300 dark:text-gray-600" strokeWidth={1.5} />
            </div>
            <p className="font-semibold text-gray-700 dark:text-gray-300 text-lg">No notifications yet</p>
            <p className="text-gray-400 text-sm mt-1 max-w-xs">
              Messages, offers, and reviews will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {GROUP_ORDER.filter((g) => grouped[g]?.length).map((group) => (
              <div key={group}>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 px-1">
                  {group}
                </p>
                <div className="bg-white dark:bg-[#1c1c1c] rounded-2xl border border-gray-200 dark:border-white/10 divide-y divide-gray-100 dark:divide-white/5 overflow-hidden">
                  {grouped[group].map((n) => {
                    const { Icon, color, bg, darkBg } = TYPE_META[n.type];
                    return (
                      <Link
                        key={n.id}
                        href={n.href}
                        onClick={() => markOneRead(n)}
                        className={[
                          "flex gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors",
                          !n.read ? "bg-red-50/40 dark:bg-red-900/10" : "",
                        ].join(" ")}
                      >
                        {/* Icon */}
                        <div className={`w-9 h-9 rounded-xl ${bg} ${darkBg} flex items-center justify-center shrink-0 mt-0.5`}>
                          <Icon size={16} className={color} strokeWidth={1.5} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-snug ${!n.read ? "font-semibold text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                            {n.title}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                            {n.body}
                          </p>
                          <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">{timeAgo(n.time)}</p>
                        </div>

                        {/* Unread dot */}
                        {!n.read && (
                          <span className="w-2 h-2 bg-red-500 rounded-full shrink-0 mt-2" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
