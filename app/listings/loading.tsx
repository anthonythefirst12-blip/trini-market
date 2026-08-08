import { SkeletonCard } from "@/components/listings/SkeletonCard";

export default function ListingsLoading() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="hidden lg:block w-64 shrink-0 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-white rounded-2xl border border-gray-200 animate-pulse" />
            ))}
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {[...Array(9)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
