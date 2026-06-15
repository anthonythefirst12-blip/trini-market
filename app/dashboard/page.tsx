"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

type Tab = "listings" | "inquiries" | "subscriptions";

type DBListing = {
  id: string;
  title: string;
  price: number;
  currency: string;
  category: string;
  location: string;
  images: string[];
  tier: string;
  created_at: string;
  sold?: boolean;
};

type DBSubscription = {
  id: string;
  tier: "featured" | "premium";
  status: string;
  price_ttd: number;
  next_billing_at: string;
  cancelled_at?: string;
  listings?: { title: string } | null;
};

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center"><div className="text-sm text-gray-400">Loading dashboard…</div></div>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const justPosted = searchParams.get("posted") === "1";

  const [tab, setTab] = useState<Tab>("listings");
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<DBListing[]>([]);
  const [subscriptions, setSubscriptions] = useState<DBSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const justEdited = searchParams.get("edited") === "1";
  const [toast, setToast] = useState<string | null>(
    justPosted ? "🎉 Listing posted successfully!" : justEdited ? "✅ Listing updated." : null
  );

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = useCallback(async () => {
    const supabase = createClient();
    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) { setLoading(false); return; }
    setUser(u);

    const [listingsRes, subsRes] = await Promise.all([
      supabase
        .from("listings")
        .select("id, title, price, currency, category, location, images, tier, created_at, sold")
        .eq("user_id", u.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("subscriptions")
        .select("*, listings(title)")
        .eq("user_id", u.id)
        .order("created_at", { ascending: false }),
    ]);

    setListings(listingsRes.data ?? []);
    setSubscriptions(subsRes.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
    if (justPosted) setTimeout(() => setToast(null), 4000);
  }, [loadData, justPosted]);

  const handleDelete = async (listingId: string) => {
    if (!confirm("Delete this listing? This cannot be undone.")) return;
    const supabase = createClient();
    await supabase.from("listings").delete().eq("id", listingId);
    setListings((prev) => prev.filter((l) => l.id !== listingId));
    showToast("Listing deleted.");
  };

  const handleMarkSold = async (listingId: string, currentlySold: boolean) => {
    const supabase = createClient();
    await supabase.from("listings").update({ sold: !currentlySold }).eq("id", listingId);
    setListings((prev) => prev.map((l) => l.id === listingId ? { ...l, sold: !currentlySold } : l));
    showToast(currentlySold ? "Listing marked as available." : "Listing marked as sold.");
  };

  const handleCancelSub = async (subId: string, tier: string, nextBilling: string) => {
    if (!confirm(`Cancel ${tier} plan? It stays active until ${new Date(nextBilling).toLocaleDateString("en-TT", { month: "short", day: "numeric", year: "numeric" })}.`)) return;
    const supabase = createClient();
    await supabase.from("subscriptions").update({ status: "cancelled", cancelled_at: new Date().toISOString() }).eq("id", subId);
    setSubscriptions((prev) => prev.map((s) => s.id === subId ? { ...s, status: "cancelled" } : s));
    showToast("Plan cancelled.");
  };

  const activeSubs = subscriptions.filter((s) => s.status === "active");
  const sellerName = user?.user_metadata?.name ?? "there";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-sm text-gray-400">Loading dashboard…</div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Toast */}
        {toast && (
          <div className="mb-6 px-4 py-3 rounded-xl text-sm font-medium bg-green-50 border border-green-200 text-green-700">
            {toast}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Welcome back, {sellerName}</p>
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
            { label: "Active Listings", value: listings.length, icon: "📋" },
            { label: "Subscriptions", value: activeSubs.length, icon: "🔄" },
            { label: "Inquiries", value: 0, icon: "💬" },
            { label: "Views This Week", value: "—", icon: "👁" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="font-display font-bold text-2xl text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-6 flex-wrap">
          {(["listings", "subscriptions", "inquiries"] as Tab[]).map((t) => (
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
              {t === "subscriptions" && activeSubs.length > 0 && (
                <span className="ml-2 bg-blue-700 text-white text-xs rounded-full px-1.5 py-0.5">{activeSubs.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── Listings tab ── */}
        {tab === "listings" && (
          <div className="space-y-3">
            {listings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <div className="text-4xl mb-3">📭</div>
                <p className="font-semibold text-gray-700">No listings yet</p>
                <p className="text-sm text-gray-400 mt-1">Create your first listing to start selling.</p>
                <Link href="/listings/new" className="mt-4 inline-block">
                  <Button size="sm">Post a Listing</Button>
                </Link>
              </div>
            ) : (
              listings.map((listing) => {
                const formatted = new Intl.NumberFormat("en-TT", {
                  style: "currency",
                  currency: listing.currency ?? "TTD",
                  minimumFractionDigits: 0,
                }).format(listing.price);

                return (
                  <div key={listing.id} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 items-center">
                    <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {listing.images?.[0] && (
                        <Image
                          src={listing.images[0]}
                          alt={listing.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                          unoptimized={listing.images[0].startsWith("blob:")}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-gray-900 truncate">{listing.title}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-blue-700 font-semibold text-sm">{formatted}</span>
                        <Badge variant="gray">{listing.category}</Badge>
                        {listing.tier === "premium" && <span className="text-xs bg-blue-700 text-white font-bold px-1.5 py-0.5 rounded">★ Premium</span>}
                        {listing.tier === "featured" && <span className="text-xs bg-blue-100 text-blue-700 border border-blue-300 font-semibold px-1.5 py-0.5 rounded">◆ Featured</span>}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {listing.location} · Posted {new Date(listing.created_at).toLocaleDateString("en-TT", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                      {listing.sold && (
                        <span className="text-xs bg-green-100 text-green-700 border border-green-300 font-semibold px-2 py-0.5 rounded-full">✓ Sold</span>
                      )}
                      {listing.tier === "free" && !listing.sold && (
                        <Link href="/pricing">
                          <Button size="sm" variant="secondary">⚡ Boost</Button>
                        </Link>
                      )}
                      <button
                        onClick={() => handleMarkSold(listing.id, listing.sold ?? false)}
                        className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-600 transition-colors"
                        title={listing.sold ? "Mark as available" : "Mark as sold"}
                      >
                        {listing.sold ? "Relist" : "Mark Sold"}
                      </button>
                      <Link href={`/listings/${listing.id}/edit`}>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </Link>
                      <Link href={`/listings/${listing.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                      <button
                        onClick={() => handleDelete(listing.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded"
                        aria-label="Delete listing"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── Subscriptions tab ── */}
        {tab === "subscriptions" && (
          <div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 mb-6 flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-blue-700">
                Subscriptions renew monthly via WiPay. Cancel anytime — your plan stays active until the end of the billing period.
              </p>
            </div>

            {subscriptions.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                <div className="text-4xl mb-3">🔄</div>
                <p className="font-semibold text-gray-700">No active subscriptions</p>
                <p className="text-sm text-gray-400 mt-1">Boost a listing to Featured or Premium for more visibility.</p>
                <Link href="/pricing" className="mt-4 inline-block">
                  <Button size="sm">View Plans</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {subscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className={`border rounded-xl p-5 ${sub.status === "active" ? "bg-white border-gray-200" : "bg-gray-50 border-gray-200 opacity-60"}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {sub.tier === "featured" ? (
                            <span className="text-xs bg-blue-100 text-blue-700 border border-blue-300 font-semibold px-2 py-0.5 rounded">◆ Featured</span>
                          ) : (
                            <span className="text-xs bg-blue-700 text-white font-bold px-2 py-0.5 rounded">★ Premium</span>
                          )}
                          {sub.status === "active" ? (
                            <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" /> Cancelled
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-900">{sub.listings?.title ?? "Listing"}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          TT${sub.price_ttd}/month ·{" "}
                          {sub.status === "active"
                            ? `Next billing: ${new Date(sub.next_billing_at).toLocaleDateString("en-TT", { month: "short", day: "numeric", year: "numeric" })}`
                            : `Active until: ${new Date(sub.next_billing_at).toLocaleDateString("en-TT", { month: "short", day: "numeric", year: "numeric" })}`}
                        </p>
                      </div>
                      {sub.status === "active" ? (
                        <button
                          onClick={() => handleCancelSub(sub.id, sub.tier, sub.next_billing_at)}
                          className="shrink-0 text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Cancel Plan
                        </button>
                      ) : (
                        <Link href="/pricing">
                          <Button size="sm" variant="secondary">Resubscribe</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Inquiries tab ── */}
        {tab === "inquiries" && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="text-4xl mb-3">💬</div>
            <p className="font-semibold text-gray-700">No inquiries yet</p>
            <p className="text-sm text-gray-400 mt-1">When buyers message you about your listings, they&apos;ll appear here.</p>
          </div>
        )}

      </div>
    </div>
  );
}
