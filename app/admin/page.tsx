"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import Link from "next/link";
import Image from "next/image";
import {
  Flag, Users, Package, CheckCircle2, Trash2, ShieldOff, ShieldCheck,
  Search, BarChart2, AlertTriangle, ExternalLink, X,
} from "lucide-react";

const ADMIN_EMAILS = ["trinisellsupport@gmail.com"];

interface Report {
  id: string;
  created_at: string;
  reason: string;
  details: string | null;
  listing_id: string;
  reporter_id: string;
  status: string;
  listings?: { title: string; images: string[]; seller_id: string } | null;
}

interface Seller {
  id: string;
  name: string;
  avatar: string | null;
  email: string | null;
  created_at: string;
  banned: boolean | null;
}

interface ListingRow {
  id: string;
  title: string;
  seller_id: string;
  images: string[];
  created_at: string;
  sold: boolean;
  category: string;
}

type Tab = "reports" | "users" | "listings";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("reports");
  const [reports, setReports] = useState<Report[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [allListings, setAllListings] = useState<ListingRow[]>([]);
  const [filter, setFilter] = useState<"pending" | "reviewed" | "all">("pending");
  const [userSearch, setUserSearch] = useState("");
  const [listingSearch, setListingSearch] = useState("");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
      window.location.href = "/";
      return;
    }

    const [reportsRes, sellersRes, listingsRes] = await Promise.all([
      supabase.from("reports").select("*, listings(title, images, seller_id)").order("created_at", { ascending: false }),
      supabase.from("sellers").select("id, name, avatar, email, created_at, banned").order("created_at", { ascending: false }),
      supabase.from("listings").select("id, title, seller_id, images, created_at, sold, category").order("created_at", { ascending: false }).limit(200),
    ]);

    setReports(reportsRes.data ?? []);
    setSellers(sellersRes.data ?? []);
    setAllListings(listingsRes.data ?? []);
    setLoading(false);
  }, [router]);

  useEffect(() => { load(); }, [load]);

  const markReviewed = async (id: string) => {
    const supabase = createClient();
    await supabase.from("reports").update({ status: "reviewed" }).eq("id", id);
    setReports((prev) => prev.map((r) => r.id === id ? { ...r, status: "reviewed" } : r));
    showToast("Marked as reviewed");
  };

  const removeListing = async (listingId: string, reportId?: string) => {
    if (!confirm("Remove this listing? This cannot be undone.")) return;
    const supabase = createClient();
    await supabase.from("listings").delete().eq("id", listingId);
    if (reportId) {
      await supabase.from("reports").update({ status: "actioned" }).eq("id", reportId);
      setReports((prev) => prev.map((r) => r.id === reportId ? { ...r, status: "actioned" } : r));
    }
    setAllListings((prev) => prev.filter((l) => l.id !== listingId));
    showToast("Listing removed");
  };

  const banSeller = async (sellerId: string, reportId?: string) => {
    if (!confirm("Ban this seller? All their listings will be removed.")) return;
    const supabase = createClient();
    await supabase.from("listings").delete().eq("seller_id", sellerId);
    await supabase.from("sellers").update({ banned: true }).eq("id", sellerId);
    if (reportId) {
      await supabase.from("reports").update({ status: "actioned" }).eq("id", reportId);
      setReports((prev) => prev.map((r) => r.id === reportId ? { ...r, status: "actioned" } : r));
    }
    setSellers((prev) => prev.map((s) => s.id === sellerId ? { ...s, banned: true } : s));
    setAllListings((prev) => prev.filter((l) => l.seller_id !== sellerId));
    showToast("User banned and listings removed");
  };

  const unbanSeller = async (sellerId: string) => {
    const supabase = createClient();
    await supabase.from("sellers").update({ banned: false }).eq("id", sellerId);
    setSellers((prev) => prev.map((s) => s.id === sellerId ? { ...s, banned: false } : s));
    showToast("User unbanned");
  };

  const pendingCount = reports.filter((r) => !r.status || r.status === "pending").length;
  const bannedCount = sellers.filter((s) => s.banned).length;

  const filteredReports = reports.filter((r) =>
    filter === "all" ? true : filter === "pending" ? r.status === "pending" || !r.status : r.status === filter
  );
  const filteredSellers = sellers.filter((s) =>
    !userSearch || s.name?.toLowerCase().includes(userSearch.toLowerCase()) || s.email?.toLowerCase().includes(userSearch.toLowerCase())
  );
  const filteredListings = allListings.filter((l) =>
    !listingSearch || l.title.toLowerCase().includes(listingSearch.toLowerCase()) || l.category.toLowerCase().includes(listingSearch.toLowerCase())
  );

  const TABS: { key: Tab; Icon: React.ElementType; label: string; badge?: number }[] = [
    { key: "reports", Icon: Flag,    label: "Reports",  badge: pendingCount || undefined },
    { key: "users",   Icon: Users,   label: "Users" },
    { key: "listings",Icon: Package, label: "Listings" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#111111] flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#111111] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Toast */}
        {toast && (
          <div className={`fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 text-sm rounded-xl shadow-lg border ${
            toast.ok
              ? "bg-gray-900 border-gray-700 text-white"
              : "bg-red-50 border-red-200 text-red-700"
          }`}>
            {toast.ok ? <CheckCircle2 size={15} className="text-green-400" /> : <AlertTriangle size={15} />}
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">TriniSell moderation dashboard</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Users",    value: sellers.length,     icon: Users,        color: "text-blue-500",   bg: "bg-blue-50 dark:bg-blue-950/30"   },
            { label: "Listings",       value: allListings.length, icon: Package,      color: "text-emerald-500",bg: "bg-emerald-50 dark:bg-emerald-950/30"},
            { label: "Pending Reports",value: pendingCount,       icon: Flag,         color: "text-amber-500",  bg: "bg-amber-50 dark:bg-amber-950/30"  },
            { label: "Banned Users",   value: bannedCount,        icon: ShieldOff,    color: "text-red-500",    bg: "bg-red-50 dark:bg-red-950/30"      },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#2a2a2a] rounded-2xl p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon size={16} className={color} strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-display font-bold text-lg text-gray-900 dark:text-white leading-none">{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#2a2a2a] rounded-xl p-1 w-fit">
          {TABS.map(({ key, Icon, label, badge }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                tab === key ? "bg-red-600 text-white" : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}>
              <Icon size={14} strokeWidth={1.5} />
              {label}
              {badge ? (
                <span className={`text-xs px-1.5 py-0.5 rounded-full leading-none font-bold ${tab === key ? "bg-white/20 text-white" : "bg-amber-100 text-amber-700"}`}>
                  {badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* ── REPORTS TAB ── */}
        {tab === "reports" && (
          <>
            <div className="flex gap-2 mb-5">
              {(["pending", "reviewed", "all"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors capitalize ${
                    filter === f
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                      : "bg-white dark:bg-[#1c1c1c] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#2a2a2a] hover:bg-gray-50"
                  }`}>
                  {f}
                </button>
              ))}
            </div>

            {filteredReports.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-[#1c1c1c] rounded-2xl border border-gray-200 dark:border-[#2a2a2a]">
                <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-950/30 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 size={22} className="text-green-500" strokeWidth={1.5} />
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-semibold">No {filter} reports</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div key={report.id} className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#2a2a2a] rounded-2xl p-5">
                    <div className="flex gap-4 items-start">
                      {report.listings?.images?.[0] && (
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                          <Image src={report.listings.images[0]} alt="" fill className="object-cover" sizes="64px" unoptimized />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <p className="text-gray-900 dark:text-white font-semibold text-sm truncate">
                              {report.listings?.title ?? "Unknown listing"}
                            </p>
                            <p className="text-gray-400 text-xs mt-0.5">
                              {new Date(report.created_at).toLocaleDateString("en-TT", { month: "short", day: "numeric", year: "numeric" })}
                            </p>
                          </div>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            report.status === "actioned" ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400" :
                            report.status === "reviewed" ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400" :
                            "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                          }`}>
                            {report.status || "pending"}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                          <span className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-lg">
                            <Flag size={10} strokeWidth={2} />
                            {report.reason}
                          </span>
                          {report.details && (
                            <span className="bg-gray-100 dark:bg-white/5 text-gray-400 px-2.5 py-1 rounded-lg italic">"{report.details}"</span>
                          )}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <Link href={`/listings/${report.listing_id}`} target="_blank"
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                            <ExternalLink size={11} /> View Listing
                          </Link>
                          {(!report.status || report.status === "pending") && (
                            <>
                              <button onClick={() => markReviewed(report.id)}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-green-50 dark:bg-green-950/30 hover:bg-green-100 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-lg transition-colors">
                                <CheckCircle2 size={11} /> Mark Reviewed
                              </button>
                              <button onClick={() => removeListing(report.listing_id, report.id)}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-red-50 dark:bg-red-950/30 hover:bg-red-100 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg transition-colors">
                                <Trash2 size={11} /> Remove Listing
                              </button>
                              {report.listings?.seller_id && (
                                <button onClick={() => banSeller(report.listings!.seller_id, report.id)}
                                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                                  <ShieldOff size={11} /> Ban Seller
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── USERS TAB ── */}
        {tab === "users" && (
          <>
            <div className="mb-4 relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search by name or email…"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full sm:w-80 pl-9 pr-4 py-2.5 border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1c1c1c] text-gray-900 dark:text-white placeholder-gray-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="space-y-3">
              {filteredSellers.map((seller) => (
                <div key={seller.id} className={`border rounded-xl p-4 flex items-center gap-4 transition-colors ${
                  seller.banned
                    ? "border-red-200 dark:border-red-900 bg-red-50/30 dark:bg-red-950/10"
                    : "border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1c1c1c]"
                }`}>
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-[#2a2a2a] shrink-0">
                    {seller.avatar
                      ? <Image src={seller.avatar} alt={seller.name} fill className="object-cover" sizes="40px" unoptimized />
                      : <div className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-400">{seller.name?.charAt(0)}</div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{seller.name}</p>
                      {seller.banned && (
                        <span className="flex items-center gap-1 text-xs bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 font-semibold px-2 py-0.5 rounded-full">
                          <ShieldOff size={10} /> Banned
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{seller.email ?? "No email"}</p>
                    <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">
                      Joined {new Date(seller.created_at).toLocaleDateString("en-TT", { month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/profile/${seller.id}`} target="_blank"
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                      <ExternalLink size={11} /> Profile
                    </Link>
                    {seller.banned ? (
                      <button onClick={() => unbanSeller(seller.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-green-50 dark:bg-green-950/30 hover:bg-green-100 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-lg transition-colors">
                        <ShieldCheck size={11} /> Unban
                      </button>
                    ) : (
                      <button onClick={() => banSeller(seller.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-red-50 dark:bg-red-950/30 hover:bg-red-100 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg transition-colors">
                        <ShieldOff size={11} /> Ban
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── LISTINGS TAB ── */}
        {tab === "listings" && (
          <>
            <div className="mb-4 relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search by title or category…"
                value={listingSearch}
                onChange={(e) => setListingSearch(e.target.value)}
                className="w-full sm:w-80 pl-9 pr-4 py-2.5 border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1c1c1c] text-gray-900 dark:text-white placeholder-gray-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="space-y-3">
              {filteredListings.map((listing) => (
                <div key={listing.id} className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#2a2a2a] rounded-xl p-4 flex items-center gap-4">
                  {listing.images?.[0] && (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <Image src={listing.images[0]} alt="" fill className="object-cover" sizes="48px" unoptimized />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{listing.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {listing.category} · {listing.sold ? "Sold · " : "Active · "}
                      {new Date(listing.created_at).toLocaleDateString("en-TT", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link href={`/listings/${listing.id}`} target="_blank"
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
                      <ExternalLink size={11} /> View
                    </Link>
                    <button onClick={() => removeListing(listing.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-red-50 dark:bg-red-950/30 hover:bg-red-100 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg transition-colors">
                      <Trash2 size={11} /> Remove
                    </button>
                  </div>
                </div>
              ))}
              {filteredListings.length === 0 && (
                <div className="text-center py-16 bg-white dark:bg-[#1c1c1c] rounded-2xl border border-gray-200 dark:border-[#2a2a2a]">
                  <p className="text-gray-400 text-sm">No listings found</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
