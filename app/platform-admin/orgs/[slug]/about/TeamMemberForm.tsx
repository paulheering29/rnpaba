"use client";

import { useTransition } from "react";
import type { TeamMember } from "@/lib/types";

export function TeamMemberForm({
  action,
  orgId,
  orgSlug,
  member,
}: {
  action: (fd: FormData) => Promise<void>;
  orgId: string;
  orgSlug: string;
  member?: TeamMember;
}) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => action(fd));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input type="hidden" name="org_id"   value={orgId} />
      <input type="hidden" name="org_slug" value={orgSlug} />
      {member && <input type="hidden" name="id" value={member.id} />}

      <div className="bg-white rounded-lg border p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              required
              defaultValue={member?.name ?? ""}
              placeholder="Jane Smith"
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Title / Role</label>
            <input
              name="title"
              defaultValue={member?.title ?? ""}
              placeholder="Executive Director"
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              defaultValue={member?.email ?? ""}
              placeholder="jane@example.com"
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              name="phone"
              type="tel"
              defaultValue={member?.phone ?? ""}
              placeholder="(555) 555-5555"
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
            <input
              name="linkedin_url"
              type="url"
              defaultValue={member?.linkedin_url ?? ""}
              placeholder="https://linkedin.com/in/…"
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
            <input
              name="avatar_url"
              type="url"
              defaultValue={member?.avatar_url ?? ""}
              placeholder="https://…/photo.jpg"
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>

        <div className="sm:col-span-2 space-y-1">
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            name="bio"
            rows={4}
            defaultValue={member?.bio ?? ""}
            placeholder="Short biography shown when someone clicks the card…"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-y"
          />
        </div>

        <div className="sm:col-span-2 flex items-center gap-2">
          <input
            type="checkbox"
            id="is_published"
            name="is_published"
            defaultChecked={member?.is_published ?? true}
            className="h-4 w-4 rounded border-gray-300 accent-gray-900"
          />
          <label htmlFor="is_published" className="text-sm text-gray-700 cursor-pointer select-none">
            Published (visible on the public about page)
          </label>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isPending}
          className="bg-gray-900 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? "Saving…" : member ? "Save Changes" : "Add Member"}
        </button>
      </div>
    </form>
  );
}
