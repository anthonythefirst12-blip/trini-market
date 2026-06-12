import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">TM</span>
              </div>
              <span className="font-display font-bold text-white text-lg">TriniMarket</span>
            </div>
            <p className="text-sm leading-relaxed">
              Trinidad &amp; Tobago&apos;s trusted marketplace for buying and selling locally.
            </p>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Browse</h4>
            <ul className="space-y-2 text-sm">
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
              <li><a href="#" className="hover:text-white transition-colors">Safety Tips</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
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
