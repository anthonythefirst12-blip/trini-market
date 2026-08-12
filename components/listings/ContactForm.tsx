"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

interface ContactFormProps {
  listingId: string;
  listingTitle: string;
  price: string;
  sellerId: string;
  listingImage?: string;
}

export function ContactForm({ listingId, listingTitle, price, sellerId, listingImage }: ContactFormProps) {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  const handleClick = () => {
    if (!userId) {
      window.location.href = "/auth/login";
      return;
    }
    if (userId === sellerId) return;
    const params = new URLSearchParams({
      to: sellerId,
      listing: listingId,
      title: listingTitle,
      price,
      ...(listingImage ? { image: listingImage } : {}),
    });
    window.location.href = `/messages?${params.toString()}`;
  };

  if (userId === sellerId) return null;

  return (
    <div className="space-y-3">
      {!userId && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
          You need to{" "}
          <button
            type="button"
            onClick={() => { window.location.href = "/auth/login"; }}
            className="underline font-medium"
          >
            log in
          </button>{" "}
          to message the seller.
        </p>
      )}
      <button
        onClick={handleClick}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
      >
        Message Seller
      </button>
    </div>
  );
}
