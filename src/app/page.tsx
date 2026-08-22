"use client";

import { useState, useEffect } from "react";
import CardNav from "@/components/CardNav";
import Marquee from "@/components/Marque";
import dynamic from "next/dynamic";
import { soundManager } from "@/lib/sound";

import Intro from "@/components/NeoBrutalist/Intro";
import WorkGallery from "@/components/NeoBrutalist/WorkGallery";
import Process from "@/components/NeoBrutalist/Process";
import Manifesto from "@/components/NeoBrutalist/Manifesto";
import Team from "@/components/NeoBrutalist/Team";
import Services from "@/components/NeoBrutalist/Services";
import MarqueeSection from "@/components/NeoBrutalist/Marquee";
import StackCards from "@/components/NeoBrutalist/StackCards";

const Main = dynamic(() => import("@/components/Main").then((mod) => mod.Main), {
  ssr: false,
});


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
  const [bootState, setBootState] = useState<'loading' | 'ready' | 'booted'>('loading');
  const [isRumbling, setIsRumbling] = useState(false);
  const [isIgniting, setIsIgniting] = useState(false);
  const [rpm, setRpm] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBootState('ready');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (bootState !== 'booted') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [bootState]);

  // Simulate tachometer RPM surge when engine is cranked
  useEffect(() => {
    if (!isRumbling) {
      setRpm(0);
      return;
    }

    let currentRpm = 0;
    const interval = setInterval(() => {
      // 0s-0.75s: Starter motor cranks slowly (up to 600 RPM)
      // 0.75s+: Cylinder ignition rev-up surges to redline (7500 RPM)
      if (currentRpm < 600) {
        currentRpm += 120;
      } else {
        currentRpm += Math.floor(Math.random() * 400) + 600;
      }

      if (currentRpm >= 7500) {
        currentRpm = 7500;
        clearInterval(interval);
      }
      setRpm(currentRpm);
    }, 60);

    return () => clearInterval(interval);
  }, [isRumbling]);

  const handleBoot = () => {
    soundManager.playBootSound();
    setIsRumbling(true);
    setIsIgniting(true);

    // Turn off fire spark glow after 700ms (combustion settles into steady high revs)
    setTimeout(() => {
      setIsIgniting(false);
    }, 700);
    
    // Animate the engine startup chugging/rev sequence before unmounting the screen loader
    setTimeout(() => {
      setBootState('booted');
      setIsRumbling(false);
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-zinc-800 relative">
      {bootState !== 'booted' && (
        <div className="fixed inset-0 bg-[#050505] z-[9999] flex flex-col justify-between font-mono p-4 md:p-12 text-zinc-500 select-none">
          
          {/* Margin decorators - Left */}
          <div className="fixed left-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 text-zinc-700 text-[10px] select-none pointer-events-none hidden lg:flex">
            <span className="font-bold">+</span>
            <span className="font-bold">+</span>
            <span className="font-bold">+</span>
            <div className="w-[1px] h-32 border-l border-dashed border-zinc-800 mt-2" />
          </div>

          {/* Margin decorators - Right */}
          <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center select-none pointer-events-none hidden lg:flex">
            <div className="w-[1px] h-32 border-l border-dashed border-zinc-800 relative flex items-center justify-center">
              <div className="absolute w-1 h-1 rounded-full bg-zinc-400" />
              <div className="absolute text-zinc-800 text-[10px] translate-y-16">┼</div>
            </div>
          </div>

          {/* Top Bar Row */}
          <div className="flex justify-between text-[8px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.25em] text-zinc-500">
            <span>OG ENGINE v1.0.0</span>
            <span className="sm:hidden">SYSTEM: ONLINE</span>
            <span className="hidden sm:inline">INITIALIZING CORE SYSTEMS</span>
          </div>

          {/* Central Terminal Console Panel */}
          <div className={`w-full max-w-4xl mx-auto border border-zinc-900 bg-black/40 backdrop-blur-sm p-6 md:p-12 relative flex flex-col justify-start md:justify-between h-auto md:h-[60vh] gap-6 md:gap-0 transition-all duration-300 ${isRumbling ? 'animate-rumble border-white/40 shadow-[0_0_40px_rgba(255,255,255,0.06)]' : ''}`}>
            
            {/* Corner Bracket Glyphs */}
            <span className="absolute top-2 left-3 text-zinc-700 text-sm">┌</span>
            <span className="absolute top-2 right-3 text-zinc-700 text-sm">┐</span>
            <span className="absolute bottom-2 left-3 text-zinc-700 text-sm">└</span>
            <span className="absolute bottom-2 right-3 text-zinc-700 text-sm">┘</span>

            {/* Fire Ignition Spark Flash Overlay inside console box */}
            <div 
              className={`absolute inset-0 bg-gradient-to-br from-orange-600/25 via-red-600/30 to-yellow-500/15 pointer-events-none transition-opacity duration-500 ease-out z-10 ${isIgniting ? 'opacity-100' : 'opacity-0'}`} 
            />

            {/* Split row content */}
            <div className="flex flex-col md:flex-row justify-between items-stretch flex-1 pt-4 relative z-20 gap-6 md:gap-0">
              
              {/* Left Column: Diagnostics logs */}
              <div className="w-full md:w-[50%] flex flex-col justify-center text-left text-[10px] md:text-[11px] text-zinc-400 space-y-[6px] font-mono tracking-wider leading-relaxed">
                <p>&gt; ENGINE CONTROL UNIT ...... ONLINE</p>
                <p>&gt; SPARK TIMING ............. CALIBRATED</p>
                <p>&gt; FUEL INJECTION ........... PRESSURIZED</p>
                <p>&gt; CRANKSHAFT ............... LOCKED</p>
                <p>&gt; CAMSHAFT ................. SYNCHRONIZED</p>
                <p>&gt; TORQUE OUTPUT ............ NOMINAL</p>
                <p>&gt; POWERTRAIN ............... READY</p>
                <p className="pt-4 text-white font-bold tracking-widest">
                  &gt; STATUS : {isRumbling ? 'SPARK IGNITION ARCS ACTIVE' : 'MACHINE READY'}
                </p>
              </div>

              {/* Vertical Divider */}
              <div className="w-[1px] bg-zinc-855 self-stretch my-2 hidden md:block mx-8" />

              {/* Right Column: User's custom 2D logo */}
              <div className="flex-none md:flex-1 flex items-center justify-center py-3 md:py-0">
                <img 
                  src="/og.png" 
                  alt="OG Logo" 
                  className="max-h-[105px] md:max-h-[240px] max-w-[170px] md:max-w-[350px] object-contain opacity-95"
                />
              </div>
            </div>

            {/* Bottom Section: Progress Bar / Button */}
            <div className="w-full mt-4 relative z-20 h-16 flex items-center">
              {isRumbling ? (
                <div className="space-y-2 w-full">
                  <div className="w-full flex items-center justify-between gap-4 font-mono">
                    <div className="flex-1 h-5 border border-zinc-850 p-[2px] bg-zinc-950">
                      <div 
                        className="h-full"
                        style={{
                          width: `${(rpm / 7500) * 100}%`,
                          background: 'repeating-linear-gradient(90deg, #ffffff, #ffffff 3px, #000000 3px, #000000 6px)'
                        }}
                      />
                    </div>
                    <span className="text-white text-xs font-bold w-10 text-right">
                      {Math.min(100, Math.floor((rpm / 7500) * 100))}%
                    </span>
                  </div>
                  <div className="text-[9px] text-zinc-500 tracking-[0.2em] uppercase text-left">
                    LOADING ENGINE MODULES...
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleBoot}
                  className="w-full py-4 bg-red-700 text-white font-mono uppercase text-xs tracking-[0.25em] font-black border border-red-600 hover:bg-white hover:text-black hover:border-white transition-all duration-200 cursor-pointer shadow-[4px_4px_0px_0px_#3f0000] hover:shadow-[4px_4px_0px_0px_#ef4444] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                  [ START ENGINE ]
                </button>
              )}
            </div>

          </div>

          {/* Bottom Bar Row */}
          <div className="flex justify-between text-[8px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.25em] text-zinc-500">
            <span>OG ENGINE</span>
            <span className="hidden sm:inline">BUILT FOR CREATORS</span>
            <span>OGENGINE.COM</span>
          </div>

        </div>
      )}
      
      <div className="noise-overlay"></div>
      {/* SECTION 1: HERO */}
      <section className="relative min-h-screen flex flex-col justify-between overflow-hidden px-6 lg:px-8 bg-black">
        {/* Ball of Glass Interactive 3D Canvas Background */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <Main />
          {/* Subtle dark vignette blend overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-black/10 to-black/35 pointer-events-none" />
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 flex-1 flex flex-col justify-between w-full pointer-events-none">
          {/* CardNav Top Header */}
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

          {/* Middle Layout HUD */}
          <div className="flex-1 flex items-center justify-between w-full px-4 lg:px-6 pointer-events-none select-none">
            {/* Left side pagination */}
            <div className="flex flex-col items-center gap-2 md:gap-4 text-[10px] md:text-xs font-mono text-[#a1a1aa] tracking-widest pointer-events-auto absolute md:relative top-1/2 md:top-auto -translate-y-1/2 md:translate-y-0 left-6 md:left-auto">
              <span className="text-[#ffffff] font-bold">01</span>
              <div className="w-[1px] h-16 md:h-32 bg-zinc-800 relative">
                {/* Active indicator dot */}
                <div className="absolute top-1 md:top-2 left-1/2 -translate-x-1/2 w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-white" />
              </div>
              <span>06</span>
            </div>

            {/* Right side engine bullet spec details */}
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

          {/* Bottom Layout HUD */}
          <div className="w-full flex flex-col md:flex-row items-center justify-center md:justify-between px-6 lg:px-8 pb-8 md:pb-12 pointer-events-none select-none gap-4 md:gap-0">
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
                {/* Scroll wheel dot animation */}
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
