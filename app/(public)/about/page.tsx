import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { TeamSection } from "./TeamSection";
import type { AboutConfig, TeamMember, TimelineItem } from "@/lib/types";

// ── Tiny inline markdown renderer ──────────────────────────────────────────────
function renderMarkdown(src: string) {
  const lines = src.split("\n");
  const nodes: React.ReactNode[] = [];
  let listItems: string[] = [];
  let paraLines: string[] = [];
  let key = 0;

  function flushPara() {
    if (!paraLines.length) return;
    nodes.push(
      <p key={key++} className="text-muted-foreground leading-relaxed mb-4">
        {inlineFormat(paraLines.join(" "))}
      </p>
    );
    paraLines = [];
  }
  function flushList() {
    if (!listItems.length) return;
    nodes.push(
      <ul key={key++} className="list-disc pl-5 mb-4 space-y-1 text-muted-foreground">
        {listItems.map((item, i) => <li key={i}>{inlineFormat(item)}</li>)}
      </ul>
    );
    listItems = [];
  }

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith("## ")) {
      flushPara(); flushList();
      nodes.push(
        <h3 key={key++} className="text-lg font-semibold text-(--color-brand-green-dark) mb-2 mt-4">
          {line.slice(3)}
        </h3>
      );
    } else if (line.startsWith("- ")) {
      flushPara();
      listItems.push(line.slice(2));
    } else if (line.trim() === "") {
      flushList(); flushPara();
    } else {
      flushList();
      paraLines.push(line);
    }
  }
  flushList(); flushPara();
  return <>{nodes}</>;
}

function inlineFormat(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
}

// ── Data fetching ──────────────────────────────────────────────────────────────
async function getAboutData() {
  try {
    const hdrs = await headers();
    const slug = hdrs.get("x-org-slug");
    if (!slug) return null;

    const supabase = await createClient();
    const { data: org } = await supabase
      .from("organizations")
      .select("id, name")
      .eq("slug", slug)
      .single();

    if (!org) return null;

    const [{ data: config }, { data: team }, { data: timeline }] = await Promise.all([
      supabase.from("about_config").select("*").eq("org_id", org.id).single(),
      supabase.from("team_members").select("*").eq("org_id", org.id).eq("is_published", true).order("sort_order"),
      supabase.from("timeline_items").select("*").eq("org_id", org.id).order("sort_order"),
    ]);

    return {
      config: (config ?? {}) as Partial<AboutConfig>,
      team: (team ?? []) as TeamMember[],
      timeline: (timeline ?? []) as TimelineItem[],
    };
  } catch {
    return null;
  }
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default async function AboutPage() {
  const data = await getAboutData();

  const config        = data?.config ?? {};
  const team          = data?.team ?? [];
  const timeline      = data?.timeline ?? [];

  const missionOn     = config.mission_enabled  ?? true;
  const missionLabel  = config.mission_label   ?? "Mission Statement";
  const valuesOn      = config.values_enabled   ?? true;
  const valuesLabel   = config.values_label    ?? "Our Values";
  const teamOn        = config.team_enabled     ?? true;
  const teamLabel     = config.team_label      ?? "Our Team";
  const timelineOn    = config.timeline_enabled ?? true;
  const timelineLabel = config.timeline_label  ?? "Our History";

  // Build ordered list of enabled sections — background alternates by index
  type Section = { key: string; wide?: boolean; content: React.ReactNode };
  const sections: Section[] = [];

  if (missionOn) sections.push({
    key: "mission",
    content: (
      <>
        <h2 className="text-2xl font-bold mb-4 text-(--color-brand-green-dark)">{missionLabel}</h2>
        {config.mission_content
          ? renderMarkdown(config.mission_content)
          : <p className="text-muted-foreground">Content coming soon.</p>}
      </>
    ),
  });

  if (valuesOn) sections.push({
    key: "values",
    content: (
      <>
        <h2 className="text-2xl font-bold mb-4 text-(--color-brand-green-dark)">{valuesLabel}</h2>
        {config.values_content
          ? renderMarkdown(config.values_content)
          : <p className="text-muted-foreground">Content coming soon.</p>}
      </>
    ),
  });

  if (teamOn) sections.push({
    key: "team",
    wide: true,
    content: <TeamSection members={team} label={teamLabel} />,
  });

  if (timelineOn) sections.push({
    key: "timeline",
    content: (
      <>
        <h2 className="text-2xl font-bold mb-8 text-(--color-brand-green-dark)">{timelineLabel}</h2>
        {timeline.length === 0 ? (
          <p className="text-muted-foreground">No history items added yet.</p>
        ) : (
          <div>
            {timeline.map((item, i) => (
              <div key={item.id} className="flex gap-5">
                <div className="flex flex-col items-center w-8 shrink-0">
                  <div className="h-5 w-5 rounded-full bg-(--color-brand-green-dark) border-2 border-white ring-2 ring-(--color-brand-green-dark)/30 shrink-0 mt-0.5" />
                  {i < timeline.length - 1 && (
                    <div className="flex-1 w-0.5 bg-(--color-border) mt-1" />
                  )}
                </div>
                <div className="pb-8 flex-1">
                  <div className="font-bold text-sm text-(--color-brand-green-dark)">{item.year}</div>
                  <p className="font-semibold text-gray-800 mt-0.5">{item.title}</p>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    ),
  });

  return (
    <div>
      {sections.map(({ key, wide, content }, i) => (
        <section
          key={key}
          className={`py-14 px-4 border-b border-(--color-border) ${i % 2 === 0 ? "bg-white" : "bg-(--color-muted)"}`}
        >
          <div className={wide ? "max-w-5xl mx-auto" : "max-w-4xl mx-auto"}>
            {content}
          </div>
        </section>
      ))}
    </div>
  );
}
