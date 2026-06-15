"use client";

import { useState } from "react";
import { FilterSidebar } from "./FilterSidebar";
import { Category } from "@/lib/types";

interface Props {
  categories: Category[];
  locations: string[];
  activeCategory?: string;
  activeLocation?: string;
  activeCondition?: string;
  activeSort?: string;
  minPrice?: string;
  maxPrice?: string;
  q?: string;
}

export function MobileFilterDrawer(props: Props) {
  const [open, setOpen] = useState(false);

  const activeCount = [props.activeCategory, props.activeLocation, props.activeCondition, props.activeSort, props.minPrice, props.maxPrice].filter(Boolean).length;

  return (
    <>
      {/* Trigger button — visible only on mobile */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700 border border-slate-600 text-slate-200 text-sm font-medium hover:bg-slate-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm3 6a1 1 0 011-1h10a1 1 0 010 2H7a1 1 0 01-1-1zm3 6a1 1 0 011-1h4a1 1 0 010 2h-4a1 1 0 01-1-1z" />
        </svg>
        Filters
        {activeCount > 0 && (
          <span className="bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={[
        "fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-transform duration-300 ease-out",
        open ? "translate-y-0" : "translate-y-full",
      ].join(" ")}>
        <div className="bg-slate-800 rounded-t-2xl border-t border-slate-700 max-h-[85vh] overflow-y-auto">
          {/* Handle */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700 sticky top-0 bg-slate-800 z-10">
            <h2 className="font-display font-bold text-white text-base">Filters</h2>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-5">
            <FilterSidebar {...props} />
          </div>
        </div>
      </div>
    </>
  );
}
