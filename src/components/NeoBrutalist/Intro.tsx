'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AsciiScramble from './AsciiScramble';

gsap.registerPlugin(ScrollTrigger);

export default function Intro() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = gsap.utils.toArray('.intro-line-wrap');
      
      lines.forEach((line: any) => {
        gsap.fromTo(line.querySelectorAll('.char'), 
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
            }
          }
        );
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 md:py-56 bg-[#050505] text-[#f4f4f4] overflow-hidden px-4">
      <div className="container mx-auto">
        
        <div className="flex flex-col text-[7vw] md:text-[6vw] leading-[1.1] font-heading uppercase font-bold tracking-tight">
          
          <div className="intro-line-wrap overflow-hidden flex flex-wrap items-baseline gap-4">
             <AsciiScramble text="We" className="char" />
             <AsciiScramble text="don't just" className="char font-serif italic font-light text-gray-400 lowercase" />
             <AsciiScramble text="build" className="char" />
          </div>

          <div className="intro-line-wrap overflow-hidden flex flex-wrap items-baseline gap-4 pl-[5vw]">
             <AsciiScramble text="Digital" className="char stroke-text text-transparent" />
             <AsciiScramble text="Experiences." className="char" />
          </div>

          <div className="intro-line-wrap overflow-hidden flex flex-wrap items-baseline gap-4">
             <AsciiScramble text="We" className="char" />
             <AsciiScramble text="engineer" className="char font-serif italic font-light text-white lowercase" />
             <AsciiScramble text="Cults." className="char" />
          </div>

        </div>

        <div className="mt-32 w-full flex justify-end">
          <div className="w-full md:w-1/3 text-lg md:text-xl font-light text-gray-400 font-mono leading-relaxed border-l border-gray-800 pl-8">
            <p>
              In the age of templates, <span className="text-white italic font-serif">chaos is currency</span>. We strip away the non-essential to reveal the raw, beating heart of your brand.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
