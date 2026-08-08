"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/lib/types";

interface Props {
  listing: Listing;
  onClose: () => void;
}

export function QuickViewModal({ listing, onClose }: Props) {
  const formatted = new Intl.NumberFormat("en-TT", {
    style: "currency", currency: listing.currency, minimumFractionDigits: 0,
  }).format(listing.price);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in"
        style={{ animation: "quickViewIn 0.2s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative h-56 bg-gray-100">
          {listing.images[0] ? (
            <Image src={listing.images[0]} alt={listing.title} fill className="object-cover" sizes="512px" unoptimized />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
          )}
          {listing.images.length > 1 && (
            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
              +{listing.images.length - 1} photos
            </span>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {listing.sold && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white font-bold px-4 py-1.5 rounded-full">SOLD</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-red-600 font-semibold uppercase tracking-wide mb-1">{listing.category}</p>
              <h2 className="font-display font-bold text-lg text-gray-900 leading-snug">{listing.title}</h2>
            </div>
            <div className="text-right shrink-0">
              <div className="font-display font-bold text-2xl text-red-700">{formatted}</div>
              {listing.negotiable && <p className="text-xs text-gray-400 italic">Negotiable</p>}
            </div>
          </div>

          <p className="text-sm text-gray-500 line-clamp-3 mb-4">{listing.description}</p>

          <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {listing.location}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {listing.seller.name}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {listing.views ?? 0} views
            </span>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/listings/${listing.id}`}
              onClick={onClose}
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl text-center transition-colors"
            >
              View Full Listing →
            </Link>
            <Link
              href="/messages"
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-200 hover:border-red-300 text-gray-600 hover:text-red-600 text-sm font-semibold rounded-xl transition-colors"
            >
              Message
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
