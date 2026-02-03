# TODO: Update Achievements and Activities Pages for Image Rendering

## Tasks
- [x] Update `app/profiles/[slug]/achievements/page.tsx`:
  - Add `STRAPI_URL`, `getImageUrl`, and `renderContent` functions.
  - Replace plain text rendering of `a.description` with `renderContent(a.description)` in a `<div>`.
- [x] Update `app/profiles/[slug]/activities/page.tsx`:
  - Add `STRAPI_URL`, `getImageUrl`, and `renderContent` functions.
  - Replace plain text rendering of `a.description` with `renderContent(a.description)` in a `<div>`.
