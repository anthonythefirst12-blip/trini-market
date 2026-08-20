import { SkeletonGrid } from "@/components/ui/SkeletonCard";

export default function ListingsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header bar skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-5 w-32 bg-gray-100 dark:bg-white/5 rounded-full relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent" />
        </div>
        <div className="h-9 w-28 bg-gray-100 dark:bg-white/5 rounded-xl relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent" />
        </div>
      </div>
      <SkeletonGrid count={12} />
      <style>{`
        @keyframes shimmer {
          from { transform: translateX(-100%); }
          to   { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
