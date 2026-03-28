-- 005_create_tags.sql
-- Tags and card-tag junction table

create table if not exists tags (
  id          uuid primary key default gen_random_uuid(),
  team_id     uuid not null references teams(id) on delete cascade,
  name        text not null,
  usage_count int not null default 0
);

-- Unique on team + lowercase name
create unique index if not exists idx_tags_team_name_unique
  on tags(team_id, lower(name));

-- Indexes
create index if not exists idx_tags_team_id on tags(team_id);

-- Enable RLS
alter table tags enable row level security;

-- Card-Tag junction
create table if not exists card_tags (
  id      uuid primary key default gen_random_uuid(),
  card_id uuid not null references cards(id) on delete cascade,
  tag_id  uuid not null references tags(id) on delete cascade,
  unique(card_id, tag_id)
);

-- Indexes
create index if not exists idx_card_tags_card_id on card_tags(card_id);
create index if not exists idx_card_tags_tag_id on card_tags(tag_id);

-- Enable RLS
alter table card_tags enable row level security;
