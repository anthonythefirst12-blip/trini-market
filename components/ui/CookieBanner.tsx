"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie-consent")) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold mb-1">🍪 We use cookies</p>
          <p className="text-slate-400 text-xs leading-relaxed">
            We use cookies to improve your experience and analyse traffic. By clicking &quot;Accept&quot; you consent to our use of cookies.{" "}
            <Link href="/privacy" className="text-blue-400 hover:text-blue-300 underline">Privacy Policy</Link>
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={decline} className="px-4 py-2 text-xs font-semibold text-slate-300 border border-slate-600 hover:border-slate-400 rounded-lg transition-colors">
            Decline
          </button>
          <button onClick={accept} className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
