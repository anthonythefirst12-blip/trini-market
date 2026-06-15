"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSent(true);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 overflow-hidden bg-slate-900">
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 40% 40%, #1e3a5f 0%, transparent 55%), radial-gradient(ellipse at 75% 70%, #1d4ed8 0%, transparent 45%)",
      }} />
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle, #93c5fd 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
      }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="absolute -inset-0.5 rounded-2xl neon-blue opacity-40" />
        <div className="relative glass-dark rounded-2xl p-8">
          <div className="flex items-center gap-2.5 mb-6">
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="34" height="34" rx="9" fill="url(#fpLogoGrad)" />
              <path d="M7 24V11l5.5 7 4.5-6 4.5 6 5.5-7v13" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <rect x="7" y="26" width="20" height="2" rx="1" fill="rgba(255,255,255,0.4)" />
              <defs>
                <linearGradient id="fpLogoGrad" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
            </svg>
            <span className="font-display font-bold text-xl text-white tracking-tight">Trini<span className="text-blue-400">Market</span></span>
          </div>

          {sent ? (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">📬</div>
              <h2 className="font-display font-bold text-xl text-white mb-2">Check your inbox</h2>
              <p className="text-sm text-slate-400 mb-6">
                We sent a password reset link to <strong className="text-white">{email}</strong>. It may take a minute to arrive.
              </p>
              <Link href="/auth/login" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                ← Back to Log In
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-display font-bold text-2xl text-white mb-1">Reset your password</h1>
              <p className="text-sm text-slate-400 mb-6">Enter your email and we&apos;ll send you a reset link.</p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 text-sm bg-slate-800/60 border border-slate-600 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending…" : "Send Reset Link"}
                </button>
              </form>

              <p className="text-sm text-center text-slate-400 mt-5">
                Remembered it?{" "}
                <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Log in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
