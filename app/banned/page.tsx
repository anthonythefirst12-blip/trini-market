import Link from "next/link";

export default function BannedPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="font-display font-bold text-2xl text-gray-900 mb-3">Account Suspended</h1>
        <p className="text-gray-500 text-sm mb-2">
          Your account has been suspended for violating our community guidelines.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          If you believe this is a mistake, please contact us at{" "}
          <a href="mailto:support@trinimarket.tt" className="text-red-600 hover:underline">
            support@trinimarket.tt
          </a>
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 border border-gray-200 bg-white text-gray-700 font-semibold text-sm px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Sign in with a different account
        </Link>
      </div>
    </div>
  );
}
