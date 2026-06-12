"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function ViewToggle({ currentView }: { currentView: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setView = (view: "grid" | "list") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    router.push(`/listings?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
      <button
        onClick={() => setView("grid")}
        aria-label="Grid view"
        className={[
          "p-1.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          currentView === "grid" ? "bg-white text-blue-700 shadow-sm" : "text-gray-400 hover:text-gray-600",
        ].join(" ")}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>
      <button
        onClick={() => setView("list")}
        aria-label="List view"
        className={[
          "p-1.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          currentView === "list" ? "bg-white text-blue-700 shadow-sm" : "text-gray-400 hover:text-gray-600",
        ].join(" ")}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
}
