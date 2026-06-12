import Link from "next/link";
import { Button } from "@/components/ui/Button";

const tiers = [
  {
    name: "Free",
    price: "TT$0",
    period: "forever",
    description: "Get started selling with no upfront cost.",
    color: "gray",
    features: [
      { text: "1 active listing at a time", included: true },
      { text: "Standard search placement", included: true },
      { text: "Basic listing details", included: true },
      { text: "Contact form for buyers", included: true },
      { text: "Featured badge & border", included: false },
      { text: "Homepage carousel placement", included: false },
      { text: "Top-of-search placement", included: false },
      { text: "Premium badge & ribbon", included: false },
      { text: "Extended image gallery (5 photos)", included: false },
      { text: "\"Premium Picks\" section", included: false },
    ],
    cta: "Get Started Free",
    href: "/auth/signup",
    highlight: false,
  },
  {
    name: "Featured",
    price: "TT$15",
    period: "per week",
    description: "Stand out in search results and reach more buyers.",
    color: "blue",
    badge: "Most Popular",
    features: [
      { text: "Unlimited active listings", included: true },
      { text: "Standard search placement", included: true },
      { text: "Basic listing details", included: true },
      { text: "Contact form for buyers", included: true },
      { text: "Featured badge & border", included: true },
      { text: "Homepage carousel placement", included: true },
      { text: "Top-of-search placement", included: false },
      { text: "Premium badge & ribbon", included: false },
      { text: "Extended image gallery (5 photos)", included: false },
      { text: "\"Premium Picks\" section", included: false },
    ],
    cta: "Boost a Listing",
    href: "/wallet",
    highlight: true,
  },
  {
    name: "Premium",
    price: "TT$40",
    period: "per week",
    description: "Maximum visibility for serious sellers and businesses.",
    color: "blue",
    features: [
      { text: "Unlimited active listings", included: true },
      { text: "Standard search placement", included: true },
      { text: "Basic listing details", included: true },
      { text: "Contact form for buyers", included: true },
      { text: "Featured badge & border", included: true },
      { text: "Homepage carousel placement", included: true },
      { text: "Top-of-search placement", included: true },
      { text: "Premium badge & ribbon", included: true },
      { text: "Extended image gallery (5 photos)", included: true },
      { text: "\"Premium Picks\" section", included: true },
    ],
    cta: "Go Premium",
    href: "/wallet",
    highlight: false,
  },
];

const proFeatures = [
  { icon: "🏪", title: "Branded Storefront", desc: "Your own page at /store/yourname with logo, banner, and all listings." },
  { icon: "✅", title: "Verified Business Badge", desc: "Build trust instantly with a badge that sets you apart." },
  { icon: "∞", title: "Unlimited Listings", desc: "No cap on how many items or services you can post." },
  { icon: "⭐", title: "Priority Support", desc: "Get help faster with dedicated seller support." },
  { icon: "📊", title: "Analytics Dashboard", desc: "See views, clicks, and inquiry rates per listing." },
  { icon: "🔗", title: "Custom Store URL", desc: "Share a single link to your full storefront." },
];

export default function PricingPage() {
  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Hero */}
      <section className="bg-white border-b border-gray-200 py-16 px-4 text-center">
        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
          Pricing
        </span>
        <h1 className="font-display font-bold text-4xl text-gray-900 mb-3">
          Pay less. Sell more.
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          TriniMarket listings start at just <strong className="text-blue-700">TT$15/week</strong> — a fraction of what other T&T platforms charge. No hidden fees, no lock-in.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-2 rounded-full">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Up to 60% cheaper than Pin.tt boosts
        </div>
      </section>

      {/* Tier cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={[
                "bg-white rounded-2xl border-2 p-7 flex flex-col relative",
                tier.highlight
                  ? "border-blue-500 shadow-lg shadow-blue-100"
                  : "border-gray-200",
              ].join(" ")}
            >
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-700 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className="font-display font-bold text-xl text-gray-900">{tier.name}</h2>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="font-display font-bold text-3xl text-blue-700">{tier.price}</span>
                  <span className="text-gray-400 text-sm">/{tier.period}</span>
                </div>
                <p className="text-gray-500 text-sm mt-2">{tier.description}</p>
              </div>

              <ul className="space-y-2.5 flex-1 mb-7">
                {tier.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2.5">
                    {f.included ? (
                      <svg className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    <span className={`text-sm ${f.included ? "text-gray-700" : "text-gray-400"}`}>{f.text}</span>
                  </li>
                ))}
              </ul>

              <Link href={tier.href}>
                <Button
                  fullWidth
                  variant={tier.highlight ? "primary" : "secondary"}
                  size="lg"
                >
                  {tier.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Credits are deducted weekly per listing. Cancel or downgrade anytime. No subscription required.
        </p>
      </section>

      {/* Pro Account section */}
      <section className="bg-blue-700 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block bg-blue-600 text-blue-100 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              For Businesses
            </span>
            <h2 className="font-display font-bold text-3xl text-white mb-3">Pro Account — TT$150/month</h2>
            <p className="text-blue-200 max-w-xl mx-auto">
              Everything in Premium, plus a full branded storefront, analytics, and a Verified Business badge. Built for shops, agencies, and serious sellers.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {proFeatures.map((f) => (
              <div key={f.title} className="bg-blue-800/50 rounded-xl p-5 border border-blue-600">
                <div className="text-2xl mb-2">{f.icon}</div>
                <h3 className="font-display font-semibold text-white text-sm mb-1">{f.title}</h3>
                <p className="text-blue-200 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/settings">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 focus-visible:ring-white">
                Upgrade to Pro
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ / comparison callout */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="font-display font-bold text-2xl text-gray-900 mb-8 text-center">Why TriniMarket?</h2>
        <div className="space-y-4">
          {[
            {
              q: "How does this compare to Pin.tt?",
              a: "Pin.tt charges significantly more for boosted listings and offers no transparent pricing. TriniMarket's Featured tier starts at TT$15/week with clear, predictable costs and more prominent placement.",
            },
            {
              q: "Do credits expire?",
              a: "No. Credits you top up stay in your wallet until you use them. There's no expiry and no monthly subscription required.",
            },
            {
              q: "Can I cancel a boost mid-week?",
              a: "Yes. You can downgrade or cancel a listing's tier at any time. Unused days are refunded to your wallet as credits.",
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept Visa, Mastercard, and local bank transfers. Linx and WiPay integration coming soon.",
            },
          ].map((item) => (
            <details key={item.q} className="bg-white border border-gray-200 rounded-xl group">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-gray-900 text-sm list-none">
                {item.q}
                <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">{item.a}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
