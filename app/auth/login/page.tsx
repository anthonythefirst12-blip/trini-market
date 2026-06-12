"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/Button";

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
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md w-full">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TM</span>
          </div>
          <span className="font-display font-bold text-xl text-gray-900">TriniMarket</span>
        </div>

        <h1 className="font-display font-bold text-2xl text-gray-900 mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500 mb-6">Log in to your TriniMarket account.</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Your password"
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button type="submit" fullWidth size="lg" disabled={loading}>
            {loading ? "Logging in…" : "Log In"}
          </Button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-5">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-blue-600 hover:underline font-medium">Sign up free</Link>
        </p>
      </div>
    </div>
  );
}
