import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 30% 50%, #1e3a5f 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, #1d4ed8 0%, transparent 50%)",
      }} />
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle, #93c5fd 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
      }} />

      <div className="relative z-10 text-center max-w-md">
        <div className="font-display font-bold text-[120px] leading-none text-transparent bg-clip-text" style={{
          backgroundImage: "linear-gradient(135deg, #3b82f6, #06b6d4)",
        }}>
          404
        </div>
        <h1 className="font-display font-bold text-2xl text-white mt-2 mb-3">Page not found</h1>
        <p className="text-slate-400 text-sm mb-8">
          This page doesn&apos;t exist or may have been removed. Check the URL or head back home.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-blue-500 transition-all hover:scale-105 active:scale-95"
          >
            ← Go Home
          </Link>
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 border border-slate-600 text-slate-300 font-semibold text-sm px-6 py-3 rounded-xl hover:bg-slate-700 hover:text-white transition-colors"
          >
            Browse Listings
          </Link>
        </div>
      </div>
    </div>
  );
}
