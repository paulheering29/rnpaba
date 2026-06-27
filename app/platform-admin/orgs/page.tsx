import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

async function getOrgs() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("organizations")
    .select("id, name, slug, tier, active, custom_domain, created_at")
    .order("created_at", { ascending: false });
  return data ?? [];
}

const tierColors: Record<string, string> = {
  free: "bg-gray-100 text-gray-700",
  starter: "bg-blue-100 text-blue-700",
  pro: "bg-purple-100 text-purple-700",
};

export default async function OrgsPage() {
  const orgs = await getOrgs();

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Organizations</h1>
          <p className="text-sm text-gray-500 mt-0.5">{orgs.length} total</p>
        </div>
        <Link
          href="/platform-admin/orgs/new"
          className="text-sm bg-gray-900 text-white rounded-md px-4 py-2 hover:bg-gray-700 transition-colors"
        >
          + New Org
        </Link>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["Name", "Slug", "Domain", "Tier", "Status", ""].map((h) => (
                <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {orgs.map((org) => (
              <tr key={org.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{org.name}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{org.slug}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{org.custom_domain ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${tierColors[org.tier] ?? tierColors.free}`}>
                    {org.tier}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs rounded-full px-2 py-0.5 ${org.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {org.active ? "active" : "inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/platform-admin/orgs/${org.slug}`}
                    className="text-xs text-gray-500 hover:text-gray-900 underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {orgs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                  No organizations yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
