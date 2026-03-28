-- 001_create_users.sql
-- User profile table extending Supabase auth.users

-- Auto-update updated_at trigger function (used by multiple tables)
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  name        text not null,
  avatar_url  text,
  color       text not null default '#3B82F6',
  ui_theme    text not null default 'default'
    check (ui_theme in ('default', 'cli', 'msdos', 'material3', 'windows')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Indexes
create index if not exists idx_users_email on users(email);

-- Trigger
create trigger trg_users_updated_at
  before update on users
  for each row execute function update_updated_at_column();

-- Enable RLS
alter table users enable row level security;
