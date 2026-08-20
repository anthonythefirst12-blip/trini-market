"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Zap, Store, TrendingUp, ImageIcon, LayoutGrid, BadgeCheck, BookOpen, BarChart2, Headphones } from "lucide-react";

const boostOptions = [
  { duration: "1 Week", price: "TT$15", description: "Quick push for a fast sale.", popular: false },
  { duration: "2 Weeks", price: "TT$25", description: "Most sellers see results within two weeks.", popular: false },
  { duration: "1 Month", price: "TT$40", description: "Maximum exposure for hard-to-sell items.", popular: true },
];

const boostPerks = [
  { Icon: TrendingUp, title: "Top of search results", desc: "Your listing appears above all non-boosted listings in its category." },
  { Icon: BadgeCheck, title: "Featured badge", desc: "A bold badge that makes your listing stand out at a glance." },
  { Icon: LayoutGrid, title: "Homepage placement", desc: "Shown in the Featured Listings section on the homepage." },
  { Icon: ImageIcon, title: "Up to 5 photos", desc: "Boosted listings can include up to 5 images instead of 2." },
];

const storefrontFeatures = [
  { Icon: Store, title: "Branded Storefront Page", desc: "Your own page with your logo, banner, and all listings in one place." },
  { Icon: Zap, title: "Unlimited Listings", desc: "Post as many vehicles, properties, or services as you need — no cap." },
  { Icon: BadgeCheck, title: "Verified Business Badge", desc: "A badge that tells buyers you're a legitimate, vetted business." },
  { Icon: BookOpen, title: "Business Directory Listing", desc: "Your business appears in the dedicated Business Directory." },
  { Icon: BarChart2, title: "Analytics Dashboard", desc: "Track views, enquiries, and listing performance." },
  { Icon: Headphones, title: "Priority Support", desc: "Issues resolved faster than standard accounts." },
];

const boostFaqs = [
  { q: "How do I boost a listing?", a: "Go to your Dashboard, find the listing you want to boost, and click Boost. Select your duration, pay via WiPay, and it goes live instantly." },
  { q: "Can I boost multiple listings at once?", a: "Yes — you can boost as many listings as you like. Each boost is a separate one-time payment for that specific listing." },
  { q: "What happens when my boost expires?", a: "Your listing stays live but returns to standard placement. You can re-boost it at any time from your dashboard." },
  { q: "What payment methods do you accept?", a: "We accept payments via WiPay, which supports Visa, Mastercard, and local bank cards including Linx." },
];

const storefrontFaqs = [
  { q: "Who is the Business Storefront for?", a: "It's designed for established businesses — car dealerships, real estate agencies, retailers, and service companies — who want to list many items under a branded presence." },
  { q: "How do I cancel?", a: "Go to Dashboard → Settings and click Cancel. Your storefront stays active until the end of the billing period, then stops automatically." },
  { q: "What payment methods do you accept?", a: "We accept payments via WiPay, which supports Visa, Mastercard, and local bank cards including Linx." },
  { q: "Is there a lock-in contract?", a: "No. Cancel anytime from your dashboard — no penalties, no questions asked." },
];

const businessTags = ["Car Dealerships", "Real Estate Firms", "Auto Parts Shops", "Construction Companies", "Clothing Stores", "Restaurants & Catering", "Service Companies", "Electronics Retailers"];

function PricingInner() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"boost" | "storefront">(
    searchParams.get("tab") === "storefront" ? "storefront" : "boost"
  );

  return (
    <div className="pricing-page min-h-screen">
      <style>{`
        .pricing-page { background: #fafafa; }
        .pricing-heading { color: #111827; }
        .pricing-sub { color: #6b7280; }
        .pricing-card { background: #ffffff; border-color: #e5e7eb; }
        .pricing-card-highlight { background: #ffffff; border-color: #dc2626; box-shadow: 0 0 0 1px rgba(220,38,38,0.15), 0 8px 24px rgba(220,38,38,0.08); }
        .pricing-faq { background: #ffffff; border-color: #e5e7eb; }
        .pricing-faq summary { color: #374151; }
        .pricing-faq-body { color: #6b7280; }
        .pricing-free { background: rgba(220,38,38,0.04); border-color: rgba(220,38,38,0.15); }
        .pricing-tab { color: #6b7280; background: transparent; }
        .pricing-tab:hover { color: #111827; }
        .pricing-tab-bar { background: #f3f4f6; border-color: #e5e7eb; }
        .pricing-tab-active { background: #dc2626; color: #ffffff; box-shadow: 0 2px 8px rgba(220,38,38,0.3); }
        .pricing-perk { background: #f9fafb; border-color: #e5e7eb; }
        .pricing-perk-icon { color: #dc2626; background: rgba(220,38,38,0.08); }
        .pricing-tag { background: rgba(220,38,38,0.06); border-color: rgba(220,38,38,0.15); color: #b91c1c; }
        .pricing-divider { border-color: #e5e7eb; }
        .pricing-section { background: #ffffff; }

        [data-theme="dark"] .pricing-page { background: #111111; }
        [data-theme="dark"] .pricing-heading { color: #f9fafb; }
        [data-theme="dark"] .pricing-sub { color: rgba(255,255,255,0.4); }
        [data-theme="dark"] .pricing-card { background: #1c1c1c; border-color: #2a2a2a; }
        [data-theme="dark"] .pricing-card-highlight { background: #1c1c1c; border-color: #dc2626; box-shadow: 0 0 0 1px rgba(220,38,38,0.3), 0 8px 24px rgba(220,38,38,0.15); }
        [data-theme="dark"] .pricing-faq { background: #1c1c1c; border-color: #2a2a2a; }
        [data-theme="dark"] .pricing-faq summary { color: #d1d5db; }
        [data-theme="dark"] .pricing-faq-body { color: rgba(255,255,255,0.4); }
        [data-theme="dark"] .pricing-free { background: rgba(220,38,38,0.08); border-color: rgba(220,38,38,0.2); }
        [data-theme="dark"] .pricing-tab { color: rgba(255,255,255,0.4); }
        [data-theme="dark"] .pricing-tab:hover { color: #ffffff; }
        [data-theme="dark"] .pricing-tab-bar { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.08); }
        [data-theme="dark"] .pricing-perk { background: #161616; border-color: #2a2a2a; }
        [data-theme="dark"] .pricing-perk-icon { color: #fca5a5; background: rgba(220,38,38,0.15); }
        [data-theme="dark"] .pricing-tag { background: rgba(220,38,38,0.12); border-color: rgba(220,38,38,0.25); color: #fca5a5; }
        [data-theme="dark"] .pricing-divider { border-color: #2a2a2a; }
        [data-theme="dark"] .pricing-section { background: #1c1c1c; }

        @media (prefers-color-scheme: dark) {
          :root:not([data-theme="light"]) .pricing-page { background: #111111; }
          :root:not([data-theme="light"]) .pricing-heading { color: #f9fafb; }
          :root:not([data-theme="light"]) .pricing-sub { color: rgba(255,255,255,0.4); }
          :root:not([data-theme="light"]) .pricing-card { background: #1c1c1c; border-color: #2a2a2a; }
          :root:not([data-theme="light"]) .pricing-card-highlight { background: #1c1c1c; border-color: #dc2626; box-shadow: 0 0 0 1px rgba(220,38,38,0.3), 0 8px 24px rgba(220,38,38,0.15); }
          :root:not([data-theme="light"]) .pricing-faq { background: #1c1c1c; border-color: #2a2a2a; }
          :root:not([data-theme="light"]) .pricing-faq summary { color: #d1d5db; }
          :root:not([data-theme="light"]) .pricing-faq-body { color: rgba(255,255,255,0.4); }
          :root:not([data-theme="light"]) .pricing-free { background: rgba(220,38,38,0.08); border-color: rgba(220,38,38,0.2); }
          :root:not([data-theme="light"]) .pricing-tab { color: rgba(255,255,255,0.4); }
          :root:not([data-theme="light"]) .pricing-tab:hover { color: #ffffff; }
          :root:not([data-theme="light"]) .pricing-tab-bar { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.08); }
          :root:not([data-theme="light"]) .pricing-perk { background: #161616; border-color: #2a2a2a; }
          :root:not([data-theme="light"]) .pricing-perk-icon { color: #fca5a5; background: rgba(220,38,38,0.15); }
          :root:not([data-theme="light"]) .pricing-tag { background: rgba(220,38,38,0.12); border-color: rgba(220,38,38,0.25); color: #fca5a5; }
          :root:not([data-theme="light"]) .pricing-divider { border-color: #2a2a2a; }
          :root:not([data-theme="light"]) .pricing-section { background: #1c1c1c; }
        }
      `}</style>

      <PageHero
        eyebrow="Pricing"
        title="Pay only for what you need."
        subtitle="Listing is always free. Boost when you want more visibility."
      >
        {/* Tab switcher */}
        <div className="pricing-tab-bar inline-flex rounded-2xl p-1.5 gap-1 border">
          <button
            onClick={() => setTab("boost")}
            className={`pricing-tab px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${tab === "boost" ? "pricing-tab-active" : ""}`}
          >
            Boost a Listing
          </button>
          <button
            onClick={() => setTab("storefront")}
            className={`pricing-tab px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${tab === "storefront" ? "pricing-tab-active" : ""}`}
          >
            Business Storefront
          </button>
        </div>
      </PageHero>

      {/* ── BOOST TAB ── */}
      {tab === "boost" && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

          {/* Free tier callout */}
          <div className="pricing-free border rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <h3 className="pricing-heading font-display font-bold text-base mb-0.5">Listing is free — always</h3>
              <p className="pricing-sub text-sm">Any registered user can post listings at no cost. No credit card needed. Boost when you want more eyes on a specific item.</p>
            </div>
            <Link href="/auth/signup" className="shrink-0 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap">
              Get started free →
            </Link>
          </div>

          {/* Boost cards */}
          <div>
            <h2 className="pricing-heading font-display font-bold text-2xl mb-2">Boost a Listing</h2>
            <p className="pricing-sub text-sm mb-8">One-time payment per listing. No subscription required.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {boostOptions.map((opt) => (
                <div key={opt.duration} className="relative">
                  {opt.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                      <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">Most Popular</span>
                    </div>
                  )}
                  <div className={`${opt.popular ? "pricing-card-highlight" : "pricing-card"} border rounded-2xl p-6 flex flex-col h-full hover:-translate-y-1 transition-transform duration-200`}>
                    <p className="pricing-sub text-xs font-semibold uppercase tracking-wider mb-1">{opt.duration}</p>
                    <p className="pricing-heading font-display font-bold text-4xl mb-1">{opt.price}</p>
                    <p className="pricing-sub text-xs mb-6">{opt.description}</p>
                    <Link href="/dashboard" className={`mt-auto inline-flex items-center justify-center w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${opt.popular ? "bg-red-600 hover:bg-red-700 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}>
                      Boost for {opt.duration}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Boost perks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {boostPerks.map((p) => (
              <div key={p.title} className="pricing-perk border rounded-xl p-5">
                <div className="pricing-perk-icon w-9 h-9 rounded-xl flex items-center justify-center mb-3">
                  <p.Icon className="w-4 h-4" strokeWidth={2} />
                </div>
                <p className="pricing-heading text-sm font-semibold mb-1">{p.title}</p>
                <p className="pricing-sub text-xs leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div>
            <h2 className="pricing-heading font-display font-bold text-2xl mb-5">FAQ</h2>
            <div className="space-y-2">
              {boostFaqs.map((item) => (
                <details key={item.q} className="pricing-faq border rounded-xl group">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-medium list-none hover:opacity-80 transition-opacity">
                    {item.q}
                    <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="pricing-faq-body px-5 pb-4 text-sm leading-relaxed">{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── STOREFRONT TAB ── */}
      {tab === "storefront" && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

          {/* Price header */}
          <div className="text-center">
            <p className="pricing-sub text-xs font-semibold uppercase tracking-widest mb-3">Business Storefront</p>
            <div className="flex items-baseline gap-1.5 justify-center mb-3">
              <span className="pricing-heading font-display font-bold text-5xl">TT$99</span>
              <span className="pricing-sub text-lg">/ month</span>
            </div>
            <p className="pricing-sub max-w-lg mx-auto text-sm leading-relaxed">
              Built for car dealerships, real estate companies, and established service businesses. Get your own branded storefront, appear in the Business Directory, and post unlimited listings.
            </p>
            <p className="text-green-600 text-xs font-medium mt-3">Cancel anytime — no lock-in contract</p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {storefrontFeatures.map((f) => (
              <div key={f.title} className="pricing-card border rounded-2xl p-5 hover:-translate-y-1 transition-transform duration-200">
                <div className="pricing-perk-icon w-9 h-9 rounded-xl flex items-center justify-center mb-3">
                  <f.Icon className="w-4 h-4" strokeWidth={2} />
                </div>
                <h3 className="pricing-heading font-semibold text-sm mb-1">{f.title}</h3>
                <p className="pricing-sub text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Business tags */}
          <div className="pricing-card border rounded-2xl p-6">
            <p className="pricing-heading text-sm font-semibold mb-4">Perfect for:</p>
            <div className="flex flex-wrap gap-2">
              {businessTags.map((tag) => (
                <span key={tag} className="pricing-tag text-xs px-3 py-1.5 rounded-full font-medium border">{tag}</span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/storefront/apply" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-base px-8 py-3.5 rounded-xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(220,38,38,0.35)] active:scale-95">
              Get a Business Storefront →
            </Link>
            <p className="pricing-sub text-xs mt-3">TT$99/month · Pay securely via WiPay · Cancel anytime</p>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="pricing-heading font-display font-bold text-2xl mb-5">FAQ</h2>
            <div className="space-y-2">
              {storefrontFaqs.map((item) => (
                <details key={item.q} className="pricing-faq border rounded-xl group">
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-medium list-none hover:opacity-80 transition-opacity">
                    {item.q}
                    <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="pricing-faq-body px-5 pb-4 text-sm leading-relaxed">{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense>
      <PricingInner />
    </Suspense>
  );
}
