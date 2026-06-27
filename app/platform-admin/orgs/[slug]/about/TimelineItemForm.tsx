"use client";

import { useTransition } from "react";
import type { TimelineItem } from "@/lib/types";

export function TimelineItemForm({
  action,
  orgId,
  orgSlug,
  item,
}: {
  action: (fd: FormData) => Promise<void>;
  orgId: string;
  orgSlug: string;
  item?: TimelineItem;
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
      {item && <input type="hidden" name="id" value={item.id} />}

      <div className="bg-white rounded-lg border p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Year <span className="text-red-500">*</span>
            </label>
            <input
              name="year"
              required
              maxLength={10}
              defaultValue={item?.year ?? ""}
              placeholder="1994"
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div className="sm:col-span-3 space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              required
              defaultValue={item?.title ?? ""}
              placeholder="Organization Founded"
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            rows={4}
            defaultValue={item?.description ?? ""}
            placeholder="Brief description of this milestone…"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-y"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isPending}
          className="bg-gray-900 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? "Saving…" : item ? "Save Changes" : "Add Item"}
        </button>
      </div>
    </form>
  );
}
