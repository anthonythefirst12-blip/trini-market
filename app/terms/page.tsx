import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | TriniMarket",
  description: "Read TriniMarket's Terms of Service — the rules and guidelines for buying and selling on Trinidad & Tobago's local marketplace.",
};

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      body: "By accessing or using TriniMarket you agree to be bound by these Terms of Service and all applicable laws. If you do not agree, do not use the platform.",
    },
    {
      title: "2. Who Can Use TriniMarket",
      body: "You must be at least 18 years old or have the consent of a parent or legal guardian to use this platform. By creating an account you confirm you meet this requirement.",
    },
    {
      title: "3. Listings & Content",
      body: "You are solely responsible for listings and content you post. You must not post illegal items, stolen goods, counterfeit products, or anything that violates Trinidad & Tobago law. TriniMarket reserves the right to remove any listing at any time without notice.",
    },
    {
      title: "4. Transactions",
      body: "TriniMarket is a marketplace platform and is not a party to any transaction between buyers and sellers. We do not guarantee the quality, safety, or legality of items listed. Always meet in a safe public place and inspect items before payment.",
    },
    {
      title: "5. Prohibited Conduct",
      body: "You may not: use the platform to spam or harass other users; create multiple accounts to evade bans; scrape or crawl the platform; attempt to gain unauthorised access to any system; or post misleading, fraudulent, or deceptive listings.",
    },
    {
      title: "6. Subscriptions & Payments",
      body: "Featured and Premium plans are billed monthly via WiPay. You may cancel at any time from your Dashboard. Cancellation takes effect at the end of the current billing period. Refunds are not provided for partially used billing periods.",
    },
    {
      title: "7. Intellectual Property",
      body: "All content, design, and code on TriniMarket is owned by TriniMarket or its licensors. You may not reproduce or distribute any part of the platform without prior written consent.",
    },
    {
      title: "8. Limitation of Liability",
      body: 'TriniMarket is provided "as is" without warranties of any kind. We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform or any transaction conducted through it.',
    },
    {
      title: "9. Changes to These Terms",
      body: "We may update these Terms at any time. Continued use of the platform after changes constitutes acceptance of the revised Terms. We will notify registered users of material changes via email.",
    },
    {
      title: "10. Governing Law",
      body: "These Terms are governed by the laws of the Republic of Trinidad & Tobago. Any disputes shall be resolved in the courts of Trinidad & Tobago.",
    },
    {
      title: "11. Contact",
      body: "For questions about these Terms, please use our contact page.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="bg-gradient-to-br from-red-900 via-red-800 to-gray-900 py-14 px-4 text-center">
        <span className="inline-block bg-white/10 border border-white/20 text-white/80 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">Legal</span>
        <h1 className="font-display font-bold text-3xl text-white mb-2">Terms of Service</h1>
        <p className="text-white/60 text-sm">Last updated: July 2026</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.title} className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="font-display font-semibold text-gray-900 text-base mb-2">{s.title}</h2>
              <p className="text-gray-500 text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex items-center gap-4 flex-wrap text-sm text-gray-400">
          <Link href="/privacy" className="hover:text-red-600 transition-colors">Privacy Policy</Link>
          <span>·</span>
          <Link href="/contact" className="hover:text-red-600 transition-colors">Contact Us</Link>
          <span>·</span>
          <Link href="/" className="hover:text-red-600 transition-colors">← Back to TriniMarket</Link>
        </div>
      </div>
    </div>
  );
}
