-- 004_create_cards.sql
-- Retro cards

create table if not exists cards (
  id                    uuid primary key default gen_random_uuid(),
  retro_id              uuid not null references retros(id) on delete cascade,
  category_id           uuid not null references categories(id) on delete cascade,
  author_id             uuid not null references users(id) on delete restrict,
  text                  text not null,
  sort_order            int not null default 0,
  group_label           text,
  is_discussed          boolean not null default false,
  carried_from_retro_id uuid references retros(id) on delete set null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- Indexes
create index if not exists idx_cards_retro_id on cards(retro_id);
create index if not exists idx_cards_category_id on cards(category_id);
create index if not exists idx_cards_author_id on cards(author_id);
create index if not exists idx_cards_carried_from on cards(carried_from_retro_id) where carried_from_retro_id is not null;

-- Trigger
create trigger trg_cards_updated_at
  before update on cards
  for each row execute function update_updated_at_column();

-- Enable RLS
alter table cards enable row level security;
