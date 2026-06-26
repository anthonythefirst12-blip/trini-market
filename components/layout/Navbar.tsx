"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

export function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">
            {/* Creative TM monogram — T crossbar forms the roof of M */}
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="36" height="36" rx="9" fill="url(#tmGrad)" />
              {/* T crossbar — spans full width, doubles as top of M */}
              <rect x="6" y="9" width="24" height="3" rx="1.5" fill="white" />
              {/* T vertical stem */}
              <rect x="16.5" y="9" width="3" height="9" rx="1" fill="white" />
              {/* M left leg */}
              <rect x="6" y="12" width="3" height="15" rx="1" fill="white" />
              {/* M right leg */}
              <rect x="27" y="12" width="3" height="15" rx="1" fill="white" />
              {/* M center-left diagonal */}
              <path d="M9 12 L18 21" stroke="white" strokeWidth="3" strokeLinecap="round" />
              {/* M center-right diagonal */}
              <path d="M27 12 L18 21" stroke="white" strokeWidth="3" strokeLinecap="round" />
              {/* T&T flag red dot accent */}
              <circle cx="29" cy="8" r="3" fill="#CE1126" />
              <defs>
                <linearGradient id="tmGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1e40af" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
            </svg>
            <span className="font-display font-bold text-xl text-gray-900 tracking-tight">
              Trini<span className="text-blue-600">Market</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/listings" className="text-sm text-gray-600 hover:text-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1">Browse</Link>
            <Link href="/businesses" className="text-sm text-gray-600 hover:text-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1">Businesses</Link>
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1">Pricing</Link>
            {user && (
              <Link href="/dashboard" className="text-sm text-gray-600 hover:text-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1">Dashboard</Link>
            )}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/saved" className="relative p-2 text-gray-500 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-100" aria-label="Saved listings">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </Link>
                <Link href="/messages" className="relative p-2 text-gray-500 hover:text-blue-700 transition-colors rounded-lg hover:bg-gray-100" aria-label="Messages">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </Link>

                <Link href="/dashboard" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {user.user_metadata?.name?.split(" ")[0] ?? "Account"}
                </Link>

                <Link href="/listings/new">
                  <Button size="sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Post a Listing
                  </Button>
                </Link>

                <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-600 transition-colors px-2">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Sign up free</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-3">
          <Link href="/listings" className="block text-sm text-gray-700 py-2 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Browse</Link>
          <Link href="/businesses" className="block text-sm text-gray-700 py-2 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Businesses</Link>
          <Link href="/pricing" className="block text-sm text-gray-700 py-2 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Pricing</Link>
          {user && (
            <>
              <Link href="/dashboard" className="block text-sm text-gray-700 py-2 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link href="/saved" className="block text-sm text-gray-700 py-2 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Saved Listings</Link>
              <Link href="/messages" className="block text-sm text-gray-700 py-2 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Messages</Link>
            </>
          )}
          <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
            {user ? (
              <>
                <Link href="/listings/new" onClick={() => setMenuOpen(false)}>
                  <Button fullWidth>Post a Listing</Button>
                </Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-sm text-red-600 py-2 text-left">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="secondary" fullWidth>Log in</Button>
                </Link>
                <Link href="/auth/signup" onClick={() => setMenuOpen(false)}>
                  <Button fullWidth>Sign up free</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
