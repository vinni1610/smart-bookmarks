# File Structure

Complete file structure for Smart Bookmarks application.

```
smart-bookmarks/
│
├── app/                           # Next.js App Router
│   ├── actions/                   # Server Actions
│   │   ├── auth.ts                # Authentication actions (signIn, signOut)
│   │   └── bookmarks.ts           # Bookmark CRUD actions
│   │
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts           # OAuth callback handler
│   │
│   ├── bookmarks/
│   │   └── page.tsx               # Main bookmarks page (Server Component)
│   │
│   ├── error/
│   │   └── page.tsx               # Error page for auth failures
│   │
│   ├── globals.css                # Global CSS with Tailwind directives
│   ├── layout.tsx                 # Root layout with Inter font
│   └── page.tsx                   # Landing/login page (Server Component)
│
├── components/                    # React Components
│   ├── AddBookmarkForm.tsx        # Client Component - add bookmark form
│   ├── BookmarkList.tsx           # Client Component - real-time bookmark list
│   └── Header.tsx                 # Client Component - header with sign out
│
├── lib/                           # Utilities and types
│   ├── supabase/
│   │   ├── client.ts              # Browser Supabase client (Client Components)
│   │   └── server.ts              # Server Supabase client (Server Components)
│   │
│   └── types.ts                   # TypeScript type definitions
│
├── supabase/                      # Database
│   └── schema.sql                 # Database schema, RLS policies, indexes
│
├── middleware.ts                  # Auth middleware (session refresh)
│
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore rules
├── next.config.js                 # Next.js configuration
├── package.json                   # Dependencies and scripts
├── postcss.config.js              # PostCSS configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
│
├── README.md                      # Comprehensive documentation
├── QUICKSTART.md                  # Quick setup guide
├── DEPLOYMENT.md                  # Production deployment guide
└── FILE_STRUCTURE.md              # This file
```

## File Purposes

### Configuration Files

- **package.json**: Project dependencies (Next.js, React, Supabase, Tailwind)
- **tsconfig.json**: TypeScript compiler options
- **next.config.js**: Next.js framework configuration
- **tailwind.config.js**: Tailwind CSS customization
- **postcss.config.js**: PostCSS plugins (Tailwind, Autoprefixer)
- **.env.example**: Template for required environment variables
- **.gitignore**: Files/folders to exclude from Git

### App Router Files

- **app/layout.tsx**: Root layout, loads global CSS and fonts
- **app/page.tsx**: Landing page with Google sign-in button
- **app/globals.css**: Tailwind directives and global styles
- **app/bookmarks/page.tsx**: Protected route, displays user's bookmarks
- **app/error/page.tsx**: Error page for authentication failures
- **app/auth/callback/route.ts**: Handles OAuth code exchange

### Server Actions

- **app/actions/auth.ts**: Server actions for authentication
  - `signInWithGoogle()`: Initiates Google OAuth flow
  - `signOut()`: Signs out user and redirects
  
- **app/actions/bookmarks.ts**: Server actions for bookmarks
  - `addBookmark()`: Adds a bookmark for the current user
  - `deleteBookmark()`: Deletes a bookmark (with ownership check)

### Components

- **components/Header.tsx**: Navigation header with user email and sign out
- **components/AddBookmarkForm.tsx**: Form to add new bookmarks with validation
- **components/BookmarkList.tsx**: Displays bookmarks with real-time updates

### Utilities

- **lib/supabase/client.ts**: Creates Supabase client for browser (Client Components)
- **lib/supabase/server.ts**: Creates Supabase client for server (Server Components)
- **lib/types.ts**: TypeScript interfaces for Bookmark and Database

### Infrastructure

- **middleware.ts**: Refreshes user sessions on every request
- **supabase/schema.sql**: Complete database setup (tables, RLS, indexes, triggers)

## Key Patterns

### Server vs Client Components

**Server Components** (default):
- `app/page.tsx`: Fetches user, renders based on auth state
- `app/bookmarks/page.tsx`: Fetches initial bookmarks, checks auth
- No `'use client'` directive

**Client Components** (needs interactivity):
- `components/AddBookmarkForm.tsx`: Uses `useState` for form state
- `components/BookmarkList.tsx`: Uses `useState` and `useEffect` for real-time
- `components/Header.tsx`: Uses form action (client-side event)
- Has `'use client'` directive at top

### Server Actions Pattern

```typescript
'use server'

export async function actionName(formData: FormData) {
  // 1. Get Supabase server client
  // 2. Verify authentication
  // 3. Perform database operation
  // 4. Revalidate path
  // 5. Return result
}
```

### Real-time Subscription Pattern

```typescript
'use client'

useEffect(() => {
  const channel = supabase.channel('name')
    .on('postgres_changes', { ... }, handleChange)
    .subscribe()
  
  return () => supabase.removeChannel(channel)
}, [dependencies])
```

## Dependencies

### Production

- `next`: React framework with App Router
- `react` & `react-dom`: React library
- `@supabase/supabase-js`: Supabase JavaScript client
- `@supabase/ssr`: Supabase SSR helpers for Next.js

### Development

- `typescript`: TypeScript compiler
- `@types/*`: Type definitions for TypeScript
- `tailwindcss`: Utility-first CSS framework
- `postcss`: CSS processor
- `autoprefixer`: Adds vendor prefixes to CSS

## Environment Variables

Required in `.env`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Note: `NEXT_PUBLIC_` prefix makes variables accessible in browser.

## Build Output

When you run `npm run build`:

```
.next/                    # Build output
├── cache/                # Build cache
├── server/               # Server-side code
├── static/               # Static assets
└── types/                # Generated TypeScript types
```

## Git Strategy

**Tracked**:
- All source code
- Configuration files
- README and documentation

**Ignored**:
- `node_modules/`: Dependencies (install with npm)
- `.next/`: Build output (regenerate with npm run build)
- `.env`: Secrets (never commit!)
- `.env.local`: Local overrides

## Development Workflow

1. **Install**: `npm install`
2. **Configure**: Copy `.env.example` to `.env` and fill in values
3. **Run**: `npm run dev`
4. **Build**: `npm run build` (test production build)
5. **Deploy**: Push to GitHub, Vercel auto-deploys

## Folder Conventions

- `app/`: Routes and layouts (App Router convention)
- `components/`: Reusable React components
- `lib/`: Utility functions and configuration
- `public/`: Static assets (images, fonts) - not used in this app
- `supabase/`: Database schema and migrations

## Naming Conventions

- **Files**: PascalCase for components (`BookmarkList.tsx`), lowercase for utilities (`client.ts`)
- **Folders**: lowercase with hyphens (`auth-callback`)
- **Components**: PascalCase (`BookmarkList`)
- **Functions**: camelCase (`addBookmark`)
- **Types**: PascalCase (`Bookmark`)

## Import Paths

Using TypeScript path mapping:

```typescript
// Instead of: import { createClient } from '../../lib/supabase/client'
import { createClient } from '@/lib/supabase/client'
```

Configured in `tsconfig.json`:
```json
{
  "paths": {
    "@/*": ["./*"]
  }
}
```
