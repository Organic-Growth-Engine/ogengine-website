"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Intro() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray(".intro-line-wrap");

      lines.forEach((line: any) => {
        gsap.fromTo(
          line.querySelectorAll(".char"),
          { y: 100, opacity: 0, rotateX: -90 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            stagger: { each: 0.02 },
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: line,
              start: "top 80%",
              toggleActions: "play reverse play reverse",
            },
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-32 md:py-56 bg-white text-[#0a0a0a] overflow-hidden px-4 sm:px-6 lg:px-8"
    >
      <div className="container mx-auto">
        <div className="flex flex-col text-[7vw] md:text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.1] font-heading uppercase font-bold tracking-tight">
          <div className="intro-line-wrap overflow-hidden flex flex-wrap items-baseline gap-4">
            <span className="char">From</span>
            <span className="char font-serif italic font-light text-zinc-400 lowercase">
              first idea
            </span>
            <span className="char">to</span>
          </div>

          <div className="intro-line-wrap overflow-hidden flex flex-wrap items-baseline gap-4 pl-[5vw]">
            <span className="char text-[#C98A2E]">Loyal</span>
            <span className="char">customer.</span>
          </div>

          <div className="intro-line-wrap overflow-hidden flex flex-wrap items-baseline gap-4">
            <span className="char">One</span>
            <span className="char font-serif italic font-light text-black lowercase">
              Connected
            </span>
            <span className="char">System.</span>
          </div>
        </div>

        <div className="mt-32 w-full flex justify-end">
          <div className="w-full md:w-2/5 lg:w-1/3 text-base md:text-lg lg:text-xl font-light text-zinc-500 font-mono leading-relaxed border-l border-zinc-300 pl-8">
            <p>
              OG is built to solve,{" "}
              <span className="text-black italic font-serif">
                the whole puzzle
              </span>
              . so that nothing is missed in the MOSS lifecycles.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
