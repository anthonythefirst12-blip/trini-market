"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";
import {
  Home, ClipboardList, Zap, MessageCircle, Eye, CheckCircle2,
  Plus, Store, Settings, ArrowUp, RefreshCw, Clock, Trash2,
  Package, BarChart2,
} from "lucide-react";

type Tab = "home" | "listings" | "subscriptions" | "inquiries";

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
  expires_at?: string;
  sold?: boolean;
  views?: number;
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
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading dashboard…</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const justPosted = searchParams.get("posted") === "1";
  const justEdited = searchParams.get("edited") === "1";

  const [tab, setTab] = useState<Tab>("home");
  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<DBListing[]>([]);
  const [subscriptions, setSubscriptions] = useState<DBSubscription[]>([]);
  const [loading, setLoading] = useState(true);
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
      supabase.from("listings").select("id, title, price, currency, category, location, images, tier, created_at, expires_at, sold, views")
        .eq("user_id", u.id).order("created_at", { ascending: false }),
      supabase.from("subscriptions").select("*, listings(title)").eq("user_id", u.id).order("created_at", { ascending: false }),
    ]);
    setListings(listingsRes.data ?? []);
    setSubscriptions(subsRes.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
    if (justPosted || justEdited) setTimeout(() => setToast(null), 4000);
  }, [loadData, justPosted, justEdited]);

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
    showToast(currentlySold ? "Listing marked as available." : "✅ Marked as sold.");
  };

  const handleBump = async (listingId: string) => {
    const supabase = createClient();
    const now = new Date().toISOString();
    await supabase.from("listings").update({ created_at: now }).eq("id", listingId);
    setListings((prev) => prev.map((l) => l.id === listingId ? { ...l, created_at: now } : l));
    showToast("⬆️ Listing bumped to the top!");
  };

  const handleRenew = async (listingId: string) => {
    const supabase = createClient();
    const newExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    await supabase.from("listings").update({ expires_at: newExpiry }).eq("id", listingId);
    setListings((prev) => prev.map((l) => l.id === listingId ? { ...l, expires_at: newExpiry } : l));
    showToast("✅ Listing renewed for 30 days!");
  };

  const handleCancelSub = async (subId: string, tier: string, nextBilling: string) => {
    if (!confirm(`Cancel ${tier} plan? It stays active until ${new Date(nextBilling).toLocaleDateString("en-TT", { month: "short", day: "numeric", year: "numeric" })}.`)) return;
    const supabase = createClient();
    await supabase.from("subscriptions").update({ status: "cancelled", cancelled_at: new Date().toISOString() }).eq("id", subId);
    setSubscriptions((prev) => prev.map((s) => s.id === subId ? { ...s, status: "cancelled" } : s));
    showToast("Plan cancelled.");
  };

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.size} listing(s)? This cannot be undone.`)) return;
    const supabase = createClient();
    await supabase.from("listings").delete().in("id", [...selectedIds]);
    setListings((prev) => prev.filter((l) => !selectedIds.has(l.id)));
    showToast(`🗑️ ${selectedIds.size} listing(s) deleted.`);
    clearSelection();
  };

  const handleBulkMarkSold = async () => {
    const supabase = createClient();
    await supabase.from("listings").update({ sold: true }).in("id", [...selectedIds]);
    setListings((prev) => prev.map((l) => selectedIds.has(l.id) ? { ...l, sold: true } : l));
    showToast(`✅ ${selectedIds.size} listing(s) marked as sold.`);
    clearSelection();
  };

  const handleBulkBump = async () => {
    const supabase = createClient();
    const now = new Date().toISOString();
    await supabase.from("listings").update({ created_at: now }).in("id", [...selectedIds]);
    setListings((prev) => prev.map((l) => selectedIds.has(l.id) ? { ...l, created_at: now } : l));
    showToast(`⬆️ ${selectedIds.size} listing(s) bumped to the top!`);
    clearSelection();
  };

  const activeSubs = subscriptions.filter((s) => s.status === "active");
  const soldCount = listings.filter((l) => l.sold).length;
  const totalViews = listings.reduce((sum, l) => sum + (l.views ?? 0), 0);
  const sellerName = user?.user_metadata?.name?.split(" ")[0] ?? "there";
  const recentListings = listings.slice(0, 3);

  const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "home", label: "Home", icon: <Home size={15} /> },
    { key: "listings", label: "My Listings", icon: <ClipboardList size={15} /> },
    { key: "subscriptions", label: "Boosts", icon: <Zap size={15} /> },
    { key: "inquiries", label: "Inquiries", icon: <MessageCircle size={15} /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-red-600 text-xs font-bold uppercase tracking-widest mb-1">Seller Hub</p>
            <h1 className="font-display font-bold text-2xl text-gray-900">Welcome back, {sellerName} 👋</h1>
            <p className="text-gray-400 text-sm mt-0.5">Manage your listings, boosts and account.</p>
          </div>
          <Link
            href="/listings/new"
            className="inline-flex items-center gap-2 bg-red-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-red-700 hover:shadow-[0_0_20px_rgba(220,38,38,0.35)] active:scale-95 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Listing
          </Link>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0 overflow-x-auto">
            {TABS.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => { setTab(key); clearSelection(); }}
                className={[
                  "flex items-center gap-1.5 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap focus-visible:outline-none",
                  tab === key
                    ? "border-red-600 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300",
                ].join(" ")}
              >
                <span>{icon}</span>
                {label}
                {key === "subscriptions" && activeSubs.length > 0 && (
                  <span className="ml-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">{activeSubs.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Toast */}
        {toast && (
          <div className="mb-6 px-4 py-3 rounded-xl text-sm font-medium bg-green-50 border border-green-200 text-green-700 flex items-center gap-2">
            {toast}
          </div>
        )}

        {/* ── HOME TAB ── */}
        {tab === "home" && (
          <div className="space-y-8">

            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Listings", value: listings.length, Icon: ClipboardList },
                { label: "Active Plans", value: activeSubs.length, Icon: Zap },
                { label: "Items Sold", value: soldCount, Icon: CheckCircle2 },
                { label: "Total Views", value: totalViews, Icon: Eye },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:-translate-y-0.5 hover:border-red-200 transition-all duration-200 group cursor-default"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-50 group-hover:bg-red-50 flex items-center justify-center transition-colors">
                      <stat.Icon size={18} className="text-gray-400 group-hover:text-red-500 transition-colors" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div className="font-display font-bold text-3xl text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Analytics section */}
            <div>
              <h2 className="font-display font-bold text-lg text-gray-900 mb-4">Analytics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {/* Views by listing */}
                <div className="sm:col-span-2 bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-sm text-gray-700">Views by Listing</h3>
                    <span className="text-xs text-gray-400">{listings.length} listings</span>
                  </div>
                  {listings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-300">
                      <BarChart2 size={32} className="mb-2 text-gray-200" strokeWidth={1.5} />
                      <p className="text-xs">No data yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {listings.slice(0, 5).map((l) => {
                        const maxViews = Math.max(...listings.map((x) => x.views ?? 0), 1);
                        const pct = Math.round(((l.views ?? 0) / maxViews) * 100);
                        return (
                          <div key={l.id}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-600 truncate max-w-[60%]">{l.title}</span>
                              <span className="text-xs font-semibold text-gray-900">{l.views ?? 0} views</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-red-500 rounded-full transition-all duration-700"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Quick stats */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">
                  <h3 className="font-semibold text-sm text-gray-700">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Sell-through rate</span>
                      <span className="text-xs font-bold text-gray-900">
                        {listings.length > 0 ? Math.round((soldCount / listings.length) * 100) : 0}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Avg. views/listing</span>
                      <span className="text-xs font-bold text-gray-900">
                        {listings.length > 0 ? Math.round(totalViews / listings.length) : 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Boosted listings</span>
                      <span className="text-xs font-bold text-gray-900">
                        {listings.filter((l) => l.tier === "premium" || l.tier === "featured").length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Active listings</span>
                      <span className="text-xs font-bold text-red-600">
                        {listings.filter((l) => !l.sold).length}
                      </span>
                    </div>
                  </div>

                  {/* Boost breakdown */}
                  {listings.length > 0 && (
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-400 mb-2">Boost status</p>
                      <div className="flex gap-1 h-2 rounded-full overflow-hidden">
                        {(() => {
                          const free = listings.filter((l) => l.tier === "free" || !l.tier).length;
                          const boosted = listings.filter((l) => l.tier === "featured" || l.tier === "premium").length;
                          const total = listings.length;
                          return (
                            <>
                              {free > 0 && <div className="bg-gray-300" style={{ width: `${(free / total) * 100}%` }} />}
                              {boosted > 0 && <div className="bg-red-500" style={{ width: `${(boosted / total) * 100}%` }} />}
                            </>
                          );
                        })()}
                      </div>
                      <div className="flex gap-3 mt-1.5">
                        <span className="text-xs text-gray-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />Free</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Boosted</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent listings */}
            {recentListings.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-bold text-lg text-gray-900">Recent Listings</h2>
                  <button onClick={() => setTab("listings")} className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors">
                    View all →
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {recentListings.map((l) => {
                    const formatted = new Intl.NumberFormat("en-TT", { style: "currency", currency: l.currency ?? "TTD", minimumFractionDigits: 0 }).format(l.price);
                    return (
                      <Link key={l.id} href={`/listings/${l.id}`} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-red-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                        <div className="relative h-32 bg-gray-100">
                          {l.images?.[0] ? (
                            <Image src={l.images[0]} alt={l.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="300px" unoptimized={l.images[0].startsWith("blob:")} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><Package size={28} className="text-gray-300" strokeWidth={1.5} /></div>
                          )}
                          {l.sold && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <span className="bg-white text-gray-900 text-xs font-bold px-2 py-1 rounded-full">SOLD</span>
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="font-semibold text-sm text-gray-900 truncate group-hover:text-red-700 transition-colors">{l.title}</p>
                          <p className="text-red-600 font-bold text-sm mt-0.5">{formatted}</p>
                          <p className="text-xs text-gray-400 mt-1">{l.views ?? 0} views</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick actions */}
            <div>
              <h2 className="font-display font-bold text-lg text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Post Listing", Icon: Plus, href: "/listings/new", primary: true },
                  { label: "View Store", Icon: Store, href: user ? `/store/${user.id}` : "#", primary: false },
                  { label: "Upgrade Plan", Icon: Zap, href: "/pricing", primary: false },
                  { label: "Settings", Icon: Settings, href: "/settings", primary: false },
                ].map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className={[
                      "flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all duration-200 active:scale-95",
                      action.primary
                        ? "bg-red-600 border-red-600 text-white hover:bg-red-700 hover:shadow-[0_0_16px_rgba(220,38,38,0.3)]"
                        : "bg-white border-gray-200 text-gray-700 hover:border-red-200 hover:text-red-600 hover:shadow-sm",
                    ].join(" ")}
                  >
                    <action.Icon size={22} strokeWidth={1.5} />
                    <span className="text-xs font-semibold">{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── LISTINGS TAB ── */}
        {tab === "listings" && (
          <div className="space-y-3 pb-20">
            {/* Bulk action toolbar */}
            {listings.length > 0 && (
              <div className="flex items-center justify-between mb-1">
                <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-red-600"
                    checked={selectedIds.size === listings.length && listings.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(new Set(listings.map((l) => l.id)));
                      else clearSelection();
                    }}
                  />
                  {selectedIds.size > 0 ? `${selectedIds.size} selected` : "Select all"}
                </label>
                {selectedIds.size > 0 && (
                  <button onClick={clearSelection} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                    Clear
                  </button>
                )}
              </div>
            )}

            {listings.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                  <Package size={28} className="text-gray-300" strokeWidth={1.5} />
                </div>
                <p className="font-display font-semibold text-gray-700 text-lg">No listings yet</p>
                <p className="text-gray-400 text-sm mt-1 mb-6">Create your first listing to start selling across T&T.</p>
                <Link href="/listings/new"><Button>Post a Listing</Button></Link>
              </div>
            ) : (
              listings.map((listing) => {
                const formatted = new Intl.NumberFormat("en-TT", { style: "currency", currency: listing.currency ?? "TTD", minimumFractionDigits: 0 }).format(listing.price);
                const isSelected = selectedIds.has(listing.id);
                const nowMs = Date.now();
                const expiresAt = listing.expires_at ? new Date(listing.expires_at).getTime() : null;
                const isExpired = expiresAt !== null && expiresAt < nowMs;
                const daysLeft = expiresAt !== null && !isExpired ? Math.ceil((expiresAt - nowMs) / (1000 * 60 * 60 * 24)) : null;
                const expiringSoon = daysLeft !== null && daysLeft <= 7;
                return (
                  <div
                    key={listing.id}
                    className={[
                      "group relative flex gap-4 items-center p-4 bg-white rounded-2xl border transition-all duration-200",
                      isSelected
                        ? "border-red-300 ring-1 ring-red-200"
                        : listing.sold
                          ? "border-gray-200 opacity-60"
                          : "border-gray-200 hover:border-red-200 hover:shadow-md",
                    ].join(" ")}
                  >
                    <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-red-600 shrink-0 cursor-pointer"
                      checked={isSelected}
                      onChange={() => toggleSelect(listing.id)}
                    />

                    <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      {listing.images?.[0] ? (
                        <Image src={listing.images[0]} alt={listing.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="80px" unoptimized={listing.images[0].startsWith("blob:")} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Package size={22} className="text-gray-300" strokeWidth={1.5} /></div>
                      )}
                      {listing.sold && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="text-xs font-bold text-white bg-gray-800 px-1.5 py-0.5 rounded">SOLD</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-gray-900 truncate group-hover:text-red-700 transition-colors">{listing.title}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-red-600 font-bold text-sm">{formatted}</span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{listing.category}</span>
                        {(listing.tier === "premium" || listing.tier === "featured") && <span className="inline-flex items-center gap-1 text-xs bg-red-600 text-white font-bold px-2 py-0.5 rounded-full"><Zap size={10} />Boosted</span>}
                        {isExpired && (
                          <span className="text-xs bg-gray-200 text-gray-600 font-semibold px-2 py-0.5 rounded-full">Expired</span>
                        )}
                        {expiringSoon && !isExpired && (
                          <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 border border-red-200 font-semibold px-2 py-0.5 rounded-full">
                            <Clock size={10} />Expires in {daysLeft}d
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {listing.location} · {new Date(listing.created_at).toLocaleDateString("en-TT", { month: "short", day: "numeric", year: "numeric" })} · {listing.views ?? 0} views
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                      {listing.expires_at && new Date(listing.expires_at) < new Date() ? (
                        <button
                          onClick={() => handleRenew(listing.id)}
                          className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-600 hover:text-white transition-all"
                        >
                          <RefreshCw size={11} className="inline mr-1" />Renew
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBump(listing.id)}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-700 hover:text-white transition-all"
                        >
                          <ArrowUp size={11} />Bump
                        </button>
                      )}
                      {(listing.tier === "free" || !listing.tier) && !listing.sold && (
                        <Link href="/pricing">
                          <button className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white transition-all">
                            <Zap size={11} />Boost
                          </button>
                        </Link>
                      )}
                      <button
                        onClick={() => handleMarkSold(listing.id, listing.sold ?? false)}
                        className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-green-400 hover:text-green-600 transition-all"
                      >
                        {listing.sold ? "Relist" : "Mark Sold"}
                      </button>
                      <Link href={`/listings/${listing.id}/edit`} className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-800 transition-all">
                        Edit
                      </Link>
                      <Link href={`/listings/${listing.id}`} className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-800 transition-all">
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(listing.id)}
                        className="p-1.5 text-gray-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                        aria-label="Delete listing"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {/* Floating bulk action bar */}
            {selectedIds.size > 0 && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl shadow-black/30 animate-in">
                <span className="text-sm font-semibold text-gray-300">{selectedIds.size} selected</span>
                <div className="w-px h-5 bg-gray-700" />
                <button
                  onClick={handleBulkBump}
                  className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <ArrowUp size={14} />Bump
                </button>
                <button
                  onClick={handleBulkMarkSold}
                  className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <CheckCircle2 size={14} />Mark Sold
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 size={14} />Delete
                </button>
                <button
                  onClick={clearSelection}
                  className="ml-1 text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                  aria-label="Clear selection"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── SUBSCRIPTIONS TAB ── */}
        {tab === "subscriptions" && (
          <div>
            {subscriptions.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                  <Zap size={28} className="text-gray-300" strokeWidth={1.5} />
                </div>
                <p className="font-display font-semibold text-gray-700 text-lg">No active boosts</p>
                <p className="text-gray-400 text-sm mt-1 mb-6">Boost a listing for TT$15–$40 to push it to the top of search and the homepage.</p>
                <Link href="/pricing"><Button>View Boost Pricing</Button></Link>
              </div>
            ) : (
              <div className="space-y-4">
                {subscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className={[
                      "bg-white rounded-2xl border p-5 transition-all",
                      sub.status === "active" ? "border-gray-200 hover:border-red-200 hover:shadow-sm" : "border-gray-200 opacity-60",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="inline-flex items-center gap-1 text-xs bg-red-600 text-white font-bold px-2.5 py-1 rounded-full"><Zap size={10} />Boosted</span>
                          {sub.status === "active" ? (
                            <span className="inline-flex items-center gap-1.5 text-xs text-green-600 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" /> Expired
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-gray-800">{sub.listings?.title ?? "Listing"}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          TT${sub.price_ttd} one-time ·{" "}
                          {`Active until: ${new Date(sub.next_billing_at).toLocaleDateString("en-TT", { month: "short", day: "numeric", year: "numeric" })}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── INQUIRIES TAB ── */}
        {tab === "inquiries" && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={28} className="text-gray-300" strokeWidth={1.5} />
            </div>
            <p className="font-display font-semibold text-gray-700 text-lg">No inquiries yet</p>
            <p className="text-gray-400 text-sm mt-1 mb-6">When buyers message you about your listings, they&apos;ll appear here.</p>
            <Link href="/messages">
              <button className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 border border-red-200 px-5 py-2.5 rounded-xl hover:bg-red-50 transition-colors">
                Open Messages →
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
