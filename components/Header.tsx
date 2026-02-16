'use client'

import { signOut } from '@/app/actions/auth'

interface HeaderProps {
  userEmail: string | undefined
}

export default function Header({ userEmail }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <svg
              className="h-8 w-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <h1 className="text-xl font-bold text-gray-900">Smart Bookmarks</h1>
          </div>

          <div className="flex items-center space-x-4">
            {userEmail && (
              <span className="text-sm text-gray-600 hidden sm:block">
                {userEmail}
              </span>
            )}
            <form action={signOut}>
              <button
                type="submit"
                className="text-sm text-gray-700 hover:text-gray-900 font-medium"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}
