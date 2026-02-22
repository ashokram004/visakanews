# Profile URL Change - TODO

## Task
Change profile URLs from `/profiles/name` to `/name` while keeping profile pages completely separate from main header/nav.

## Steps:
- [x] 1. Create new root-level route structure at `frontend/app/[slug]/`
- [x] 2. Create ProfileTabs.tsx in new location with updated links
- [x] 3. Create page.tsx (home tab) in new location
- [x] 4. Create achievements/page.tsx in new location
- [x] 5. Create activities/page.tsx in new location  
- [x] 6. Create videos/page.tsx in new location
- [x] 7. Create loading.tsx in new location
- [x] 8. Update AppShell.tsx to detect root-level profile pages
- [x] 9. Update profiles list page.tsx to use new URLs
- [x] 10. Delete old profiles route directory

## Summary of Changes Made:
1. **New root-level route**: Created `frontend/app/[slug]/` with:
   - `ProfileTabs.tsx` - Updated tab links to use `/${slug}` instead of `/profiles/${slug}`
   - `layout.tsx` - Layout with ProfileTabs wrapper
   - `page.tsx` - Home tab content
   - `loading.tsx` - Loading state
   - `achievements/page.tsx` - Achievements tab
   - `activities/page.tsx` - Activities tab  
   - `videos/page.tsx` - Videos tab

2. **AppShell.tsx**: Updated to detect root-level profile pages (e.g., `/name`) by checking against top-level routes list

3. **profiles/page.tsx**: Updated links from `/profiles/${profile.slug}` to `/${profile.slug}`

4. **Old route removed**: Deleted `frontend/app/profiles/[slug]/`

## New URL Structure:
- Old: `domain/profiles/name`
- New: `domain/name`

- Old: `domain/profiles/name/achievements`
- New: `domain/name/achievements`

- Old: `domain/profiles/name/activities`
- New: `domain/name/activities`

- Old: `domain/profiles/name/videos`
- New: `domain/name/videos`

## SPA Behavior:
- Profile tabs use Next.js `Link` component for client-side navigation
- No page refresh when switching between profile tabs
- Profile pages render without main header/nav (handled by AppShell)
