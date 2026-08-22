export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getListing, getListings, getComments, getSellerResponseRate, getSellerListings } from "@/lib/db";
import { createClient } from "@/lib/supabase-server";
import { ImageGallery } from "@/components/listings/ImageGallery";
import { ContactForm } from "@/components/listings/ContactForm";
import { CommentsSection } from "@/components/listings/CommentsSection";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ListingCard } from "@/components/listings/ListingCard";
import { SimilarListings } from "@/components/listings/SimilarListings";
import { ShareButton } from "@/components/listings/ShareButton";
import { ViewCounter } from "@/components/listings/ViewCounter";
import { RatingForm } from "@/components/listings/RatingForm";
import { ReportButton } from "@/components/listings/ReportButton";
import { WhatsAppButton } from "@/components/listings/WhatsAppButton";
import { MakeOfferButton } from "@/components/listings/MakeOfferButton";
import { ViewTracker } from "@/components/listings/ViewTracker";
import { SellerPresence } from "@/components/listings/SellerPresence";
import { ListingStickyCTA } from "@/components/listings/ListingStickyCTA";
import Link from "next/link";
import Image from "next/image";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) return {};
  const formatted = new Intl.NumberFormat("en-TT", {
    style: "currency", currency: listing.currency, minimumFractionDigits: 0,
  }).format(listing.price);
  const desc = `${formatted} · ${listing.condition} · ${listing.location} — ${listing.description.slice(0, 120)}`;
  return {
    title: listing.title,
    description: desc,
    openGraph: {
      title: listing.title,
      description: desc,
      images: listing.images[0] ? [{ url: listing.images[0], width: 800, height: 600 }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: listing.title,
      description: desc,
      images: listing.images[0] ? [listing.images[0]] : [],
    },
    alternates: { canonical: `https://trinisell.tt/listings/${id}` },
  };
}

const conditionVariant = {
  "New": "green",
  "Like New": "blue",
  "Good": "amber",
  "Fair": "gray",
} as const;

function TierBadge({ tier }: { tier: string }) {
  if (tier === "premium") {
    return <span className="inline-flex items-center gap-1 bg-red-700 text-white text-xs font-bold px-2.5 py-1 rounded">★ Premium</span>;
  }
  if (tier === "featured") {
    return <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 border border-red-300 text-xs font-semibold px-2.5 py-1 rounded">◆ Featured</span>;
  }
  return null;
}

export default async function ListingDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { from } = await searchParams;
  const listing = await getListing(id);
  if (!listing) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = !!user && user.id === listing.seller.id;

  const [allListings, listingComments, responseRate, sellerListings] = await Promise.all([
    getListings({ category: listing.category }),
    getComments(id),
    getSellerResponseRate(listing.seller.id),
    getSellerListings(listing.seller.id),
  ]);
  const related = allListings.filter((l) => l.id !== listing.id).slice(0, 8);
  const moreFromSeller = sellerListings.filter((l) => l.id !== listing.id && !l.sold).slice(0, 4);

  const formatted = new Intl.NumberFormat("en-TT", {
    style: "currency",
    currency: listing.currency,
    minimumFractionDigits: 0,
  }).format(listing.price);

  const isPremium = listing.tier === "premium";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    description: listing.description,
    image: listing.images,
    offers: {
      "@type": "Offer",
      price: listing.price,
      priceCurrency: listing.currency,
      availability: listing.sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      seller: { "@type": "Person", name: listing.seller.name },
    },
    ...(listing.seller.reviewCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: listing.seller.rating,
        reviewCount: listing.seller.reviewCount,
      },
    }),
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ListingStickyCTA
        price={formatted}
        listingTitle={listing.title}
        sold={listing.sold}
        watchSelector="#listing-price-heading"
      />
      <ViewTracker
        id={listing.id}
        title={listing.title}
        price={listing.price}
        currency={listing.currency}
        image={listing.images[0] ?? ""}
        category={listing.category}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
          {from && (
            <>
              <Link href={from} className="hover:text-red-600 transition-colors flex items-center gap-1">
                ← Back to results
              </Link>
              <span>/</span>
            </>
          )}
          {!from && <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>}
          {!from && <span>/</span>}
          <Link href="/listings" className="hover:text-red-600 transition-colors">Listings</Link>
          <span>/</span>
          <Link href={`/listings?category=${listing.category}`} className="hover:text-red-600 transition-colors">{listing.category}</Link>
          <span>/</span>
          <span className="text-gray-600 truncate max-w-[200px]">{listing.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <ImageGallery images={listing.images} title={listing.title} />

            {/* Details */}
            <div className={`bg-white rounded-xl border-2 ${isPremium ? "border-red-400" : "border-gray-200"} p-6`}>
              {isPremium && <div className="h-1 -mx-6 -mt-6 mb-5 rounded-t-xl bg-gradient-to-r from-red-700 via-red-500 to-red-400" />}
              {listing.sold && (
                <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-4 py-2.5 rounded-xl">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  This item has been sold and is no longer available.
                </div>
              )}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-xs text-red-600 font-semibold uppercase tracking-wide">{listing.category}</span>
                    <TierBadge tier={listing.tier} />
                    <Badge variant={conditionVariant[listing.condition]}>{listing.condition}</Badge>
                    {listing.sold && <span className="text-xs font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">SOLD</span>}
                  </div>
                  <h1 className="font-display font-bold text-2xl text-gray-900">{listing.title}</h1>
                </div>
                <div className="text-right">
                  <div id="listing-price-heading" className="font-display font-bold text-3xl text-red-700">{formatted}</div>
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
                <div className="flex items-center gap-2 flex-wrap">
                  <ShareButton title={listing.title} />
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Check out this listing on TriniSell: ${listing.title} — https://trinisell.tt/listings/${listing.id}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.563 4.14 1.537 5.875L.057 23.25l5.578-1.453A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.793 9.793 0 01-5.013-1.378l-.36-.214-3.312.862.883-3.218-.234-.372A9.793 9.793 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                    </svg>
                    Share on WhatsApp
                  </a>
                  <ReportButton listingId={listing.id} />
                </div>
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

            {/* Location */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-display font-semibold text-sm text-gray-900 uppercase tracking-wide">Location</h2>
                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(listing.location + ", Trinidad and Tobago")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  View on Google Maps →
                </a>
              </div>
              <div className="p-5 flex items-center gap-4">
                {/* Static T&T map placeholder */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400 to-teal-500 flex items-center justify-center text-2xl shrink-0 shadow-sm">
                  🗺️
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{listing.location}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Trinidad &amp; Tobago</p>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    Always meet in a safe public place. Never send money in advance.
                  </p>
                </div>
              </div>
            </div>

            {/* Comments */}
            <CommentsSection listingId={id} initialComments={listingComments} />
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Price + CTA (mobile) */}
            <div className="lg:hidden bg-white rounded-xl border border-gray-200 p-5">
              <div className="font-display font-bold text-2xl text-red-700 mb-3">{formatted}</div>
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
                      <svg className="w-4 h-4 text-red-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    {listing.seller.isPro && (
                      <span className="text-xs bg-red-700 text-white font-bold px-1.5 py-0.5 rounded">PRO</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-amber-400 text-xs">{"★".repeat(Math.round(listing.seller.rating))}</span>
                    <span className="text-xs text-gray-400">{listing.seller.rating} ({listing.seller.reviewCount})</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">Since {new Date(listing.seller.joinedDate).getFullYear()}</div>
                  <SellerPresence sellerId={listing.seller.id} />
                  {responseRate !== null && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className={`text-xs font-semibold ${responseRate >= 80 ? "text-green-600" : responseRate >= 50 ? "text-amber-600" : "text-gray-400"}`}>
                        {responseRate}% response rate
                      </span>
                    </div>
                  )}
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
                {listing.seller.phone && (
                  <WhatsAppButton
                    phone={listing.seller.phone}
                    listingTitle={listing.title}
                    price={formatted}
                  />
                )}
                {!isOwner && !listing.sold && listing.negotiable && (
                  <MakeOfferButton
                    listingId={listing.id}
                    sellerId={listing.seller.id}
                    listingTitle={listing.title}
                    listingImage={listing.images[0] ?? undefined}
                    askingPrice={listing.price}
                    currency={listing.currency}
                  />
                )}
                <Link href={`/profile/${listing.seller.id}`}>
                  <Button variant="ghost" fullWidth size="sm">
                    {listing.seller.isPro ? "View Storefront →" : "View All Listings →"}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Contact form — hidden when sold */}
            {listing.sold ? (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
                <p className="text-gray-500 text-sm font-medium">This item has been sold.</p>
                <p className="text-gray-400 text-xs mt-1">Check out similar listings below.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-display font-semibold text-sm text-gray-900 uppercase tracking-wide mb-4">
                  Send a Message
                </h3>
                <ContactForm
                  listingId={listing.id}
                  listingTitle={listing.title}
                  price={formatted}
                  sellerId={listing.seller.id}
                  listingImage={listing.images[0]}
                />
              </div>
            )}

            {/* Boost this listing (own listing only) */}
            {isOwner && <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-amber-800 mb-1">Your listing</p>
              <p className="text-xs text-gray-600 mb-3">
                Boost it for TT$15–$40 (one-time) to push it to the top of search results and the homepage.
              </p>
              <Link href="/dashboard">
                <Button size="sm" fullWidth>
                  ⚡ Boost This Listing
                </Button>
              </Link>
            </div>}

            {/* Seller rating */}
            <RatingForm sellerId={listing.seller.id} sellerName={listing.seller.name} listingId={listing.id} />

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

        {/* More from this seller */}
        {moreFromSeller.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-gray-900">
                More from {listing.seller.isPro ? listing.seller.businessName ?? listing.seller.name : listing.seller.name}
              </h2>
              <Link
                href={listing.seller.isPro ? `/store/${listing.seller.id}` : `/profile/${listing.seller.id}`}
                className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {moreFromSeller.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          </div>
        )}

        {/* Related listings */}
        {related.length > 0 && (
          <div>
            <SimilarListings listings={related} category={listing.category} />
          </div>
        )}
      </div>
    </div>
  );
}
