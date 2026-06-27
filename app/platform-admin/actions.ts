'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export async function createOrgAction(formData: FormData) {
  const supabase = createAdminClient()

  const name = (formData.get('name') as string).trim()
  const slug = slugify(formData.get('slug') as string || name)
  const tier = (formData.get('tier') as string) || 'free'

  const { data: org, error } = await supabase
    .from('organizations')
    .insert({
      slug,
      name,
      tagline: (formData.get('tagline') as string) || null,
      contact_email: (formData.get('contact_email') as string) || null,
      tier,
    })
    .select('id, slug')
    .single()

  if (error) {
    redirect(`/platform-admin/orgs/new?error=${encodeURIComponent(error.message)}`)
  }

  // Seed org_modules: enable free modules, disable higher-tier ones
  const { data: modules } = await supabase.from('modules').select('key, min_tier')
  if (modules) {
    const rows = modules.map((m) => ({
      org_id: org.id,
      module_key: m.key,
      enabled: m.min_tier === 'free',
      sort_order: 0,
    }))
    await supabase.from('org_modules').insert(rows)
  }

  revalidatePath('/platform-admin/orgs')
  redirect(`/platform-admin/orgs/${org.slug}`)
}

export async function updateOrgAction(formData: FormData) {
  const supabase = createAdminClient()

  const id = formData.get('id') as string
  const rawSlug = formData.get('slug') as string | null
  const rawName = formData.get('name') as string | null
  if (!rawSlug || !rawName) {
    redirect(`/platform-admin/orgs/${formData.get('current_slug')}?error=Name+and+slug+are+required`)
  }
  const slug = slugify(rawSlug)

  const { error } = await supabase
    .from('organizations')
    .update({
      slug,
      name: rawName.trim(),
      tagline: (formData.get('tagline') as string) || null,
      contact_email: (formData.get('contact_email') as string) || null,
      tier: formData.get('tier') as string,
      active: formData.get('active') === 'true',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    redirect(`/platform-admin/orgs/${formData.get('current_slug')}?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/platform-admin/orgs')
  revalidatePath(`/platform-admin/orgs/${slug}`)
  redirect(`/platform-admin/orgs/${slug}?saved=1`)
}

export async function updateOrgThemeAction(formData: FormData) {
  const supabase = createAdminClient()

  const id = formData.get('id') as string
  const slug = formData.get('slug') as string

  const theme = {
    primary: formData.get('theme.primary') as string,
    secondary: formData.get('theme.secondary') as string,
    nav_bg: formData.get('theme.nav_bg') as string,
    button: formData.get('theme.button') as string,
    button_text: formData.get('theme.button_text') as string,
    background: formData.get('theme.background') as string,
    text: formData.get('theme.text') as string,
  }

  const { error } = await supabase
    .from('organizations')
    .update({ theme, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    redirect(`/platform-admin/orgs/${slug}?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/platform-admin/orgs')
  revalidatePath(`/platform-admin/orgs/${slug}`)
  redirect(`/platform-admin/orgs/${slug}?saved=1`)
}

export async function updateOrgModulesAction(formData: FormData) {
  const supabase = createAdminClient()

  const orgId = formData.get('org_id') as string
  const orgSlug = formData.get('org_slug') as string
  const { data: modules } = await supabase.from('modules').select('key')

  if (modules) {
    for (const m of modules) {
      const enabled = formData.get(`module.${m.key}`) === 'on'
      await supabase
        .from('org_modules')
        .upsert({ org_id: orgId, module_key: m.key, enabled }, { onConflict: 'org_id,module_key' })
    }
  }

  revalidatePath(`/platform-admin/orgs/${orgSlug}`)
  redirect(`/platform-admin/orgs/${orgSlug}?saved=1`)
}
