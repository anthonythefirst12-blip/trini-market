import Link from "next/link";

function MarketBoothLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="34" height="34" rx="9" fill="#7f1d1d" />
      <path d="M5 14 L17 8 L29 14 Z" fill="#ef4444" />
      <path d="M5 14 Q8 17 11 14 Q14 17 17 14 Q20 17 23 14 Q26 17 29 14" stroke="#fca5a5" strokeWidth="1" fill="none" />
      <rect x="8" y="14" width="18" height="12" rx="1" fill="#991b1b" />
      <rect x="6" y="24" width="22" height="2.5" rx="1" fill="#ef4444" />
      <rect x="11" y="16.5" width="12" height="7" rx="1" fill="#fecaca" opacity="0.2" />
      <text x="17" y="23" textAnchor="middle" fontSize="5" fontWeight="bold" fill="white" fontFamily="sans-serif">TM</text>
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <MarketBoothLogo />
              <span className="font-display font-bold text-lg tracking-tight">
                <span className="text-white">Trini</span><span className="text-red-500">Market</span>
              </span>
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
        <div className="border-t border-gray-800 mt-10 pt-6 text-xs text-center space-y-1">
          <p>© {new Date().getFullYear()} TriniMarket. Built for Trinidad &amp; Tobago.</p>
          <p><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></p>
        </div>
      </div>
    </footer>
  );
}
