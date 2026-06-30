#!/usr/bin/env python3
"""Generate 4 fixed diagrams as HTML, then convert to PNG using Playwright."""
import os
import subprocess
import tempfile

OUTPUT_DIR = "/Users/openclaw/.hermes/projects/habit-forge/docs/images"

# ============================================================
# 1. CLASS DIAGRAM (Fixed - proper title spacing)
# ============================================================
CLASS_DIAGRAM_HTML = """<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #FAFBFC; padding: 40px; width: 1200px; }
  .title { text-align: center; font-size: 22px; font-weight: 700; color: #1F2937; margin-bottom: 30px; }
  .diagram { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; }
  .class-box { border: 2px solid #D1D5DB; border-radius: 8px; overflow: hidden; background: white; min-width: 160px; }
  .class-name { padding: 10px; text-align: center; font-weight: 700; font-size: 13px; color: white; }
  .class-name.blue { background: #2563EB; }
  .class-name.purple { background: #7C3AED; }
  .class-name.orange { background: #D97706; }
  .class-name.green { background: #059669; }
  .class-name.red { background: #DC2626; }
  .class-name.teal { background: #0D9488; }
  .class-name.gray { background: #6B7280; }
  .class-attrs { padding: 8px 12px; font-size: 11px; color: #374151; border-top: 1px solid #E5E7EB; }
  .class-methods { padding: 8px 12px; font-size: 11px; color: #374151; border-top: 1px solid #E5E7EB; font-style: italic; }
  .section-label { font-size: 10px; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.5px; padding: 6px 12px 2px; }
  .row { display: flex; gap: 20px; justify-content: center; align-items: flex-start; margin-bottom: 20px; }
  .arrow { display: flex; align-items: center; justify-content: center; font-size: 20px; color: #9CA3AF; padding-top: 30px; }
</style>
</head>
<body>
<div class="title">UML Class Diagram — HabitForge</div>
<div class="diagram">
  <div class="row">
    <div class="class-box">
      <div class="class-name blue">User</div>
      <div class="section-label">Attributes</div>
      <div class="class-attrs">+ id: UUID<br>+ email: string<br>+ full_name: string<br>+ created_at: timestamp</div>
      <div class="section-label">Methods</div>
      <div class="class-methods">+ register()<br>+ login()<br>+ logout()</div>
    </div>
    <div class="class-box">
      <div class="class-name purple">Habit</div>
      <div class="section-label">Attributes</div>
      <div class="class-attrs">+ id: UUID<br>+ user_id: FK<br>+ name: string<br>+ habit_type: string<br>+ target_value: int<br>+ frequency: string<br>+ category: string<br>+ color: string<br>+ is_active: bool</div>
      <div class="section-label">Methods</div>
      <div class="class-methods">+ create()<br>+ update()<br>+ delete()<br>+ checkin()<br>+ undoCheckin()</div>
    </div>
    <div class="class-box">
      <div class="class-name green">HabitLog</div>
      <div class="section-label">Attributes</div>
      <div class="class-attrs">+ id: UUID<br>+ habit_id: FK<br>+ user_id: FK<br>+ completed_date: date<br>+ count_value: int<br>+ note: text</div>
      <div class="section-label">Methods</div>
      <div class="class-methods">+ create()<br>+ update()</div>
    </div>
    <div class="class-box">
      <div class="class-name orange">HabitGroup</div>
      <div class="section-label">Attributes</div>
      <div class="class-attrs">+ id: UUID<br>+ user_id: FK<br>+ name: string<br>+ description: text<br>+ color: string</div>
      <div class="section-label">Methods</div>
      <div class="class-methods">+ create()<br>+ addHabit()<br>+ delete()</div>
    </div>
  </div>
  <div class="row">
    <div class="class-box">
      <div class="class-name red">Badge</div>
      <div class="section-label">Attributes</div>
      <div class="class-attrs">+ id: UUID<br>+ name: string<br>+ description: text<br>+ icon: string<br>+ req_type: string<br>+ req_value: int</div>
      <div class="section-label">Methods</div>
      <div class="class-methods">+ checkAward()</div>
    </div>
    <div class="class-box">
      <div class="class-name teal">UserBadge</div>
      <div class="section-label">Attributes</div>
      <div class="class-attrs">+ id: UUID<br>+ user_id: FK<br>+ badge_id: FK<br>+ earned_at: timestamp</div>
      <div class="section-label">Methods</div>
      <div class="class-methods">+ award()</div>
    </div>
    <div class="class-box">
      <div class="class-name gray">StreakCalculator</div>
      <div class="section-label">Methods</div>
      <div class="class-methods">+ calculateStreak()<br>+ generateHeatmap()</div>
    </div>
  </div>
</div>
</body>
</html>"""

# ============================================================
# 2. ER DIAGRAM (Fixed - proper title spacing, clean labels)
# ============================================================
ER_DIAGRAM_HTML = """<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #FAFBFC; padding: 40px; width: 1200px; }
  .title { text-align: center; font-size: 22px; font-weight: 700; color: #1F2937; margin-bottom: 30px; }
  .diagram { display: flex; flex-wrap: wrap; gap: 24px; justify-content: center; }
  .entity { border: 2px solid #D1D5DB; border-radius: 8px; overflow: hidden; background: white; min-width: 180px; }
  .entity-header { padding: 10px; text-align: center; font-weight: 700; font-size: 13px; color: white; }
  .entity-header.blue { background: #2563EB; }
  .entity-header.purple { background: #7C3AED; }
  .entity-header.green { background: #059669; }
  .entity-header.orange { background: #D97706; }
  .entity-header.red { background: #DC2626; }
  .entity-header.teal { background: #0D9488; }
  .entity-fields { padding: 8px 12px; font-size: 11px; color: #374151; }
  .field { padding: 3px 0; border-bottom: 1px solid #F3F4F6; }
  .field:last-child { border-bottom: none; }
  .pk { font-weight: 700; color: #1F2937; }
  .fk { color: #6B7280; }
  .legend { margin-top: 30px; padding: 12px 20px; background: white; border: 1px solid #E5E7EB; border-radius: 8px; display: inline-block; font-size: 11px; color: #6B7280; }
  .legend span { margin-right: 20px; }
  .legend .bold { font-weight: 700; color: #1F2937; }
</style>
</head>
<body>
<div class="title">Entity Relationship Diagram — HabitForge</div>
<div class="diagram">
  <div class="entity">
    <div class="entity-header blue">auth.users</div>
    <div class="entity-fields">
      <div class="field"><span class="pk">[PK]</span> id</div>
      <div class="field">email</div>
      <div class="field">encrypted_password</div>
      <div class="field">created_at</div>
    </div>
  </div>
  <div class="entity">
    <div class="entity-header purple">habits</div>
    <div class="entity-fields">
      <div class="field"><span class="pk">[PK]</span> id</div>
      <div class="field"><span class="fk">user_id</span></div>
      <div class="field">name</div>
      <div class="field">habit_type</div>
      <div class="field">target_value</div>
      <div class="field">frequency</div>
      <div class="field">category</div>
      <div class="field">color</div>
      <div class="field">is_active</div>
      <div class="field">created_at</div>
    </div>
  </div>
  <div class="entity">
    <div class="entity-header green">habit_logs</div>
    <div class="entity-fields">
      <div class="field"><span class="pk">[PK]</span> id</div>
      <div class="field"><span class="fk">habit_id</span></div>
      <div class="field"><span class="fk">user_id</span></div>
      <div class="field">completed_date</div>
      <div class="field">count_value</div>
      <div class="field">note</div>
      <div class="field">created_at</div>
    </div>
  </div>
  <div class="entity">
    <div class="entity-header orange">habit_groups</div>
    <div class="entity-fields">
      <div class="field"><span class="pk">[PK]</span> id</div>
      <div class="field"><span class="fk">user_id</span></div>
      <div class="field">name</div>
      <div class="field">description</div>
      <div class="field">color</div>
      <div class="field">created_at</div>
    </div>
  </div>
  <div class="entity">
    <div class="entity-header red">badges</div>
    <div class="entity-fields">
      <div class="field"><span class="pk">[PK]</span> id</div>
      <div class="field">name</div>
      <div class="field">description</div>
      <div class="field">icon</div>
      <div class="field">req_type</div>
      <div class="field">req_value</div>
    </div>
  </div>
  <div class="entity">
    <div class="entity-header teal">user_badges</div>
    <div class="entity-fields">
      <div class="field"><span class="pk">[PK]</span> id</div>
      <div class="field"><span class="fk">user_id</span></div>
      <div class="field"><span class="fk">badge_id</span></div>
      <div class="field">earned_at</div>
    </div>
  </div>
</div>
<div style="text-align: center;">
  <div class="legend">
    <span class="bold">[PK]</span> = Primary Key &nbsp;&nbsp;
    <span class="fk">FK</span> = Foreign Key &nbsp;&nbsp;
    <span class="bold">1:N</span> = One-to-Many &nbsp;&nbsp;
    <span class="bold">M:N</span> = Many-to-Many
  </div>
</div>
</body>
</html>"""

# ============================================================
# 3. DFD LEVEL 1 (Fixed - no artifacts, clean layout)
# ============================================================
DFD_L1_HTML = """<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #FAFBFC; padding: 40px; width: 1200px; }
  .title { text-align: center; font-size: 22px; font-weight: 700; color: #1F2937; margin-bottom: 30px; }
  .container { display: flex; gap: 40px; align-items: flex-start; justify-content: center; }
  .column { display: flex; flex-direction: column; gap: 20px; align-items: center; }
  .entity { padding: 12px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; text-align: center; min-width: 140px; }
  .user { background: #D1FAE5; border: 2px solid #059669; color: #065F46; }
  .process { background: #DBEAFE; border: 2px solid #2563EB; color: #1E40AF; border-radius: 20px; }
  .datastore { background: #F3F4F6; border: 2px solid #9CA3AF; color: #374151; border-radius: 4px; }
  .label { font-size: 10px; color: #9CA3AF; text-align: center; margin-top: 4px; }
  .arrow-down { font-size: 24px; color: #D1D5DB; text-align: center; }
  .flow-label { font-size: 10px; color: #6B7280; text-align: center; padding: 2px 8px; background: white; border-radius: 4px; border: 1px solid #E5E7EB; }
</style>
</head>
<body>
<div class="title">Data Flow Diagram — Level 1</div>
<div class="container">
  <div class="column">
    <div class="entity user">User</div>
  </div>
  <div class="column">
    <div class="entity process">P1<br><span style="font-size:11px;font-weight:400;">Authentication</span></div>
    <div class="arrow-down">↓</div>
    <div class="entity process">P2<br><span style="font-size:11px;font-weight:400;">Habit CRUD</span></div>
    <div class="arrow-down">↓</div>
    <div class="entity process">P3<br><span style="font-size:11px;font-weight:400;">Check-in</span></div>
    <div class="arrow-down">↓</div>
    <div class="entity process">P4<br><span style="font-size:11px;font-weight:400;">Analytics</span></div>
  </div>
  <div class="column">
    <div class="entity datastore">D1<br><span style="font-size:11px;font-weight:400;">Sessions</span></div>
    <div class="entity datastore">D2<br><span style="font-size:11px;font-weight:400;">Habits DB</span></div>
    <div class="entity datastore">D3<br><span style="font-size:11px;font-weight:400;">Logs DB</span></div>
    <div class="entity datastore">D4<br><span style="font-size:11px;font-weight:400;">Badges DB</span></div>
  </div>
</div>
</body>
</html>"""

# ============================================================
# 4. ARCHITECTURE DIAGRAM (Fixed - clean 3-tier)
# ============================================================
ARCH_HTML = """<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #FAFBFC; padding: 40px; width: 1100px; }
  .title { text-align: center; font-size: 22px; font-weight: 700; color: #1F2937; margin-bottom: 30px; }
  .layer { border-radius: 12px; padding: 20px; margin-bottom: 16px; }
  .layer.client { background: #DBEAFE; border: 2px solid #2563EB; }
  .layer.server { background: #EDE9FE; border: 2px solid #7C3AED; }
  .layer.database { background: #D1FAE5; border: 2px solid #059669; }
  .layer-title { font-size: 14px; font-weight: 700; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; }
  .layer.client .layer-title { color: #1E40AF; }
  .layer.server .layer-title { color: #5B21B6; }
  .layer.database .layer-title { color: #065F46; }
  .components { display: flex; gap: 16px; justify-content: center; }
  .component { background: white; border: 1px solid #E5E7EB; border-radius: 8px; padding: 12px 16px; min-width: 160px; text-align: center; }
  .component-name { font-size: 13px; font-weight: 700; color: #1F2937; margin-bottom: 4px; }
  .component-desc { font-size: 10px; color: #6B7280; }
  .arrow { text-align: center; font-size: 24px; color: #9CA3AF; margin: 8px 0; }
</style>
</head>
<body>
<div class="title">System Architecture — HabitForge</div>
<div class="layer client">
  <div class="layer-title">Client Layer</div>
  <div class="components">
    <div class="component">
      <div class="component-name">Web Browser</div>
      <div class="component-desc">Chrome, Safari, Firefox</div>
    </div>
    <div class="component">
      <div class="component-name">Next.js 14</div>
      <div class="component-desc">App Router, SSR, API Routes</div>
    </div>
    <div class="component">
      <div class="component-name">Tailwind CSS v4</div>
      <div class="component-desc">Responsive UI, Dark Mode</div>
    </div>
  </div>
</div>
<div class="arrow">↕</div>
<div class="layer server">
  <div class="layer-title">Server Layer</div>
  <div class="components">
    <div class="component">
      <div class="component-name">API Routes</div>
      <div class="component-desc">RESTful Endpoints</div>
    </div>
    <div class="component">
      <div class="component-name">Auth Middleware</div>
      <div class="component-desc">Session Management</div>
    </div>
    <div class="component">
      <div class="component-name">Recharts</div>
      <div class="component-desc">Data Visualization</div>
    </div>
  </div>
</div>
<div class="arrow">↕</div>
<div class="layer database">
  <div class="layer-title">Database Layer</div>
  <div class="components">
    <div class="component">
      <div class="component-name">Supabase</div>
      <div class="component-desc">PostgreSQL, Auth, Storage</div>
    </div>
    <div class="component">
      <div class="component-name">PostgreSQL</div>
      <div class="component-desc">6 Tables, RLS Policies</div>
    </div>
    <div class="component">
      <div class="component-name">Row Level Security</div>
      <div class="component-desc">Per-user Data Isolation</div>
    </div>
  </div>
</div>
</body>
</html>"""

diagrams = {
    "class_diagram.html": CLASS_DIAGRAM_HTML,
    "er_diagram.html": ER_DIAGRAM_HTML,
    "dfd_level1.html": DFD_L1_HTML,
    "architecture.html": ARCH_HTML,
}

# Write HTML files
html_dir = os.path.join(OUTPUT_DIR, "html_temp")
os.makedirs(html_dir, exist_ok=True)

for name, content in diagrams.items():
    path = os.path.join(html_dir, name)
    with open(path, 'w') as f:
        f.write(content)
    print(f"Written: {path}")

print("\nHTML files written. Now converting to PNG...")
