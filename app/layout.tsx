import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { getOrgBySlug, getOrgByDomain, buildThemeStyle } from "@/lib/org";
import type { OrgData } from "@/lib/types";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RNPABA",
  description: "Rocky North Pacific Aquaculture & Bay Association",
};

async function resolveOrg(): Promise<OrgData | null> {
  const hdrs = await headers();
  if (hdrs.get("x-platform-admin") === "true") return null;
  const slug = hdrs.get("x-org-slug");
  const hostname = hdrs.get("x-org-hostname");
  if (slug) return getOrgBySlug(slug);
  if (hostname) return getOrgByDomain(hostname);
  return null;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const org = await resolveOrg();
  const themeStyle = org ? buildThemeStyle(org) : null;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {themeStyle && <style dangerouslySetInnerHTML={{ __html: themeStyle }} />}
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
