import Link from "next/link";
import { TreePine } from "lucide-react";
import type { OrgData } from "@/lib/types";

export function Footer({ org }: { org?: OrgData | null }) {
  const orgName = org?.name ?? "RNPABA";
  return (
    <footer className="bg-(--color-brand-green-dark) text-white/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-white text-lg mb-2">
              <TreePine className="h-5 w-5" />
              <span>{orgName}</span>
            </div>
            <p className="text-sm leading-relaxed">
              Serving our members and advancing the profession across the region.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/calendar", label: "Calendar" },
                { href: "/conference", label: "Conference" },
                { href: "/membership", label: "Membership" },
                { href: "/about", label: "About" },
                { href: "/resources", label: "Resources" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Members</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">Member Login</Link>
              </li>
              <li>
                <Link href="/membership" className="hover:text-white transition-colors">Join RNPABA</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 text-sm text-center">
          © {new Date().getFullYear()} RNPABA. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
