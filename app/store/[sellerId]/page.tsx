import { notFound } from "next/navigation";
import Image from "next/image";
import { getSellerListings } from "@/lib/db";
import { ListingCard } from "@/components/listings/ListingCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface Props {
  params: Promise<{ sellerId: string }>;
}

export default async function StorefrontPage({ params }: Props) {
  const { sellerId } = await params;

  const sellerListings = await getSellerListings(sellerId);
  if (sellerListings.length === 0) notFound();

  const seller = sellerListings[0].seller;
  if (!seller.isPro) notFound();

  const avgRating = seller.rating;

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Banner */}
      <div className="relative h-48 sm:h-64 bg-blue-900 overflow-hidden">
        {seller.banner && (
          <Image
            src={seller.banner}
            alt={`${seller.businessName} banner`}
            fill
            className="object-cover opacity-70"
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Profile header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 flex items-end gap-5 pb-6 border-b border-gray-200">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-white bg-gray-100 shadow-md shrink-0">
            <Image src={seller.avatar} alt={seller.name} fill className="object-cover" sizes="96px" />
          </div>
          <div className="flex-1 min-w-0 pb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display font-bold text-2xl text-gray-900">
                {seller.businessName || seller.name}
              </h1>
              <span className="inline-flex items-center gap-1 bg-blue-700 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified Business
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <div className="flex items-center gap-1">
                <span className="text-amber-400 text-sm">{"★".repeat(Math.round(avgRating))}</span>
                <span className="text-sm text-gray-500">{avgRating} ({seller.reviewCount} reviews)</span>
              </div>
              <span className="text-gray-300">·</span>
              <span className="text-sm text-gray-500">{seller.listingCount ?? sellerListings.length} listings</span>
              <span className="text-gray-300">·</span>
              <span className="text-sm text-gray-500">{seller.location}</span>
            </div>
            {seller.bio && <p className="text-sm text-gray-500 mt-2 max-w-xl">{seller.bio}</p>}
          </div>
          <div className="hidden sm:flex items-center gap-2 pb-2 shrink-0">
            <Link href={`/messages`}>
              <Button variant="secondary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Message
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 py-6 border-b border-gray-200 mb-8">
          {[
            { label: "Active Listings", value: sellerListings.length },
            { label: "Reviews", value: seller.reviewCount },
            { label: "Member Since", value: new Date(seller.joinedDate).getFullYear() },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display font-bold text-2xl text-blue-700">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Listings grid */}
        <div className="pb-14">
          <h2 className="font-display font-bold text-xl text-gray-900 mb-5">
            All Listings from {seller.businessName || seller.name}
          </h2>
          {sellerListings.length === 0 ? (
            <p className="text-gray-400 text-sm">No listings yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sellerListings.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
