# OG Engine launch page

The site's home page. Next.js serves it at `/` through a rewrite (see the root README).

## Files

- `index.html`: page content.
- `styles.css`: desktop and mobile layout.
- `script.js`: menu, hero halftone shader, dot artwork, the looping principles row,
  the MOSS selector and the waitlist form.
- `assets/Montserrat-Variable.woff2`: the page typeface, self-hosted (SIL Open Font License).
- `assets/og-logo-white.svg`: the flat white OG Engine logo (shown black on the open white menu).
- `assets/favicon.ico`, `apple-touch-icon.png`, `og-image.png`: icons and the share image.

## Waitlist

The form posts to `/api/waitlist` and only shows its success line once the server
answers with a success status. On failure it keeps the email in the field and says so.
The hidden `website` field is a basic spam trap.
