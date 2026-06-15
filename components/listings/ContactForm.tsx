"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

interface ContactFormProps {
  listingId: string;
  listingTitle: string;
  price: string;
  sellerId: string;
  listingImage?: string;
}

export function ContactForm({ listingId, listingTitle, price, sellerId, listingImage }: ContactFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState(`Hi, I'm interested in "${listingTitle}" listed at ${price}. Is it still available?`);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) { router.push("/auth/login"); return; }
    if (!message.trim()) return;
    setSending(true);
    setError("");

    const supabase = createClient();
    const { error: err } = await supabase.from("messages").insert({
      sender_id: userId,
      receiver_id: sellerId,
      listing_id: listingId,
      listing_title: listingTitle,
      listing_image: listingImage ?? null,
      listing_price: price,
      text: message.trim(),
    });

    setSending(false);
    if (err) { setError(err.message); return; }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="text-3xl mb-2">✅</div>
        <p className="font-semibold text-gray-800 text-sm">Message sent!</p>
        <p className="text-gray-400 text-xs mt-1">The seller will get back to you soon.</p>
        <button
          onClick={() => router.push("/messages")}
          className="mt-3 text-xs text-blue-600 hover:underline"
        >
          View in Messages →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSend} className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">
          {error}
        </div>
      )}
      <textarea
        required
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      {!userId && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
          You need to <button type="button" onClick={() => router.push("/auth/login")} className="underline font-medium">log in</button> to send a message.
        </p>
      )}
      <Button type="submit" fullWidth size="lg" disabled={sending}>
        {sending ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
