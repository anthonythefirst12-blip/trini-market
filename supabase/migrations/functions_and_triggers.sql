-- ── increment_listing_views RPC ────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION increment_listing_views(p_listing_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE listings SET views = views + 1 WHERE id = p_listing_id;
END;
$$;

-- ── Auto-update comment_count on listings ──────────────────────────────────────
CREATE OR REPLACE FUNCTION update_listing_comment_count()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE listings SET comment_count = comment_count + 1 WHERE id = NEW.listing_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE listings SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.listing_id;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_listing_comment_count ON comments;
CREATE TRIGGER trg_listing_comment_count
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_listing_comment_count();

-- ── Auto-update listing_count on sellers ───────────────────────────────────────
CREATE OR REPLACE FUNCTION update_seller_listing_count()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE sellers SET listing_count = listing_count + 1 WHERE id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE sellers SET listing_count = GREATEST(listing_count - 1, 0) WHERE id = OLD.user_id;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_seller_listing_count ON listings;
CREATE TRIGGER trg_seller_listing_count
  AFTER INSERT OR DELETE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_seller_listing_count();

-- Backfill current listing counts for existing sellers
UPDATE sellers s
SET listing_count = (
  SELECT COUNT(*) FROM listings l WHERE l.user_id = s.id
);
