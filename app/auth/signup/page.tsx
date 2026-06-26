"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/Button";

const floatingIcons = [
  { icon: "🌴", top: "8%", left: "6%", animation: "animate-float-slow", size: "text-5xl", opacity: "opacity-20", delay: "0s" },
  { icon: "🚗", top: "25%", left: "85%", animation: "animate-float", size: "text-4xl", opacity: "opacity-15", delay: "0.7s" },
  { icon: "🏠", top: "65%", left: "4%", animation: "animate-float-reverse", size: "text-4xl", opacity: "opacity-20", delay: "1.2s" },
  { icon: "💎", top: "80%", left: "88%", animation: "animate-float-slow", size: "text-3xl", opacity: "opacity-15", delay: "2s" },
  { icon: "📱", top: "45%", left: "92%", animation: "animate-float", size: "text-3xl", opacity: "opacity-20", delay: "0.4s" },
  { icon: "🛍️", top: "88%", left: "20%", animation: "animate-float-reverse", size: "text-4xl", opacity: "opacity-15", delay: "1.6s" },
  { icon: "⚡", top: "12%", left: "70%", animation: "animate-float", size: "text-3xl", opacity: "opacity-20", delay: "2.3s" },
  { icon: "🎵", top: "55%", left: "1%", animation: "animate-float-slow", size: "text-3xl", opacity: "opacity-10", delay: "0.9s" },
];

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { name: form.name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("sellers").insert({
        id: data.user.id,
        user_id: data.user.id,
        name: form.name,
        avatar: `https://i.pravatar.cc/80?u=${data.user.id}`,
        joined_date: new Date().toISOString().slice(0, 10),
        rating: 0,
        review_count: 0,
        location: "",
        verified: false,
        is_pro: false,
        listing_count: 0,
      });
    }

    if (data.user) {
      fetch("/api/email/welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name }),
      }).catch(() => {});
    }

    setLoading(false);

    if (data.session) {
      window.location.href = "/dashboard";
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden bg-slate-900">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 60% 30%, #1e3a5f 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, #1d4ed8 0%, transparent 45%)",
        }} />
        <div className="relative z-10 w-full max-w-md">
          <div className="absolute -inset-0.5 rounded-2xl neon-cyan opacity-50" />
          <div className="relative glass-dark rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">📧</div>
            <h2 className="font-display font-bold text-xl text-white mb-2">Check your email</h2>
            <p className="text-sm text-slate-400">
              We sent a confirmation link to <strong className="text-white">{form.email}</strong>. Click it to activate your account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 overflow-hidden bg-slate-900">
      {/* Mesh gradient */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 70% 30%, #1e3a5f 0%, transparent 55%), radial-gradient(ellipse at 20% 70%, #0f4c75 0%, transparent 45%), radial-gradient(ellipse at 90% 80%, #0f172a 0%, transparent 50%)",
      }} />

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle, #7dd3fc 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
      }} />

      {/* Neon glow orbs */}
      <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full animate-pulse-glow" style={{
        background: "radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)",
        filter: "blur(35px)",
      }} />
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full animate-pulse-glow" style={{
        background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)",
        filter: "blur(30px)",
        animationDelay: "2s",
      }} />

      {/* Floating icons */}
      {floatingIcons.map((item, i) => (
        <div
          key={i}
          className={`absolute ${item.animation} ${item.size} ${item.opacity} pointer-events-none select-none`}
          style={{ top: item.top, left: item.left, animationDelay: item.delay, filter: "drop-shadow(0 0 8px rgba(34,211,238,0.5))" }}
        >
          {item.icon}
        </div>
      ))}

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="absolute -inset-0.5 rounded-2xl neon-cyan opacity-50" />
        <div className="relative glass-dark rounded-2xl p-8">
          <div className="flex items-center gap-2.5 mb-6">
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="34" height="34" rx="9" fill="url(#signupLogoGrad)" />
              <path d="M7 24V11l5.5 7 4.5-6 4.5 6 5.5-7v13" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <rect x="7" y="26" width="20" height="2" rx="1" fill="rgba(255,255,255,0.4)" />
              <defs>
                <linearGradient id="signupLogoGrad" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
            </svg>
            <span className="font-display font-bold text-xl text-white tracking-tight">Trini<span className="text-cyan-400">Market</span></span>
          </div>

          <h1 className="font-display font-bold text-2xl text-white mb-1">Create your account</h1>
          <p className="text-sm text-slate-400 mb-6">Start buying and selling across Trinidad &amp; Tobago.</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Marcus Phillip"
                className="w-full px-4 py-2.5 text-sm bg-slate-800/60 border border-slate-600 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 text-sm bg-slate-800/60 border border-slate-600 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full px-4 py-2.5 text-sm bg-slate-800/60 border border-slate-600 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Confirm Password</label>
              <input
                type="password"
                required
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                placeholder="Repeat your password"
                className="w-full px-4 py-2.5 text-sm bg-slate-800/60 border border-slate-600 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <Button type="submit" fullWidth size="lg" disabled={loading}>
              {loading ? "Creating account…" : "Create Account"}
            </Button>
          </form>

          <p className="text-sm text-center text-slate-400 mt-5">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
