import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { updateEventAction, deleteEventAction } from "@/app/platform-admin/events-actions";
import { EventForm } from "../../EventForm";

export default async function EditEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; eventId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { slug, eventId } = await params;
  const sp = await searchParams;
  const supabase = createAdminClient();

  const [{ data: org }, { data: event }] = await Promise.all([
    supabase.from("organizations").select("id, slug").eq("slug", slug).single(),
    supabase.from("events").select("*").eq("id", eventId).single(),
  ]);

  if (!org || !event) notFound();

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold text-gray-900">Edit Event</h2>
        <Link href={`/platform-admin/orgs/${slug}/events`} className="text-sm text-gray-500 hover:text-gray-900">
          ← Back to Events
        </Link>
      </div>

      {sp.error && (
        <div className="mb-5 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {sp.error}
        </div>
      )}

      <EventForm action={updateEventAction} orgId={org.id} orgSlug={org.slug} event={event} />

      {/* Delete */}
      <div className="mt-6 pt-6 border-t">
        <form action={deleteEventAction}>
          <input type="hidden" name="id" value={event.id} />
          <input type="hidden" name="org_slug" value={org.slug} />
          <button
            type="submit"
            className="text-sm text-red-600 hover:text-red-800 underline"
            onClick={(e) => { if (!confirm("Delete this event?")) e.preventDefault() }}
          >
            Delete event
          </button>
        </form>
      </div>
    </>
  );
}
