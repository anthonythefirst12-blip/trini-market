import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <svg width="28" height="28" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect width="34" height="34" rx="9" fill="url(#footerLogoGrad)" />
                <path d="M7 24V11l5.5 7 4.5-6 4.5 6 5.5-7v13" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <rect x="7" y="26" width="20" height="2" rx="1" fill="rgba(255,255,255,0.4)" />
                <defs>
                  <linearGradient id="footerLogoGrad" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="font-display font-bold text-white text-lg tracking-tight">Trini<span className="text-blue-400">Market</span></span>
            </div>
            <p className="text-sm leading-relaxed">
              Trinidad &amp; Tobago&apos;s trusted marketplace for buying and selling locally.
            </p>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Browse</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/businesses" className="hover:text-white transition-colors">Business Directory</Link></li>
              <li><Link href="/listings?category=Electronics" className="hover:text-white transition-colors">Electronics</Link></li>
              <li><Link href="/listings?category=Vehicles" className="hover:text-white transition-colors">Vehicles</Link></li>
              <li><Link href="/listings?category=Real Estate" className="hover:text-white transition-colors">Real Estate</Link></li>
              <li><Link href="/listings?category=Services" className="hover:text-white transition-colors">Services</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Sell</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/listings/new" className="hover:text-white transition-colors">Post a Listing</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/wallet" className="hover:text-white transition-colors">Wallet</Link></li>
              <li><Link href="/settings" className="hover:text-white transition-colors">Settings</Link></li>
              <li><Link href="/auth/signup" className="hover:text-white transition-colors">Create Account</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Help</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/auth/forgot-password" className="hover:text-white transition-colors">Reset Password</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 text-xs text-center">
          © {new Date().getFullYear()} TriniMarket. Built for Trinidad &amp; Tobago.
        </div>
      </div>
    </footer>
  );
}
