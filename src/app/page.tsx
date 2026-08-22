"use client";

import CardNav from "@/components/CardNav";
import Marquee from "@/components/Marque";
import dynamic from "next/dynamic";

import Intro from "@/components/NeoBrutalist/Intro";
import WorkGallery from "@/components/NeoBrutalist/WorkGallery";
import Manifesto from "@/components/NeoBrutalist/Manifesto";
import Services from "@/components/NeoBrutalist/Services";
import StackCards from "@/components/NeoBrutalist/StackCards";

const Main = dynamic(
  () => import("@/components/Main").then((mod) => mod.Main),
  {
    ssr: false,
  },
);

const logoPath = "/og.png";

const navItems = [
  {
    label: "AI Lead Gen",
    bgColor: "#1c1917",
    textColor: "#ffffff",
    links: [
      { label: "B2B Lead Scraper", href: "#contact" },
      { label: "Smart Verification", href: "#contact" },
      { label: "Intent Data Tracker", href: "#contact" },
    ],
  },
  {
    label: "AI Sales Automation",
    bgColor: "#09090b",
    textColor: "#ffffff",
    links: [
      { label: "Multi-channel Outreach", href: "#contact" },
      { label: "AI Dialers & Senders", href: "#contact" },
      { label: "CRM Copilot Integration", href: "#contact" },
    ],
  },
  {
    label: "SMM Automation",
    bgColor: "#27272a",
    textColor: "#ffffff",
    links: [
      { label: "Creative & Copy Gen", href: "#contact" },
      { label: "Auto-Pilot Poster", href: "#contact" },
      { label: "Community Growth AI", href: "#contact" },
    ],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-zinc-800 relative">
      <div className="noise-overlay"></div>

      <section className="relative min-h-screen flex flex-col justify-between overflow-hidden px-6 lg:px-8 bg-black">
        <div className="absolute inset-0 z-0 w-full h-full">
          <Main />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-black/10 to-black/35 pointer-events-none" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-between w-full pointer-events-none">
          <div className="pointer-events-auto">
            <CardNav
              logo={logoPath}
              logoAlt="OGengine"
              items={navItems}
              baseColor="#000000"
              menuColor="#a1a1aa"
              buttonBgColor="#ffffff"
              buttonTextColor="#000000"
              onCtaClick={() => {
                const contactSection = document.getElementById("contact");
                contactSection?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          </div>

          <div className="flex-1 flex items-center justify-between w-full px-4 lg:px-6 pointer-events-none select-none">
            <div className="flex flex-col items-center gap-2 md:gap-4 text-[10px] md:text-xs font-mono text-[#a1a1aa] tracking-widest pointer-events-auto absolute md:relative top-1/2 md:top-auto -translate-y-1/2 md:translate-y-0 left-6 md:left-auto">
              <span className="text-[#ffffff] font-bold">01</span>
              <div className="w-[1px] h-16 md:h-32 bg-zinc-800 relative">
                <div className="absolute top-1 md:top-2 left-1/2 -translate-x-1/2 w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-white" />
              </div>
              <span>06</span>
            </div>

            <div className="flex flex-col items-start gap-3 md:gap-5 text-[8px] sm:text-[10px] md:text-xs font-mono tracking-widest text-[#a1a1aa] absolute md:relative top-28 md:top-auto right-6 md:right-auto">
              <div className="flex items-center gap-2 md:gap-3">
                <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-white inline-block" />
                <span>ENGINE v1.0.0</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-white inline-block" />
                <span>RENDERER WEBGPU</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-white inline-block" />
                <span>PLATFORM WEB</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-white inline-block" />
                <span>STATUS STABLE</span>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col md:flex-row items-center justify-center md:justify-between px-6 lg:px-8 pb-8 md:pb-12 pointer-events-none select-none gap-4 md:gap-0">
            <div
              className="flex flex-col items-start gap-1 md:gap-2 text-[9px] md:text-xs font-mono text-[#a1a1aa] tracking-widest cursor-pointer pointer-events-auto hover:text-white transition-colors duration-200 absolute md:relative bottom-24 md:bottom-auto left-6 md:left-auto"
              onClick={() => {
                const introSection = document.getElementById("contact");
                introSection?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span>SCROLL TO EXPLORE</span>
              <svg
                className="w-3 h-3 md:w-4 md:h-4 text-[#a1a1aa] animate-bounce mt-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>

            <div className="hidden md:flex flex-col items-center justify-center pointer-events-auto">
              <div className="w-6 h-10 rounded-full border border-zinc-700 flex justify-center p-1.5">
                <div className="w-1 h-2 rounded-full bg-white animate-scroll-wheel" />
              </div>
            </div>

            <a
              href="https://github.com/AbhishekChoudharyy/OGengine"
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto flex items-center gap-2 px-6 py-3 border border-zinc-800 bg-[#050505]/60 backdrop-blur-md text-xs font-mono text-white tracking-widest hover:bg-white hover:text-black hover:border-white transition-all duration-300 rounded-none uppercase absolute md:relative bottom-24 md:bottom-auto right-6 md:right-auto"
            >
              <span>DOCS ↗</span>
            </a>
          </div>
        </div>
      </section>

      <Marquee />
      <Intro />
      <Services />
      <Manifesto />
      <WorkGallery />
      <StackCards />
    </div>
  );
}
