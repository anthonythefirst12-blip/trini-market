export const dynamic = "force-dynamic";

import Link from "next/link";
import { getBusinesses } from "@/lib/db";
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
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Hero */}
      <section className="relative bg-gray-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, #93C5FD 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-gray-900/60" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-block bg-blue-700/30 border border-blue-500/40 text-blue-300 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-5">
            Business Directory
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4 leading-tight">
            Trusted Businesses.<br />
            <span className="text-blue-400">Verified. Professional.</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Find established real estate firms, authorised dealerships, and top-tier service companies — all verified and operating across Trinidad &amp; Tobago.
          </p>

          <div className="flex items-center justify-center gap-10 mt-10 flex-wrap">
            {[
              { value: businesses.length, label: "Verified Businesses" },
              { value: "3", label: "Industries" },
              { value: "100%", label: "Pro Verified" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display font-bold text-3xl text-white">{s.value}</p>
                <p className="text-gray-400 text-sm mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category filter + business cards */}
      <BusinessContent businesses={businesses} />

      {/* Join CTA */}
      <section className="bg-white border-t border-gray-200 py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display font-bold text-2xl text-gray-900 mb-3">
            Is your business listed here?
          </h2>
          <p className="text-gray-500 mb-6">
            Upgrade to a Pro account to appear in the Business Directory, get a Verified Business badge, and reach serious buyers across T&T.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/settings"
              className="inline-flex items-center gap-2 bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Get Verified
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 font-semibold text-sm px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
