import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | TriniSell",
  description: "Get in touch with the TriniSell team. We're here to help with any questions about buying, selling, or your account.",
  alternates: { canonical: "https://trinisell.tt/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
