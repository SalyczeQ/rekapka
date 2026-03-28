-- 007_create_actions.sql
-- Action items from retrospectives

create table if not exists action_items (
  id          uuid primary key default gen_random_uuid(),
  retro_id    uuid not null references retros(id) on delete cascade,
  text        text not null,
  assignee_id uuid references users(id) on delete set null,
  due_date    date,
  status      text not null default 'open'
    check (status in ('open', 'in_progress', 'done')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Indexes
create index if not exists idx_action_items_retro_id on action_items(retro_id);
create index if not exists idx_action_items_assignee_id on action_items(assignee_id) where assignee_id is not null;
create index if not exists idx_action_items_status on action_items(status);

-- Trigger
create trigger trg_action_items_updated_at
  before update on action_items
  for each row execute function update_updated_at_column();

-- Enable RLS
alter table action_items enable row level security;
