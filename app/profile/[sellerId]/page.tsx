import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSeller, getSellerListings } from "@/lib/db";
import { ListingCard } from "@/components/listings/ListingCard";

export async function generateMetadata({ params }: { params: Promise<{ sellerId: string }> }) {
  const { sellerId } = await params;
  const seller = await getSeller(sellerId);
  if (!seller) return { title: "Seller Not Found" };
  return {
    title: `${seller.name} | TriniMarket`,
    description: seller.bio ?? `Browse listings from ${seller.name} on TriniMarket.`,
  };
}

export default async function SellerProfilePage({ params }: { params: Promise<{ sellerId: string }> }) {
  const { sellerId } = await params;
  const [seller, listings] = await Promise.all([getSeller(sellerId), getSellerListings(sellerId)]);

  if (!seller) notFound();

  const stars = Math.round(seller.rating);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Banner */}
      <div className="relative h-40 sm:h-52 bg-gradient-to-br from-blue-900 via-slate-800 to-slate-900 overflow-hidden">
        {seller.banner && (
          <Image src={seller.banner} alt="" fill className="object-cover opacity-40" sizes="100vw" unoptimized />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
      </div>

      {/* Profile header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="relative -mt-14 flex items-end gap-5 flex-wrap">
          <div className="relative w-24 h-24 rounded-2xl border-4 border-slate-900 overflow-hidden bg-slate-700 shrink-0">
            {seller.avatar ? (
              <Image src={seller.avatar} alt={seller.name} fill className="object-cover" sizes="96px" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-400">
                {seller.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="pb-1 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display font-bold text-xl text-white truncate">{seller.name}</h1>
              {seller.verified && (
                <span className="text-xs font-semibold bg-blue-600 text-white px-2 py-0.5 rounded-full">✓ Verified</span>
              )}
              {seller.isPro && (
                <span className="text-xs font-semibold bg-amber-500 text-white px-2 py-0.5 rounded-full">★ Pro Seller</span>
              )}
            </div>
            {seller.businessName && (
              <p className="text-slate-400 text-sm mt-0.5">{seller.businessName}</p>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-5 flex flex-wrap gap-6">
          <div className="text-center">
            <p className="text-white font-bold text-lg">{listings.length}</p>
            <p className="text-slate-400 text-xs">Listings</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-lg">{seller.rating.toFixed(1)}</p>
            <p className="text-slate-400 text-xs">Rating</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-lg">{seller.reviewCount}</p>
            <p className="text-slate-400 text-xs">Reviews</p>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-lg">{new Date(seller.joinedDate).getFullYear()}</p>
            <p className="text-slate-400 text-xs">Member since</p>
          </div>
        </div>

        {/* Star display */}
        {seller.reviewCount > 0 && (
          <div className="mt-2 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < stars ? "text-amber-400" : "text-slate-600"}>★</span>
            ))}
            <span className="text-slate-400 text-xs ml-1">({seller.reviewCount} reviews)</span>
          </div>
        )}

        {/* Bio */}
        {seller.bio && (
          <p className="mt-4 text-slate-300 text-sm leading-relaxed max-w-2xl">{seller.bio}</p>
        )}

        {/* Location */}
        {seller.location && (
          <p className="mt-2 text-slate-500 text-sm">📍 {seller.location}</p>
        )}

        <hr className="my-8 border-slate-700" />

        {/* Listings grid */}
        <h2 className="font-display font-semibold text-white text-lg mb-5">
          Listings by {seller.name}
          <span className="text-slate-500 font-normal text-sm ml-2">({listings.length})</span>
        </h2>

        {listings.length === 0 ? (
          <div className="text-center py-16 bg-slate-800 rounded-2xl border border-slate-700 mb-10">
            <p className="text-slate-400 text-sm">No active listings right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 pb-16">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
