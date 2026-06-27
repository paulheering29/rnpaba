'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

export async function createEventAction(formData: FormData) {
  const supabase = createAdminClient()
  const orgId = formData.get('org_id') as string
  const orgSlug = formData.get('org_slug') as string

  const { error } = await supabase.from('events').insert({
    org_id: orgId,
    title: (formData.get('title') as string).trim(),
    date: formData.get('date') as string,
    time: (formData.get('time') as string) || null,
    location: (formData.get('location') as string) || null,
    type: formData.get('type') as string,
    description: (formData.get('description') as string) || null,
    is_published: formData.get('is_published') === 'on',
  })

  if (error) {
    redirect(`/platform-admin/orgs/${orgSlug}/events/new?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath(`/platform-admin/orgs/${orgSlug}/events`)
  redirect(`/platform-admin/orgs/${orgSlug}/events?saved=1`)
}

export async function updateEventAction(formData: FormData) {
  const supabase = createAdminClient()
  const id = formData.get('id') as string
  const orgSlug = formData.get('org_slug') as string

  const { error } = await supabase
    .from('events')
    .update({
      title: (formData.get('title') as string).trim(),
      date: formData.get('date') as string,
      time: (formData.get('time') as string) || null,
      location: (formData.get('location') as string) || null,
      type: formData.get('type') as string,
      description: (formData.get('description') as string) || null,
      is_published: formData.get('is_published') === 'on',
    })
    .eq('id', id)

  if (error) {
    redirect(`/platform-admin/orgs/${orgSlug}/events/${id}?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath(`/platform-admin/orgs/${orgSlug}/events`)
  redirect(`/platform-admin/orgs/${orgSlug}/events?saved=1`)
}

export async function deleteEventAction(formData: FormData) {
  const supabase = createAdminClient()
  const id = formData.get('id') as string
  const orgSlug = formData.get('org_slug') as string

  await supabase.from('events').delete().eq('id', id)

  revalidatePath(`/platform-admin/orgs/${orgSlug}/events`)
  redirect(`/platform-admin/orgs/${orgSlug}/events`)
}
