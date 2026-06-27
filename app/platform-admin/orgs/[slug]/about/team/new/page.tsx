import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createTeamMemberAction } from "@/app/platform-admin/about-actions";
import { TeamMemberForm } from "../../TeamMemberForm";

export default async function NewTeamMemberPage({
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
    <div className="space-y-5">
      <div>
        <Link
          href={`/platform-admin/orgs/${slug}/about`}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to About
        </Link>
        <h2 className="text-lg font-semibold text-gray-900 mt-1">Add Team Member</h2>
      </div>

      {sp.error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {sp.error}
        </div>
      )}

      <TeamMemberForm
        action={createTeamMemberAction}
        orgId={org.id}
        orgSlug={org.slug}
      />
    </div>
  );
}
