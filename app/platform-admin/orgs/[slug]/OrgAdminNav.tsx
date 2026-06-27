"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const sections = [
  { label: "Settings", href: (slug: string) => `/platform-admin/orgs/${slug}` },
  { label: "Events",   href: (slug: string) => `/platform-admin/orgs/${slug}/events` },
  { label: "About",    href: (slug: string) => `/platform-admin/orgs/${slug}/about` },
];

export function OrgAdminNav({ slug }: { slug: string }) {
  const pathname = usePathname();

  return (
    <nav className="flex gap-0 border-b mb-6">
      {sections.map(({ label, href }) => {
        const to = href(slug);
        const active = label === "Settings"
          ? pathname === to
          : pathname.startsWith(to);
        return (
          <Link
            key={label}
            href={to}
            className={cn(
              "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
              active
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
