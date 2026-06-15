export const dynamic = "force-dynamic";

import { createServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { ListingCard } from "@/components/listings/ListingCard";
import { Listing } from "@/lib/types";
import Link from "next/link";

export default async function SavedPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: saved } = await supabase
    .from("saved_listings")
    .select("listing_id, listings(*, sellers(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const listings: Listing[] = (saved ?? []).map((row: any) => {
    const l = row.listings;
    const s = l.sellers;
    return {
      id: l.id,
      title: l.title,
      description: l.description,
      price: l.price,
      currency: l.currency,
      category: l.category,
      condition: l.condition,
      location: l.location,
      images: l.images ?? [],
      seller: {
        id: s.id,
        name: s.name,
        avatar: s.avatar,
        joinedDate: s.joined_date,
        rating: s.rating,
        reviewCount: s.review_count,
        location: s.location,
        verified: s.verified,
        isPro: s.is_pro,
      },
      createdAt: l.created_at,
      featured: l.featured,
      tier: l.tier,
      tags: l.tags ?? [],
      negotiable: l.negotiable,
      commentCount: l.comment_count,
      views: l.views ?? 0,
    };
  });

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl text-gray-900">Saved Listings</h1>
          <p className="text-sm text-gray-500 mt-1">{listings.length} saved listing{listings.length !== 1 ? "s" : ""}</p>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <div className="text-5xl mb-4">🤍</div>
            <h3 className="font-display font-semibold text-lg text-gray-700">Nothing saved yet</h3>
            <p className="text-gray-400 text-sm mt-1 mb-6">Tap the heart on any listing to save it here.</p>
            <Link href="/listings" className="inline-flex items-center gap-2 bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-blue-800 transition-colors">
              Browse Listings
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
