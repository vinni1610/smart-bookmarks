# Quick Start Guide

Get Smart Bookmarks running locally in 10 minutes.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier is fine)
- A Google account

## Step-by-Step Setup

### 1. Supabase Setup (5 minutes)

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in:
   - Project name: `smart-bookmarks`
   - Database password: (create a strong password)
   - Region: (choose closest to you)
4. Click "Create new project" and wait ~2 minutes

5. Get your credentials:
   - Click "Settings" (gear icon) > "API"
   - Copy "Project URL" → save as `NEXT_PUBLIC_SUPABASE_URL`
   - Copy "anon public" key → save as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

6. Set up the database:
   - Click "SQL Editor" on the left sidebar
   - Click "New Query"
   - Open `supabase/schema.sql` from this project
   - Copy all contents and paste into the query editor
   - Click "Run" (or press Cmd/Ctrl + Enter)
   - You should see "Success. No rows returned"

7. Enable Realtime:
   - Click "Database" > "Replication"
   - Find `bookmarks` in the list
   - Toggle "Enable Realtime" to ON

### 2. Google OAuth Setup (3 minutes)

1. Go to https://console.cloud.google.com
2. Create a new project (or use existing):
   - Click the project dropdown at the top
   - Click "New Project"
   - Name: `smart-bookmarks`
   - Click "Create"

3. Enable Google+ API:
   - Click the hamburger menu > "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click it and click "Enable"

4. Create OAuth credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth Client ID"
   - If prompted to configure consent screen:
     - User Type: External
     - Click "Create"
     - App name: `Smart Bookmarks`
     - User support email: (your email)
     - Click "Save and Continue" through the steps
   - Application type: `Web application`
   - Name: `Smart Bookmarks`
   - Authorized redirect URIs: Click "Add URI" and add:
     - `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
     - Replace `YOUR-PROJECT` with your actual Supabase project reference
   - Click "Create"
   - **SAVE** the Client ID and Client Secret

5. Configure in Supabase:
   - Go back to your Supabase project
   - Click "Authentication" > "Providers"
   - Scroll to "Google" and toggle it ON
   - Paste your Client ID and Client Secret
   - Click "Save"

### 3. Local Development (2 minutes)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` with your credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. Configure redirect for local dev:
   - In Supabase: Authentication > URL Configuration
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

5. Start the dev server:
   ```bash
   npm run dev
   ```

6. Open http://localhost:3000

## Testing

1. Click "Sign in with Google"
2. Authorize the app
3. You should see the bookmarks page
4. Add a bookmark
5. Open another tab to http://localhost:3000/bookmarks
6. Add/delete bookmarks in one tab and watch them update in the other!

## Troubleshooting

### "Invalid OAuth redirect URI"
- Make sure you added the correct redirect URI in Google Cloud Console
- Format: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
- Make sure you saved the changes

### "Failed to add bookmark"
- Check browser console for errors
- Verify RLS policies were created (run schema.sql again if needed)
- Check Supabase logs: Dashboard > Logs > API Logs

### Real-time not working
- Verify "Enable Realtime" is toggled ON for bookmarks table
- Check Database > Replication in Supabase
- Open browser console and look for WebSocket connection errors

### Environment variables not found
- Make sure `.env` file is in the root directory
- Restart the dev server after changing `.env`
- Variables must start with `NEXT_PUBLIC_` to be available in the browser

## Next Steps

- Read the full README.md for architecture details
- Deploy to Vercel (see DEPLOYMENT.md)
- Customize the UI with Tailwind classes
- Add new features!

## Need Help?

Open an issue on GitHub with:
- What you're trying to do
- What error you're seeing
- Screenshots if applicable
