# Deployment Guide

Deploy Smart Bookmarks to Vercel in production.

## Prerequisites

- Completed local setup (see QUICKSTART.md)
- GitHub account
- Vercel account (free tier is fine)

## Step 1: Prepare for Deployment

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Repository name: `smart-bookmarks`
   - Visibility: Public or Private (your choice)
   - Click "Create repository"

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/smart-bookmarks.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

1. **Connect to Vercel**:
   - Go to https://vercel.com
   - Sign in with GitHub
   - Click "Add New Project"
   - Select your `smart-bookmarks` repository

2. **Configure Project**:
   - Framework Preset: `Next.js` (auto-detected)
   - Root Directory: `./` (leave as default)
   - Build Command: (leave default)
   - Output Directory: (leave default)

3. **Add Environment Variables**:
   Click "Environment Variables" and add:
   
   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |

   Make sure to add these for **Production**, **Preview**, and **Development** environments.

4. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes for the build to complete
   - Vercel will give you a URL like: `https://smart-bookmarks-xxx.vercel.app`

## Step 3: Update OAuth Configuration

After deployment, you need to update redirect URLs.

### Update Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to "APIs & Services" > "Credentials"
4. Click your OAuth Client ID
5. Under "Authorized redirect URIs", add:
   - `https://<your-project>.supabase.co/auth/v1/callback` (should already exist)
6. Click "Save"

### Update Supabase Configuration

1. Go to your Supabase project dashboard
2. Navigate to "Authentication" > "URL Configuration"
3. Update the following:

   **Site URL**: `https://your-app.vercel.app`
   
   **Redirect URLs**: Add these (keep existing ones):
   - `https://your-app.vercel.app/auth/callback`
   - `https://your-app.vercel.app/**` (wildcard for preview deployments)
   
4. Click "Save"

## Step 4: Test Production

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Click "Sign in with Google"
3. Authorize the application
4. You should be redirected to `/bookmarks`
5. Test adding/deleting bookmarks
6. Open in another tab/browser to verify real-time sync

## Step 5: Custom Domain (Optional)

### Add Custom Domain to Vercel

1. In Vercel project settings, go to "Domains"
2. Click "Add"
3. Enter your domain (e.g., `bookmarks.yourdomain.com`)
4. Follow Vercel's instructions to configure DNS

### Update Supabase for Custom Domain

1. In Supabase: Authentication > URL Configuration
2. Update Site URL to your custom domain
3. Add redirect URL: `https://yourdomain.com/auth/callback`

### Update Google OAuth (if using custom domain)

Google OAuth allows wildcards, but if you want to be explicit:
1. Add your custom domain to Authorized redirect URIs
2. Format: `https://yourdomain.com` (authorized domain)

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Vercel automatically builds and deploys
```

## Environment Variables Updates

To update environment variables in production:

1. Go to Vercel project > Settings > Environment Variables
2. Edit the variable
3. Click "Save"
4. Trigger a redeploy:
   - Go to Deployments
   - Click "..." on latest deployment
   - Click "Redeploy"

## Vercel Preview Deployments

Every branch push creates a preview deployment:

1. Create a new branch:
   ```bash
   git checkout -b feature/new-feature
   ```

2. Make changes and push:
   ```bash
   git add .
   git commit -m "Add new feature"
   git push origin feature/new-feature
   ```

3. Vercel creates a preview URL like:
   `https://smart-bookmarks-git-feature-new-feature-username.vercel.app`

4. Test the preview before merging to main

## Monitoring

### Vercel Analytics

1. In Vercel project, go to "Analytics"
2. View page views, top pages, and performance metrics

### Supabase Logs

1. In Supabase, go to "Logs"
2. View API logs, database logs, and errors
3. Filter by date/time to debug issues

### Error Tracking

Errors are logged to:
- Vercel Runtime Logs (Settings > Functions)
- Browser Console (for client-side errors)
- Supabase API Logs

## Performance Optimization

### Enable Vercel Analytics

```bash
npm install @vercel/analytics
```

Update `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Enable Vercel Speed Insights

```bash
npm install @vercel/speed-insights
```

Update `app/layout.tsx`:
```typescript
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

## Troubleshooting Deployment Issues

### Build Fails

Check Vercel build logs:
- Look for TypeScript errors
- Check for missing environment variables
- Verify dependencies in package.json

### OAuth Redirect Issues

Common problems:
1. Redirect URI mismatch → Update Google Console and Supabase
2. Site URL mismatch → Update Supabase URL Configuration
3. Wrong environment → Check environment variables in Vercel

### 404 on Refresh

This shouldn't happen with Next.js App Router, but if it does:
- Verify `next.config.js` doesn't have unusual configurations
- Check Vercel routing settings

### Real-time Not Working in Production

1. Check Supabase logs for WebSocket errors
2. Verify environment variables are correct
3. Test locally with production environment variables
4. Check browser console for connection errors

## Scaling Considerations

### Database Performance

- Add indexes for common queries (already done in schema.sql)
- Monitor query performance in Supabase
- Consider connection pooling for high traffic

### Supabase Limits (Free Tier)

- 500 MB database size
- 2 GB bandwidth
- 50,000 monthly active users
- Upgrade to Pro if you exceed these

### Vercel Limits (Hobby Tier)

- 100 GB bandwidth/month
- 100 GB-Hours serverless function execution
- Upgrade to Pro if needed

## Backup Strategy

### Database Backups

Supabase Pro includes daily backups. For free tier:

1. Use Supabase CLI to backup:
   ```bash
   supabase db dump > backup.sql
   ```

2. Or export via SQL:
   ```sql
   COPY (SELECT * FROM bookmarks) TO 'bookmarks_backup.csv' CSV HEADER;
   ```

### Code Backups

GitHub serves as your code backup. Additionally:
- Tag releases: `git tag v1.0.0`
- Create GitHub releases for major versions

## Production Checklist

- [ ] Environment variables set in Vercel
- [ ] Google OAuth redirect URIs updated
- [ ] Supabase Site URL and Redirect URLs configured
- [ ] Custom domain configured (if applicable)
- [ ] Analytics enabled
- [ ] Error tracking configured
- [ ] Database backups scheduled
- [ ] Tested sign-in flow in production
- [ ] Tested real-time sync in production
- [ ] Tested on mobile devices
- [ ] Verified HTTPS on all pages

## Security Checklist

- [ ] RLS policies enabled on all tables
- [ ] Environment variables not committed to Git
- [ ] Supabase anon key is public (by design, protected by RLS)
- [ ] HTTPS enforced (Vercel does this automatically)
- [ ] CSP headers configured (optional, for extra security)

## Next Steps

- Set up monitoring/alerting
- Configure custom error pages
- Add A/B testing
- Implement user feedback system
- Set up staging environment

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Supabase logs
3. Review this guide again
4. Open a GitHub issue with detailed error information
