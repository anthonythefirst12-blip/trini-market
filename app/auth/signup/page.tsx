"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/Button";

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

    // Send welcome email (fire and forget)
    if (data.user) {
      fetch("/api/email/welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name }),
      }).catch(() => {});
    }

    setLoading(false);

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">📧</div>
          <h2 className="font-display font-bold text-xl text-gray-900 mb-2">Check your email</h2>
          <p className="text-sm text-gray-500">
            We sent a confirmation link to <strong>{form.email}</strong>. Click it to activate your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md w-full">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TM</span>
          </div>
          <span className="font-display font-bold text-xl text-gray-900">TriniMarket</span>
        </div>

        <h1 className="font-display font-bold text-2xl text-gray-900 mb-1">Create your account</h1>
        <p className="text-sm text-gray-500 mb-6">Start buying and selling across Trinidad &amp; Tobago.</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Marcus Phillip"
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
              placeholder="At least 6 characters"
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              required
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              placeholder="Repeat your password"
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button type="submit" fullWidth size="lg" disabled={loading}>
            {loading ? "Creating account…" : "Create Account"}
          </Button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-5">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
}
