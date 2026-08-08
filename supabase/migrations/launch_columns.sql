-- Run this in Supabase → SQL Editor before launch

-- Required for banned user enforcement (middleware + admin panel)
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS banned boolean DEFAULT false;

-- Required for seller online presence indicator
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS last_seen timestamptz;

-- Index for fast banned-user lookups in middleware
CREATE INDEX IF NOT EXISTS sellers_banned_idx ON sellers (id) WHERE banned = true;
