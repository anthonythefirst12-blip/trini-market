"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

interface Props {
  listingId: string;
  sellerId: string;
  listingTitle: string;
  listingImage?: string;
  askingPrice: number;
  currency: string;
}

export function MakeOfferButton({ listingId, sellerId, listingTitle, listingImage, askingPrice, currency }: Props) {
  const [open, setOpen] = useState(false);
  const [offer, setOffer] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatted = new Intl.NumberFormat("en-TT", { style: "currency", currency, minimumFractionDigits: 0 }).format(askingPrice);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(offer);
    if (!amount || amount <= 0) { setError("Please enter a valid offer amount."); return; }
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("You must be logged in to make an offer."); setLoading(false); return; }
    if (user.id === sellerId) { setError("You cannot make an offer on your own listing."); setLoading(false); return; }

    const offerFormatted = new Intl.NumberFormat("en-TT", { style: "currency", currency, minimumFractionDigits: 0 }).format(amount);
    const body = `💰 Offer: ${offerFormatted} for "${listingTitle}" (asking ${formatted})${note ? `\n\n${note}` : ""}`;

    const { error: msgError } = await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: sellerId,
      listing_id: listingId,
      listing_title: listingTitle,
      listing_image: listingImage ?? null,
      listing_price: formatted,
      text: body,
    });

    setLoading(false);
    if (msgError) { setError("Failed to send offer. Please try again."); return; }

    const params = new URLSearchParams({
      to: sellerId,
      listing: listingId,
      title: listingTitle,
      price: formatted,
      ...(listingImage ? { image: listingImage } : {}),
    });
    window.location.href = `/messages?${params.toString()}`;
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full px-4 py-2.5 bg-white border-2 border-red-600 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 active:scale-95 transition-all duration-200"
      >
        💬 Make an Offer
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-gray-900">Make an Offer</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>

            <p className="text-gray-500 text-sm mb-4">
              Asking price: <span className="font-semibold text-gray-800">{formatted}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Your Offer ({currency})</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={offer}
                  onChange={(e) => setOffer(e.target.value)}
                  placeholder={`e.g. ${Math.round(askingPrice * 0.85)}`}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Note (optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note to the seller…"
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>
              {error && <p className="text-red-600 text-xs">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {loading ? "Sending…" : "Send Offer"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
