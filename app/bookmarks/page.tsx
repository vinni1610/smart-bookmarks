import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import AddBookmarkForm from '@/components/AddBookmarkForm'
import BookmarkList from '@/components/BookmarkList'
import { Bookmark } from '@/lib/types'

export default async function BookmarksPage() {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Fetch bookmarks (sorted by most recent first)
  const { data: bookmarks, error } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching bookmarks:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userEmail={user.email} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Bookmark Form - Sticky on desktop */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 lg:sticky lg:top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Add Bookmark
              </h2>
              <AddBookmarkForm />
            </div>
          </div>

          {/* Bookmarks List */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">My Bookmarks</h2>
              <p className="text-sm text-gray-600 mt-1">
                {bookmarks?.length || 0} bookmark{bookmarks?.length !== 1 ? 's' : ''}
              </p>
            </div>
            <BookmarkList
              initialBookmarks={(bookmarks as Bookmark[]) || []}
              userId={user.id}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
