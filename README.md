# OG Engine website

The site is one static page, `public/launch/index.html`, hosted by a small Next.js app.

- `/` is served from `public/launch/index.html` by a rewrite in `next.config.ts`
  (and the same rewrite in `vercel.json`).
- `/api/waitlist` (`src/app/api/waitlist/route.ts`) receives the waitlist form and saves
  the email to Supabase. It needs `SUPABASE_URL` and `SUPABASE_SECRET_KEY` in the environment.
- `/portfolio` is rewritten to the separate portfolio site in `vercel.json`.
- `src/app/layout.tsx` only wraps Next.js's own pages, such as the 404 page.

## Run it

```bash
npm ci
npm run dev        # http://localhost:3000
npm run build && npm start   # production preview
```

## Edit the page

- Copy and structure: `public/launch/index.html`
- Styles: `public/launch/styles.css`
- Behaviour (menu, hero halftone, card loop, MOSS selector, form): `public/launch/script.js`

Asset URLs start with `/launch/`; keep that prefix, or change them to relative paths
if the page is ever served on its own.
