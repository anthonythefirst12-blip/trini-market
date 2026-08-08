"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#FAFAFA] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="font-display font-bold text-[100px] leading-none text-red-200 select-none mb-2">!</div>
        <h1 className="font-display font-bold text-2xl text-gray-900 mb-3">Something went wrong</h1>
        <p className="text-gray-500 text-sm mb-8">
          An unexpected error occurred. Try refreshing the page or head back home.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors active:scale-95"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-gray-200 bg-white text-gray-700 font-semibold text-sm px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
