#!/usr/bin/env python3
"""Generate professional diagrams for HabitForge project report."""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import numpy as np
import os

OUTPUT_DIR = "/Users/openclaw/.hermes/projects/habit-forge/docs/images"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Color palette
BLUE = '#3B82F6'
BLUE_LIGHT = '#93C5FD'
BLUE_DARK = '#1D4ED8'
PURPLE = '#8B5CF6'
PURPLE_LIGHT = '#C4B5FD'
GREEN = '#10B981'
GREEN_LIGHT = '#6EE7B7'
ORANGE = '#F59E0B'
RED = '#EF4444'
GRAY = '#6B7280'
GRAY_LIGHT = '#E5E7EB'
GRAY_DARK = '#374151'
WHITE = '#FFFFFF'
BG = '#F8FAFC'

def save_fig(fig, name, dpi=200):
    path = os.path.join(OUTPUT_DIR, name)
    fig.savefig(path, dpi=dpi, bbox_inches='tight', 
                facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close(fig)
    print(f"Saved: {path}")

# ============================================================
# 1. Architecture Diagram
# ============================================================
def create_architecture_diagram():
    fig, ax = plt.subplots(1, 1, figsize=(14, 10))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)
    ax.axis('off')
    fig.patch.set_facecolor(BG)
    ax.set_facecolor(BG)

    # Title
    ax.text(7, 9.5, 'HabitForge System Architecture', 
            ha='center', va='center', fontsize=18, fontweight='bold', color=GRAY_DARK)

    # --- Client Layer ---
    client_box = FancyBboxPatch((0.5, 7.2), 13, 1.8, 
                                 boxstyle="round,pad=0.1", 
                                 facecolor=BLUE_LIGHT, edgecolor=BLUE, linewidth=2)
    ax.add_patch(client_box)
    ax.text(7, 8.7, 'CLIENT LAYER', ha='center', va='center', 
            fontsize=10, fontweight='bold', color=BLUE_DARK)
    
    # Browser
    browser = FancyBboxPatch((1.2, 7.5), 3.5, 1.2, 
                              boxstyle="round,pad=0.08", 
                              facecolor=WHITE, edgecolor=BLUE, linewidth=1.5)
    ax.add_patch(browser)
    ax.text(2.95, 8.35, '🌐 Web Browser', ha='center', va='center', fontsize=9, color=GRAY_DARK)
    ax.text(2.95, 7.95, '(Chrome, Safari, Firefox)', ha='center', va='center', fontsize=7, color=GRAY)

    # Next.js
    nextjs = FancyBboxPatch((5.2, 7.5), 3.5, 1.2, 
                             boxstyle="round,pad=0.08", 
                             facecolor=WHITE, edgecolor=BLUE, linewidth=1.5)
    ax.add_patch(nextjs)
    ax.text(6.95, 8.35, '⚡ Next.js 14', ha='center', va='center', fontsize=9, color=GRAY_DARK)
    ax.text(6.95, 7.95, '(App Router, SSR, API Routes)', ha='center', va='center', fontsize=7, color=GRAY)

    # Tailwind
    tailwind = FancyBboxPatch((9.2, 7.5), 3.5, 1.2, 
                               boxstyle="round,pad=0.08", 
                               facecolor=WHITE, edgecolor=BLUE, linewidth=1.5)
    ax.add_patch(tailwind)
    ax.text(10.95, 8.35, '🎨 Tailwind CSS v4', ha='center', va='center', fontsize=9, color=GRAY_DARK)
    ax.text(10.95, 7.95, '(Responsive UI, Dark Mode)', ha='center', va='center', fontsize=7, color=GRAY)

    # --- Server Layer ---
    server_box = FancyBboxPatch((0.5, 4.8), 13, 2.0, 
                                 boxstyle="round,pad=0.1", 
                                 facecolor=PURPLE_LIGHT, edgecolor=PURPLE, linewidth=2)
    ax.add_patch(server_box)
    ax.text(7, 6.3, 'SERVER LAYER', ha='center', va='center', 
            fontsize=10, fontweight='bold', color=PURPLE)

    # API Routes
    api = FancyBboxPatch((1.2, 5.1), 3.5, 1.2, 
                          boxstyle="round,pad=0.08", 
                          facecolor=WHITE, edgecolor=PURPLE, linewidth=1.5)
    ax.add_patch(api)
    ax.text(2.95, 5.95, '🔌 API Routes', ha='center', va='center', fontsize=9, color=GRAY_DARK)
    ax.text(2.95, 5.55, '(RESTful Endpoints)', ha='center', va='center', fontsize=7, color=GRAY)

    # Auth
    auth = FancyBboxPatch((5.2, 5.1), 3.5, 1.2, 
                           boxstyle="round,pad=0.08", 
                           facecolor=WHITE, edgecolor=PURPLE, linewidth=1.5)
    ax.add_patch(auth)
    ax.text(6.95, 5.95, '🔐 Auth Middleware', ha='center', va='center', fontsize=9, color=GRAY_DARK)
    ax.text(6.95, 5.55, '(Session Management)', ha='center', va='center', fontsize=7, color=GRAY)

    # Recharts
    recharts = FancyBboxPatch((9.2, 5.1), 3.5, 1.2, 
                               boxstyle="round,pad=0.08", 
                               facecolor=WHITE, edgecolor=PURPLE, linewidth=1.5)
    ax.add_patch(recharts)
    ax.text(10.95, 5.95, '📊 Recharts', ha='center', va='center', fontsize=9, color=GRAY_DARK)
    ax.text(10.95, 5.55, '(Data Visualization)', ha='center', va='center', fontsize=7, color=GRAY)

    # --- Database Layer ---
    db_box = FancyBboxPatch((0.5, 2.4), 13, 2.0, 
                             boxstyle="round,pad=0.1", 
                             facecolor=GREEN_LIGHT, edgecolor=GREEN, linewidth=2)
    ax.add_patch(db_box)
    ax.text(7, 3.9, 'DATABASE LAYER', ha='center', va='center', 
            fontsize=10, fontweight='bold', color=GREEN)

    # Supabase
    supabase = FancyBboxPatch((1.2, 2.7), 4.0, 1.2, 
                               boxstyle="round,pad=0.08", 
                               facecolor=WHITE, edgecolor=GREEN, linewidth=1.5)
    ax.add_patch(supabase)
    ax.text(3.2, 3.55, '🗄️ Supabase', ha='center', va='center', fontsize=9, color=GRAY_DARK)
    ax.text(3.2, 3.15, '(PostgreSQL, Auth, Storage)', ha='center', va='center', fontsize=7, color=GRAY)

    # PostgreSQL
    pg = FancyBboxPatch((5.7, 2.7), 3.5, 1.2, 
                         boxstyle="round,pad=0.08", 
                         facecolor=WHITE, edgecolor=GREEN, linewidth=1.5)
    ax.add_patch(pg)
    ax.text(7.45, 3.55, '🐘 PostgreSQL', ha='center', va='center', fontsize=9, color=GRAY_DARK)
    ax.text(7.45, 3.15, '(6 Tables, RLS Policies)', ha='center', va='center', fontsize=7, color=GRAY)

    # RLS
    rls = FancyBboxPatch((9.7, 2.7), 3.0, 1.2, 
                          boxstyle="round,pad=0.08", 
                          facecolor=WHITE, edgecolor=GREEN, linewidth=1.5)
    ax.add_patch(rls)
    ax.text(11.2, 3.55, '🛡️ RLS', ha='center', va='center', fontsize=9, color=GRAY_DARK)
    ax.text(11.2, 3.15, '(Row Level Security)', ha='center', va='center', fontsize=7, color=GRAY)

    # --- External Services ---
    ext_box = FancyBboxPatch((0.5, 0.5), 13, 1.5, 
                              boxstyle="round,pad=0.1", 
                              facecolor='#FEF3C7', edgecolor=ORANGE, linewidth=2)
    ax.add_patch(ext_box)
    ax.text(7, 1.6, 'EXTERNAL SERVICES', ha='center', va='center', 
            fontsize=10, fontweight='bold', color=ORANGE)

    google = FancyBboxPatch((2, 0.7), 4, 0.6, 
                             boxstyle="round,pad=0.08", 
                             facecolor=WHITE, edgecolor=ORANGE, linewidth=1.5)
    ax.add_patch(google)
    ax.text(4, 1.0, 'Google OAuth 2.0', ha='center', va='center', fontsize=8, color=GRAY_DARK)

    vercel = FancyBboxPatch((8, 0.7), 4, 0.6, 
                             boxstyle="round,pad=0.08", 
                             facecolor=WHITE, edgecolor=ORANGE, linewidth=1.5)
    ax.add_patch(vercel)
    ax.text(10, 1.0, 'Vercel (Hosting & CI/CD)', ha='center', va='center', fontsize=8, color=GRAY_DARK)

    # Arrows between layers
    for x in [2.95, 6.95, 10.95]:
        ax.annotate('', xy=(x, 7.2), xytext=(x, 6.8),
                    arrowprops=dict(arrowstyle='->', color=GRAY, lw=1.5))
    
    for x in [2.95, 6.95, 10.95]:
        ax.annotate('', xy=(x, 4.8), xytext=(x, 4.4),
                    arrowprops=dict(arrowstyle='->', color=GRAY, lw=1.5))

    save_fig(fig, 'architecture.png')

# ============================================================
# 2. UML Use Case Diagram
# ============================================================
def create_use_case_diagram():
    fig, ax = plt.subplots(1, 1, figsize=(14, 10))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)
    ax.axis('off')
    fig.patch.set_facecolor(WHITE)
    ax.set_facecolor(WHITE)

    ax.text(7, 9.6, 'UML Use Case Diagram — HabitForge', 
            ha='center', va='center', fontsize=16, fontweight='bold', color=GRAY_DARK)

    # System boundary
    system_box = FancyBboxPatch((3, 1.5), 8, 7.5, 
                                 boxstyle="round,pad=0.2", 
                                 facecolor=BG, edgecolor=GRAY_DARK, linewidth=2, linestyle='--')
    ax.add_patch(system_box)
    ax.text(7, 8.7, 'HabitForge System', ha='center', va='center', 
            fontsize=11, fontweight='bold', color=GRAY_DARK)

    # User actor (stick figure)
    user_x, user_y = 1.5, 5
    circle = plt.Circle((user_x, user_y + 0.6), 0.3, color=BLUE, linewidth=2, fill=True, facecolor=BLUE_LIGHT)
    ax.add_patch(circle)
    ax.plot([user_x, user_x], [user_y + 0.3, user_y - 0.3], color=BLUE_DARK, linewidth=2)
    ax.plot([user_x - 0.3, user_x + 0.3], [user_y, user_y], color=BLUE_DARK, linewidth=2)
    ax.plot([user_x, user_x - 0.3], [user_y - 0.3, user_y - 0.7], color=BLUE_DARK, linewidth=2)
    ax.plot([user_x, user_x + 0.3], [user_y - 0.3, user_y - 0.7], color=BLUE_DARK, linewidth=2)
    ax.text(user_x, user_y - 1.0, 'User', ha='center', va='center', fontsize=10, fontweight='bold', color=BLUE_DARK)

    # Use case ellipses
    use_cases = [
        (5, 7.8, 'Register'),
        (7, 7.8, 'Login'),
        (9, 7.8, 'Logout'),
        (5, 6.5, 'Create Habit'),
        (7, 6.5, 'Edit Habit'),
        (9, 6.5, 'Delete Habit'),
        (5, 5.2, 'View Dashboard'),
        (7, 5.2, 'Check-in Habit'),
        (9, 5.2, 'Undo Check-in'),
        (5, 3.9, 'View Analytics'),
        (7, 3.9, 'View Badges'),
        (9, 3.9, 'Create Routine'),
        (5, 2.6, 'Delete Routine'),
        (7, 2.6, 'Toggle Dark Mode'),
    ]

    for x, y, label in use_cases:
        ellipse = mpatches.Ellipse((x, y), 2.2, 0.7, 
                                    facecolor=BLUE_LIGHT, edgecolor=BLUE, linewidth=1.5)
        ax.add_patch(ellipse)
        ax.text(x, y, label, ha='center', va='center', fontsize=7.5, color=GRAY_DARK)

    # Connect user to use cases
    for x, y, _ in use_cases:
        ax.annotate('', xy=(x - 1.0, y), xytext=(2.3, 5),
                    arrowprops=dict(arrowstyle='-', color=GRAY, lw=0.8, linestyle='solid'))

    # Include relationship: Check-in -> Calculate Streak
    ax.annotate('', xy=(7, 5.55), xytext=(7, 6.15),
                arrowprops=dict(arrowstyle='->', color=RED, lw=1.2))
    ax.text(7.3, 5.85, '«include»', ha='left', va='center', fontsize=6, color=RED, style='italic')

    # External actors
    # Google OAuth
    g_x, g_y = 1.5, 2
    ax.add_patch(FancyBboxPatch((g_x-0.8, g_y-0.3), 1.6, 0.6, 
                                 boxstyle="round,pad=0.05", 
                                 facecolor='#FEF3C7', edgecolor=ORANGE, linewidth=1.5))
    ax.text(g_x, g_y, 'Google OAuth', ha='center', va='center', fontsize=7, color=GRAY_DARK)
    ax.annotate('', xy=(3, 2.6), xytext=(2.3, 2),
                arrowprops=dict(arrowstyle='->', color=ORANGE, lw=1))

    # Supabase
    s_x, s_y = 1.5, 1.2
    ax.add_patch(FancyBboxPatch((s_x-0.8, s_y-0.3), 1.6, 0.6, 
                                 boxstyle="round,pad=0.05", 
                                 facecolor=GREEN_LIGHT, edgecolor=GREEN, linewidth=1.5))
    ax.text(s_x, s_y, 'Supabase Auth', ha='center', va='center', fontsize=7, color=GRAY_DARK)
    ax.annotate('', xy=(3, 3.5), xytext=(2.3, 1.5),
                arrowprops=dict(arrowstyle='->', color=GREEN, lw=1))

    save_fig(fig, 'use_case.png')

# ============================================================
# 3. UML Class Diagram
# ============================================================
def create_class_diagram():
    fig, ax = plt.subplots(1, 1, figsize=(16, 12))
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 12)
    ax.axis('off')
    fig.patch.set_facecolor(WHITE)
    ax.set_facecolor(WHITE)

    ax.text(8, 11.5, 'UML Class Diagram — HabitForge', 
            ha='center', va='center', fontsize=16, fontweight='bold', color=GRAY_DARK)

    def draw_class_box(ax, x, y, w, h, title, attributes, methods, color=BLUE):
        # Box
        box = FancyBboxPatch((x, y), w, h, 
                              boxstyle="round,pad=0.05", 
                              facecolor=WHITE, edgecolor=color, linewidth=2)
        ax.add_patch(box)
        
        # Title bar
        title_bar = FancyBboxPatch((x, y + h - 0.6), w, 0.6, 
                                    boxstyle="round,pad=0.02", 
                                    facecolor=color, edgecolor=color, linewidth=0)
        ax.add_patch(title_bar)
        ax.text(x + w/2, y + h - 0.3, title, ha='center', va='center', 
                fontsize=9, fontweight='bold', color=WHITE)
        
        # Separator line
        ax.plot([x, x + w], [y + h - 0.6, y + h - 0.6], color=color, linewidth=1)
        
        # Attributes
        for i, attr in enumerate(attributes):
            ax.text(x + 0.15, y + h - 0.9 - i * 0.35, attr, 
                    ha='left', va='center', fontsize=7, color=GRAY_DARK, family='monospace')
        
        # Separator
        sep_y = y + h - 0.6 - len(attributes) * 0.35 - 0.15
        ax.plot([x + 0.1, x + w - 0.1], [sep_y, sep_y], color=GRAY_LIGHT, linewidth=0.8)
        
        # Methods
        for i, method in enumerate(methods):
            ax.text(x + 0.15, sep_y - 0.25 - i * 0.35, method, 
                    ha='left', va='center', fontsize=7, color=GRAY_DARK, family='monospace')

    # User class
    draw_class_box(ax, 0.5, 7, 3.5, 4, 'User', 
                       ['id: UUID', 'email: string', 'full_name: string', 'created_at: timestamp'],
                       ['register()', 'login()', 'logout()'], BLUE)

    # Habit class
    draw_class_box(ax, 5.5, 7, 4, 5, 'Habit',
                       ['id: UUID', 'user_id: FK', 'name: string', 'habit_type: string',
                        'target_value: int', 'frequency: string', 'category: string',
                        'color: string', 'is_active: bool'],
                       ['create()', 'update()', 'delete()', 'checkin()', 'undoCheckin()'], PURPLE)

    # HabitLog class
    draw_class_box(ax, 11, 7, 3.5, 3.5, 'HabitLog',
                       ['id: UUID', 'habit_id: FK', 'user_id: FK', 'completed_date: date',
                        'count_value: int', 'note: text'],
                       [], GREEN)

    # HabitGroup class
    draw_class_box(ax, 0.5, 2.5, 3.5, 3.5, 'HabitGroup',
                       ['id: UUID', 'user_id: FK', 'name: string', 'description: text',
                        'color: string'],
                       ['create()', 'addHabit()', 'delete()'], ORANGE)

    # Badge class
    draw_class_box(ax, 5.5, 2.5, 3.5, 3, 'Badge',
                       ['id: UUID', 'name: string', 'description: text', 'icon: string',
                        'req_type: string', 'req_value: int'],
                       [], RED)

    # UserBadge class
    draw_class_box(ax, 11, 2.5, 3.5, 2.5, 'UserBadge',
                       ['id: UUID', 'user_id: FK', 'badge_id: FK', 'earned_at: timestamp'],
                       [], GRAY_DARK)

    # StreakCalculator
    draw_class_box(ax, 5.5, 0.5, 4, 1.5, 'StreakCalculator',
                       [],
                       ['calculateStreak()', 'generateHeatmap()'], BLUE_DARK)

    # Relationships (arrows)
    # User -> Habit (1:*)
    ax.annotate('', xy=(5.5, 9), xytext=(4, 9),
                arrowprops=dict(arrowstyle='->', color=GRAY_DARK, lw=1.5))
    ax.text(4.75, 9.2, '1', ha='center', va='center', fontsize=8, color=GRAY_DARK)
    ax.text(4.75, 8.8, '*', ha='center', va='center', fontsize=8, color=GRAY_DARK)

    # Habit -> HabitLog (1:*)
    ax.annotate('', xy=(11, 9), xytext=(9.5, 9),
                arrowprops=dict(arrowstyle='->', color=GRAY_DARK, lw=1.5))
    ax.text(10.25, 9.2, '1', ha='center', va='center', fontsize=8, color=GRAY_DARK)
    ax.text(10.25, 8.8, '*', ha='center', va='center', fontsize=8, color=GRAY_DARK)

    # User -> HabitGroup (1:*)
    ax.annotate('', xy=(2, 6), xytext=(2, 7),
                arrowprops=dict(arrowstyle='->', color=GRAY_DARK, lw=1.5))

    # HabitGroup -> Habit (M:N via items)
    ax.annotate('', xy=(5.5, 4.5), xytext=(4, 4.5),
                arrowprops=dict(arrowstyle='->', color=GRAY_DARK, lw=1.5))
    ax.text(4.75, 4.7, 'M:N', ha='center', va='center', fontsize=7, color=GRAY_DARK)

    # User -> UserBadge (1:*)
    ax.annotate('', xy=(11, 4.5), xytext=(4, 7.5),
                arrowprops=dict(arrowstyle='->', color=GRAY_DARK, lw=1.5))

    # Badge -> UserBadge (1:*)
    ax.annotate('', xy=(11, 3.5), xytext=(9, 3.5),
                arrowprops=dict(arrowstyle='->', color=GRAY_DARK, lw=1.5))

    save_fig(fig, 'class_diagram.png')

# ============================================================
# 4. ER Diagram
# ============================================================
def create_er_diagram():
    fig, ax = plt.subplots(1, 1, figsize=(14, 10))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)
    ax.axis('off')
    fig.patch.set_facecolor(WHITE)
    ax.set_facecolor(WHITE)

    ax.text(7, 9.6, 'Entity Relationship Diagram — HabitForge', 
            ha='center', va='center', fontsize=16, fontweight='bold', color=GRAY_DARK)

    def draw_entity(ax, x, y, w, h, name, columns, pk_col, color=BLUE):
        # Entity box
        box = FancyBboxPatch((x, y), w, h, 
                              boxstyle="round,pad=0.05", 
                              facecolor=WHITE, edgecolor=color, linewidth=2)
        ax.add_patch(box)
        
        # Title
        title_bar = FancyBboxPatch((x, y + h - 0.5), w, 0.5, 
                                    boxstyle="round,pad=0.02", 
                                    facecolor=color, edgecolor=color, linewidth=0)
        ax.add_patch(title_bar)
        ax.text(x + w/2, y + h - 0.25, name, ha='center', va='center', 
                fontsize=9, fontweight='bold', color=WHITE)
        
        # Columns
        for i, col in enumerate(columns):
            is_pk = col == pk_col
            weight = 'bold' if is_pk else 'normal'
            col_color = RED if is_pk else GRAY_DARK
            prefix = '🔑 ' if is_pk else '   '
            ax.text(x + 0.15, y + h - 0.8 - i * 0.32, f'{prefix}{col}', 
                    ha='left', va='center', fontsize=7, color=col_color, 
                    weight=weight, family='monospace')

    # Entities
    draw_entity(ax, 0.5, 6, 3.5, 3.5, 'auth.users', 
                ['id (PK)', 'email', 'encrypted_password', 'created_at'], 'id (PK)', BLUE)

    draw_entity(ax, 5.5, 6, 3.5, 4.5, 'habits',
                ['id (PK)', 'user_id (FK)', 'name', 'habit_type', 'target_value',
                 'frequency', 'category', 'color', 'is_active', 'created_at'],
                'id (PK)', PURPLE)

    draw_entity(ax, 10.5, 6, 3, 3.5, 'habit_logs',
                ['id (PK)', 'habit_id (FK)', 'user_id (FK)', 'completed_date',
                 'count_value', 'note', 'created_at'],
                'id (PK)', GREEN)

    draw_entity(ax, 0.5, 2, 3.5, 3, 'habit_groups',
                ['id (PK)', 'user_id (FK)', 'name', 'description', 'color', 'created_at'],
                'id (PK)', ORANGE)

    draw_entity(ax, 5.5, 1, 3.5, 2.5, 'badges',
                ['id (PK)', 'name', 'description', 'icon', 'req_type', 'req_value'],
                'id (PK)', RED)

    draw_entity(ax, 10.5, 1, 3, 2.5, 'user_badges',
                ['id (PK)', 'user_id (FK)', 'badge_id (FK)', 'earned_at'],
                'id (PK)', GRAY_DARK)

    # Relationship lines with crow's foot notation
    def draw_relationship(ax, x1, y1, x2, y2, label):
        ax.plot([x1, x2], [y1, y2], color=GRAY_DARK, linewidth=1.5)
        mid_x, mid_y = (x1 + x2) / 2, (y1 + y2) / 2
        ax.text(mid_x + 0.2, mid_y, label, ha='left', va='center', 
                fontsize=7, color=GRAY_DARK, style='italic')

    # users -> habits (1:N)
    draw_relationship(ax, 4, 7.5, 5.5, 7.5, '1 : N')
    
    # habits -> habit_logs (1:N)
    draw_relationship(ax, 9, 7.5, 10.5, 7.5, '1 : N')
    
    # users -> habit_groups (1:N)
    draw_relationship(ax, 2, 6, 2, 5, '1 : N')
    
    # habit_groups -> habits (M:N)
    draw_relationship(ax, 4, 3.5, 5.5, 3.5, 'M : N')
    
    # users -> user_badges (1:N)
    draw_relationship(ax, 4, 3, 10.5, 2.5, '1 : N')
    
    # badges -> user_badges (1:N)
    draw_relationship(ax, 9, 2, 10.5, 2, '1 : N')

    # Legend
    legend_y = 0.5
    ax.text(0.5, legend_y, 'Legend:', ha='left', va='center', fontsize=8, fontweight='bold', color=GRAY_DARK)
    ax.text(2.5, legend_y, '🔑 Primary Key', ha='left', va='center', fontsize=7, color=RED)
    ax.text(5, legend_y, 'FK Foreign Key', ha='left', va='center', fontsize=7, color=GRAY_DARK)
    ax.text(7.5, legend_y, '1:N One-to-Many', ha='left', va='center', fontsize=7, color=GRAY_DARK)
    ax.text(10.5, legend_y, 'M:N Many-to-Many', ha='left', va='center', fontsize=7, color=GRAY_DARK)

    save_fig(fig, 'er_diagram.png')

# ============================================================
# 5. DFD Context Diagram (Level 0)
# ============================================================
def create_dfd_context():
    fig, ax = plt.subplots(1, 1, figsize=(12, 8))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 8)
    ax.axis('off')
    fig.patch.set_facecolor(WHITE)
    ax.set_facecolor(WHITE)

    ax.text(6, 7.5, 'Data Flow Diagram — Context Level (Level 0)', 
            ha='center', va='center', fontsize=14, fontweight='bold', color=GRAY_DARK)

    # Central system
    system = FancyBboxPatch((3.5, 3), 5, 2, 
                             boxstyle="round,pad=0.1", 
                             facecolor=BLUE_LIGHT, edgecolor=BLUE_DARK, linewidth=2.5)
    ax.add_patch(system)
    ax.text(6, 4.3, 'HabitForge', ha='center', va='center', 
            fontsize=14, fontweight='bold', color=BLUE_DARK)
    ax.text(6, 3.7, 'System', ha='center', va='center', 
            fontsize=10, color=BLUE_DARK)

    # User entity
    user = FancyBboxPatch((0.5, 3.5), 2, 1, 
                           boxstyle="round,pad=0.1", 
                           facecolor=GREEN_LIGHT, edgecolor=GREEN, linewidth=2)
    ax.add_patch(user)
    ax.text(1.5, 4.0, '👤 User', ha='center', va='center', fontsize=10, color=GRAY_DARK)

    # Google OAuth
    google = FancyBboxPatch((9.5, 5.5), 2, 1, 
                             boxstyle="round,pad=0.1", 
                             facecolor='#FEF3C7', edgecolor=ORANGE, linewidth=2)
    ax.add_patch(google)
    ax.text(10.5, 6.0, 'Google OAuth', ha='center', va='center', fontsize=8, color=GRAY_DARK)

    # Supabase
    supabase = FancyBboxPatch((9.5, 1.5), 2, 1, 
                               boxstyle="round,pad=0.1", 
                               facecolor=PURPLE_LIGHT, edgecolor=PURPLE, linewidth=2)
    ax.add_patch(supabase)
    ax.text(10.5, 2.0, 'Supabase', ha='center', va='center', fontsize=9, color=GRAY_DARK)

    # Data flows
    # User -> System
    ax.annotate('', xy=(3.5, 4.2), xytext=(2.5, 4.0),
                arrowprops=dict(arrowstyle='->', color=GRAY_DARK, lw=1.5))
    ax.text(2.8, 4.6, 'Login, Habit Data,\nCheck-ins', ha='center', va='center', 
            fontsize=7, color=GRAY_DARK)

    # System -> User
    ax.annotate('', xy=(2.5, 3.8), xytext=(3.5, 3.8),
                arrowprops=dict(arrowstyle='->', color=GRAY_DARK, lw=1.5))
    ax.text(2.8, 3.4, 'Dashboard,\nAnalytics, Badges', ha='center', va='center', 
            fontsize=7, color=GRAY_DARK)

    # System <-> Google OAuth
    ax.annotate('', xy=(9.5, 5.8), xytext=(8.5, 4.8),
                arrowprops=dict(arrowstyle='<->', color=ORANGE, lw=1.5))
    ax.text(9.3, 5.0, 'OAuth Token', ha='center', va='center', fontsize=7, color=ORANGE)

    # System <-> Supabase
    ax.annotate('', xy=(9.5, 2.2), xytext=(8.5, 3.2),
                arrowprops=dict(arrowstyle='<->', color=PURPLE, lw=1.5))
    ax.text(9.3, 2.8, 'SQL Queries,\nAuth Data', ha='center', va='center', 
            fontsize=7, color=PURPLE)

    save_fig(fig, 'dfd_context.png')

# ============================================================
# 6. DFD Level 1
# ============================================================
def create_dfd_level1():
    fig, ax = plt.subplots(1, 1, figsize=(14, 10))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)
    ax.axis('off')
    fig.patch.set_facecolor(WHITE)
    ax.set_facecolor(WHITE)

    ax.text(7, 9.6, 'Data Flow Diagram — Level 1', 
            ha='center', va='center', fontsize=14, fontweight='bold', color=GRAY_DARK)

    # External entity: User
    user = FancyBboxPatch((0.3, 4), 2, 1.2, 
                           boxstyle="round,pad=0.1", 
                           facecolor=GREEN_LIGHT, edgecolor=GREEN, linewidth=2)
    ax.add_patch(user)
    ax.text(1.3, 4.6, '👤 User', ha='center', va='center', fontsize=10, color=GRAY_DARK)

    # Processes
    processes = [
        (3, 7.5, 2.5, 0.9, 'P1\nAuthentication', BLUE),
        (3, 5.5, 2.5, 0.9, 'P2\nHabit CRUD', PURPLE),
        (3, 3.5, 2.5, 0.9, 'P3\nCheck-in', GREEN),
        (3, 1.5, 2.5, 0.9, 'P4\nAnalytics', ORANGE),
    ]

    for x, y, w, h, label, color in processes:
        box = FancyBboxPatch((x, y), w, h, 
                              boxstyle="round,pad=0.08", 
                              facecolor=WHITE, edgecolor=color, linewidth=2)
        ax.add_patch(box)
        ax.text(x + w/2, y + h/2, label, ha='center', va='center', 
                fontsize=8, fontweight='bold', color=color)

    # Data stores
    stores = [
        (8, 7.5, 2.5, 0.8, 'D1\nSessions', BLUE_LIGHT),
        (8, 5.5, 2.5, 0.8, 'D2\nHabits DB', PURPLE_LIGHT),
        (8, 3.5, 2.5, 0.8, 'D3\nLogs DB', GREEN_LIGHT),
        (8, 1.5, 2.5, 0.8, 'D4\nBadges DB', '#FEF3C7'),
    ]

    for x, y, w, h, label, color in stores:
        box = FancyBboxPatch((x, y), w, h, 
                              boxstyle="round,pad=0.05", 
                              facecolor=color, edgecolor=GRAY, linewidth=1.5)
        ax.add_patch(box)
        ax.text(x + w/2, y + h/2, label, ha='center', va='center', 
                fontsize=8, color=GRAY_DARK)

    # Data flow arrows
    # User -> P1
    ax.annotate('', xy=(3, 7.8), xytext=(2.3, 4.8),
                arrowprops=dict(arrowstyle='->', color=GRAY_DARK, lw=1.2))
    ax.text(2.2, 6.5, 'Login\nCredentials', ha='center', va='center', fontsize=6, color=GRAY_DARK)

    # P1 -> D1
    ax.annotate('', xy=(8, 7.8), xytext=(5.5, 7.8),
                arrowprops=dict(arrowstyle='->', color=BLUE, lw=1.2))

    # User -> P2
    ax.annotate('', xy=(3, 5.8), xytext=(2.3, 4.6),
                arrowprops=dict(arrowstyle='->', color=GRAY_DARK, lw=1.2))
    ax.text(2.0, 5.3, 'Habit Data', ha='center', va='center', fontsize=6, color=GRAY_DARK)

    # P2 -> D2
    ax.annotate('', xy=(8, 5.8), xytext=(5.5, 5.8),
                arrowprops=dict(arrowstyle='->', color=PURPLE, lw=1.2))

    # User -> P3
    ax.annotate('', xy=(3, 3.8), xytext=(2.3, 4.4),
                arrowprops=dict(arrowstyle='->', color=GRAY_DARK, lw=1.2))
    ax.text(2.0, 4.1, 'Check-in', ha='center', va='center', fontsize=6, color=GRAY_DARK)

    # P3 -> D3
    ax.annotate('', xy=(8, 3.8), xytext=(5.5, 3.8),
                arrowprops=dict(arrowstyle='->', color=GREEN, lw=1.2))

    # User -> P4
    ax.annotate('', xy=(3, 1.8), xytext=(2.3, 4.2),
                arrowprops=dict(arrowstyle='->', color=GRAY_DARK, lw=1.2))

    # P4 -> D2, D3, D4
    ax.annotate('', xy=(8, 5.5), xytext=(5.5, 1.8),
                arrowprops=dict(arrowstyle='->', color=ORANGE, lw=1.2))
    ax.annotate('', xy=(8, 3.5), xytext=(5.5, 1.6),
                arrowprops=dict(arrowstyle='->', color=ORANGE, lw=1.2))
    ax.annotate('', xy=(8, 1.5), xytext=(5.5, 1.5),
                arrowprops=dict(arrowstyle='->', color=ORANGE, lw=1.2))

    # P4 -> User (response)
    ax.annotate('', xy=(2.3, 4.0), xytext=(3, 1.5),
                arrowprops=dict(arrowstyle='->', color=GRAY_DARK, lw=1.2))
    ax.text(2.0, 2.8, 'Reports,\nCharts', ha='center', va='center', fontsize=6, color=GRAY_DARK)

    # Legend
    ax.text(11.5, 9.5, 'Legend:', ha='left', va='center', fontsize=8, fontweight='bold')
    ax.text(11.5, 9.0, 'P = Process', ha='left', va='center', fontsize=7, color=GRAY_DARK)
    ax.text(11.5, 8.6, 'D = Data Store', ha='left', va='center', fontsize=7, color=GRAY_DARK)
    ax.text(11.5, 8.2, '→ = Data Flow', ha='left', va='center', fontsize=7, color=GRAY_DARK)

    save_fig(fig, 'dfd_level1.png')

# ============================================================
# 7. Project Structure Tree
# ============================================================
def create_project_structure():
    fig, ax = plt.subplots(1, 1, figsize=(12, 10))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 10)
    ax.axis('off')
    fig.patch.set_facecolor(WHITE)
    ax.set_facecolor(WHITE)

    ax.text(6, 9.6, 'Project Structure — HabitForge', 
            ha='center', va='center', fontsize=14, fontweight='bold', color=GRAY_DARK)

    structure = """habit-forge/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── analytics/page.tsx
│   │   │   ├── badges/page.tsx
│   │   │   ├── calendar/page.tsx
│   │   │   ├── events/page.tsx
│   │   │   ├── groups/page.tsx
│   │   │   ├── habits/new/page.tsx
│   │   │   └── habits/[id]/edit/page.tsx
│   │   ├── api/
│   │   │   ├── auth/callback/route.ts
│   │   │   └── badges/award/route.ts
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── HabitCard.tsx
│   │   ├── HabitForm.tsx
│   │   ├── Calendar.tsx
│   │   └── ui/
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   └── streaks.ts
│   └── middleware.ts
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_events_table.sql
│   │   └── 003_links_column.sql
│   └── award_badges.sql
├── public/
├── docs/
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .env.local"""

    ax.text(0.3, 9.0, structure, ha='left', va='top', fontsize=7, 
            color=GRAY_DARK, family='monospace',
            bbox=dict(boxstyle='round,pad=0.5', facecolor=BG, edgecolor=GRAY_LIGHT, linewidth=1))

    save_fig(fig, 'project_structure.png')

# ============================================================
# 8. Testing Pyramid
# ============================================================
def create_testing_pyramid():
    fig, ax = plt.subplots(1, 1, figsize=(10, 8))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 8)
    ax.axis('off')
    fig.patch.set_facecolor(WHITE)
    ax.set_facecolor(WHITE)

    ax.text(5, 7.5, 'Testing Strategy — Testing Pyramid', 
            ha='center', va='center', fontsize=14, fontweight='bold', color=GRAY_DARK)

    # Pyramid layers (from top to bottom)
    layers = [
        # (x_center, y_bottom, width, height, label, count, color)
        (5, 6.5, 2.5, 1.0, 'E2E Tests\n(Playwright)', '16 tests', '#EF4444'),
        (5, 5.2, 4.5, 1.2, 'Integration Tests\n(API + DB)', '12 tests', '#F59E0B'),
        (5, 3.5, 7, 1.5, 'Unit Tests\n(Jest)', '42 tests', '#10B981'),
    ]

    for cx, by, w, h, label, count, color in layers:
        # Draw trapezoid-like rectangle
        box = FancyBboxPatch((cx - w/2, by), w, h, 
                              boxstyle="round,pad=0.08", 
                              facecolor=color, edgecolor=WHITE, linewidth=2, alpha=0.85)
        ax.add_patch(box)
        ax.text(cx, by + h/2 + 0.15, label, ha='center', va='center', 
                fontsize=9, fontweight='bold', color=WHITE)
        ax.text(cx, by + h/2 - 0.25, count, ha='center', va='center', 
                fontsize=8, color=WHITE)

    # Total
    ax.text(5, 2.5, 'Total: 70 Tests', ha='center', va='center', 
            fontsize=12, fontweight='bold', color=GRAY_DARK)
    ax.text(5, 2.0, 'Coverage: ~85%', ha='center', va='center', 
            fontsize=10, color=GRAY)

    # Labels on sides
    ax.text(9.5, 6.0, 'Fewer\nSlower\nMore\nRealistic', ha='center', va='center', 
            fontsize=7, color=GRAY, style='italic')
    ax.text(9.5, 4.2, 'More\nFaster\nIsolated', ha='center', va='center', 
            fontsize=7, color=GRAY, style='italic')

    save_fig(fig, 'testing_pyramid.png')

# ============================================================
# 9. Tech Stack Diagram
# ============================================================
def create_tech_stack():
    fig, ax = plt.subplots(1, 1, figsize=(12, 8))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 8)
    ax.axis('off')
    fig.patch.set_facecolor(BG)
    ax.set_facecolor(BG)

    ax.text(6, 7.5, 'Technology Stack — HabitForge', 
            ha='center', va='center', fontsize=14, fontweight='bold', color=GRAY_DARK)

    techs = [
        (2, 5.5, 'Next.js 14', 'Framework', BLUE),
        (6, 5.5, 'Supabase', 'Database', GREEN),
        (10, 5.5, 'Tailwind CSS', 'Styling', '#06B6D4'),
        (2, 3.5, 'Recharts', 'Charts', PURPLE),
        (6, 3.5, 'Vercel', 'Hosting', GRAY_DARK),
        (10, 3.5, 'TypeScript', 'Language', '#3178C6'),
    ]

    for x, y, name, role, color in techs:
        box = FancyBboxPatch((x-1.5, y-0.6), 3, 1.2, 
                              boxstyle="round,pad=0.1", 
                              facecolor=color, edgecolor=WHITE, linewidth=2, alpha=0.9)
        ax.add_patch(box)
        ax.text(x, y + 0.15, name, ha='center', va='center', 
                fontsize=10, fontweight='bold', color=WHITE)
        ax.text(x, y - 0.2, role, ha='center', va='center', 
                fontsize=7, color=WHITE, alpha=0.8)

    # Arrows showing flow
    ax.annotate('', xy=(4.5, 5.5), xytext=(3.5, 5.5),
                arrowprops=dict(arrowstyle='->', color=GRAY, lw=1.5))
    ax.annotate('', xy=(8.5, 5.5), xytext=(7.5, 5.5),
                arrowprops=dict(arrowstyle='->', color=GRAY, lw=1.5))
    ax.annotate('', xy=(2, 4.1), xytext=(2, 4.9),
                arrowprops=dict(arrowstyle='->', color=GRAY, lw=1.5))
    ax.annotate('', xy=(6, 4.1), xytext=(6, 4.9),
                arrowprops=dict(arrowstyle='->', color=GRAY, lw=1.5))
    ax.annotate('', xy=(10, 4.1), xytext=(10, 4.9),
                arrowprops=dict(arrowstyle='->', color=GRAY, lw=1.5))

    save_fig(fig, 'tech_stack.png')

# ============================================================
# 10. Sprint Timeline
# ============================================================
def create_sprint_timeline():
    fig, ax = plt.subplots(1, 1, figsize=(14, 6))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 6)
    ax.axis('off')
    fig.patch.set_facecolor(WHITE)
    ax.set_facecolor(WHITE)

    ax.text(7, 5.5, 'Agile Sprint Timeline — 8 Sprints, 20 Days', 
            ha='center', va='center', fontsize=14, fontweight='bold', color=GRAY_DARK)

    sprints = [
        (1, 'Sprint 1\nSetup', 2, BLUE),
        (3.5, 'Sprint 2\nAuth', 2, PURPLE),
        (6, 'Sprint 3\nCRUD', 3, GREEN),
        (9, 'Sprint 4\nCheck-in', 3, ORANGE),
        (11.5, 'Sprint 5\nAnalytics', 3, RED),
    ]

    # Draw timeline
    ax.plot([0.5, 13.5], [3, 3], color=GRAY_LIGHT, linewidth=3, zorder=1)

    for x, label, days, color in sprints:
        # Circle on timeline
        circle = plt.Circle((x, 3), 0.3, color=color, zorder=3)
        ax.add_patch(circle)
        
        # Sprint box above
        box = FancyBboxPatch((x - 1, 3.5), 2, 1.5, 
                              boxstyle="round,pad=0.08", 
                              facecolor=color, edgecolor=WHITE, linewidth=1.5, alpha=0.9, zorder=2)
        ax.add_patch(box)
        ax.text(x, 4.25, label, ha='center', va='center', 
                fontsize=8, fontweight='bold', color=WHITE)
        ax.text(x, 3.85, f'{days} days', ha='center', va='center', 
                fontsize=7, color=WHITE, alpha=0.8)

    # Remaining sprints below
    sprints2 = [
        (2, 'Sprint 6\nBadges', 2, '#06B6D4'),
        (5, 'Sprint 7\nUI/UX', 3, '#8B5CF6'),
        (8.5, 'Sprint 8\nDeploy', 2, '#EC4899'),
    ]

    for x, label, days, color in sprints2:
        circle = plt.Circle((x, 3), 0.3, color=color, zorder=3)
        ax.add_patch(circle)
        
        box = FancyBboxPatch((x - 1, 0.8), 2, 1.5, 
                              boxstyle="round,pad=0.08", 
                              facecolor=color, edgecolor=WHITE, linewidth=1.5, alpha=0.9, zorder=2)
        ax.add_patch(box)
        ax.text(x, 1.55, label, ha='center', va='center', 
                fontsize=8, fontweight='bold', color=WHITE)
        ax.text(x, 1.15, f'{days} days', ha='center', va='center', 
                fontsize=7, color=WHITE, alpha=0.8)

    save_fig(fig, 'sprint_timeline.png')

# Run all
if __name__ == '__main__':
    print("Generating diagrams...")
    create_architecture_diagram()
    create_use_case_diagram()
    create_class_diagram()
    create_er_diagram()
    create_dfd_context()
    create_dfd_level1()
    create_project_structure()
    create_testing_pyramid()
    create_tech_stack()
    create_sprint_timeline()
    print(f"\nAll diagrams saved to {OUTPUT_DIR}")
