import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { upsertAboutConfigAction } from "@/app/platform-admin/about-actions";
import { AboutConfigForm } from "./AboutConfigForm";
import type { AboutConfig, TeamMember, TimelineItem } from "@/lib/types";

export default async function AboutAdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const supabase = createAdminClient();

  const { data: org } = await supabase
    .from("organizations")
    .select("id, slug, name")
    .eq("slug", slug)
    .single();

  if (!org) notFound();

  const [{ data: rawConfig }, { data: team }, { data: timeline }] = await Promise.all([
    supabase.from("about_config").select("*").eq("org_id", org.id).single(),
    supabase.from("team_members").select("*").eq("org_id", org.id).order("sort_order"),
    supabase.from("timeline_items").select("*").eq("org_id", org.id).order("sort_order"),
  ]);

  const config = (rawConfig ?? {}) as Partial<AboutConfig>;
  const members = (team ?? []) as TeamMember[];
  const items = (timeline ?? []) as TimelineItem[];

  return (
    <div className="space-y-8">
      {sp.saved && (
        <div className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          Saved successfully.
        </div>
      )}
      {sp.error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {sp.error}
        </div>
      )}

      {/* Config + content form */}
      <AboutConfigForm
        action={upsertAboutConfigAction}
        orgId={org.id}
        orgSlug={org.slug}
        config={config}
      />

      {/* Team list */}
      <div className="bg-white rounded-lg border">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-sm font-semibold text-gray-900">
            {config.team_label ?? "Our Team"}
          </h3>
          <Link
            href={`/platform-admin/orgs/${slug}/about/team/new`}
            className="text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors"
          >
            + Add Member
          </Link>
        </div>
        {members.length === 0 ? (
          <p className="px-5 py-8 text-sm text-gray-400 text-center">No team members yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide border-b">
                <th className="px-5 py-2.5">Name</th>
                <th className="px-5 py-2.5">Title</th>
                <th className="px-5 py-2.5">Email</th>
                <th className="px-5 py-2.5">Published</th>
                <th className="px-5 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900">{m.name}</td>
                  <td className="px-5 py-3 text-gray-500">{m.title ?? "—"}</td>
                  <td className="px-5 py-3 text-gray-500">{m.email ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {m.is_published ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/platform-admin/orgs/${slug}/about/team/${m.id}`}
                      className="text-sm text-gray-500 hover:text-gray-900"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Timeline list */}
      <div className="bg-white rounded-lg border">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-sm font-semibold text-gray-900">
            {config.timeline_label ?? "Our History"}
          </h3>
          <Link
            href={`/platform-admin/orgs/${slug}/about/timeline/new`}
            className="text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors"
          >
            + Add Item
          </Link>
        </div>
        {items.length === 0 ? (
          <p className="px-5 py-8 text-sm text-gray-400 text-center">No timeline items yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wide border-b">
                <th className="px-5 py-2.5 w-24">Year</th>
                <th className="px-5 py-2.5">Title</th>
                <th className="px-5 py-2.5">Description</th>
                <th className="px-5 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900">{item.year}</td>
                  <td className="px-5 py-3 text-gray-700">{item.title}</td>
                  <td className="px-5 py-3 text-gray-400 max-w-sm truncate">{item.description ?? "—"}</td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/platform-admin/orgs/${slug}/about/timeline/${item.id}`}
                      className="text-sm text-gray-500 hover:text-gray-900"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
