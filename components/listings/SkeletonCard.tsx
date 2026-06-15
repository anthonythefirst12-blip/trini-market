export function SkeletonCard() {
  return (
    <div className="bg-white border-2 border-gray-100 rounded-xl overflow-hidden animate-pulse">
      <div className="h-1 bg-gray-100" />
      <div className="h-48 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="flex justify-between mt-3">
          <div className="h-5 bg-gray-200 rounded w-1/4" />
          <div className="h-3 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}
