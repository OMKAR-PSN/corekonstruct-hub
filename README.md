# CoreKonstruct Hub

**Smart Construction Monitoring SaaS Platform**

A premium, full-stack Next.js web application for managing construction projects, tracking labor, managing material requests, and keeping all stakeholders (Admins, Supervisors, and Clients) in sync through role-based access.

## Tech Stack

The architecture has recently been modernized from a legacy Express/Mock setup to a pure React Server Component (RSC) and serverless database model.

- **Frontend Core**: Next.js 15 (App Router), React 18, TypeScript
- **Styling & Assets**: Tailwind CSS, Framer Motion, Lucide Icons
- **Backend & Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email + Google OAuth via `@supabase/ssr`)
- **Data Flow**: Async React Server Components fetching data natively via PostgREST, passing state down to interactive Client Component wrappers.

## Project Structure

```text
corekonstruct-hub/
├── src/
│   ├── app/                      <- Next.js App Router
│   │   ├── (dashboard)/          <- Protected route group
│   │   │   ├── admin/            <- Contractor / Admin Dashboard
│   │   │   ├── supervisor/       <- Site Supervisor Workspace
│   │   │   └── client/           <- Client Read-only Portal
│   │   ├── auth/                 <- Core OAuth callback boundaries
│   │   ├── login/                <- Unified login layer
│   │   └── page.tsx              <- Public SaaS Marketing Landing Page
│   │
│   ├── components/               <- Interactive Client Components
│   │   ├── admin/                
│   │   ├── supervisor/
│   │   ├── client/
│   │   └── auth/                 <- AuthForm (Google + Email)
│   │
│   ├── types/                    <- Shared TypeScript models
│   │   └── supabase.ts           <- Canonical Database Types
│   │
│   ├── utils/supabase/           <- Supabase SSR Client Utilities
│   │   ├── client.ts             <- Browser client
│   │   ├── server.ts             <- Server/RSC async client
│   │   └── middleware.ts         <- Edge token refresh
│   │
│   └── middleware.ts             <- Global edge route protection
│
├── supabase/
│   └── schema.sql                <- Canonical PostgreSQL schema and RLS policies
│
└── .env.local                    <- Environment variables (ignored in Git)
```

## Running Locally

### 1. Configure Supabase
1. Create a project at [Supabase](https://supabase.com).
2. Go to **SQL Editor** and execute the entire contents of `supabase/schema.sql` to generate the 4 canonical tables (`profiles`, `projects`, `materials`, `labor_logs`), the auto-profile trigger, and Row-Level Security (RLS) policies.
3. In **Authentication → Providers**, enable the Google provider.
4. In **Authentication → URL Configuration**, add `http://localhost:3000/auth/callback` to your Redirect URLs.

### 2. Configure Environment Variables
Create a `.env.local` file in the root of the repository:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Install & Start

```bash
# Install dependencies
npm install

# Run the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) inside your browser.

## Authentication & Roles

The system does not use hardcoded demo credentials. To test different roles:
1. Sign up for a new account (or use Google Auth).
2. The Postgres trigger will automatically generate a `profiles` row for you with the default role of **client**.
3. To promote yourself to a broader testing role, run this query in your Supabase SQL Editor:
```sql
UPDATE public.profiles SET role = 'admin' WHERE id = 'your-user-uuid';
-- Or 'supervisor'
```
