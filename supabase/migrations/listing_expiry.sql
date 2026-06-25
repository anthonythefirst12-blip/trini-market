-- Add expires_at column to listings
ALTER TABLE listings ADD COLUMN IF NOT EXISTS expires_at timestamptz;

-- Set existing listings to expire 30 days from creation (or now if that's already past)
UPDATE listings
SET expires_at = GREATEST(created_at + interval '30 days', now() + interval '7 days')
WHERE expires_at IS NULL;

-- Index for efficient expiry queries
CREATE INDEX IF NOT EXISTS listings_expires_at_idx ON listings (expires_at);

-- Filter expired listings out of all public queries via a view (optional)
-- Alternatively, use .gt("expires_at", new Date().toISOString()) in queries

-- Scheduled cleanup: auto-delete listings expired more than 7 days ago
-- Run this as a cron job in Supabase Dashboard > Database > Extensions > pg_cron:
--
-- SELECT cron.schedule(
--   'delete-expired-listings',
--   '0 3 * * *',   -- 3am daily
--   $$DELETE FROM listings WHERE expires_at < now() - interval '7 days'$$
-- );
