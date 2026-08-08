"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie-consent")) setVisible(true);
  }, []);

  const accept = () => { localStorage.setItem("cookie-consent", "accepted"); setVisible(false); };
  const decline = () => { localStorage.setItem("cookie-consent", "declined"); setVisible(false); };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto rounded-2xl shadow-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4" style={{ background: "rgba(20,0,0,0.92)", border: "1px solid rgba(185,28,28,0.35)", backdropFilter: "blur(16px)" }}>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold mb-1">🍪 We use cookies</p>
          <p className="text-red-200/60 text-xs leading-relaxed">
            We use cookies to improve your experience and analyse traffic. By clicking &quot;Accept&quot; you consent to our use of cookies.{" "}
            <Link href="/privacy" className="text-red-400 hover:text-red-300 underline">Privacy Policy</Link>
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={decline} className="px-4 py-2 text-xs font-semibold text-red-200/70 rounded-lg transition-colors hover:text-white" style={{ border: "1px solid rgba(185,28,28,0.4)" }}>
            Decline
          </button>
          <button onClick={accept} className="px-4 py-2 text-xs font-semibold bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors hover:shadow-[0_0_16px_rgba(220,38,38,0.4)]">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
