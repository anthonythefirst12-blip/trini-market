export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getListing, getListings, getComments } from "@/lib/db";
import { ImageGallery } from "@/components/listings/ImageGallery";
import { ContactForm } from "@/components/listings/ContactForm";
import { CommentsSection } from "@/components/listings/CommentsSection";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ListingCard } from "@/components/listings/ListingCard";
import { ShareButton } from "@/components/listings/ShareButton";
import { ViewCounter } from "@/components/listings/ViewCounter";
import Link from "next/link";
import Image from "next/image";

interface Props {
  params: Promise<{ id: string }>;
}

const conditionVariant = {
  "New": "green",
  "Like New": "blue",
  "Good": "amber",
  "Fair": "gray",
} as const;

function TierBadge({ tier }: { tier: string }) {
  if (tier === "premium") {
    return <span className="inline-flex items-center gap-1 bg-blue-700 text-white text-xs font-bold px-2.5 py-1 rounded">★ Premium</span>;
  }
  if (tier === "featured") {
    return <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 border border-blue-300 text-xs font-semibold px-2.5 py-1 rounded">◆ Featured</span>;
  }
  return null;
}

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) notFound();

  const [allListings, listingComments] = await Promise.all([
    getListings({ category: listing.category }),
    getComments(id),
  ]);
  const related = allListings.filter((l) => l.id !== listing.id).slice(0, 3);

  const formatted = new Intl.NumberFormat("en-TT", {
    style: "currency",
    currency: listing.currency,
    minimumFractionDigits: 0,
  }).format(listing.price);

  const isPremium = listing.tier === "premium";

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/listings" className="hover:text-blue-600 transition-colors">Listings</Link>
          <span>/</span>
          <Link href={`/listings?category=${listing.category}`} className="hover:text-blue-600 transition-colors">{listing.category}</Link>
          <span>/</span>
          <span className="text-gray-600 truncate max-w-[200px]">{listing.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <ImageGallery images={listing.images} title={listing.title} />

            {/* Details */}
            <div className={`bg-white rounded-xl border-2 ${isPremium ? "border-blue-400" : "border-gray-200"} p-6`}>
              {isPremium && <div className="h-1 -mx-6 -mt-6 mb-5 rounded-t-xl bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400" />}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-xs text-blue-600 font-semibold uppercase tracking-wide">{listing.category}</span>
                    <TierBadge tier={listing.tier} />
                    <Badge variant={conditionVariant[listing.condition]}>{listing.condition}</Badge>
                  </div>
                  <h1 className="font-display font-bold text-2xl text-gray-900">{listing.title}</h1>
                </div>
                <div className="text-right">
                  <div className="font-display font-bold text-3xl text-blue-700">{formatted}</div>
                  {listing.negotiable && <span className="text-xs text-gray-400 italic">Price negotiable</span>}
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {listing.location}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Posted {new Date(listing.createdAt).toLocaleDateString("en-TT", { year: "numeric", month: "short", day: "numeric" })}
                </span>
                {(listing.commentCount ?? 0) > 0 && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {listing.commentCount} comments
                  </span>
                )}
                <ViewCounter listingId={listing.id} initialViews={listing.views ?? 0} />
              </div>

              <hr className="my-5 border-gray-100" />

              <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
                <h2 className="font-display font-semibold text-base text-gray-900">Description</h2>
                <ShareButton title={listing.title} />
              </div>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{listing.description}</p>

              {listing.tags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {listing.tags.map((tag) => (
                    <span key={tag} className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1">#{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Comments */}
            <CommentsSection listingId={id} initialComments={listingComments} />
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Price + CTA (mobile) */}
            <div className="lg:hidden bg-white rounded-xl border border-gray-200 p-5">
              <div className="font-display font-bold text-2xl text-blue-700 mb-3">{formatted}</div>
              <div className="flex gap-2">
                <Button fullWidth size="lg">Contact Seller</Button>
                <Link href="/messages">
                  <Button variant="secondary" size="lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Seller card */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-display font-semibold text-sm text-gray-900 uppercase tracking-wide mb-4">Seller</h3>
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0">
                  <Image src={listing.seller.avatar} alt={listing.seller.name} fill className="object-cover" sizes="48px" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-sm text-gray-900">{listing.seller.name}</span>
                    {listing.seller.verified && (
                      <svg className="w-4 h-4 text-blue-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    {listing.seller.isPro && (
                      <span className="text-xs bg-blue-700 text-white font-bold px-1.5 py-0.5 rounded">PRO</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-amber-400 text-xs">{"★".repeat(Math.round(listing.seller.rating))}</span>
                    <span className="text-xs text-gray-400">{listing.seller.rating} ({listing.seller.reviewCount})</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">Since {new Date(listing.seller.joinedDate).getFullYear()}</div>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <Link href="/messages">
                  <Button variant="secondary" fullWidth>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Message Seller
                  </Button>
                </Link>
                {listing.seller.isPro && (
                  <Link href={`/store/${listing.seller.id}`}>
                    <Button variant="ghost" fullWidth size="sm">View Storefront →</Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Contact form */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-display font-semibold text-sm text-gray-900 uppercase tracking-wide mb-4">
                Send a Message
              </h3>
              <ContactForm listingId={listing.id} listingTitle={listing.title} price={formatted} />
            </div>

            {/* Boost this listing (own listing) */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-blue-800 mb-1">Is this your listing?</p>
              <p className="text-xs text-blue-600 mb-3">
                {listing.tier === "free"
                  ? "Boost it to Featured (TT$150/mo) or Premium (TT$350/mo) for more visibility."
                  : listing.tier === "featured"
                  ? "Upgrade to Premium (TT$350/mo) for top placement and a bigger badge."
                  : "Your listing is at Premium — top of the market! ✨"}
              </p>
              {listing.tier !== "premium" && (
                <Link href="/wallet">
                  <Button size="sm" fullWidth>
                    ⚡ Boost This Listing
                  </Button>
                </Link>
              )}
            </div>

            {/* Safety tip */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <span className="text-amber-500 text-base mt-0.5">⚠️</span>
                <div>
                  <p className="text-xs font-semibold text-amber-800 mb-1">Safety Tip</p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Meet in a safe public place. Never send money before seeing the item.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related listings */}
        {related.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display font-bold text-xl text-gray-900">More in {listing.category}</h2>
                <p className="text-sm text-gray-400 mt-0.5">Similar listings you might like</p>
              </div>
              <Link href={`/listings?category=${encodeURIComponent(listing.category)}`} className="text-sm text-blue-700 hover:text-blue-800 font-medium transition-colors">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
