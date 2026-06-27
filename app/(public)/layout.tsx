import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { headers } from "next/headers";
import { getOrgBySlug, getOrgByDomain } from "@/lib/org";
import { createClient } from "@/lib/supabase/server";
import type { OrgData } from "@/lib/types";

async function resolveOrg(): Promise<OrgData | null> {
  try {
    const hdrs = await headers();
    const slug = hdrs.get("x-org-slug");
    const hostname = hdrs.get("x-org-hostname");
    if (slug) return getOrgBySlug(slug);
    if (hostname) return getOrgByDomain(hostname);
  } catch {
    // Don't crash the layout if org resolution fails
  }
  return null;
}

async function resolveAboutLabel(orgId: string): Promise<string | undefined> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("about_config")
      .select("section_label")
      .eq("org_id", orgId)
      .single();
    return (data?.section_label as string | null) ?? undefined;
  } catch {
    return undefined;
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const org = await resolveOrg();
  const aboutLabel = org ? await resolveAboutLabel(org.id) : undefined;

  return (
    <>
      <Nav org={org} aboutLabel={aboutLabel} />
      <main className="flex-1">{children}</main>
      <Footer org={org} />
    </>
  );
}
