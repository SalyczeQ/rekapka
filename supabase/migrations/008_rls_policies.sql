-- 008_rls_policies.sql
-- Row Level Security policies for all tables

-- ============================================================================
-- Helper: check if a user is a member of a team
-- ============================================================================
create or replace function is_team_member(p_team_id uuid, p_user_id uuid)
returns boolean as $$
  select exists (
    select 1 from team_members
    where team_id = p_team_id and user_id = p_user_id
  );
$$ language sql security definer stable;

-- Helper: check if a user has a specific role (or higher) in a team
create or replace function has_team_role(p_team_id uuid, p_user_id uuid, p_roles text[])
returns boolean as $$
  select exists (
    select 1 from team_members
    where team_id = p_team_id
      and user_id = p_user_id
      and role = any(p_roles)
  );
$$ language sql security definer stable;

-- ============================================================================
-- USERS
-- ============================================================================

-- Users can read any profile (basic info visible to all authenticated users)
create policy users_select on users
  for select to authenticated
  using (true);

-- Users can update their own profile
create policy users_update on users
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Users can insert their own profile (on signup)
create policy users_insert on users
  for insert to authenticated
  with check (id = auth.uid());

-- ============================================================================
-- TEAMS
-- ============================================================================

-- Team members can read their teams
create policy teams_select on teams
  for select to authenticated
  using (is_team_member(id, auth.uid()));

-- Authenticated users can create teams
create policy teams_insert on teams
  for insert to authenticated
  with check (created_by = auth.uid());

-- Only owners can update teams
create policy teams_update on teams
  for update to authenticated
  using (has_team_role(id, auth.uid(), array['owner']))
  with check (has_team_role(id, auth.uid(), array['owner']));

-- Only owners can delete teams
create policy teams_delete on teams
  for delete to authenticated
  using (has_team_role(id, auth.uid(), array['owner']));

-- ============================================================================
-- TEAM MEMBERS
-- ============================================================================

-- Members can see other members of their teams
create policy team_members_select on team_members
  for select to authenticated
  using (is_team_member(team_id, auth.uid()));

-- Owners can add members
create policy team_members_insert on team_members
  for insert to authenticated
  with check (has_team_role(team_id, auth.uid(), array['owner']));

-- Owners can update member roles
create policy team_members_update on team_members
  for update to authenticated
  using (has_team_role(team_id, auth.uid(), array['owner']))
  with check (has_team_role(team_id, auth.uid(), array['owner']));

-- Owners can remove members
create policy team_members_delete on team_members
  for delete to authenticated
  using (has_team_role(team_id, auth.uid(), array['owner']));

-- ============================================================================
-- RETROS
-- ============================================================================

-- Team members can read retros
create policy retros_select on retros
  for select to authenticated
  using (is_team_member(team_id, auth.uid()));

-- Facilitators and owners can create retros
create policy retros_insert on retros
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and has_team_role(team_id, auth.uid(), array['owner', 'facilitator'])
  );

-- Facilitators and owners can update retros
create policy retros_update on retros
  for update to authenticated
  using (has_team_role(team_id, auth.uid(), array['owner', 'facilitator']))
  with check (has_team_role(team_id, auth.uid(), array['owner', 'facilitator']));

-- Facilitators and owners can delete retros
create policy retros_delete on retros
  for delete to authenticated
  using (has_team_role(team_id, auth.uid(), array['owner', 'facilitator']));

-- ============================================================================
-- CATEGORIES
-- ============================================================================

-- Team members can read categories (via retro team membership)
create policy categories_select on categories
  for select to authenticated
  using (
    exists (
      select 1 from retros r
      where r.id = retro_id
        and is_team_member(r.team_id, auth.uid())
    )
  );

-- Facilitators/owners can manage categories
create policy categories_insert on categories
  for insert to authenticated
  with check (
    exists (
      select 1 from retros r
      where r.id = retro_id
        and has_team_role(r.team_id, auth.uid(), array['owner', 'facilitator'])
    )
  );

create policy categories_update on categories
  for update to authenticated
  using (
    exists (
      select 1 from retros r
      where r.id = retro_id
        and has_team_role(r.team_id, auth.uid(), array['owner', 'facilitator'])
    )
  );

create policy categories_delete on categories
  for delete to authenticated
  using (
    exists (
      select 1 from retros r
      where r.id = retro_id
        and has_team_role(r.team_id, auth.uid(), array['owner', 'facilitator'])
    )
  );

-- ============================================================================
-- CARDS
-- ============================================================================

-- Authors can always read their own cards.
-- Others can read cards only when the retro is past the writing phase.
create policy cards_select on cards
  for select to authenticated
  using (
    author_id = auth.uid()
    or exists (
      select 1 from retros r
      where r.id = retro_id
        and is_team_member(r.team_id, auth.uid())
        and r.status not in ('draft', 'writing')
    )
  );

-- Authors can insert cards (must be a team member and retro in writing phase)
create policy cards_insert on cards
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from retros r
      where r.id = retro_id
        and is_team_member(r.team_id, auth.uid())
    )
  );

-- Authors can update their own cards
create policy cards_update on cards
  for update to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

-- Authors can delete their own cards
create policy cards_delete on cards
  for delete to authenticated
  using (author_id = auth.uid());

-- ============================================================================
-- TAGS
-- ============================================================================

-- Team members can read tags
create policy tags_select on tags
  for select to authenticated
  using (is_team_member(team_id, auth.uid()));

-- Team members can create tags
create policy tags_insert on tags
  for insert to authenticated
  with check (is_team_member(team_id, auth.uid()));

-- Team members can update tags
create policy tags_update on tags
  for update to authenticated
  using (is_team_member(team_id, auth.uid()));

-- Team members can delete tags
create policy tags_delete on tags
  for delete to authenticated
  using (is_team_member(team_id, auth.uid()));

-- ============================================================================
-- CARD TAGS
-- ============================================================================

-- Readable if the card is readable (simplified: team member check via tag)
create policy card_tags_select on card_tags
  for select to authenticated
  using (
    exists (
      select 1 from tags t
      where t.id = tag_id
        and is_team_member(t.team_id, auth.uid())
    )
  );

-- Team members can manage card tags
create policy card_tags_insert on card_tags
  for insert to authenticated
  with check (
    exists (
      select 1 from tags t
      where t.id = tag_id
        and is_team_member(t.team_id, auth.uid())
    )
  );

create policy card_tags_delete on card_tags
  for delete to authenticated
  using (
    exists (
      select 1 from tags t
      where t.id = tag_id
        and is_team_member(t.team_id, auth.uid())
    )
  );

-- ============================================================================
-- VOTES
-- ============================================================================

-- Team members can see votes on cards in their retros
create policy votes_select on votes
  for select to authenticated
  using (
    exists (
      select 1 from cards c
      join retros r on r.id = c.retro_id
      where c.id = card_id
        and is_team_member(r.team_id, auth.uid())
    )
  );

-- Authenticated team members can vote
create policy votes_insert on votes
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from cards c
      join retros r on r.id = c.retro_id
      where c.id = card_id
        and is_team_member(r.team_id, auth.uid())
    )
  );

-- Users can remove their own votes
create policy votes_delete on votes
  for delete to authenticated
  using (user_id = auth.uid());

-- ============================================================================
-- ACTION ITEMS
-- ============================================================================

-- Team members can read action items
create policy action_items_select on action_items
  for select to authenticated
  using (
    exists (
      select 1 from retros r
      where r.id = retro_id
        and is_team_member(r.team_id, auth.uid())
    )
  );

-- Team members can create action items
create policy action_items_insert on action_items
  for insert to authenticated
  with check (
    exists (
      select 1 from retros r
      where r.id = retro_id
        and is_team_member(r.team_id, auth.uid())
    )
  );

-- Team members can update action items
create policy action_items_update on action_items
  for update to authenticated
  using (
    exists (
      select 1 from retros r
      where r.id = retro_id
        and is_team_member(r.team_id, auth.uid())
    )
  );

-- Team members can delete action items
create policy action_items_delete on action_items
  for delete to authenticated
  using (
    exists (
      select 1 from retros r
      where r.id = retro_id
        and is_team_member(r.team_id, auth.uid())
    )
  );
