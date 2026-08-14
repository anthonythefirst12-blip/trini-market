"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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

function makeConvKey(userId: string, otherId: string, listingId: string) {
  return `${listingId}__${[userId, otherId].sort().join("__")}`;
}

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [myAvatar, setMyAvatar] = useState("");
  const [myName, setMyName] = useState("");
  const [userAvatars, setUserAvatars] = useState<Record<string, string>>({});
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const userIdRef = useRef<string | null>(null);
  const userNamesRef = useRef<Record<string, string>>({});
  const userAvatarsRef = useRef<Record<string, string>>({});

  const fetchSellerInfo = useCallback(async (ids: string[]) => {
    if (ids.length === 0) return;
    const supabase = createClient();
    const { data: sellers } = await supabase
      .from("sellers")
      .select("id, name, avatar")
      .in("id", ids);
    const nameMap: Record<string, string> = { ...userNamesRef.current };
    const avatarMap: Record<string, string> = { ...userAvatarsRef.current };
    (sellers ?? []).forEach((s: { id: string; name: string; avatar: string }) => {
      nameMap[s.id] = s.name;
      avatarMap[s.id] = s.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name || "?")}&background=e2e8f0&color=475569&size=80`;
    });
    userNamesRef.current = nameMap;
    userAvatarsRef.current = avatarMap;
    setUserNames(nameMap);
    setUserAvatars(avatarMap);
    return { nameMap, avatarMap };
  }, []);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/auth/login"; return; }
      setUserId(user.id);
      userIdRef.current = user.id;

      const { data: mySeller } = await supabase.from("sellers").select("name, avatar").eq("id", user.id).single();
      if (mySeller) {
        setMyName(mySeller.name);
        setMyAvatar(mySeller.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(mySeller.name)}&background=dc2626&color=fff&size=80`);
      }

      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: true });

      if (!msgs) { setLoading(false); return; }

      const convMap: Record<string, Conversation> = {};
      const otherIds = new Set<string>();

      msgs.forEach((msg: DBMessage) => {
        const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        otherIds.add(otherId);
        const key = makeConvKey(user.id, otherId, msg.listing_id);
        if (!convMap[key]) {
          convMap[key] = {
            key, otherId,
            otherName: otherId.slice(0, 8),
            otherAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(otherId.slice(0, 2))}&background=e2e8f0&color=475569&size=80`,
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

      const ids = Array.from(otherIds);
      const info = await fetchSellerInfo(ids);
      if (info) {
        Object.values(convMap).forEach((c) => {
          if (info.nameMap[c.otherId]) c.otherName = info.nameMap[c.otherId];
          if (info.avatarMap[c.otherId]) c.otherAvatar = info.avatarMap[c.otherId];
        });
      }

      const sorted = Object.values(convMap).sort((a, b) => {
        const aLast = a.messages[a.messages.length - 1]?.created_at ?? "";
        const bLast = b.messages[b.messages.length - 1]?.created_at ?? "";
        return bLast.localeCompare(aLast);
      });

      // Check if opened from "Message Seller" with query params
      const toId = searchParams.get("to");
      const listingId = searchParams.get("listing");
      const listingTitle = searchParams.get("title") ?? "";
      const listingPrice = searchParams.get("price");
      const listingImage = searchParams.get("image");

      if (toId) {
        const convListingId = listingId ?? `general-${toId}`;
        const key = makeConvKey(user.id, toId, convListingId);
        const existing = convMap[key];
        if (!existing) {
          const { data: sellerData } = await supabase.from("sellers").select("name, avatar").eq("id", toId).single();
          const newConv: Conversation = {
            key,
            otherId: toId,
            otherName: sellerData?.name ?? toId.slice(0, 8),
            otherAvatar: sellerData?.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(sellerData?.name ?? "?")}&background=e2e8f0&color=475569&size=80`,
            listingId: convListingId,
            listingTitle: listingTitle || "General Enquiry",
            listingImage,
            listingPrice,
            messages: [],
            unread: 0,
          };
          sorted.unshift(newConv);
        }
        setConversations(sorted);
        setActiveKey(existing?.key ?? key);
      } else {
        setConversations(sorted);
        if (sorted.length > 0) setActiveKey(sorted[0].key);
      }
      setLoading(false);
    };
    load();
  }, [router, fetchSellerInfo]);

  // ── Realtime subscription ─────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();

    const channel = supabase
      .channel(`messages:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${userId}`,
        },
        async (payload) => {
          const msg = payload.new as DBMessage;
          const otherId = msg.sender_id;
          const key = makeConvKey(userId, otherId, msg.listing_id);

          // Fetch seller info if not already loaded
          if (!userNamesRef.current[otherId]) {
            await fetchSellerInfo([otherId]);
          }

          setConversations((prev) => {
            const existing = prev.find((c) => c.key === key);
            if (existing) {
              return prev
                .map((c) =>
                  c.key === key
                    ? {
                        ...c,
                        messages: [...c.messages, msg],
                        unread: c.unread + (userIdRef.current && msg.receiver_id === userIdRef.current ? 1 : 0),
                      }
                    : c
                )
                .sort((a, b) => {
                  const aLast = a.messages[a.messages.length - 1]?.created_at ?? "";
                  const bLast = b.messages[b.messages.length - 1]?.created_at ?? "";
                  return bLast.localeCompare(aLast);
                });
            }
            // New conversation
            const newConv: Conversation = {
              key,
              otherId,
              otherName: userNamesRef.current[otherId] ?? otherId.slice(0, 8),
              otherAvatar: userAvatarsRef.current[otherId] ?? `https://ui-avatars.com/api/?name=?&background=e2e8f0&color=475569&size=80`,
              listingId: msg.listing_id,
              listingTitle: msg.listing_title,
              listingImage: msg.listing_image,
              listingPrice: msg.listing_price,
              messages: [msg],
              unread: 1,
            };
            return [newConv, ...prev];
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId, fetchSellerInfo]);

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

  const sendDirect = async (text: string) => {
    if (!text || !activeKey || !userId) return;
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
    if (error || !newMsg) return;
    setConversations((prev) => prev.map((c) =>
      c.key === activeKey ? { ...c, messages: [...c.messages, newMsg] } : c
    ));
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    // Notify the other party
    fetch("/api/email/new-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        receiverId: conv.otherId,
        fromName: myName || "Someone",
        listingTitle: conv.listingTitle,
        messagePreview: text,
      }),
    }).catch(() => {});
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

    // Email + push notification in parallel (fire-and-forget)
    const notifyPayload = {
      receiverId: conv.otherId,
      fromName: myName || "Someone",
      listingTitle: conv.listingTitle,
      messagePreview: text,
    };
    fetch("/api/email/new-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notifyPayload),
    }).catch(() => {});
    fetch("/api/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-internal-secret": process.env.NEXT_PUBLIC_INTERNAL_SECRET ?? "" },
      body: JSON.stringify({
        userId: conv.otherId,
        title: `New message from ${myName || "Someone"}`,
        body: text.slice(0, 100),
        url: "/messages",
      }),
    }).catch(() => {});
  };

  const active = conversations.find((c) => c.key === activeKey);
  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#FAFAFA] flex">
        {/* Conversation list skeleton */}
        <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="skeleton h-5 w-28 mb-1" />
            <div className="skeleton h-3 w-20" />
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="skeleton w-10 h-10 rounded-full shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="skeleton h-3.5 w-24 mb-1.5" />
                  <div className="skeleton h-3 w-36" />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Chat panel skeleton */}
        <div className="flex-1 flex flex-col">
          <div className="h-16 border-b border-gray-100 px-5 flex items-center gap-3">
            <div className="skeleton w-9 h-9 rounded-full" />
            <div>
              <div className="skeleton h-4 w-28 mb-1.5" />
              <div className="skeleton h-3 w-20" />
            </div>
          </div>
          <div className="flex-1 p-5 space-y-4">
            {[60, 40, 80, 50, 70].map((w, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                <div className={`skeleton h-8 rounded-2xl`} style={{ width: `${w}%`, maxWidth: 320 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-[calc(100vh-64px)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="font-display font-bold text-2xl text-gray-900">Messages</h1>
          {totalUnread > 0 && (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{totalUnread} unread</span>
          )}
        </div>

        {conversations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <div className="text-5xl mb-4">💬</div>
            <h3 className="font-display font-semibold text-lg text-gray-700">No messages yet</h3>
            <p className="text-gray-400 text-sm mt-1 mb-6">When you contact a seller or receive an enquiry, it will appear here.</p>
            <Link href="/listings" className="inline-flex items-center gap-2 bg-red-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors">
              Browse Listings
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex h-[600px]">
            {/* Conversation list — hidden on mobile when a chat is open */}
            <div className={`${activeKey ? "hidden sm:flex" : "flex"} w-full sm:w-72 lg:w-80 border-r border-gray-200 flex-col shrink-0`}>
              <div className="overflow-y-auto flex-1">
                {conversations.map((conv) => {
                  const last = conv.messages[conv.messages.length - 1];
                  return (
                    <button
                      key={conv.key}
                      onClick={() => selectConv(conv.key)}
                      className={[
                        "w-full text-left px-4 py-3 flex gap-3 items-start border-b border-gray-100 hover:bg-gray-50 transition-colors focus-visible:outline-none",
                        activeKey === conv.key ? "bg-red-50 border-r-2 border-r-red-600" : "",
                      ].join(" ")}
                    >
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                          <Image src={conv.otherAvatar} alt={conv.otherName} width={40} height={40} className="object-cover" unoptimized />
                        </div>
                        {conv.unread > 0 && (
                          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
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
                        <p className="text-xs text-red-600 truncate mt-0.5 font-medium">{conv.listingTitle}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chat thread */}
            {active ? (
              <div className="flex-1 flex flex-col min-w-0">
                <div className="px-5 py-3.5 border-b border-gray-200 flex items-center gap-3">
                  {/* Back button — mobile only */}
                  <button
                    onClick={() => setActiveKey(null)}
                    className="sm:hidden p-1 -ml-1 text-gray-500 hover:text-gray-800"
                    aria-label="Back to conversations"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 shrink-0">
                    <Image src={active.otherAvatar} alt={active.otherName} width={36} height={36} className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900">{active.otherName}</p>
                    <p className="text-xs text-gray-400 truncate">{active.listingTitle}</p>
                  </div>
                  <Link href={`/listings/${active.listingId}`} className="text-xs text-red-600 hover:text-red-800 font-medium shrink-0">
                    View listing →
                  </Link>
                </div>

                {active.listingImage && (
                  <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3 max-w-sm">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <Image src={active.listingImage} alt={active.listingTitle} fill className="object-cover" sizes="48px" unoptimized />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{active.listingTitle}</p>
                        {active.listingPrice && <p className="text-sm font-bold text-red-600">{active.listingPrice}</p>}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                  {(() => {
                    const sentMsgs = active.messages.filter((m) => m.sender_id === userId);
                    const lastReadSentId = [...sentMsgs].reverse().find((m) => m.read)?.id ?? null;
                    return active.messages.map((msg) => {
                      const isMe = msg.sender_id === userId;
                      const avatar = isMe
                        ? (myAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(myName || "Me")}&background=dc2626&color=fff&size=80`)
                        : (userAvatars[msg.sender_id] || `https://ui-avatars.com/api/?name=?&background=e2e8f0&color=475569&size=80`);
                      return (
                        <div key={msg.id} className={`flex gap-2.5 ${isMe ? "flex-row-reverse" : ""}`}>
                          <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-100 shrink-0 mt-1">
                            <Image src={avatar} alt="" width={28} height={28} className="object-cover" unoptimized />
                          </div>
                          <div className={`max-w-[70%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                              isMe ? "bg-red-600 text-white rounded-tr-sm" : "bg-gray-100 text-gray-800 rounded-tl-sm"
                            }`}>
                              {msg.text}
                            </div>
                            {/* Accept/Decline for offer messages received by current user */}
                            {!isMe && msg.text.startsWith("💰 Offer:") && (() => {
                              const hasResponse = active.messages.some(
                                (m) => m.sender_id === userId && (m.text.startsWith("✅ Offer accepted") || m.text.startsWith("❌ Offer declined"))
                              );
                              if (hasResponse) return null;
                              return (
                                <div className="flex gap-2 mt-2">
                                  <button
                                    onClick={() => sendDirect("✅ Offer accepted! Let's arrange the details.")}
                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                                  >
                                    ✅ Accept
                                  </button>
                                  <button
                                    onClick={() => sendDirect("❌ Offer declined. Feel free to make another offer.")}
                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                                  >
                                    ❌ Decline
                                  </button>
                                </div>
                              );
                            })()}
                            <div className="flex items-center gap-1.5 mt-1 px-1">
                              <span className="text-xs text-gray-400">{timeAgo(msg.created_at)}</span>
                              {isMe && msg.id === lastReadSentId && (
                                <span className="text-xs text-blue-500 font-medium flex items-center gap-0.5">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18 7l-1.41-1.42L10 12.17 7.41 9.59 6 11l4 4 8-8zm-4 0l-1.41-1.42L6 12.17 5.41 11.59 4 13l4 4 2-2-1.41-1.41L10 12.17l4-5.17z"/>
                                  </svg>
                                  Seen
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                  <div ref={bottomRef} />
                </div>

                <div className="px-5 py-3 border-t border-gray-200">
                  <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2 items-end">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value.slice(0, 500))}
                        placeholder="Type a message…"
                        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 pr-14"
                      />
                      {input.length > 0 && (
                        <span className={`absolute right-3 bottom-2.5 text-xs ${input.length >= 480 ? "text-red-500" : "text-gray-400"}`}>
                          {input.length}/500
                        </span>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={!input.trim() || sending}
                      className="px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex flex-1 items-center justify-center text-gray-400 flex-col gap-3 bg-white">
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

export default function MessagesPage() {
  return (
    <Suspense>
      <MessagesContent />
    </Suspense>
  );
}
