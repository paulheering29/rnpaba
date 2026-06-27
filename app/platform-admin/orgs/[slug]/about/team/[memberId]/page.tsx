import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { updateTeamMemberAction, deleteTeamMemberAction } from "@/app/platform-admin/about-actions";
import { TeamMemberForm } from "../../TeamMemberForm";
import type { TeamMember } from "@/lib/types";

export default async function EditTeamMemberPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; memberId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { slug, memberId } = await params;
  const sp = await searchParams;
  const supabase = createAdminClient();

  const [{ data: org }, { data: memberData }] = await Promise.all([
    supabase.from("organizations").select("id, slug").eq("slug", slug).single(),
    supabase.from("team_members").select("*").eq("id", memberId).single(),
  ]);

  if (!org || !memberData) notFound();

  const member = memberData as TeamMember;

  return (
    <div className="space-y-5">
      <div>
        <Link
          href={`/platform-admin/orgs/${slug}/about`}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to About
        </Link>
        <h2 className="text-lg font-semibold text-gray-900 mt-1">Edit Team Member</h2>
      </div>

      {sp.error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {sp.error}
        </div>
      )}

      <TeamMemberForm
        action={updateTeamMemberAction}
        orgId={org.id}
        orgSlug={org.slug}
        member={member}
      />

      {/* Delete */}
      <div className="border-t pt-5">
        <form
          action={deleteTeamMemberAction}
          onSubmit={(e) => {
            if (!confirm(`Remove "${member.name}" from the team?`)) e.preventDefault();
          }}
        >
          <input type="hidden" name="id"       value={member.id} />
          <input type="hidden" name="org_slug" value={org.slug} />
          <button
            type="submit"
            className="text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            Delete this team member
          </button>
        </form>
      </div>
    </div>
  );
}
