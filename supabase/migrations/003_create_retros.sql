-- 003_create_retros.sql
-- Retrospectives and categories

create table if not exists retros (
  id                    uuid primary key default gen_random_uuid(),
  team_id               uuid not null references teams(id) on delete cascade,
  title                 text not null,
  status                text not null default 'draft'
    check (status in ('draft', 'writing', 'grouping', 'voting', 'discussing', 'actions', 'completed')),
  template              text not null default 'went_well_improve'
    check (template in ('went_well_improve', 'mad_sad_glad', 'start_stop_continue', 'four_ls', 'custom')),
  location              text,
  photo_url             text,
  date                  date not null default current_date,
  phase_timer_seconds   int,
  max_votes             int not null default 5,
  created_by            uuid not null references users(id) on delete restrict,
  created_at            timestamptz not null default now(),
  completed_at          timestamptz,
  updated_at            timestamptz not null default now()
);

-- Indexes
create index if not exists idx_retros_team_id on retros(team_id);
create index if not exists idx_retros_created_by on retros(created_by);
create index if not exists idx_retros_status on retros(status);
create index if not exists idx_retros_date on retros(date);

-- Trigger
create trigger trg_retros_updated_at
  before update on retros
  for each row execute function update_updated_at_column();

-- Enable RLS
alter table retros enable row level security;

-- Categories
create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  retro_id    uuid not null references retros(id) on delete cascade,
  name        text not null,
  icon        text,
  sort_order  int not null default 0,
  color       text
);

-- Indexes
create index if not exists idx_categories_retro_id on categories(retro_id);

-- Enable RLS
alter table categories enable row level security;
