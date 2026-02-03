# Flash News Sorting Implementation

- [x] Update FlashItem type in app/page.tsx to include order?: number and publishedAt: string
- [x] Modify Strapi fetch query to remove &sort=order:asc
- [x] Add sorting logic in app/page.tsx: sort items with order by order value, then items without order by publishedAt descending

# Profile Achievements Sorting Implementation

- [x] Update Achievement type in app/profiles/[slug]/achievements/page.tsx to include order?: number
- [x] Modify Strapi fetch query to remove &sort=order:asc
- [x] Add sorting logic: sort items with order by order value, then items without order by year descending
