"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { conversations as initialConversations } from "@/lib/data";
import { Conversation, Message } from "@/lib/types";

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
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeId, setActiveId] = useState<string>(conversations[0]?.id);
  const [input, setInput] = useState("");

  const active = conversations.find((c) => c.id === activeId);

  const selectConv = (id: string) => {
    setActiveId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text || !activeId) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      senderId: "me",
      senderName: "You",
      senderAvatar: "https://i.pravatar.cc/80?img=11",
      text,
      createdAt: new Date().toISOString(),
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId ? { ...c, messages: [...c.messages, newMsg] } : c
      )
    );
    setInput("");
  };

  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);

  return (
    <div className="bg-[#FAFAFA] min-h-[calc(100vh-64px)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="font-display font-bold text-2xl text-gray-900">Messages</h1>
          {totalUnread > 0 && (
            <span className="bg-blue-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">{totalUnread} unread</span>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex h-[600px]">
          {/* Conversation list */}
          <div className="w-full sm:w-72 lg:w-80 border-r border-gray-200 flex flex-col shrink-0">
            <div className="p-3 border-b border-gray-100">
              <input
                type="text"
                placeholder="Search conversations…"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
            <div className="overflow-y-auto flex-1">
              {conversations.map((conv) => {
                const last = conv.messages[conv.messages.length - 1];
                return (
                  <button
                    key={conv.id}
                    onClick={() => selectConv(conv.id)}
                    className={[
                      "w-full text-left px-4 py-3 flex gap-3 items-start border-b border-gray-100 hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500",
                      activeId === conv.id ? "bg-blue-50 border-r-2 border-r-blue-600" : "",
                    ].join(" ")}
                  >
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                        <Image src={conv.participantAvatar} alt={conv.participantName} width={40} height={40} className="object-cover" />
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
                          {conv.participantName}
                        </span>
                        <span className="text-xs text-gray-400 shrink-0">{last ? timeAgo(last.createdAt) : ""}</span>
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
              {/* Thread header */}
              <div className="px-5 py-3.5 border-b border-gray-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 shrink-0">
                  <Image src={active.participantAvatar} alt={active.participantName} width={36} height={36} className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900">{active.participantName}</p>
                  <p className="text-xs text-gray-400 truncate">{active.listingTitle}</p>
                </div>
                <Link href={`/listings/${active.listingId}`} className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors shrink-0">
                  View listing →
                </Link>
              </div>

              {/* Listing reference card */}
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3 max-w-sm">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <Image src={active.listingImage} alt={active.listingTitle} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{active.listingTitle}</p>
                    <p className="text-sm font-bold text-blue-700">{active.listingPrice}</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {active.messages.map((msg) => {
                  const isMe = msg.senderId === "me";
                  return (
                    <div key={msg.id} className={`flex gap-2.5 ${isMe ? "flex-row-reverse" : ""}`}>
                      <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-100 shrink-0 mt-1">
                        <Image src={msg.senderAvatar} alt={msg.senderName} width={28} height={28} className="object-cover" />
                      </div>
                      <div className={`max-w-[70%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isMe
                            ? "bg-blue-700 text-white rounded-tr-sm"
                            : "bg-gray-100 text-gray-800 rounded-tl-sm"
                        }`}>
                          {msg.text}
                        </div>
                        <span className="text-xs text-gray-400 mt-1 px-1">{timeAgo(msg.createdAt)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input */}
              <div className="px-5 py-3 border-t border-gray-200">
                <form
                  onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message…"
                    className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="px-4 py-2.5 bg-blue-700 text-white rounded-xl hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
      </div>
    </div>
  );
}
