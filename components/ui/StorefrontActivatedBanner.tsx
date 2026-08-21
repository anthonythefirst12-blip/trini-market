"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle, X } from "lucide-react";
import { useState } from "react";

export function StorefrontActivatedBanner() {
  const searchParams = useSearchParams();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || searchParams.get("storefront") !== "activated") return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div className="flex items-center gap-3 bg-green-600 text-white rounded-2xl px-5 py-3.5 shadow-xl">
        <CheckCircle size={20} strokeWidth={1.5} className="shrink-0" />
        <div className="flex-1">
          <p className="font-semibold text-sm">Business Storefront activated!</p>
          <p className="text-xs text-green-100 mt-0.5">Your verified badge and storefront are now live.</p>
        </div>
        <button onClick={() => setDismissed(true)} className="text-green-200 hover:text-white transition-colors">
          <X size={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
