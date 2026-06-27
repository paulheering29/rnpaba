import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { updateTimelineItemAction, deleteTimelineItemAction } from "@/app/platform-admin/about-actions";
import { TimelineItemForm } from "../../TimelineItemForm";
import type { TimelineItem } from "@/lib/types";

export default async function EditTimelineItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; itemId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { slug, itemId } = await params;
  const sp = await searchParams;
  const supabase = createAdminClient();

  const [{ data: org }, { data: itemData }] = await Promise.all([
    supabase.from("organizations").select("id, slug").eq("slug", slug).single(),
    supabase.from("timeline_items").select("*").eq("id", itemId).single(),
  ]);

  if (!org || !itemData) notFound();

  const item = itemData as TimelineItem;

  return (
    <div className="space-y-5">
      <div>
        <Link
          href={`/platform-admin/orgs/${slug}/about`}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to About
        </Link>
        <h2 className="text-lg font-semibold text-gray-900 mt-1">Edit Timeline Item</h2>
      </div>

      {sp.error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {sp.error}
        </div>
      )}

      <TimelineItemForm
        action={updateTimelineItemAction}
        orgId={org.id}
        orgSlug={org.slug}
        item={item}
      />

      {/* Delete */}
      <div className="border-t pt-5">
        <form
          action={deleteTimelineItemAction}
          onSubmit={(e) => {
            if (!confirm(`Delete "${item.year} — ${item.title}"?`)) e.preventDefault();
          }}
        >
          <input type="hidden" name="id"       value={item.id} />
          <input type="hidden" name="org_slug" value={org.slug} />
          <button
            type="submit"
            className="text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            Delete this timeline item
          </button>
        </form>
      </div>
    </div>
  );
}
