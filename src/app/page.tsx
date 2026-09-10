"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Menu, Search, X } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);
import Marquee from "@/components/Marque";

import Intro from "@/components/NeoBrutalist/Intro";
import WorkGallery from "@/components/NeoBrutalist/WorkGallery";
import Process from "@/components/NeoBrutalist/Process";
import Manifesto from "@/components/NeoBrutalist/Manifesto";
import Team from "@/components/NeoBrutalist/Team";
import Services from "@/components/NeoBrutalist/Services";
import MarqueeSection from "@/components/NeoBrutalist/Marquee";
import Footer from "@/components/NeoBrutalist/Footer";

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const [mossOpen, setMossOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const topLogoRef = useRef<HTMLDivElement>(null);

  const bottomBarRef = useRef<HTMLDivElement>(null);

  // Mouse-tracking parallax — logo moves more, text moves less (depth layers)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    // Foreground logo — stronger parallax
    if (logoContainerRef.current) {
      gsap.to(logoContainerRef.current, {
        rotateY: x * 10,
        rotateX: -y * 7,
        x: x * 18,
        y: y * 12,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (logoContainerRef.current) {
      gsap.to(logoContainerRef.current, {
        rotateY: 0,
        rotateX: 0,
        x: 0,
        y: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)",
        overwrite: "auto",
      });
    }
  }, []);

  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;
    heroEl.addEventListener("mousemove", handleMouseMove);
    heroEl.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      heroEl.removeEventListener("mousemove", handleMouseMove);
      heroEl.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 2. OG Logo punches forward from depth
      tl.fromTo(
        logoContainerRef.current,
        { scale: 0.6, opacity: 0, rotateX: 15 },
        { scale: 1, opacity: 1, rotateX: 0, duration: 1.2, ease: "power4.out" },
        0.3,
      );

      // 3. Top logo fades in
      tl.fromTo(
        topLogoRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.4,
      );

      // 4. Bottom bar
      tl.fromTo(
        bottomBarRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        0.5,
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black selection:bg-zinc-200 relative">
      <div className="noise-overlay"></div>

      {/* SECTION 1: HERO */}
      <section
        ref={heroRef}
        className="relative min-h-[100svh] flex flex-col justify-between overflow-hidden bg-white md:min-h-screen"
      >
        <div className="relative w-full h-full min-h-[100svh] max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-5 sm:px-10 lg:px-16 xl:px-20 2xl:px-24 flex flex-col justify-between md:min-h-screen">
          {/* OG Logo */}
          <div
            className="absolute inset-x-0 top-[50%] z-[1] flex -translate-y-1/2 items-center justify-center pointer-events-none md:top-[47%] md:-translate-y-1/2"
            style={{ perspective: "1200px" }}
          >
            <div
              ref={logoContainerRef}
              className="hero-logo-container"
              style={{
                opacity: 0,
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
            >
              <img
                src="/og-logo-amber.png"
                alt="OG Engine"
                className="hero-logo"
                draggable={false}
              />
            </div>
          </div>

          {/* Content Wrapper */}
          <div className="relative z-10 flex-1 flex flex-col justify-between w-full pointer-events-none">
            {/* Compact mobile header */}
            <div className="relative flex justify-start pt-5 pointer-events-auto md:hidden">
              <button
                type="button"
                aria-label={
                  mobileMenuOpen ? "Close navigation" : "Open navigation"
                }
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="border border-black p-3 text-black"
              >
                <Menu size={20} />
              </button>
            </div>

            {/* Top Bar — left nav + center brand + right nav like SEROTONINN */}
            <div
              ref={topLogoRef}
              className="hidden items-start justify-between w-full pt-6 md:flex md:pt-8 pointer-events-auto"
              style={{ opacity: 0 }}
            >
              {/* Left Nav */}
              <nav className="flex-1 flex flex-col gap-1 text-[10px] sm:text-xs uppercase tracking-widest font-mono text-black">
                <a
                  href="#services"
                  className="hover:opacity-50 transition-opacity cursor-pointer"
                >
                  Events
                </a>
                <a
                  href="#work"
                  className="hover:opacity-50 transition-opacity cursor-pointer"
                >
                  Media
                </a>
                <a
                  href="#contact"
                  className="hover:opacity-50 transition-opacity cursor-pointer"
                >
                  Influencer Marketing
                </a>
              </nav>

              {/* Center Brand */}
              <Link
                href="/"
                className="text-base sm:text-lg md:text-xl tracking-[-0.02em] uppercase text-black cursor-pointer select-none no-underline"
                style={{ fontFamily: "'Geist Mono'", fontWeight: 200 }}
              >
                Organic Growth Engine
              </Link>

              {/* Right Nav */}
              <nav className="flex-1 flex flex-col items-end gap-1 text-[10px] sm:text-xs uppercase tracking-widest font-mono text-black">
                <a
                  href="#work"
                  className="hover:opacity-50 transition-opacity cursor-pointer"
                >
                  Tools
                </a>
                <a
                  href="#intro"
                  className="hover:opacity-50 transition-opacity cursor-pointer"
                >
                  About Us
                </a>
                <a
                  href="#footer"
                  className="hover:opacity-50 transition-opacity cursor-pointer"
                >
                  Contact Us
                </a>
              </nav>
            </div>

            {/* Big Editorial Text — Left Side (upper) */}
            <div className="hidden absolute left-6 sm:left-10 lg:left-16 xl:left-20 top-[24%] z-20 max-w-[180px] sm:max-w-[240px] md:max-w-[280px] lg:max-w-[320px] pointer-events-auto md:block">
              <h2
                className="text-[5vw] sm:text-[3.5vw] md:text-[2.8vw] lg:text-[clamp(1.4rem,2vw,2rem)] leading-[0.95] uppercase text-black flex flex-wrap"
                style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 400 }}
              >
                {["Young", "founders"].map((word, i) => (
                  <span key={i} className="editorial-word mr-[0.25em]">
                    {word}
                  </span>
                ))}
                {["building", "infra", "we", "wish", "existed"].map(
                  (word, i) => (
                    <span key={`plain-${i}`} className="mr-[0.25em]">
                      {word}
                    </span>
                  ),
                )}
              </h2>
            </div>

            {/* Big Editorial Text — Right Side (lower) */}
            <div className="hidden absolute right-6 sm:right-10 lg:right-16 xl:right-20 top-[68%] z-20 max-w-[200px] sm:max-w-[280px] md:max-w-[340px] lg:max-w-[360px] pointer-events-auto md:block">
              <h2
                className="text-[5vw] sm:text-[3.5vw] md:text-[2.8vw] lg:text-[clamp(1.4rem,2vw,2rem)] leading-[0.95] uppercase text-black flex flex-wrap justify-end"
                style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 400 }}
              >
                <span className="mr-[0.25em]">Full-stack</span>
                <span
                  className="editorial-word moss-trigger mr-[0.25em]"
                  onMouseEnter={() => setMossOpen(true)}
                  onMouseLeave={() => setMossOpen(false)}
                >
                  MOSS,
                </span>
                {["essentially", "autonomous"].map((word, i) => (
                  <span key={`plain-${i}`} className="mr-[0.25em]">
                    {word}
                  </span>
                ))}
              </h2>

              {/* MOSS Tooltip — positioned relative to the outer div */}
              <div
                className={`moss-tooltip ${mossOpen ? "moss-tooltip--visible" : ""}`}
                onMouseEnter={() => setMossOpen(true)}
                onMouseLeave={() => setMossOpen(false)}
              >
                <div className="moss-tooltip__label">
                  <span className="moss-tooltip__letter">M</span>arketing
                </div>
                <div className="moss-tooltip__label">
                  <span className="moss-tooltip__letter">O</span>perations
                </div>
                <div className="moss-tooltip__label">
                  <span className="moss-tooltip__letter">S</span>ales
                </div>
                <div className="moss-tooltip__label">
                  <span className="moss-tooltip__letter">S</span>ystems
                </div>
              </div>
            </div>

            {/* Bottom Layout HUD */}
            <div
              ref={bottomBarRef}
              className="hidden w-full flex-col items-center justify-center pb-8 pointer-events-none select-none gap-4 md:flex md:flex-row md:justify-between md:pb-12"
              style={{ opacity: 0 }}
            >
              {/* Bottom Left: Scroll to explore */}
              <div
                className="hidden md:flex flex-col items-start gap-1 md:gap-2 text-[9px] md:text-xs font-mono text-[#71717a] tracking-widest cursor-pointer pointer-events-auto hover:text-black transition-colors duration-200"
                onClick={() => {
                  const introSection = document.getElementById("contact");
                  introSection?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span>SCROLL TO EXPLORE</span>
                <svg
                  className="w-3 h-3 md:w-4 md:h-4 text-[#71717a] animate-bounce mt-1"
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

              {/* Bottom Middle: Scrolling mouse capsule */}
              <div className="hidden md:flex flex-col items-center justify-center pointer-events-auto">
                <div className="w-6 h-10 rounded-full border border-zinc-300 flex justify-center p-1.5">
                  <div className="w-1 h-2 rounded-full bg-black animate-scroll-wheel" />
                </div>
              </div>

              {/* Bottom Right: Docs Button */}
              <a
                href="/docs"
                className="pointer-events-auto hidden items-center gap-2 px-6 py-3 border border-zinc-300 bg-white/60 backdrop-blur-md text-xs font-mono text-black tracking-widest hover:bg-black hover:text-white hover:border-black transition-all duration-300 rounded-none uppercase md:flex"
              >
                <span>DOCS ↗</span>
              </a>
            </div>

            {/* Mobile hero content uses normal flow to prevent overlap. */}
            <div className="flex flex-1 flex-col justify-between pb-6 pt-[18svh] pointer-events-auto md:hidden">
              <div>
                <h2
                  className="max-w-[18rem] text-[clamp(1.65rem,7.5vw,2.4rem)] leading-[0.95] uppercase text-black"
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 400,
                  }}
                >
                  <span className="editorial-word mr-[0.25em]">Young</span>
                  <span className="editorial-word mr-[0.25em]">
                    founders
                  </span>{" "}
                  building infra we wish existed.
                </h2>
                <h2
                  className="ml-auto mt-[24svh] max-w-[18rem] text-right text-[clamp(1.65rem,7.5vw,2.4rem)] leading-[0.95] uppercase text-black"
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 400,
                  }}
                >
                  Full-stack <span className="editorial-word">MOSS,</span>{" "}
                  essentially autonomous.
                </h2>
              </div>

              <div className="flex items-end justify-between gap-4 pt-8">
                <a
                  href="#intro"
                  className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500"
                >
                  Scroll to explore ↓
                </a>
                <a
                  href="/docs"
                  className="border border-black px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-black"
                >
                  Docs ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/10 md:hidden">
          <div className="flex h-full w-[min(78vw,360px)] flex-col rounded-r-[8px] bg-white px-8 pb-10 pt-7 text-black shadow-2xl">
            <div className="flex items-center justify-between">
              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-black"
              >
                <X size={28} strokeWidth={2.5} />
              </button>
              <span className="p-1 text-black" aria-hidden="true">
                <Search size={28} strokeWidth={2} />
              </span>
            </div>

            <nav
              aria-label="Mobile navigation"
              className="mt-14 flex flex-col gap-7 font-sans text-[1.35rem] leading-none tracking-[-0.03em]"
            >
              <a href="#services" onClick={() => setMobileMenuOpen(false)}>
                Events
              </a>
              <a href="#work" onClick={() => setMobileMenuOpen(false)}>
                Media
              </a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)}>
                Influencer Marketing
              </a>
              <a href="#work" onClick={() => setMobileMenuOpen(false)}>
                Tools
              </a>
              <a href="#intro" onClick={() => setMobileMenuOpen(false)}>
                About Us
              </a>
              <a href="#footer" onClick={() => setMobileMenuOpen(false)}>
                Contact Us
              </a>
            </nav>
          </div>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileMenuOpen(false)}
            className="flex-1 cursor-default"
          />
        </div>
      )}

      {/* Original Marquee right after Hero */}
      <Marquee />

      {/* Neo-Brutalist Portfolio Sections */}
      <Intro />
      <Services />
      <Manifesto />
      <WorkGallery />
      <Footer />
    </div>
  );
}
