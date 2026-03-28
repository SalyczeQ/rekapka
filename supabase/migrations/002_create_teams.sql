-- 002_create_teams.sql
-- Teams and team membership

create table if not exists teams (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  created_by  uuid not null references users(id) on delete restrict,
  ics_token   text unique not null default gen_random_uuid()::text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Indexes
create index if not exists idx_teams_slug on teams(slug);
create index if not exists idx_teams_created_by on teams(created_by);

-- Trigger
create trigger trg_teams_updated_at
  before update on teams
  for each row execute function update_updated_at_column();

-- Enable RLS
alter table teams enable row level security;

-- Team members
create table if not exists team_members (
  id        uuid primary key default gen_random_uuid(),
  team_id   uuid not null references teams(id) on delete cascade,
  user_id   uuid not null references users(id) on delete cascade,
  role      text not null default 'member'
    check (role in ('owner', 'facilitator', 'member')),
  joined_at timestamptz not null default now(),
  unique(team_id, user_id)
);

-- Indexes
create index if not exists idx_team_members_team_id on team_members(team_id);
create index if not exists idx_team_members_user_id on team_members(user_id);

-- Enable RLS
alter table team_members enable row level security;
