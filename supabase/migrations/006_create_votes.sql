-- 006_create_votes.sql
-- Card votes (one per user per card, enforced by unique constraint)

create table if not exists votes (
  id         uuid primary key default gen_random_uuid(),
  card_id    uuid not null references cards(id) on delete cascade,
  user_id    uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(card_id, user_id)
);

-- Indexes
create index if not exists idx_votes_card_id on votes(card_id);
create index if not exists idx_votes_user_id on votes(user_id);

-- Enable RLS
alter table votes enable row level security;
