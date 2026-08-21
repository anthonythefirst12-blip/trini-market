import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSeller, getSellerListings, getSellerReviews, getSellerResponseRate } from "@/lib/db";
import { ListingCard } from "@/components/listings/ListingCard";
import { SellerPresence } from "@/components/listings/SellerPresence";
import { StorefrontActivatedBanner } from "@/components/ui/StorefrontActivatedBanner";
import { MapPin } from "lucide-react";
import { Suspense } from "react";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ sellerId: string }> }): Promise<Metadata> {
  const { sellerId } = await params;
  const seller = await getSeller(sellerId);
  if (!seller) return { title: "Seller Not Found" };
  const desc = seller.bio ?? `Browse listings from ${seller.name} on TriniSell. ${seller.listingCount ?? 0} listings available.`;
  return {
    title: seller.name,
    description: desc,
    openGraph: {
      title: seller.name,
      description: desc,
      images: seller.avatar ? [{ url: seller.avatar }] : [],
    },
    alternates: { canonical: `https://trinisell.tt/profile/${sellerId}` },
  };
}

export default async function SellerProfilePage({ params }: { params: Promise<{ sellerId: string }> }) {
  const { sellerId } = await params;
  const [seller, listings, reviews, responseRate] = await Promise.all([
    getSeller(sellerId),
    getSellerListings(sellerId),
    getSellerReviews(sellerId),
    getSellerResponseRate(sellerId),
  ]);

  if (!seller) notFound();

  const stars = Math.round(seller.rating);
  const activeListings = listings.filter((l) => !l.sold);
  const soldListings = listings.filter((l) => l.sold);
  const memberSince = new Date(seller.joinedDate).toLocaleDateString("en-TT", { month: "long", year: "numeric" });

  const rateColor =
    responseRate === null ? "profile-rate-neutral"
    : responseRate >= 80 ? "profile-rate-good"
    : responseRate >= 50 ? "profile-rate-mid"
    : "profile-rate-neutral";

  return (
    <div className="profile-page min-h-screen">
      <Suspense><StorefrontActivatedBanner /></Suspense>
      <style>{`
        .profile-page { background: #fafafa; }
        .profile-card { background: #ffffff; border-color: #e5e7eb; }
        .profile-heading { color: #111827; }
        .profile-sub { color: #6b7280; }
        .profile-muted { color: #9ca3af; }
        .profile-divider { border-color: #e5e7eb; }
        .profile-stat-value { color: #111827; }
        .profile-review-body { color: #4b5563; }
        .profile-rate-good { color: #16a34a; }
        .profile-rate-mid { color: #d97706; }
        .profile-rate-neutral { color: #9ca3af; }
        .profile-empty { background: #ffffff; border-color: #e5e7eb; }
        .profile-star-empty { color: #e5e7eb; }
        .profile-wa { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }
        .profile-wa:hover { background: #dcfce7; }

        [data-theme="dark"] .profile-page { background: #111111; }
        [data-theme="dark"] .profile-card { background: #1c1c1c; border-color: #2a2a2a; }
        [data-theme="dark"] .profile-heading { color: #f9fafb; }
        [data-theme="dark"] .profile-sub { color: #9ca3af; }
        [data-theme="dark"] .profile-muted { color: rgba(255,255,255,0.3); }
        [data-theme="dark"] .profile-divider { border-color: #2a2a2a; }
        [data-theme="dark"] .profile-stat-value { color: #f9fafb; }
        [data-theme="dark"] .profile-review-body { color: #9ca3af; }
        [data-theme="dark"] .profile-rate-good { color: #4ade80; }
        [data-theme="dark"] .profile-rate-mid { color: #fbbf24; }
        [data-theme="dark"] .profile-rate-neutral { color: rgba(255,255,255,0.3); }
        [data-theme="dark"] .profile-empty { background: #1c1c1c; border-color: #2a2a2a; }
        [data-theme="dark"] .profile-star-empty { color: #2a2a2a; }
        [data-theme="dark"] .profile-wa { background: rgba(22,163,74,0.1); border-color: rgba(22,163,74,0.25); color: #4ade80; }
        [data-theme="dark"] .profile-wa:hover { background: rgba(22,163,74,0.18); }

        @media (prefers-color-scheme: dark) {
          :root:not([data-theme="light"]) .profile-page { background: #111111; }
          :root:not([data-theme="light"]) .profile-card { background: #1c1c1c; border-color: #2a2a2a; }
          :root:not([data-theme="light"]) .profile-heading { color: #f9fafb; }
          :root:not([data-theme="light"]) .profile-sub { color: #9ca3af; }
          :root:not([data-theme="light"]) .profile-muted { color: rgba(255,255,255,0.3); }
          :root:not([data-theme="light"]) .profile-divider { border-color: #2a2a2a; }
          :root:not([data-theme="light"]) .profile-stat-value { color: #f9fafb; }
          :root:not([data-theme="light"]) .profile-review-body { color: #9ca3af; }
          :root:not([data-theme="light"]) .profile-rate-good { color: #4ade80; }
          :root:not([data-theme="light"]) .profile-rate-mid { color: #fbbf24; }
          :root:not([data-theme="light"]) .profile-rate-neutral { color: rgba(255,255,255,0.3); }
          :root:not([data-theme="light"]) .profile-empty { background: #1c1c1c; border-color: #2a2a2a; }
          :root:not([data-theme="light"]) .profile-star-empty { color: #2a2a2a; }
          :root:not([data-theme="light"]) .profile-wa { background: rgba(22,163,74,0.1); border-color: rgba(22,163,74,0.25); color: #4ade80; }
          :root:not([data-theme="light"]) .profile-wa:hover { background: rgba(22,163,74,0.18); }
        }
      `}</style>

      {/* Banner */}
      <div className="relative h-40 sm:h-52 bg-gradient-to-br from-red-900 via-red-800 to-gray-900 overflow-hidden">
        {seller.banner && (
          <Image src={seller.banner} alt="" fill className="object-cover opacity-30" sizes="100vw" unoptimized />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Profile header */}
        <div className="relative -mt-14 flex items-end gap-5 flex-wrap">
          <div className="relative w-28 h-28 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-gray-100 shrink-0">
            {seller.avatar ? (
              <Image src={seller.avatar} alt={seller.name} fill className="object-cover" sizes="112px" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-300 bg-gradient-to-br from-red-100 to-red-50">
                {seller.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="pb-2 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="profile-heading font-display font-bold text-2xl truncate">{seller.name}</h1>
              {seller.verified && (
                <span className="text-xs font-semibold bg-red-600 text-white px-2 py-0.5 rounded-full">✓ Verified</span>
              )}
              {seller.isPro && (
                <span className="text-xs font-semibold bg-amber-500 text-white px-2 py-0.5 rounded-full">★ Pro Seller</span>
              )}
            </div>
            {seller.businessName && (
              <p className="profile-sub text-sm">{seller.businessName}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm profile-muted">
              {seller.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                  {seller.location}
                </span>
              )}
              <span>Member since {memberSince}</span>
              <SellerPresence sellerId={sellerId} />
            </div>
          </div>

          <div className="pb-2">
            <Link
              href={`/messages?to=${sellerId}&title=General+Enquiry`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Message
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Active Listings", value: activeListings.length, cls: "profile-stat-value" },
            { label: "Items Sold", value: soldListings.length, cls: "profile-stat-value" },
            { label: "Rating", value: seller.reviewCount > 0 ? `${seller.rating.toFixed(1)} ★` : "—", cls: "profile-stat-value" },
            { label: "Response Rate", value: responseRate !== null ? `${responseRate}%` : "—", cls: rateColor },
          ].map((stat) => (
            <div key={stat.label} className="profile-card border rounded-2xl px-4 py-4 text-center">
              <p className={`font-display font-bold text-xl ${stat.cls}`}>{stat.value}</p>
              <p className="profile-muted text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Star rating bar */}
        {seller.reviewCount > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`text-lg ${i < stars ? "text-amber-400" : "profile-star-empty"}`}>★</span>
              ))}
            </div>
            <span className="profile-sub text-sm font-medium">{seller.rating.toFixed(1)}</span>
            <span className="profile-muted text-sm">({seller.reviewCount} {seller.reviewCount === 1 ? "review" : "reviews"})</span>
          </div>
        )}

        {/* Bio */}
        {seller.bio && (
          <div className="mt-4 profile-card border rounded-xl p-5">
            <p className="profile-sub text-sm leading-relaxed">{seller.bio}</p>
          </div>
        )}

        {/* WhatsApp */}
        {seller.phone && (
          <div className="mt-3 flex gap-3">
            <a
              href={`https://wa.me/${seller.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="profile-wa inline-flex items-center gap-2 px-4 py-2 border text-sm font-semibold rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          </div>
        )}

        <hr className="my-8 profile-divider" />

        {/* Active listings */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="profile-heading font-display font-bold text-lg">
              Active Listings
              <span className="profile-muted font-normal text-sm ml-2">({activeListings.length})</span>
            </h2>
            {seller.isPro && (
              <Link href={`/store/${sellerId}`} className="text-sm text-red-600 hover:text-red-700 font-medium">
                View Storefront →
              </Link>
            )}
          </div>

          {activeListings.length === 0 ? (
            <div className="profile-empty text-center py-16 rounded-2xl border">
              <p className="profile-muted text-sm">No active listings right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {activeListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>

        {/* Sold listings */}
        {soldListings.length > 0 && (
          <div className="mb-10">
            <h2 className="profile-heading font-display font-bold text-lg mb-5">
              Sold Items
              <span className="profile-muted font-normal text-sm ml-2">({soldListings.length})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {soldListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="mb-12" id="reviews">
          <h2 className="profile-heading font-display font-bold text-lg mb-5">
            Reviews
            <span className="profile-muted font-normal text-sm ml-2">({reviews.length})</span>
          </h2>

          {reviews.length === 0 ? (
            <div className="profile-empty text-center py-12 rounded-2xl border">
              <p className="profile-muted text-sm">No reviews yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="profile-card border rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center text-sm font-bold text-gray-400">
                      {review.reviewerAvatar
                        ? <img src={review.reviewerAvatar} alt={review.reviewerName} className="w-full h-full object-cover" />
                        : review.reviewerName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="profile-heading font-semibold text-sm">{review.reviewerName}</span>
                        <span className="profile-muted text-xs">
                          {new Date(review.createdAt).toLocaleDateString("en-TT", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <div className="flex gap-0.5 mt-1 mb-2">
                        {[1,2,3,4,5].map((s) => (
                          <span key={s} className={`text-sm ${s <= review.rating ? "text-amber-400" : "profile-star-empty"}`}>★</span>
                        ))}
                      </div>
                      {review.comment && (
                        <p className="profile-review-body text-sm leading-relaxed">{review.comment}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
