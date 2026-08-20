"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Store, Building2, Car, Home, Laptop, Wrench, Shirt, UtensilsCrossed } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

const BUSINESS_TYPES = [
  { value: "dealership",   label: "Car Dealership",       icon: Car },
  { value: "real_estate",  label: "Real Estate Agency",   icon: Home },
  { value: "tech",         label: "Tech / Electronics",   icon: Laptop },
  { value: "services",     label: "Service Business",     icon: Wrench },
  { value: "fashion",      label: "Fashion / Clothing",   icon: Shirt },
  { value: "food",         label: "Food & Beverage",      icon: UtensilsCrossed },
  { value: "other",        label: "Other Business",       icon: Building2 },
];

const MONTHLY_PRICE = 99;

const inputClass =
  "w-full border border-gray-200 dark:border-white/10 dark:bg-white/5 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500";

export default function StorefrontApplyPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      if (!data.user) { window.location.href = "/auth/login?redirect=/storefront/apply"; return; }
      setUserId(data.user.id);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    if (!businessName.trim() || !businessType || !phone.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/payments/wipay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountTTD: MONTHLY_PRICE,
          purpose: `storefront_${userId}_${encodeURIComponent(businessName)}_${businessType}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Payment init failed");

      // Build and submit WiPay hidden form
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.wipayUrl;
      Object.entries(data.fields).forEach(([k, v]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = k;
        input.value = v as string;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#111111]">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link href="/pricing?tab=storefront" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-8 transition-colors">
          <ChevronLeft size={16} /> Back to Pricing
        </Link>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-600 shrink-0">
            <Store className="w-6 h-6 text-white" strokeWidth={1.5} />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Get Your Business Storefront</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">TT${MONTHLY_PRICE}/month · Cancel anytime</p>
          </div>
        </div>

        {/* What you get */}
        <div className="bg-white dark:bg-[#1c1c1c] rounded-2xl border border-gray-100 dark:border-white/10 p-5 mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">What&apos;s included</p>
          <ul className="space-y-2">
            {[
              "Verified Business badge on all your listings",
              "Listed in the Business Directory",
              "Branded profile page with logo & banner",
              "Unlimited listings",
              "Priority support",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0 text-[10px] font-bold">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1c1c1c] rounded-2xl border border-gray-100 dark:border-white/10 p-6 space-y-5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Business Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Business Name <span className="text-red-500">*</span></label>
            <input type="text" className={inputClass} placeholder="e.g. Sam's Auto Sales" value={businessName} onChange={e => setBusinessName(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Business Type <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {BUSINESS_TYPES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setBusinessType(value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    businessType === value
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                      : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20"
                  }`}
                >
                  <Icon size={15} strokeWidth={1.5} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Contact Number <span className="text-red-500">*</span></label>
            <input type="text" className={inputClass} placeholder="+1 868 XXX XXXX" value={phone} onChange={e => setPhone(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Brief Description <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea rows={3} className={inputClass + " resize-none"} placeholder="Tell buyers about your business…" value={description} onChange={e => setDescription(e.target.value)} maxLength={300} />
          </div>

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold rounded-xl py-3 text-sm transition-colors"
          >
            {loading ? "Redirecting to payment…" : `Pay TT$${MONTHLY_PRICE} · Activate Storefront`}
          </button>
          <p className="text-xs text-center text-gray-400">Secure payment via WiPay · Cancel anytime from your dashboard</p>
        </form>
      </div>
    </div>
  );
}
