"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/email/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromName: form.name, fromEmail: form.email, subject: form.subject, message: form.message }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setDone(true);
    } catch {
      setError("Sorry, we couldn't send your message. Please try again or email us directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <section className="bg-gradient-to-br from-red-900 via-red-800 to-gray-900 py-16 px-4 text-center">
        <span className="inline-block bg-white/10 border border-white/20 text-white/80 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-5">Contact Us</span>
        <h1 className="font-display font-bold text-4xl text-white mb-4">Get in Touch</h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto">Have a question, problem, or feedback? We&apos;re here to help.</p>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2 className="font-display font-bold text-xl text-gray-900 mb-6">How can we help?</h2>
            <div className="space-y-5">
              {[
                { emoji: "🛡️", title: "Report a Problem", desc: "Found a scam or fake listing? Use the Report button on the listing page, or email us directly." },
                { emoji: "💳", title: "Payment Issues", desc: "Problems with a WiPay transaction or wallet balance? Include your order ID in your message." },
                { emoji: "🏪", title: "Seller Support", desc: "Questions about Pro accounts, Featured listings, or your storefront? We'll get back to you within 24 hours." },
                { emoji: "💡", title: "General Feedback", desc: "We're always improving TriniSell. Tell us what you'd like to see." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="text-2xl shrink-0 mt-0.5">{item.emoji}</div>
                  <div>
                    <p className="text-gray-900 font-semibold text-sm mb-1">{item.title}</p>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-white border border-gray-200 rounded-xl">
              <p className="text-gray-700 text-sm font-semibold mb-1">Email us directly</p>
              <a href="mailto:support@trinisell.tt" className="text-red-600 hover:text-red-700 text-sm transition-colors">
                support@trinisell.tt
              </a>
              <p className="text-gray-400 text-xs mt-2">We respond within 24–48 hours on business days.</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            {done ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="font-display font-bold text-gray-900 text-lg mb-2">Message sent!</h3>
                <p className="text-gray-500 text-sm">We&apos;ll get back to you within 24–48 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                    <option value="">Select a topic…</option>
                    <option>Report a scam or fake listing</option>
                    <option>Payment or wallet issue</option>
                    <option>Account problem</option>
                    <option>Pro / Featured listing question</option>
                    <option>General feedback</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    placeholder="Describe your issue or question…" />
                </div>
                <button type="submit" disabled={sending}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors">
                  {sending ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
