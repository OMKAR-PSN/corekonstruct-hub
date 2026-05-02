# 🏗️ CoreKonstruct Hub

### **Multi-role Construction Project Management SaaS — built for Admins, Supervisors & Clients**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-corekonstruct.vercel.app-22c55e?style=for-the-badge&logo=vercel&logoColor=white)](https://corekonstruct.vercel.app)

---

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

---

## ✨ Features

- 🔐 **Role-Based Access Control** — Three distinct dashboards for Admin (contractor), Supervisor (site), and Client (read-only portal), enforced via Supabase Row-Level Security policies
- 📋 **Project & Labour Tracking** — Admins create projects, log labour entries, and manage material requests from a single unified interface
- 📸 **Supervisor Photo Zone** — Supervisors upload and tag site progress photos with drag-and-drop, linked directly to active projects
- 💱 **Client Currency Converter** — Clients access a real-time currency converter integrated into their read-only project portal
- 🔑 **Google OAuth + Email Auth** — Unified login with `@supabase/ssr` for server-side session handling and Edge middleware route protection
- 📐 **Sanction Plan Management** — Admin panel for uploading and versioning structural sanction plans per project

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS, Framer Motion, Lucide Icons |
| Backend / Database | Supabase (PostgreSQL + PostgREST) |
| Authentication | Supabase Auth — Email + Google OAuth via `@supabase/ssr` |
| Data Flow | React Server Components (RSC) fetching via PostgREST → Client Component wrappers |
| Deployment | Vercel (frontend + serverless API routes) |

---

## 🏛️ Architecture

```
Browser
  │
  ▼
Next.js App Router (Vercel Edge)
  │── middleware.ts          ← Global route protection (token refresh)
  │── /login                ← Unified login (Google + Email)
  │── /(dashboard)/admin    ← Admin: projects, labour, materials, sanction plans
  │── /(dashboard)/supervisor ← Supervisor: photo uploads, task updates
  │── /(dashboard)/client   ← Client: project view, currency converter
  │
  ▼
Supabase (PostgreSQL)
  │── profiles table        ← role: 'admin' | 'supervisor' | 'client'
  │── projects table
  │── materials table
  │── labor_logs table
  │── Row-Level Security (RLS) enforced per role
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js ≥ 18.x
- npm ≥ 9.x
- A [Supabase](https://supabase.com) account (free tier works)

### 1. Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** and run the entire contents of `supabase/schema.sql` to generate the 4 canonical tables (`profiles`, `projects`, `materials`, `labor_logs`), the auto-profile trigger, and RLS policies.
3. In **Authentication → Providers**, enable the **Google** provider.
4. In **Authentication → URL Configuration**, add `http://localhost:3000/auth/callback` to your Redirect URLs.

### 2. Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Install & Run

```bash
# Clone the repository
git clone https://github.com/OMKAR-PSN/corekonstruct-hub.git
cd corekonstruct-hub

# Install dependencies
npm install

# Start the local dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Test Different Roles

Sign up with any account. By default, users are assigned the **client** role. To elevate to admin or supervisor, run this in Supabase SQL Editor:

```sql
UPDATE public.profiles SET role = 'admin' WHERE id = 'your-user-uuid';
-- Or: 'supervisor'
```

---

## 📸 Screenshots

Shortly adding...

---

## 🚀 Deployment

| Layer | Platform | URL |
|---|---|---|
| Full Stack | Vercel | [corekonstruct.vercel.app](https://corekonstruct.vercel.app) |
| Database | Supabase (PostgreSQL) | Managed cloud instance |

> All environment variables are configured in Vercel's project settings dashboard.

---

## 👥 Team

| Name | Role | GitHub |
|---|---|---|
| Omkar | Full-Stack Developer | [@OMKAR-PSN](https://github.com/OMKAR-PSN) |
| *Bhakti* | *Frontned Developer* |  |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <i>CoreKonstruct — because every brick deserves a paper trail.</i>
</div>
