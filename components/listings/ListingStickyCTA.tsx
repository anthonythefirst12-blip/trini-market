"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";

interface Props {
  price: string;
  listingTitle: string;
  sold?: boolean;
  /** CSS selector for the element to observe — CTA shows once it scrolls out of view */
  watchSelector: string;
}

export function ListingStickyCTA({ price, listingTitle, sold, watchSelector }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = document.querySelector(watchSelector);
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-64px 0px 0px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [watchSelector]);

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ${visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"}`}>
      <div className="bg-white border-t border-gray-200 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-display font-bold text-lg text-red-700">{price}</p>
            <p className="text-xs text-gray-400 truncate">{listingTitle}</p>
          </div>
          {sold ? (
            <span className="shrink-0 px-6 py-2.5 bg-gray-100 text-gray-500 font-semibold text-sm rounded-xl">
              Sold
            </span>
          ) : (
            <Link
              href="/messages"
              className="shrink-0 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-colors active:scale-95"
            >
              Contact Seller
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
