"use client";

/**
 * InviteForm — Client Component
 *
 * This component ONLY calls the inviteTeamMember Server Action.
 * The service-role key is strictly server-side and is never imported here.
 */

import { useActionState } from "react";
import { inviteTeamMember, type InviteResult } from "@/app/actions/admin";
import { Mail, User, ChevronDown, Send, ShieldCheck } from "lucide-react";

const initialState: InviteResult | null = null;

export default function InviteForm() {
  const [result, dispatch, isPending] = useActionState<
    InviteResult | null,
    FormData
  >(
    async (_prev: InviteResult | null, formData: FormData) =>
      inviteTeamMember(formData),
    initialState
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Card header */}
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50">
            <ShieldCheck className="h-4 w-4 text-orange-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              Invite Member
            </h2>
            <p className="text-xs text-slate-500">Admins &amp; Supervisors only</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form action={dispatch} className="space-y-4 px-6 py-5">
        {/* Full Name */}
        <div>
          <label
            htmlFor="invite-full-name"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-500"
          >
            Full Name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="invite-full-name"
              name="full_name"
              type="text"
              required
              disabled={isPending}
              placeholder="Rajesh Kumar"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 disabled:opacity-60"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="invite-email"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-500"
          >
            Work Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="invite-email"
              name="email"
              type="email"
              required
              disabled={isPending}
              placeholder="rajesh@company.com"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 disabled:opacity-60"
            />
          </div>
        </div>

        {/* Role */}
        <div>
          <label
            htmlFor="invite-role"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-500"
          >
            Role
          </label>
          <div className="relative">
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              id="invite-role"
              name="role"
              required
              disabled={isPending}
              defaultValue="supervisor"
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 disabled:opacity-60"
            >
              <option value="supervisor">Supervisor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Feedback banner */}
        {result && (
          <div
            className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 text-sm ${
              result.success
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            <span>{result.success ? result.message : result.error}</span>
          </div>
        )}

        {/* Submit */}
        <button
          id="btn-send-invite"
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-200 transition-all hover:bg-orange-700 hover:shadow-orange-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Sending Invite…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send Invite
            </>
          )}
        </button>
      </form>

      {/* Security note */}
      <div className="rounded-b-2xl border-t border-slate-100 bg-slate-50 px-6 py-3 text-xs text-slate-400">
        Invitees receive a one-time magic link. Role is enforced server-side —
        clients always self-assign the{" "}
        <span className="font-medium text-slate-600">Client</span> role.
      </div>
    </div>
  );
}
