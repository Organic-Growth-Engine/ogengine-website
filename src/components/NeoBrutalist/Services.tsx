"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: 1,
    title: "Validate and Position",
    category: "Strategy",
    desc: "Before you build, know what is worth building. Every strong business starts with clarity. We turn ideas into validated opportunities by understanding the market, the competition, the audience and where your business can claim a meaningful position.",
  },
  {
    id: 2,
    title: "Build the Foundation",
    category: "Design",
    desc: "Before you build, know what is worth building. Every strong business starts with clarity. We turn ideas into validated opportunities by understanding the market, the competition, the audience and where your business can claim a meaningful position.",
  },
  {
    id: 3,
    title: "Create and Attract",
    category: "Content",
    desc: "Before you build, know what is worth building. Every strong business starts with clarity. We turn ideas into validated opportunities by understanding the market, the competition, the audience and where your business can claim a meaningful position.",
  },
  {
    id: 4,
    title: "Acquire and Convert",
    category: "Development",
    desc: "Before you build, know what is worth building. Every strong business starts with clarity. We turn ideas into validated opportunities by understanding the market, the competition, the audience and where your business can claim a meaningful position.",
  },
  {
    id: 5,
    title: "Nurture and Close",
    category: "Marketing",
    desc: "Before you build, know what is worth building. Every strong business starts with clarity. We turn ideas into validated opportunities by understanding the market, the competition, the audience and where your business can claim a meaningful position.",
  },
  {
    id: 6,
    title: "Learn and Improve",
    category: "Marketing",
    desc: "Your growth engine should get smarter over time. Every campaign, customer and conversion creates valuable data. We turn those insights into actions continuously improving your marketing, sales and operations so your business becomes more efficient and more profitable.",
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null); // starts collapsed

  useEffect(() => {
    const ctx = gsap.context(() => {
      // List Item Reveal
      const items = listRef.current?.children;
      if (items) {
        Array.from(items).forEach((item) => {
          gsap.fromTo(
            item,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              scrollTrigger: {
                trigger: item,
                start: "top 95%",
                toggleActions: "play reverse play reverse",
              },
            },
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative z-10 overflow-hidden bg-white py-16 text-[#0a0a0a] sm:py-20 lg:py-24"
    >
      <div className="container mx-auto relative z-10">
        <div className="mb-14 flex flex-col items-start justify-between sm:mb-16 md:mb-20 md:flex-row">
          <h2 className="mb-6 font-heading text-[clamp(2.75rem,10vw,5.5rem)] font-bold leading-[0.9] sm:mb-8 md:mb-0 lg:text-8xl">
            Our
            <br />
            Infrastructure
          </h2>
          {/* <p className="max-w-xs text-sm uppercase tracking-wide text-zinc-500 pt-4 font-mono">
            Comprehensive design solutions for forward-thinking brands.
          </p> */}
        </div>

        <ul ref={listRef} className="border-t border-zinc-300">
          {services.map((service, idx) => (
            <li
              key={service.id}
              className="group border-b border-zinc-300 relative overflow-hidden cursor-pointer"
              onClick={() => {
                setOpenIndex(openIndex === idx ? null : idx);
              }}
            >
              <div className="relative z-10 flex items-center justify-between gap-4 px-2 py-7 transition-all duration-500 group-hover:px-3 sm:gap-6 sm:px-4 sm:py-9 md:py-12 md:group-hover:px-8">
                <div className="flex min-w-0 items-baseline gap-3 sm:gap-6 md:gap-8">
                  <span className="shrink-0 text-xs font-mono text-zinc-400 transition-colors group-hover:text-black">
                    0{service.id}
                  </span>
                  <h3 className="min-w-0 text-[clamp(1.25rem,5vw,2rem)] leading-tight transition-colors duration-500 group-hover:text-black sm:text-3xl md:text-4xl lg:text-5xl md:group-hover:translate-x-4">
                    {service.title}
                  </h3>
                </div>

                <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                  <span className="hidden text-xs uppercase tracking-widest transition-all duration-500 group-hover:text-black md:block md:translate-y-4 md:opacity-100 md:group-hover:translate-y-0">
                    {service.category}
                  </span>
                  <ArrowUpRight
                    className={`h-6 w-6 shrink-0 text-zinc-400 transition-all duration-500 sm:h-7 sm:w-7 md:h-8 md:w-8 ${openIndex === idx ? "rotate-90 text-black" : "group-hover:rotate-45 group-hover:text-black"}`}
                  />
                </div>
              </div>

              {/* Dropdown Paragraph container */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-out ${openIndex === idx ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
              >
                <div className="max-w-3xl pb-8 pl-10 pr-4 sm:pb-10 sm:pl-16 md:pb-12 md:pl-[120px]">
                  <p className="text-sm font-light leading-relaxed text-zinc-400 sm:text-base md:text-lg lg:text-xl">
                    {service.desc}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
