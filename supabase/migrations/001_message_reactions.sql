-- Migration: Add message_reactions table
-- Run this in the Supabase SQL editor

create table if not exists message_reactions (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references messages(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  emoji text not null,
  created_at timestamptz default now(),
  unique (message_id, user_id, emoji) -- one reaction per emoji per user per message
);

-- Enable RLS
alter table message_reactions enable row level security;

-- Policy: authenticated users can read all reactions
create policy "Anyone can read reactions"
  on message_reactions for select
  using (auth.role() = 'authenticated');

-- Policy: users can insert their own reactions
create policy "Users can add reactions"
  on message_reactions for insert
  with check (auth.uid() = user_id);

-- Policy: users can delete their own reactions
create policy "Users can remove own reactions"
  on message_reactions for delete
  using (auth.uid() = user_id);
