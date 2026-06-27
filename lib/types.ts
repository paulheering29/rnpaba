export type OrgTier = 'free' | 'starter' | 'pro'

export type ModuleKey =
  | 'home'
  | 'calendar'
  | 'conference'
  | 'membership'
  | 'about'
  | 'resources'
  | 'member_portal'

export interface OrgTheme {
  primary: string     // oklch value — used for headings, active states, key UI elements
  secondary: string   // oklch value — accent / secondary color
  nav_bg: string      // oklch value — navigation bar background
  button: string      // oklch value — primary button background
  button_text: string // oklch value — primary button text (usually white)
  background: string  // oklch value — page background
  text: string        // oklch value — body text
}

export interface Organization {
  id: string
  slug: string
  name: string
  tagline: string | null
  contact_email: string | null
  custom_domain: string | null
  theme: OrgTheme
  tier: OrgTier
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export interface OrgModule {
  org_id: string
  module_key: ModuleKey
  enabled: boolean
  sort_order: number
}

export interface OrgData extends Organization {
  org_modules: OrgModule[]
}

export interface Event {
  id: string
  org_id: string
  title: string
  date: string       // ISO date: "2025-10-15"
  time: string | null
  location: string | null
  type: string       // "meeting" | "event" | "workshop" | "conference"
  description: string | null
  is_published: boolean
  created_at: string
}

export interface BoardMember {
  id: string
  org_id: string
  name: string
  title: string
  email: string | null
  bio: string | null
  photo_url: string | null
  sort_order: number
  is_published: boolean
}

export interface Resource {
  id: string
  org_id: string
  category: string
  title: string
  url: string
  description: string | null
  tags: string[]
  sort_order: number
  is_published: boolean
}

export interface Conference {
  id: string
  org_id: string
  name: string
  year: number
  dates: string | null        // display string e.g. "October 15–16, 2025"
  location: string | null
  theme_text: string | null   // conference theme
  description: string | null
  registration_url: string | null
  is_current: boolean
  is_published: boolean
}

export interface ConferenceSession {
  id: string
  conference_id: string
  org_id: string
  day: number
  start_time: string | null
  end_time: string | null
  title: string
  speaker: string | null
  description: string | null
  sort_order: number
}

export interface AboutConfig {
  org_id: string
  section_label: string
  mission_enabled: boolean
  mission_label: string
  mission_content: string | null
  values_enabled: boolean
  values_label: string
  values_content: string | null
  team_enabled: boolean
  team_label: string
  timeline_enabled: boolean
  timeline_label: string
  updated_at: string
}

export interface TeamMember {
  id: string
  org_id: string
  name: string
  title: string | null
  email: string | null
  phone: string | null
  linkedin_url: string | null
  avatar_url: string | null
  bio: string | null
  sort_order: number
  is_published: boolean
}

export interface TimelineItem {
  id: string
  org_id: string
  year: string
  title: string
  description: string | null
  sort_order: number
}

export interface MembershipTier {
  id: string
  org_id: string
  name: string
  price_monthly: number | null
  price_annual: number | null
  description: string | null
  features: string[]
  highlight: boolean
  sort_order: number
  stripe_price_id: string | null
}
