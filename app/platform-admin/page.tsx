import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { Badge } from "@/components/ui/badge";

async function getStats() {
  const supabase = createAdminClient();
  const { data: orgs } = await supabase
    .from("organizations")
    .select("id, name, slug, tier, active, created_at")
    .order("created_at", { ascending: false });
  return orgs ?? [];
}

const tierColors: Record<string, string> = {
  free: "bg-gray-100 text-gray-700",
  starter: "bg-blue-100 text-blue-700",
  pro: "bg-purple-100 text-purple-700",
};

export default async function PlatformAdminDashboard() {
  const orgs = await getStats();
  const byTier = { free: 0, starter: 0, pro: 0 };
  orgs.forEach((o) => { byTier[o.tier as keyof typeof byTier] = (byTier[o.tier as keyof typeof byTier] ?? 0) + 1 });
  const activeCount = orgs.filter((o) => o.active).length;

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Platform overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Orgs", value: orgs.length },
          { label: "Active", value: activeCount },
          { label: "Free tier", value: byTier.free },
          { label: "Paid (starter+pro)", value: byTier.starter + byTier.pro },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-lg border p-4">
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent orgs */}
      <div className="bg-white rounded-lg border">
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h2 className="text-sm font-semibold text-gray-900">All Organizations</h2>
          <Link
            href="/platform-admin/orgs/new"
            className="text-xs bg-gray-900 text-white rounded px-3 py-1.5 hover:bg-gray-700 transition-colors"
          >
            + New Org
          </Link>
        </div>
        <div className="divide-y">
          {orgs.slice(0, 10).map((org) => (
            <div key={org.id} className="flex items-center px-5 py-3 gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">{org.name}</div>
                <div className="text-xs text-gray-400">{org.slug}</div>
              </div>
              <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${tierColors[org.tier] ?? tierColors.free}`}>
                {org.tier}
              </span>
              <span className={`text-xs rounded-full px-2 py-0.5 ${org.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                {org.active ? "active" : "inactive"}
              </span>
              <Link
                href={`/platform-admin/orgs/${org.slug}`}
                className="text-xs text-gray-500 hover:text-gray-900 underline"
              >
                Edit
              </Link>
            </div>
          ))}
          {orgs.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-gray-400">
              No organizations yet.{" "}
              <Link href="/platform-admin/orgs/new" className="underline text-gray-600">
                Create the first one.
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
