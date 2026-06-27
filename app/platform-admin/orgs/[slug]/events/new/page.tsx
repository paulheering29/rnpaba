import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createEventAction } from "@/app/platform-admin/events-actions";
import { EventForm } from "../../EventForm";

export default async function NewEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const supabase = createAdminClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("id, slug")
    .eq("slug", slug)
    .single();

  if (!org) notFound();

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold text-gray-900">New Event</h2>
        <Link href={`/platform-admin/orgs/${slug}/events`} className="text-sm text-gray-500 hover:text-gray-900">
          Cancel
        </Link>
      </div>

      {sp.error && (
        <div className="mb-5 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {sp.error}
        </div>
      )}

      <EventForm action={createEventAction} orgId={org.id} orgSlug={org.slug} />
    </>
  );
}
