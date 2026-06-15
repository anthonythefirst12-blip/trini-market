import Link from "next/link";

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
      body: "TriniMarket is provided \"as is\" without warranties of any kind. We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform or any transaction conducted through it.",
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
      body: "For questions about these Terms, contact us at support@trinimarket.tt.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="relative border-b border-slate-700 py-14 px-4 text-center overflow-hidden">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 0%, #1e3a5f 0%, transparent 65%)",
        }} />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        <div className="relative z-10">
          <span className="inline-block bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-blue-500/30">Legal</span>
          <h1 className="font-display font-bold text-3xl text-white mb-2">Terms of Service</h1>
          <p className="text-slate-400 text-sm">Last updated: June 2026</p>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="font-display font-semibold text-white text-base mb-2">{s.title}</h2>
              <p className="text-slate-400 text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-700 flex items-center gap-4 flex-wrap text-sm text-slate-500">
          <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
          <span>·</span>
          <Link href="/" className="hover:text-slate-300 transition-colors">← Back to TriniMarket</Link>
        </div>
      </div>
    </div>
  );
}
