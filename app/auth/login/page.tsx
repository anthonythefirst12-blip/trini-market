"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/Button";

const floatingIcons = [
  { icon: "🚗", top: "10%", left: "8%", animation: "animate-float", size: "text-4xl", opacity: "opacity-20", delay: "0s" },
  { icon: "🏠", top: "20%", left: "80%", animation: "animate-float-slow", size: "text-5xl", opacity: "opacity-15", delay: "1s" },
  { icon: "📱", top: "60%", left: "5%", animation: "animate-float-reverse", size: "text-3xl", opacity: "opacity-20", delay: "0.5s" },
  { icon: "💎", top: "75%", left: "85%", animation: "animate-float", size: "text-4xl", opacity: "opacity-15", delay: "2s" },
  { icon: "👗", top: "40%", left: "90%", animation: "animate-float-slow", size: "text-3xl", opacity: "opacity-20", delay: "1.5s" },
  { icon: "🛒", top: "85%", left: "15%", animation: "animate-float-reverse", size: "text-4xl", opacity: "opacity-15", delay: "0.8s" },
  { icon: "💻", top: "5%", left: "55%", animation: "animate-float", size: "text-3xl", opacity: "opacity-20", delay: "2.5s" },
  { icon: "🏄", top: "50%", left: "2%", animation: "animate-float-slow", size: "text-3xl", opacity: "opacity-10", delay: "1.2s" },
];

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unverified, setUnverified] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    setResending(true);
    const supabase = createClient();
    await supabase.auth.resend({ type: "signup", email: form.email });
    setResending(false);
    setResendSent(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUnverified(false);
    setResendSent(false);
    setLoading(true);
    const supabase = createClient();
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (loginError) {
      if (loginError.message.toLowerCase().includes("email not confirmed") || loginError.message.toLowerCase().includes("not confirmed")) {
        setUnverified(true);
      } else {
        setError(loginError.message === "Invalid login credentials" ? "Incorrect email or password." : loginError.message);
      }
      setLoading(false);
      return;
    }
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

      {/* Floating icons */}
      {floatingIcons.map((item, i) => (
        <div
          key={i}
          className={`absolute ${item.animation} ${item.size} ${item.opacity} pointer-events-none select-none`}
          style={{ top: item.top, left: item.left, animationDelay: item.delay, filter: "drop-shadow(0 0 8px rgba(220,38,38,0.5))" }}
        >
          {item.icon}
        </div>
      ))}

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Red neon border glow */}
        <div className="absolute -inset-0.5 rounded-2xl opacity-60" style={{ boxShadow: "0 0 20px rgba(185,28,28,0.6), 0 0 40px rgba(185,28,28,0.2)" }} />
        <div className="relative rounded-2xl p-8" style={{ background: "rgba(20,0,0,0.7)", backdropFilter: "blur(16px)", border: "1px solid rgba(185,28,28,0.25)" }}>

          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-6">
            <MarketBoothLogo />
            <span className="font-display font-bold text-xl tracking-tight text-white">
              Trini<span className="text-red-500">Market</span>
            </span>
          </div>

          <h1 className="font-display font-bold text-2xl text-white mb-1">Welcome back</h1>
          <p className="text-sm text-red-200/60 mb-6">Log in to your TriniMarket account.</p>

          {unverified && (
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm px-4 py-3 rounded-xl mb-5 space-y-2">
              <p className="font-medium">Please confirm your email first.</p>
              <p className="text-amber-300/70 text-xs">Check your inbox for a verification link from TriniMarket. It may be in your spam folder.</p>
              {resendSent ? (
                <p className="text-green-400 text-xs">✓ Verification email resent — check your inbox.</p>
              ) : (
                <button onClick={handleResend} disabled={resending} className="text-xs text-amber-400 underline hover:text-amber-300 transition-colors disabled:opacity-50">
                  {resending ? "Sending…" : "Resend verification email"}
                </button>
              )}
            </div>
          )}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}


          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-red-100/80 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 text-sm border text-white placeholder-red-200/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all"
                style={{ background: "rgba(60,0,0,0.5)", borderColor: "rgba(185,28,28,0.3)" }}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-red-100/80">Password</label>
                <Link href="/auth/forgot-password" className="text-xs text-red-400 hover:text-red-300 transition-colors">Forgot password?</Link>
              </div>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Your password"
                className="w-full px-4 py-2.5 text-sm border text-white placeholder-red-200/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all"
                style={{ background: "rgba(60,0,0,0.5)", borderColor: "rgba(185,28,28,0.3)" }}
              />
            </div>

            <Button type="submit" fullWidth size="lg" disabled={loading}>
              {loading ? "Logging in…" : "Log In"}
            </Button>
          </form>

          <p className="text-sm text-center text-red-200/50 mt-5">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-red-400 hover:text-red-300 font-medium transition-colors">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function MarketBoothLogo() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="34" height="34" rx="9" fill="#7f1d1d" />
      {/* Awning / roof */}
      <path d="M5 14 L17 8 L29 14 Z" fill="#ef4444" />
      {/* Awning scallop */}
      <path d="M5 14 Q8 17 11 14 Q14 17 17 14 Q20 17 23 14 Q26 17 29 14" stroke="#fca5a5" strokeWidth="1" fill="none" />
      {/* Stall body */}
      <rect x="8" y="14" width="18" height="12" rx="1" fill="#991b1b" />
      {/* Counter */}
      <rect x="6" y="24" width="22" height="2.5" rx="1" fill="#ef4444" />
      {/* Window/display */}
      <rect x="11" y="16.5" width="12" height="7" rx="1" fill="#fecaca" opacity="0.25" />
      {/* TM text */}
      <text x="17" y="23" textAnchor="middle" fontSize="5" fontWeight="bold" fill="white" fontFamily="sans-serif">TM</text>
    </svg>
  );
}
