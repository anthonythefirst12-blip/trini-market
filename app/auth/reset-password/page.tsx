"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 overflow-hidden" style={{ background: "#1a0000" }}>
      {/* Deep crimson gradient mesh */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 30% 40%, #3b0000 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, #7f1d1d 0%, transparent 45%), radial-gradient(ellipse at 10% 80%, #0d0000 0%, transparent 50%)",
      }} />

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle, #fca5a5 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
      }} />

      {/* Neon glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full animate-pulse-glow" style={{
        background: "radial-gradient(circle, rgba(185,28,28,0.3) 0%, transparent 70%)",
        filter: "blur(30px)",
      }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full animate-pulse-glow" style={{
        background: "radial-gradient(circle, rgba(220,38,38,0.2) 0%, transparent 70%)",
        filter: "blur(40px)",
        animationDelay: "1.5s",
      }} />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="absolute -inset-0.5 rounded-2xl opacity-60" style={{ boxShadow: "0 0 20px rgba(185,28,28,0.6), 0 0 40px rgba(185,28,28,0.2)" }} />
        <div className="relative rounded-2xl p-8" style={{ background: "rgba(20,0,0,0.7)", backdropFilter: "blur(16px)", border: "1px solid rgba(185,28,28,0.25)" }}>

          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-6">
            <MarketBoothLogo />
            <span className="font-display font-bold text-xl tracking-tight text-white">
              Trini<span className="text-red-500">Market</span>
            </span>
          </div>

          <h1 className="font-display font-bold text-2xl text-white mb-1">Set new password</h1>
          <p className="text-sm text-red-200/60 mb-6">Choose a strong password for your account.</p>

          {!ready && (
            <div className="flex items-center gap-3 text-sm text-red-200/50">
              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              Verifying reset link…
            </div>
          )}

          {ready && (
            <>
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-red-100/80 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full px-4 py-2.5 text-sm border text-white placeholder-red-200/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all"
                    style={{ background: "rgba(60,0,0,0.5)", borderColor: "rgba(185,28,28,0.3)" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-red-100/80 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat your password"
                    className="w-full px-4 py-2.5 text-sm border text-white placeholder-red-200/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all"
                    style={{ background: "rgba(60,0,0,0.5)", borderColor: "rgba(185,28,28,0.3)" }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 text-white font-semibold py-3 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Updating…" : "Update Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function MarketBoothLogo() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="34" height="34" rx="9" fill="#7f1d1d" />
      <path d="M5 14 L17 8 L29 14 Z" fill="#ef4444" />
      <path d="M5 14 Q8 17 11 14 Q14 17 17 14 Q20 17 23 14 Q26 17 29 14" stroke="#fca5a5" strokeWidth="1" fill="none" />
      <rect x="8" y="14" width="18" height="12" rx="1" fill="#991b1b" />
      <rect x="6" y="24" width="22" height="2.5" rx="1" fill="#ef4444" />
      <rect x="11" y="16.5" width="12" height="7" rx="1" fill="#fecaca" opacity="0.25" />
      <text x="17" y="23" textAnchor="middle" fontSize="5" fontWeight="bold" fill="white" fontFamily="sans-serif">TM</text>
    </svg>
  );
}
