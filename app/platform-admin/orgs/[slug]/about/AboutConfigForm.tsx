"use client";

import { useTransition } from "react";
import type { AboutConfig } from "@/lib/types";

type Config = Partial<AboutConfig>;

const SUBSECTIONS: { key: "mission" | "values" | "team" | "timeline"; label: string; default: string }[] = [
  { key: "mission",  label: "Mission",  default: "Mission Statement" },
  { key: "values",   label: "Values",   default: "Our Values" },
  { key: "team",     label: "Team",     default: "Our Team" },
  { key: "timeline", label: "Timeline", default: "Our History" },
];

export function AboutConfigForm({
  action,
  orgId,
  orgSlug,
  config,
}: {
  action: (fd: FormData) => Promise<void>;
  orgId: string;
  orgSlug: string;
  config: Config;
}) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => action(fd));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input type="hidden" name="org_id"   value={orgId} />
      <input type="hidden" name="org_slug" value={orgSlug} />

      {/* Page-level label */}
      <div className="bg-white rounded-lg border p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">Page Settings</h3>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600 w-28 shrink-0">Section name</label>
          <input
            name="section_label"
            defaultValue={config.section_label ?? "About"}
            placeholder="About"
            className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
      </div>

      {/* Sub-section toggles + labels */}
      <div className="bg-white rounded-lg border p-5 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Sub-sections</h3>
          <p className="text-xs text-gray-400 mt-0.5">Toggle each on or off and rename it for your organization.</p>
        </div>
        <div className="space-y-3">
          {SUBSECTIONS.map(({ key, label, default: def }) => {
            const enabledKey = `${key}_enabled` as keyof Config;
            const labelKey   = `${key}_label`   as keyof Config;
            return (
              <div key={key} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id={`${key}_enabled`}
                  name={`${key}_enabled`}
                  defaultChecked={(config[enabledKey] as boolean | undefined) ?? true}
                  className="h-4 w-4 rounded border-gray-300 accent-gray-900 shrink-0"
                />
                <label htmlFor={`${key}_enabled`} className="text-sm text-gray-600 w-20 shrink-0 cursor-pointer select-none">
                  {label}
                </label>
                <input
                  name={`${key}_label`}
                  defaultValue={(config[labelKey] as string | undefined) ?? def}
                  placeholder={def}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Mission content */}
      <div className="bg-white rounded-lg border p-5 space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            {config.mission_label ?? "Mission Statement"} — Content
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Markdown: **bold**, *italic*, ## Heading, - list item
          </p>
        </div>
        <textarea
          name="mission_content"
          rows={7}
          defaultValue={config.mission_content ?? ""}
          placeholder="Enter your mission statement…"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-900 resize-y"
        />
      </div>

      {/* Values content */}
      <div className="bg-white rounded-lg border p-5 space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            {config.values_label ?? "Our Values"} — Content
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Markdown: **bold**, *italic*, ## Heading, - list item
          </p>
        </div>
        <textarea
          name="values_content"
          rows={7}
          defaultValue={config.values_content ?? ""}
          placeholder="Describe your organization's values…"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-900 resize-y"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isPending}
          className="bg-gray-900 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
