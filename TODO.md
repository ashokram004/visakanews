# TODO: Implement coverImage fetching for individual profile page

- [x] Update fetch URL in `app/profiles/[slug]/page.tsx` to populate coverImage from Strapi
- [x] Update Profile type in `app/profiles/[slug]/ProfileTabs.tsx` to include coverImage
- [x] Replace cover image placeholder in `ProfileTabs.tsx` with fetched coverImage
- [x] Update `.cover-image` CSS in `app/globals.css` to fit image within bounds (add object-fit: cover and height)
- [x] Test the implementation on the profile page
