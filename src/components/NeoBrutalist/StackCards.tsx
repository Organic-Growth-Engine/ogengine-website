"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ContactForm from "./ContactForm";
import Footer from "./Footer";

gsap.registerPlugin(ScrollTrigger);

export default function StackCards() {
  const stackRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>(".stack-section");
    if (sections.length < 2) return;

    const footerHeight = footerRef.current?.offsetHeight || 0;
    const isMobileView = window.innerWidth < 768;

    // Optimized parameters for smoother mobile experience
    const pinMultiplier = isMobileView ? 1.0 : 2.0;
    const scrubValue = isMobileView ? 0.3 : 0.6;
    const footerDuration = isMobileView ? 1.0 : 1.8;

    // Initially disable pointer events on the absolutely positioned footer.
    gsap.set(sections[1], { pointerEvents: "none" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stackRef.current,
        start: "bottom bottom",
        end: `+=${window.innerHeight * pinMultiplier + footerHeight}`,
        scrub: scrubValue,
        pin: true,
        anticipatePin: 1,
      },
    });

    // Footer slides up fully in stack animation
    tl.fromTo(
      sections[1],
      { y: footerHeight, pointerEvents: "none" },
      {
        y: 0,
        pointerEvents: "auto",
        duration: footerDuration,
      },
    );

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={stackRef} className="relative w-full bg-white">
      {/* 1. ContactForm dictates the container's natural height and flows normally */}
      <section className="stack-section relative z-10 w-full bg-white">
        <ContactForm />
      </section>

      {/* 2. Footer follows ContactForm directly and fills the viewport width. */}
      <section ref={footerRef} className="stack-section relative z-20 w-full">
        <Footer />
      </section>
    </div>
  );
}
