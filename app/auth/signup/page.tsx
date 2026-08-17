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

  const handleOAuth = async (provider: "google" | "apple") => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

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
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=1d4ed8&color=fff&size=80`,
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
      <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden" style={{ background: "#1a0000" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 40%, #3b0000 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, #7f1d1d 0%, transparent 45%)" }} />
        <div className="relative z-10 w-full max-w-md text-center">
          <div className="relative rounded-2xl p-8" style={{ background: "rgba(20,0,0,0.7)", backdropFilter: "blur(16px)", border: "1px solid rgba(185,28,28,0.25)" }}>
            <div className="text-5xl mb-4">📧</div>
            <h2 className="font-display font-bold text-xl text-white mb-2">Check your email</h2>
            <p className="text-sm text-red-200/60">
              We sent a confirmation link to <strong className="text-white">{form.email}</strong>. Click it to activate your account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 overflow-hidden" style={{ background: "#1a0000" }}>
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 30% 40%, #3b0000 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, #7f1d1d 0%, transparent 45%)",
      }} />
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle, #fca5a5 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
      }} />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full animate-pulse-glow" style={{
        background: "radial-gradient(circle, rgba(185,28,28,0.3) 0%, transparent 70%)",
        filter: "blur(30px)",
      }} />

      {floatingIcons.map((item, i) => (
        <div key={i} className={`absolute ${item.animation} ${item.size} ${item.opacity} pointer-events-none select-none`}
          style={{ top: item.top, left: item.left, animationDelay: item.delay, filter: "drop-shadow(0 0 8px rgba(220,38,38,0.5))" }}>
          {item.icon}
        </div>
      ))}

      <div className="relative z-10 w-full max-w-md">
        <div className="absolute -inset-0.5 rounded-2xl opacity-60" style={{ boxShadow: "0 0 20px rgba(185,28,28,0.6), 0 0 40px rgba(185,28,28,0.2)" }} />
        <div className="relative rounded-2xl p-8" style={{ background: "rgba(20,0,0,0.7)", backdropFilter: "blur(16px)", border: "1px solid rgba(185,28,28,0.25)" }}>

          <div className="flex items-center gap-2.5 mb-6">
            <img src="/icon-192.png" alt="TriniSell" width={34} height={34} className="rounded-[9px]" />
            <span className="font-display font-bold text-xl tracking-tight text-white">Trini<span className="text-red-500">Market</span></span>
          </div>

          <h1 className="font-display font-bold text-2xl text-white mb-1">Create your account</h1>
          <p className="text-sm text-red-200/60 mb-5">Start buying and selling across Trinidad &amp; Tobago.</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-red-100/80 mb-1">Full Name</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Marcus Phillip"
                className="w-full px-4 py-2.5 text-sm border text-white placeholder-red-200/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all"
                style={{ background: "rgba(60,0,0,0.5)", borderColor: "rgba(185,28,28,0.3)" }} />
            </div>
            <div>
              <label className="block text-sm font-medium text-red-100/80 mb-1">Email Address</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 text-sm border text-white placeholder-red-200/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all"
                style={{ background: "rgba(60,0,0,0.5)", borderColor: "rgba(185,28,28,0.3)" }} />
            </div>
            <div>
              <label className="block text-sm font-medium text-red-100/80 mb-1">Password</label>
              <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full px-4 py-2.5 text-sm border text-white placeholder-red-200/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all"
                style={{ background: "rgba(60,0,0,0.5)", borderColor: "rgba(185,28,28,0.3)" }} />
            </div>
            <div>
              <label className="block text-sm font-medium text-red-100/80 mb-1">Confirm Password</label>
              <input type="password" required value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                placeholder="Repeat your password"
                className="w-full px-4 py-2.5 text-sm border text-white placeholder-red-200/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all"
                style={{ background: "rgba(60,0,0,0.5)", borderColor: "rgba(185,28,28,0.3)" }} />
            </div>
            <Button type="submit" fullWidth size="lg" disabled={loading}>
              {loading ? "Creating account…" : "Create Account"}
            </Button>
          </form>

          <p className="text-sm text-center text-red-200/50 mt-5">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-red-400 hover:text-red-300 font-medium transition-colors">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
