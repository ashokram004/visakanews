# Analytics Integration TODO

- [x] Edit components/AppShell.tsx: Import trackPageView, add useEffect for basic page view tracking on pathname changes, determine pageType, set articleId and profileId to undefined.
- [x] Edit app/news/[slug]/page.tsx: Add trackPageView call after fetching article data with actual articleId.
- [x] Edit app/profiles/[slug]/page.tsx: Add trackPageView call after fetching profile data with actual profileId.
- [x] Test the site to ensure analytics are sent correctly (check console and network tab).
