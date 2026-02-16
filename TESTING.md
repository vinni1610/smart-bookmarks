# Testing & Validation Guide

Comprehensive guide to test all features of Smart Bookmarks.

## Manual Testing Checklist

### 1. Authentication Testing

#### Test: Google Sign In
- [ ] Navigate to home page (`/`)
- [ ] Click "Sign in with Google"
- [ ] Google OAuth consent screen appears
- [ ] Select Google account
- [ ] Redirected to `/bookmarks` page
- [ ] User email shows in header
- [ ] No errors in browser console

#### Test: Protected Routes
- [ ] Sign out
- [ ] Try to access `/bookmarks` directly
- [ ] Should redirect to `/` (home page)
- [ ] Sign in again
- [ ] Can access `/bookmarks`

#### Test: Sign Out
- [ ] Click "Sign Out" in header
- [ ] Redirected to home page
- [ ] Cannot access `/bookmarks` without signing in again

### 2. Bookmark Operations Testing

#### Test: Add Bookmark (Valid)
- [ ] Enter title: "Google"
- [ ] Enter URL: "https://google.com"
- [ ] Click "Add Bookmark"
- [ ] Loading spinner appears
- [ ] Bookmark appears at top of list
- [ ] Form clears after submission
- [ ] No error messages

#### Test: Add Bookmark (Invalid URL)
- [ ] Enter title: "Test"
- [ ] Enter invalid URL: "not-a-url"
- [ ] Click "Add Bookmark"
- [ ] Error message appears: "Invalid URL format"
- [ ] Bookmark is NOT added to list

#### Test: Add Bookmark (Empty Fields)
- [ ] Leave title empty
- [ ] Enter URL
- [ ] Try to submit
- [ ] HTML5 validation prevents submission
- [ ] Repeat for empty URL

#### Test: Delete Bookmark
- [ ] Click trash icon on a bookmark
- [ ] Loading spinner appears on that button
- [ ] Bookmark disappears from list
- [ ] Count updates in header
- [ ] No error messages

### 3. Real-time Sync Testing

#### Test: Real-time Add
- [ ] Open `/bookmarks` in Tab 1
- [ ] Open `/bookmarks` in Tab 2 (same browser)
- [ ] In Tab 1: Add a bookmark
- [ ] In Tab 2: Bookmark appears instantly (no refresh needed)
- [ ] Timestamp is correct

#### Test: Real-time Delete
- [ ] With both tabs open
- [ ] In Tab 2: Delete a bookmark
- [ ] In Tab 1: Bookmark disappears instantly
- [ ] Count updates in both tabs

#### Test: Cross-Browser Real-time
- [ ] Open app in Chrome
- [ ] Open app in Firefox/Safari (sign in with same account)
- [ ] Add bookmark in Chrome
- [ ] Verify it appears in Firefox/Safari
- [ ] Delete in Firefox/Safari
- [ ] Verify it disappears in Chrome

#### Test: Real-time Across Devices
- [ ] Sign in on desktop
- [ ] Sign in on mobile (same account)
- [ ] Add bookmark on desktop
- [ ] Verify it appears on mobile
- [ ] Delete on mobile
- [ ] Verify it disappears on desktop

### 4. Privacy & Security Testing

#### Test: User Isolation
- [ ] Sign in as User A
- [ ] Add several bookmarks
- [ ] Note the bookmark IDs (from browser DevTools > Network)
- [ ] Sign out
- [ ] Sign in as User B (different Google account)
- [ ] Verify User B sees ZERO bookmarks
- [ ] Try to query User A's bookmarks (using DevTools console):
  ```javascript
  const supabase = createClient()
  const { data } = await supabase.from('bookmarks').select('*')
  console.log(data) // Should only show User B's bookmarks
  ```
- [ ] Verify RLS is working (User B cannot see User A's data)

#### Test: RLS Bypass Attempt
Open browser console and try:
```javascript
// Get Supabase client
const { createClient } = window.supabase

// Try to insert bookmark for another user (should fail)
const { data, error } = await supabase
  .from('bookmarks')
  .insert({ 
    user_id: 'some-other-user-id',
    url: 'https://evil.com',
    title: 'Hacked'
  })

console.log(error) // Should see RLS policy violation
```
- [ ] Verify insertion fails
- [ ] Error message relates to RLS policy

### 5. UI/UX Testing

#### Test: Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] Verify layout adapts properly
- [ ] No horizontal scroll
- [ ] Forms are usable on all screen sizes

#### Test: Empty State
- [ ] Sign in with new account (no bookmarks)
- [ ] Verify empty state message shows
- [ ] Message reads: "No bookmarks" with helpful text
- [ ] Icon displays correctly

#### Test: Loading States
- [ ] Add bookmark - verify loading spinner
- [ ] Delete bookmark - verify loading spinner on that item only
- [ ] Other bookmarks remain clickable during delete

#### Test: URL Display
- [ ] Add bookmark with long URL
- [ ] Verify URL truncates with ellipsis
- [ ] URL is clickable
- [ ] Opens in new tab (`target="_blank"`)
- [ ] Has `rel="noopener noreferrer"` for security

#### Test: Date Formatting
- [ ] Add bookmark
- [ ] Verify date shows in format: "Jan 15, 2024, 2:30 PM"
- [ ] Date is in user's timezone

### 6. Error Handling Testing

#### Test: Network Failure
- [ ] Open DevTools > Network tab
- [ ] Set to "Offline"
- [ ] Try to add bookmark
- [ ] Verify error message shows
- [ ] Re-enable network
- [ ] Try again - should work

#### Test: Supabase Service Unavailable
This is hard to test, but you can:
- [ ] Use invalid Supabase URL in `.env`
- [ ] Restart dev server
- [ ] Try to sign in
- [ ] Verify error page shows
- [ ] Restore correct URL

#### Test: Invalid Session
- [ ] Sign in
- [ ] In Supabase dashboard, go to Authentication > Users
- [ ] Delete your user
- [ ] Try to add bookmark
- [ ] Should get authentication error
- [ ] Verify graceful error handling

### 7. Browser Compatibility

#### Test in Multiple Browsers
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest, macOS/iOS)
- [ ] Verify all features work
- [ ] Check console for errors

#### Test: Cookies Enabled
- [ ] Disable cookies
- [ ] Try to sign in
- [ ] Verify error or warning
- [ ] Enable cookies
- [ ] Sign in should work

### 8. Performance Testing

#### Test: Large Dataset
- [ ] Add 50+ bookmarks
- [ ] Verify page loads quickly
- [ ] Scrolling is smooth
- [ ] Real-time updates still work
- [ ] No noticeable lag

#### Test: Concurrent Operations
- [ ] Open 3 tabs
- [ ] Rapidly add/delete bookmarks in all tabs
- [ ] Verify all tabs stay in sync
- [ ] No duplicate bookmarks appear
- [ ] No bookmarks get "stuck"

## Automated Testing (Future)

### Unit Tests (with Vitest)

```typescript
// Example test structure
describe('addBookmark', () => {
  it('should add valid bookmark', async () => {
    const formData = new FormData()
    formData.append('url', 'https://example.com')
    formData.append('title', 'Example')
    
    const result = await addBookmark(formData)
    expect(result.success).toBe(true)
  })

  it('should reject invalid URL', async () => {
    const formData = new FormData()
    formData.append('url', 'not-a-url')
    formData.append('title', 'Example')
    
    const result = await addBookmark(formData)
    expect(result.error).toBe('Invalid URL format')
  })
})
```

### Integration Tests (with Playwright)

```typescript
// Example test structure
test('user can add and delete bookmark', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Sign in with Google')
  // ... handle OAuth
  
  await page.fill('input[name="title"]', 'Test Bookmark')
  await page.fill('input[name="url"]', 'https://test.com')
  await page.click('button:has-text("Add Bookmark")')
  
  await expect(page.locator('text=Test Bookmark')).toBeVisible()
  
  await page.click('button[aria-label="Delete bookmark"]')
  await expect(page.locator('text=Test Bookmark')).not.toBeVisible()
})
```

## Database Testing

### Test RLS Policies Directly

Connect to Supabase SQL Editor and run:

```sql
-- Test as authenticated user
SELECT * FROM bookmarks; -- Should only return your bookmarks

-- Try to insert for another user (should fail)
INSERT INTO bookmarks (user_id, url, title)
VALUES ('00000000-0000-0000-0000-000000000000', 'https://test.com', 'Test');
-- Error: new row violates row-level security policy

-- Try to delete another user's bookmark (should affect 0 rows)
DELETE FROM bookmarks WHERE user_id != auth.uid();
-- Returns: 0 rows affected

-- Verify realtime is enabled
SELECT schemaname, tablename, 
       CASE WHEN tablename IN (
         SELECT tablename FROM pg_publication_tables 
         WHERE pubname = 'supabase_realtime'
       ) THEN 'enabled' ELSE 'disabled' END as realtime_status
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'bookmarks';
-- Should show: enabled
```

## Production Testing

### Pre-Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] Google OAuth redirect URIs include production URL
- [ ] Supabase redirect URLs include production URL
- [ ] Site URL set to production domain in Supabase
- [ ] Database schema applied successfully
- [ ] RLS policies enabled
- [ ] Realtime enabled on bookmarks table

### Post-Deployment Testing

- [ ] Visit production URL
- [ ] Sign in with Google
- [ ] Add bookmark
- [ ] Delete bookmark
- [ ] Test in 2+ browsers
- [ ] Test on mobile device
- [ ] Check Vercel logs for errors
- [ ] Check Supabase logs for errors
- [ ] Verify HTTPS on all pages
- [ ] Test real-time sync on production

## Monitoring & Debugging

### Check Vercel Logs
```bash
# Install Vercel CLI
npm i -g vercel

# View logs
vercel logs [deployment-url]
```

### Check Supabase Logs
- Dashboard > Logs > API Logs
- Filter by time range
- Look for 400/500 errors

### Browser DevTools
- Network tab: Check API calls to Supabase
- Console: Check for JavaScript errors
- Application > Storage: Check cookies/localStorage

### Common Issues

**"Invalid OAuth redirect URI"**
→ Check Google Cloud Console and Supabase redirect URLs match

**Bookmarks not appearing**
→ Check RLS policies, verify user is authenticated

**Real-time not working**
→ Check if realtime is enabled, check WebSocket connection in DevTools

**"Failed to add bookmark"**
→ Check URL format, verify user has valid session

## Load Testing

For production apps with many users:

```bash
# Install Apache Bench
brew install ab  # macOS
apt-get install apache2-utils  # Ubuntu

# Test endpoint
ab -n 100 -c 10 https://your-app.vercel.app/
```

Analyze:
- Requests per second
- Time per request
- Connection times
- Failed requests (should be 0)

## Security Testing

### OWASP Top 10 Checklist

- [x] SQL Injection: Protected by Supabase RLS and parameterized queries
- [x] Broken Authentication: Using Supabase Auth with Google OAuth
- [x] Sensitive Data Exposure: RLS ensures data isolation
- [x] XML External Entities: Not applicable (no XML processing)
- [x] Broken Access Control: RLS enforces access control
- [x] Security Misconfiguration: Following best practices
- [x] XSS: React escapes output by default
- [x] Insecure Deserialization: Not applicable
- [x] Using Components with Known Vulnerabilities: Keep dependencies updated
- [x] Insufficient Logging: Vercel and Supabase provide logs

## User Acceptance Testing (UAT)

### Test Scenarios

**Scenario 1: New User Onboarding**
1. New user visits site
2. Signs in with Google
3. Sees empty state
4. Adds first bookmark
5. Sees bookmark in list
✓ Success criteria: Smooth flow, clear UI, no confusion

**Scenario 2: Power User**
1. User with 20+ bookmarks signs in
2. Quickly scans list
3. Adds new bookmark
4. Deletes old bookmark
5. Everything stays fast
✓ Success criteria: No performance degradation

**Scenario 3: Multi-device User**
1. Adds bookmark on desktop
2. Opens app on phone
3. Sees bookmark immediately
4. Deletes on phone
5. Checks desktop - gone
✓ Success criteria: Real-time sync works flawlessly

## Conclusion

Regular testing ensures:
- Features work as expected
- Security is maintained
- User experience is smooth
- Real-time sync is reliable
- Data privacy is enforced

Run through this checklist before every deployment and when making significant changes.
