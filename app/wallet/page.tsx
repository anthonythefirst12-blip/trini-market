"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase-browser";

const TOP_UP_AMOUNTS = [100, 250, 500];

type Transaction = {
  id: string;
  type: "topup" | "deduction" | "refund";
  amount_ttd: number;
  description: string;
  created_at: string;
  reference_id?: string;
};

type Subscription = {
  id: string;
  tier: "featured" | "premium";
  status: string;
  price_ttd: number;
  next_billing_at: string;
  cancelled_at?: string;
  listings?: { title: string } | null;
};

type PaymentMethod = "wipay";

export default function WalletPage() {
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("payment");

  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<number>(100);
  const [custom, setCustom] = useState("");
  const paymentMethod: PaymentMethod = "wipay";
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    setUserId(user.id);

    const [walletRes, txRes, subRes] = await Promise.all([
      supabase.from("wallets").select("balance_ttd").eq("user_id", user.id).single(),
      supabase.from("wallet_transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
      supabase.from("subscriptions").select("*, listings(title)").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]);

    setBalance(walletRes.data?.balance_ttd ?? 0);
    setTransactions(txRes.data ?? []);
    setSubscriptions(subRes.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
    if (paymentStatus === "success") showToast("success", "Payment successful! Your wallet has been updated.");
    if (paymentStatus === "failed") showToast("error", "Payment failed. Please try again.");
    if (paymentStatus === "error") showToast("error", "Something went wrong. Contact support if you were charged.");
  }, [loadData, paymentStatus]);

  const handleTopUp = async () => {
    const amount = custom ? Number(custom) : selected;
    if (!amount || amount < 50) return showToast("error", "Minimum top-up is TT$50.");
    if (!userId) return showToast("error", "You must be logged in.");

    setProcessing(true);

    const res = await fetch("/api/payments/wipay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amountTTD: amount, purpose: "wallet_topup" }),
    });
    const data = await res.json();
    if (data.wipayUrl && data.fields) {
      // WiPay requires a POST form submission
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.wipayUrl;
      Object.entries(data.fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } else {
      showToast("error", "Could not connect to WiPay. Check your account settings.");
      setProcessing(false);
    }
  };

  const handleCancelSub = async (subId: string, tier: string, nextBilling: string) => {
    if (!confirm(`Cancel ${tier} plan? It stays active until ${new Date(nextBilling).toLocaleDateString("en-TT", { month: "short", day: "numeric", year: "numeric" })}.`)) return;

    const supabase = createClient();
    await supabase
      .from("subscriptions")
      .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
      .eq("id", subId);

    setSubscriptions((prev) =>
      prev.map((s) => s.id === subId ? { ...s, status: "cancelled", cancelled_at: new Date().toISOString() } : s)
    );
    showToast("success", "Plan cancelled. Active until next billing date.");
  };

  const activeSubs = subscriptions.filter((s) => s.status === "active");
  const cancelledSubs = subscriptions.filter((s) => s.status === "cancelled");
  const totalSpent = transactions.filter((t) => t.type === "deduction").reduce((s, t) => s + t.amount_ttd, 0);
  const totalTopUp = transactions.filter((t) => t.type === "topup").reduce((s, t) => s + t.amount_ttd, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-sm text-gray-400">Loading wallet…</div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">You need to be logged in to view your wallet.</p>
          <Link href="/auth/login"><Button>Log In</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Toast */}
        {toast && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${toast.type === "success" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
            {toast.type === "success" ? "✅" : "⚠️"} {toast.msg}
          </div>
        )}

        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl text-gray-900">My Wallet</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your balance and active subscriptions.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Balance card */}
          <div className="bg-blue-700 rounded-2xl p-6 text-white">
            <p className="text-blue-200 text-sm font-medium mb-2">Available Balance</p>
            <p className="font-display font-bold text-4xl">TT${balance?.toFixed(2) ?? "0.00"}</p>
            <p className="text-blue-200 text-xs mt-3">Credits never expire · For one-off top-ups</p>
          </div>

          {/* Quick stats */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Total spent</span>
              <span className="font-semibold text-gray-900">TT${totalSpent.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Total topped up</span>
              <span className="font-semibold text-gray-900">TT${totalTopUp.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Active subscriptions</span>
              <span className="font-semibold text-gray-900">{activeSubs.length}</span>
            </div>
          </div>
        </div>

        {/* Active Subscriptions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-semibold text-base text-gray-900">Active Subscriptions</h2>
              <p className="text-xs text-gray-400 mt-0.5">Monthly plans — cancel anytime, no lock-in</p>
            </div>
            <Link href="/pricing">
              <Button variant="secondary" size="sm">+ Add Plan</Button>
            </Link>
          </div>

          {activeSubs.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
              <p className="text-sm text-gray-400 mb-3">No active subscriptions</p>
              <Link href="/pricing"><Button size="sm">Browse Plans</Button></Link>
            </div>
          ) : (
            <div className="space-y-3">
              {activeSubs.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between gap-4 bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {sub.tier === "featured" ? (
                        <span className="text-xs bg-blue-100 text-blue-700 border border-blue-300 font-semibold px-2 py-0.5 rounded">◆ Featured</span>
                      ) : (
                        <span className="text-xs bg-blue-700 text-white font-bold px-2 py-0.5 rounded">★ Premium</span>
                      )}
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Active
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium truncate">{sub.listings?.title ?? "Listing"}</p>
                    <p className="text-xs text-gray-400 mt-0.5">TT${sub.price_ttd}/month · Next billing: {new Date(sub.next_billing_at).toLocaleDateString("en-TT", { month: "short", day: "numeric", year: "numeric" })}</p>
                  </div>
                  <button
                    onClick={() => handleCancelSub(sub.id, sub.tier, sub.next_billing_at)}
                    className="shrink-0 text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Cancel Plan
                  </button>
                </div>
              ))}
            </div>
          )}

          {cancelledSubs.length > 0 && (
            <div className="mt-3 space-y-2">
              {cancelledSubs.map((sub) => (
                <div key={sub.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 opacity-60 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{sub.listings?.title ?? "Listing"}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Cancelled · Active until {new Date(sub.next_billing_at).toLocaleDateString("en-TT", { month: "short", day: "numeric", year: "numeric" })}</p>
                  </div>
                  <Link href="/pricing"><Button size="sm" variant="secondary">Resubscribe</Button></Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Up */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="font-display font-semibold text-base text-gray-900 mb-1">Top Up Balance</h2>
          <p className="text-sm text-gray-400 mb-5">Add credits to your wallet. Minimum TT$50.</p>

          {/* Payment provider */}
          <div className="flex items-center gap-2 mb-5 p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <span className="text-xl">🇹🇹</span>
            <div>
              <p className="text-sm font-semibold text-blue-800">WiPay — Secure Local Payment</p>
              <p className="text-xs text-blue-600">Visa, Mastercard & local TT bank cards accepted</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {TOP_UP_AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => { setSelected(amt); setCustom(""); }}
                className={[
                  "py-2.5 rounded-xl text-sm font-semibold border-2 transition-all",
                  selected === amt && !custom ? "border-blue-700 bg-blue-700 text-white" : "border-gray-200 text-gray-700 hover:border-blue-300",
                ].join(" ")}
              >
                TT${amt}
              </button>
            ))}
          </div>

          <div className="relative mb-5">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">TT$</span>
            <input
              type="number"
              placeholder="Custom amount (min 50)"
              value={custom}
              onChange={(e) => { setCustom(e.target.value); setSelected(0); }}
              min="50"
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button onClick={handleTopUp} fullWidth size="lg" disabled={processing}>
            {processing ? "Redirecting to WiPay…" : `Pay TT$${custom || selected || "—"} via WiPay`}
          </Button>

          <p className="text-xs text-gray-400 text-center mt-3">
            You'll be redirected to WiPay's secure checkout. Supports local TT bank cards.
          </p>
        </div>

        {/* Transaction history */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-display font-semibold text-base text-gray-900 mb-5">Transaction History</h2>
          {transactions.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No transactions yet.</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${tx.type === "topup" ? "bg-green-100" : tx.type === "refund" ? "bg-yellow-100" : "bg-blue-100"}`}>
                      {tx.type === "topup" ? "↑" : tx.type === "refund" ? "↩" : "↓"}
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 font-medium">{tx.description}</p>
                      <p className="text-xs text-gray-400">{new Date(tx.created_at).toLocaleDateString("en-TT", { month: "short", day: "numeric", year: "numeric" })}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${tx.type === "topup" || tx.type === "refund" ? "text-green-600" : "text-blue-700"}`}>
                    {tx.type === "topup" || tx.type === "refund" ? "+" : "-"}TT${tx.amount_ttd.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
