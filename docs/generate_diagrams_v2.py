#!/usr/bin/env python3
"""Generate professional diagrams for HabitForge project report — v2."""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import os

# Set font to Helvetica Neue (macOS system font) to avoid rendering artifacts
matplotlib.rcParams['font.family'] = 'Helvetica Neue'
matplotlib.rcParams['font.sans-serif'] = ['Helvetica Neue', 'Helvetica', 'Arial', 'DejaVu Sans']

OUTPUT_DIR = "/Users/openclaw/.hermes/projects/habit-forge/docs/images"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Professional muted color palette
BLUE = '#2563EB'
BLUE_LIGHT = '#DBEAFE'
BLUE_DARK = '#1E40AF'
PURPLE = '#7C3AED'
PURPLE_LIGHT = '#EDE9FE'
GREEN = '#059669'
GREEN_LIGHT = '#D1FAE5'
ORANGE = '#D97706'
ORANGE_LIGHT = '#FEF3C7'
RED = '#DC2626'
RED_LIGHT = '#FEE2E2'
TEAL = '#0D9488'
TEAL_LIGHT = '#CCFBF1'
GRAY = '#6B7280'
GRAY_LIGHT = '#F3F4F6'
GRAY_MID = '#D1D5DB'
GRAY_DARK = '#1F2937'
WHITE = '#FFFFFF'
BG = '#FAFBFC'

def save_fig(fig, name, dpi=200):
    path = os.path.join(OUTPUT_DIR, name)
    # Save at higher DPI then downsample to avoid rendering artifacts
    fig.savefig(path, dpi=dpi, bbox_inches='tight', pad_inches=0.5,
                facecolor=fig.get_facecolor(), edgecolor='none',
                pil_kwargs={'quality': 95})
    plt.close(fig)
    print(f"Saved: {path}")


# ============================================================
# 1. Architecture Diagram — 3-tier, no Google Auth
# ============================================================
def create_architecture_diagram():
    fig, ax = plt.subplots(figsize=(13, 9))
    ax.set_xlim(0, 13)
    ax.set_ylim(0, 9)
    ax.axis('off')
    fig.patch.set_facecolor(BG)
    ax.set_facecolor(BG)

    ax.text(6.5, 8.6, 'HabitForge System Architecture',
            ha='center', va='center', fontsize=17, fontweight='bold', color=GRAY_DARK)

    def draw_layer(ax, y, h, label, color, light_color, items):
        """Draw a layer with rounded background and evenly spaced item boxes."""
        box = FancyBboxPatch((0.4, y), 12.2, h,
                             boxstyle="round,pad=0.1",
                             facecolor=light_color, edgecolor=color, linewidth=2)
        ax.add_patch(box)
        ax.text(0.7, y + h - 0.35, label, ha='left', va='center',
                fontsize=8, fontweight='bold', color=color)
        n = len(items)
        total_w = 11.6
        gap = 0.3
        box_w = (total_w - gap * (n - 1)) / n
        for i, (title, subtitle) in enumerate(items):
            bx = 0.7 + i * (box_w + gap)
            b = FancyBboxPatch((bx, y + 0.35), box_w, h - 0.65,
                               boxstyle="round,pad=0.06",
                               facecolor=WHITE, edgecolor=color, linewidth=1.2)
            ax.add_patch(b)
            ax.text(bx + box_w / 2, y + h - 0.55, title,
                    ha='center', va='center', fontsize=8.5, fontweight='bold', color=GRAY_DARK)
            ax.text(bx + box_w / 2, y + 0.65, subtitle,
                    ha='center', va='center', fontsize=6.5, color=GRAY)

    # Client Layer
    draw_layer(ax, 6.1, 2.0, 'CLIENT LAYER', BLUE, BLUE_LIGHT, [
        ('Web Browser', 'Chrome / Safari / Firefox'),
        ('Next.js 14', 'App Router, SSR, API Routes'),
        ('Tailwind CSS v4', 'Responsive UI, Dark Mode'),
    ])

    # Server Layer
    draw_layer(ax, 3.4, 2.3, 'SERVER LAYER', PURPLE, PURPLE_LIGHT, [
        ('API Routes', 'RESTful Endpoints'),
        ('Auth Middleware', 'Session Management'),
        ('Recharts', 'Data Visualization'),
    ])

    # Database Layer
    draw_layer(ax, 0.7, 2.3, 'DATABASE LAYER', GREEN, GREEN_LIGHT, [
        ('Supabase', 'PostgreSQL + Auth + Storage'),
        ('PostgreSQL', '6 Tables, RLS Policies'),
        ('Row Level Security', 'Per-user data isolation'),
    ])

    # Arrows between layers
    for x in [2.65, 6.5, 10.35]:
        ax.annotate('', xy=(x, 6.1), xytext=(x, 5.4),
                    arrowprops=dict(arrowstyle='->', color=GRAY, lw=1.5))
        ax.annotate('', xy=(x, 3.4), xytext=(x, 3.0),
                    arrowprops=dict(arrowstyle='->', color=GRAY, lw=1.5))

    save_fig(fig, 'architecture.png')


# ============================================================
# 2. Tech Stack — clean grid with proper flow
# ============================================================
def create_tech_stack():
    fig, ax = plt.subplots(figsize=(12, 7))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 7)
    ax.axis('off')
    fig.patch.set_facecolor(BG)
    ax.set_facecolor(BG)

    ax.text(6, 6.5, 'Technology Stack — HabitForge',
            ha='center', va='center', fontsize=16, fontweight='bold', color=GRAY_DARK)

    items = [
        (2, 4.5, 'TypeScript', 'Language', BLUE),
        (6, 4.5, 'Next.js 14', 'Framework', '#1F2937'),
        (10, 4.5, 'Tailwind CSS', 'Styling', TEAL),
        (2, 2.2, 'Supabase', 'Database + Auth', GREEN),
        (6, 2.2, 'Recharts', 'Charts', PURPLE),
        (10, 2.2, 'Vercel', 'Hosting', '#1F2937'),
    ]

    for x, y, title, category, color in items:
        box = FancyBboxPatch((x - 1.5, y - 0.8), 3, 1.6,
                             boxstyle="round,pad=0.08",
                             facecolor=WHITE, edgecolor=color, linewidth=2)
        ax.add_patch(box)
        ax.text(x, y + 0.25, title, ha='center', va='center',
                fontsize=11, fontweight='bold', color=color)
        ax.text(x, y - 0.25, category, ha='center', va='center',
                fontsize=8, color=GRAY)

    # Arrows: TypeScript -> Next.js -> Tailwind (top row, left to right)
    ax.annotate('', xy=(4.5, 4.5), xytext=(3.5, 4.5),
                arrowprops=dict(arrowstyle='->', color=GRAY_MID, lw=1.5))
    ax.annotate('', xy=(8.5, 4.5), xytext=(7.5, 4.5),
                arrowprops=dict(arrowstyle='->', color=GRAY_MID, lw=1.5))

    # Arrows: top row -> bottom row (vertical connections)
    ax.annotate('', xy=(2, 3.0), xytext=(2, 3.7),
                arrowprops=dict(arrowstyle='->', color=GRAY_MID, lw=1.2))
    ax.annotate('', xy=(6, 3.0), xytext=(6, 3.7),
                arrowprops=dict(arrowstyle='->', color=GRAY_MID, lw=1.2))
    ax.annotate('', xy=(10, 3.0), xytext=(10, 3.7),
                arrowprops=dict(arrowstyle='->', color=GRAY_MID, lw=1.2))

    save_fig(fig, 'tech_stack.png')


# ============================================================
# 3. UML Use Case Diagram — clean layout, no Google Auth
# ============================================================
def create_use_case_diagram():
    fig, ax = plt.subplots(figsize=(14, 10))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)
    ax.axis('off')
    fig.patch.set_facecolor(WHITE)
    ax.set_facecolor(WHITE)

    ax.text(7, 9.6, 'UML Use Case Diagram — HabitForge',
            ha='center', va='center', fontsize=16, fontweight='bold', color=GRAY_DARK)

    # System boundary
    system = FancyBboxPatch((2.5, 1.2), 9, 7.8,
                            boxstyle="round,pad=0.15",
                            facecolor=BG, edgecolor=GRAY_DARK, linewidth=2, linestyle='--')
    ax.add_patch(system)
    ax.text(7, 8.75, 'HabitForge System', ha='center', va='center',
            fontsize=11, fontweight='bold', color=GRAY_DARK)

    # User actor — stick figure on left
    ux, uy = 1.2, 5.5
    circle = plt.Circle((ux, uy + 0.5), 0.28, facecolor=BLUE_LIGHT, edgecolor=BLUE, linewidth=2)
    ax.add_patch(circle)
    ax.plot([ux, ux], [uy + 0.22, uy - 0.35], color=BLUE_DARK, linewidth=2)
    ax.plot([ux - 0.28, ux + 0.28], [uy - 0.05, uy - 0.05], color=BLUE_DARK, linewidth=2)
    ax.plot([ux, ux - 0.25], [uy - 0.35, uy - 0.75], color=BLUE_DARK, linewidth=2)
    ax.plot([ux, ux + 0.25], [uy - 0.35, uy - 0.75], color=BLUE_DARK, linewidth=2)
    ax.text(ux, uy - 1.05, 'User', ha='center', va='center', fontsize=10, fontweight='bold', color=BLUE_DARK)

    # Use case ellipses — arranged in 3 columns, 5 rows
    use_cases = [
        (4.5, 7.8, 'Register'),
        (7, 7.8, 'Login'),
        (9.5, 7.8, 'Logout'),
        (4.5, 6.5, 'Create Habit'),
        (7, 6.5, 'Edit Habit'),
        (9.5, 6.5, 'Delete Habit'),
        (4.5, 5.2, 'View Dashboard'),
        (7, 5.2, 'Check-in Habit'),
        (9.5, 5.2, 'Undo Check-in'),
        (4.5, 3.9, 'View Analytics'),
        (7, 3.9, 'View Badges'),
        (9.5, 3.9, 'Create Routine'),
        (4.5, 2.6, 'Delete Routine'),
        (7, 2.6, 'Toggle Dark Mode'),
    ]

    uc_positions = {}
    for x, y, label in use_cases:
        ellipse = mpatches.Ellipse((x, y), 2.0, 0.6,
                                   facecolor=BLUE_LIGHT, edgecolor=BLUE, linewidth=1.5)
        ax.add_patch(ellipse)
        ax.text(x, y, label, ha='center', va='center', fontsize=7.5, color=GRAY_DARK)
        uc_positions[label] = (x, y)

    # Connect user to use cases — fan out with slight angles to avoid overlap
    for x, y, label in use_cases:
        dx = 2.5 - x
        dy = y - uy
        start_x = ux + 0.28 * (dx / (abs(dx) + abs(dy) + 0.01))
        start_y = uy + 0.28 * (dy / (abs(dx) + abs(dy) + 0.01))
        end_x = x - 1.0
        end_y = y
        ax.plot([start_x + 0.5, end_x], [start_y, end_y], color=GRAY_MID, linewidth=0.7, linestyle='-')

    # Include: Check-in Habit includes Calculate Streak
    cx, cy = uc_positions['Check-in Habit']
    ax.annotate('', xy=(cx, cy + 0.4), xytext=(cx, cy + 0.85),
                arrowprops=dict(arrowstyle='->', color=RED, lw=1.2))
    ax.text(cx + 0.25, cy + 0.62, '<<include>>', ha='left', va='center',
            fontsize=6, color=RED, style='italic')

    # Supabase as external actor (bottom right, inside boundary)
    sx, sy = 10.5, 1.6
    ax.add_patch(FancyBboxPatch((sx - 1.0, sy - 0.3), 2.0, 0.6,
                                boxstyle="round,pad=0.05",
                                facecolor=GREEN_LIGHT, edgecolor=GREEN, linewidth=1.5))
    ax.text(sx, sy, 'Supabase Auth', ha='center', va='center', fontsize=7.5, color=GRAY_DARK)
    ax.annotate('', xy=(9.5, 2.6), xytext=(10.0, 1.9),
                arrowprops=dict(arrowstyle='->', color=GREEN, lw=1))

    save_fig(fig, 'use_case.png')


# ============================================================
# 4. UML Class Diagram — proper spacing, no overlap
# ============================================================
def create_class_diagram():
    fig, ax = plt.subplots(figsize=(16, 15))
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 15)
    ax.axis('off')
    fig.patch.set_facecolor(WHITE)
    ax.set_facecolor(WHITE)

    ax.text(8, 14.3, 'UML Class Diagram — HabitForge',
            ha='center', va='center', fontsize=16, fontweight='bold', color=GRAY_DARK)

    def draw_class(ax, x, y, w, h, title, attrs, methods, color):
        box = FancyBboxPatch((x, y), w, h,
                             boxstyle="round,pad=0.05",
                             facecolor=WHITE, edgecolor=color, linewidth=2)
        ax.add_patch(box)
        # Title bar
        title_bar = FancyBboxPatch((x, y + h - 0.55), w, 0.55,
                                   boxstyle="round,pad=0.02",
                                   facecolor=color, edgecolor=color, linewidth=0)
        ax.add_patch(title_bar)
        ax.text(x + w / 2, y + h - 0.27, title,
                ha='center', va='center', fontsize=9.5, fontweight='bold', color=WHITE)
        # Separator
        ax.plot([x, x + w], [y + h - 0.55, y + h - 0.55], color=color, linewidth=1)
        # Attributes
        for i, attr in enumerate(attrs):
            ax.text(x + 0.2, y + h - 0.85 - i * 0.32, attr,
                    ha='left', va='center', fontsize=7, color=GRAY_DARK, family='monospace')
        # Separator
        sep_y = y + h - 0.55 - len(attrs) * 0.32 - 0.15
        ax.plot([x + 0.1, x + w - 0.1], [sep_y, sep_y], color=GRAY_MID, linewidth=0.8)
        # Methods
        for i, method in enumerate(methods):
            ax.text(x + 0.2, sep_y - 0.25 - i * 0.32, method,
                    ha='left', va='center', fontsize=7, color=GRAY_DARK, family='monospace')

    # Row 1: User, Habit, HabitLog
    draw_class(ax, 0.3, 9.0, 3.8, 4.2, 'User',
               ['id: UUID', 'email: string', 'full_name: string', 'created_at: timestamp'],
               ['register()', 'login()', 'logout()'], BLUE)

    draw_class(ax, 5.5, 9.0, 4.5, 5.5, 'Habit',
               ['id: UUID', 'user_id: FK', 'name: string', 'habit_type: string',
                'target_value: int', 'frequency: string', 'category: string',
                'color: string', 'is_active: bool'],
               ['create()', 'update()', 'delete()', 'checkin()', 'undoCheckin()'], PURPLE)

    draw_class(ax, 11.5, 9.0, 4.0, 3.8, 'HabitLog',
               ['id: UUID', 'habit_id: FK', 'user_id: FK', 'completed_date: date',
                'count_value: int', 'note: text'],
               [], GREEN)

    # Row 2: HabitGroup, Badge, UserBadge
    draw_class(ax, 0.3, 4.5, 3.8, 3.8, 'HabitGroup',
               ['id: UUID', 'user_id: FK', 'name: string', 'description: text', 'color: string'],
               ['create()', 'addHabit()', 'delete()'], ORANGE)

    draw_class(ax, 5.5, 4.5, 4.0, 3.2, 'Badge',
               ['id: UUID', 'name: string', 'description: text', 'icon: string',
                'req_type: string', 'req_value: int'],
               [], RED)

    draw_class(ax, 11.5, 4.5, 4.0, 2.8, 'UserBadge',
               ['id: UUID', 'user_id: FK', 'badge_id: FK', 'earned_at: timestamp'],
               [], TEAL)

    # StreakCalculator — connected to HabitLog
    draw_class(ax, 11.5, 1.0, 4.0, 2.2, 'StreakCalculator',
               [],
               ['calculateStreak()', 'generateHeatmap()'], '#374151')

    # Relationship arrows
    # User -> Habit (1:*)
    ax.annotate('', xy=(5.5, 11.0), xytext=(4.1, 11.0),
                arrowprops=dict(arrowstyle='->', color=GRAY_DARK, lw=1.5))
    ax.text(4.8, 11.2, '1', ha='center', fontsize=8, color=GRAY_DARK)
    ax.text(4.8, 10.8, '*', ha='center', fontsize=8, color=GRAY_DARK)

    # Habit -> HabitLog (1:*)
    ax.annotate('', xy=(11.5, 11.0), xytext=(10.0, 11.0),
                arrowprops=dict(arrowstyle='->', color=GRAY_DARK, lw=1.5))
    ax.text(10.75, 11.2, '1', ha='center', fontsize=8, color=GRAY_DARK)
    ax.text(10.75, 10.8, '*', ha='center', fontsize=8, color=GRAY_DARK)

    # User -> HabitGroup (1:*)
    ax.annotate('', xy=(2.2, 9.0), xytext=(2.2, 8.3),
                arrowprops=dict(arrowstyle='->', color=GRAY_DARK, lw=1.5))

    # HabitGroup -> Habit (M:N)
    ax.annotate('', xy=(5.5, 6.5), xytext=(4.1, 6.5),
                arrowprops=dict(arrowstyle='->', color=GRAY_DARK, lw=1.5))
    ax.text(4.8, 6.7, 'M:N', ha='center', fontsize=7, color=GRAY_DARK)

    # User -> UserBadge (1:*)
    ax.annotate('', xy=(11.5, 6.0), xytext=(4.1, 9.5),
                arrowprops=dict(arrowstyle='->', color=GRAY_DARK, lw=1.5))

    # Badge -> UserBadge (1:*)
    ax.annotate('', xy=(11.5, 5.5), xytext=(9.5, 5.5),
                arrowprops=dict(arrowstyle='->', color=GRAY_DARK, lw=1.5))

    # HabitLog -> StreakCalculator
    ax.annotate('', xy=(13.5, 4.5), xytext=(13.5, 3.2),
                arrowprops=dict(arrowstyle='->', color=GRAY_DARK, lw=1.5, linestyle='dashed'))

    save_fig(fig, 'class_diagram.png')


# ============================================================
# 5. ER Diagram — clean layout, no emojis
# ============================================================
def create_er_diagram():
    fig, ax = plt.subplots(figsize=(14, 11))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 11)
    ax.axis('off')
    fig.patch.set_facecolor(WHITE)
    ax.set_facecolor(WHITE)

    ax.text(7, 10.5, 'Entity Relationship Diagram — HabitForge',
            ha='center', va='center', fontsize=16, fontweight='bold', color=GRAY_DARK)

    def draw_entity(ax, x, y, w, h, name, columns, pk_col, color):
        box = FancyBboxPatch((x, y), w, h,
                             boxstyle="round,pad=0.05",
                             facecolor=WHITE, edgecolor=color, linewidth=2)
        ax.add_patch(box)
        title_bar = FancyBboxPatch((x, y + h - 0.5), w, 0.5,
                                   boxstyle="round,pad=0.02",
                                   facecolor=color, edgecolor=color, linewidth=0)
        ax.add_patch(title_bar)
        ax.text(x + w / 2, y + h - 0.25, name,
                ha='center', va='center', fontsize=9, fontweight='bold', color=WHITE)
        for i, col in enumerate(columns):
            is_pk = col == pk_col
            weight = 'bold' if is_pk else 'normal'
            col_color = RED if is_pk else GRAY_DARK
            prefix = '[PK] ' if is_pk else '     '
            # Clean up display: remove (PK) from text since we use [PK] prefix
            display_col = col.replace(' (PK)', '').replace(' (FK)', '') if not is_pk else col.replace(' (PK)', '')
            if is_pk:
                display_col = col.replace(' (PK)', '')
            ax.text(x + 0.15, y + h - 0.8 - i * 0.32, f'{prefix}{display_col}',
                    ha='left', va='center', fontsize=7, color=col_color,
                    weight=weight, family='monospace')

    # Layout: 3 top, 3 bottom
    draw_entity(ax, 0.3, 6.5, 3.8, 3.5, 'auth.users',
                ['id (PK)', 'email', 'encrypted_password', 'created_at'],
                'id (PK)', BLUE)

    draw_entity(ax, 5.1, 6.5, 4.0, 4.5, 'habits',
                ['id (PK)', 'user_id (FK)', 'name', 'habit_type', 'target_value',
                 'frequency', 'category', 'color', 'is_active', 'created_at'],
                'id (PK)', PURPLE)

    draw_entity(ax, 10.0, 6.5, 3.7, 3.5, 'habit_logs',
                ['id (PK)', 'habit_id (FK)', 'user_id (FK)', 'completed_date',
                 'count_value', 'note', 'created_at'],
                'id (PK)', GREEN)

    draw_entity(ax, 0.3, 2.5, 3.8, 3.2, 'habit_groups',
                ['id (PK)', 'user_id (FK)', 'name', 'description', 'color', 'created_at'],
                'id (PK)', ORANGE)

    draw_entity(ax, 5.1, 1.5, 4.0, 2.8, 'badges',
                ['id (PK)', 'name', 'description', 'icon', 'req_type', 'req_value'],
                'id (PK)', RED)

    draw_entity(ax, 10.0, 1.5, 3.7, 2.8, 'user_badges',
                ['id (PK)', 'user_id (FK)', 'badge_id (FK)', 'earned_at'],
                'id (PK)', TEAL)

    # Relationship lines
    def draw_rel(ax, x1, y1, x2, y2, label):
        ax.plot([x1, x2], [y1, y2], color=GRAY_DARK, linewidth=1.5)
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        ax.text(mx, my + 0.25, label, ha='center', va='center',
                fontsize=7.5, color=GRAY_DARK, style='italic',
                bbox=dict(boxstyle='round,pad=0.1', facecolor=WHITE, edgecolor='none'))

    draw_rel(ax, 4.1, 8.0, 5.1, 8.0, '1 : N')
    draw_rel(ax, 9.1, 8.0, 10.0, 8.0, '1 : N')
    draw_rel(ax, 2.2, 6.5, 2.2, 5.7, '1 : N')
    draw_rel(ax, 4.1, 4.1, 5.1, 4.1, 'M : N')
    draw_rel(ax, 4.1, 3.5, 10.0, 3.0, '1 : N')
    draw_rel(ax, 9.1, 2.8, 10.0, 2.8, '1 : N')

    # Legend
    ax.text(0.3, 0.6, 'Legend:', ha='left', va='center', fontsize=8, fontweight='bold', color=GRAY_DARK)
    ax.text(1.8, 0.6, '[PK] = Primary Key', ha='left', va='center', fontsize=7.5, color=RED)
    ax.text(4.5, 0.6, 'FK = Foreign Key', ha='left', va='center', fontsize=7.5, color=GRAY_DARK)
    ax.text(7.0, 0.6, '1:N = One-to-Many', ha='left', va='center', fontsize=7.5, color=GRAY_DARK)
    ax.text(9.8, 0.6, 'M:N = Many-to-Many', ha='left', va='center', fontsize=7.5, color=GRAY_DARK)

    save_fig(fig, 'er_diagram.png')


# ============================================================
# 6. DFD Context Diagram — no Google Auth
# ============================================================
def create_dfd_context():
    fig, ax = plt.subplots(figsize=(11, 7))
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 7)
    ax.axis('off')
    fig.patch.set_facecolor(WHITE)
    ax.set_facecolor(WHITE)

    ax.text(5.5, 6.6, 'Data Flow Diagram — Context Level (Level 0)',
            ha='center', va='center', fontsize=14, fontweight='bold', color=GRAY_DARK)

    # Central system
    system = FancyBboxPatch((3.0, 2.5), 5.0, 2.0,
                            boxstyle="round,pad=0.1",
                            facecolor=BLUE_LIGHT, edgecolor=BLUE_DARK, linewidth=2.5)
    ax.add_patch(system)
    ax.text(5.5, 3.5, 'HabitForge System', ha='center', va='center',
            fontsize=12, fontweight='bold', color=BLUE_DARK)

    # User (left)
    user = FancyBboxPatch((0.3, 2.8), 2.0, 1.4,
                          boxstyle="round,pad=0.08",
                          facecolor=GREEN_LIGHT, edgecolor=GREEN, linewidth=2)
    ax.add_patch(user)
    ax.text(1.3, 3.5, 'User', ha='center', va='center',
            fontsize=11, fontweight='bold', color=GREEN)

    # Supabase (right)
    supa = FancyBboxPatch((8.7, 2.8), 2.0, 1.4,
                          boxstyle="round,pad=0.08",
                          facecolor=PURPLE_LIGHT, edgecolor=PURPLE, linewidth=2)
    ax.add_patch(supa)
    ax.text(9.7, 3.5, 'Supabase', ha='center', va='center',
            fontsize=10, fontweight='bold', color=PURPLE)

    # User -> System
    ax.annotate('', xy=(3.0, 3.8), xytext=(2.3, 3.8),
                arrowprops=dict(arrowstyle='->', color=GRAY_DARK, lw=1.5))
    ax.text(2.65, 4.05, 'Login, Habit Data, Check-ins',
            ha='center', va='center', fontsize=7.5, color=GRAY_DARK,
            bbox=dict(boxstyle='round,pad=0.1', facecolor=WHITE, edgecolor='none'))

    # System -> User
    ax.annotate('', xy=(2.3, 3.2), xytext=(3.0, 3.2),
                arrowprops=dict(arrowstyle='->', color=GRAY_DARK, lw=1.5))
    ax.text(2.65, 2.95, 'Dashboard, Analytics, Badges',
            ha='center', va='center', fontsize=7.5, color=GRAY_DARK,
            bbox=dict(boxstyle='round,pad=0.1', facecolor=WHITE, edgecolor='none'))

    # System <-> Supabase
    ax.annotate('', xy=(8.7, 3.8), xytext=(8.0, 3.8),
                arrowprops=dict(arrowstyle='->', color=GRAY_DARK, lw=1.5))
    ax.text(8.35, 4.05, 'SQL Queries, Auth Data',
            ha='center', va='center', fontsize=7.5, color=GRAY_DARK,
            bbox=dict(boxstyle='round,pad=0.1', facecolor=WHITE, edgecolor='none'))

    ax.annotate('', xy=(8.0, 3.2), xytext=(8.7, 3.2),
                arrowprops=dict(arrowstyle='->', color=GRAY_DARK, lw=1.5))
    ax.text(8.35, 2.95, 'Query Results, User Data',
            ha='center', va='center', fontsize=7.5, color=GRAY_DARK,
            bbox=dict(boxstyle='round,pad=0.1', facecolor=WHITE, edgecolor='none'))

    save_fig(fig, 'dfd_context.png')


# ============================================================
# 7. DFD Level 1 — clean layout, no artifacts
def create_dfd_level1():
    """Level 1 DFD — horizontal layout: User | Processes | Data Stores."""
    fig, ax = plt.subplots(figsize=(15, 8))
    ax.set_xlim(0, 15)
    ax.set_ylim(0, 8)
    ax.axis('off')
    fig.patch.set_facecolor(WHITE)
    ax.set_facecolor(WHITE)

    ax.text(7.5, 7.6, 'Data Flow Diagram — Level 1',
            ha='center', va='center', fontsize=14, fontweight='bold', color=GRAY_DARK)

    # Legend
    ax.text(12.0, 7.6, 'P = Process  |  D = Data Store',
            ha='left', va='center', fontsize=8, color=GRAY,
            bbox=dict(boxstyle='round,pad=0.2', facecolor=GRAY_LIGHT, edgecolor=GRAY_MID))

    # === Column 1: User ===
    user = FancyBboxPatch((0.3, 2.5), 2.0, 3.0,
                          boxstyle="round,pad=0.08",
                          facecolor=GREEN_LIGHT, edgecolor=GREEN, linewidth=2)
    ax.add_patch(user)
    ax.text(1.3, 4.0, 'User', ha='center', va='center',
            fontsize=12, fontweight='bold', color=GREEN)

    # === Column 2: Processes P1-P4 (evenly spaced) ===
    processes = [
        (4.5, 6.2, 'P1', 'Authentication', BLUE),
        (4.5, 4.6, 'P2', 'Habit CRUD', PURPLE),
        (4.5, 3.0, 'P3', 'Check-in', ORANGE),
        (4.5, 1.4, 'P4', 'Analytics', TEAL),
    ]

    for px, py, pid, pname, pcolor in processes:
        p = FancyBboxPatch((px - 0.9, py - 0.35), 1.8, 0.7,
                           boxstyle="round,pad=0.06",
                           facecolor=pcolor, edgecolor=pcolor, linewidth=2)
        ax.add_patch(p)
        ax.text(px, py, f'{pid}\n{pname}', ha='center', va='center',
                fontsize=7.5, fontweight='bold', color=WHITE)

    # === Column 3: Data Stores D1-D4 ===
    stores = [
        (10.0, 6.2, 'D1', 'Sessions', BLUE_LIGHT, BLUE),
        (10.0, 4.6, 'D2', 'Habits DB', PURPLE_LIGHT, PURPLE),
        (10.0, 3.0, 'D3', 'Logs DB', ORANGE_LIGHT, ORANGE),
        (10.0, 1.4, 'D4', 'Badges DB', TEAL_LIGHT, TEAL),
    ]

    for dx, dy, did, dname, dlight, dcolor in stores:
        d = FancyBboxPatch((dx - 0.9, dy - 0.35), 1.8, 0.7,
                           boxstyle="round,pad=0.06",
                           facecolor=dlight, edgecolor=dcolor, linewidth=2)
        ax.add_patch(d)
        ax.text(dx, dy, f'{did}\n{dname}', ha='center', va='center',
                fontsize=7.5, fontweight='bold', color=dcolor)

    # === User -> Processes (horizontal arrows with labels above) ===
    user_proc = [
        (1.3, 5.0, 3.6, 6.2, 'Login Credentials'),
        (1.3, 4.0, 3.6, 4.6, 'Habit Data'),
        (1.3, 3.0, 3.6, 3.0, 'Check-in'),
        (1.3, 2.0, 3.6, 1.4, 'Report Request'),
    ]

    for x1, y1, x2, y2, label in user_proc:
        ax.annotate('', xy=(x2, y2), xytext=(x2 - 1.0, y1),
                    arrowprops=dict(arrowstyle='->', color=GRAY_DARK, lw=1.2))
        mx, my = (x2 - 1.0 + x2) / 2, (y1 + y2) / 2
        ax.text(mx, my + 0.25, label, ha='center', va='center',
                fontsize=6.5, color=GRAY_DARK,
                bbox=dict(boxstyle='round,pad=0.08', facecolor=WHITE, edgecolor='none'))

    # === Processes -> Data Stores (horizontal arrows with labels above) ===
    proc_store = [
        (5.4, 6.2, 9.1, 6.2, 'Session Data'),
        (5.4, 4.6, 9.1, 4.6, 'Habit Records'),
        (5.4, 3.0, 9.1, 3.0, 'Log Entries'),
        (5.4, 1.4, 9.1, 1.4, 'Badge Data'),
    ]

    for x1, y1, x2, y2, label in proc_store:
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(arrowstyle='->', color=GRAY_DARK, lw=1.2))
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        ax.text(mx, my + 0.25, label, ha='center', va='center',
                fontsize=6.5, color=GRAY_DARK,
                bbox=dict(boxstyle='round,pad=0.08', facecolor=WHITE, edgecolor='none'))

    # === Data Stores -> Processes (read flows, dashed, labels below) ===
    read_flows = [
        (9.1, 6.0, 5.4, 4.8, 'User Data'),
        (9.1, 4.4, 5.4, 3.2, 'Habit Info'),
        (9.1, 2.8, 5.4, 1.6, 'Log History'),
    ]

    for x1, y1, x2, y2, label in read_flows:
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(arrowstyle='->', color=GRAY, lw=1.0, linestyle='dashed'))
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        ax.text(mx, my - 0.25, label, ha='center', va='center',
                fontsize=6, color=GRAY,
                bbox=dict(boxstyle='round,pad=0.08', facecolor=WHITE, edgecolor='none'))

    # === Processes -> User (responses, dashed, below) ===
    responses = [
        (3.6, 6.0, 1.3, 5.0, 'Auth Token'),
        (3.6, 4.4, 1.3, 4.0, 'Habit List'),
        (3.6, 2.8, 1.3, 3.0, 'Confirmation'),
        (3.6, 1.2, 1.3, 2.0, 'Charts & Reports'),
    ]

    for x1, y1, x2, y2, label in responses:
        ax.annotate('', xy=(x2 + 0.7, y2), xytext=(x1, y1 - 0.2),
                    arrowprops=dict(arrowstyle='->', color=GRAY, lw=1.0, linestyle='dashed'))

    save_fig(fig, 'dfd_level1.png')


# ============================================================
# 8. Project Structure (keep, was clean)
# ============================================================
def create_project_structure():
    fig, ax = plt.subplots(figsize=(10, 11))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 11)
    ax.axis('off')
    fig.patch.set_facecolor(BG)
    ax.set_facecolor(BG)

    ax.text(5, 10.5, 'Project Structure — HabitForge',
            ha='center', va='center', fontsize=15, fontweight='bold', color=GRAY_DARK)

    tree_lines = [
        'habit-forge/',
        '+-- src/',
        '    +-- app/',
        '    |   +-- (auth)/',
        '    |   |   +-- login/page.tsx',
        '    |   |   +-- signup/page.tsx',
        '    |   +-- (dashboard)/',
        '    |   |   +-- dashboard/page.tsx',
        '    |   |   +-- habits/',
        '    |   |   +-- analytics/page.tsx',
        '    |   |   +-- badges/page.tsx',
        '    |   |   +-- calendar/page.tsx',
        '    |   |   +-- groups/page.tsx',
        '    |   |   +-- events/page.tsx',
        '    |   +-- api/',
        '    |   |   +-- auth/',
        '    |   |   +-- badges/',
        '    |   +-- layout.tsx',
        '    |   +-- page.tsx',
        '    +-- components/',
        '    |   +-- Navbar.tsx',
        '    |   +-- HabitCard.tsx',
        '    |   +-- Calendar.tsx',
        '    +-- lib/',
        '    |   +-- supabase/',
        '    |       +-- client.ts',
        '    |       +-- server.ts',
        '    |       +-- middleware.ts',
        '+-- supabase/',
        '    +-- migrations/',
        '    +-- award_badges.sql',
        '+-- docs/',
        '+-- public/',
        '+-- next.config.js',
        '+-- tailwind.config.ts',
        '+-- tsconfig.json',
        '+-- package.json',
        '+-- .env.local',
    ]

    for i, line in enumerate(tree_lines):
        y = 9.8 - i * 0.38
        color = BLUE if line.endswith('/') else GRAY_DARK
        weight = 'bold' if line.endswith('/') else 'normal'
        ax.text(0.5, y, line, ha='left', va='center',
                fontsize=8.5, color=color, weight=weight, family='monospace')

    save_fig(fig, 'project_structure.png')


# ============================================================
# 9. Testing Pyramid (keep, was clean)
# ============================================================
def create_testing_pyramid():
    fig, ax = plt.subplots(figsize=(9, 8))
    ax.set_xlim(0, 9)
    ax.set_ylim(0, 8)
    ax.axis('off')
    fig.patch.set_facecolor(BG)
    ax.set_facecolor(BG)

    ax.text(4.5, 7.5, 'Testing Strategy — Testing Pyramid',
            ha='center', va='center', fontsize=14, fontweight='bold', color=GRAY_DARK)

    # Pyramid tiers (trapezoid shapes using polygons)
    tiers = [
        # (left_x, right_x, top_y, bottom_y, color, label, count, desc)
        (3.0, 6.0, 6.5, 5.5, RED, 'E2E Tests (Playwright)', '16 tests', 'Fewer, Slower, More Realistic'),
        (2.0, 7.0, 5.5, 4.0, ORANGE, 'Integration Tests (API + DB)', '20 tests', ''),
        (1.0, 8.0, 4.0, 2.2, GREEN, 'Unit Tests (Jest)', '42 tests', 'More, Faster, Isolated'),
    ]

    for lx, rx, ty, by, color, label, count, desc in tiers:
        # Draw trapezoid
        if lx > 1.0:
            # Not the base — draw with narrower top
            prev_lx = tiers[tiers.index((lx, rx, ty, by, color, label, count, desc)) - 1][0] if tiers.index((lx, rx, ty, by, color, label, count, desc)) > 0 else 0
            prev_rx = tiers[tiers.index((lx, rx, ty, by, color, label, count, desc)) - 1][1] if tiers.index((lx, rx, ty, by, color, label, count, desc)) > 0 else 9
        polygon = plt.Polygon([[lx, by], [rx, by], [rx, ty], [lx, ty]],
                              closed=True, facecolor=color, edgecolor=WHITE, linewidth=2, alpha=0.85)
        ax.add_patch(polygon)
        mid_y = (ty + by) / 2
        ax.text((lx + rx) / 2, mid_y + 0.25, label,
                ha='center', va='center', fontsize=10, fontweight='bold', color=WHITE)
        ax.text((lx + rx) / 2, mid_y - 0.25, count,
                ha='center', va='center', fontsize=9, color=WHITE)
        if desc:
            ax.text(rx + 0.3, mid_y, desc, ha='left', va='center',
                    fontsize=7.5, color=GRAY, style='italic')

    # Total
    ax.text(4.5, 1.5, 'Total: 78 Tests  |  Coverage: ~85%',
            ha='center', va='center', fontsize=11, fontweight='bold', color=GRAY_DARK,
            bbox=dict(boxstyle='round,pad=0.3', facecolor=WHITE, edgecolor=GRAY_MID, linewidth=1.5))

    save_fig(fig, 'testing_pyramid.png')


# ============================================================
# 10. Sprint Timeline — clean linear layout
# ============================================================
def create_sprint_timeline():
    fig, ax = plt.subplots(figsize=(14, 7))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 7)
    ax.axis('off')
    fig.patch.set_facecolor(BG)
    ax.set_facecolor(BG)

    ax.text(7, 6.5, 'Agile Sprint Timeline — 8 Sprints, 20 Days',
            ha='center', va='center', fontsize=14, fontweight='bold', color=GRAY_DARK)

    sprints = [
        ('Sprint 1', 'Setup', 2, BLUE),
        ('Sprint 2', 'Auth', 2, PURPLE),
        ('Sprint 3', 'CRUD', 3, GREEN),
        ('Sprint 4', 'Check-In', 3, ORANGE),
        ('Sprint 5', 'Analytics', 3, RED),
        ('Sprint 6', 'Badges', 2, TEAL),
        ('Sprint 7', 'UI/UX', 3, '#374151'),
        ('Sprint 8', 'Deploy', 2, '#7C3AED'),
    ]

    y_top = 4.8
    y_bot = 1.5
    total_days = 20
    x_start = 0.5
    x_end = 13.5
    usable_width = x_end - x_start

    # Draw timeline
    ax.plot([x_start, x_end], [3.15, 3.15], color=GRAY_MID, linewidth=2, zorder=1)

    cumulative = 0
    for i, (name, focus, days, color) in enumerate(sprints):
        x = x_start + (cumulative / total_days) * usable_width
        w = (days / total_days) * usable_width - 0.1

        # Alternate above/below timeline
        if i % 2 == 0:
            y = y_top
            va = 'center'
        else:
            y = y_bot
            va = 'center'

        # Sprint box
        box = FancyBboxPatch((x, y - 0.5), w, 1.0,
                             boxstyle="round,pad=0.06",
                             facecolor=color, edgecolor=color, linewidth=1.5, alpha=0.9)
        ax.add_patch(box)

        # Sprint text
        ax.text(x + w / 2, y + 0.12, name,
                ha='center', va='center', fontsize=7.5, fontweight='bold', color=WHITE)
        ax.text(x + w / 2, y - 0.15, f'{focus} ({days}d)',
                ha='center', va='center', fontsize=6.5, color=WHITE)

        # Node on timeline
        node_x = x + w / 2
        circle = plt.Circle((node_x, 3.15), 0.15, facecolor=color, edgecolor=WHITE, linewidth=1.5, zorder=3)
        ax.add_patch(circle)

        # Connector line
        if i % 2 == 0:
            ax.plot([node_x, node_x], [y + 0.5, 3.3], color=GRAY_MID, linewidth=0.8, linestyle='--')
        else:
            ax.plot([node_x, node_x], [y - 0.5, 3.0], color=GRAY_MID, linewidth=0.8, linestyle='--')

        cumulative += days

    # Day markers
    cumulative = 0
    for name, focus, days, color in sprints:
        x = x_start + (cumulative / total_days) * usable_width
        ax.text(x, 2.75, f'Day {cumulative + 1}',
                ha='center', va='center', fontsize=6, color=GRAY)
        cumulative += days
    ax.text(x_end, 2.75, f'Day {total_days}',
            ha='center', va='center', fontsize=6, color=GRAY)

    save_fig(fig, 'sprint_timeline.png')


# ============================================================
# Generate all diagrams
# ============================================================
if __name__ == '__main__':
    print("Generating diagrams v2...")
    create_architecture_diagram()
    create_tech_stack()
    create_use_case_diagram()
    create_class_diagram()
    create_er_diagram()
    create_dfd_context()
    create_dfd_level1()
    create_project_structure()
    create_testing_pyramid()
    create_sprint_timeline()
    print("\nAll diagrams generated successfully!")
