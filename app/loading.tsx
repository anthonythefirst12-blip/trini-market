import { SkeletonGrid } from "@/components/ui/SkeletonCard";

export default function HomeLoading() {
  return (
    <div className="bg-white dark:bg-[#111111]">
      {/* Category strip skeleton */}
      <div className="border-b border-gray-100 dark:border-white/5 px-4 py-4">
        <div className="max-w-7xl mx-auto grid grid-cols-4 sm:grid-cols-8 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 p-2">
              <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-white/5" />
              <div className="h-2.5 w-12 rounded-full bg-gray-100 dark:bg-white/5" />
            </div>
          ))}
        </div>
      </div>

      {/* Listings skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div>
          <div className="h-5 w-24 bg-gray-100 dark:bg-white/5 rounded-full mb-4 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent" />
          </div>
          <SkeletonGrid count={4} cols="grid-cols-2 lg:grid-cols-4" />
        </div>
        <div>
          <div className="h-5 w-36 bg-gray-100 dark:bg-white/5 rounded-full mb-4 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent" />
          </div>
          <SkeletonGrid count={8} cols="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" />
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          from { transform: translateX(-100%); }
          to   { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
