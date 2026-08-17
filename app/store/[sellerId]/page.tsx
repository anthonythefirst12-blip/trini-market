import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getSeller, getSellerListings } from "@/lib/db";
import { ListingCard } from "@/components/listings/ListingCard";
import { MapPin } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ sellerId: string }> }): Promise<Metadata> {
  const { sellerId } = await params;
  const seller = await getSeller(sellerId);
  if (!seller || !seller.isPro) return { title: "Storefront" };
  const name = seller.businessName ?? seller.name;
  return {
    title: `${name} — Business Storefront`,
    description: seller.bio ?? `Browse all listings from ${name} on TriniSell.`,
    openGraph: {
      title: name,
      description: seller.bio ?? `Browse all listings from ${name} on TriniSell.`,
      images: seller.avatar ? [{ url: seller.avatar }] : [],
    },
    alternates: { canonical: `https://trinisell.tt/store/${sellerId}` },
  };
}

export default async function StorefrontPage({ params }: { params: Promise<{ sellerId: string }> }) {
  const { sellerId } = await params;
  const [seller, listings] = await Promise.all([getSeller(sellerId), getSellerListings(sellerId)]);

  if (!seller) notFound();
  if (!seller.isPro) redirect(`/profile/${sellerId}`);

  const activeListings = listings.filter((l) => !l.sold);
  const soldListings = listings.filter((l) => l.sold);
  const memberSince = new Date(seller.joinedDate).toLocaleDateString("en-TT", { month: "long", year: "numeric" });
  const displayName = seller.businessName ?? seller.name;
  const categories = [...new Set(activeListings.map((l) => l.category))];

  return (
    <div className="store-page min-h-screen">
      <style>{`
        .store-page { background: #fafafa; }
        .store-card { background: #ffffff; border-color: #e5e7eb; }
        .store-heading { color: #111827; }
        .store-sub { color: #6b7280; }
        .store-muted { color: #9ca3af; }
        .store-divider { border-color: #e5e7eb; }
        .store-stat-value { color: #111827; }
        .store-empty { background: #ffffff; border-color: #e5e7eb; }
        .store-cat-tag { background: #fef2f2; border-color: #fecaca; color: #b91c1c; }
        .store-footer { background: #ffffff; border-color: #e5e7eb; }
        .store-footer-secondary { background: #f3f4f6; color: #374151; }
        .store-footer-secondary:hover { background: #e5e7eb; }
        .store-view-profile { background: #f3f4f6; color: #374151; }
        .store-view-profile:hover { background: #e5e7eb; }

        [data-theme="dark"] .store-page { background: #111111; }
        [data-theme="dark"] .store-card { background: #1c1c1c; border-color: #2a2a2a; }
        [data-theme="dark"] .store-heading { color: #f9fafb; }
        [data-theme="dark"] .store-sub { color: #9ca3af; }
        [data-theme="dark"] .store-muted { color: rgba(255,255,255,0.3); }
        [data-theme="dark"] .store-divider { border-color: #2a2a2a; }
        [data-theme="dark"] .store-stat-value { color: #f9fafb; }
        [data-theme="dark"] .store-empty { background: #1c1c1c; border-color: #2a2a2a; }
        [data-theme="dark"] .store-cat-tag { background: rgba(220,38,38,0.1); border-color: rgba(220,38,38,0.25); color: #fca5a5; }
        [data-theme="dark"] .store-footer { background: #1c1c1c; border-color: #2a2a2a; }
        [data-theme="dark"] .store-footer-secondary { background: #2a2a2a; color: #d1d5db; }
        [data-theme="dark"] .store-footer-secondary:hover { background: #333333; }
        [data-theme="dark"] .store-view-profile { background: #2a2a2a; color: #d1d5db; }
        [data-theme="dark"] .store-view-profile:hover { background: #333333; }

        @media (prefers-color-scheme: dark) {
          :root:not([data-theme="light"]) .store-page { background: #111111; }
          :root:not([data-theme="light"]) .store-card { background: #1c1c1c; border-color: #2a2a2a; }
          :root:not([data-theme="light"]) .store-heading { color: #f9fafb; }
          :root:not([data-theme="light"]) .store-sub { color: #9ca3af; }
          :root:not([data-theme="light"]) .store-muted { color: rgba(255,255,255,0.3); }
          :root:not([data-theme="light"]) .store-divider { border-color: #2a2a2a; }
          :root:not([data-theme="light"]) .store-stat-value { color: #f9fafb; }
          :root:not([data-theme="light"]) .store-empty { background: #1c1c1c; border-color: #2a2a2a; }
          :root:not([data-theme="light"]) .store-cat-tag { background: rgba(220,38,38,0.1); border-color: rgba(220,38,38,0.25); color: #fca5a5; }
          :root:not([data-theme="light"]) .store-footer { background: #1c1c1c; border-color: #2a2a2a; }
          :root:not([data-theme="light"]) .store-footer-secondary { background: #2a2a2a; color: #d1d5db; }
          :root:not([data-theme="light"]) .store-footer-secondary:hover { background: #333333; }
          :root:not([data-theme="light"]) .store-view-profile { background: #2a2a2a; color: #d1d5db; }
          :root:not([data-theme="light"]) .store-view-profile:hover { background: #333333; }
        }
      `}</style>

      {/* Banner */}
      <div className="relative h-52 sm:h-72 overflow-hidden bg-gradient-to-br from-red-900 via-red-800 to-gray-900">
        {seller.banner && (
          <Image src={seller.banner} alt="" fill className="object-cover opacity-30" sizes="100vw" unoptimized />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-4 left-4">
          <Link
            href="/businesses"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white transition-colors bg-black/20 px-3 py-1.5 rounded-full backdrop-blur"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Businesses
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Business header */}
        <div className="relative -mt-16 sm:-mt-20 flex items-end gap-5 flex-wrap pb-6 store-divider border-b">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-red-100 to-red-50 shrink-0">
            {seller.avatar ? (
              <Image src={seller.avatar} alt={displayName} fill className="object-cover" sizes="128px" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-red-300">
                {displayName.charAt(0)}
              </div>
            )}
          </div>

          <div className="pb-1 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="store-heading font-display font-bold text-2xl sm:text-3xl truncate">{displayName}</h1>
              {seller.verified && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-red-600 text-white px-2 py-0.5 rounded-full shrink-0">
                  ✓ Verified
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-500 text-white px-2 py-0.5 rounded-full shrink-0">
                ★ Business
              </span>
            </div>
            {seller.businessName && seller.name !== seller.businessName && (
              <p className="store-sub text-sm mb-1">Run by {seller.name}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 text-sm store-muted">
              {seller.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                  {seller.location}
                </span>
              )}
              <span>Member since {memberSince}</span>
              {seller.reviewCount > 0 && (
                <span className="flex items-center gap-1">
                  <span className="text-amber-400">★</span>
                  {seller.rating.toFixed(1)} ({seller.reviewCount} reviews)
                </span>
              )}
            </div>
          </div>

          <div className="pb-1 flex gap-2 flex-wrap">
            <Link
              href={`/messages?to=${sellerId}&title=Business+Enquiry`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Message
            </Link>
            {seller.phone && (
              <a
                href={`https://wa.me/${seller.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            )}
            <Link
              href={`/profile/${sellerId}`}
              className="store-view-profile inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors"
            >
              View Profile
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 py-6 store-divider border-b">
          {[
            { label: "Active Listings", value: activeListings.length },
            { label: "Items Sold", value: soldListings.length },
            { label: "Rating", value: seller.reviewCount > 0 ? `${seller.rating.toFixed(1)} ★` : "—" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="store-stat-value font-display font-bold text-2xl">{s.value}</p>
              <p className="store-muted text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* About */}
        {seller.bio && (
          <div className="py-6 store-divider border-b">
            <h2 className="store-heading font-display font-semibold text-base mb-3">About</h2>
            <p className="store-sub text-sm leading-relaxed">{seller.bio}</p>
          </div>
        )}

        {/* Category filter */}
        {categories.length > 1 && (
          <div className="py-5 store-divider border-b flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <span key={cat} className="store-cat-tag text-xs font-medium px-3 py-1.5 border rounded-full">
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Listings */}
        <div className="py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="store-heading font-display font-bold text-xl">
              All Listings
              <span className="store-muted font-normal text-sm ml-2">({activeListings.length})</span>
            </h2>
          </div>

          {activeListings.length === 0 ? (
            <div className="store-empty text-center py-16 rounded-2xl border">
              <p className="store-sub font-medium mb-1">No active listings right now.</p>
              <p className="store-muted text-sm">Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {activeListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>

        {/* Sold */}
        {soldListings.length > 0 && (
          <div className="pb-10">
            <h2 className="store-heading font-display font-bold text-lg mb-5">
              Past Sales
              <span className="store-muted font-normal text-sm ml-2">({soldListings.length})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {soldListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="store-footer border-t mt-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="store-heading font-display font-bold">Want your own business storefront?</p>
            <p className="store-muted text-sm mt-0.5">List unlimited items under your brand for TT$99/month.</p>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shrink-0"
          >
            Get a Storefront →
          </Link>
        </div>
      </div>
    </div>
  );
}
