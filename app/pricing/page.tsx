import Link from "next/link";
import { Button } from "@/components/ui/Button";

const tiers = [
  {
    name: "Free",
    price: "TT$0",
    period: "forever",
    description: "Get started selling with no upfront cost.",
    subscription: false,
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
    badge: null,
  },
  {
    name: "Featured",
    price: "TT$150",
    period: "/ month",
    description: "Stand out in search results and reach more buyers.",
    subscription: true,
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
    cta: "Subscribe — TT$150/mo",
    href: "/wallet",
    highlight: true,
  },
  {
    name: "Premium",
    price: "TT$350",
    period: "/ month",
    description: "Maximum visibility for serious sellers and businesses.",
    subscription: true,
    badge: null,
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
    cta: "Subscribe — TT$350/mo",
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
          Simple, honest pricing.
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Monthly subscriptions with no lock-in. Upgrade, downgrade, or cancel anytime — no questions asked.
        </p>

        {/* Trust pills */}
        <div className="flex items-center justify-center gap-3 flex-wrap mt-6">
          {[
            { icon: "✅", text: "Cancel anytime" },
            { icon: "🔄", text: "No lock-in contract" },
            { icon: "💳", text: "Billed monthly" },
            { icon: "🔒", text: "No hidden fees" },
          ].map((p) => (
            <span key={p.text} className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full">
              {p.icon} {p.text}
            </span>
          ))}
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
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-bold text-xl text-gray-900">{tier.name}</h2>
                  {tier.subscription && (
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                      Subscription
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="font-display font-bold text-3xl text-blue-700">{tier.price}</span>
                  <span className="text-gray-400 text-sm">{tier.period}</span>
                </div>
                <p className="text-gray-500 text-sm mt-2">{tier.description}</p>
                {tier.subscription && (
                  <p className="text-xs text-green-600 font-medium mt-1.5 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Cancel anytime, no penalty
                  </p>
                )}
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

              {tier.subscription && (
                <p className="text-xs text-center text-gray-400 mt-3">
                  Billed monthly · Cancel before next billing date to stop charges
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Subscription explainer strip */}
        <div className="mt-10 bg-white rounded-2xl border border-gray-200 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="text-3xl shrink-0">🔄</div>
          <div>
            <h3 className="font-display font-semibold text-gray-900 mb-1">How subscriptions work</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Featured and Premium are monthly subscriptions billed on the same date each month. You can cancel at any time from your dashboard — your plan stays active until the end of the current billing period, then stops automatically. No penalties, no awkward calls.
            </p>
          </div>
        </div>
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
              Everything in Premium, plus a full branded storefront, analytics, and a Verified Business badge. Cancel anytime.
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
            <p className="text-blue-300 text-xs mt-3">Monthly subscription · Cancel anytime from Settings</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="font-display font-bold text-2xl text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "How do I cancel my subscription?",
              a: "Go to Dashboard → Subscriptions and click \"Cancel Plan\". Your plan remains active until the end of the current billing period. You won't be charged again after that.",
            },
            {
              q: "What happens to my listings if I cancel?",
              a: "Your listings stay live until the end of your paid period. After that they revert to Free tier placement — they won't be deleted.",
            },
            {
              q: "Can I switch between Featured and Premium?",
              a: "Yes. You can upgrade or downgrade at any time. Upgrades take effect immediately; downgrades take effect at the next billing date.",
            },
            {
              q: "How does TriniMarket's pricing compare to other local platforms?",
              a: "Many local platforms charge high rates with little transparency. TriniMarket's Featured tier starts at TT$150/month with clear, predictable costs and prominent placement across the site.",
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept Visa, Mastercard, and local bank transfers. Linx and WiPay integration coming soon.",
            },
          ].map((item) => (
            <details key={item.q} className="bg-white border border-gray-200 rounded-xl group">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-gray-900 text-sm list-none">
                {item.q}
                <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
