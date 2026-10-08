"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { categoryContent, CategorySlug } from "@/lib/categoryContent";

const categoryLinks: { label: string; slug: CategorySlug }[] = [
  { label: "Events", slug: "events" },
  { label: "Media", slug: "media" },
  { label: "Influencer Marketing", slug: "influencer-marketing" },
];

export default function CategoryPage() {
  const params = useParams<{ category: string }>();
  const slug = params.category as CategorySlug;
  const content = categoryContent[slug];
  const [activeTag, setActiveTag] = useState("Everything");

  if (!content) notFound();

  const tags = [
    "Everything",
    ...Array.from(new Set(content.projects.flatMap((project) => project.tags))),
  ];
  const projects =
    activeTag === "Everything"
      ? content.projects
      : content.projects.filter((project) => project.tags.includes(activeTag));

  return (
    <main className="min-h-screen bg-[#fbfbfa] text-[#111]">
      <header className="border-b border-black/10 bg-[#fbfbfa]">
        <div className="container flex items-center justify-between py-6">
          <Link href="/" className="relative block h-10 w-24">
            <Image
              src="/og-logo-amber.png"
              alt="OG Engine"
              fill
              sizes="96px"
              className="object-contain object-left"
              priority
            />
          </Link>
          <Link
            href="/#footer"
            className="bg-[#C98A2E] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-white transition-colors hover:bg-black"
          >
            Book a call
          </Link>
        </div>
      </header>

      <section className="container pb-14 pt-20 md:pb-20 md:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.28em] text-[#C98A2E]">
            Our work / {content.label}
          </p>
          <h1 className="font-heading text-[clamp(3rem,8vw,7rem)] leading-[0.9] tracking-[-0.04em]">
            {content.title}
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-base leading-7 text-black/60 md:text-lg">
            {content.description}
          </p>
        </div>

        <nav className="mt-20 flex flex-wrap justify-center gap-x-8 gap-y-4 border-y border-black/10 py-5 md:justify-between md:gap-4">
          {categoryLinks.map((link) => (
            <Link
              key={link.slug}
              href={`/${link.slug}`}
              className={`font-mono text-[10px] uppercase tracking-[0.12em] transition-colors hover:text-[#C98A2E] ${link.slug === slug ? "text-[#C98A2E]" : "text-black/55"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-10 flex items-center gap-3 overflow-x-auto pb-2">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              className={`shrink-0 border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${activeTag === tag ? "border-black bg-black text-white" : "border-black/15 bg-transparent text-black/60 hover:border-black"}`}
            >
              {tag}
            </button>
          ))}
          <ChevronDown className="ml-auto hidden shrink-0 md:block" size={16} />
        </div>

        <div className="mt-12 grid gap-x-5 gap-y-14 sm:grid-cols-2">
          {projects.map((project) => (
            <article
              key={`${project.title}-${project.client}`}
              className="group"
            >
              <div className="relative aspect-[1.55] overflow-hidden bg-black/5">
                {project.media.type === "youtube" ? (
                  project.media.videoId ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${project.media.videoId}?rel=0`}
                      title={project.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full border-0"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-black px-6 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-white/70">
                      Add the YouTube video ID in categoryContent.ts
                    </div>
                  )
                ) : (
                  <Image
                    src={project.media.src}
                    alt={project.title}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="pointer-events-none absolute inset-0 bg-black/5 transition-colors group-hover:bg-transparent" />
                <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center bg-white text-black opacity-0 transition-opacity group-hover:opacity-100">
                  <ArrowUpRight size={18} />
                </span>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-black/15 py-5">
                <div>
                  <h2 className="font-heading text-2xl leading-none md:text-3xl">
                    {project.title}
                  </h2>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-black/50">
                    {project.client}
                  </p>
                  <p className="mt-4 max-w-sm text-sm leading-6 text-black/60">
                    {project.description}
                  </p>
                </div>
                <span className="pt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#d9264f]">
                  View
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-24 flex flex-col items-start justify-between gap-6 border-t border-black/10 pt-8 md:flex-row md:items-center">
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-[0.12em] underline underline-offset-4"
          >
            Back to OG Engine
          </Link>
        </div>
      </section>
    </main>
  );
}
