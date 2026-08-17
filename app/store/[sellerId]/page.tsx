import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getSeller, getSellerListings } from "@/lib/db";
import { ListingCard } from "@/components/listings/ListingCard";

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
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Banner */}
      <div className="relative h-52 sm:h-72 overflow-hidden bg-gradient-to-br from-red-900 via-red-800 to-gray-900">
        {seller.banner && (
          <Image src={seller.banner} alt="" fill className="object-cover opacity-30" sizes="100vw" unoptimized />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Back link */}
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
        <div className="relative -mt-16 sm:-mt-20 flex items-end gap-5 flex-wrap pb-6 border-b border-gray-200">
          {/* Avatar */}
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
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 truncate">{displayName}</h1>
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
              <p className="text-gray-500 text-sm mb-1">Run by {seller.name}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
              {seller.location && <span>📍 {seller.location}</span>}
              <span>Member since {memberSince}</span>
              {seller.reviewCount > 0 && (
                <span className="flex items-center gap-1">
                  <span className="text-amber-400">★</span>
                  {seller.rating.toFixed(1)} ({seller.reviewCount} reviews)
                </span>
              )}
            </div>
          </div>

          {/* CTA */}
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
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors"
            >
              View Profile
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 py-6 border-b border-gray-200">
          {[
            { label: "Active Listings", value: activeListings.length },
            { label: "Items Sold", value: soldListings.length },
            { label: "Rating", value: seller.reviewCount > 0 ? `${seller.rating.toFixed(1)} ★` : "—" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display font-bold text-2xl text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* About */}
        {seller.bio && (
          <div className="py-6 border-b border-gray-200">
            <h2 className="font-display font-semibold text-base text-gray-900 mb-3">About</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{seller.bio}</p>
          </div>
        )}

        {/* Category filter */}
        {categories.length > 1 && (
          <div className="py-5 border-b border-gray-200 flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <span key={cat} className="text-xs font-medium px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-full">
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Listings */}
        <div className="py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-xl text-gray-900">
              All Listings
              <span className="text-gray-400 font-normal text-sm ml-2">({activeListings.length})</span>
            </h2>
          </div>

          {activeListings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <p className="text-3xl mb-3">📦</p>
              <p className="text-gray-500 font-medium">No active listings right now.</p>
              <p className="text-gray-400 text-sm mt-1">Check back soon.</p>
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
            <h2 className="font-display font-bold text-lg text-gray-900 mb-5">
              Past Sales
              <span className="text-gray-400 font-normal text-sm ml-2">({soldListings.length})</span>
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
      <div className="border-t border-gray-200 bg-white mt-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-display font-bold text-gray-900">Want your own business storefront?</p>
            <p className="text-gray-400 text-sm mt-0.5">List unlimited items under your brand for TT$99/month.</p>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shrink-0"
          >
            ⚡ Get a Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
