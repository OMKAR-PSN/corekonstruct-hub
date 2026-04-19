/**
 * /admin/team — Team Management Page (Server Component)
 *
 * Security boundary:
 *  • This is a Server Component — no service-role key is present here.
 *  • Data fetching delegates to fetchTeamMembers() which re-validates the
 *    caller's admin role server-side before touching the DB.
 *  • The InviteForm client component calls inviteTeamMember() via a
 *    <form action={...}> — the Server Action performs its own auth checks.
 */

import { fetchTeamMembers } from "@/app/actions/admin";
import InviteForm from "./InviteForm";
import { Shield, UserCheck, Calendar } from "lucide-react";

export const metadata = {
  title: "Team Management — CoreKonstruct Admin",
  description: "Invite and manage your construction operations team.",
};

const ROLE_BADGE: Record<string, string> = {
  admin:
    "inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700",
  supervisor:
    "inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700",
};

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function TeamPage() {
  const { members, error } = await fetchTeamMembers();

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Team Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Invite staff and manage elevated access roles. Clients join via
            self-signup and are automatically assigned the&nbsp;
            <span className="font-medium text-slate-700">Client</span> role.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-3 py-2 text-sm text-orange-700">
          <Shield className="h-4 w-4 shrink-0" />
          <span className="font-medium">Invite-Only RBAC Active</span>
        </div>
      </div>

      {/* ── Two-column layout: table left, form right ───────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Staff Table — spans 2 cols */}
        <section className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-semibold text-slate-800">
                Current Staff
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {members.length} admin
                {members.length !== 1 ? "s" : ""} &amp; supervisor
                {members.length !== 1 ? "s" : ""} with elevated access
              </p>
            </div>

            {error ? (
              <div className="px-6 py-10 text-center text-sm text-red-600">
                {error}
              </div>
            ) : members.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
                <UserCheck className="h-10 w-10 text-slate-300" />
                <p className="text-sm text-slate-400">
                  No admins or supervisors yet. Send your first invite →
                </p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {members.map((m) => (
                    <tr
                      key={m.id}
                      className="group transition-colors hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* Avatar initials */}
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-xs font-bold text-white">
                            {(m.full_name ?? m.id)
                              .split(" ")
                              .slice(0, 2)
                              .map((n: string) => n[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-800">
                            {m.full_name ?? (
                              <span className="italic text-slate-400">
                                Pending…
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={ROLE_BADGE[m.role] ?? ROLE_BADGE.supervisor}>
                          {m.role.charAt(0).toUpperCase() + m.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {formatDate(m.created_at)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Invite Form — 1 col */}
        <section>
          <InviteForm />
        </section>
      </div>
    </div>
  );
}
