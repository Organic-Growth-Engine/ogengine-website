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
    img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000",
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
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2000",
    desc: "Your growth engine should get smarter over time. Every campaign, customer and conversion creates valuable data. We turn those insights into actions continuously improving your marketing, sales and operations so your business becomes more efficient and more profitable.",
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = useState(services[0].img);
  const [openIndex, setOpenIndex] = useState<number | null>(null); // starts collapsed

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Setup reveal element centering
      gsap.set(revealRef.current, { xPercent: -50, yPercent: -50 });

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

      // Mouse Move Effect for Image Reveal
      const moveReveal = (e: MouseEvent) => {
        if (!revealRef.current) return;

        gsap.to(revealRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      window.addEventListener("mousemove", moveReveal);
      return () => window.removeEventListener("mousemove", moveReveal);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseEnter = (img: string) => {
    setActiveImage(img);
    gsap.to(revealRef.current, { scale: 1, opacity: 1, duration: 0.3 });
  };

  const handleMouseLeave = () => {
    gsap.to(revealRef.current, { scale: 0, opacity: 0, duration: 0.3 });
  };

  return (
    <section
      ref={sectionRef}
      id="services"
      className="py-24 bg-white text-[#0a0a0a] relative z-10 overflow-hidden"
    >
      {/* Floating Reveal Image - Fixed position relative to viewport */}
      <div
        ref={revealRef}
        className="fixed top-0 left-0 w-[300px] h-[400px] pointer-events-none z-50 opacity-0 scale-0 hidden md:block rounded-lg overflow-hidden mix-blend-exclusion"
        style={{ willChange: "transform" }}
      >
        <img
          src={activeImage}
          alt="Service Preview"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start mb-20">
          <h2 className="text-6xl md:text-8xl font-bold mb-8 md:mb-0 font-heading">
            Our
            <br />
            Infrastructure
          </h2>
          <p className="max-w-xs text-sm uppercase tracking-wide text-zinc-500 pt-4 font-mono">
            Comprehensive design solutions for forward-thinking brands.
          </p>
        </div>

        <ul ref={listRef} className="border-t border-zinc-300">
          {services.map((service, idx) => (
            <li
              key={service.id}
              className="group border-b border-zinc-300 relative overflow-hidden cursor-pointer"
              onMouseEnter={() => {
                handleMouseEnter(service.img);
              }}
              onMouseLeave={handleMouseLeave}
              onClick={() => {
                setOpenIndex(openIndex === idx ? null : idx);
              }}
            >
              <div className="relative z-10 flex justify-between items-center py-12 px-4 group-hover:px-8 transition-all duration-500">
                <div className="flex items-baseline gap-8">
                  <span className="text-xs font-mono text-zinc-400 group-hover:text-black transition-colors">
                    0{service.id}
                  </span>
                  <h3 className="text-3xl md:text-5xl group-hover:text-black transition-colors group-hover:translate-x-4 duration-500">
                    {service.title}
                  </h3>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs uppercase tracking-widest opacity-0 md:opacity-100 group-hover:text-black transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-75">
                    {service.category}
                  </span>
                  <ArrowUpRight
                    className={`w-8 h-8 text-zinc-400 transition-all duration-500 ${openIndex === idx ? "text-black rotate-90" : "group-hover:text-black group-hover:rotate-45"}`}
                  />
                </div>
              </div>

              {/* Dropdown Paragraph container */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-out ${openIndex === idx ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"}`}
              >
                <div className="pb-12 pl-4 pr-4 md:pl-[120px] max-w-3xl">
                  <p className="text-lg md:text-xl leading-relaxed font-light text-zinc-400">
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
