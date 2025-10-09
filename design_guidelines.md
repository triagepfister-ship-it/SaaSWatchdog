# SaaS Renewal Tracking Platform - Design Guidelines

## Design Approach: Utility-First Dashboard System

**Selected Approach**: Design System (Material Design + Linear-inspired dashboard patterns)

**Justification**: This is a data-dense productivity tool requiring efficiency, clear information hierarchy, and quick action access. Drawing from proven dashboard systems like Linear, Notion, and Material Design ensures familiarity while maintaining professional polish.

**Key Design Principles**:
- Information clarity over decoration
- Action-oriented interface with minimal clicks to key tasks
- Status-driven color coding for at-a-glance understanding
- Consistent patterns for predictability

---

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary)**:
- Background Base: 222 15% 10%
- Surface: 222 15% 14%
- Surface Elevated: 222 15% 18%
- Border: 222 10% 25%
- Text Primary: 0 0% 95%
- Text Secondary: 0 0% 65%

**Status Colors** (consistent across modes):
- Healthy/Success: 142 76% 45%
- Warning/At-Risk: 45 93% 58%
- Danger/Churned: 0 72% 55%
- Info/Reminder: 217 91% 60%

**Brand Primary**: 263 70% 55% (professional purple-blue)

**Light Mode**:
- Background Base: 0 0% 100%
- Surface: 0 0% 98%
- Border: 220 13% 91%
- Text Primary: 222 15% 15%
- Text Secondary: 222 10% 45%

### B. Typography

**Font Families**:
- Primary: 'Inter', system-ui, sans-serif (via Google Fonts)
- Monospace: 'JetBrains Mono' for data/numbers

**Type Scale**:
- Page Headers: text-3xl font-semibold (30px)
- Section Headers: text-xl font-semibold (20px)
- Card Titles: text-base font-medium (16px)
- Body Text: text-sm (14px)
- Labels/Meta: text-xs font-medium uppercase tracking-wide (12px)
- Data/Numbers: text-base font-mono font-medium

### C. Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16** consistently
- Component padding: p-4 to p-6
- Section gaps: gap-6 to gap-8
- Container margins: mx-4 to mx-8
- Vertical rhythm: space-y-6 to space-y-8

**Grid Structure**:
- Dashboard: Responsive grid with sidebar (w-64) + main content (flex-1)
- Card layouts: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Data tables: Full-width with horizontal scroll on mobile

### D. Component Library

**Navigation**:
- Fixed sidebar (dark mode: slightly lighter than background)
- Navigation items with icon + label, active state with subtle accent border-left
- Top bar with search, notifications, user profile

**Dashboard Cards**:
- Elevated surface with subtle shadow
- Header with title + action button/dropdown
- Border-radius: rounded-lg (8px)
- Hover state: subtle border color shift

**Data Tables**:
- Striped rows for readability (alternate row backgrounds)
- Sortable headers with icon indicators
- Row actions on hover (edit, escalate, view)
- Status badges with color coding
- Fixed header on scroll for long tables

**Forms & Inputs**:
- Consistent height: h-10 for inputs
- Border-radius: rounded-md (6px)
- Clear labels above inputs (text-sm font-medium)
- Validation states with border color + helper text
- Date pickers with calendar overlay

**Status Indicators**:
- Pill-shaped badges with dot prefix
- Color-coded: Healthy (green), At-Risk (amber), Churned (red)
- Consistent sizing: px-3 py-1 text-xs

**Charts & Visualizations**:
- Use Chart.js or Recharts for consistency
- Matching color palette for status metrics
- Tooltip on hover with detailed breakdown
- Responsive scaling for mobile

**Action Buttons**:
- Primary: Solid background with brand color
- Secondary: Outline style with transparent background
- Icon-only: For table row actions (ghost variant)
- Sizes: h-9 (small), h-10 (default), h-11 (large)

**Calendar View**:
- Month/week toggle view
- Color-coded renewal dates by status
- Hover popover with renewal details
- Quick-action buttons on hover

### E. Interactions

**Minimal Animation Philosophy** - Use sparingly:
- Hover states: Subtle opacity/color shifts (transition-colors duration-200)
- Loading states: Simple spinner or skeleton screens
- Page transitions: Instant, no slide/fade effects
- Modal overlays: Simple fade-in backdrop (duration-200)

**No distracting scroll animations, parallax, or decorative motion**

---

## Page-Specific Layouts

**Dashboard Home**:
- Top metrics row: 4 stat cards (renewal rate, at-risk revenue, upcoming renewals, churn rate)
- Main area: Split view with upcoming renewals table (left 2/3) + escalation queue (right 1/3)
- Quick filters: Status, product, date range

**Customer Detail**:
- Header: Customer name, status badge, quick actions (edit, escalate)
- Tabs: Overview (subscription details), Renewals (history timeline), Notes (activity log)
- Sidebar: Key metrics, contact info, assigned account manager

**Calendar View**:
- Full-width calendar component
- Color-coded renewal markers
- Click to view/edit renewal details in slide-over panel
- Filter controls in top bar

**Notifications Center**:
- List of triggered reminders with timestamp
- Grouping by date ("Today", "This Week", "Earlier")
- Mark as read/unread toggle
- Bulk actions toolbar

---

## Images

No hero images required - this is a utility dashboard. Use:
- Empty state illustrations for blank tables/lists (use undraw.co or similar)
- Avatar placeholders for customers (initials-based colored circles)
- Icon library: Lucide React or Heroicons (outline variant)

---

## Quality Standards

- Every data table includes search, filters, and export functionality
- All forms have inline validation with helpful error messages
- Responsive breakpoints: Mobile (sm), Tablet (md), Desktop (lg, xl)
- Keyboard navigation support for all interactive elements
- Loading states for all async operations
- Empty states with clear CTAs for all data displays