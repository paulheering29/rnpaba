import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { OrgAdminNav } from "./OrgAdminNav";

export default async function OrgAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createAdminClient();
  const { data: org } = await supabase
    .from("organizations")
    .select("name, slug, tier, active")
    .eq("slug", slug)
    .single();

  if (!org) notFound();

  return (
    <div className="max-w-3xl">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <Link href="/platform-admin/orgs" className="text-sm text-gray-400 hover:text-gray-700">
            ← Organizations
          </Link>
          <h1 className="text-xl font-semibold text-gray-900 mt-1">{org.name}</h1>
          <p className="text-xs text-gray-400 font-mono">{org.slug}</p>
        </div>
        <div className="flex gap-2 mt-1">
          <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${
            org.tier === "pro" ? "bg-purple-100 text-purple-700" :
            org.tier === "starter" ? "bg-blue-100 text-blue-700" :
            "bg-gray-100 text-gray-600"
          }`}>{org.tier}</span>
          <span className={`text-xs rounded-full px-2 py-0.5 ${org.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
            {org.active ? "active" : "inactive"}
          </span>
        </div>
      </div>

      <OrgAdminNav slug={org.slug} />

      {children}
    </div>
  );
}
