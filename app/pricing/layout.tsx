import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | TriniSell",
  description: "Listing is always free. Boost a listing for TT$15–$40 (one-time) or get a Business Storefront for TT$99/month.",
  openGraph: {
    title: "Pricing | TriniSell",
    description: "Listing is always free. Boost individual listings or get a full Business Storefront subscription.",
    type: "website",
  },
  alternates: { canonical: "https://trinisell.tt/pricing" },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
