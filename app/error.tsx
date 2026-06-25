"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="font-display font-bold text-2xl text-white mb-3">Something went wrong</h1>
        <p className="text-slate-400 text-sm mb-8">An unexpected error occurred. Please try again or return to the homepage.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-colors">
            Try Again
          </button>
          <Link href="/" className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold text-sm rounded-xl transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
