import Link from "next/link";
import Image from "next/image";
import { Listing } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

interface ListingCardProps {
  listing: Listing;
  view?: "grid" | "list";
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
      <span className="inline-flex items-center gap-1 bg-blue-700 text-white text-xs font-bold px-2 py-0.5 rounded">
        ★ Premium
      </span>
    );
  }
  if (tier === "featured") {
    return (
      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 border border-blue-300 text-xs font-semibold px-2 py-0.5 rounded">
        ◆ Featured
      </span>
    );
  }
  return null;
}

export function ListingCard({ listing, view = "grid" }: ListingCardProps) {
  const formatted = new Intl.NumberFormat("en-TT", {
    style: "currency",
    currency: listing.currency,
    minimumFractionDigits: 0,
  }).format(listing.price);

  const borderClass =
    listing.tier === "premium"
      ? "border-blue-400 shadow-blue-100"
      : listing.tier === "featured"
      ? "border-blue-200"
      : "border-gray-200";

  if (view === "list") {
    return (
      <Link href={`/listings/${listing.id}`} className="group block">
        <article className={`flex gap-4 bg-white border ${borderClass} rounded-xl p-4 hover:shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-500`}>
          <div className="relative shrink-0 w-36 h-28 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="144px"
            />
          </div>
          <div className="flex flex-col justify-between flex-1 min-w-0">
            <div>
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-1 group-hover:text-blue-700 transition-colors">
                  {listing.title}
                </h3>
                <div className="flex items-center gap-1.5 shrink-0">
                  <TierBadge tier={listing.tier} />
                  <Badge variant={conditionVariant[listing.condition]}>{listing.condition}</Badge>
                </div>
              </div>
              <p className="text-gray-500 text-xs mt-1 line-clamp-2">{listing.description}</p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="font-bold text-blue-700 text-base">{formatted}</span>
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
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/listings/${listing.id}`} className="group block">
      <article className={`bg-white border-2 ${borderClass} rounded-xl overflow-hidden hover:shadow-md transition-all focus-within:ring-2 focus-within:ring-blue-500`}>
        {/* Top accent strip */}
        <div className={`h-1 ${listing.tier === "premium" ? "bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400" : listing.tier === "featured" ? "bg-gradient-to-r from-blue-400 to-blue-200" : "bg-gradient-to-r from-gray-200 to-gray-100"}`} />
        <div className="relative h-48 bg-gray-100">
          <Image
            src={listing.images[0]}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <TierBadge tier={listing.tier} />
          </div>
          <div className="absolute top-2 right-2">
            <Badge variant={conditionVariant[listing.condition]}>{listing.condition}</Badge>
          </div>
        </div>
        <div className="p-4">
          <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">
            {listing.category}
          </span>
          <h3 className="font-semibold text-gray-900 mt-0.5 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">
            {listing.title}
          </h3>
          <div className="flex items-center justify-between mt-3">
            <span className="font-bold text-blue-700 text-lg">{formatted}</span>
            {listing.negotiable && (
              <span className="text-xs text-gray-400 italic">Negotiable</span>
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {listing.location}
            </span>
            {(listing.commentCount ?? 0) > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {listing.commentCount}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
