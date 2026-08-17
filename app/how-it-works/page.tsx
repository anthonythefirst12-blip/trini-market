import type { Metadata } from "next";
import Link from "next/link";
import { AuthCTA } from "@/components/ui/AuthCTA";
import { PageHero } from "@/components/ui/PageHero";
import { Camera, MessageCircle, HandshakeIcon, Search, Eye, ShieldCheck, Star, MapPin, Clock, Laptop, Car, Home, Shirt, UtensilsCrossed, Wrench, Sofa, Bike } from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works | TriniSell",
  description: "Learn how to buy and sell on TriniSell — Trinidad & Tobago's local marketplace. Post a listing in minutes.",
};

const sellSteps = [
  { n: "01", title: "Create a free account", desc: "Sign up with your email in under a minute. No credit card needed." },
  { n: "02", title: "Post your listing", desc: "Add photos, set your price, pick a category and location. Takes about 2 minutes." },
  { n: "03", title: "Get messages from buyers", desc: "Buyers contact you directly through TriniSell's built-in messaging." },
  { n: "04", title: "Meet and close the deal", desc: "Arrange to meet in a safe public place, hand over the item, and get paid." },
];

const buySteps = [
  { n: "01", title: "Browse or search", desc: "Search by keyword, filter by category, location, or price." },
  { n: "02", title: "View the listing", desc: "See photos, read the description, check the seller's rating and profile." },
  { n: "03", title: "Message the seller", desc: "Ask questions or make an offer directly through the platform." },
  { n: "04", title: "Meet and buy", desc: "Agree on a time and place, inspect the item, and pay. Always meet in public." },
];

const tips = [
  { Icon: Camera, title: "Good photos sell faster", desc: "Use natural light and show the item from multiple angles. Listings with 3+ photos get more views." },
  { Icon: Clock, title: "Respond quickly", desc: "Buyers move on fast. Reply to messages within a few hours to close more deals." },
  { Icon: ShieldCheck, title: "Meet in public", desc: "Always meet in a busy public place — a mall, police station car park, or busy road." },
  { Icon: Star, title: "Build your reputation", desc: "Buyers trust sellers with good ratings. Be honest about condition and show up on time." },
  { Icon: MapPin, title: "Be specific about location", desc: "Listing your area helps local buyers find you faster." },
  { Icon: HandshakeIcon, title: "Never pay before you see it", desc: "Don't send money in advance. If a deal sounds too good to be true, it usually is." },
];

const categories = [
  { label: "Vehicles", Icon: Car },
  { label: "Real Estate", Icon: Home },
  { label: "Electronics", Icon: Laptop },
  { label: "Fashion", Icon: Shirt },
  { label: "Food & Beverage", Icon: UtensilsCrossed },
  { label: "Services", Icon: Wrench },
  { label: "Home & Garden", Icon: Sofa },
  { label: "Sports & Outdoors", Icon: Bike },
];

export default function HowItWorksPage() {
  return (
    <div className="hiw-page min-h-screen">
      <style>{`
        .hiw-page { background: #fafafa; }
        .hiw-section { background: #ffffff; border-color: #e5e7eb; }
        .hiw-section-alt { background: #fafafa; border-color: #e5e7eb; }
        .hiw-heading { color: #111827; }
        .hiw-sub { color: #6b7280; }
        .hiw-card { background: #ffffff; border-color: #e5e7eb; }
        .hiw-card-alt { background: #fafafa; border-color: #e5e7eb; }
        .hiw-step-num { color: #dc2626; }
        .hiw-step-bar { background: #e5e7eb; }
        .hiw-cat-card { background: #ffffff; border-color: #e5e7eb; }
        .hiw-cat-card:hover { border-color: #dc2626; }
        .hiw-cat-icon { color: #9ca3af; }
        .hiw-cat-card:hover .hiw-cat-icon { color: #dc2626; }
        .hiw-cat-label { color: #374151; }
        .hiw-tip-icon { color: #dc2626; background: rgba(220,38,38,0.08); }
        .hiw-divider { border-color: #e5e7eb; }
        .hiw-cta-section { background: #ffffff; }

        [data-theme="dark"] .hiw-page { background: #111111; }
        [data-theme="dark"] .hiw-section { background: #1c1c1c; border-color: #2a2a2a; }
        [data-theme="dark"] .hiw-section-alt { background: #111111; border-color: #2a2a2a; }
        [data-theme="dark"] .hiw-heading { color: #f9fafb; }
        [data-theme="dark"] .hiw-sub { color: rgba(255,255,255,0.4); }
        [data-theme="dark"] .hiw-card { background: #1c1c1c; border-color: #2a2a2a; }
        [data-theme="dark"] .hiw-card-alt { background: #161616; border-color: #2a2a2a; }
        [data-theme="dark"] .hiw-step-bar { background: #2a2a2a; }
        [data-theme="dark"] .hiw-cat-card { background: #1c1c1c; border-color: #2a2a2a; }
        [data-theme="dark"] .hiw-cat-label { color: #d1d5db; }
        [data-theme="dark"] .hiw-tip-icon { color: #fca5a5; background: rgba(220,38,38,0.15); }
        [data-theme="dark"] .hiw-divider { border-color: #2a2a2a; }
        [data-theme="dark"] .hiw-cta-section { background: #1c1c1c; }

        @media (prefers-color-scheme: dark) {
          :root:not([data-theme="light"]) .hiw-page { background: #111111; }
          :root:not([data-theme="light"]) .hiw-section { background: #1c1c1c; border-color: #2a2a2a; }
          :root:not([data-theme="light"]) .hiw-section-alt { background: #111111; border-color: #2a2a2a; }
          :root:not([data-theme="light"]) .hiw-heading { color: #f9fafb; }
          :root:not([data-theme="light"]) .hiw-sub { color: rgba(255,255,255,0.4); }
          :root:not([data-theme="light"]) .hiw-card { background: #1c1c1c; border-color: #2a2a2a; }
          :root:not([data-theme="light"]) .hiw-card-alt { background: #161616; border-color: #2a2a2a; }
          :root:not([data-theme="light"]) .hiw-step-bar { background: #2a2a2a; }
          :root:not([data-theme="light"]) .hiw-cat-card { background: #1c1c1c; border-color: #2a2a2a; }
          :root:not([data-theme="light"]) .hiw-cat-label { color: #d1d5db; }
          :root:not([data-theme="light"]) .hiw-tip-icon { color: #fca5a5; background: rgba(220,38,38,0.15); }
          :root:not([data-theme="light"]) .hiw-divider { border-color: #2a2a2a; }
          :root:not([data-theme="light"]) .hiw-cta-section { background: #1c1c1c; }
        }
      `}</style>

      <PageHero
        eyebrow="How It Works"
        title="Buy & sell the easy way"
        subtitle="TriniSell connects buyers and sellers across Trinidad & Tobago. Free to list, no commissions, no hidden fees."
      >
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/listings/new" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors active:scale-95">
            Post a Listing →
          </Link>
          <Link href="/listings" className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors active:scale-95" style={{}}>
            Browse Listings
          </Link>
        </div>
      </PageHero>

      {/* Selling steps */}
      <section className="hiw-section border-b py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <p className="text-red-600 text-xs font-bold uppercase tracking-widest mb-2">For sellers</p>
            <h2 className="hiw-heading font-display font-bold text-3xl">Selling on TriniSell</h2>
            <p className="hiw-sub mt-2">List your item for free in minutes.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {sellSteps.map((s, i) => (
              <div key={s.n} className="hiw-card border rounded-2xl p-6 relative">
                <p className="hiw-step-num font-display font-bold text-3xl mb-1">{s.n}</p>
                <div className="hiw-step-bar h-px w-8 mb-4 rounded" />
                <h3 className="hiw-heading font-semibold text-base mb-2">{s.title}</h3>
                <p className="hiw-sub text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buying steps */}
      <section className="hiw-section-alt border-b py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <p className="text-red-600 text-xs font-bold uppercase tracking-widest mb-2">For buyers</p>
            <h2 className="hiw-heading font-display font-bold text-3xl">Buying on TriniSell</h2>
            <p className="hiw-sub mt-2">Find great deals from sellers across T&T.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {buySteps.map((s) => (
              <div key={s.n} className="hiw-card-alt border rounded-2xl p-6">
                <p className="hiw-step-num font-display font-bold text-3xl mb-1">{s.n}</p>
                <div className="hiw-step-bar h-px w-8 mb-4 rounded" />
                <h3 className="hiw-heading font-semibold text-base mb-2">{s.title}</h3>
                <p className="hiw-sub text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="hiw-section border-b py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="hiw-heading font-display font-bold text-3xl mb-2">What can you buy &amp; sell?</h2>
            <p className="hiw-sub">Everything from cars to clothes — all local, all T&T.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((c) => (
              <Link key={c.label} href={`/listings?category=${encodeURIComponent(c.label)}`}
                className="hiw-cat-card border rounded-2xl p-5 text-center transition-all group">
                <c.Icon className="hiw-cat-icon w-7 h-7 mx-auto mb-3 transition-colors" strokeWidth={1.5} />
                <p className="hiw-cat-label text-sm font-medium transition-colors">{c.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Safety tips */}
      <section className="hiw-section-alt border-b py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <h2 className="hiw-heading font-display font-bold text-3xl mb-2">Tips for safe trading</h2>
            <p className="hiw-sub">Stay safe and close more deals.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tips.map((t) => (
              <div key={t.title} className="hiw-card border rounded-2xl p-5 flex gap-4">
                <div className="hiw-tip-icon w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
                  <t.Icon className="w-4 h-4" strokeWidth={2} />
                </div>
                <div>
                  <p className="hiw-heading font-semibold text-sm mb-1">{t.title}</p>
                  <p className="hiw-sub text-sm leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hiw-cta-section py-20">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="hiw-heading font-display font-bold text-3xl mb-3">Ready to get started?</h2>
          <p className="hiw-sub mb-8">It's free to list. No commissions. No hidden fees.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AuthCTA />
            <Link href="/listings" className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-8 py-3 rounded-xl transition-colors">
              Browse Listings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
