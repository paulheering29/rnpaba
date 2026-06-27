import Link from "next/link";
import { Calendar, Users, BookOpen, FileText, ExternalLink, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const upcomingEvents = [
  { date: "Jul 10", title: "Monthly Board Meeting", type: "Meeting" },
  { date: "Jul 18", title: "Summer Networking Luncheon", type: "Event" },
  { date: "Aug 5", title: "Professional Development Workshop", type: "Workshop" },
];

const quickLinks = [
  {
    icon: Calendar,
    title: "Calendar",
    desc: "View upcoming meetings, events, and chapter activities.",
    href: "/calendar",
  },
  {
    icon: Users,
    title: "Membership",
    desc: "Learn about membership tiers and the benefits of joining.",
    href: "/membership",
  },
  {
    icon: BookOpen,
    title: "Annual Conference",
    desc: "Details on registration, speakers, and the conference schedule.",
    href: "/conference",
  },
  {
    icon: FileText,
    title: "Resources",
    desc: "Links to industry resources, tools, and partner organizations.",
    href: "/resources",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-(--color-brand-green-dark) to-(--color-brand-blue) text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
            Welcome to RNPABA
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Connecting professionals, advancing the field, and building a stronger regional community.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/membership"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-white text-(--color-brand-green-dark) hover:bg-white/90 font-semibold"
              )}
            >
              Become a Member
            </Link>
            <Link
              href="/conference"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white/60 text-white hover:bg-white/10 bg-transparent"
              )}
            >
              Annual Conference
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming events strip */}
      <section className="bg-(--color-accent) border-b border-(--color-border) py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm font-semibold text-(--color-brand-green-dark) uppercase tracking-wide shrink-0">
              Upcoming
            </span>
            <div className="flex gap-4 flex-wrap">
              {upcomingEvents.map((e) => (
                <div key={e.title} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-(--color-brand-green-dark) bg-white px-2 py-0.5 rounded">
                    {e.date}
                  </span>
                  <span className="text-sm text-foreground">{e.title}</span>
                  <Badge variant="secondary" className="text-xs">{e.type}</Badge>
                </div>
              ))}
            </div>
            <Link href="/calendar" className="ml-auto text-sm font-medium text-(--color-brand-green-dark) hover:underline flex items-center gap-1 shrink-0">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick links grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-center mb-10 text-(--color-brand-green-dark)">
          What We Offer
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map(({ icon: Icon, title, desc, href }) => (
            <Card key={title} className="hover:shadow-md transition-shadow group">
              <CardHeader className="pb-2">
                <div className="h-10 w-10 rounded-lg bg-(--color-accent) flex items-center justify-center mb-2">
                  <Icon className="h-5 w-5 text-(--color-brand-green-dark)" />
                </div>
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{desc}</p>
                <Link
                  href={href}
                  className="text-sm font-medium text-(--color-brand-green-dark) flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  Learn more <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* About strip */}
      <section className="bg-(--color-muted) border-t border-(--color-border)">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-3 text-(--color-brand-green-dark)">About RNPABA</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              RNPABA is a regional chapter dedicated to supporting professionals in our field through education, networking, and advocacy. Our members include practitioners, educators, and students committed to excellence and growth.
            </p>
            <Link
              href="/about"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "border-(--color-brand-green-dark) text-(--color-brand-green-dark) hover:bg-(--color-accent)"
              )}
            >
              Meet Our Board <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="flex-1 flex justify-center gap-8 text-center">
            {[
              { value: "200+", label: "Members" },
              { value: "15+", label: "Years Active" },
              { value: "12", label: "Events / Year" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl font-bold text-(--color-brand-green-dark)">{value}</div>
                <div className="text-sm text-muted-foreground mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Member CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold mb-3">Already a member?</h2>
        <p className="text-muted-foreground mb-6">
          Log in to access member-only resources, courses, and conference recordings.
        </p>
        <Link
          href="/login"
          className={cn(
            buttonVariants({ size: "lg" }),
            "bg-(--color-brand-green-dark) hover:bg-(--color-brand-green) text-white"
          )}
        >
          Member Login <ExternalLink className="h-4 w-4 ml-2" />
        </Link>
      </section>
    </div>
  );
}
