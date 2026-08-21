export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { getBusinesses } from "@/lib/db";
import { Seller } from "@/lib/types";
import { BusinessContent } from "@/components/businesses/BusinessContent";
import { BadgeCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Business Storefronts | TriniSell",
  description: "Browse verified business storefronts in Trinidad & Tobago — car dealerships, real estate agencies, and professional services.",
  openGraph: {
    title: "Business Storefronts | TriniSell",
    description: "Browse verified business storefronts in Trinidad & Tobago.",
    type: "website",
  },
  alternates: { canonical: "https://trinisell.tt/businesses" },
};

export interface BusinessEntry {
  seller: Seller;
  categories: string[];
  listingCount: number;
}

export default async function BusinessesPage() {
  const businesses = await getBusinesses();

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#111111]">

      {/* Hero — slim, professional */}
      <div className="border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#111111]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-600 mb-3">Verified Storefronts</p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white leading-tight mb-3">
            Browse Business Storefronts
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-base max-w-xl leading-relaxed">
            Real estate firms, vehicle dealerships, and professional services — all verified, all in one place.
          </p>
        </div>
      </div>

      {/* Content */}
      <BusinessContent businesses={businesses} />

      {/* Slim CTA */}
      <div className="border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#1c1c1c]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-display font-bold text-gray-900 dark:text-white text-base">Ready to list your business?</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">TT$99/month · Verified badge · Unlimited listings</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/storefront/apply"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
            >
              <BadgeCheck className="w-4 h-4" strokeWidth={2} />
              Get a Storefront
            </Link>
            <Link
              href="/pricing?tab=storefront"
              className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              See pricing →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
