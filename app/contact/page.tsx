"use client";

import { useState } from "react";
import type { Metadata } from "next";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSending(false);
    setDone(true);
  };

  return (
    <div className="bg-slate-900 min-h-screen">
      <section className="relative overflow-hidden py-16 border-b border-slate-800">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 50%, #1e3a5f 0%, transparent 60%)" }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-5">Contact Us</span>
          <h1 className="font-display font-bold text-4xl text-white mb-4">Get in Touch</h1>
          <p className="text-slate-300 text-lg max-w-xl mx-auto">Have a question, problem, or feedback? We&apos;re here to help.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2 className="font-display font-bold text-xl text-white mb-6">How can we help?</h2>
            <div className="space-y-5">
              {[
                { emoji: "🛡️", title: "Report a Problem", desc: "Found a scam or fake listing? Use the Report button on the listing page, or email us directly." },
                { emoji: "💳", title: "Payment Issues", desc: "Problems with a WiPay transaction or wallet balance? Include your order ID in your message." },
                { emoji: "🏪", title: "Seller Support", desc: "Questions about Pro accounts, Featured listings, or your storefront? We'll get back to you within 24 hours." },
                { emoji: "💡", title: "General Feedback", desc: "We're always improving TriniMarket. Tell us what you'd like to see." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="text-2xl shrink-0 mt-0.5">{item.emoji}</div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">{item.title}</p>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-slate-800 border border-slate-700 rounded-xl">
              <p className="text-slate-300 text-sm font-semibold mb-1">Email us directly</p>
              <a href="mailto:support@trinimarket.tt" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                support@trinimarket.tt
              </a>
              <p className="text-slate-500 text-xs mt-2">We respond within 24–48 hours on business days.</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            {done ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="font-display font-bold text-white text-lg mb-2">Message sent!</h3>
                <p className="text-slate-400 text-sm">We&apos;ll get back to you within 24–48 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
                  <select required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                  <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Describe your issue or question…" />
                </div>
                <button type="submit" disabled={sending}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors">
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
