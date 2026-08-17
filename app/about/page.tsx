import type { Metadata } from "next";
import Link from "next/link";
import { AuthCTA } from "@/components/ui/AuthCTA";
import { PageHero } from "@/components/ui/PageHero";
import { Shield, Zap, CreditCard, Flag, Laptop, Car, Home, Shirt, UtensilsCrossed, Wrench, Sofa, Bike } from "lucide-react";

export const metadata: Metadata = {
  title: "About TriniSell | Trinidad & Tobago's Local Marketplace",
  description: "TriniSell is Trinidad & Tobago's premier online marketplace — buy and sell vehicles, electronics, real estate, services and more, locally.",
};

const pillars = [
  { Icon: Flag, label: "Built for T&T", desc: "Designed specifically for Trinidad & Tobago — not a foreign template." },
  { Icon: Shield, label: "Safe & Secure", desc: "Verified sellers, secure messaging, and local moderation." },
  { Icon: Zap, label: "Fast & Simple", desc: "Post a listing in under 2 minutes, no credit card needed." },
  { Icon: CreditCard, label: "Local Payments", desc: "Pay with your TT bank card via WiPay, including Linx." },
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

export default function AboutPage() {
  return (
    <div className="about-page min-h-screen">
      <style>{`
        .about-page { background: #fafafa; }
        .about-section { background: #ffffff; border-color: #e5e7eb; }
        .about-section-alt { background: #fafafa; border-color: #e5e7eb; }
        .about-heading { color: #111827; }
        .about-body { color: #4b5563; }
        .about-sub { color: #6b7280; }
        .about-card { background: #ffffff; border-color: #e5e7eb; }
        .about-pillar-icon { color: #dc2626; background: rgba(220,38,38,0.07); }
        .about-cat-card { background: #ffffff; border-color: #e5e7eb; }
        .about-cat-card:hover { border-color: #dc2626; }
        .about-cat-icon { color: #9ca3af; }
        .about-cat-card:hover .about-cat-icon { color: #dc2626; }
        .about-cat-label { color: #374151; }

        [data-theme="dark"] .about-page { background: #111111; }
        [data-theme="dark"] .about-section { background: #1c1c1c; border-color: #2a2a2a; }
        [data-theme="dark"] .about-section-alt { background: #111111; border-color: #2a2a2a; }
        [data-theme="dark"] .about-heading { color: #f9fafb; }
        [data-theme="dark"] .about-body { color: #9ca3af; }
        [data-theme="dark"] .about-sub { color: rgba(255,255,255,0.35); }
        [data-theme="dark"] .about-card { background: #1c1c1c; border-color: #2a2a2a; }
        [data-theme="dark"] .about-pillar-icon { color: #fca5a5; background: rgba(220,38,38,0.15); }
        [data-theme="dark"] .about-cat-card { background: #1c1c1c; border-color: #2a2a2a; }
        [data-theme="dark"] .about-cat-label { color: #d1d5db; }

        @media (prefers-color-scheme: dark) {
          :root:not([data-theme="light"]) .about-page { background: #111111; }
          :root:not([data-theme="light"]) .about-section { background: #1c1c1c; border-color: #2a2a2a; }
          :root:not([data-theme="light"]) .about-section-alt { background: #111111; border-color: #2a2a2a; }
          :root:not([data-theme="light"]) .about-heading { color: #f9fafb; }
          :root:not([data-theme="light"]) .about-body { color: #9ca3af; }
          :root:not([data-theme="light"]) .about-sub { color: rgba(255,255,255,0.35); }
          :root:not([data-theme="light"]) .about-card { background: #1c1c1c; border-color: #2a2a2a; }
          :root:not([data-theme="light"]) .about-pillar-icon { color: #fca5a5; background: rgba(220,38,38,0.15); }
          :root:not([data-theme="light"]) .about-cat-card { background: #1c1c1c; border-color: #2a2a2a; }
          :root:not([data-theme="light"]) .about-cat-label { color: #d1d5db; }
        }
      `}</style>

      <PageHero
        eyebrow="About Us"
        title="Trinidad & Tobago's Local Marketplace"
        subtitle="TriniSell was built to make buying and selling locally easier, safer, and more connected for everyone across T&T."
      />

      {/* Mission */}
      <section className="about-section border-b py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-red-600 text-xs font-bold uppercase tracking-widest mb-3">Our Mission</p>
              <h2 className="about-heading font-display font-bold text-2xl mb-4">Built for Trinbagonians</h2>
              <p className="about-body leading-relaxed mb-4">
                We believe every Trinbagonian should have a safe, modern, and simple way to buy and sell — whether it's a car in San Fernando, a phone in Arima, or a house in Tobago.
              </p>
              <p className="about-sub leading-relaxed text-sm">
                TriniSell connects buyers and sellers across the twin islands with real-time messaging, verified listings, and secure local payments through WiPay.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {pillars.map((item) => (
                <div key={item.label} className="about-card border rounded-xl p-4 hover:border-red-200 transition-colors">
                  <div className="about-pillar-icon w-9 h-9 rounded-xl flex items-center justify-center mb-3">
                    <item.Icon className="w-4 h-4" strokeWidth={2} />
                  </div>
                  <p className="about-heading text-sm font-semibold mb-1">{item.label}</p>
                  <p className="about-sub text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="about-section-alt border-b py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="about-heading font-display font-bold text-2xl mb-2">What You Can Buy &amp; Sell</h2>
          <p className="about-sub mb-10 text-sm">From daily essentials to big-ticket items — we cover it all.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link key={cat.label} href={`/listings?category=${encodeURIComponent(cat.label)}`}
                className="about-cat-card border rounded-2xl p-5 text-center transition-all group">
                <cat.Icon className="about-cat-icon w-7 h-7 mx-auto mb-3 transition-colors" strokeWidth={1.5} />
                <p className="about-cat-label text-sm font-medium transition-colors">{cat.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-section py-20">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="about-heading font-display font-bold text-2xl mb-3">Ready to get started?</h2>
          <p className="about-sub mb-8 text-sm">Join thousands of Trinbagonians buying and selling every day.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AuthCTA />
            <Link href="/listings" className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors">
              Browse Listings →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
