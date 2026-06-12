"use client";

import { useState } from "react";
import Link from "next/link";
import { walletBalance, walletTransactions } from "@/lib/data";
import { Button } from "@/components/ui/Button";

const TOP_UP_AMOUNTS = [50, 100, 200, 500];

export default function WalletPage() {
  const [balance, setBalance] = useState(walletBalance);
  const [transactions, setTransactions] = useState(walletTransactions);
  const [selected, setSelected] = useState<number>(100);
  const [custom, setCustom] = useState("");
  const [success, setSuccess] = useState(false);

  const handleTopUp = () => {
    const amount = custom ? Number(custom) : selected;
    if (!amount || amount <= 0) return;
    setBalance((b) => b + amount);
    setTransactions((t) => [
      {
        id: `w${Date.now()}`,
        type: "topup",
        amount,
        description: "Top-up via credit card",
        date: new Date().toISOString().slice(0, 10),
      },
      ...t,
    ]);
    setSuccess(true);
    setCustom("");
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl text-gray-900">My Wallet</h1>
          <p className="text-sm text-gray-500 mt-1">Top up credits to boost and feature your listings.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Balance card */}
          <div className="bg-blue-700 rounded-2xl p-6 text-white">
            <p className="text-blue-200 text-sm font-medium mb-2">Available Balance</p>
            <p className="font-display font-bold text-4xl">TT${balance}</p>
            <p className="text-blue-200 text-xs mt-3">Credits never expire · No subscription</p>
          </div>

          {/* Quick stats */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Total spent</span>
              <span className="font-semibold text-gray-900">
                TT${transactions.filter(t => t.type === "spend").reduce((s, t) => s + t.amount, 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Total topped up</span>
              <span className="font-semibold text-gray-900">
                TT${transactions.filter(t => t.type === "topup").reduce((s, t) => s + t.amount, 0) + (balance - walletBalance)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Active boosts</span>
              <span className="font-semibold text-gray-900">2</span>
            </div>
          </div>
        </div>

        {/* Top up */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="font-display font-semibold text-base text-gray-900 mb-5">Top Up Credits</h2>

          <div className="grid grid-cols-4 gap-3 mb-4">
            {TOP_UP_AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => { setSelected(amt); setCustom(""); }}
                className={[
                  "py-2.5 rounded-xl text-sm font-semibold border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  selected === amt && !custom
                    ? "border-blue-700 bg-blue-700 text-white"
                    : "border-gray-200 text-gray-700 hover:border-blue-300",
                ].join(" ")}
              >
                TT${amt}
              </button>
            ))}
          </div>

          <div className="relative mb-4">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">TT$</span>
            <input
              type="number"
              placeholder="Custom amount"
              value={custom}
              onChange={(e) => { setCustom(e.target.value); setSelected(0); }}
              min="1"
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-2.5 rounded-xl flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              TT${custom || selected} added to your wallet!
            </div>
          )}

          <Button onClick={handleTopUp} fullWidth size="lg">
            Top Up TT${custom || selected || "—"}
          </Button>

          <p className="text-xs text-gray-400 text-center mt-3">
            Payment UI only — no real charge. Visa, Mastercard, WiPay coming soon.
          </p>
        </div>

        {/* Boost shortcuts */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="font-display font-semibold text-base text-gray-900 mb-1">Boost a Listing</h2>
          <p className="text-sm text-gray-400 mb-5">Apply credits directly to your active listings.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Toyota Corolla</p>
                <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded">Featured</span>
              </div>
              <Link href="/listings/1">
                <Button variant="secondary" size="sm">Upgrade</Button>
              </Link>
            </div>
            <Link href="/listings/new" className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex items-center justify-center text-sm text-blue-600 hover:border-blue-300 transition-colors font-medium">
              + Boost another listing
            </Link>
          </div>
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
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${tx.type === "topup" ? "bg-green-100" : "bg-blue-100"}`}>
                      {tx.type === "topup" ? "↑" : "↓"}
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 font-medium">{tx.description}</p>
                      <p className="text-xs text-gray-400">{new Date(tx.date).toLocaleDateString("en-TT", { month: "short", day: "numeric", year: "numeric" })}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${tx.type === "topup" ? "text-green-600" : "text-blue-700"}`}>
                    {tx.type === "topup" ? "+" : "-"}TT${tx.amount}
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
