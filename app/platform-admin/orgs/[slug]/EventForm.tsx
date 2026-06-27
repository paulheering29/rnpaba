"use client";

import { useTransition } from "react";
import type { Event } from "@/lib/types";

export function EventForm({
  action,
  orgId,
  orgSlug,
  event,
}: {
  action: (fd: FormData) => Promise<void>;
  orgId: string;
  orgSlug: string;
  event?: Event;
}) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => action(fd));
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6 space-y-5">
      <input type="hidden" name="org_id" value={orgId} />
      <input type="hidden" name="org_slug" value={orgSlug} />
      {event && <input type="hidden" name="id" value={event.id} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            required
            defaultValue={event?.title ?? ""}
            placeholder="e.g. Monthly Board Meeting"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            name="date"
            type="date"
            required
            defaultValue={event?.date ?? ""}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Time</label>
          <input
            name="time"
            defaultValue={event?.time ?? ""}
            placeholder="e.g. 9:00 AM – 12:00 PM"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Location</label>
          <input
            name="location"
            defaultValue={event?.location ?? ""}
            placeholder="e.g. Zoom or 123 Main St"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Type</label>
          <select
            name="type"
            defaultValue={event?.type ?? "event"}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="meeting">Meeting</option>
            <option value="event">Event</option>
            <option value="workshop">Workshop</option>
            <option value="conference">Conference</option>
          </select>
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            rows={4}
            defaultValue={event?.description ?? ""}
            placeholder="Details about this event..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          name="is_published"
          defaultChecked={event?.is_published ?? true}
          className="h-4 w-4 rounded border-gray-300 accent-gray-900"
        />
        <span className="text-sm font-medium text-gray-700">Published (visible on public site)</span>
      </label>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-gray-900 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? "Saving…" : event ? "Save Changes" : "Create Event"}
        </button>
      </div>
    </form>
  );
}
