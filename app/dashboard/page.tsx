"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

type Tab = "listings" | "subscriptions" | "inquiries";

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
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-sm text-slate-400">Loading dashboard…</div>
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

  const [tab, setTab] = useState<Tab>("listings");
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
      supabase.from("listings").select("id, title, price, currency, category, location, images, tier, created_at, sold")
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
    showToast(currentlySold ? "Listing marked as available." : "✅ Listing marked as sold.");
  };

  const handleCancelSub = async (subId: string, tier: string, nextBilling: string) => {
    if (!confirm(`Cancel ${tier} plan? It stays active until ${new Date(nextBilling).toLocaleDateString("en-TT", { month: "short", day: "numeric", year: "numeric" })}.`)) return;
    const supabase = createClient();
    await supabase.from("subscriptions").update({ status: "cancelled", cancelled_at: new Date().toISOString() }).eq("id", subId);
    setSubscriptions((prev) => prev.map((s) => s.id === subId ? { ...s, status: "cancelled" } : s));
    showToast("Plan cancelled.");
  };

  const activeSubs = subscriptions.filter((s) => s.status === "active");
  const soldCount = listings.filter((l) => l.sold).length;
  const sellerName = user?.user_metadata?.name?.split(" ")[0] ?? "there";

  const TABS: { key: Tab; label: string }[] = [
    { key: "listings", label: "My Listings" },
    { key: "subscriptions", label: "Subscriptions" },
    { key: "inquiries", label: "Inquiries" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Top header band */}
      <div className="relative overflow-hidden border-b border-slate-700/60 bg-slate-900">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 20% 50%, #1e3a5f 0%, transparent 60%), radial-gradient(ellipse at 85% 30%, #1d4ed8 0%, transparent 50%)",
        }} />
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `repeating-linear-gradient(-45deg, #60a5fa 0px, #60a5fa 1px, transparent 1px, transparent 12px)`,
        }} />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">Seller Hub</p>
            <h1 className="font-display font-bold text-3xl text-white">Welcome back, {sellerName}</h1>
            <p className="text-slate-400 text-sm mt-1">Manage your listings, subscriptions and account.</p>
          </div>
          <Link
            href="/listings/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold text-sm px-5 py-3 rounded-xl hover:bg-blue-500 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/40"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Listing
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Toast */}
        {toast && (
          <div className="mb-6 px-4 py-3 rounded-xl text-sm font-medium bg-green-500/10 border border-green-500/30 text-green-400 flex items-center gap-2">
            <span>{toast}</span>
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Listings", value: listings.length, icon: "📋", color: "from-blue-600/20 to-blue-600/5", border: "border-blue-500/20", glow: "rgba(59,130,246,0.15)" },
            { label: "Active Plans", value: activeSubs.length, icon: "⚡", color: "from-purple-600/20 to-purple-600/5", border: "border-purple-500/20", glow: "rgba(168,85,247,0.15)" },
            { label: "Items Sold", value: soldCount, icon: "✅", color: "from-green-600/20 to-green-600/5", border: "border-green-500/20", glow: "rgba(34,197,94,0.15)" },
            { label: "Inquiries", value: 0, icon: "💬", color: "from-cyan-600/20 to-cyan-600/5", border: "border-cyan-500/20", glow: "rgba(34,211,238,0.15)" },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`relative rounded-2xl border ${stat.border} bg-gradient-to-br ${stat.color} p-5 overflow-hidden group hover:-translate-y-0.5 transition-transform duration-200`}
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: `inset 0 0 20px ${stat.glow}` }} />
              <div className="text-2xl mb-3">{stat.icon}</div>
              <div className="font-display font-bold text-3xl text-white">{stat.value}</div>
              <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-800 border border-slate-700 p-1 rounded-xl w-fit mb-6 flex-wrap">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={[
                "px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 focus-visible:outline-none",
                tab === key
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700",
              ].join(" ")}
            >
              {label}
              {key === "subscriptions" && activeSubs.length > 0 && (
                <span className="ml-2 bg-white/20 text-white text-xs rounded-full px-1.5 py-0.5">{activeSubs.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── Listings tab ── */}
        {tab === "listings" && (
          <div className="space-y-3">
            {listings.length === 0 ? (
              <div className="text-center py-20 glass-dark rounded-2xl border border-slate-700">
                <div className="text-5xl mb-4">📭</div>
                <p className="font-display font-semibold text-slate-200 text-lg">No listings yet</p>
                <p className="text-slate-400 text-sm mt-1 mb-6">Create your first listing to start selling across T&T.</p>
                <Link href="/listings/new">
                  <Button>Post a Listing</Button>
                </Link>
              </div>
            ) : (
              listings.map((listing) => {
                const formatted = new Intl.NumberFormat("en-TT", {
                  style: "currency", currency: listing.currency ?? "TTD", minimumFractionDigits: 0,
                }).format(listing.price);

                return (
                  <div
                    key={listing.id}
                    className={[
                      "group relative flex gap-4 items-center p-4 rounded-2xl border transition-all duration-200",
                      listing.sold
                        ? "bg-slate-800/40 border-slate-700/50 opacity-70"
                        : "bg-slate-800/60 border-slate-700 hover:border-blue-500/50 hover:bg-slate-800",
                    ].join(" ")}
                  >
                    {/* Hover left accent */}
                    <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                    {/* Thumbnail */}
                    <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-slate-700 shrink-0">
                      {listing.images?.[0] ? (
                        <Image src={listing.images[0]} alt={listing.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="80px" unoptimized={listing.images[0].startsWith("blob:")} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                      )}
                      {listing.sold && (
                        <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                          <span className="text-xs font-bold text-white bg-green-600 px-1.5 py-0.5 rounded">SOLD</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-slate-100 truncate group-hover:text-white transition-colors">{listing.title}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-blue-400 font-bold text-sm">{formatted}</span>
                        <span className="text-xs text-slate-500 bg-slate-700 px-2 py-0.5 rounded-full">{listing.category}</span>
                        {listing.tier === "premium" && <span className="text-xs bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">★ Premium</span>}
                        {listing.tier === "featured" && <span className="text-xs bg-slate-700 text-blue-300 border border-blue-500/40 font-semibold px-2 py-0.5 rounded-full">◆ Featured</span>}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {listing.location} · {new Date(listing.created_at).toLocaleDateString("en-TT", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                      {listing.tier === "free" && !listing.sold && (
                        <Link href="/pricing">
                          <button className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white transition-all">
                            ⚡ Boost
                          </button>
                        </Link>
                      )}
                      <button
                        onClick={() => handleMarkSold(listing.id, listing.sold ?? false)}
                        className={[
                          "text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all",
                          listing.sold
                            ? "border-slate-600 text-slate-400 hover:border-blue-400 hover:text-blue-300"
                            : "border-slate-600 text-slate-400 hover:border-green-400 hover:text-green-400",
                        ].join(" ")}
                      >
                        {listing.sold ? "Relist" : "Mark Sold"}
                      </button>
                      <Link href={`/listings/${listing.id}/edit`} className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-200 transition-all">
                        Edit
                      </Link>
                      <Link href={`/listings/${listing.id}`} className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-200 transition-all">
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(listing.id)}
                        className="p-1.5 text-slate-600 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
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
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-5 py-4 mb-6 flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-blue-300">
                Subscriptions renew monthly via WiPay. Cancel anytime — your plan stays active until the end of the billing period.
              </p>
            </div>

            {subscriptions.length === 0 ? (
              <div className="text-center py-20 glass-dark rounded-2xl border border-slate-700">
                <div className="text-5xl mb-4">⚡</div>
                <p className="font-display font-semibold text-slate-200 text-lg">No active subscriptions</p>
                <p className="text-slate-400 text-sm mt-1 mb-6">Boost a listing to Featured or Premium for more visibility.</p>
                <Link href="/pricing"><Button>View Plans</Button></Link>
              </div>
            ) : (
              <div className="space-y-4">
                {subscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className={[
                      "rounded-2xl border p-5 transition-all",
                      sub.status === "active"
                        ? "bg-slate-800/60 border-slate-700 hover:border-blue-500/40"
                        : "bg-slate-800/30 border-slate-700/50 opacity-60",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {sub.tier === "featured" ? (
                            <span className="text-xs bg-slate-700 text-blue-300 border border-blue-500/40 font-semibold px-2.5 py-1 rounded-full">◆ Featured</span>
                          ) : (
                            <span className="text-xs bg-blue-600 text-white font-bold px-2.5 py-1 rounded-full">★ Premium</span>
                          )}
                          {sub.status === "active" ? (
                            <span className="inline-flex items-center gap-1.5 text-xs text-green-400 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-500 inline-block" /> Cancelled
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-slate-200">{sub.listings?.title ?? "Listing"}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          TT${sub.price_ttd}/month ·{" "}
                          {sub.status === "active"
                            ? `Next billing: ${new Date(sub.next_billing_at).toLocaleDateString("en-TT", { month: "short", day: "numeric", year: "numeric" })}`
                            : `Active until: ${new Date(sub.next_billing_at).toLocaleDateString("en-TT", { month: "short", day: "numeric", year: "numeric" })}`}
                        </p>
                      </div>
                      {sub.status === "active" ? (
                        <button
                          onClick={() => handleCancelSub(sub.id, sub.tier, sub.next_billing_at)}
                          className="shrink-0 text-xs font-semibold text-red-400 border border-red-500/30 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Cancel Plan
                        </button>
                      ) : (
                        <Link href="/pricing">
                          <button className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-600 text-slate-300 hover:border-blue-400 hover:text-blue-300 transition-all">
                            Resubscribe
                          </button>
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
          <div className="text-center py-20 glass-dark rounded-2xl border border-slate-700">
            <div className="text-5xl mb-4">💬</div>
            <p className="font-display font-semibold text-slate-200 text-lg">No inquiries yet</p>
            <p className="text-slate-400 text-sm mt-1 mb-6">When buyers message you about your listings, they&apos;ll appear here.</p>
            <Link href="/messages">
              <button className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 border border-blue-500/30 px-5 py-2.5 rounded-xl hover:bg-blue-500/10 transition-colors">
                Open Messages →
              </button>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
