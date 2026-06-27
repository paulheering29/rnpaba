import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { CalendarClient } from "./CalendarClient";
import type { Event } from "@/lib/types";

async function getEvents(): Promise<Event[]> {
  try {
    const hdrs = await headers();
    const slug = hdrs.get("x-org-slug");
    if (!slug) return [];

    const supabase = await createClient();
    const { data: org } = await supabase
      .from("organizations")
      .select("id")
      .eq("slug", slug)
      .single();

    if (!org) return [];

    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("org_id", org.id)
      .eq("is_published", true)
      .order("date", { ascending: true });

    return (data ?? []) as Event[];
  } catch {
    return [];
  }
}

export default async function CalendarPage() {
  const events = await getEvents();
  return <CalendarClient events={events} />;
}
