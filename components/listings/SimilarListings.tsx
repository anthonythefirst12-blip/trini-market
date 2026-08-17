import Link from "next/link";
import Image from "next/image";

interface Listing {
  id: string;
  title: string;
  price: number;
  currency: string;
  location: string;
  images: string[];
  condition?: string;
  tier?: string;
}

interface Props {
  listings: Listing[];
  category: string;
}

export function SimilarListings({ listings, category }: Props) {
  if (!listings.length) return null;

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display font-bold text-xl text-gray-900">More in {category}</h2>
          <p className="text-sm text-gray-400 mt-0.5">Similar listings you might like</p>
        </div>
        <Link
          href={`/listings?category=${encodeURIComponent(category)}`}
          className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors whitespace-nowrap"
        >
          View all →
        </Link>
      </div>

      {/* Horizontal scroll on mobile, grid on desktop */}
      <div
        className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:overflow-visible sm:pb-0"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {listings.map((listing) => {
          const price = new Intl.NumberFormat("en-TT", {
            style: "currency",
            currency: listing.currency ?? "TTD",
            minimumFractionDigits: 0,
          }).format(listing.price);

          return (
            <Link
              key={listing.id}
              href={`/listings/${listing.id}`}
              className="group flex-shrink-0 w-[200px] sm:w-auto snap-start bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                {listing.images?.[0] ? (
                  <Image
                    src={listing.images[0]}
                    alt={listing.title}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    sizes="(max-width: 640px) 200px, (max-width: 1024px) 50vw, 25vw"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl bg-gray-50">📦</div>
                )}
                {listing.tier === "premium" && (
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    ★
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-400 mb-1 truncate">{listing.location}</p>
                <p className="text-sm font-semibold text-gray-900 truncate leading-snug">{listing.title}</p>
                <p className="text-sm font-bold text-red-600 mt-1">{price}</p>
                {listing.condition && (
                  <p className="text-xs text-gray-400 mt-1">{listing.condition}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
