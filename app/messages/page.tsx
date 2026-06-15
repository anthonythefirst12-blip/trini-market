"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

interface DBMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  listing_id: string;
  listing_title: string;
  listing_image: string | null;
  listing_price: string | null;
  text: string;
  created_at: string;
  read: boolean;
}

interface Conversation {
  key: string;
  otherId: string;
  otherName: string;
  otherAvatar: string;
  listingId: string;
  listingTitle: string;
  listingImage: string | null;
  listingPrice: string | null;
  messages: DBMessage[];
  unread: number;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function MessagesPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [userAvatars, setUserAvatars] = useState<Record<string, string>>({});
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }
      setUserId(user.id);

      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: true });

      if (!msgs) { setLoading(false); return; }

      // Group into conversations by (listing_id + other_user)
      const convMap: Record<string, Conversation> = {};
      const otherIds = new Set<string>();

      msgs.forEach((msg: DBMessage) => {
        const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        otherIds.add(otherId);
        const key = `${msg.listing_id}__${[user.id, otherId].sort().join("__")}`;
        if (!convMap[key]) {
          convMap[key] = {
            key, otherId,
            otherName: otherId.slice(0, 8),
            otherAvatar: `https://i.pravatar.cc/80?u=${otherId}`,
            listingId: msg.listing_id,
            listingTitle: msg.listing_title,
            listingImage: msg.listing_image,
            listingPrice: msg.listing_price,
            messages: [],
            unread: 0,
          };
        }
        convMap[key].messages.push(msg);
        if (!msg.read && msg.receiver_id === user.id) convMap[key].unread++;
      });

      // Fetch seller names
      const ids = Array.from(otherIds);
      if (ids.length > 0) {
        const { data: sellers } = await supabase
          .from("sellers")
          .select("id, name, avatar")
          .in("id", ids);
        const nameMap: Record<string, string> = {};
        const avatarMap: Record<string, string> = {};
        (sellers ?? []).forEach((s: { id: string; name: string; avatar: string }) => {
          nameMap[s.id] = s.name;
          avatarMap[s.id] = s.avatar;
        });
        setUserNames(nameMap);
        setUserAvatars(avatarMap);
        Object.values(convMap).forEach((c) => {
          if (nameMap[c.otherId]) c.otherName = nameMap[c.otherId];
          if (avatarMap[c.otherId]) c.otherAvatar = avatarMap[c.otherId];
        });
      }

      const sorted = Object.values(convMap).sort((a, b) => {
        const aLast = a.messages[a.messages.length - 1]?.created_at ?? "";
        const bLast = b.messages[b.messages.length - 1]?.created_at ?? "";
        return bLast.localeCompare(aLast);
      });

      setConversations(sorted);
      if (sorted.length > 0) setActiveKey(sorted[0].key);
      setLoading(false);
    };
    load();
  }, [router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeKey, conversations]);

  const markRead = async (key: string) => {
    if (!userId) return;
    setConversations((prev) => prev.map((c) => c.key === key ? { ...c, unread: 0 } : c));
    const supabase = createClient();
    const conv = conversations.find((c) => c.key === key);
    if (!conv) return;
    const unreadIds = conv.messages.filter((m) => !m.read && m.receiver_id === userId).map((m) => m.id);
    if (unreadIds.length > 0) {
      await supabase.from("messages").update({ read: true }).in("id", unreadIds);
    }
  };

  const selectConv = (key: string) => {
    setActiveKey(key);
    markRead(key);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || !activeKey || !userId) return;
    setSending(true);
    const conv = conversations.find((c) => c.key === activeKey);
    if (!conv) return;

    const supabase = createClient();
    const { data: newMsg, error } = await supabase.from("messages").insert({
      sender_id: userId,
      receiver_id: conv.otherId,
      listing_id: conv.listingId,
      listing_title: conv.listingTitle,
      listing_image: conv.listingImage,
      listing_price: conv.listingPrice,
      text,
    }).select().single();

    setSending(false);
    if (error || !newMsg) return;
    setInput("");
    setConversations((prev) => prev.map((c) =>
      c.key === activeKey ? { ...c, messages: [...c.messages, newMsg] } : c
    ));
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const active = conversations.find((c) => c.key === activeKey);
  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#FAFAFA] flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading messages…</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-[calc(100vh-64px)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="font-display font-bold text-2xl text-gray-900">Messages</h1>
          {totalUnread > 0 && (
            <span className="bg-blue-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">{totalUnread} unread</span>
          )}
        </div>

        {conversations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <div className="text-5xl mb-4">💬</div>
            <h3 className="font-display font-semibold text-lg text-gray-700">No messages yet</h3>
            <p className="text-gray-400 text-sm mt-1 mb-6">When you contact a seller or receive an enquiry, it will appear here.</p>
            <Link href="/listings" className="inline-flex items-center gap-2 bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-blue-800 transition-colors">
              Browse Listings
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex h-[600px]">
            {/* Conversation list */}
            <div className="w-full sm:w-72 lg:w-80 border-r border-gray-200 flex flex-col shrink-0">
              <div className="overflow-y-auto flex-1">
                {conversations.map((conv) => {
                  const last = conv.messages[conv.messages.length - 1];
                  return (
                    <button
                      key={conv.key}
                      onClick={() => selectConv(conv.key)}
                      className={[
                        "w-full text-left px-4 py-3 flex gap-3 items-start border-b border-gray-100 hover:bg-gray-50 transition-colors focus-visible:outline-none",
                        activeKey === conv.key ? "bg-blue-50 border-r-2 border-r-blue-600" : "",
                      ].join(" ")}
                    >
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                          <Image src={conv.otherAvatar} alt={conv.otherName} width={40} height={40} className="object-cover" unoptimized />
                        </div>
                        {conv.unread > 0 && (
                          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-700 text-white text-xs rounded-full flex items-center justify-center font-bold">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-sm truncate ${conv.unread > 0 ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>
                            {conv.otherName}
                          </span>
                          <span className="text-xs text-gray-400 shrink-0">{last ? timeAgo(last.created_at) : ""}</span>
                        </div>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{last?.text}</p>
                        <p className="text-xs text-blue-600 truncate mt-0.5 font-medium">{conv.listingTitle}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chat thread */}
            {active ? (
              <div className="flex-1 flex flex-col min-w-0 hidden sm:flex">
                <div className="px-5 py-3.5 border-b border-gray-200 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 shrink-0">
                    <Image src={active.otherAvatar} alt={active.otherName} width={36} height={36} className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900">{active.otherName}</p>
                    <p className="text-xs text-gray-400 truncate">{active.listingTitle}</p>
                  </div>
                  <Link href={`/listings/${active.listingId}`} className="text-xs text-blue-600 hover:text-blue-800 font-medium shrink-0">
                    View listing →
                  </Link>
                </div>

                {/* Listing ref card */}
                {active.listingImage && (
                  <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3 max-w-sm">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <Image src={active.listingImage} alt={active.listingTitle} fill className="object-cover" sizes="48px" unoptimized />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{active.listingTitle}</p>
                        {active.listingPrice && <p className="text-sm font-bold text-blue-700">{active.listingPrice}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                  {active.messages.map((msg) => {
                    const isMe = msg.sender_id === userId;
                    const avatar = isMe
                      ? `https://i.pravatar.cc/80?u=${userId}`
                      : (userAvatars[msg.sender_id] ?? `https://i.pravatar.cc/80?u=${msg.sender_id}`);
                    return (
                      <div key={msg.id} className={`flex gap-2.5 ${isMe ? "flex-row-reverse" : ""}`}>
                        <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-100 shrink-0 mt-1">
                          <Image src={avatar} alt="" width={28} height={28} className="object-cover" unoptimized />
                        </div>
                        <div className={`max-w-[70%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                          <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isMe ? "bg-blue-700 text-white rounded-tr-sm" : "bg-gray-100 text-gray-800 rounded-tl-sm"
                          }`}>
                            {msg.text}
                          </div>
                          <span className="text-xs text-gray-400 mt-1 px-1">{timeAgo(msg.created_at)}</span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="px-5 py-3 border-t border-gray-200">
                  <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type a message…"
                      className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || sending}
                      className="px-4 py-2.5 bg-blue-700 text-white rounded-xl hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex flex-1 items-center justify-center text-gray-400 flex-col gap-3">
                <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm">Select a conversation</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
