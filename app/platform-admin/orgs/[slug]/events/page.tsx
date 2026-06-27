import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteEventAction } from "@/app/platform-admin/events-actions";

const TYPE_COLORS: Record<string, string> = {
  meeting: "bg-blue-100 text-blue-700",
  event: "bg-purple-100 text-purple-700",
  workshop: "bg-amber-100 text-amber-700",
  conference: "bg-green-100 text-green-700",
};

export default async function OrgEventsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const supabase = createAdminClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("id, name, slug")
    .eq("slug", slug)
    .single();

  if (!org) notFound();

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("org_id", org.id)
    .order("date", { ascending: true });

  const allEvents = events ?? [];

  return (
    <>
      {sp.saved && (
        <div className="mb-5 rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          Event saved.
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{allEvents.length} event{allEvents.length !== 1 ? "s" : ""}</p>
        <Link
          href={`/platform-admin/orgs/${slug}/events/new`}
          className="text-sm bg-gray-900 text-white rounded-md px-4 py-2 hover:bg-gray-700 transition-colors"
        >
          + Add Event
        </Link>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["Date", "Title", "Type", "Location", "Published", ""].map((h) => (
                <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {allEvents.map((ev) => (
              <tr key={ev.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">
                  {new Date(ev.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{ev.title}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${TYPE_COLORS[ev.type] ?? ""}`}>
                    {ev.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{ev.location ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs rounded-full px-2 py-0.5 ${ev.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {ev.is_published ? "yes" : "draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/platform-admin/orgs/${slug}/events/${ev.id}`}
                    className="text-xs text-gray-500 hover:text-gray-900 underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {allEvents.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                  No events yet.{" "}
                  <Link href={`/platform-admin/orgs/${slug}/events/new`} className="underline text-gray-600">
                    Add the first one.
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
