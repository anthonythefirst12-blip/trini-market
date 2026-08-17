export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { getBusinesses } from "@/lib/db";
import { PageHero } from "@/components/ui/PageHero";
import { BadgeCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Business Directory | TriniSell",
  description: "Browse verified businesses in Trinidad & Tobago — car dealerships, real estate agencies, retailers and more. Find trusted local businesses on TriniSell.",
  openGraph: {
    title: "Business Directory | TriniSell",
    description: "Browse verified businesses in Trinidad & Tobago — car dealerships, real estate agencies, retailers and more.",
    type: "website",
  },
  twitter: { card: "summary", title: "Business Directory | TriniSell", description: "Find trusted local businesses in Trinidad & Tobago." },
  alternates: { canonical: "https://trinisell.tt/businesses" },
};
import { Seller } from "@/lib/types";
import { BusinessContent } from "@/components/businesses/BusinessContent";

export interface BusinessEntry {
  seller: Seller;
  categories: string[];
  listingCount: number;
}

export default async function BusinessDirectoryPage() {
  const businesses = await getBusinesses();

  return (
    <div className="biz-page min-h-screen">
      <style>{`
        .biz-page { background: #fafafa; }
        .biz-section { background: #ffffff; border-color: #e5e7eb; }
        .biz-section-alt { background: #fafafa; border-color: #e5e7eb; }
        .biz-heading { color: #111827; }
        .biz-sub { color: #6b7280; }
        .biz-stat-value { color: #111827; }
        .biz-stat-label { color: #9ca3af; }
        .biz-cta-section { background: #ffffff; border-color: #e5e7eb; }
        .biz-cta-secondary { border-color: #e5e7eb; color: #374151; }
        .biz-cta-secondary:hover { background: #f9fafb; border-color: #d1d5db; }

        [data-theme="dark"] .biz-page { background: #111111; }
        [data-theme="dark"] .biz-section { background: #1c1c1c; border-color: #2a2a2a; }
        [data-theme="dark"] .biz-section-alt { background: #111111; border-color: #2a2a2a; }
        [data-theme="dark"] .biz-heading { color: #f9fafb; }
        [data-theme="dark"] .biz-sub { color: rgba(255,255,255,0.4); }
        [data-theme="dark"] .biz-stat-value { color: #f9fafb; }
        [data-theme="dark"] .biz-stat-label { color: rgba(255,255,255,0.35); }
        [data-theme="dark"] .biz-cta-section { background: #1c1c1c; border-color: #2a2a2a; }
        [data-theme="dark"] .biz-cta-secondary { border-color: #2a2a2a; color: #d1d5db; }
        [data-theme="dark"] .biz-cta-secondary:hover { background: #222222; border-color: #333333; }

        @media (prefers-color-scheme: dark) {
          :root:not([data-theme="light"]) .biz-page { background: #111111; }
          :root:not([data-theme="light"]) .biz-section { background: #1c1c1c; border-color: #2a2a2a; }
          :root:not([data-theme="light"]) .biz-section-alt { background: #111111; border-color: #2a2a2a; }
          :root:not([data-theme="light"]) .biz-heading { color: #f9fafb; }
          :root:not([data-theme="light"]) .biz-sub { color: rgba(255,255,255,0.4); }
          :root:not([data-theme="light"]) .biz-stat-value { color: #f9fafb; }
          :root:not([data-theme="light"]) .biz-stat-label { color: rgba(255,255,255,0.35); }
          :root:not([data-theme="light"]) .biz-cta-section { background: #1c1c1c; border-color: #2a2a2a; }
          :root:not([data-theme="light"]) .biz-cta-secondary { border-color: #2a2a2a; color: #d1d5db; }
          :root:not([data-theme="light"]) .biz-cta-secondary:hover { background: #222222; border-color: #333333; }
        }
      `}</style>

      <PageHero
        eyebrow="Business Directory"
        title="Trusted Businesses in T&T"
        subtitle="Find established real estate firms, authorised dealerships, and top-tier service companies — all verified and operating across Trinidad & Tobago."
      >
        <div className="flex items-center justify-center gap-10 flex-wrap">
          {[
            { value: businesses.length, label: "Verified Businesses" },
            { value: "3", label: "Industries" },
            { value: "100%", label: "Pro Verified" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="biz-stat-value font-display font-bold text-3xl">{s.value}</p>
              <p className="biz-stat-label text-sm mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </PageHero>

      {/* Category filter + business cards */}
      <BusinessContent businesses={businesses} />

      {/* Join CTA */}
      <section className="biz-cta-section border-t py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="biz-heading font-display font-bold text-2xl mb-3">
            Is your business listed here?
          </h2>
          <p className="biz-sub mb-8">
            Upgrade to a Pro account to appear in the Business Directory, get a Verified Business badge, and reach serious buyers across T&T.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/settings"
              className="inline-flex items-center gap-2 bg-red-600 text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-red-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              <BadgeCheck className="w-4 h-4" strokeWidth={2} />
              Get Verified
            </Link>
            <Link
              href="/pricing"
              className="biz-cta-secondary inline-flex items-center gap-2 border font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
