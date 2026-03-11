

# CoreKonstruct — Construction Management Platform

## Overview
A role-based construction management app with animated landing page, authentication, and personalized dashboards for 5 user roles: **Admin, Supervisor, Contractor, Client, and Worker**.

---

## 1. Landing Page (The Front Door)
- Animated "CK" industrial splash screen (CSS keyframe animation with construction-themed visuals — gears, hard hat motif, dark/orange color scheme)
- After ~3 seconds, transitions to the main landing page
- Hero section explaining CoreKonstruct's value proposition
- Features overview, testimonials section, and CTA buttons
- "Login" and "Sign Up" buttons in the navbar

## 2. Authentication & Role System (Supabase)
- **Sign up / Login pages** with email + password
- Password reset flow with dedicated `/reset-password` page
- **User roles table** (using `app_role` enum: `admin`, `supervisor`, `contractor`, `client`, `worker`)
- On signup, users select their role (or Admin assigns it)
- Role-based route protection — redirect to appropriate dashboard after login

## 3. Database Schema (Supabase/PostgreSQL)
- **profiles** — name, phone, avatar, linked to auth.users
- **user_roles** — role assignment per user
- **projects** — name, location, status, contractor_id, client_id
- **sites** — linked to projects, address, GPS coordinates
- **worker_assignments** — worker_id, site_id, date range
- **attendance** — worker_id, site_id, date, status (present/absent/late), GPS coordinates, marked_by (supervisor)
- **material_logs** — site_id, material_name, quantity, unit, logged_by, date
- **daily_updates** — site_id, supervisor_id, date, summary, progress_percentage, photos
- **faq_items** — question, answer, category (seeded data)

## 4. Admin Dashboard
- Overview cards: total projects, active sites, total workers, total contractors
- User management: view/create/edit users, assign roles
- Project management: create projects, assign contractors & clients
- View all attendance, material logs, and daily updates across all sites
- Analytics charts (recharts) — attendance trends, material usage

## 5. Supervisor Dashboard (The Control Room)
- See only sites they're assigned to
- **Attendance form**: select workers on their site, mark present/absent with GPS auto-capture
- **Material log form**: log materials received/used with quantities
- **Daily update form**: write progress summary, set completion %, attach notes
- Dashboard cards: workers present today, materials logged, pending updates
- Real-time counters that update on form submission

## 6. Contractor Dashboard
- View all projects assigned to them
- See which workers are allocated to which sites (worker assignment tracker)
- View attendance summaries and material usage per site
- Add/remove worker assignments to sites
- Project progress overview with completion percentages

## 7. Client Dashboard
- View projects they're linked to
- See project progress, daily updates, and photos from supervisors
- Filter/search projects by contractor or builder
- Read-only view — no editing capabilities
- Timeline view of project milestones

## 8. Worker Dashboard
- Simple personal dashboard showing current site assignment
- View own attendance history
- Self check-in with GPS verification (mark themselves present when on-site)
- View upcoming assignments

## 9. FAQ / Help Desk
- Collapsible accordion component (using Radix accordion)
- Categorized questions (General, Attendance, Materials, Technical)
- Fully client-side — no server calls needed
- Accessible from all dashboards via help icon

## 10. Blog / Notice Board
- List of company updates and announcements
- Article detail page with semantic HTML (`<article>`, `<figure>`)
- Admin can create/edit posts
- All roles can read posts

## Design & Theme
- Industrial color palette: dark charcoal (#1a1a2e), safety orange (#ff6600), steel gray, white
- Construction-themed iconography (lucide-react icons)
- Responsive design — works on tablets for on-site use
- Clean card-based layouts with clear data hierarchy

