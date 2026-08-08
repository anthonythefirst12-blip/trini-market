import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About TriniMarket | Trinidad & Tobago's Local Marketplace",
  description: "TriniMarket is Trinidad & Tobago's premier online marketplace — buy and sell vehicles, electronics, real estate, services and more, locally.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-red-900 via-red-800 to-gray-900">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block bg-white/10 border border-white/20 text-white/80 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-5">About Us</span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-5">
            Trinidad &amp; Tobago&apos;s<br /><span className="text-red-300">Local Marketplace</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            TriniMarket was built to make buying and selling locally easier, safer, and more connected for everyone across T&amp;T.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display font-bold text-2xl text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We believe every Trinbagonian should have a safe, modern, and simple way to buy and sell — whether it&apos;s a car in San Fernando, a phone in Arima, or a house in Tobago.
              </p>
              <p className="text-gray-500 leading-relaxed">
                TriniMarket connects buyers and sellers across the twin islands with real-time messaging, verified listings, and secure local payments through WiPay.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { emoji: "🇹🇹", label: "Built for T&T", desc: "Designed specifically for Trinidad & Tobago" },
                { emoji: "🔒", label: "Safe & Secure", desc: "Verified sellers and secure messaging" },
                { emoji: "⚡", label: "Fast & Simple", desc: "Post a listing in under 2 minutes" },
                { emoji: "💳", label: "Local Payments", desc: "Pay with your TT bank card via WiPay" },
              ].map((item) => (
                <div key={item.label} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-red-200 transition-colors">
                  <div className="text-2xl mb-2">{item.emoji}</div>
                  <p className="text-gray-900 text-sm font-semibold mb-1">{item.label}</p>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display font-bold text-2xl text-gray-900 mb-3">What You Can Buy &amp; Sell</h2>
          <p className="text-gray-500 mb-10">From daily essentials to big-ticket items — we cover it all.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { emoji: "🚗", label: "Vehicles" },
              { emoji: "🏠", label: "Real Estate" },
              { emoji: "📱", label: "Electronics" },
              { emoji: "👗", label: "Fashion" },
              { emoji: "🍽️", label: "Food & Beverage" },
              { emoji: "🔧", label: "Services" },
              { emoji: "🌿", label: "Home & Garden" },
              { emoji: "⚽", label: "Sports & Outdoors" },
            ].map((cat) => (
              <Link key={cat.label} href={`/listings?category=${encodeURIComponent(cat.label)}`}
                className="bg-white border border-gray-200 hover:border-red-400 rounded-xl p-5 text-center transition-colors group">
                <div className="text-3xl mb-2">{cat.emoji}</div>
                <p className="text-gray-700 text-sm font-medium group-hover:text-red-600 transition-colors">{cat.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display font-bold text-2xl text-gray-900 mb-3">Ready to get started?</h2>
          <p className="text-gray-500 mb-8">Join thousands of Trinbagonians buying and selling every day.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/listings"
              className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Browse Listings →
            </Link>
            <Link href="/auth/signup"
              className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
