# OG Engine

A standalone, responsive landing page matching the supplied design reference.
No framework, build tools, external fonts, third-party scripts, or ChatGPT Sites services are required.

## Preview

From the repository root, run `npm ci` and `npm run dev`, then open
http://localhost:3000. Next.js serves this page at `/` using a rewrite.
Asset URLs use the `/launch/` prefix; preserve that prefix when hosting separately
or change the URLs in `index.html` to relative paths for a standalone copy.

## Files

- `index.html`: page content and accessible dialogs.
- `styles.css`: desktop and mobile layout.
- `script.js`: navigation setup, dialogs, optional waitlist submission.
- `config.js`: editable destinations and optional signup endpoint.
- `assets/og-logo.png`: the original supplied OG Engine logo.

## Add links later

In `config.js`, replace each `null` with the appropriate quoted URL.
The `contact` destination is shared by the header and footer.
Unconfigured links have no `href` and are marked `aria-disabled`.
They are deliberately not connected to guessed accounts or phone numbers.

## Connect signup

Until `waitlistEndpoint` is configured, “Join us” opens a truthful “waitlist will open soon” message and collects no email addresses.

To enable signup, set `waitlistEndpoint` to your own server route. The form sends
`POST` JSON `{ "email": "...", "website": "" }`. Return a successful HTTP status
only when the request has been accepted, or a non-success status with
`{ "error": "A useful message" }`. Validate and rate-limit requests on your server.
The hidden `website` field is a basic spam trap. Add the appropriate privacy
notice before collecting personal information.

No backend or database is bundled. The old Sites waitlist service is not used.

## Design

The original static gold logo is reused, with a dark treatment in the header.
The reference's headline, two actions, arches, dot field, and footer are preserved.
The layout adapts to mobile without horizontal scrolling.
About and Join dialogs support Escape, focus containment, and focus restoration
through the browser's native dialog element. All visible copy is editable.
