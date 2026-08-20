function Shimmer({ className }: { className: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-gray-100 dark:bg-white/5 rounded-full ${className}`}
      style={{ backgroundSize: "200% 100%" }}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-[#1c1c1c] rounded-2xl border border-gray-200 dark:border-white/6 overflow-hidden" aria-hidden="true">
      <div className="relative h-48 bg-gray-100 dark:bg-white/5 overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/60 dark:via-white/8 to-transparent" />
      </div>
      <div className="p-4 space-y-3">
        <Shimmer className="h-4 w-3/4" />
        <Shimmer className="h-4 w-1/2" />
        <div className="flex items-center justify-between pt-1">
          <Shimmer className="h-5 w-1/3" />
          <Shimmer className="h-3 w-1/4" />
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-white/5">
          <Shimmer className="h-3 w-1/3" />
          <Shimmer className="h-3 w-1/4" />
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

export function SkeletonGrid({ count = 8, cols = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" }: { count?: number; cols?: string }) {
  return (
    <div className={`grid ${cols} gap-4`}>
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}
