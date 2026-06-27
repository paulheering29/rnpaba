"use client";

import { useTransition, useState } from "react";
import { updateOrgAction, updateOrgThemeAction } from "../../actions";
import type { Organization, OrgTheme } from "@/lib/types";

const THEME_FIELDS: { key: keyof OrgTheme; label: string }[] = [
  { key: "primary", label: "Primary (headings, accents)" },
  { key: "secondary", label: "Secondary" },
  { key: "nav_bg", label: "Nav Background" },
  { key: "button", label: "Button Color" },
  { key: "button_text", label: "Button Text" },
  { key: "background", label: "Page Background" },
  { key: "text", label: "Body Text" },
];

export function OrgEditForm({ org }: { org: Organization }) {
  const [activeTab, setActiveTab] = useState<"info" | "theme">("info");

  return (
    <div className="bg-white rounded-lg border">
      <div className="flex border-b">
        {(["info", "theme"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
              activeTab === tab
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "info" ? "Basic Info" : "Theme Colors"}
          </button>
        ))}
      </div>

      <div className="p-6">
        {activeTab === "info" && <InfoForm org={org} />}
        {activeTab === "theme" && <ThemeForm org={org} />}
      </div>
    </div>
  );
}

function InfoForm({ org }: { org: Organization }) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => updateOrgAction(fd));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input type="hidden" name="id" value={org.id} />
      <input type="hidden" name="current_slug" value={org.slug} />

      <Field label="Name" name="name" defaultValue={org.name} required />
      <Field label="Slug" name="slug" defaultValue={org.slug} required mono
        hint="Changing this updates the subdomain URL." />
      <Field label="Tagline" name="tagline" defaultValue={org.tagline ?? ""} />
      <Field label="Contact Email" name="contact_email" type="email" defaultValue={org.contact_email ?? ""} />

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Tier</label>
        <select
          name="tier"
          defaultValue={org.tier}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="free">Free</option>
          <option value="starter">Starter</option>
          <option value="pro">Pro</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Status</label>
        <select
          name="active"
          defaultValue={org.active ? "true" : "false"}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-gray-900 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? "Saving…" : "Save Info"}
        </button>
      </div>
    </form>
  );
}

function ThemeForm({ org }: { org: Organization }) {
  const [isPending, startTransition] = useTransition();
  const [theme, setTheme] = useState<OrgTheme>(org.theme);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("id", org.id);
    fd.set("slug", org.slug);
    Object.entries(theme).forEach(([k, v]) => fd.set(`theme.${k}`, v));
    startTransition(() => updateOrgThemeAction(fd));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-xs text-gray-500">
        Enter oklch values (e.g. <code className="bg-gray-100 px-1 rounded">oklch(0.36 0.11 142)</code>).
        Use{" "}
        <a href="https://oklch.com" target="_blank" rel="noopener noreferrer" className="underline">
          oklch.com
        </a>{" "}
        to pick colors.
      </p>

      {THEME_FIELDS.map(({ key, label }) => (
        <div key={key} className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          <div className="flex items-center gap-2">
            <div
              className="h-8 w-8 rounded border border-gray-200 shrink-0"
              style={{ backgroundColor: theme[key] }}
            />
            <input
              value={theme[key]}
              onChange={(e) => setTheme((prev) => ({ ...prev, [key]: e.target.value }))}
              className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>
      ))}

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-gray-900 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? "Saving…" : "Save Theme"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label, name, defaultValue, required, type = "text", mono = false, hint,
}: {
  label: string;
  name: string;
  defaultValue: string;
  required?: boolean;
  type?: string;
  mono?: boolean;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent ${mono ? "font-mono" : ""}`}
      />
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
