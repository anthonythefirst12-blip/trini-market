import type { Metadata } from "next";
import Link from "next/link";
import { AuthCTA } from "@/components/ui/AuthCTA";

export const metadata: Metadata = {
  title: "How It Works | TriniSell",
  description: "Learn how to buy and sell on TriniSell — Trinidad & Tobago's local marketplace. Post a listing in minutes.",
};

const steps = {
  sell: [
    { n: "1", title: "Create a free account", desc: "Sign up with your email in under a minute. No credit card needed." },
    { n: "2", title: "Post your listing", desc: "Add photos, set your price, pick a category and location. It takes about 2 minutes." },
    { n: "3", title: "Get messages from buyers", desc: "Buyers contact you directly through TriniSell's built-in messaging." },
    { n: "4", title: "Meet and close the deal", desc: "Arrange to meet in a safe public place, hand over the item, and get paid." },
  ],
  buy: [
    { n: "1", title: "Browse or search", desc: "Search by keyword, filter by category, location, or price — find exactly what you need." },
    { n: "2", title: "View the listing", desc: "See photos, read the description, check the seller's rating and profile." },
    { n: "3", title: "Message the seller", desc: "Ask questions or make an offer directly through the platform. No sharing personal info needed." },
    { n: "4", title: "Meet and buy", desc: "Agree on a time and place, inspect the item, and pay. Stay safe — always meet in public." },
  ],
};

const tips = [
  { emoji: "📸", title: "Good photos sell faster", desc: "Use natural light and show the item from multiple angles. Listings with 3+ photos get more views." },
  { emoji: "💬", title: "Respond quickly", desc: "Buyers move on fast. Reply to messages within a few hours to close more deals." },
  { emoji: "🤝", title: "Meet in public", desc: "Always meet in a busy public place — a mall, police station car park, or busy road. Never invite strangers home." },
  { emoji: "🔒", title: "Never pay before you see it", desc: "Don't send money in advance for items. If a deal sounds too good to be true, it usually is." },
  { emoji: "⭐", title: "Build your reputation", desc: "Buyers trust sellers with good ratings. Be honest about condition, respond fast, and show up on time." },
  { emoji: "📍", title: "Be specific about location", desc: "Listing your area (e.g. Chaguanas, San Fernando, Tobago) helps local buyers find you." },
];

const categories = [
  { emoji: "🚗", label: "Vehicles" },
  { emoji: "🏠", label: "Real Estate" },
  { emoji: "📱", label: "Electronics" },
  { emoji: "👗", label: "Fashion" },
  { emoji: "🍽️", label: "Food & Beverage" },
  { emoji: "🔧", label: "Services" },
  { emoji: "🌿", label: "Home & Garden" },
  { emoji: "⚽", label: "Sports & Outdoors" },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-red-900 via-red-800 to-gray-900 py-20 px-4 text-center">
        <span className="inline-block bg-white/10 border border-white/20 text-white/80 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-5">How It Works</span>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
          Buy &amp; sell the easy way
        </h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
          TriniSell connects buyers and sellers across Trinidad &amp; Tobago. No fees to list, no commissions taken.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/listings/new" className="inline-flex items-center gap-2 bg-white text-red-700 font-semibold px-6 py-3 rounded-xl hover:bg-red-50 transition-colors">
            Post a Listing →
          </Link>
          <Link href="/listings" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors">
            Browse Listings
          </Link>
        </div>
      </section>

      {/* Selling steps */}
      <section className="py-16 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl text-gray-900 mb-2">Selling on TriniSell</h2>
            <p className="text-gray-500">List your item for free in minutes.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.sell.map((s) => (
              <div key={s.n} className="bg-white border border-gray-200 rounded-2xl p-6 relative">
                <div className="w-10 h-10 bg-red-600 text-white font-bold text-lg rounded-xl flex items-center justify-center mb-4">{s.n}</div>
                <h3 className="font-display font-semibold text-gray-900 text-base mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buying steps */}
      <section className="py-16 border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl text-gray-900 mb-2">Buying on TriniSell</h2>
            <p className="text-gray-500">Find great deals from sellers across T&T.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.buy.map((s) => (
              <div key={s.n} className="bg-[#FAFAFA] border border-gray-200 rounded-2xl p-6">
                <div className="w-10 h-10 bg-gray-900 text-white font-bold text-lg rounded-xl flex items-center justify-center mb-4">{s.n}</div>
                <h3 className="font-display font-semibold text-gray-900 text-base mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display font-bold text-3xl text-gray-900 mb-2">What can you buy &amp; sell?</h2>
          <p className="text-gray-500 mb-10">Everything from cars to clothes — all local, all T&T.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((c) => (
              <Link key={c.label} href={`/listings?category=${encodeURIComponent(c.label)}`}
                className="bg-white border border-gray-200 hover:border-red-400 rounded-2xl p-5 text-center transition-colors group">
                <div className="text-3xl mb-2">{c.emoji}</div>
                <p className="text-gray-700 text-sm font-medium group-hover:text-red-600 transition-colors">{c.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Safety tips */}
      <section className="py-16 border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl text-gray-900 mb-2">Tips for safe trading</h2>
            <p className="text-gray-500">Stay safe and close more deals.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tips.map((t) => (
              <div key={t.title} className="flex gap-4 bg-[#FAFAFA] border border-gray-200 rounded-2xl p-5">
                <div className="text-2xl shrink-0">{t.emoji}</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">{t.title}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display font-bold text-3xl text-gray-900 mb-3">Ready to get started?</h2>
          <p className="text-gray-500 mb-8">It's free to list. No commissions. No hidden fees.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AuthCTA />
            <Link href="/listings" className="inline-flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold px-8 py-3 rounded-xl transition-colors">
              Browse Listings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
