import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | TriniMarket",
  description: "Read TriniMarket's Privacy Policy — how we collect, use, and protect your personal data.",
};

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. What We Collect",
      body: "When you create an account we collect your name, email address, and password (hashed). When you post a listing we collect the listing details you provide including title, description, price, location, images, and category. We also collect usage data such as pages visited, search terms, and listing views.",
    },
    {
      title: "2. How We Use Your Information",
      body: "We use your information to operate the marketplace, send transactional emails (account confirmation, password reset, listing confirmation), detect and prevent fraud, and improve the platform. We do not sell your personal data to third parties.",
    },
    {
      title: "3. Sharing of Information",
      body: "Your public listing information (title, price, location, images, category) is visible to all visitors. Your name appears on your public seller profile. Your email address is never displayed publicly. We share data with service providers strictly as necessary to operate the platform (e.g. Supabase for database hosting, Resend for email delivery, WiPay for payment processing).",
    },
    {
      title: "4. Cookies",
      body: "We use essential cookies to maintain your login session. We do not use advertising or tracking cookies. You can disable cookies in your browser settings but doing so will prevent you from logging in.",
    },
    {
      title: "5. Data Retention",
      body: "We retain your account data for as long as your account is active. If you delete your account, your personal data is deleted within 30 days. Listing data may be retained in anonymised form for analytical purposes.",
    },
    {
      title: "6. Security",
      body: "Your password is hashed and never stored in plain text. All data is transmitted over HTTPS. We use Supabase Row Level Security to ensure users can only access data they are authorised to access.",
    },
    {
      title: "7. Your Rights",
      body: "You have the right to access, correct, or delete the personal data we hold about you. To exercise these rights, contact us at support@trinimarket.tt. We will respond within 14 days.",
    },
    {
      title: "8. Children's Privacy",
      body: "TriniMarket is not directed at children under 18. We do not knowingly collect personal data from anyone under 18. If we learn that we have collected data from a child, we will delete it promptly.",
    },
    {
      title: "9. Changes to This Policy",
      body: "We may update this Privacy Policy from time to time. We will notify registered users of material changes via email. Continued use of the platform after changes constitutes acceptance of the revised policy.",
    },
    {
      title: "10. Contact",
      body: "For privacy-related questions or requests, please use our contact page or email support@trinimarket.tt.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="bg-gradient-to-br from-red-900 via-red-800 to-gray-900 py-14 px-4 text-center">
        <span className="inline-block bg-white/10 border border-white/20 text-white/80 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">Legal</span>
        <h1 className="font-display font-bold text-3xl text-white mb-2">Privacy Policy</h1>
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
          <Link href="/terms" className="hover:text-red-600 transition-colors">Terms of Service</Link>
          <span>·</span>
          <Link href="/contact" className="hover:text-red-600 transition-colors">Contact Us</Link>
          <span>·</span>
          <Link href="/" className="hover:text-red-600 transition-colors">← Back to TriniMarket</Link>
        </div>
      </div>
    </div>
  );
}
