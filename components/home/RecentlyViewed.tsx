"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface RecentItem {
  id: string;
  title: string;
  price: number;
  currency: string;
  image: string;
  category: string;
}

const KEY = "trini_recently_viewed";

export function RecentlyViewed() {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    try {
      const stored: RecentItem[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      setItems(stored);
    } catch {}
  }, []);

  if (items.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display font-bold text-xl text-gray-900">Continue Browsing</h2>
        <button
          onClick={() => { localStorage.removeItem(KEY); setItems([]); }}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Clear
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory">
        {items.map((item) => {
          const formatted = new Intl.NumberFormat("en-TT", {
            style: "currency", currency: item.currency, minimumFractionDigits: 0,
          }).format(item.price);
          return (
            <Link
              key={item.id}
              href={`/listings/${item.id}`}
              className="group flex-none w-36 snap-start"
            >
              <div className="relative w-36 h-28 rounded-xl overflow-hidden bg-gray-100 mb-2">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="144px"
                  unoptimized={item.image.startsWith("blob:")}
                />
              </div>
              <p className="text-xs font-semibold text-gray-800 truncate group-hover:text-red-600 transition-colors">{item.title}</p>
              <p className="text-xs text-red-600 font-bold mt-0.5">{formatted}</p>
              <p className="text-xs text-gray-400">{item.category}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
