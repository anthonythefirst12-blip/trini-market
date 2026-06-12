"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const [isPro, setIsPro] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgraded, setUpgraded] = useState(false);

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account and preferences.</p>
        </div>

        {/* Profile section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-display font-semibold text-base text-gray-900">Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
              <input defaultValue="Marcus Phillip" className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input defaultValue="marcus.phillip@email.com" className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input defaultValue="+1 868 xxx-xxxx" className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input defaultValue="Port of Spain" className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <Button size="sm">Save Changes</Button>
        </div>

        {/* Pro Account */}
        <div className={`rounded-2xl border-2 p-6 ${isPro || upgraded ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-white"}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-display font-semibold text-base text-gray-900">Pro Account</h2>
                {(isPro || upgraded) && (
                  <span className="bg-blue-700 text-white text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Active
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-3">
                Get a branded storefront, Verified Business badge, unlimited listings, and analytics for <strong className="text-gray-700">TT$150/month</strong>.
              </p>
              <ul className="space-y-1.5 mb-4">
                {[
                  "Branded storefront at /store/your-name",
                  "Verified Business badge on all listings",
                  "Unlimited active listings",
                  "Priority support & analytics",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-blue-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              {!isPro && !upgraded ? (
                showUpgrade ? (
                  <div className="bg-white border border-blue-200 rounded-xl p-4 space-y-3">
                    <p className="text-sm font-medium text-gray-800">Confirm upgrade to Pro — TT$150/month</p>
                    <p className="text-xs text-gray-400">UI demo only — no real charge.</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => { setUpgraded(true); setShowUpgrade(false); setIsPro(true); }}
                      >
                        Confirm Upgrade
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setShowUpgrade(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => setShowUpgrade(true)}>Upgrade to Pro</Button>
                )
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/store/s1">
                    <Button variant="secondary" size="sm">View My Storefront</Button>
                  </Link>
                  <button
                    onClick={() => { setIsPro(false); setUpgraded(false); }}
                    className="text-xs text-red-500 hover:text-red-700 transition-colors"
                  >
                    Cancel Pro
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Business details (shown when pro) */}
        {(isPro || upgraded) && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="font-display font-semibold text-base text-gray-900">Business Profile</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business name</label>
              <input placeholder="e.g. Marcus Auto Sales" className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio / About</label>
              <textarea rows={3} placeholder="Tell buyers about your business…" className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store banner image URL</label>
              <input placeholder="https://..." className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <Button size="sm">Save Business Profile</Button>
          </div>
        )}

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-display font-semibold text-base text-gray-900 mb-4">Notifications</h2>
          <div className="space-y-3">
            {[
              { label: "New message received", defaultOn: true },
              { label: "Listing inquiry", defaultOn: true },
              { label: "Listing expiring soon", defaultOn: true },
              { label: "Promotions and tips", defaultOn: false },
            ].map((n) => (
              <label key={n.label} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-700">{n.label}</span>
                <input
                  type="checkbox"
                  defaultChecked={n.defaultOn}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl border border-red-200 p-6">
          <h2 className="font-display font-semibold text-base text-red-600 mb-3">Danger Zone</h2>
          <p className="text-sm text-gray-500 mb-4">Permanently delete your account and all listings. This cannot be undone.</p>
          <Button variant="danger" size="sm">Delete Account</Button>
        </div>
      </div>
    </div>
  );
}
