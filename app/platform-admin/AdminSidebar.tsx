"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/platform-admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/platform-admin/orgs", label: "Organizations", icon: Building2, exact: false },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-white border-r flex flex-col shrink-0">
      <div className="h-14 flex items-center px-4 border-b gap-2">
        <span className="font-bold text-sm text-gray-900">OrgSite</span>
        <span className="text-xs bg-blue-100 text-blue-700 rounded px-1.5 py-0.5 font-medium">Admin</span>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                active
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
