-- ── Listings: missing columns ─────────────────────────────────────────────────
ALTER TABLE listings ADD COLUMN IF NOT EXISTS sold boolean NOT NULL DEFAULT false;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS views integer NOT NULL DEFAULT 0;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS comment_count integer NOT NULL DEFAULT 0;

-- ── Saved listings ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, listing_id)
);
ALTER TABLE saved_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own saved listings"
  ON saved_listings FOR ALL USING (auth.uid() = user_id);

-- ── Seller reviews ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS seller_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
  listing_id uuid REFERENCES listings(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, seller_id)
);
ALTER TABLE seller_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read reviews"
  ON seller_reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can write reviews"
  ON seller_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews"
  ON seller_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS seller_reviews_seller_id_idx ON seller_reviews(seller_id);

-- RPC to recalculate seller rating after a review is submitted
CREATE OR REPLACE FUNCTION update_seller_rating(p_seller_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE sellers
  SET
    rating = (SELECT COALESCE(AVG(rating), 0) FROM seller_reviews WHERE seller_id = p_seller_id),
    review_count = (SELECT COUNT(*) FROM seller_reviews WHERE seller_id = p_seller_id)
  WHERE id = p_seller_id;
END;
$$;

-- ── Reports ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  reason text NOT NULL,
  details text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can submit reports"
  ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Admins can read reports"
  ON reports FOR SELECT USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE email = 'ezekiel.larose14@icloud.com'
  ));
CREATE POLICY "Admins can update reports"
  ON reports FOR UPDATE USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE email = 'ezekiel.larose14@icloud.com'
  ));
CREATE INDEX IF NOT EXISTS reports_listing_id_idx ON reports(listing_id);
CREATE INDEX IF NOT EXISTS reports_status_idx ON reports(status);

-- ── Wallets ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  balance_ttd numeric NOT NULL DEFAULT 0 CHECK (balance_ttd >= 0),
  created_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own wallet"
  ON wallets FOR ALL USING (auth.uid() = user_id);

-- ── Wallet transactions ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_ttd numeric NOT NULL,
  type text NOT NULL CHECK (type IN ('topup', 'charge', 'refund')),
  description text,
  reference text,
  created_at timestamptz DEFAULT now() NOT NULL
);
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own transactions"
  ON wallet_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service can insert transactions"
  ON wallet_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS wallet_transactions_user_id_idx ON wallet_transactions(user_id);
