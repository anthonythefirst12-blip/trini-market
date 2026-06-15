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
    neon: "neon-blue",
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
    neon: "neon-cyan",
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
    neon: "neon-purple",
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

const heroFloating = [
  { icon: "💰", top: "15%", left: "5%", anim: "animate-float", size: "text-4xl", delay: "0s" },
  { icon: "🏆", top: "20%", left: "88%", anim: "animate-float-slow", size: "text-5xl", delay: "0.8s" },
  { icon: "🚀", top: "70%", left: "3%", anim: "animate-float-reverse", size: "text-4xl", delay: "1.5s" },
  { icon: "⭐", top: "75%", left: "90%", anim: "animate-float", size: "text-3xl", delay: "0.4s" },
  { icon: "💎", top: "45%", left: "93%", anim: "animate-float-slow", size: "text-3xl", delay: "2s" },
  { icon: "📈", top: "50%", left: "1%", anim: "animate-float-reverse", size: "text-3xl", delay: "1.1s" },
];

export default function PricingPage() {
  return (
    <div className="bg-slate-900 min-h-screen">
      {/* Hero */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 50% 0%, #1e3a5f 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, #0f4c75 0%, transparent 50%)",
        }} />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle, #93c5fd 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }} />
        {/* Glow orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full animate-pulse-glow pointer-events-none" style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)",
          filter: "blur(40px)",
        }} />

        {/* Floating icons */}
        {heroFloating.map((item, i) => (
          <div
            key={i}
            className={`absolute ${item.anim} ${item.size} opacity-20 pointer-events-none select-none`}
            style={{ top: item.top, left: item.left, animationDelay: item.delay, filter: "drop-shadow(0 0 10px rgba(59,130,246,0.7))" }}
          >
            {item.icon}
          </div>
        ))}

        <div className="relative z-10">
          <span className="inline-block bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 border border-blue-500/30">
            Pricing
          </span>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
            Simple, honest pricing.
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Monthly subscriptions with no lock-in. Upgrade, downgrade, or cancel anytime — no questions asked.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap mt-6">
            {[
              { icon: "✅", text: "Cancel anytime" },
              { icon: "🔄", text: "No lock-in contract" },
              { icon: "💳", text: "Billed monthly" },
              { icon: "🔒", text: "No hidden fees" },
            ].map((p) => (
              <span key={p.text} className="inline-flex items-center gap-1.5 bg-slate-800/80 text-slate-300 text-xs font-medium px-3 py-1.5 rounded-full border border-slate-700">
                {p.icon} {p.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Tier cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div key={tier.name} className="relative">
              {/* Neon border glow */}
              <div className={`absolute -inset-0.5 rounded-2xl ${tier.neon} ${tier.highlight ? "opacity-70" : "opacity-30"}`} />
              <div className={`relative glass-dark rounded-2xl p-7 flex flex-col h-full ${tier.highlight ? "border border-cyan-500/30" : ""}`}>
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-cyan-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center gap-2">
                    <h2 className="font-display font-bold text-xl text-white">{tier.name}</h2>
                    {tier.subscription && (
                      <span className="text-xs font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                        Subscription
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="font-display font-bold text-3xl text-white">{tier.price}</span>
                    <span className="text-slate-400 text-sm">{tier.period}</span>
                  </div>
                  <p className="text-slate-400 text-sm mt-2">{tier.description}</p>
                  {tier.subscription && (
                    <p className="text-xs text-green-400 font-medium mt-1.5 flex items-center gap-1">
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
                        <svg className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <span className={`text-sm ${f.included ? "text-slate-200" : "text-slate-500"}`}>{f.text}</span>
                    </li>
                  ))}
                </ul>

                <Link href={tier.href}>
                  <Button fullWidth variant={tier.highlight ? "primary" : "secondary"} size="lg">
                    {tier.cta}
                  </Button>
                </Link>

                {tier.subscription && (
                  <p className="text-xs text-center text-slate-500 mt-3">
                    Billed monthly · Cancel before next billing date to stop charges
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Subscription explainer */}
        <div className="mt-10 glass-dark rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="text-3xl shrink-0">🔄</div>
          <div>
            <h3 className="font-display font-semibold text-white mb-1">How subscriptions work</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Featured and Premium are monthly subscriptions billed on the same date each month. Cancel anytime from your dashboard — your plan stays active until the end of the current billing period, then stops automatically. No penalties, no awkward calls.
            </p>
          </div>
        </div>
      </section>

      {/* Pro Account section */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 50%, #1d4ed8 100%)",
        }} />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle, #7dd3fc 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full animate-pulse-glow pointer-events-none" style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)",
          filter: "blur(50px)",
        }} />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4 border border-blue-500/30">
              For Businesses
            </span>
            <h2 className="font-display font-bold text-3xl text-white mb-3">Pro Account — TT$150/month</h2>
            <p className="text-slate-300 max-w-xl mx-auto">
              Everything in Premium, plus a full branded storefront, analytics, and a Verified Business badge. Cancel anytime.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {proFeatures.map((f) => (
              <div key={f.title} className="glass rounded-xl p-5 hover:-translate-y-1 transition-transform duration-200">
                <div className="text-2xl mb-2">{f.icon}</div>
                <h3 className="font-display font-semibold text-white text-sm mb-1">{f.title}</h3>
                <p className="text-slate-300 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/settings"
              className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold text-base px-8 py-3.5 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.35)] active:scale-95"
            >
              ⚡ Upgrade to Pro
            </Link>
            <p className="text-slate-400 text-xs mt-4">Monthly subscription · Cancel anytime from Settings</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="font-display font-bold text-2xl text-white mb-8 text-center">Frequently Asked Questions</h2>
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
            <details key={item.q} className="glass-dark rounded-xl group border border-slate-700">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-medium text-slate-200 text-sm list-none hover:text-white transition-colors">
                {item.q}
                <svg className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-4 text-sm text-slate-400 leading-relaxed">{item.a}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
