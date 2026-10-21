# OG Engine website

The home URL serves the approved minimal launch page from `public/launch/` through
a `beforeFiles` rewrite in `next.config.ts`. Existing application routes and the
previous homepage source remain available in the repository. Remove that rewrite
to restore the previous homepage. No dependencies were added for the launch page.

## Launch page handoff

- Run `npm ci`, then `npm run dev`; open http://localhost:3000.
- Run `npm run build` and `npm start` for a production preview.
- Edit `public/launch/index.html` and `styles.css` for copy and presentation.
- Set contact and social destinations in `public/launch/config.js` when ready.
- The waitlist is intentionally unconnected and collects no data. Integration
  details are in `public/launch/README.md`.
- Deploy with the repository's existing Next.js hosting setup. This change does
  not create a deployment or alter hosting settings.
- The page uses `/launch/` asset URLs for the Next.js root rewrite. When serving
  it separately, preserve that URL prefix or change those URLs to relative paths.

## Framework

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
