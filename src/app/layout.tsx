import type { Metadata } from "next";

// The home page is the static file public/launch/index.html, served at "/" by the
// rewrite in next.config.ts (and vercel.json). This layout only wraps Next.js's own
// pages, such as the 404 page.
export const metadata: Metadata = {
  title: "OG Engine",
  metadataBase: new URL("https://ogengine.co"),
  icons: { icon: "/og-favicon.svg", apple: "/launch/assets/apple-touch-icon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0a0807", color: "#f7f2ec", fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
