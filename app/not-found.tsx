import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="font-display font-bold text-[120px] leading-none text-red-600 select-none">
          404
        </div>
        <h1 className="font-display font-bold text-2xl text-gray-900 mt-2 mb-3">Page not found</h1>
        <p className="text-gray-500 text-sm mb-8">
          This page doesn&apos;t exist or may have been removed. Check the URL or head back home.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link href="/"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors">
            ← Go Home
          </Link>
          <Link href="/listings"
            className="inline-flex items-center gap-2 border border-gray-200 bg-white text-gray-700 font-semibold text-sm px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors">
            Browse Listings
          </Link>
        </div>
      </div>
    </div>
  );
}
