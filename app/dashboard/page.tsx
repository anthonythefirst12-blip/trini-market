"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { listings as allListings, inquiries as allInquiries } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const SELLER_ID = "s1";
const SELLER_NAME = "Marcus Phillip";

const sellerListings = allListings.filter((l) => l.seller.id === SELLER_ID);
const sellerInquiries = allInquiries.filter((i) =>
  sellerListings.some((l) => l.id === i.listingId)
);

type Tab = "listings" | "inquiries";

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>("listings");
  const [deleted, setDeleted] = useState<Set<string>>(new Set());

  const activeListings = sellerListings.filter((l) => !deleted.has(l.id));
  const unread = sellerInquiries.filter((i) => !i.read).length;

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Welcome back, {SELLER_NAME}</p>
          </div>
          <Link href="/listings/new">
            <Button>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Listing
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Listings", value: activeListings.length, icon: "📋" },
            { label: "Total Inquiries", value: sellerInquiries.length, icon: "💬" },
            { label: "Unread Messages", value: unread, icon: "🔔" },
            { label: "Views This Week", value: 247, icon: "👁" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="font-display font-bold text-2xl text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
          {(["listings", "inquiries"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                "px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                tab === t ? "bg-white text-blue-700 shadow-sm" : "text-gray-600 hover:text-gray-900",
              ].join(" ")}
            >
              {t}
              {t === "inquiries" && unread > 0 && (
                <span className="ml-2 bg-blue-700 text-white text-xs rounded-full px-1.5 py-0.5">{unread}</span>
              )}
            </button>
          ))}
        </div>

        {/* Listings tab */}
        {tab === "listings" && (
          <div className="space-y-3">
            {activeListings.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <div className="text-4xl mb-3">📭</div>
                <p className="font-semibold text-gray-700">No listings yet</p>
                <p className="text-sm text-gray-400 mt-1">Create your first listing to start selling.</p>
                <Link href="/listings/new" className="mt-4 inline-block">
                  <Button size="sm">Post a Listing</Button>
                </Link>
              </div>
            )}
            {activeListings.map((listing) => {
              const formatted = new Intl.NumberFormat("en-TT", {
                style: "currency",
                currency: listing.currency,
                minimumFractionDigits: 0,
              }).format(listing.price);

              return (
                <div key={listing.id} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 items-center">
                  <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm text-gray-900 truncate">{listing.title}</h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-blue-700 font-semibold text-sm">{formatted}</span>
                          <Badge variant="gray">{listing.category}</Badge>
                          {listing.tier === "premium" && <span className="text-xs bg-blue-700 text-white font-bold px-1.5 py-0.5 rounded">★ Premium</span>}
                          {listing.tier === "featured" && <span className="text-xs bg-blue-100 text-blue-700 border border-blue-300 font-semibold px-1.5 py-0.5 rounded">◆ Featured</span>}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{listing.location} · Posted {new Date(listing.createdAt).toLocaleDateString("en-TT", { month: "short", day: "numeric", year: "numeric" })}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {listing.tier !== "premium" && (
                      <Link href="/wallet">
                        <Button size="sm" variant="secondary">⚡ Boost</Button>
                      </Link>
                    )}
                    <Link href={`/listings/${listing.id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                    <Link href={`/listings/new?edit=${listing.id}`}>
                      <Button variant="secondary" size="sm">Edit</Button>
                    </Link>
                    <button
                      onClick={() => setDeleted((prev) => new Set([...prev, listing.id]))}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                      aria-label="Delete listing"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Inquiries tab */}
        {tab === "inquiries" && (
          <div className="space-y-3">
            {sellerInquiries.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <div className="text-4xl mb-3">💬</div>
                <p className="font-semibold text-gray-700">No inquiries yet</p>
                <p className="text-sm text-gray-400 mt-1">Inquiries from buyers will appear here.</p>
              </div>
            )}
            {sellerInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className={[
                  "bg-white border rounded-xl p-5 transition-all",
                  !inquiry.read ? "border-blue-200 bg-blue-50/30" : "border-gray-200",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-900">{inquiry.buyerName}</span>
                      {!inquiry.read && <Badge variant="blue">New</Badge>}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Re: <Link href={`/listings/${inquiry.listingId}`} className="text-blue-600 hover:underline">{inquiry.listingTitle}</Link>
                      {" · "}{new Date(inquiry.createdAt).toLocaleDateString("en-TT", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <a
                    href={`mailto:${inquiry.buyerEmail}`}
                    className="shrink-0"
                  >
                    <Button variant="secondary" size="sm">Reply</Button>
                  </a>
                </div>
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">{inquiry.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
