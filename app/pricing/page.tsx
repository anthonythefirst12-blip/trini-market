"use client";

import Link from "next/link";
import { useState } from "react";

const boostOptions = [
  {
    duration: "1 Week",
    price: "TT$15",
    description: "Quick visibility push for a fast sale.",
    popular: false,
  },
  {
    duration: "2 Weeks",
    price: "TT$25",
    description: "Most sellers see results within two weeks.",
    popular: false,
  },
  {
    duration: "1 Month",
    price: "TT$40",
    description: "Maximum exposure for hard-to-sell items.",
    popular: true,
  },
];

const boostPerks = [
  { icon: "🔝", title: "Top of search results", desc: "Your listing appears above all non-boosted listings in its category." },
  { icon: "⭐", title: "Featured badge", desc: "A bold badge that makes your listing stand out at a glance." },
  { icon: "🏠", title: "Homepage placement", desc: "Shown in the Featured Listings carousel on the homepage." },
  { icon: "📸", title: "Up to 5 photos", desc: "Boosted listings can include up to 5 images instead of 2." },
];

const storefrontFeatures = [
  { icon: "🏪", title: "Branded Storefront Page", desc: "Your own page with your logo, banner, and all your listings in one place. Share a single link to your whole catalogue." },
  { icon: "∞", title: "Unlimited Listings", desc: "Post as many vehicles, properties, or services as you need — no cap, ever." },
  { icon: "✅", title: "Verified Business Badge", desc: "A badge that tells buyers you're a legitimate, vetted business — not a random individual." },
  { icon: "📂", title: "Business Directory Listing", desc: "Your business appears in the dedicated Business Directory, where buyers specifically look for established companies." },
  { icon: "📊", title: "Analytics Dashboard", desc: "Track views, enquiries, and listing performance from your seller dashboard." },
  { icon: "⚡", title: "Priority Support", desc: "Direct support line — issues resolved faster than standard accounts." },
];

const boostFaqs = [
  { q: "How do I boost a listing?", a: "Go to your Dashboard, find the listing you want to boost, and click the Boost button. Select your duration, pay via WiPay, and it goes live instantly." },
  { q: "Can I boost multiple listings at once?", a: "Yes — you can boost as many individual listings as you like. Each boost is a separate one-time payment for that specific listing." },
  { q: "What happens when my boost expires?", a: "Your listing stays live but returns to standard placement. You can re-boost it at any time from your dashboard." },
  { q: "What payment methods do you accept?", a: "We accept payments via WiPay, which supports Visa, Mastercard, and local bank cards including Linx." },
];

const storefrontFaqs = [
  { q: "Who is the Business Storefront for?", a: "It's designed for established businesses — car dealerships, real estate agencies, retailers, and service companies — who want to list many items under a single branded presence on the site." },
  { q: "How do I cancel my Business Storefront?", a: "Go to Dashboard → Boosts and click Cancel. Your storefront stays active until the end of the current billing period, then stops automatically." },
  { q: "What payment methods do you accept?", a: "We accept payments via WiPay, which supports Visa, Mastercard, and local bank cards including Linx." },
  { q: "Is there a lock-in contract?", a: "No. Cancel anytime from your dashboard — no penalties, no questions asked." },
];

export default function PricingPage() {
  const [tab, setTab] = useState<"boost" | "storefront">("boost");

  return (
    <div className="min-h-screen" style={{ background: "#1a0000" }}>

      {/* Hero */}
      <section className="relative py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 0%, #3b0000 0%, transparent 60%)",
        }} />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle, #fca5a5 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="inline-block bg-red-900/40 text-red-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 border border-red-700/40">
            Pricing
          </span>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
            Pay only for what you need.
          </h1>
          <p className="text-red-200/60 text-lg mb-10">
            Listing is always free. Choose what you need below.
          </p>

          {/* Tab switcher */}
          <div className="inline-flex rounded-2xl p-1.5 gap-1" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <button
              onClick={() => setTab("boost")}
              className="relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
              style={tab === "boost" ? {
                background: "#dc2626",
                color: "white",
                boxShadow: "0 2px 12px rgba(220,38,38,0.4)",
              } : {
                color: "rgba(255,200,200,0.6)",
              }}
            >
              ⚡ Boost a Listing
            </button>
            <button
              onClick={() => setTab("storefront")}
              className="relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
              style={tab === "storefront" ? {
                background: "#dc2626",
                color: "white",
                boxShadow: "0 2px 12px rgba(220,38,38,0.4)",
              } : {
                color: "rgba(255,200,200,0.6)",
              }}
            >
              🏪 Business Storefront
            </button>
          </div>
        </div>
      </section>

      {/* ── BOOST TAB ── */}
      {tab === "boost" && (
        <div>
          {/* Free tier callout */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-6">
            <div className="rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="text-3xl shrink-0">🆓</div>
              <div className="flex-1">
                <h3 className="font-display font-bold text-white text-base mb-0.5">Listing is free — always</h3>
                <p className="text-sm text-red-200/50">Any registered user can post listings at no cost. No credit card needed. Boost when you want more eyes on a specific item.</p>
              </div>
              <Link href="/auth/signup" className="shrink-0 inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors border border-white/10 whitespace-nowrap">
                Get started free →
              </Link>
            </div>
          </section>

          {/* Boost cards */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <div className="mb-8">
              <h2 className="font-display font-bold text-3xl text-white mb-2">Boost a Listing</h2>
              <p className="text-red-200/50 text-sm max-w-lg">One-time payment per listing. Pick your duration, pay, and your listing jumps to the top. No subscription required.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
              {boostOptions.map((opt) => (
                <div key={opt.duration} className="relative">
                  {opt.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                      <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">Most Popular</span>
                    </div>
                  )}
                  <div className="rounded-2xl p-6 flex flex-col h-full transition-transform hover:-translate-y-1 duration-200" style={{
                    background: opt.popular ? "rgba(185,28,28,0.2)" : "rgba(40,0,0,0.6)",
                    border: opt.popular ? "1px solid rgba(220,38,38,0.5)" : "1px solid rgba(185,28,28,0.2)",
                    boxShadow: opt.popular ? "0 0 30px rgba(185,28,28,0.2)" : "none",
                  }}>
                    <div className="mb-4">
                      <p className="text-red-200/60 text-sm font-medium mb-1">{opt.duration}</p>
                      <p className="font-display font-bold text-4xl text-white">{opt.price}</p>
                      <p className="text-red-200/50 text-xs mt-2">{opt.description}</p>
                    </div>
                    <Link href="/dashboard" className="mt-auto inline-flex items-center justify-center w-full py-2.5 rounded-xl text-sm font-semibold transition-colors"
                      style={{
                        background: opt.popular ? "#dc2626" : "rgba(255,255,255,0.08)",
                        color: "white",
                      }}>
                      Boost for {opt.duration}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Boost perks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {boostPerks.map((p) => (
                <div key={p.title} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="text-xl mb-2">{p.icon}</div>
                  <p className="text-white text-sm font-semibold mb-1">{p.title}</p>
                  <p className="text-red-200/40 text-xs leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>

            {/* FAQ */}
            <h2 className="font-display font-bold text-2xl text-white mb-6">FAQ</h2>
            <div className="space-y-3">
              {boostFaqs.map((item) => (
                <details key={item.q} className="rounded-xl group" style={{ background: "rgba(40,0,0,0.6)", border: "1px solid rgba(185,28,28,0.2)" }}>
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-red-100/80 text-sm list-none hover:text-white transition-colors">
                    {item.q}
                    <svg className="w-4 h-4 text-red-400 group-open:rotate-180 transition-transform shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-4 text-sm text-red-200/50 leading-relaxed">{item.a}</div>
                </details>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ── STOREFRONT TAB ── */}
      {tab === "storefront" && (
        <div>
          <section className="relative py-6 px-4 overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle, #fca5a5 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }} />
            <div className="relative z-10 max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-3">
                  Business Storefront
                </h2>
                <div className="flex items-baseline gap-1 justify-center mb-3">
                  <span className="font-display font-bold text-5xl text-white">TT$99</span>
                  <span className="text-red-200/50 text-lg">/ month</span>
                </div>
                <p className="text-red-200/60 max-w-xl mx-auto text-sm">
                  Built for car dealerships, real estate companies, and established service businesses. Get your own branded storefront, appear in the Business Directory, and post unlimited listings under your brand.
                </p>
                <p className="text-xs text-green-400 font-medium mt-2">✅ Cancel anytime, no lock-in contract</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                {storefrontFeatures.map((f) => (
                  <div key={f.title} className="rounded-xl p-5 hover:-translate-y-1 transition-transform duration-200" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="text-2xl mb-2">{f.icon}</div>
                    <h3 className="font-display font-semibold text-white text-sm mb-1">{f.title}</h3>
                    <p className="text-red-200/50 text-xs leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>

              {/* Business type examples */}
              <div className="rounded-2xl p-6 mb-8" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="text-white text-sm font-semibold mb-3">Perfect for:</p>
                <div className="flex flex-wrap gap-2">
                  {["🚗 Car Dealerships", "🏠 Real Estate Firms", "🔧 Auto Parts Shops", "🏗️ Construction Companies", "👗 Clothing Stores", "🍽️ Restaurants & Catering", "⚙️ Service Companies", "📱 Electronics Retailers"].map((tag) => (
                    <span key={tag} className="text-xs text-red-100/70 px-3 py-1.5 rounded-full font-medium" style={{ background: "rgba(185,28,28,0.15)", border: "1px solid rgba(185,28,28,0.3)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-center mb-12">
                <Link href="/settings" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-base px-8 py-3.5 rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] active:scale-95">
                  ⚡ Get a Business Storefront
                </Link>
                <p className="text-red-200/40 text-xs mt-3">Monthly subscription · Billed on the same date each month · Cancel from Settings anytime</p>
              </div>

              {/* FAQ */}
              <h2 className="font-display font-bold text-2xl text-white mb-6">FAQ</h2>
              <div className="space-y-3">
                {storefrontFaqs.map((item) => (
                  <details key={item.q} className="rounded-xl group" style={{ background: "rgba(40,0,0,0.6)", border: "1px solid rgba(185,28,28,0.2)" }}>
                    <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-red-100/80 text-sm list-none hover:text-white transition-colors">
                      {item.q}
                      <svg className="w-4 h-4 text-red-400 group-open:rotate-180 transition-transform shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-5 pb-4 text-sm text-red-200/50 leading-relaxed">{item.a}</div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

    </div>
  );
}
