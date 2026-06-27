'use server'

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

// ── About Config ──────────────────────────────────────────────────────────────

export async function upsertAboutConfigAction(formData: FormData) {
  const supabase = createAdminClient();
  const org_id   = formData.get("org_id")   as string;
  const org_slug = formData.get("org_slug") as string;

  const { error } = await supabase.from("about_config").upsert({
    org_id,
    section_label:    (formData.get("section_label")    as string)?.trim() || "About",
    mission_enabled:   formData.get("mission_enabled")  === "on",
    mission_label:    (formData.get("mission_label")    as string)?.trim() || "Mission Statement",
    mission_content:  (formData.get("mission_content")  as string)?.trim() || null,
    values_enabled:    formData.get("values_enabled")   === "on",
    values_label:     (formData.get("values_label")     as string)?.trim() || "Our Values",
    values_content:   (formData.get("values_content")   as string)?.trim() || null,
    team_enabled:      formData.get("team_enabled")     === "on",
    team_label:       (formData.get("team_label")       as string)?.trim() || "Our Team",
    timeline_enabled:  formData.get("timeline_enabled") === "on",
    timeline_label:   (formData.get("timeline_label")   as string)?.trim() || "Our History",
    updated_at: new Date().toISOString(),
  }, { onConflict: "org_id" });

  if (error) redirect(`/platform-admin/orgs/${org_slug}/about?error=${encodeURIComponent(error.message)}`);
  redirect(`/platform-admin/orgs/${org_slug}/about?saved=1`);
}

// ── Team Members ──────────────────────────────────────────────────────────────

export async function createTeamMemberAction(formData: FormData) {
  const supabase  = createAdminClient();
  const org_id    = formData.get("org_id")   as string;
  const org_slug  = formData.get("org_slug") as string;

  const { count } = await supabase
    .from("team_members").select("*", { count: "exact", head: true }).eq("org_id", org_id);

  const { error } = await supabase.from("team_members").insert({
    org_id,
    name:         (formData.get("name")         as string).trim(),
    title:        (formData.get("title")         as string)?.trim() || null,
    email:        (formData.get("email")         as string)?.trim() || null,
    phone:        (formData.get("phone")         as string)?.trim() || null,
    linkedin_url: (formData.get("linkedin_url")  as string)?.trim() || null,
    avatar_url:   (formData.get("avatar_url")    as string)?.trim() || null,
    bio:          (formData.get("bio")           as string)?.trim() || null,
    is_published:  formData.get("is_published")  === "on",
    sort_order:   (count ?? 0) + 1,
  });

  if (error) redirect(`/platform-admin/orgs/${org_slug}/about/team/new?error=${encodeURIComponent(error.message)}`);
  redirect(`/platform-admin/orgs/${org_slug}/about`);
}

export async function updateTeamMemberAction(formData: FormData) {
  const supabase = createAdminClient();
  const org_slug = formData.get("org_slug") as string;
  const id       = formData.get("id")       as string;

  const { error } = await supabase.from("team_members").update({
    name:         (formData.get("name")         as string).trim(),
    title:        (formData.get("title")         as string)?.trim() || null,
    email:        (formData.get("email")         as string)?.trim() || null,
    phone:        (formData.get("phone")         as string)?.trim() || null,
    linkedin_url: (formData.get("linkedin_url")  as string)?.trim() || null,
    avatar_url:   (formData.get("avatar_url")    as string)?.trim() || null,
    bio:          (formData.get("bio")           as string)?.trim() || null,
    is_published:  formData.get("is_published")  === "on",
  }).eq("id", id);

  if (error) redirect(`/platform-admin/orgs/${org_slug}/about/team/${id}?error=${encodeURIComponent(error.message)}`);
  redirect(`/platform-admin/orgs/${org_slug}/about`);
}

export async function deleteTeamMemberAction(formData: FormData) {
  const supabase = createAdminClient();
  const id       = formData.get("id")       as string;
  const org_slug = formData.get("org_slug") as string;
  await supabase.from("team_members").delete().eq("id", id);
  redirect(`/platform-admin/orgs/${org_slug}/about`);
}

// ── Timeline Items ────────────────────────────────────────────────────────────

export async function createTimelineItemAction(formData: FormData) {
  const supabase = createAdminClient();
  const org_id   = formData.get("org_id")   as string;
  const org_slug = formData.get("org_slug") as string;

  const { count } = await supabase
    .from("timeline_items").select("*", { count: "exact", head: true }).eq("org_id", org_id);

  const { error } = await supabase.from("timeline_items").insert({
    org_id,
    year:        (formData.get("year")        as string).trim(),
    title:       (formData.get("title")       as string).trim(),
    description: (formData.get("description") as string)?.trim() || null,
    sort_order:  (count ?? 0) + 1,
  });

  if (error) redirect(`/platform-admin/orgs/${org_slug}/about/timeline/new?error=${encodeURIComponent(error.message)}`);
  redirect(`/platform-admin/orgs/${org_slug}/about`);
}

export async function updateTimelineItemAction(formData: FormData) {
  const supabase = createAdminClient();
  const org_slug = formData.get("org_slug") as string;
  const id       = formData.get("id")       as string;

  const { error } = await supabase.from("timeline_items").update({
    year:        (formData.get("year")        as string).trim(),
    title:       (formData.get("title")       as string).trim(),
    description: (formData.get("description") as string)?.trim() || null,
  }).eq("id", id);

  if (error) redirect(`/platform-admin/orgs/${org_slug}/about/timeline/${id}?error=${encodeURIComponent(error.message)}`);
  redirect(`/platform-admin/orgs/${org_slug}/about`);
}

export async function deleteTimelineItemAction(formData: FormData) {
  const supabase = createAdminClient();
  const id       = formData.get("id")       as string;
  const org_slug = formData.get("org_slug") as string;
  await supabase.from("timeline_items").delete().eq("id", id);
  redirect(`/platform-admin/orgs/${org_slug}/about`);
}
