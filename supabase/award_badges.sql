-- Badge awarding function
-- Call this after any habit check-in to auto-award eligible badges
create or replace function award_badges(p_user_id uuid)
returns table(badge_name text, newly_earned boolean) as $$
DECLARE
  v_total_completions integer;
  v_active_habits integer;
  v_max_streak integer;
  v_badge record;
  v_already_earned boolean;
BEGIN
  -- Get total completions count
  select count(*) into v_total_completions
  from habit_logs where user_id = p_user_id;

  -- Get active habits count
  select count(*) into v_active_habits
  from habits where user_id = p_user_id and is_active = true;

  -- Get max streak across all habits
  select coalesce(max(streak), 0) into v_max_streak from (
    select
      h.id,
      count(distinct hl.completed_date) as streak
    from habits h
    join habit_logs hl on hl.habit_id = h.id
    where h.user_id = p_user_id
      and hl.completed_date >= current_date - interval '100 days'
    group by h.id
  ) streaks;

  -- Check each badge
  for v_badge in select * from badges order by requirement_value
  loop
    -- Check if already earned
    select exists(
      select 1 from user_badges where user_id = p_user_id and badge_id = v_badge.id
    ) into v_already_earned;

    if not v_already_earned then
      if v_badge.requirement_type = 'completions' and v_total_completions >= v_badge.requirement_value then
        insert into user_badges (user_id, badge_id) values (p_user_id, v_badge.id);
        badge_name := v_badge.name;
        newly_earned := true;
        return next;
      elsif v_badge.requirement_type = 'habits_count' and v_active_habits >= v_badge.requirement_value then
        insert into user_badges (user_id, badge_id) values (p_user_id, v_badge.id);
        badge_name := v_badge.name;
        newly_earned := true;
        return next;
      elsif v_badge.requirement_type = 'streak' and v_max_streak >= v_badge.requirement_value then
        insert into user_badges (user_id, badge_id) values (p_user_id, v_badge.id);
        badge_name := v_badge.name;
        newly_earned := true;
        return next;
      end if;
    end if;
  end loop;

  return;
end;
$$ language plpgsql security definer;
