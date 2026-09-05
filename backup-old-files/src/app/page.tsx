"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import CardNav from "@/components/CardNav";
import Marquee from "@/components/Marque";

import Intro from "@/components/NeoBrutalist/Intro";
import WorkGallery from "@/components/NeoBrutalist/WorkGallery";
import Process from "@/components/NeoBrutalist/Process";
import Manifesto from "@/components/NeoBrutalist/Manifesto";
import Team from "@/components/NeoBrutalist/Team";
import Services from "@/components/NeoBrutalist/Services";
import MarqueeSection from "@/components/NeoBrutalist/Marquee";
import StackCards from "@/components/NeoBrutalist/StackCards";

const logoPath = "/og.png";

const navItems = [
  {
    label: "AI Lead Gen",
    bgColor: "#1c1917",
    textColor: "#ffffff",
    links: [
      { label: "B2B Lead Scraper", href: "#contact" },
      { label: "Smart Verification", href: "#contact" },
      { label: "Intent Data Tracker", href: "#contact" }
    ]
  },
  {
    label: "AI Sales Automation",
    bgColor: "#09090b",
    textColor: "#ffffff",
    links: [
      { label: "Multi-channel Outreach", href: "#contact" },
      { label: "AI Dialers & Senders", href: "#contact" },
      { label: "CRM Copilot Integration", href: "#contact" }
    ]
  },
  {
    label: "SMM Automation",
    bgColor: "#27272a",
    textColor: "#ffffff",
    links: [
      { label: "Creative & Copy Gen", href: "#contact" },
      { label: "Auto-Pilot Poster", href: "#contact" },
      { label: "Community Growth AI", href: "#contact" }
    ]
  }
];

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const engineTextRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const leftHudRef = useRef<HTMLDivElement>(null);
  const rightHudRef = useRef<HTMLDivElement>(null);
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

    // Background ENGINE text — subtle counter-parallax for depth
    if (engineTextRef.current) {
      gsap.to(engineTextRef.current, {
        x: -x * 8,
        y: -y * 5,
        duration: 1.0,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (logoContainerRef.current) {
      gsap.to(logoContainerRef.current, {
        rotateY: 0, rotateX: 0, x: 0, y: 0,
        duration: 1.2, ease: "elastic.out(1, 0.5)", overwrite: "auto",
      });
    }
    if (engineTextRef.current) {
      gsap.to(engineTextRef.current, {
        x: 0, y: 0,
        duration: 1.2, ease: "elastic.out(1, 0.5)", overwrite: "auto",
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

      // 1. ENGINE text scales in from behind
      tl.fromTo(
        engineTextRef.current,
        { scale: 1.3, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.0, ease: "power4.out" },
        0.1
      );

      // 2. OG Logo punches forward from depth
      tl.fromTo(
        logoContainerRef.current,
        { scale: 0.6, opacity: 0, rotateX: 15 },
        { scale: 1, opacity: 1, rotateX: 0, duration: 1.2, ease: "power4.out" },
        0.3
      );

      // 3. Nav slides down
      tl.fromTo(navRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.4
      );

      // 4. Left HUD
      tl.fromTo(leftHudRef.current,
        { x: -25, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7 },
        0.55
      );

      // 5. Right HUD
      tl.fromTo(rightHudRef.current,
        { x: 25, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7 },
        0.65
      );

      // 6. Bottom bar
      tl.fromTo(bottomBarRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        0.75
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-zinc-800 relative">
      <div className="noise-overlay"></div>

      {/* SECTION 1: HERO */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col justify-between overflow-hidden px-6 lg:px-8 bg-black">

        {/* LAYER 1 (Back): "ENGINE" spray-paint text */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <div
            ref={engineTextRef}
            className="hero-engine-text"
            style={{ opacity: 0 }}
          >
            <img
              src="/engine-text.png"
              alt=""
              className="hero-engine-img"
              draggable={false}
            />
          </div>
        </div>

        {/* LAYER 2 (Front): OG Chrome Logo */}
        <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none" style={{ perspective: "1200px" }}>
          <div
            ref={logoContainerRef}
            className="hero-logo-container"
            style={{ opacity: 0, transformStyle: "preserve-3d", willChange: "transform" }}
          >
            <img
              src="/1.png"
              alt="OG Engine"
              className="hero-logo"
              draggable={false}
            />
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 flex-1 flex flex-col justify-between w-full pointer-events-none">
          {/* CardNav Top Header */}
          <div ref={navRef} className="pointer-events-auto" style={{ opacity: 0 }}>
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

          {/* Middle Layout HUD */}
          <div className="flex-1 flex items-center justify-between w-full px-4 lg:px-6 pointer-events-none select-none">
            {/* Left side pagination */}
            <div ref={leftHudRef} className="flex flex-col items-center gap-2 md:gap-4 text-[10px] md:text-xs font-mono text-[#a1a1aa] tracking-widest pointer-events-auto absolute md:relative top-1/2 md:top-auto -translate-y-1/2 md:translate-y-0 left-6 md:left-auto" style={{ opacity: 0 }}>
              <span className="text-[#ffffff] font-bold">01</span>
              <div className="w-[1px] h-16 md:h-32 bg-zinc-800 relative">
                <div className="absolute top-1 md:top-2 left-1/2 -translate-x-1/2 w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-white" />
              </div>
              <span>06</span>
            </div>

            {/* Right side engine bullet spec details */}
            <div ref={rightHudRef} className="flex flex-col items-start gap-3 md:gap-5 text-[8px] sm:text-[10px] md:text-xs font-mono tracking-widest text-[#a1a1aa] absolute md:relative top-28 md:top-auto right-6 md:right-auto" style={{ opacity: 0 }}>
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

          {/* Bottom Layout HUD */}
          <div ref={bottomBarRef} className="w-full flex flex-col md:flex-row items-center justify-center md:justify-between px-6 lg:px-8 pb-8 md:pb-12 pointer-events-none select-none gap-4 md:gap-0" style={{ opacity: 0 }}>
            {/* Bottom Left: Scroll to explore */}
            <div 
              className="flex flex-col items-start gap-1 md:gap-2 text-[9px] md:text-xs font-mono text-[#a1a1aa] tracking-widest cursor-pointer pointer-events-auto hover:text-white transition-colors duration-200 absolute md:relative bottom-24 md:bottom-auto left-6 md:left-auto"
              onClick={() => {
                const introSection = document.getElementById("contact");
                introSection?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span>SCROLL TO EXPLORE</span>
              <svg className="w-3 h-3 md:w-4 md:h-4 text-[#a1a1aa] animate-bounce mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            {/* Bottom Middle: Scrolling mouse capsule */}
            <div className="hidden md:flex flex-col items-center justify-center pointer-events-auto">
              <div className="w-6 h-10 rounded-full border border-zinc-700 flex justify-center p-1.5">
                <div className="w-1 h-2 rounded-full bg-white animate-scroll-wheel" />
              </div>
            </div>

            {/* Bottom Right: Docs Button */}
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

    {/* Original Marquee right after Hero */}
    <Marquee />

    {/* Neo-Brutalist Portfolio Sections */}
    <Intro />
    <Services />
    <Manifesto />
    <WorkGallery />

    {/* Pinned Stacking Transition Layout */}
    <StackCards />
    </div>
  );
}
