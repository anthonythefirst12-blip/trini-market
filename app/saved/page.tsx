import { redirect } from "next/navigation";
import Link from "next/link";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase-server";
import { ListingCard } from "@/components/listings/ListingCard";

export default async function SavedListingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: savedRows } = await supabase
    .from("saved_listings")
    .select("listing_id, listings(*, sellers(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const listings = (savedRows ?? [])
    .map((row: any) => row.listings)
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#FAFAFA] [data-theme='dark']:bg-[#111111] dark:bg-[#111111]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">
            Saved Listings
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {listings.length} {listings.length === 1 ? "listing" : "listings"} saved
          </p>
        </div>

        {listings.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Heart
              size={48}
              className="w-12 h-12 text-gray-300 mb-4"
              strokeWidth={1.5}
            />
            <p className="font-display font-semibold text-gray-700 dark:text-gray-300 text-lg">
              No saved listings yet
            </p>
            <p className="text-gray-400 text-sm mt-1 max-w-xs">
              Browse listings and tap ♥ to save them here
            </p>
            <Link
              href="/listings"
              className="mt-6 inline-flex items-center gap-2 bg-red-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-red-700 transition-colors"
            >
              Browse Listings
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {listings.map((listing: any) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
