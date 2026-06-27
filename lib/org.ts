import { createClient } from '@/lib/supabase/server'
import type { OrgData } from '@/lib/types'

// Fetch org by slug (used for subdomain routing)
export async function getOrgBySlug(slug: string): Promise<OrgData | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('organizations')
      .select('*, org_modules(*)')
      .eq('slug', slug)
      .eq('active', true)
      .single()
    if (error || !data) return null
    return data as OrgData
  } catch {
    return null
  }
}

// Fetch org by custom domain (used for custom domain routing)
export async function getOrgByDomain(hostname: string): Promise<OrgData | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('organizations')
      .select('*, org_modules(*)')
      .eq('custom_domain', hostname)
      .eq('active', true)
      .single()
    if (error || !data) return null
    return data as OrgData
  } catch {
    return null
  }
}

// Build a <style> block from an org's theme object
export function buildThemeStyle(org: OrgData): string {
  const t = org.theme
  return `
    :root {
      --org-primary: ${t.primary};
      --org-secondary: ${t.secondary};
      --org-nav-bg: ${t.nav_bg};
      --org-button: ${t.button};
      --org-button-text: ${t.button_text};
      --org-background: ${t.background};
      --org-text: ${t.text};
    }
  `.trim()
}
