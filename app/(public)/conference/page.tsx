import { CalendarDays, MapPin, Mic, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const schedule = [
  {
    day: "Day 1 — Saturday, September 19",
    sessions: [
      { time: "8:00 AM", title: "Registration & Continental Breakfast", type: "Break" },
      { time: "9:00 AM", title: "Opening Keynote: The Future of Our Field", type: "Keynote", speaker: "TBA" },
      { time: "10:30 AM", title: "Morning Break", type: "Break" },
      { time: "10:45 AM", title: "Breakout Sessions (choose one)", type: "Session" },
      { time: "12:00 PM", title: "Networking Lunch", type: "Break" },
      { time: "1:30 PM", title: "Afternoon Breakout Sessions (choose one)", type: "Session" },
      { time: "3:00 PM", title: "Afternoon Break", type: "Break" },
      { time: "3:15 PM", title: "Panel Discussion: Emerging Challenges", type: "Panel" },
      { time: "5:00 PM", title: "Welcome Reception & Exhibitor Hall", type: "Break" },
    ],
  },
  {
    day: "Day 2 — Sunday, September 20",
    sessions: [
      { time: "8:30 AM", title: "Morning Breakout Sessions (choose one)", type: "Session" },
      { time: "10:00 AM", title: "Morning Break", type: "Break" },
      { time: "10:15 AM", title: "Closing Keynote: Looking Ahead", type: "Keynote", speaker: "TBA" },
      { time: "11:30 AM", title: "Awards Luncheon & Member Recognition", type: "Break" },
      { time: "1:30 PM", title: "Annual Business Meeting", type: "Session" },
      { time: "2:30 PM", title: "Closing Remarks", type: "Break" },
    ],
  },
];

const sessionTypeColors: Record<string, string> = {
  Keynote: "bg-green-100 text-green-800",
  Session: "bg-blue-100 text-blue-800",
  Panel: "bg-purple-100 text-purple-800",
  Break: "bg-gray-100 text-gray-600",
};

export default function ConferencePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-(--color-brand-green-dark) to-(--color-brand-blue) text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Badge className="bg-white/20 text-white hover:bg-white/30 border-0 mb-4">
            2026 Annual Conference
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">RNPABA Annual Conference</h1>
          <p className="text-lg text-white/80 mb-6 max-w-2xl">
            Two days of professional development, networking, and community for RNPABA members and guests.
          </p>
          <div className="flex flex-wrap gap-6 text-sm text-white/90 mb-8">
            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" /> September 19–20, 2026
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Conference Center, Salem, OR
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className={cn(buttonVariants({ size: "lg" }), "bg-white text-(--color-brand-green-dark) hover:bg-white/90 font-semibold")}>
              Register Now
            </button>
            <button className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-white/60 text-white hover:bg-white/10 bg-transparent")}>
              Download Brochure
            </button>
          </div>
        </div>
      </section>

      {/* Quick info cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Early Bird Deadline", value: "August 1, 2026", icon: CalendarDays },
            { label: "CEUs Available", value: "Up to 12 CEUs", icon: Mic },
            { label: "Location", value: "Salem, OR", icon: MapPin },
          ].map(({ label, value, icon: Icon }) => (
            <Card key={label} className="shadow-md">
              <CardContent className="flex items-center gap-3 py-5">
                <div className="h-10 w-10 rounded-lg bg-(--color-accent) flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-(--color-brand-green-dark)" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                  <div className="font-semibold text-sm">{value}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* About the conference */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <h2 className="text-2xl font-bold mb-4 text-(--color-brand-green-dark)">About the Conference</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          The RNPABA Annual Conference brings together members from across the region for two full days of learning, connection, and celebration. Featuring keynote speakers, expert-led breakout sessions, a panel discussion, and the annual awards luncheon, this is the premier event of the RNPABA calendar.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          CEU credits are available for qualifying sessions. Specific CEU counts and session approvals will be posted as the conference date approaches.
        </p>
      </section>

      {/* Schedule */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-2xl font-bold mb-8 text-(--color-brand-green-dark)">Schedule</h2>
        <div className="space-y-10">
          {schedule.map((day) => (
            <div key={day.day}>
              <h3 className="font-semibold text-base text-(--color-brand-blue) mb-4 pb-2 border-b border-(--color-border)">
                {day.day}
              </h3>
              <div className="space-y-2">
                {day.sessions.map((session, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="text-xs text-muted-foreground w-16 shrink-0 pt-0.5 font-mono">
                      {session.time}
                    </div>
                    <div className="flex-1 flex items-center justify-between gap-2">
                      <span className={`text-sm ${session.type === "Break" ? "text-muted-foreground italic" : "font-medium"}`}>
                        {session.title}
                        {session.speaker && (
                          <span className="text-muted-foreground font-normal"> — {session.speaker}</span>
                        )}
                      </span>
                      {session.type !== "Break" && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${sessionTypeColors[session.type]}`}>
                          {session.type}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-6">
          Schedule subject to change. Specific breakout session topics and speakers will be announced as they are confirmed.
        </p>
      </section>

      {/* Registration CTA */}
      <section className="bg-(--color-muted) border-t border-(--color-border) py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to join us?</h2>
          <p className="text-muted-foreground mb-6">
            Registration opens July 1, 2026. Early bird pricing available through August 1.
          </p>
          <button className={cn(buttonVariants({ size: "lg" }), "bg-(--color-brand-green-dark) hover:bg-(--color-brand-green) text-white")}>
            Register for the Conference <ChevronRight className="h-4 w-4 ml-1" />
          </button>
          <p className="text-xs text-muted-foreground mt-4">
            Questions? Email{" "}
            <a href="mailto:conference@rnpaba.org" className="text-(--color-brand-green-dark) hover:underline">
              conference@rnpaba.org
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
