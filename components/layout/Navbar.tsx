"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase-browser";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationBell } from "@/components/layout/NotificationBell";
import type { User } from "@supabase/supabase-js";

export function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [unread, setUnread] = useState(0);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        supabase
          .from("messages")
          .select("id", { count: "exact", head: true })
          .eq("receiver_id", data.user.id)
          .eq("read", false)
          .then(({ count }) => setUnread(count ?? 0));
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setUnread(0);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const name = user?.user_metadata?.name?.split(" ")[0] ?? "Account";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded shrink-0">
            <div className="w-[34px] h-[34px] rounded-[9px] bg-red-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              <span className="text-gray-900">Trini</span><span className="text-red-600">Market</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-5">
            <Link href="/listings" className="text-sm text-gray-600 hover:text-red-700 transition-colors rounded px-1">Browse</Link>
            <Link href="/how-it-works" className="text-sm text-gray-600 hover:text-red-700 transition-colors rounded px-1">How It Works</Link>
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-red-700 transition-colors rounded px-1">Pricing</Link>
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />

            {user ? (
              <>
                {/* Messages */}
                <Link href="/messages" className="relative p-2 text-gray-500 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-100" aria-label="Messages">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </Link>

                {/* Notifications */}
                <NotificationBell />

                {/* User dropdown */}
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setUserMenuOpen((o) => !o)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {name}
                    <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-150 ${userMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                      <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-700 transition-colors">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" /></svg>
                        Dashboard
                      </Link>
                      <Link href="/wallet" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-700 transition-colors">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                        Wallet
                      </Link>
                      <Link href="/saved" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-700 transition-colors">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        Saved Listings
                      </Link>
                      <Link href="/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-700 transition-colors">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" /></svg>
                        Settings
                      </Link>
                      <div className="border-t border-gray-100 my-1" />
                      <button onClick={() => { handleLogout(); setUserMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Log out
                      </button>
                    </div>
                  )}
                </div>

                <Link href="/listings/new">
                  <Button size="sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Post a Listing
                  </Button>
                </Link>
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
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
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
      <div
        className={`md:hidden border-t border-gray-200 bg-white overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-4 py-4 space-y-0.5">
          {[
            { href: "/listings", label: "Browse", icon: "🔍" },
            { href: "/how-it-works", label: "How It Works", icon: "💡" },
            { href: "/pricing", label: "Pricing", icon: "💰" },
          ].map(({ href, label, icon }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 text-sm text-gray-700 py-2.5 px-2 rounded-lg hover:bg-gray-50 hover:text-red-700 transition-colors"
              onClick={() => setMenuOpen(false)}>
              <span>{icon}</span>{label}
            </Link>
          ))}

          {user && (
            <>
              <div className="border-t border-gray-100 my-2" />
              {[
                { href: "/dashboard", label: "Dashboard", icon: "📋" },
                { href: "/wallet", label: "Wallet", icon: "💳" },
                { href: "/saved", label: "Saved Listings", icon: "❤️" },
                { href: "/settings", label: "Settings", icon: "⚙️" },
              ].map(({ href, label, icon }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-3 text-sm text-gray-700 py-2.5 px-2 rounded-lg hover:bg-gray-50 hover:text-red-700 transition-colors"
                  onClick={() => setMenuOpen(false)}>
                  <span>{icon}</span>{label}
                </Link>
              ))}
              <Link href="/messages"
                className="flex items-center justify-between text-sm text-gray-700 py-2.5 px-2 rounded-lg hover:bg-gray-50 hover:text-red-700 transition-colors"
                onClick={() => setMenuOpen(false)}>
                <span className="flex items-center gap-3"><span>💬</span>Messages</span>
                {unread > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unread}</span>}
              </Link>
            </>
          )}

          <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-gray-100">
            {user ? (
              <>
                <Link href="/listings/new" onClick={() => setMenuOpen(false)}>
                  <Button fullWidth>+ Post a Listing</Button>
                </Link>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="text-sm text-red-600 py-2 text-center font-medium hover:text-red-700"
                >
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
      </div>
    </header>
  );
}
