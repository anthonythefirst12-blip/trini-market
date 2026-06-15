"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 overflow-hidden bg-slate-900">
      {/* Mesh gradient */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 30% 40%, #1e3a5f 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, #1d4ed8 0%, transparent 45%), radial-gradient(ellipse at 10% 80%, #0f172a 0%, transparent 50%)",
      }} />

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle, #93c5fd 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
      }} />

      {/* Neon glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full animate-pulse-glow" style={{
        background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)",
        filter: "blur(30px)",
      }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full animate-pulse-glow" style={{
        background: "radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)",
        filter: "blur(40px)",
        animationDelay: "1.5s",
      }} />

      {/* Floating icons */}
      {floatingIcons.map((item, i) => (
        <div
          key={i}
          className={`absolute ${item.animation} ${item.size} ${item.opacity} pointer-events-none select-none`}
          style={{ top: item.top, left: item.left, animationDelay: item.delay, filter: "drop-shadow(0 0 8px rgba(59,130,246,0.6))" }}
        >
          {item.icon}
        </div>
      ))}

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Neon border glow */}
        <div className="absolute -inset-0.5 rounded-2xl neon-blue opacity-60" />
        <div className="relative glass-dark rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center neon-blue">
              <span className="text-white font-bold text-sm">TM</span>
            </div>
            <span className="font-display font-bold text-xl text-white">TriniMarket</span>
          </div>

          <h1 className="font-display font-bold text-2xl text-white mb-1">Welcome back</h1>
          <p className="text-sm text-slate-400 mb-6">Log in to your TriniMarket account.</p>

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
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 text-sm bg-slate-800/60 border border-slate-600 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Your password"
                className="w-full px-4 py-2.5 text-sm bg-slate-800/60 border border-slate-600 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <Button type="submit" fullWidth size="lg" disabled={loading}>
              {loading ? "Logging in…" : "Log In"}
            </Button>
          </form>

          <p className="text-sm text-center text-slate-400 mt-5">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
