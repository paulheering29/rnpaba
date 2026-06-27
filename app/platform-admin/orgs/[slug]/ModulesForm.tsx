"use client";

import { useTransition } from "react";
import { updateOrgModulesAction } from "../../actions";
import type { Organization, OrgModule } from "@/lib/types";

const tierBadge: Record<string, string> = {
  free: "bg-gray-100 text-gray-600",
  starter: "bg-blue-100 text-blue-600",
  pro: "bg-purple-100 text-purple-600",
};

export function ModulesForm({
  org,
  modules,
  orgModules,
}: {
  org: Organization;
  modules: Array<{ key: string; name: string; description: string | null; min_tier: string }>;
  orgModules: OrgModule[];
}) {
  const [isPending, startTransition] = useTransition();
  const enabledKeys = new Set(orgModules.filter((m) => m.enabled).map((m) => m.module_key as string));

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => updateOrgModulesAction(fd));
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border divide-y">
      <input type="hidden" name="org_id" value={org.id} />
      <input type="hidden" name="org_slug" value={org.slug} />

      {modules.map((mod) => (
        <label key={mod.key} className="flex items-start gap-3 px-5 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="checkbox"
            name={`module.${mod.key}`}
            defaultChecked={enabledKeys.has(mod.key)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-gray-900"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">{mod.name}</span>
              <span className={`text-xs rounded-full px-1.5 py-0.5 font-medium ${tierBadge[mod.min_tier] ?? tierBadge.free}`}>
                {mod.min_tier}
              </span>
            </div>
            {mod.description && (
              <div className="text-xs text-gray-400 mt-0.5">{mod.description}</div>
            )}
          </div>
        </label>
      ))}

      <div className="px-5 py-4">
        <button
          type="submit"
          disabled={isPending}
          className="bg-gray-900 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? "Saving…" : "Save Modules"}
        </button>
      </div>
    </form>
  );
}
