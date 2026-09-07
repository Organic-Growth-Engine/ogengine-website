"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  cat: string;
  year: string;
  img: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "L-VII",
    cat: "Sales",
    year: "2026",
    img: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "SM-XIII",
    cat: "Marketing",
    year: "2026",
    img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "L-XIV",
    cat: "Sales",
    year: "2027",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "CI-XIX",
    cat: "Marketing",
    year: "2027",
    img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "TBR",
    cat: "Experimental",
    year: "TBR",
    img: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=2616&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "MA-I",
    cat: "Marketing",
    year: "2027",
    img: "https://images.unsplash.com/photo-1515462277126-2dd0c162007a?q=80&w=2670&auto=format&fit=crop",
  },
];

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div className="group cursor-pointer">
      <div className="work-card-inner relative overflow-hidden aspect-[4/5] mb-6">
        <img
          src={project.img}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-white/20 group-hover:opacity-0 transition-opacity duration-500"></div>
      </div>
      <div className="flex justify-between items-end border-b border-black/15 pb-4">
        <div>
          <h3 className="text-4xl md:text-5xl font-heading mb-1">
            {project.title}
          </h3>
          <span className="text-sm font-mono text-zinc-500">{project.cat}</span>
        </div>
        <span className="text-sm font-mono">{project.year}</span>
      </div>
    </div>
  );
};

export default function WorkGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect: Left column moves slower, Right column moves faster
      if (window.innerWidth > 768) {
        gsap.to(leftColRef.current, {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });

        gsap.to(rightColRef.current, {
          yPercent: -15,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      // Card reveals — use toggleActions (not scrub) so mobile touch momentum isn't held
      gsap.utils.toArray(".work-card-inner").forEach((card: any) => {
        gsap.fromTo(
          card,
          { scale: 0.92, opacity: 0, y: 30 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none reverse",
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
      id="work"
      className="relative bg-white text-black pt-24 pb-48 md:pb-72 overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-24 flex flex-col items-center text-center">
          <h2 className="text-[12vw] leading-[0.8] font-heading font-black text-black z-10">
            AUTOMATION
          </h2>
          <h2 className="text-[10vw] leading-[0.8] font-heading font-black text-[#DC2626] z-10 -mt-4 md:-mt-10">
            TOOLS SUITE
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24 px-4 md:px-12">
          {/* Left Column - Starts normal, moves down slowly */}
          <div
            ref={leftColRef}
            className="flex flex-col gap-16 md:gap-32 pt-0 md:pt-24"
          >
            {projects
              .filter((_, i) => i % 2 === 0)
              .map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
          </div>

          {/* Right Column - Starts lower, moves up faster */}
          <div
            ref={rightColRef}
            className="flex flex-col gap-16 md:gap-32 md:translate-y-24"
          >
            {projects
              .filter((_, i) => i % 2 !== 0)
              .map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
