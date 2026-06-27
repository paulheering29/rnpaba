"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, TreePine } from "lucide-react";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OrgData } from "@/lib/types";

export function Nav({ org, aboutLabel }: { org?: OrgData | null; aboutLabel?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const orgName = org?.name ?? "RNPABA";
  const links = [
    { href: "/", label: "Home" },
    { href: "/calendar", label: "Calendar" },
    { href: "/conference", label: "Conference" },
    { href: "/membership", label: "Membership" },
    { href: "/about", label: aboutLabel ?? "About" },
    { href: "/resources", label: "Resources" },
  ];

  return (
    <header className="bg-(--color-brand-green-dark) text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-wide">
            <TreePine className="h-6 w-6 text-white/80" />
            <span>{orgName}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === href
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Login */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "border-white/50 text-white hover:bg-white hover:text-(--color-brand-green-dark) bg-transparent"
              )}
            >
              Member Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/20">
          <div className="px-4 py-2 space-y-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === href
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
              >
                {label}
              </Link>
            ))}
            <div className="pt-2 pb-1">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "w-full border-white/50 text-white hover:bg-white hover:text-(--color-brand-green-dark) bg-transparent"
                )}
              >
                Member Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
