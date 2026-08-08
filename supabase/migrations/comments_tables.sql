-- Comments table
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete cascade not null,
  author_name text not null,
  author_avatar text not null default '',
  text text not null check (char_length(text) <= 500),
  created_at timestamptz default now() not null
);

-- Comment replies table
create table if not exists comment_replies (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid references comments(id) on delete cascade not null,
  author_name text not null,
  author_avatar text not null default '',
  text text not null check (char_length(text) <= 500),
  created_at timestamptz default now() not null
);

-- Enable RLS
alter table comments enable row level security;
alter table comment_replies enable row level security;

-- Anyone can read; only authenticated users can insert
create policy "Anyone can read comments"
  on comments for select using (true);

create policy "Authenticated users can post comments"
  on comments for insert with check (auth.uid() is not null);

create policy "Anyone can read replies"
  on comment_replies for select using (true);

create policy "Authenticated users can post replies"
  on comment_replies for insert with check (auth.uid() is not null);

-- Indexes
create index if not exists comments_listing_id_idx on comments(listing_id);
create index if not exists comment_replies_comment_id_idx on comment_replies(comment_id);
