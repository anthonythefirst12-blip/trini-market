"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

interface Props {
  sellerId: string;
  sellerName: string;
  listingId: string;
}

export function RatingForm({ sellerId, sellerName, listingId }: Props) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [existing, setExisting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isOwn, setIsOwn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      // Check if this is the seller's own listing
      const { data: sellerData } = await supabase
        .from("sellers")
        .select("id")
        .eq("id", sellerId)
        .eq("id", user.id)
        .maybeSingle();
      if (sellerData) { setIsOwn(true); setLoading(false); return; }

      const { data } = await supabase
        .from("seller_reviews")
        .select("rating, comment")
        .eq("user_id", user.id)
        .eq("seller_id", sellerId)
        .maybeSingle();
      if (data) {
        setExisting(true);
        setRating(data.rating);
        setComment(data.comment ?? "");
        setSubmitted(true);
      }
      setLoading(false);
    };
    check();
  }, [sellerId]);

  const submit = async () => {
    if (!rating) return;
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/auth/login"); return; }

    await supabase.from("seller_reviews").upsert({
      user_id: user.id,
      seller_id: sellerId,
      listing_id: listingId,
      rating,
      comment: comment.trim() || null,
    }, { onConflict: "user_id,seller_id" });

    await supabase.rpc("update_seller_rating", { p_seller_id: sellerId });
    setSubmitted(true);
    setSaving(false);
    router.refresh();
  };

  if (loading || isOwn) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-display font-semibold text-sm text-gray-900 uppercase tracking-wide mb-4">
        Rate this Seller
      </h3>

      {submitted ? (
        <div className="text-center py-3">
          <div className="flex justify-center gap-1 mb-2">
            {[1,2,3,4,5].map((s) => (
              <span key={s} className={`text-xl ${s <= rating ? "text-amber-400" : "text-gray-200"}`}>★</span>
            ))}
          </div>
          <p className="text-sm text-gray-600 font-medium">
            {existing ? "Your review for" : "Thanks for rating"} {sellerName}!
          </p>
          {comment && <p className="text-xs text-gray-400 mt-1 italic">&ldquo;{comment}&rdquo;</p>}
          <button
            onClick={() => setSubmitted(false)}
            className="mt-3 text-xs text-blue-600 hover:underline"
          >
            Edit review
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-1 justify-center">
            {[1,2,3,4,5].map((s) => (
              <button
                key={s}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(s)}
                className={`text-2xl transition-transform hover:scale-110 ${s <= (hover || rating) ? "text-amber-400" : "text-gray-200"}`}
              >
                ★
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-center text-xs text-gray-500">
              {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
            </p>
          )}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Leave a comment (optional)…"
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <button
            onClick={submit}
            disabled={!rating || saving}
            className="w-full bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Submitting…" : "Submit Review"}
          </button>
        </div>
      )}
    </div>
  );
}
