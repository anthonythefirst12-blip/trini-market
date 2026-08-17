export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" aria-hidden="true">
      <div className="aspect-[4/3] bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 bg-[length:200%_100%] animate-[shimmer_1.4s_ease-in-out_infinite]" />
      <div className="p-3 space-y-2.5">
        <div className="h-2.5 bg-gray-100 rounded-full w-1/4 animate-[shimmer_1.4s_ease-in-out_infinite] bg-[length:200%_100%]" />
        <div className="h-4 bg-gray-100 rounded-full w-3/4 animate-[shimmer_1.4s_ease-in-out_0.1s_infinite] bg-[length:200%_100%]" />
        <div className="h-4 bg-gray-100 rounded-full w-1/2 animate-[shimmer_1.4s_ease-in-out_0.2s_infinite] bg-[length:200%_100%]" />
        <div className="flex gap-3 pt-1">
          <div className="h-3 bg-gray-100 rounded-full w-1/4 animate-[shimmer_1.4s_ease-in-out_0.3s_infinite] bg-[length:200%_100%]" />
          <div className="h-3 bg-gray-100 rounded-full w-1/4 animate-[shimmer_1.4s_ease-in-out_0.3s_infinite] bg-[length:200%_100%]" />
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        [data-theme="dark"] .skeleton-card { background-color: #1c1c1c; border-color: rgba(255,255,255,0.06); }
        [data-theme="dark"] .skeleton-card .shimmer-block { background-color: #2a2a2a; }
      `}</style>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}
