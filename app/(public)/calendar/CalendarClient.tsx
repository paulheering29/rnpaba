"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Search, X, CalendarPlus, MapPin, Clock, ExternalLink } from "lucide-react";
import type { Event } from "@/lib/types";

// ─── Constants ───────────────────────────────────────────────────────────────

const TYPES = ["meeting", "event", "workshop", "conference"] as const;
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const TYPE_STYLES: Record<string, { chip: string; dot: string }> = {
  meeting:    { chip: "bg-blue-100 text-blue-800",   dot: "bg-blue-500" },
  event:      { chip: "bg-purple-100 text-purple-800", dot: "bg-purple-500" },
  workshop:   { chip: "bg-amber-100 text-amber-800",  dot: "bg-amber-500" },
  conference: { chip: "bg-green-100 text-green-800",  dot: "bg-green-500" },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function ordinal(n: number): string {
  if (n >= 11 && n <= 13) return `${n}th`;
  const last = n % 10;
  if (last === 1) return `${n}st`;
  if (last === 2) return `${n}nd`;
  if (last === 3) return `${n}rd`;
  return `${n}th`;
}

function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDate(dateStr: string): string {
  return parseDate(dateStr).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}

function getMonthGrid(year: number, month: number): (number | null)[] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(firstWeekday).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function getWeekDates(anchor: Date): Date[] {
  const start = new Date(anchor);
  start.setDate(anchor.getDate() - anchor.getDay()); // Sunday
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function generateICS(event: Event) {
  const d = parseDate(event.date);
  const pad = (n: number) => String(n).padStart(2, "0");
  const dateStr = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//OrgSite//Events//EN",
    "BEGIN:VEVENT",
    `UID:${event.id}@orgsite`,
    `DTSTART;VALUE=DATE:${dateStr}`,
    `SUMMARY:${event.title}`,
    event.location ? `LOCATION:${event.location}` : "",
    event.description ? `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}` : "",
    "END:VEVENT", "END:VCALENDAR",
  ].filter(Boolean).join("\r\n");

  const blob = new Blob([lines], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.title.replace(/\s+/g, "-").toLowerCase()}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function googleCalendarUrl(event: Event): string {
  const d = parseDate(event.date);
  const pad = (n: number) => String(n).padStart(2, "0");
  const dateStr = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${dateStr}/${dateStr}`,
    details: event.description ?? "",
    location: event.location ?? "",
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

// ─── Main component ───────────────────────────────────────────────────────────

type View = "list" | "month" | "week" | "year";

export function CalendarClient({ events }: { events: Event[] }) {
  const [view, setView] = useState<View>("list");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selected, setSelected] = useState<Event | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return events.filter((e) => {
      if (typeFilter && e.type !== typeFilter) return false;
      if (q && !e.title.toLowerCase().includes(q) && !e.location?.toLowerCase().includes(q) && !e.description?.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [events, query, typeFilter]);

  // Group by date key for fast lookup
  const byDate = useMemo(() => {
    const map = new Map<string, Event[]>();
    filtered.forEach((e) => {
      const key = e.date;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    });
    return map;
  }, [filtered]);

  const navigate = (delta: number) => {
    const d = new Date(currentDate);
    if (view === "month") d.setMonth(d.getMonth() + delta);
    else if (view === "week") d.setDate(d.getDate() + delta * 7);
    else if (view === "year") d.setFullYear(d.getFullYear() + delta);
    setCurrentDate(d);
  };

  const navLabel = () => {
    if (view === "month") return `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    if (view === "year") return `${currentDate.getFullYear()}`;
    if (view === "week") {
      const week = getWeekDates(currentDate);
      const start = week[0];
      const end = week[6];
      return start.getMonth() === end.getMonth()
        ? `${MONTHS[start.getMonth()]} ${start.getDate()}–${end.getDate()}, ${start.getFullYear()}`
        : `${MONTHS[start.getMonth()]} ${start.getDate()} – ${MONTHS[end.getMonth()]} ${end.getDate()}, ${start.getFullYear()}`;
    }
    return "All Events";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-(--color-brand-green-dark) mb-1">Events</h1>
        <p className="text-muted-foreground text-sm">Upcoming meetings, workshops, and activities.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events…"
            className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-(--color-brand-green-dark)"
          />
        </div>

        {/* Type filter */}
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setTypeFilter("")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!typeFilter ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            All
          </button>
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(typeFilter === t ? "" : t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${typeFilter === t ? TYPE_STYLES[t].chip + " ring-2 ring-offset-1 ring-current" : TYPE_STYLES[t].chip}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* View toggle — inline style for active state avoids Turbopack CSS scan miss */}
        <div className="flex rounded-md border border-gray-300 overflow-hidden shrink-0">
          {(["list","month","week","year"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={view === v ? { backgroundColor: "#111827", color: "#ffffff" } : {}}
              className="px-3 py-1.5 text-xs font-medium capitalize transition-colors bg-white text-gray-600 hover:bg-gray-50"
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Nav bar for non-list views */}
      {view !== "list" && (
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded hover:bg-gray-100 transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold text-gray-800">{navLabel()}</span>
          <button onClick={() => navigate(1)} className="p-1.5 rounded hover:bg-gray-100 transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Views */}
      {view === "list" && <ListView events={filtered} onSelect={setSelected} />}
      {view === "month" && <MonthView byDate={byDate} currentDate={currentDate} onSelect={setSelected} onDayClick={(d) => { setCurrentDate(d); setView("week"); }} />}
      {view === "week" && <WeekView byDate={byDate} currentDate={currentDate} onSelect={setSelected} />}
      {view === "year" && <YearView byDate={byDate} currentDate={currentDate} onMonthClick={(d) => { setCurrentDate(d); setView("month"); }} />}

      {/* Event side-sheet */}
      <EventSheet event={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

// ─── List view ────────────────────────────────────────────────────────────────

function ListView({ events, onSelect }: { events: Event[]; onSelect: (e: Event) => void }) {
  const today = toDateKey(new Date());
  const upcoming = events.filter((e) => e.date >= today);
  const past = events.filter((e) => e.date < today);

  if (events.length === 0) {
    return <div className="text-center py-16 text-gray-400 text-sm">No events found.</div>;
  }

  return (
    <div className="space-y-8">
      {upcoming.length > 0 && (
        <section>
          {past.length > 0 && <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Upcoming</h2>}
          <div className="space-y-3">
            {upcoming.map((e) => <EventCard key={e.id} event={e} onSelect={onSelect} />)}
          </div>
        </section>
      )}
      {past.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Past</h2>
          <div className="space-y-3 opacity-60">
            {past.reverse().map((e) => <EventCard key={e.id} event={e} onSelect={onSelect} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function EventCard({ event, onSelect }: { event: Event; onSelect: (e: Event) => void }) {
  const d = parseDate(event.date);
  return (
    <button
      onClick={() => onSelect(event)}
      className="w-full text-left bg-white border rounded-xl px-4 py-3 hover:shadow-md hover:border-gray-200 transition-all flex items-center gap-4"
    >
      {/* Date block */}
      <div className="shrink-0 w-16 h-16 rounded-lg bg-(--color-brand-green-dark) flex flex-col items-center justify-center text-white">
        <div className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{MONTHS[d.getMonth()].slice(0, 3)}</div>
        <div className="text-xl font-bold leading-tight">{ordinal(d.getDate())}</div>
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <div className="text-base font-bold text-gray-900 leading-snug">{event.title}</div>
      </div>

      {/* Type · Time · Location — right-aligned so all three share the same right edge */}
      <div className="shrink-0 w-44 flex flex-col items-end gap-1.5">
        <span className={`text-xs rounded-full px-2 py-0.5 font-medium whitespace-nowrap ${TYPE_STYLES[event.type]?.chip ?? ""}`}>
          {event.type}
        </span>
        {event.time && (
          <div className="w-full flex items-center justify-end gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3 shrink-0" />
            <span className="truncate">{event.time}</span>
          </div>
        )}
        {event.location && (
          <div className="w-full flex items-center justify-end gap-1 text-xs text-gray-500">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        )}
      </div>
    </button>
  );
}

// ─── Month view ───────────────────────────────────────────────────────────────

function MonthView({ byDate, currentDate, onSelect, onDayClick }: {
  byDate: Map<string, Event[]>;
  currentDate: Date;
  onSelect: (e: Event) => void;
  onDayClick: (d: Date) => void;
}) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const grid = getMonthGrid(year, month);
  const today = toDateKey(new Date());

  const COL7: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))" };

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="border-b" style={COL7}>
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-gray-500 py-2">{d}</div>
        ))}
      </div>
      <div style={COL7}>
        {grid.map((day, i) => {
          if (!day) return <div key={`pad-${i}`} style={{ minHeight: 120 }} className="bg-gray-50/50 border-r border-b last:border-r-0" />;
          const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayEvents = byDate.get(key) ?? [];
          const isToday = key === today;
          return (
            <div
              key={key}
              onClick={() => onDayClick(new Date(year, month, day))}
              style={{ minHeight: 120 }}
              className="p-1.5 border-r border-b last:border-r-0 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div
                style={isToday ? { backgroundColor: "var(--color-brand-green-dark)", color: "white" } : {}}
                className="text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1 text-gray-700"
              >
                {day}
              </div>
              <div className="space-y-0.5">
                {dayEvents.slice(0, 4).map((e) => (
                  <button
                    key={e.id}
                    onClick={(ev) => { ev.stopPropagation(); onSelect(e); }}
                    className={`w-full text-left text-xs rounded px-1 py-0.5 truncate ${TYPE_STYLES[e.type]?.chip ?? "bg-gray-100"} hover:opacity-80`}
                  >
                    {e.title}
                  </button>
                ))}
                {dayEvents.length > 4 && (
                  <div className="text-xs text-gray-400 pl-1">+{dayEvents.length - 4} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Week view ────────────────────────────────────────────────────────────────

function WeekView({ byDate, currentDate, onSelect }: {
  byDate: Map<string, Event[]>;
  currentDate: Date;
  onSelect: (e: Event) => void;
}) {
  const weekDates = getWeekDates(currentDate);
  const todayKey = toDateKey(new Date());

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: "0.5rem" }}>
      {weekDates.map((date) => {
        const key = toDateKey(date);
        const dayEvents = byDate.get(key) ?? [];
        const isToday = key === todayKey;
        return (
          <div key={key} className={`min-h-[160px] rounded-lg border p-2 ${isToday ? "border-(--color-brand-green-dark) bg-green-50/30" : "bg-white"}`}>
            <div className="text-center mb-2">
              <div className="text-xs text-gray-400">{DAYS[date.getDay()]}</div>
              <div className={`text-lg font-bold leading-none mt-0.5 ${isToday ? "text-(--color-brand-green-dark)" : "text-gray-800"}`}>
                {date.getDate()}
              </div>
            </div>
            <div className="space-y-1">
              {dayEvents.map((e) => (
                <button
                  key={e.id}
                  onClick={() => onSelect(e)}
                  className={`w-full text-left text-xs rounded px-1.5 py-1 ${TYPE_STYLES[e.type]?.chip ?? "bg-gray-100"} hover:opacity-80 transition-opacity`}
                >
                  <div className="font-medium truncate">{e.title}</div>
                  {e.time && <div className="opacity-70 truncate">{e.time}</div>}
                </button>
              ))}
              {dayEvents.length === 0 && (
                <div className="text-xs text-gray-300 text-center py-2">—</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Year view ────────────────────────────────────────────────────────────────

function YearView({ byDate, currentDate, onMonthClick }: {
  byDate: Map<string, Event[]>;
  currentDate: Date;
  onMonthClick: (d: Date) => void;
}) {
  const year = currentDate.getFullYear();
  const todayKey = toDateKey(new Date());

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "1rem" }}>
      {MONTHS.map((monthName, monthIdx) => {
        const grid = getMonthGrid(year, monthIdx);
        return (
          <div
            key={monthName}
            onClick={() => onMonthClick(new Date(year, monthIdx, 1))}
            className="bg-white border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="text-xs font-semibold text-gray-700 mb-2">{monthName}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: "1px" }}>
              {DAYS.map((d) => (
                <div key={d} className="text-center text-[9px] text-gray-300">{d[0]}</div>
              ))}
              {grid.map((day, i) => {
                if (!day) return <div key={`pad-${i}`} />;
                const key = `${year}-${String(monthIdx + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const hasEvents = (byDate.get(key)?.length ?? 0) > 0;
                const isToday = key === todayKey;
                return (
                  <div key={key} style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 1, paddingBottom: 1 }}>
                    <div
                      style={
                        isToday
                          ? { backgroundColor: "var(--color-brand-green-dark)", color: "white", borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 }
                          : { color: "#9ca3af", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 }
                      }
                    >
                      {day}
                    </div>
                    {hasEvents && (
                      <div style={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: "var(--color-brand-green-dark)", marginTop: 1 }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Event side-sheet ─────────────────────────────────────────────────────────

function EventSheet({ event, onClose }: { event: Event | null; onClose: () => void }) {
  return (
    <>
      {/* Backdrop — only in DOM when an event is open */}
      {event && (
        <div onClick={onClose} className="fixed inset-0 bg-black/30 z-40" />
      )}

      {/* Sheet — inline style avoids Tailwind scanning gap with template-literal classes */}
      <div
        style={{ transform: event ? "translateX(0)" : "translateX(100%)" }}
        className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col transition-transform duration-300 ease-in-out"
      >
        {event && (
          <>
            {/* Sheet header */}
            <div className="flex items-start justify-between p-5 border-b gap-3">
              <div className="flex-1 min-w-0">
                <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${TYPE_STYLES[event.type]?.chip ?? ""}`}>
                  {event.type}
                </span>
                <h2 className="text-lg font-semibold text-gray-900 mt-2 leading-snug">{event.title}</h2>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-md hover:bg-gray-100 shrink-0 mt-0.5">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Sheet body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-gray-400 w-4 text-center">📅</span>
                  <span className="font-medium">{formatDate(event.date)}</span>
                </div>
                {event.time && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Clock className="h-4 w-4 text-gray-400 shrink-0" />
                    {event.time}
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                    {event.location}
                  </div>
                )}
              </div>

              {event.description && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{event.description}</p>
                </div>
              )}
            </div>

            {/* Add to calendar */}
            <div className="p-5 border-t space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Add to Calendar</p>
              <button
                onClick={() => generateICS(event)}
                className="w-full flex items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <CalendarPlus className="h-4 w-4" />
                Download .ics (Apple / Outlook)
              </button>
              <a
                href={googleCalendarUrl(event)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Add to Google Calendar
              </a>
            </div>
          </>
        )}
      </div>
    </>
  );
}
