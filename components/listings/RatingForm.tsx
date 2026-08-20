"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";

interface Props {
  sellerId: string;
  sellerName: string;
  listingId: string;
}

export function RatingForm({ sellerId, sellerName, listingId }: Props) {
  const [userId, setUserId] = useState<string | null>(null);
  const [canReview, setCanReview] = useState<boolean | null>(null); // null = loading
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function check() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setCanReview(false); return; }
        if (user.id === sellerId) { setCanReview(false); return; }

        setUserId(user.id);

        // Check if already reviewed this seller for this listing
        const { data: existing } = await supabase
          .from("seller_reviews")
          .select("id")
          .eq("user_id", user.id)
          .eq("seller_id", sellerId)
          .eq("listing_id", listingId)
          .maybeSingle();

        if (existing) { setAlreadyReviewed(true); setCanReview(false); return; }

        // Check if buyer has previously messaged this seller
        const { data: msgs } = await supabase
          .from("messages")
          .select("id")
          .eq("sender_id", user.id)
          .eq("receiver_id", sellerId)
          .limit(1);

        setCanReview(!!(msgs && msgs.length > 0));
      } catch {
        setCanReview(false);
      }
    }

    check();
  }, [sellerId, listingId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setError("Please select a star rating."); return; }
    setSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: insertError } = await supabase.from("seller_reviews").insert({
        user_id: userId,
        seller_id: sellerId,
        listing_id: listingId,
        rating,
        comment: comment.trim() || null,
      });

      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Don't render anything while loading or if not eligible
  if (canReview === null) return null;
  if (!canReview && !alreadyReviewed) return null;

  if (alreadyReviewed) {
    return (
      <div className="rating-form-wrap rounded-xl border p-4 text-center">
        <p className="rating-form-muted text-xs">You have already reviewed this seller for this listing.</p>
        <style>{ratingStyles}</style>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="rating-form-wrap rounded-xl border p-5 text-center">
        <style>{ratingStyles}</style>
        <div className="text-amber-400 text-2xl mb-2">★★★★★</div>
        <p className="rating-form-heading font-semibold text-sm mb-1">Review submitted!</p>
        <p className="rating-form-muted text-xs">Thank you for your feedback.</p>
      </div>
    );
  }

  const display = hovered || rating;

  return (
    <div className="rating-form-wrap rounded-xl border p-5">
      <style>{ratingStyles}</style>
      <h3 className="rating-form-heading font-display font-semibold text-sm uppercase tracking-wide mb-4">
        Rate {sellerName}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star picker */}
        <div>
          <p className="rating-form-muted text-xs mb-2">Your rating</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                onMouseEnter={() => setHovered(s)}
                onMouseLeave={() => setHovered(0)}
                aria-label={`${s} star${s !== 1 ? "s" : ""}`}
                className="focus:outline-none transition-transform active:scale-90"
              >
                <svg
                  width={28}
                  height={28}
                  viewBox="0 0 24 24"
                  fill={s <= display ? "#f59e0b" : "none"}
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="rating-form-muted text-xs mt-1">
              {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
            </p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label className="rating-form-muted text-xs block mb-1.5" htmlFor="review-comment">
            Comment <span className="opacity-60">(optional)</span>
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 500))}
            rows={3}
            placeholder="Share your experience with this seller..."
            className="rating-form-textarea w-full rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <p className="rating-form-muted text-xs text-right mt-1">{comment.length}/500</p>
        </div>

        {error && <p className="text-red-500 text-xs">{error}</p>}

        <button
          type="submit"
          disabled={submitting || rating === 0}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-2.5 rounded-xl transition-colors"
        >
          {submitting ? "Submitting…" : "Submit Review"}
        </button>
      </form>
    </div>
  );
}

const ratingStyles = `
  .rating-form-wrap { background: #ffffff; border-color: #e5e7eb; }
  .rating-form-heading { color: #111827; }
  .rating-form-muted { color: #6b7280; }
  .rating-form-textarea { background: #f9fafb; border: 1px solid #e5e7eb; color: #111827; }
  .rating-form-textarea::placeholder { color: #9ca3af; }

  [data-theme="dark"] .rating-form-wrap { background: #1c1c1c; border-color: #2a2a2a; }
  [data-theme="dark"] .rating-form-heading { color: #f9fafb; }
  [data-theme="dark"] .rating-form-muted { color: #9ca3af; }
  [data-theme="dark"] .rating-form-textarea { background: #111111; border-color: #2a2a2a; color: #f9fafb; }
  [data-theme="dark"] .rating-form-textarea::placeholder { color: rgba(255,255,255,0.3); }

  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) .rating-form-wrap { background: #1c1c1c; border-color: #2a2a2a; }
    :root:not([data-theme="light"]) .rating-form-heading { color: #f9fafb; }
    :root:not([data-theme="light"]) .rating-form-muted { color: #9ca3af; }
    :root:not([data-theme="light"]) .rating-form-textarea { background: #111111; border-color: #2a2a2a; color: #f9fafb; }
    :root:not([data-theme="light"]) .rating-form-textarea::placeholder { color: rgba(255,255,255,0.3); }
  }
`;
