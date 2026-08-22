"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Listing } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { CardImageCarousel } from "./CardImageCarousel";
import { SaveButton } from "./SaveButton";
import { QuickViewModal } from "./QuickViewModal";

interface ListingCardProps {
  listing: Listing;
  view?: "grid" | "list";
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-TT", { month: "short", day: "numeric" });
}

const conditionVariant = {
  "New": "green",
  "Like New": "blue",
  "Good": "amber",
  "Fair": "gray",
} as const;

function TierBadge({ tier }: { tier: Listing["tier"] }) {
  if (tier === "premium") {
    return (
      <span className="inline-flex items-center gap-1 bg-red-700 text-white text-xs font-bold px-2 py-0.5 rounded">
        ★ Premium
      </span>
    );
  }
  if (tier === "featured") {
    return (
      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold px-2 py-0.5 rounded">
        ◆ Featured
      </span>
    );
  }
  return null;
}

function PriceDropBadge({ listing }: { listing: Listing }) {
  if (!listing.previous_price || listing.previous_price <= listing.price) return null;
  return (
    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 border border-green-200 text-xs font-bold px-2 py-0.5 rounded">
      ↓ Price Drop
    </span>
  );
}

function JustListedBadge({ createdAt }: { createdAt: string }) {
  const hoursOld = (Date.now() - new Date(createdAt).getTime()) / 1000 / 3600;
  if (hoursOld > 24) return null;
  return (
    <span className="inline-flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded animate-pulse">
      🔥 Just Listed
    </span>
  );
}

export function ListingCard({ listing, view = "grid" }: ListingCardProps) {
  const [quickView, setQuickView] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fromParam = pathname === "/listings" || pathname.startsWith("/listings?")
    ? encodeURIComponent(`${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`)
    : null;
  const detailHref = fromParam ? `/listings/${listing.id}?from=${fromParam}` : `/listings/${listing.id}`;

  const formatted = new Intl.NumberFormat("en-TT", {
    style: "currency",
    currency: listing.currency,
    minimumFractionDigits: 0,
  }).format(listing.price);

  const borderClass =
    listing.tier === "premium"
      ? "border-red-300"
      : listing.tier === "featured"
      ? "border-amber-200"
      : "border-gray-200";

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}/listings/${listing.id}`;
    if (navigator.share) {
      await navigator.share({ title: listing.title, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  if (view === "list") {
    return (
      <>
        <Link href={detailHref} className="group block">
          <article className={`flex gap-4 bg-white border ${borderClass} rounded-2xl p-4 shadow-sm card-hover focus-within:ring-2 focus-within:ring-red-400`}>
            <div className="relative shrink-0 w-36 h-28 rounded-lg overflow-hidden bg-gray-100">
              <CardImageCarousel images={listing.images} title={listing.title} sizes="144px" />
              {listing.sold && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">SOLD</span>
                </div>
              )}
            </div>
            <div className="flex flex-col justify-between flex-1 min-w-0">
              <div>
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-1 group-hover:text-red-700 transition-colors">
                    {listing.title}
                  </h3>
                  <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                    <JustListedBadge createdAt={listing.createdAt} />
                    <TierBadge tier={listing.tier} />
                    <Badge variant={conditionVariant[listing.condition]}>{listing.condition}</Badge>
                  </div>
                </div>
                <p className="text-gray-500 text-xs mt-1 line-clamp-2">{listing.description}</p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-red-700 text-base">{formatted}</span>
                  <PriceDropBadge listing={listing} />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.preventDefault(); setQuickView(true); }}
                    className="text-xs text-gray-400 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-red-50"
                  >
                    Quick view
                  </button>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    {(listing.commentCount ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {listing.commentCount}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {listing.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </Link>
        {quickView && <QuickViewModal listing={listing} onClose={() => setQuickView(false)} />}
      </>
    );
  }

  return (
    <>
      <div className="group block relative">
        <Link href={detailHref} className="block">
          <article className={`bg-white border ${borderClass} rounded-2xl overflow-hidden shadow-sm card-hover focus-within:ring-2 focus-within:ring-red-400`}>
            {/* Top accent strip — premium and featured only */}
            {(listing.tier === "premium" || listing.tier === "featured") && (
              <div className={`h-1 ${listing.tier === "premium" ? "bg-gradient-to-r from-red-700 via-red-500 to-red-400" : "bg-gradient-to-r from-amber-400 to-amber-300"}`} />
            )}
            <div className="relative h-48 bg-gray-100">
              <CardImageCarousel
                images={listing.images}
                title={listing.title}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {listing.sold && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-red-600 text-white text-sm font-bold px-4 py-1.5 rounded-full tracking-wide">SOLD</span>
                </div>
              )}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {!listing.sold && <JustListedBadge createdAt={listing.createdAt} />}
                <TierBadge tier={listing.tier} />
              </div>
              <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                <Badge variant={conditionVariant[listing.condition]}>{listing.condition}</Badge>
              </div>
              <SaveButton listingId={listing.id} />

              {/* Hover quick actions overlay */}
              {!listing.sold && (
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 p-2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => { e.preventDefault(); setQuickView(true); }}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full shadow transition-all hover:scale-105 active:scale-95" style={{ background: "rgba(255,255,255,0.92)", color: "#1f2937" }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Quick View
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-7 h-7 rounded-full flex items-center justify-center shadow transition-all hover:scale-105 active:scale-95" style={{ background: "rgba(255,255,255,0.92)", color: "#1f2937" }}
                    aria-label="Share listing"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-red-700 transition-colors">
                {listing.title}
              </h3>
              <div className="flex items-center justify-between mt-3">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-red-700 text-lg">{formatted}</span>
                  <PriceDropBadge listing={listing} />
                </div>
                {listing.negotiable && (
                  <span className="text-xs text-gray-400 italic">Negotiable</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">{listing.location}</span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500 truncate">{listing.seller.name}</span>
                <span className="text-xs text-gray-400 shrink-0 ml-2">{timeAgo(listing.createdAt)}</span>
              </div>
            </div>
          </article>
        </Link>
      </div>
      {quickView && <QuickViewModal listing={listing} onClose={() => setQuickView(false)} />}
    </>
  );
}
