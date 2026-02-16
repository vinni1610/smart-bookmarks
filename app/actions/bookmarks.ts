'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function addBookmark(formData: FormData) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const url = formData.get('url') as string
  const title = formData.get('title') as string

  if (!url || !title) {
    return { error: 'URL and title are required' }
  }

  // Validate URL format
  try {
    new URL(url)
  } catch {
    return { error: 'Invalid URL format' }
  }

  const { error } = await supabase
    .from('bookmarks')
    .insert({
      user_id: user.id,
      url,
      title,
    })

  if (error) {
    console.error('Error adding bookmark:', error)
    return { error: 'Failed to add bookmark' }
  }

  revalidatePath('/bookmarks')
  return { success: true }
}

export async function deleteBookmark(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id) // Extra safety: ensure user owns this bookmark

  if (error) {
    console.error('Error deleting bookmark:', error)
    return { error: 'Failed to delete bookmark' }
  }

  revalidatePath('/bookmarks')
  return { success: true }
}
