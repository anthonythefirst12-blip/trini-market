"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface ContactFormProps {
  listingId: string;
  listingTitle: string;
  price: string;
}

export function ContactForm({ listingTitle, price }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="text-3xl mb-2">✅</div>
        <p className="font-semibold text-gray-800 text-sm">Message sent!</p>
        <p className="text-gray-400 text-xs mt-1">The seller will get back to you soon.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="space-y-3"
    >
      <input type="hidden" name="listing" value={listingTitle} />
      <input
        name="name"
        type="text"
        required
        placeholder="Your name"
        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="your@email.com"
        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        name="phone"
        type="tel"
        placeholder="Phone (optional)"
        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        name="message"
        required
        rows={3}
        defaultValue={`Hi, I'm interested in "${listingTitle}" listed at ${price}. Is it still available?`}
        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      <Button type="submit" fullWidth size="lg">Send Message</Button>
    </form>
  );
}
