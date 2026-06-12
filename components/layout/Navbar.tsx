"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { conversations } from "@/lib/data";

const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TM</span>
            </div>
            <span className="font-display font-bold text-xl text-gray-900">
              TriniMarket
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/listings" className="text-sm text-gray-600 hover:text-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1">
              Browse
            </Link>
            <Link href="/listings?category=Services" className="text-sm text-gray-600 hover:text-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1">
              Services
            </Link>
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1">
              Pricing
            </Link>
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1">
              Dashboard
            </Link>
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Messages icon */}
            <Link
              href="/messages"
              className="relative p-2 text-gray-500 hover:text-blue-700 transition-colors rounded-lg hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label={`Messages${totalUnread > 0 ? ` (${totalUnread} unread)` : ""}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {totalUnread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-700 text-white text-xs rounded-full flex items-center justify-center font-bold leading-none">
                  {totalUnread}
                </span>
              )}
            </Link>

            {/* Wallet */}
            <Link
              href="/wallet"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              TT$95
            </Link>

            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/listings/new">
              <Button size="sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Post a Listing
              </Button>
            </Link>
          </div>

          {/* Mobile: messages + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/messages"
              className="relative p-2 text-gray-500 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Messages"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {totalUnread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-700 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {totalUnread}
                </span>
              )}
            </Link>
            <button
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
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
          <Link href="/listings?category=Services" className="block text-sm text-gray-700 py-2 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Services</Link>
          <Link href="/pricing" className="block text-sm text-gray-700 py-2 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Pricing</Link>
          <Link href="/dashboard" className="block text-sm text-gray-700 py-2 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          <Link href="/wallet" className="block text-sm text-gray-700 py-2 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Wallet — TT$95</Link>
          <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
            <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
              <Button variant="secondary" fullWidth>Log in</Button>
            </Link>
            <Link href="/listings/new" onClick={() => setMenuOpen(false)}>
              <Button fullWidth>Post a Listing</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
