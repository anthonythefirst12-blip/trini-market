"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, Package, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

const BOOST_TIERS = [
  { days: 7,  label: "1 Week",  price: 15, tier: "featured", popular: false },
  { days: 14, label: "2 Weeks", price: 25, tier: "featured", popular: true  },
  { days: 30, label: "1 Month", price: 40, tier: "premium",  popular: false },
];

type Listing = {
  id: string;
  title: string;
  images: string[];
  tier: string;
  category: string;
  price: number;
  currency: string;
};

export default function BoostPage({ params }: { params: Promise<{ listingId: string }> }) {
  const { listingId } = React.use(params);

  const [listing, setListing] = useState<Listing | null>(null);
  const [balance, setBalance] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [loading, setLoading] = useState(true);
  const [boosting, setBoosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/auth/login";
        return;
      }

      const [listingRes, walletRes] = await Promise.all([
        supabase
          .from("listings")
          .select("id, title, images, tier, category, price, currency")
          .eq("id", listingId)
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("wallets")
          .select("balance_ttd")
          .eq("user_id", user.id)
          .maybeSingle(),
      ]);

      if (!listingRes.data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setListing(listingRes.data);
      setBalance(walletRes.data?.balance_ttd ?? 0);
      setLoading(false);
    };
    init();
  }, [listingId]);

  const handleBoost = async () => {
    if (!listing) return;
    const selectedTier = BOOST_TIERS[selectedIndex];
    setError(null);

    if (balance < selectedTier.price) {
      setError("Insufficient wallet balance. Top up your wallet first.");
      return;
    }

    setBoosting(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/auth/login"; return; }

      // Deduct balance
      await supabase
        .from("wallets")
        .update({ balance_ttd: balance - selectedTier.price })
        .eq("user_id", user.id);

      // Log transaction
      await supabase.from("wallet_transactions").insert({
        user_id: user.id,
        type: "deduction",
        amount_ttd: selectedTier.price,
        description: `Listing boost — ${selectedTier.label}`,
        reference_id: listing.id,
      });

      // Update listing
      await supabase
        .from("listings")
        .update({
          tier: selectedTier.tier,
          featured: true,
          expires_at: new Date(Date.now() + selectedTier.days * 86400000).toISOString(),
        })
        .eq("id", listing.id);

      window.location.href = `/dashboard?payment=success&tier=${selectedTier.tier}`;
    } catch {
      setError("Something went wrong. Please try again.");
      setBoosting(false);
    }
  };

  const selectedTier = BOOST_TIERS[selectedIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#111111] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">Listing not found</p>
          <p className="text-gray-400 text-sm mt-1">This listing doesn&apos;t exist or doesn&apos;t belong to you.</p>
          <Link href="/dashboard" className="mt-4 inline-block text-red-600 text-sm font-semibold hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const alreadyBoosted = listing?.tier === "featured" || listing?.tier === "premium";
  const canAfford = balance >= selectedTier.price;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111111]">
      <div className="max-w-xl mx-auto px-4 py-10">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mb-6 transition-colors"
        >
          ← My Listings
        </Link>

        <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-1">
          Boost Listing
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Get more eyes on your listing with a featured placement.
        </p>

        {/* Listing preview */}
        <div className="bg-white dark:bg-[#1c1c1c] rounded-2xl border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-3 mb-6">
          <div className="relative w-[60px] h-[60px] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
            {listing?.images?.[0] ? (
              <Image
                src={listing.images[0]}
                alt={listing?.title ?? ""}
                fill
                className="object-cover"
                sizes="60px"
                unoptimized={listing.images[0].startsWith("blob:")}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package size={22} className="text-gray-300" strokeWidth={1.5} />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{listing?.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{listing?.category}</p>
          </div>
          {alreadyBoosted && (
            <span className="inline-flex items-center gap-1 text-xs bg-red-600 text-white font-bold px-2.5 py-1 rounded-full shrink-0">
              <Zap size={10} />
              {listing?.tier === "premium" ? "Premium" : "Featured"}
            </span>
          )}
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {BOOST_TIERS.map((t, i) => {
            const isSelected = selectedIndex === i;
            return (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={[
                  "relative flex flex-col items-center gap-1.5 p-4 rounded-2xl border text-center transition-all duration-200",
                  isSelected
                    ? "border-red-600 ring-1 ring-red-500 bg-red-50 dark:bg-red-950/20"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1c1c1c] hover:border-gray-300 dark:hover:border-gray-600",
                ].join(" ")}
              >
                {t.popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs bg-red-600 text-white font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                    Most Popular
                  </span>
                )}
                <span className={`font-display font-bold text-base ${isSelected ? "text-red-600" : "text-gray-900 dark:text-white"}`}>
                  {t.label}
                </span>
                <span className={`text-xl font-bold ${isSelected ? "text-red-600" : "text-gray-900 dark:text-white"}`}>
                  TT${t.price}
                </span>
                <span className="text-xs text-gray-400">{t.days} days</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${
                  t.tier === "premium"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                    : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                }`}>
                  {t.tier === "premium" ? "Premium" : "Featured"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Wallet balance */}
        <div className={[
          "flex items-center justify-between p-4 rounded-xl mb-4",
          canAfford
            ? "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/40"
            : "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40",
        ].join(" ")}>
          <span className={`text-sm font-semibold ${canAfford ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
            Your balance: TT${balance.toFixed(2)}
          </span>
          {!canAfford && (
            <Link
              href="/wallet"
              className="text-xs font-semibold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              Top Up Wallet
            </Link>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 rounded-xl mb-4 text-sm text-red-700 dark:text-red-400">
            <AlertCircle size={16} strokeWidth={1.5} />
            {error}
          </div>
        )}

        {/* What you get */}
        <div className="bg-white dark:bg-[#1c1c1c] rounded-2xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <p className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">What you get</p>
          <div className="space-y-2">
            {["Top placement in search results", "Featured badge on your listing", "Highlighted in Homepage section"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-green-500 shrink-0" strokeWidth={1.5} />
                <span className="text-sm text-gray-600 dark:text-gray-400">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleBoost}
          disabled={boosting || !canAfford}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all"
        >
          {boosting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing…
            </>
          ) : (
            <>
              <Zap size={16} strokeWidth={1.5} />
              Boost Listing · TT${selectedTier.price}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
