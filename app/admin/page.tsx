"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import Link from "next/link";
import Image from "next/image";

const ADMIN_EMAILS = ["ezekiel.larose14@icloud.com"];

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
  listing_count?: number;
}

type Tab = "reports" | "users" | "listings";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("reports");
  const [reports, setReports] = useState<Report[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [allListings, setAllListings] = useState<{ id: string; title: string; seller_id: string; images: string[]; created_at: string; sold: boolean }[]>([]);
  const [filter, setFilter] = useState<"pending" | "reviewed" | "all">("pending");
  const [userSearch, setUserSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
      router.push("/");
      return;
    }

    const [reportsRes, sellersRes, listingsRes] = await Promise.all([
      supabase.from("reports").select("*, listings(title, images, seller_id)").order("created_at", { ascending: false }),
      supabase.from("sellers").select("id, name, avatar, email, created_at, banned").order("created_at", { ascending: false }),
      supabase.from("listings").select("id, title, seller_id, images, created_at, sold").order("created_at", { ascending: false }).limit(100),
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

  const filtered = reports.filter((r) =>
    filter === "all" ? true : filter === "pending" ? r.status === "pending" || !r.status : r.status === filter
  );
  const pendingCount = reports.filter((r) => !r.status || r.status === "pending").length;
  const filteredSellers = sellers.filter((s) =>
    !userSearch || s.name?.toLowerCase().includes(userSearch.toLowerCase()) || s.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  if (loading) {
    return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center"><p className="text-gray-400 text-sm">Loading…</p></div>;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {toast && (
          <div className="fixed top-20 right-4 z-50 px-4 py-3 bg-gray-900 border border-gray-700 text-white text-sm rounded-xl shadow-lg">{toast}</div>
        )}

        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl text-gray-900">Admin Panel</h1>
            <p className="text-gray-400 text-sm mt-1">{sellers.length} users · {allListings.length} listings · {pendingCount} pending reports</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white border border-gray-200 rounded-xl p-1 w-fit">
          {([["reports", "🚩 Reports"], ["users", "👤 Users"], ["listings", "📦 Listings"]] as [Tab, string][]).map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${tab === t ? "bg-red-600 text-white" : "text-gray-600 hover:text-gray-900"}`}>
              {label}
              {t === "reports" && pendingCount > 0 && (
                <span className="ml-1.5 bg-white text-red-600 text-xs px-1.5 py-0.5 rounded-full">{pendingCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── REPORTS TAB ── */}
        {tab === "reports" && (
          <>
            <div className="flex gap-2 mb-5">
              {(["pending", "reviewed", "all"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors capitalize ${filter === f ? "bg-gray-900 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}>
                  {f}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                <div className="text-4xl mb-3">✅</div>
                <p className="text-gray-600 font-semibold">No {filter} reports</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((report) => (
                  <div key={report.id} className="bg-white border border-gray-200 rounded-2xl p-5">
                    <div className="flex gap-4 items-start">
                      {report.listings?.images?.[0] && (
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                          <Image src={report.listings.images[0]} alt="" fill className="object-cover" sizes="64px" unoptimized />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <p className="text-gray-900 font-semibold text-sm truncate">
                              {report.listings?.title ?? "Unknown listing"}
                            </p>
                            <p className="text-gray-400 text-xs mt-0.5">
                              Reported {new Date(report.created_at).toLocaleDateString("en-TT", { month: "short", day: "numeric", year: "numeric" })}
                            </p>
                          </div>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            report.status === "actioned" ? "bg-red-100 text-red-700" :
                            report.status === "reviewed" ? "bg-green-100 text-green-700" :
                            "bg-amber-100 text-amber-700"
                          }`}>
                            {report.status || "pending"}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                          <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg">🚩 {report.reason}</span>
                          {report.details && (
                            <span className="bg-gray-100 text-gray-400 px-2.5 py-1 rounded-lg italic">"{report.details}"</span>
                          )}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <Link href={`/listings/${report.listing_id}`} target="_blank"
                            className="px-3 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                            View Listing ↗
                          </Link>
                          {(!report.status || report.status === "pending") && (
                            <>
                              <button onClick={() => markReviewed(report.id)}
                                className="px-3 py-1.5 text-xs font-semibold bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg transition-colors">
                                ✓ Mark Reviewed
                              </button>
                              <button onClick={() => removeListing(report.listing_id, report.id)}
                                className="px-3 py-1.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg transition-colors">
                                🗑 Remove Listing
                              </button>
                              {report.listings?.seller_id && (
                                <button onClick={() => banSeller(report.listings!.seller_id, report.id)}
                                  className="px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                                  🚫 Ban Seller
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
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by name or email…"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full sm:w-80 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="space-y-3">
              {filteredSellers.map((seller) => (
                <div key={seller.id} className={`bg-white border rounded-xl p-4 flex items-center gap-4 ${seller.banned ? "border-red-200 bg-red-50/30" : "border-gray-200"}`}>
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                    {seller.avatar
                      ? <Image src={seller.avatar} alt={seller.name} fill className="object-cover" sizes="40px" unoptimized />
                      : <div className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-400">{seller.name?.charAt(0)}</div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-gray-900 truncate">{seller.name}</p>
                      {seller.banned && <span className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded-full">Banned</span>}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{seller.email ?? "No email"}</p>
                    <p className="text-xs text-gray-300 mt-0.5">Joined {new Date(seller.created_at).toLocaleDateString("en-TT", { month: "short", year: "numeric" })}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/profile/${seller.id}`} target="_blank"
                      className="px-3 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                      Profile ↗
                    </Link>
                    {seller.banned ? (
                      <button onClick={() => unbanSeller(seller.id)}
                        className="px-3 py-1.5 text-xs font-semibold bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg transition-colors">
                        Unban
                      </button>
                    ) : (
                      <button onClick={() => banSeller(seller.id)}
                        className="px-3 py-1.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg transition-colors">
                        🚫 Ban
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
          <div className="space-y-3">
            {allListings.map((listing) => (
              <div key={listing.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                {listing.images?.[0] && (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <Image src={listing.images[0]} alt="" fill className="object-cover" sizes="48px" unoptimized />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">{listing.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {listing.sold ? "Sold · " : "Active · "}
                    {new Date(listing.created_at).toLocaleDateString("en-TT", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link href={`/listings/${listing.id}`} target="_blank"
                    className="px-3 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                    View ↗
                  </Link>
                  <button onClick={() => removeListing(listing.id)}
                    className="px-3 py-1.5 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg transition-colors">
                    🗑 Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
