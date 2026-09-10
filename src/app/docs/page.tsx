import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs | OG Engine",
  description: "OG Engine documentation is coming soon.",
};

export default function DocsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center text-black">
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-zinc-500">
        OG Engine Documentation
      </p>
      <h1 className="font-heading text-[clamp(3rem,10vw,8rem)] font-black uppercase leading-[0.85]">
        Coming Soon
      </h1>
      <a
        href="/"
        className="mt-10 border border-black px-6 py-3 font-mono text-xs uppercase tracking-widest transition-colors hover:bg-black hover:text-white"
      >
        Back Home
      </a>
    </main>
  );
}
