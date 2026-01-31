# TODO: Fix Social Media Icons

- [x] Replace GmailIcon SVG with a simple mail/envelope icon in components/FooterIcons.tsx
- [x] Update hover background color in app/globals.css from red to light gray (#e0e0e0)
- [x] Fix Gmail link to mailto:visakanews@gmail.com and update aria-label in app/page.tsx
- [x] Update WhatsApp link to https://wa.me/918247829025 and correct aria-label in app/page.tsx
- [x] Test the changes to ensure icons display correctly and links work

# TODO: Add Latest News Section to Article Page

- [x] Add section after bottom ad in app/news/[slug]/page.tsx
- [x] Fetch latest 6 articles and exclude current article if in top 5
- [x] Display 5 news items with thumbnails, titles, and dates
- [x] Add "More" button linking to /news
- [x] Add CSS styles for the new section in app/globals.css
