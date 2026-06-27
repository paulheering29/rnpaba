import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { OrgEditForm } from "./OrgEditForm";
import { ModulesForm } from "./ModulesForm";

async function getOrgAndModules(slug: string) {
  const supabase = createAdminClient();
  const { data: org } = await supabase.from("organizations").select("*").eq("slug", slug).single();
  if (!org) return { org: null, modules: [], orgModules: [] };

  const [{ data: modules }, { data: orgModules }] = await Promise.all([
    supabase.from("modules").select("*").order("sort_order"),
    supabase.from("org_modules").select("*").eq("org_id", org.id),
  ]);

  return { org, modules: modules ?? [], orgModules: orgModules ?? [] };
}

export default async function OrgSettingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const { org, modules, orgModules } = await getOrgAndModules(slug);

  if (!org) notFound();

  return (
    <>
      {sp.saved && (
        <div className="mb-5 rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          Changes saved.
        </div>
      )}
      {sp.error && (
        <div className="mb-5 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Error: {sp.error}
        </div>
      )}

      <OrgEditForm org={org} />

      <div className="mt-8">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Modules</h2>
        <ModulesForm org={org} modules={modules} orgModules={orgModules} />
      </div>
    </>
  );
}
