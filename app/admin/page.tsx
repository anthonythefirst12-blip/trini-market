"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import Link from "next/link";
import Image from "next/image";

const ADMIN_EMAILS = ["ezekiel.larose14@icloud.com"]; // add admin emails here

interface Report {
  id: string;
  created_at: string;
  reason: string;
  details: string | null;
  listing_id: string;
  reporter_id: string;
  status: string;
  listings?: { title: string; images: string[] } | null;
}

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState<"pending" | "reviewed" | "all">("pending");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
        router.push("/");
        return;
      }

      const { data } = await supabase
        .from("reports")
        .select("*, listings(title, images)")
        .order("created_at", { ascending: false });

      setReports(data ?? []);
      setLoading(false);
    };
    load();
  }, [router]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const markReviewed = async (id: string) => {
    const supabase = createClient();
    await supabase.from("reports").update({ status: "reviewed" }).eq("id", id);
    setReports((prev) => prev.map((r) => r.id === id ? { ...r, status: "reviewed" } : r));
    showToast("Marked as reviewed");
  };

  const removeListing = async (report: Report) => {
    if (!confirm(`Remove listing "${report.listings?.title}"? This cannot be undone.`)) return;
    const supabase = createClient();
    await supabase.from("listings").delete().eq("id", report.listing_id);
    await supabase.from("reports").update({ status: "actioned" }).eq("id", report.id);
    setReports((prev) => prev.map((r) => r.id === report.id ? { ...r, status: "actioned" } : r));
    showToast("Listing removed");
  };

  const filtered = reports.filter((r) =>
    filter === "all" ? true : filter === "pending" ? r.status === "pending" || !r.status : r.status === filter
  );

  const pendingCount = reports.filter((r) => !r.status || r.status === "pending").length;

  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><p className="text-slate-400 text-sm">Loading…</p></div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {toast && (
          <div className="mb-6 px-4 py-3 bg-green-900 border border-green-700 text-green-300 text-sm rounded-xl">{toast}</div>
        )}

        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl text-white">Admin Panel</h1>
            <p className="text-slate-400 text-sm mt-1">Review reported listings and moderate content.</p>
          </div>
          <div className="flex items-center gap-2">
            {(["pending", "reviewed", "all"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors capitalize ${filter === f ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>
                {f} {f === "pending" && pendingCount > 0 && <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pendingCount}</span>}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-slate-800 rounded-2xl border border-slate-700">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-slate-300 font-semibold">No {filter} reports</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((report) => (
              <div key={report.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
                <div className="flex gap-4 items-start">
                  {/* Listing thumbnail */}
                  {report.listings?.images?.[0] && (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-700 shrink-0">
                      <Image src={report.listings.images[0]} alt="" fill className="object-cover" sizes="64px" unoptimized />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <p className="text-white font-semibold text-sm truncate">
                          {report.listings?.title ?? "Unknown listing"}
                        </p>
                        <p className="text-slate-400 text-xs mt-0.5">
                          Reported {new Date(report.created_at).toLocaleDateString("en-TT", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        report.status === "actioned" ? "bg-red-900 text-red-300" :
                        report.status === "reviewed" ? "bg-green-900 text-green-300" :
                        "bg-amber-900 text-amber-300"
                      }`}>
                        {report.status || "pending"}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg">🚩 {report.reason}</span>
                      {report.details && (
                        <span className="bg-slate-700 text-slate-400 px-2.5 py-1 rounded-lg italic">"{report.details}"</span>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link href={`/listings/${report.listing_id}`} target="_blank"
                        className="px-3 py-1.5 text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                        View Listing ↗
                      </Link>
                      {(!report.status || report.status === "pending") && (
                        <>
                          <button onClick={() => markReviewed(report.id)}
                            className="px-3 py-1.5 text-xs font-semibold bg-green-800 hover:bg-green-700 text-green-200 rounded-lg transition-colors">
                            ✓ Mark Reviewed
                          </button>
                          <button onClick={() => removeListing(report)}
                            className="px-3 py-1.5 text-xs font-semibold bg-red-900 hover:bg-red-800 text-red-300 rounded-lg transition-colors">
                            🗑 Remove Listing
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
